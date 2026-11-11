const CACHE_PREFIX='klar-a1-';
const CACHE_NAME=CACHE_PREFIX+'20261111-2';
const CORE=[
  './','./index.html','./styles.css','./theme.js','./app.js','./session.js','./study.js','./device.js','./ui.js',
  './data/course.js','./data/words.js','./data/tasks.js','./data/extra.js','./data/vocab-quiz.js','./data/drills.js',
  './manifest.webmanifest','./assets/fonts.css','./assets/bricolage.woff2','./assets/bricolage-ext.woff2',
  './assets/dm-sans.woff2','./assets/dm-sans-ext.woff2','./assets/icons.woff2','./assets/berlin.webp',
  './assets/icon-180.png','./assets/icon-192.png','./assets/icon-512.png',
];
const topics=['tanisma','aile','kurs','alisveris','saat','ev','ulasim','is','saglik','gecmis','giyim','davet'];
const countPaths=(name,count)=>Array.from({length:count},(_,i)=>`./assets/audio/${name}-${i+1}.mp3`);
const audio=[...countPaths('listen',24),...countPaths('listen-b',15),...countPaths('word',244),...countPaths('dictation',12),
  ...topics.flatMap(topic=>[0,1,2].map(i=>`./assets/audio/example-${topic}-${i}.mp3`))];

self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE_NAME);
    await cache.addAll(CORE.map(path=>new Request(path,{cache:'reload'})));
    for(let i=0;i<audio.length;i+=18)await cache.addAll(audio.slice(i,i+18).map(path=>new Request(path,{cache:'reload'})));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    await Promise.all((await caches.keys()).filter(key=>key.startsWith(CACHE_PREFIX)&&key!==CACHE_NAME).map(key=>caches.delete(key)));
    await self.clients.claim();
  })());
});

async function audioRange(response,range){
  const match=/^bytes=(\d*)-(\d*)$/.exec(range);
  if(!match||!match[1]&&!match[2])return response;
  const data=await response.arrayBuffer();
  const start=match[1]?Number(match[1]):Math.max(0,data.byteLength-Number(match[2]));
  const end=match[1]&&match[2]?Math.min(data.byteLength-1,Number(match[2])):data.byteLength-1;
  if(start>end||start>=data.byteLength)return new Response(null,{status:416,headers:{'Content-Range':`bytes */${data.byteLength}`}});
  return new Response(data.slice(start,end+1),{status:206,headers:{
    'Content-Type':'audio/mpeg','Accept-Ranges':'bytes','Content-Length':end-start+1,
    'Content-Range':`bytes ${start}-${end}/${data.byteLength}`,
  }});
}
self.addEventListener('fetch',event=>{
  const request=event.request;
  const url=new URL(request.url);
  if(request.method!=='GET'||url.origin!==self.location.origin||!url.href.startsWith(self.registration.scope))return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE_NAME);
    if(request.mode==='navigate'){
      const root=new URL(self.registration.scope);
      if(url.pathname===root.pathname||url.pathname===root.pathname+'index.html')return (await cache.match('./index.html'))||fetch(request);
      return fetch(request);
    }
    const cached=await cache.match(request,{ignoreSearch:true});
    if(!cached)return fetch(request);
    const range=request.headers.get('Range');
    return range&&url.pathname.endsWith('.mp3')?audioRange(cached,range):cached;
  })());
});
