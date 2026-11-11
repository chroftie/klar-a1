let database;
function open(){
  if(!database) database=new Promise((resolve,reject)=>{
    const request=indexedDB.open('klar-device-v1',1);
    request.onupgradeneeded=()=>request.result.createObjectStore('files');
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error);
  });
  return database;
}
async function run(mode,operation){
  const db=await open();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction('files',mode);
    const request=operation(tx.objectStore('files'));
    tx.oncomplete=()=>resolve(request.result);
    tx.onabort=()=>reject(tx.error||new Error('Dosya işlemi tamamlanamadı.'));
  });
}
export const readDevice=key=>run('readonly',store=>store.get(key));
export const writeDevice=(key,value)=>run('readwrite',store=>store.put(value,key));
export const deleteDevice=key=>run('readwrite',store=>store.delete(key));
export const deviceKeys=()=>run('readonly',store=>store.getAllKeys());

const text=value=>typeof value==='string'&&value.length>0;
export function validatePack(raw){
  if(raw?.kind!=='klar-study-pack'||raw.version!==1||!Array.isArray(raw.sources)||!Array.isArray(raw.tasks)||!Array.isArray(raw.words))throw new Error('Geçerli bir Klar kaynak paketi seç.');
  if(raw.revision!==undefined&&(!Number.isInteger(raw.revision)||raw.revision<1))throw new Error('Kaynak paketi sürümü okunamadı.');
  if(raw.sources.length>100||raw.tasks.length>2500||raw.words.length>5000)throw new Error('Kaynak paketi çok büyük.');
  const sourceRefs=new Map();
  for(const source of raw.sources){
    if(!text(source?.id)||sourceRefs.has(source.id)||!text(source.title)||!text(source.name)||!text(source.note)||!Array.isArray(source.refs))throw new Error('Kaynak bilgileri okunamadı.');
    const refs=new Map();
    for(const ref of source.refs){
      if(!text(ref?.label)||!Number.isInteger(ref.page)||ref.page<1)throw new Error('Kaynak bilgileri okunamadı.');
      if(ref.id===undefined)continue;
      if(!text(ref.id)||refs.has(ref.id)||!['lesson','workbook','exam'].includes(ref.format)||!text(ref.printed)
        ||!Array.isArray(ref.topics)||!ref.topics.every(text)||!ref.topics.includes(ref.topic)
        ||!Number.isInteger(source.pages)||!Number.isInteger(ref.endPage)||ref.endPage<ref.page||ref.endPage>source.pages)throw new Error('Kitap sayfaları okunamadı.');
      refs.set(ref.id,ref);
    }
    sourceRefs.set(source.id,refs);
  }
  const ids=new Set();
  for(const task of raw.tasks){
    const grammar=task?.skill==='grammar';
    const writing=task?.skill==='writing';
    const form=task?.kind==='form'&&(grammar||writing)&&Array.isArray(task.fields)&&task.fields.length&&task.fields.every(f=>text(f.label)&&Array.isArray(f.answers)&&f.answers.length&&f.answers.every(text));
    const match=task?.kind==='match'&&grammar&&Array.isArray(task.pairs)&&task.pairs.length>=2&&task.pairs.every(pair=>Array.isArray(pair)&&pair.length===2&&pair.every(text));
    const order=task?.kind==='order'&&grammar&&Array.isArray(task.tokens)&&task.tokens.length>=3&&task.tokens.every(text);
    const open=['writing','speaking'].includes(task?.kind)&&task.skill===task.kind&&Array.isArray(task.points)&&task.points.length&&task.points.every(text);
    if(!task||!text(task.id)||!task.id.startsWith('pack-')||ids.has(task.id)||!sourceRefs.has(task.source)||!text(task.topic)
      ||!text(task.stem)||!text(task.text)||!(form||match||order||open))throw new Error('Pakette geçersiz bir alıştırma var.');
    if(task.bookRef!==undefined){
      const ref=sourceRefs.get(task.source).get(task.bookRef);
      if(!ref||!(form||match||order)||!Number.isInteger(task.page)||task.page<ref.page||task.page>ref.endPage||!ref.topics.includes(task.topic))throw new Error('Alıştırmanın kitap sayfası okunamadı.');
    }
    ids.add(task.id);
  }
  for(const word of raw.words){
    if(!text(word?.id)||!word.id.startsWith('word-pack-')||ids.has(word.id)||!text(word.topic)||!text(word.de)||!text(word.tr))throw new Error('Pakette geçersiz bir kelime var.');
    ids.add(word.id);
  }
  return raw;
}
