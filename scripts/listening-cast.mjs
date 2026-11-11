import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const thorsten='thorsten';
const kerstin='kerstin';

const unitCast={
  'unit-tanisma':[thorsten,kerstin,thorsten], // Amir, Eva, Amir
  'unit-sayilar':[thorsten,kerstin,thorsten,kerstin],
  'unit-aile':[kerstin,thorsten,kerstin,thorsten],
  'unit-kurs':[thorsten,kerstin,thorsten,kerstin],
  'unit-saat':[kerstin,thorsten,kerstin,thorsten],
  'unit-alisveris':[thorsten,kerstin,thorsten,kerstin],
  'unit-ev':[kerstin,thorsten,kerstin,thorsten],
  'unit-ulasim':[thorsten,kerstin,thorsten,kerstin],
  'unit-hobiler':[kerstin,thorsten,kerstin,thorsten],
  'unit-is':[thorsten,kerstin,thorsten,kerstin], // The second speaker is the Verkäuferin.
  'unit-giyim':[kerstin,thorsten,kerstin,thorsten],
  'unit-hizmet':[thorsten,kerstin,thorsten,kerstin],
  'unit-saglik':[kerstin,thorsten,kerstin,thorsten],
  'unit-kurallar':[thorsten,kerstin,thorsten,kerstin],
  'unit-gecmis':[kerstin,thorsten,kerstin,thorsten],
  'unit-davet':[thorsten,kerstin,thorsten,kerstin],
};

const exerciseCast={
  'listen-2':[kerstin], // Nora
  'listen-4':[kerstin,thorsten], // Customer, vendor
  'listen-5':[thorsten,kerstin], // The person suggesting a time, the person accepting it
  'listen-19':[kerstin], // Jana
  'listen-21':[kerstin], // Kundin
  'listen-22':[kerstin], // Sofia
  'listen-23':[kerstin], // Mother
  'listen-24':[kerstin], // Sara
  'listen-b-1':[kerstin,thorsten,kerstin],
  'listen-b-2':[thorsten,kerstin,thorsten,kerstin], // The woman orders the tea.
  'listen-b-3':[kerstin,thorsten,kerstin],
  'listen-b-4':[thorsten,kerstin,thorsten],
  'listen-b-5':[kerstin,thorsten,kerstin,thorsten], // The man buys the jacket.
  'listen-b-6':[thorsten,kerstin,thorsten],
  'listen-b-11':[kerstin], // Frau Jung
  'listen-b-13':[kerstin], // Mila
};

const lessonExamples=[
  ['tanisma',0,kerstin], // Elif
  ['is',0,kerstin], // Köchin
];

const appDirectory=resolve(process.argv[2]||'.');
const load=filename=>import(pathToFileURL(resolve(appDirectory,'data',filename)).href);
const [{listening},{moreListening},{unitAudio},{lessons}]=await Promise.all(
  ['tasks.js','extra.js','unit-tasks.js','course.js'].map(load)
);

function track(id,segments,voices){
  if(!voices||voices.length!==segments.length||segments.some(text=>!text.trim()))throw new Error(`Invalid speaker assignment for ${id}`);
  return {id,turns:segments.map((text,index)=>({voice:voices[index],text}))};
}

const tracks=[
  ...[...listening,...moreListening].map(({id,segments})=>track(id,segments,exerciseCast[id]||(segments.length===1?[thorsten]:null))),
  ...unitAudio.map(([path,segments])=>{
    const id=path.split('/').at(-1).replace(/\.mp3$/,'');
    return track(id,segments,unitCast[id]);
  }),
  ...lessonExamples.map(([topic,index,voice])=>track(
    `example-${topic}-${index}`,[lessons.find(lesson=>lesson.id===topic).examples[index][0]],[voice]
  )),
];

process.stdout.write(JSON.stringify(tracks));
