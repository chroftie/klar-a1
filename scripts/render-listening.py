"""Render listening tracks using the app's transcripts and explicit voice assignments."""
import argparse
import io
import json
from pathlib import Path
import subprocess
import unicodedata
import wave

import numpy as np
from piper import PiperVoice, SynthesisConfig

SAMPLE_RATE = 22050
MODEL_FILES = {
    "thorsten": "de_DE-thorsten-medium.onnx",
    "kerstin": "de_DE-kerstin-low.onnx",
}


def load_voice(model):
    voice = PiperVoice.load(model)
    ids = voice.config.phoneme_id_map
    palatal = unicodedata.normalize("NFD", "ç")
    # Older German models store /ç/ as one symbol. Match eSpeak's decomposed output.
    if "ç" in ids and "\u0327" not in ids:
        voice.config.phoneme_id_map = {**ids, palatal: ids["ç"]}
        voice.config.vowel_clusters = (voice.config.vowel_clusters or set()) | {tuple(palatal)}
    return voice


def render(track, voices):
    turns = track["turns"]
    output = io.BytesIO()
    config = SynthesisConfig(length_scale=1.07, noise_scale=0.5, noise_w_scale=0.333)
    with wave.open(output, "wb") as wav:
        wav.setparams((1, 2, SAMPLE_RATE, 0, "NONE", "not compressed"))
        for index, turn in enumerate(turns):
            if index:
                wav.writeframes(bytes(SAMPLE_RATE))
            for chunk in voices[turn["voice"]].synthesize(turn["text"], syn_config=config):
                samples = np.frombuffer(chunk.audio_int16_bytes, dtype="<i2")
                if chunk.sample_rate != SAMPLE_RATE and len(samples):
                    positions = np.arange(round(len(samples) * SAMPLE_RATE / chunk.sample_rate))
                    positions = positions * chunk.sample_rate / SAMPLE_RATE
                    samples = np.interp(positions, np.arange(len(samples)), samples).astype("<i2")
                wav.writeframes(samples.tobytes())
    return output.getvalue()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--app", type=Path, default=Path.cwd())
    parser.add_argument("--models", type=Path, required=True)
    parser.add_argument("tracks", nargs="*", help="Audio basenames without .mp3. Defaults to all tracks.")
    args = parser.parse_args()

    cast = Path(__file__).with_name("listening-cast.mjs")
    tracks = json.loads(subprocess.check_output(["node", str(cast), str(args.app)]))
    by_id = {track["id"]: track for track in tracks}
    missing = set(args.tracks) - by_id.keys()
    if missing:
        parser.error(f"Unknown tracks: {', '.join(sorted(missing))}")
    selected = [by_id[track_id] for track_id in args.tracks] if args.tracks else tracks
    voices = {name: load_voice(args.models / file) for name, file in MODEL_FILES.items()}

    for track in selected:
        filename = args.app / "assets" / "audio" / f'{track["id"]}.mp3'
        temporary = filename.with_suffix(".tmp.mp3")
        try:
            subprocess.run([
                "ffmpeg", "-hide_banner", "-loglevel", "error", "-f", "wav", "-i", "pipe:0",
                "-codec:a", "libmp3lame", "-b:a", "48k", "-y", str(temporary),
            ], input=render(track, voices), check=True)
            temporary.replace(filename)
        finally:
            temporary.unlink(missing_ok=True)
        print(filename.name, flush=True)


if __name__ == "__main__":
    main()
