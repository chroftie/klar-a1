import {lessons,skills,externalSources,courseSections} from './data/course.js';
import {words as baseWords} from './data/words.js';
import {tasks as firstTasks,examParts} from './data/tasks.js';
import {extraTasks,examSetB} from './data/extra.js';
import {loadState,storeState,normalizeState,mergeState,activity,addDays,localKey,fromKey,examDistance,dueCards,mistakes,skillStats,recommendation,weekPlan,monthPlan,lastAttempts,id} from './study.js';
import {readDevice,writeDevice,deviceKeys,deleteDevice,validatePack} from './device.js';
import {esc,icon,tile,button,link,inline,pill,track,fmt,pct,intro,head,option} from './ui.js';
import {createSession} from './session.js';
import {vocabularyQuestions} from './data/vocab-quiz.js';
import {drills} from './data/drills.js';
import {unitTasks,unitForms} from './data/unit-tasks.js';
import {unitVideos} from './data/videos.js';
import {courseSteps,stepById,activeUnit,unitProgress,markUnitStep} from './course-progress.js';

const main=document.querySelector('#content');
const dialog=document.querySelector('#dialog');
const status=document.querySelector('#status');
const privateKlar='https://klar-a1.mauve-daisy-5056.chatgpt.site/';
const pages=[
  ['bugun','Bugün','home'],['calis','Üniteler','book_2'],['deneme','Deneme','event'],
  ['ilerleme','İlerleme','bar_chart'],['plan','Planım','calendar_month'],
];
const names={...Object.fromEntries(pages.map(([key,name])=>[key,name])),kaynaklar:'Kaynaklar',ayarlar:'Ayarlar',oturum:'Çalışma oturumu'};
const baseTasks=[...firstTasks,...extraTasks,...drills,...unitTasks,...unitForms];
const examSets=[examParts,examSetB];
let selectedExam=0;
const examSkills=['listening','reading','writing','speaking'];
const weekdays=[['Pzt',1],['Sal',2],['Çar',3],['Per',4],['Cum',5],['Cmt',6],['Paz',0]];
const lessonById=new Map(lessons.map(l=>[l.id,l]));
const skillById=key=>Object.hasOwn(skills,key)?skills[key]:null;
const state=loadState();
const systemTheme=matchMedia('(prefers-color-scheme: dark)');
function applyTheme(){
  const dark=state.settings.theme==='dark'||(state.settings.theme==='system'&&systemTheme.matches);
  document.documentElement.dataset.theme=dark?'dark':'light';
  const toggle=document.querySelector('.theme-toggle');
  const label=dark?'Açık temaya geç':'Koyu temaya geç';
  toggle.innerHTML=icon(dark?'light_mode':'dark_mode');
  toggle.setAttribute('aria-label',label);
  toggle.title=label;
  document.querySelector('meta[name=theme-color]').content=dark?'#12211a':'#163b2e';
}
systemTheme.addEventListener('change',applyTheme);
applyTheme();
let pack=null, files=new Set(), route=[], toastTimer, pdfUrl, media;
let words=[...baseWords], tasks=[...baseTasks,...vocabularyQuestions(baseWords)];
let wordQuery='', wordTopic='', wordLimit=60;
let taskLimit=30, taskTopic='', taskType='', viewStarted=Date.now();
const fileInput=document.createElement('input');
fileInput.type='file';
fileInput.hidden=true;
document.body.append(fileInput);
document.querySelector('#navigation').innerHTML=pages.map(([key,name,glyph])=>
  `<a class="nav-link" data-route="${key}" href="#${key}" aria-label="${name}">${icon(glyph)}<span>${name}</span></a>`).join('');

function notify(message){
  status.textContent=message;
  status.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>status.classList.remove('visible'),4200);
}
function persist(){
  try {storeState(state);}
  catch {notify('Tarayıcı depolaması dolu veya kapalı. İlerlemeni bir dosyaya yedekleyebilirsin.');}
}
function rebuild(){
  words=[...baseWords,...(pack?.words||[])];
  tasks=[...baseTasks,...(pack?.tasks||[]),...vocabularyQuestions(words)];
}
function play(text,url){
  if(url&&!/^\.\/assets\/audio\/[a-z0-9-]+\.mp3$/.test(url)&&!/^data:audio\/mpeg;base64,[a-zA-Z0-9+/=]+$/.test(url))url='';
  if(!url&&'speechSynthesis' in window){
    const voices=speechSynthesis.getVoices();
    const voice=voices.find(v=>v.lang.toLowerCase().startsWith('de')&&v.localService);
    if(!voice){notify('Bu cihazda Almanca konuşma sesi bulunamadı.');return;}
    stopSpeech();
    const item=new SpeechSynthesisUtterance(text);
    item.lang='de-DE';item.voice=voice;item.rate=.86;
    speechSynthesis.speak(item);
    return;
  }
  if(!url){notify('Bu cihazda sesli okuma kullanılamıyor.');return;}
  stopSpeech();
  media=new Audio(url);
  media.play().catch(()=>notify('Ses açılamadı. Bağlantıyı ve ses ayarını kontrol et.'));
}
function stopSpeech(){
  if(media){media.pause();media=null;}
  if('speechSynthesis' in window)speechSynthesis.cancel();
}
function startOfView(){
  window.scrollTo({top:0,behavior:'auto'});
  main.focus({preventScroll:true});
}
function to(hash){
  if(location.hash==='#'+hash){render();startOfView();}
  else location.hash=hash;
}
function historyRoute(){
  let parts;
  try {parts=location.hash.slice(1).split('/').map(decodeURIComponent);}
  catch {parts=['bugun'];}
  const previous=route.join('/');
  if(!Object.hasOwn(names,parts[0]))parts=['bugun'];
  if(previous==='oturum'&&parts[0]!=='oturum'){
    session.stopRecording();
    session.pauseTime();
    session.checkpoint();
  }
  if(parts[0]==='oturum'&&!session.current)parts=['calis'];
  if(parts[0]==='oturum')session.resumeTime();
  if(previous!==parts.join('/')){
    stopSpeech();
    taskLimit=30;taskTopic='';taskType='';wordQuery='';wordTopic='';wordLimit=60;
    viewStarted=Date.now();
  }
  route=parts;
  render();startOfView();
}

function quick(skill,topic=''){
  const s=skills[skill];
  return `<a href="#calis/${topic?'konu/'+topic+'/':''}${skill}" class="quick card">${tile(s.icon,skill)}<span><b>${s.name}</b><small lang="de">${s.german}</small></span><span class="mi arrow" aria-hidden="true">chevron_right</span></a>`;
}
function goal(label,done,target,unit=''){
  return `<div><div class="goal-label"><span>${esc(label)}</span><span>${done} / ${target} ${esc(unit)}</span></div>${track(done,target,label)}</div>`;
}
function dayCells(stats){
  return `<div class="week-grid">${stats.week.map((day,i)=>`<div class="day-cell"><span>${weekdays[i][0]}</span><span class="day-dot ${day.minutes?'done':''} ${day.key===stats.today?'today':''}" aria-label="${fmt(day.date,{weekday:'long'})}, ${day.minutes} dakika">${day.minutes?icon('check'):day.date.getDate()}</span></div>`).join('')}</div>`;
}
function suggestionLink(focus,label='Çalışmaya başla'){
  if(focus.type==='lesson')return focus.step?unitStepButton(focus.topic,focus.step,label):link(label,unitUrl(focus.topic),'arrow_forward');
  if(focus.type==='exam')return button(label,'exam',focus.skill,'arrow_forward');
  if(focus.type==='diagnostic')return button(label,'diagnostic','','arrow_forward');
  if(focus.type==='cards')return button(label,'cards','due','arrow_forward');
  return button(label,'mistakes','','arrow_forward');
}
function home(){
  const stats=activity(state),focus=recommendation(state,tasks,words),wrong=mistakes(state,tasks);
  const examDays=examDistance(state.settings);
  const studied=stats.todayMinutes>=state.settings.daily;
  const due=dueCards(state,words).length;
  const next=activeUnit(state);
  const progress=next?unitProgress(state,next.id):null;
  const recent=session.hasUnfinished();
  const label=progress?.next.id==='lesson'?'Derse başla':'Kaldığın adıma devam et';
  const plannedUnits=Object.keys(state.lessons).length;
  const examFocus=focus.type==='exam'||focus.type==='diagnostic';
  return intro('Bugün',examDays===null?'Bugünkü çalışmana kaldığın adımdan devam et.':examDays<0?'Sınav tarihi geçti. Planından yeni bir tarih belirleyebilirsin.':examDays===0?'Bugün sınav günün.':`Goethe A1 sınavına ${examDays} gün kaldı.`)+
    `<div class="dashboard"><div class="stack">
      <section class="hero card"><div class="hero-copy">
        <div class="hero-label">${icon(studied?'check_circle':'route')} ${next?`Ünite ${next.index+1} / ${lessons.length}`:'Goethe A1'}</div>
        <h2>${esc(next?.title||'Sınav provası')}</h2>
        <p>${progress?`<strong>${esc(progress.next.title)}</strong> · ${esc(progress.next.hint)}`:'Tüm üniteleri tamamladın. Sınav formatında pratik yap.'}</p>
        ${recent?link('Oturuma dön','#oturum','arrow_forward'):next?unitStepButton(next.id,progress.next.id,label):link('Denemeleri aç','#deneme','arrow_forward')}
      </div></section>
      <section class="card">
        ${head('Kurs yolun',inline('Tüm üniteler','#calis'),`${plannedUnits} / ${lessons.length} ünite tamamlandı`)}
        <div class="course-summary">${courseSections.map((section,i)=>{
          const count=section.units.filter(id=>state.lessons[id]).length;
          return `<a class="course-phase ${next?.stage===i?'current':''}" href="#calis/asama/${i+1}"><span>${esc(section.title)}</span><span class="small muted">${count} / ${section.units.length} ünite</span>${track(count,section.units.length,section.title)}</a>`;
        }).join('')}</div>
      </section>
      ${examFocus?`<section class="card row wrap between"><div class="row">${tile(focus.icon)}<div><h3>${esc(focus.title)}</h3><p class="small muted">${esc(focus.description)}</p></div></div>${suggestionLink(focus,'Başla')}</section>`:''}
    </div><div class="stack">
      <section class="card">
        <div class="row between"><h2>Hedeflerim</h2><a class="icon-btn" href="#plan" aria-label="Planım">${icon('calendar_month')}</a></div>
        <div class="goal">${goal('Bugün',stats.todayMinutes,state.settings.daily,'dk')}${goal('Bu hafta',stats.weekDays,stats.weekGoal,'gün')}${goal('Bu ay',stats.monthDays,stats.monthGoal,'gün')}</div>
        ${dayCells(stats)}
      </section>
      <section class="card tint">
        <div class="row">${tile('refresh','words')}<div><h2>Tekrar kutusu</h2><p class="small muted">${due} kelime · ${wrong.length} yanlış</p></div></div>
        <p class="footer-note">${due||wrong.length?'Zamanı gelen kartları ve son hatalarını burada çalış.':'İlk çalışmalarından sonra tekrarların burada birikecek.'}</p>
        <div class="actions">${due?button('Kartları tekrarla','cards','due','','secondary slim'):''}${wrong.length?button('Yanlışları çöz','mistakes','','','secondary slim'):''}${!due&&!wrong.length?inline('Kelime kartlarını aç','#calis/words'):''}</div>
      </section>
      <section class="card"><div class="row">${tile('folder_open')}<div><h3>Özel Klar</h3><p class="small muted">Kitapların ve alıştırmaların her cihazda hazır.</p></div></div><div class="actions">${link('Özel Klar’ı aç',privateKlar,'arrow_forward','secondary slim')}${inline('İlerlemeyi taşı','#ayarlar')}</div></section>
    </div></div>`;
}

const unitUrl=(id,step='')=>`#calis/konu/${id}${step?'/'+step:''}`;
function unitStepButton(topic,step,label='Başla',style=''){
  return button(label,'unit-step',topic+'|'+step,'arrow_forward',style);
}
function unitResultAction(topic){
  const unit=lessonById.get(topic);
  const progress=unitProgress(state,topic);
  if(progress.next)return unitStepButton(topic,progress.next.id,'Sıradaki adım · '+progress.next.title);
  const next=lessons[unit.index+1];
  return next?link('Sıradaki ünite',unitUrl(next.id),'arrow_forward'):link('Denemelere geç','#deneme','arrow_forward');
}
function tabs(active){
  const opts=[['pratik','Tüm beceriler'],...Object.entries(skills).map(([key,s])=>[key,s.name])];
  return `<div class="tabs" aria-label="Çalışma türü">${opts.map(([key,name])=>`<a class="tab ${active===key?'active':''}" ${active===key?'aria-current="page"':''} href="#calis/${key}">${esc(name)}</a>`).join('')}</div>`;
}
function unitRow(unit,current){
  const {done,completed,next}=unitProgress(state,unit.id);
  return `<a class="unit-row ${current?'current':''}" href="${unitUrl(unit.id)}">
    <span class="unit-number">${String(unit.index+1).padStart(2,'0')}</span>
    <span class="grow"><strong>${esc(unit.title)}</strong><small>${esc(current&&next?`Sırada: ${next.title}`:unit.description)}</small></span>
    <span class="unit-row-end" aria-label="${done.length} / ${courseSteps.length} adım">${completed?icon('check_circle'):`<span class="small">${done.length}/${courseSteps.length}</span>`}${icon('chevron_right')}</span>
  </a>`;
}
function courseView(stage){
  const active=activeUnit(state);
  const filtered=Number.isInteger(stage)&&stage>=0&&stage<courseSections.length;
  const sections=filtered?[courseSections[stage]]:courseSections;
  return `${filtered?link('Tüm ünitelere dön','#calis','arrow_back','ghost slim'):''}${intro(filtered?sections[0].title:'Üniteler',
    filtered?sections[0].description:'Sıradaki üniteden devam et veya çalışmak istediğin konuyu aç.',
    link('Alıştırma arşivi','#calis/pratik','library_books','secondary'))}
    ${!filtered&&active?`<section class="card course-next row wrap between"><div class="row">${tile('route')}<div><p class="small muted">Sıradaki ünite · ${active.index+1} / ${lessons.length}</p><h2>${esc(active.title)}</h2></div></div>${link('Üniteyi aç',unitUrl(active.id),'arrow_forward')}</section>`:''}
    <div class="course-grid">${sections.map(section=>{
      const completed=section.units.filter(id=>state.lessons[id]).length;
      return `<section class="card phase-card"><div class="section-head"><div><h2>${esc(section.title)}</h2><p>${esc(section.description)}</p></div>${pill(completed+'/'+section.units.length)}</div>
        <div class="unit-rows">${section.units.map(id=>unitRow(lessonById.get(id),active?.id===id)).join('')}</div></section>`;
    }).join('')}</div>`;
}
const newSourceRefs={
  sayilar:[['wortliste',6,'Sayılar ve sayma'],['einfach-11',14,'Sayı ve aile bilgileri']],
  hobiler:[['menschen-11-kb',41,'Boş zaman'],['tema',33,'Boş zaman kartları']],
  hizmet:[['fit',66,'Form doldurma'],['wortliste',9,'Alfabetik kelime listesi']],
  kurallar:[['rica',1,'Rica ve yasak kalıpları'],['fit',86,'Resmî rica']],
};
function unitSourceRefs(id){
  const refs=(pack?.sources||[]).flatMap(source=>{
    const indexed=source.refs.some(ref=>ref.id);
    return source.refs.filter(ref=>indexed?ref.topics?.includes(id):ref.topic===id).map(ref=>({source,ref}));
  });
  for(const [sourceId,page,label] of newSourceRefs[id]||[]){
    const source=sourceById(sourceId);
    if(source&&!source.refs.some(ref=>ref.id))refs.push({source,ref:{page,label}});
  }
  return refs;
}
const bookGroups=[['workbook','Çalışma kitabı'],['lesson','Ders kitabı'],['exam','Sınav çalışması']];
const bookTaskKinds={form:'Boşluk doldurma',match:'Eşleştirme',order:'Sıralama'};
function bookRefUrl(source,ref,topic=ref.topic){
  return '#calis/kitap/'+[source.id,ref.id,topic].map(encodeURIComponent).join('/');
}
function bookRefTasks(source,ref){
  return (pack?.tasks||[]).filter(task=>task.source===source.id&&Object.hasOwn(bookTaskKinds,task.kind)&&
    (task.bookRef?task.bookRef===ref.id:task.page>=ref.page&&task.page<=ref.endPage)).sort((a,b)=>a.page-b.page);
}
function bookPages(ref){
  const range=ref.page===ref.endPage?ref.page:`${ref.page}–${ref.endPage}`;
  return `Kitap s. ${ref.printed} · PDF s. ${range}`;
}
function bookPdfButton(source,page){
  const bound=files.has('pdf:'+source.id);
  return button(bound?'PDF sayfasını aç':'PDF bağla','source-page',source.id+'|'+page,bound?'folder_open':'upload','ghost slim');
}
function unitBookSection(unit){
  const refs=unitSourceRefs(unit.id);
  const extra=refs.filter(({ref})=>!ref.id);
  const groups=bookGroups.map(([format,label])=>{
    const matching=refs.filter(({ref})=>ref.format===format);
    if(!matching.length)return '';
    return `<details class="book-group" ${format==='workbook'?'open':''}><summary>${label} <span>${matching.length} bölüm</span></summary>
      <div class="book-rows">${matching.map(({source,ref})=>{
        const count=bookRefTasks(source,ref).length;
        return `<article class="book-row">
          <div><p class="small muted">${esc(source.title)}</p><h3 lang="${source.id==='fit'?'tr':'de'}">${esc(ref.label)}</h3>
          <p class="book-pages">${esc(bookPages(ref))}</p>${ref.note?`<p class="small muted">${esc(ref.note)}</p>`:''}</div>
          <div class="row wrap book-actions">${count?link(`${count} alıştırmayı çöz`,bookRefUrl(source,ref,unit.id),'play_arrow','secondary slim'):''}${bookPdfButton(source,ref.page)}</div>
        </article>`;
      }).join('')}</div></details>`;
  }).join('');
  return `<section class="card" id="unit-books" tabindex="-1" aria-labelledby="unit-book-title">
    <div class="section-head"><div><h2 id="unit-book-title">Kitapta bu ünite</h2><p>Bu konu için çalışacağın sayfalar ve kitaba bağlı alıştırmalar.</p></div></div>
    ${!groups?`<div class="book-pack-callout"><p class="small">Bu ünitenin kitapları ve alıştırmaları özel Klar’da hazır.</p>${link('Özel Klar’da aç',privateKlar+unitUrl(unit.id),'arrow_forward','secondary slim')}</div>`:''}
    ${groups}
    ${extra.length?`<details class="book-group"><summary>Ek kaynaklar</summary><div class="source-pages">${extra.map(({source,ref})=>`<button type="button" data-action="source-page" data-value="${esc(source.id+'|'+ref.page)}">${esc(source.title)} · PDF s. ${ref.page} · ${esc(ref.label)}</button>`).join('')}</div></details>`:''}
  </section>`;
}
function bookExerciseView(source,ref,unit){
  const list=bookRefTasks(source,ref);
  const attempts=lastAttempts(state);
  const done=list.filter(task=>attempts.get(task.id)?.score===1).length;
  return `${link(unit.title,unitUrl(unit.id),'arrow_back','ghost slim')}
    <section class="card book-detail">
      <p class="small muted">${esc(source.title)}</p><h1 lang="${source.id==='fit'?'tr':'de'}">${esc(ref.label)}</h1>
      <p class="book-pages">${esc(bookPages(ref))}</p>${ref.note?`<p class="small muted">${esc(ref.note)}</p>`:''}
      <div class="actions">${list.length?button('Seti çöz','book-quiz','','play_arrow'):''}${bookPdfButton(source,ref.page)}</div>
      ${list.length?`<div class="book-detail-progress">${goal('Doğru tamamlanan alıştırmalar',done,list.length)}</div>`:''}
    </section>
    <section class="card">${head('Kitap alıştırmaları',list.length?pill(`${list.length} görev`):'')}
      ${list.length?Object.entries(bookTaskKinds).map(([kind,label])=>{
        const group=list.filter(task=>task.kind===kind);
        if(!group.length)return '';
        return `<div class="book-task-group"><h3>${label}</h3><div class="list">${group.map(task=>`<button type="button" class="list-item" data-action="one-task" data-value="${esc(task.id)}">
          ${tile(kind==='match'?'library_books':'edit_note',task.skill)}<span class="grow"><strong>${esc(task.stem)}</strong><p>PDF s. ${esc(task.page)}</p></span>
          ${attempts.has(task.id)?pill(pct(attempts.get(task.id).score),attempts.get(task.id).score===1?'check':''):''}${icon('chevron_right')}</button>`).join('')}</div></div>`;
      }).join(''):'<p class="empty">Bu bölümün çalışmasını PDF sayfalarından yapabilirsin.</p>'}
    </section>`;
}
function unitStepRows(unit,progress){
  const groups=[['Temel ders',courseSteps.slice(0,3)],['Goethe becerileri',courseSteps.slice(3,7)],['Pekiştirme',courseSteps.slice(7)]];
  return groups.map(([name,steps])=>`<div class="step-group"><h3>${name}</h3>
    ${steps.map(step=>{
      const done=progress.done.includes(step.id);
      const current=progress.next?.id===step.id;
      return `<button type="button" class="step-row ${current?'current':''}" data-action="unit-step" data-value="${unit.id}|${step.id}">
        ${tile(done?'check':step.icon,step.id)}
        <span class="grow"><strong>${esc(step.title)}</strong><small>${esc(step.hint)}</small></span>
        ${current?pill('Sırada'):''}<span class="mi" aria-hidden="true">chevron_right</span>
      </button>`;
    }).join('')}</div>`).join('');
}
function unitView(unit){
  const progress=unitProgress(state,unit.id);
  const videos=unitVideos[unit.id];
  const done=progress.done.length;
  return `${link('Üniteler','#calis','arrow_back','ghost slim')}
    <section class="card unit-heading">
      <div><div class="eyebrow">${icon('route')} Ünite ${unit.index+1} / ${lessons.length} · ${esc(courseSections[unit.stage].title)}</div>
        <h1>${esc(unit.title)}</h1><p>${esc(unit.description)}</p></div>
      <div class="unit-heading-action">${progress.next?unitStepButton(unit.id,progress.next.id,`Sıradaki adım · ${progress.next.title}`):pill('Ünite tamamlandı','check_circle')}
        ${button('Kitap sayfalarına git','unit-jump','unit-books','book_2','ghost slim unit-book-jump')}</div>
      <div class="unit-heading-progress">${progress.previousVersion?pill('Önceki sürümde tamamlandı','check'):''}${goal('Ünite adımları',done,courseSteps.length,'adım')}</div>
    </section>
    <nav class="unit-jumps" aria-label="Ünite içinde gezin">
      ${button('Ders notu','unit-jump','unit-lesson','','secondary slim')}
      ${button('Adımlar','unit-jump','unit-steps','','secondary slim')}
      ${button('Kitap','unit-jump','unit-books','','secondary slim')}
      ${button('Videolar','unit-jump','unit-videos','','secondary slim')}
    </nav>
    <div class="unit-layout">
      <div class="stack unit-content">
        <section class="card lesson-body" id="unit-lesson" tabindex="-1">
          ${head('Ders notu',pill(unit.german))}
          <p class="lesson-note">${esc(unit.note)}</p>
          <div>${unit.examples.map(([de,tr],i)=>`<div class="row between lesson-example"><div><strong lang="de">${esc(de)}</strong><p>${esc(tr)}</p></div><button class="icon-btn" type="button" data-action="example" data-value="${unit.id}|${i}" aria-label="Cümleyi dinle">${icon('volume_up')}</button></div>`).join('')}</div>
          <div class="actions">${progress.done.includes('lesson')?pill('Ders notu çalışıldı','check'):button('Dersi tamamla ve devam et','unit-lesson-done',unit.id,'check')}</div>
        </section>
        <section class="card" id="unit-videos" tabindex="-1" aria-labelledby="unit-video-title">
          <div class="section-head"><div><h2 id="unit-video-title">Videoyla pekiştir</h2><p>Deutsche Welle · Nicos Weg A1</p></div></div>
          <div class="list">${videos.map(video=>`<a class="list-item unit-video" href="${video.url}" target="_blank" rel="noopener noreferrer">
            ${tile('play_arrow','listening')}<span class="grow"><strong lang="de">${esc(video.title)}</strong><p>${esc(video.focus)}</p></span>${icon('arrow_forward')}</a>`).join('')}</div>
        </section>
      </div>
      <div class="stack unit-steps">
        <section class="card" id="unit-steps" tabindex="-1"><div class="section-head"><div><h2>Çalışma sırası</h2><p>Bir adımı aç veya sıradaki çalışmayla devam et.</p></div></div>${unitStepRows(unit,progress)}</section>
        <details class="card unit-more"><summary>Tüm ünite alıştırmaları</summary>
          <div class="quick-list">${['words','grammar',...examSkills].map(skill=>quick(skill,unit.id)).join('')}</div>
        </details>
      </div>
    </div>
    ${unitBookSection(unit)}`;
}
function currentTopic(){return route[1]==='konu'&&lessonById.has(route[2])?route[2]:'';}
function searchWords(){
  const normalized=value=>value.toLocaleLowerCase('tr').normalize('NFD').replace(/\p{Diacritic}/gu,'').replaceAll('ı','i').replaceAll('ß','ss');
  const query=normalized(wordQuery.trim());
  const topic=currentTopic()||wordTopic;
  return words.filter(w=>(!topic||w.topic===topic)&&(!query||normalized(w.de+' '+w.tr).includes(query)));
}
function wordList(){
  const found=searchWords();
  return `${found.length?`<div class="word-grid">${found.slice(0,wordLimit).map(w=>`<div class="word-row list-item">
    <div><strong lang="de">${esc(w.de)}</strong>${w.example?`<p lang="de">${esc(w.example)}</p>`:''}</div>
    <div><span>${esc(w.tr)}</span>${w.exampleTr?`<p>${esc(w.exampleTr)}</p>`:''}</div>
    <button type="button" class="icon-btn" data-action="speak-word" data-value="${esc(w.id)}" aria-label="${esc(w.de)} dinle">${icon('volume_up')}</button>
    </div>`).join('')}</div>`:'<p class="empty">Aramana uyan kelime yok.</p>'}
    ${found.length>wordLimit?`<div class="actions">${button('Daha fazla göster','more-words','','','secondary')}</div>`:''}`;
}
function wordsView(){
  const topic=currentTopic();
  const set=topic?words.filter(w=>w.topic===topic):words;
  const due=dueCards(state,set).length;
  return (topic?link(lessonById.get(topic).title,unitUrl(topic),'arrow_back','ghost slim'):'')+intro('Kelime kartları',`${set.length} Almanca kelime ve kalıp. Türkçe karşılığına bak, telaffuzu dinle ve kendini dene.`)+(topic?'':tabs('words'))+
    `<section class="card">
      <div class="row wrap between"><div class="row wrap">
        <label class="search">${icon('search')}<input type="search" id="word-query" aria-label="Almanca veya Türkçe kelime ara" placeholder="Almanca veya Türkçe ara" value="${esc(wordQuery)}"></label>
        ${topic?'':`<label class="field"><select id="word-topic" aria-label="Konu seç">${option('','Tüm konular',!wordTopic)}${lessons.map(l=>option(l.id,l.title,wordTopic===l.id)).join('')}</select></label>`}
      </div><div class="row wrap">${due?button(`${due} kartı tekrarla`,'cards',topic?'due|'+topic:'due','refresh','secondary'):''}${button('Kartları çalış','cards',topic||wordTopic||'new','play_arrow')}</div></div>
      <div class="actions">${button('Almanca → Türkçe','word-test','de-tr','','secondary slim')}${button('Türkçe → Almanca','word-test','tr-de','','secondary slim')}${button('Artikel testi','word-test','artikel','','secondary slim')}</div>
      <div id="word-results" class="meta-list">${wordList()}</div>
    </section>`;
}
function skillView(key){
  const s=skills[key];
  const topic=currentTopic();
  const available=tasks.filter(t=>t.skill===key&&(!topic||t.topic===topic));
  const completed=lastAttempts(state);
  const types={choice:'Çoktan seçmeli',form:key==='grammar'?'Boşluk doldurma':key==='listening'?'Dikte':'Form',match:'Eşleştirme',order:'Sıralama',writing:'Mektup',speaking:'Konuşma kartı'};
  const listed=available.filter(t=>(!taskTopic||t.topic===taskTopic)&&(!taskType||t.kind===taskType));
  return (topic?link(lessonById.get(topic).title,unitUrl(topic),'arrow_back','ghost slim'):'')+intro(s.name,s.description,pill(s.german))+(topic?'':tabs(key))+
    `<section class="card">${head('Alıştırmalar',button('Önerilen seti çöz','skill-quiz',key,'play_arrow'),`${listed.length} görev`)}
      <div class="row wrap filters">${topic?'':`<label class="field"><select id="task-topic" aria-label="Alıştırma konusu">${option('','Tüm konular',!taskTopic)}${lessons.filter(l=>available.some(t=>t.topic===l.id)).map(l=>option(l.id,l.title,taskTopic===l.id)).join('')}</select></label>`}
      <label class="field"><select id="task-type" aria-label="Alıştırma türü">${option('','Tüm türler',!taskType)}${[...new Set(available.map(t=>t.kind))].map(kind=>option(kind,types[kind],taskType===kind)).join('')}</select></label></div>
      <div class="list">${!listed.length?'<p class="empty">Bu filtreye uyan alıştırma yok.</p>':''}${listed.slice(0,taskLimit).map(t=>`<button type="button" class="list-item" data-action="one-task" data-value="${esc(t.id)}">${tile(s.icon,key)}<span class="grow"><strong>${esc(t.stem)}</strong><p>${esc(lessonById.get(t.topic)?.title||s.name)}${t.source?' · Kaynak paketi':''} · ${types[t.kind]}</p></span>${completed.has(t.id)?pill(completed.get(t.id).self?'Pratik yapıldı':pct(completed.get(t.id).score),'check'):''}<span class="mi arrow" aria-hidden="true">chevron_right</span></button>`).join('')}</div>
      ${listed.length>taskLimit?`<div class="actions">${button('Daha fazla göster','more-tasks','','','secondary')}</div>`:''}
    </section>`;
}
function currentBookRef(){
  const [,tab,sourceId,refId,topic]=route;
  if(tab!=='kitap')return null;
  const source=sourceById(sourceId);
  const ref=source?.refs.find(item=>item.id===refId);
  const unit=lessonById.get(ref?.topics.includes(topic)?topic:ref?.topic);
  return ref&&unit?{source,ref,unit}:null;
}
function learn(){
  const [,tab,topic,skill]=route;
  if(tab==='kitap'){
    const match=currentBookRef();
    if(match)return bookExerciseView(match.source,match.ref,match.unit);
    return intro('Kitap alıştırmaları',pack?'Bu kitap bölümü yüklediğin pakette bulunamadı.':'Bu kitap bölümünü açmak için güncel kaynak paketini yükle.',link('Kaynaklar','#kaynaklar','book_2','secondary'));
  }
  if(tab==='konu'&&lessonById.has(topic)){
    if(skill==='words')return wordsView();
    if(skillById(skill))return skillView(skill);
    return unitView(lessonById.get(topic));
  }
  if(tab==='words')return wordsView();
  if(skillById(tab))return skillView(tab);
  if(tab==='pratik')return intro('Alıştırma arşivi','Bir beceri seçerek ünitelerdeki tüm alıştırmalara ulaş.',link('Ünitelere dön','#calis','arrow_back','secondary'))+
    `<div class="quick-list">${[...examSkills,'words','grammar'].map(skill=>quick(skill)).join('')}</div>`;
  return courseView(tab==='asama'?Number(topic)-1:undefined);
}
function exam(){
  const parts=examSets[selectedExam];
  const results=[...state.exams].reverse().slice(0,5);
  return intro('Deneme', 'Goethe A1 soru türleriyle hazırlanmış süreli provalar.',pill('Start Deutsch 1','school'))+
    `<div class="stack">
      <div class="row wrap"><label class="field">Deneme seti<select id="exam-set">${examSets.map((_,i)=>option(i,`Klar · Deneme ${i+1}`,i===selectedExam)).join('')}</select></label></div>
      <section class="card tint"><div class="row wrap between"><div><h2>Yazılı sınav provası</h2><p class="muted">65 dakika · Dinleme, okuma ve yazma</p></div>${button('Provayı başlat','exam','written','play_arrow')}</div>
        <p class="footer-note">Bölüm süreleri ayrı çalışır. Cevapları oturum sonunda görürsün. Yazılı mesaj ve sözlü görevleri model yanıtla karşılaştırıp kendin değerlendirirsin.</p>
      </section>
      <div class="dual">${parts.map(part=>`<section class="card"><div class="row">${tile(skills[part.skill].icon,part.skill)}<div><h3>${skills[part.skill].name}</h3><p class="small muted">${part.minutes} dk · ${part.tasks.length} görev</p></div></div>
        <p class="footer-note">${esc(skills[part.skill].description)}${part.skill==='speaking'?' · Bireysel kayıt provası':''}</p>
        <div class="actions">${button('Bölümü başlat','exam',part.skill,'play_arrow','secondary')}</div></section>`).join('')}</div>
      <section class="card">${head('Son denemeler',inline('İlerleme','#ilerleme'))}
        ${results.length?`<div class="list">${results.map(r=>`<div class="list-item"><div class="grow"><strong>${esc(r.skill==='written'?'Yazılı prova':skills[r.skill]?.name||'Deneme')}</strong><p>${fmt(new Date(r.at),{day:'numeric',month:'long'})}${r.set?' · Deneme '+r.set:''}${r.pending?' · Öz değerlendirme bekliyor':''}</p></div>${pill(pct(r.score))}</div>`).join('')}</div>`:'<p class="empty">Tamamladığın denemeler burada görünecek.</p>'}
        <div class="actions"><a class="inline-link" target="_blank" rel="noopener" href="${externalSources[0].url}">Goethe’nin resmî örneklerini aç ${icon('arrow_forward')}</a></div>
      </section>
    </div>`;
}
function progress(){
  const stats=activity(state),wrong=mistakes(state,tasks),last=[...state.sessions].reverse().slice(0,5);
  return intro('İlerleme', 'Çalışma süreni, öğrendiğin kelimeleri ve tekrar edilecek hatalarını gör.')+
    `<div class="stack">
    <div class="triple">
      <div class="card metric">${tile('schedule')}<div class="value">${stats.minutes} dk</div><span>Toplam çalışma</span></div>
      <div class="card metric">${tile('library_books','words')}<div class="value">${Object.keys(state.cards).length}</div><span>Çalışılan kelime</span></div>
      <div class="card metric">${tile('check_circle')}<div class="value">${Object.keys(state.lessons).length} / ${lessons.length}</div><span>Tamamlanan konu</span></div>
    </div>
    <div class="dual">
      <section class="card">${head('Beceri görünümü')}
        <div class="progress-bars">${[...examSkills,'grammar','words'].map(key=>{
          const stat=skillStats(state,key);
          const label=stat.accuracy===null?(stat.self?`${stat.self} öz değerlendirme`:'Henüz çalışma yok'):`${pct(stat.accuracy)} · ${stat.count} görev${stat.self?` + ${stat.self} öz değerlendirme`:''}`;
          return `<div><div class="goal-label"><span>${skills[key].name}</span><span>${label}</span></div>${track(stat.accuracy||0,1,skills[key].name)}</div>`;
        }).join('')}</div>
        <p class="footer-note">Yüzdeler, otomatik kontrol edilen sorulardaki son cevaplarına göre hesaplanır.</p>
      </section>
      <section class="card">${head('Bu hafta',inline('Planım','#plan'))}${dayCells(stats)}
        <div class="goal">${goal('Çalışılan gün',stats.weekDays,stats.weekGoal,'gün')}</div>
        <div class="meta-list">${last.map(r=>`<div class="goal-label"><span>${esc(r.title||'Çalışma')}</span><span>${r.minutes} dk · ${fmt(new Date(r.at),{day:'numeric',month:'short'})}</span></div>`).join('')}</div>
      </section>
    </div>
    <section class="card">${head('Yanlış defteri',wrong.length?button('Yanlışları çöz','mistakes','','refresh','secondary slim'):'',wrong.length?`${wrong.length} görev yeniden çözülebilir.`:'')}
      ${wrong.length?`<div class="list">${wrong.map(({task:t,attempt:a})=>`<button class="list-item" type="button" data-action="one-task" data-value="${esc(t.id)}">${tile(skills[t.skill].icon,t.skill)}<span class="grow"><strong>${esc(t.stem)}</strong><p>${esc(t.explain||'Bu soruyu yeniden çöz.')}</p></span>${pill(pct(a.score))}</button>`).join('')}</div>`:'<p class="empty">Yanlış yaptığın sorular burada birikir. Doğru çözdüğünde listeden çıkar.</p>'}
    </section></div>`;
}
function plan(){
  const stats=activity(state);
  const planDays=weekPlan(state,tasks,words);
  const distance=examDistance(state.settings);
  const month=monthPlan(state);
  return intro('Planım','Günlük zamanına, haftalık çalışma günlerine ve sınav tarihine göre planın şekillenir.',link('Planı düzenle','#ayarlar','settings','secondary'))+
    `<div class="stack">
    <div class="triple">
      <div class="card metric">${tile('target','writing')}<div class="value">${state.settings.daily} dk</div><span>Günlük hedef</span></div>
      <div class="card metric">${tile('calendar_month')}<div class="value">${state.settings.days.length} gün</div><span>Haftalık hedef</span></div>
      <div class="card metric">${tile('event','listening')}<div class="value">${stats.monthGoal} gün</div><span>Bu ayın hedefi</span></div>
    </div>
    <div class="dual">
      <section class="card">${head('Bu haftanın planı')}
        <div class="list">${planDays.map(day=>{
          const minutes=stats.totals[day.key]||0;
          let title=minutes?`${minutes} dk çalışıldı`:day.scheduled?'Çalışma günü':'Dinlenme günü';
          let action='';
          if(day.action){
            const focus=day.action;
            title=focus.title||lessonById.get(focus.topic)?.title||skills[focus.skill]?.name||title;
            action=focus.type==='skill'?link('Çalış','#calis/'+focus.skill,'','secondary slim'):suggestionLink(focus,'Başla');
          }
          return `<div class="list-item plan-day ${day.key===stats.today?'today':''}"><time datetime="${day.key}">${fmt(day.date,{day:'numeric',month:'short'})}<br><span class="muted">${fmt(day.date,{weekday:'short'})}</span></time><div><strong>${esc(title)}</strong><p>${minutes?`${minutes} dk tamamlandı`:day.action?.step?esc(stepById(day.action.step).title):day.scheduled&&!day.past?`${state.settings.daily} dk hedef`:''}</p></div>${action}</div>`;
        }).join('')}</div>
      </section>
      <section class="card">${head('Aylık odak',pill(fmt(new Date(),{month:'long'})))}
        ${goal('Çalışılan gün',stats.monthDays,stats.monthGoal,'gün')}
        <div class="meta-list">${distance!==null&&distance>=0&&distance<=7?
          '<p class="callout">Son hafta: süreli bir deneme çöz, ardından yanlış yaptığın görevleri ve zamanı gelen kelimeleri tekrar et.</p>':
          `<p class="muted">Sıradaki konulara çalış ve haftalık bir sınav becerisi provası yap.</p>`}
          ${month.filter(week=>week.days).map(week=>`<div class="list-item"><div><strong>${fmt(week.start,{day:'numeric'})}–${fmt(week.end,{day:'numeric',month:'short'})} · ${week.days} gün</strong><p>${esc(week.examNear?'Süreli prova ve yanlış tekrarı':week.topics.length?week.topics.map(l=>l.title).join(' · ')+' · Beceri pratiği':'Sınav becerileri ve kelime tekrarı')}</p></div></div>`).join('')}
        </div>
      </section>
    </div></div>`;
}
function sources(){
  return intro('Kaynaklar','Kitaplarını özel Klar’da aç veya ücretsiz resmî örneklere göz at.')+
    `<div class="stack">
      <section class="card tint"><div class="row wrap between"><div><h2>Özel Klar kitaplığı</h2><p>PDF’ler ve kitap alıştırmaları giriş yaptığında açılır.</p></div>${link('Kitaplığı aç',privateKlar+'#kaynaklar','arrow_forward')}</div></section>
      ${pack?`<section>${head('Kütüphanem')}
        <div class="dual">${pack.sources.map(s=>{
          const indexed=s.refs.filter(ref=>ref.id);
          return `<article class="card source-card">
          <div class="row">${tile('book_2')}<div><h3>${esc(s.title)}</h3><p class="small">${s.pages} PDF sayfası</p></div></div>
          <p class="small">${esc(s.note)}</p>
          <div class="row wrap">${files.has('pdf:'+s.id)?button('PDF’yi aç','source-page',s.id+'|1','folder_open','secondary slim'):button('PDF bağla','bind-pdf',s.id,'upload','secondary slim')}
          ${files.has('pdf:'+s.id)?button('Dosyayı değiştir','bind-pdf',s.id,'','ghost slim'):''}</div>
          ${s.refs.length?`<details><summary>${indexed.length?'Kitap bölümleri':'İlgili sayfalar'}</summary><div class="source-pages">${indexed.length?indexed.map(ref=>`<a class="source-chapter" href="${esc(bookRefUrl(s,ref))}">${esc(ref.label)}<small>${esc(bookPages(ref))}</small></a>`).join(''):s.refs.map(ref=>`<button type="button" data-action="source-page" data-value="${esc(s.id+'|'+ref.page)}">PDF s. ${ref.page} · ${esc(ref.label)}</button>`).join('')}</div></details>`:''}
        </article>`;}).join('')}</div></section>`:''}
      <section>${head('Ücretsiz çevrimiçi kaynaklar')}
        <div class="dual">${externalSources.map(s=>`<a class="list-item" href="${s.url}" target="_blank" rel="noopener">${tile('book_2')}<span class="grow"><strong>${esc(s.title)}</strong><p>${esc(s.description)}</p></span>${icon('arrow_forward')}</a>`).join('')}</div>
      </section>
    </div>`;
}
function settings(){
  const {daily,days,examDate,level,theme}=state.settings;
  return intro('Ayarlar','Çalışma temposunu ayarla veya verini başka bir cihaza taşı.')+
    `<div class="dual"><form class="card" id="settings-form">
      ${head('Çalışma planı')}
      <div class="fieldset">
        <label class="field">Günde kaç dakika?<select name="daily">${[10,15,20,25,30,40,45,60].map(n=>option(n,n+' dakika',n===daily)).join('')}</select></label>
        <fieldset class="rubric"><legend class="small"><strong>Çalışma günleri</strong></legend><div class="row wrap">${weekdays.map(([label,value])=>`<label><input type="checkbox" name="days" value="${value}" ${days.includes(value)?'checked':''}>${label}</label>`).join('')}</div></fieldset>
        <label class="field">Almanca seviyen<select name="level">${option('new','Yeni başlıyorum',level==='new')}${option('some','A1 temellerini biliyorum',level==='some')}${option('exam','Sınav provası önceliğim',level==='exam')}</select></label>
        <label class="field">Sınav tarihi (isteğe bağlı)<input type="date" name="examDate" value="${esc(examDate)}"></label>
      </div><button class="button" type="submit">${icon('check')} Planı kaydet</button>
    </form>
    <div class="stack">
      <section class="card"><h2>Görünüm</h2><label class="field theme-field">Tema<select id="theme-setting">${option('system','Sistem temasını izle',theme==='system')}${option('light','Açık',theme==='light')}${option('dark','Koyu',theme==='dark')}</select></label></section>
      <section class="card tint"><h2>İlerlemeyi özel Klar’a taşı</h2><p class="footer-note">Kodu bu tarayıcıdan kopyala ve özel Klar’da Ayarlar → Eski Klar ilerlemesini al bölümüne yapıştır.</p><div class="actions">${button('İlerleme kodunu kopyala','copy-progress','','','secondary slim')}${link('Özel Klar ayarlarını aç',privateKlar+'#ayarlar','arrow_forward','ghost slim')}</div></section>
      <section class="card"><h2>Yedekleme</h2><p class="footer-note">Yedek dosyası ayarlarını, ilerlemeni ve yüklediğin çalışma paketini taşır. Bağlı PDF’leri diğer cihazda yeniden seçebilirsin.</p><div class="actions">${button('Yedeği indir','backup','','download','secondary')}${button('Yedek yükle','restore','','upload','secondary')}</div></section>
      <section class="card"><h2>Kurulum</h2><p class="footer-note">iPhone ve iPad’de Safari’de Paylaş → Ana Ekrana Ekle. Mac ve Windows’ta tarayıcıdan aynı adresi aç.</p><p class="footer-note" id="offline-info">Çevrimdışı durum kontrol ediliyor…</p><div class="actions">${inline('Kaynaklara git','#kaynaklar')}</div></section>
      <section class="card"><h2>Konuşma kayıtları</h2><p class="footer-note">Bu cihazda kaydettiğin sesleri dinle veya dosya olarak indir.</p><div id="recording-list" class="meta-list"></div></section>
    </div></div>`;
}

function render(){
  const [page]=route;
  const active=page==='oturum'?session.current?.returnRoute?.split('/')[0]||'calis':page;
  document.querySelectorAll('[data-route]').forEach(el=>{
    const current=el.dataset.route===active;el.classList.toggle('active',current);
    if(current)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');
  });
  document.querySelector('#breadcrumb').textContent=page==='calis'&&route.length>1?'Almanca A1':page==='oturum'?'Çalışma oturumu':'';
  const now=new Date();
  const date=document.querySelector('#today-date');
  date.dateTime=localKey(now);date.textContent=fmt(now,{day:'numeric',month:'long',weekday:'long'});
  document.title=`${names[page]||'Bugün'} · Klar`;
  if(page==='oturum'){session.render();return;}
  const views={bugun:home,calis:learn,deneme:exam,ilerleme:progress,plan,kaynaklar:sources,ayarlar:settings};
  main.innerHTML=(views[page]||home)();
  if(page==='ayarlar'){showRecordings();showOfflineStatus();}
}
function currentPriority(candidates){
  const latest=lastAttempts(state);
  return [...candidates].sort((a,b)=>{
    const weight=q=>{const v=latest.get(q.id);return v?v.self?1:v.score<1?0:2:-1;};
    return weight(a)-weight(b)||(latest.get(a.id)?.at||0)-(latest.get(b.id)?.at||0);
  });
}
function unitQuiz(topic,step){
  const candidates=tasks.filter(task=>task.topic===topic);
  const prefer=skill=>currentPriority(candidates.filter(t=>t.skill===skill));
  const original=skill=>currentPriority(candidates.filter(t=>t.skill===skill&&t.id.startsWith('unit-')));
  if(step==='check')return [...prefer('words').slice(0,2),...prefer('grammar').slice(0,1),...prefer('listening').slice(0,1),...prefer('reading').slice(0,1)];
  if(step==='writing'){
    const letter=original('writing').find(t=>t.kind==='writing');
    const form=prefer('writing').find(t=>t.kind==='form');
    return [form,letter].filter(Boolean);
  }
  if(step==='grammar'){
    const core=original(step)[0];
    const extra=prefer(step).find(t=>t!==core);
    return [core,extra].filter(Boolean);
  }
  const core=original(step);
  return core.length?core:prefer(step).slice(0,3);
}
function jumpToUnitSection(id){
  const section=document.getElementById(id);
  section?.scrollIntoView({block:'start'});
  section?.focus({preventScroll:true});
}
function startUnitStep(key){
  const [topic,step]=key.split('|');
  const unit=lessonById.get(topic);
  const definition=stepById(step);
  if(!unit||!definition)return;
  if(!state.lessons[topic]&&state.unitFocus?.topic!==topic){state.unitFocus={topic,at:Date.now()};persist();}
  const returnRoute=unitUrl(topic).slice(1);
  if(step==='lesson'){
    if(route.join('/')!==returnRoute){to(returnRoute);return;}
    jumpToUnitSection('unit-lesson');
    return;
  }
  const options={topic,unitStep:step,returnRoute};
  if(step==='words'){startCards(topic,options);return;}
  startQuiz(unitQuiz(topic,step),unit.title+' · '+definition.title,options);
}
function startQuiz(list,title,options={}){
  if(!list.length){notify('Bu seçimde çalışılacak görev yok.');return;}
  session.quiz(list,title,{returnRoute:route.join('/'),...options});
  to('oturum');
}
function startExam(key){
  const selected=examSets[selectedExam];
  const parts=key==='written'?selected.slice(0,3):selected.filter(p=>p.skill===key);
  if(!parts.length)return;
  const title=key==='written'?'Yazılı sınav provası':skills[key].name+' provası';
  startQuiz(parts.flatMap(p=>p.tasks),title,{exam:key,examSet:selectedExam+1,parts,returnRoute:'deneme'});
}
function startCards(key,options={}){
  const [kind,topic]=key.split('|');
  const due=dueCards(state,words);
  const available=kind==='due'?due.filter(w=>!topic||w.topic===topic):kind==='new'?[...due,...words.filter(w=>!state.cards[w.id])]:
    words.filter(w=>w.topic===kind).sort((a,b)=>(state.cards[a.id]?.due||0)-(state.cards[b.id]?.due||0));
  if(!available.length){notify('Şimdilik tekrarı gelen kart yok.');return;}
  const title=kind==='due'?'Kelime tekrarı':options.topic?lessonById.get(options.topic).title+' · Kelime kartları':'Kelime kartları';
  session.cards(available.slice(0,options.unitStep?8:12),title,options.returnRoute||route.join('/'),options);
  to('oturum');
}
function chooseFile(accept,onFile){
  fileInput.value='';
  fileInput.accept=accept;
  fileInput.onchange=async()=>{
    const file=fileInput.files?.[0];
    if(file)try {await onFile(file);}
    catch(error){notify(error?.message||'Dosya açılamadı.');}
  };
  fileInput.click();
}
function readJson(file){
  if(file.size>16*1024*1024)throw new Error('JSON dosyası 16 MB sınırını aşıyor.');
  return file.text().then(value=>{
    try{return JSON.parse(value);}catch{throw new Error('JSON dosyası okunamadı.');}
  });
}
async function installPack(raw){
  const validated=validatePack(raw);
  await writeDevice('pack',validated);
  pack=validated;
  rebuild();
}
function sourceById(key){return pack?.sources.find(s=>s.id===key);}
function bindPdf(key,page){
  const source=sourceById(key);
  if(!source)return;
  chooseFile('.pdf,application/pdf',async file=>{
    if(!file.name.toLowerCase().endsWith('.pdf')||!(await file.slice(0,5).text()).startsWith('%PDF-'))throw new Error('Bir PDF dosyası seç.');
    if(file.size>120*1024*1024)throw new Error('PDF 120 MB sınırını aşıyor.');
    try {await writeDevice('pdf:'+key,file);}
    catch {await writeDevice('pdf:'+key,await file.arrayBuffer());}
    files.add('pdf:'+key);
    render();notify(source.title+' bağlandı.');
    if(page)await openPdf(key+'|'+page);
  });
}
async function openPdf(value){
  const [key,requestedPage]=value.split('|');
  const source=sourceById(key);
  if(!source)return;
  const page=Math.max(1,Math.min(Number(requestedPage)||1,source.pages||1));
  if(!files.has('pdf:'+key)){bindPdf(key,page);return;}
  try {
    const pdf=await readDevice('pdf:'+key);
    if(!pdf){files.delete('pdf:'+key);render();notify('PDF’yi yeniden bağla.');return;}
    if(pdfUrl)URL.revokeObjectURL(pdfUrl);
    pdfUrl=URL.createObjectURL(pdf instanceof Blob?pdf:new Blob([pdf],{type:'application/pdf'}));
    dialog.innerHTML=`<h2>${esc(source.title)}</h2><p>PDF sayfası ${page}. Bazı görüntüleyiciler dosyayı ilk sayfadan açabilir.</p><div class="actions"><a class="button" href="${pdfUrl}#page=${page}" target="_blank" rel="noopener">${icon('folder_open')} PDF’yi aç</a>${button('Kapat','close-dialog','','','secondary')}</div>`;
    if(!dialog.open)dialog.showModal();
  }catch {notify('PDF okunamadı.');}
}
function downloadBlob(blob,name){
  const url=URL.createObjectURL(blob);
  const anchor=document.createElement('a');anchor.href=url;anchor.download=name;
  document.body.append(anchor);anchor.click();anchor.remove();
  setTimeout(()=>URL.revokeObjectURL(url),60000);
}
async function copyProgress(){
  const code=JSON.stringify({kind:'klar-progress',version:1,state});
  try{
    await navigator.clipboard.writeText(code);
    notify('İlerleme kodu kopyalandı.');
  }catch{
    dialog.innerHTML=`<h2>İlerleme kodu</h2><p>Seçili metni kopyala ve özel Klar’a yapıştır.</p><label class="field">İlerleme kodu<textarea readonly rows="5">${esc(code)}</textarea></label><div class="actions">${button('Kapat','close-dialog','','','secondary')}</div>`;
    if(!dialog.open)dialog.showModal();
    const field=dialog.querySelector('textarea');
    field.focus();field.select();
  }
}
async function showRecordings(){
  const box=document.querySelector('#recording-list');
  if(!box)return;
  const records=[];
  for(const key of files)if(String(key).startsWith('recording:')){
    const record=await readDevice(key).catch(()=>null);
    if(record)records.push({key,...record});
  }
  if(!box.isConnected)return;
  records.sort((a,b)=>b.at-a.at);
  box.innerHTML=records.length?records.map(record=>`<div class="list-item"><div class="grow"><strong>${esc(record.title)}</strong><p>${fmt(new Date(record.at),{day:'numeric',month:'short'})}</p></div>
    <button type="button" class="icon-btn" data-action="listen-record" data-value="${esc(record.key)}" aria-label="Kaydı aç">${icon('play_arrow')}</button></div>`).join(''):'<p class="small muted">Henüz kayıt yok.</p>';
}
async function saveRecording(blob,title){
  const key='recording:'+id();
  await writeDevice(key,{blob,title,at:Date.now()});files.add(key);
  notify('Konuşma kaydı cihazına kaydedildi.');
}
let activeRecordUrl;
async function openRecording(key){
  const record=await readDevice(key).catch(()=>null);
  if(!record){notify('Kayıt bulunamadı.');return;}
  if(activeRecordUrl)URL.revokeObjectURL(activeRecordUrl);
  activeRecordUrl=URL.createObjectURL(record.blob);
  const extension=record.blob.type.includes('mp4')?'m4a':record.blob.type.includes('ogg')?'ogg':'webm';
  dialog.innerHTML=`<h2>${esc(record.title)}</h2><audio controls src="${activeRecordUrl}"></audio><div class="actions"><a class="button secondary" href="${activeRecordUrl}" download="klar-konusma.${extension}">${icon('download')} İndir</a>${button('Kaydı sil','delete-record',key,'','ghost')}${button('Kapat','close-dialog','','','secondary')}</div>`;
  if(!dialog.open)dialog.showModal();
}
async function showOfflineStatus(){
  const info=document.querySelector('#offline-info');
  if(!info)return;
  if(!('serviceWorker' in navigator)){info.textContent='Bu tarayıcıda çevrimdışı kurulum kullanılamıyor.';return;}
  const registration=await navigator.serviceWorker.getRegistration().catch(()=>null);
  if(info.isConnected)info.textContent=registration?.active?'Uygulama ve temel çalışma içeriği çevrimdışı açılabilir.':'Çevrimdışı içerik ilk ziyaretinde hazırlanır.';
}
const session=createSession({main,state,persist,to,notify,play,stopSpeech,saveRecording,
  findSource:sourceById,openPdf,topicName:key=>lessonById.get(key)?.title||'A1',
  unitResultAction,
  onComplete:(record,topic,step)=>{
    if(topic&&step&&record.completed)markUnitStep(state,topic,step,record.at);
    const index=state.sessions.findIndex(item=>item.id===record.id);
    if(index<0)state.sessions.push(record);else state.sessions[index]=record;
    persist();
  },
});

document.addEventListener('click',event=>{
  const target=event.target.closest('[data-action]');
  if(!target)return;
  const action=target.dataset.action,key=target.dataset.value||'';
  if(action.startsWith('session-')){session.action(action.slice(8),key);return;}
  if(action==='toggle-theme'){
    state.settings.theme=document.documentElement.dataset.theme==='dark'?'light':'dark';
    persist();applyTheme();
    const select=document.querySelector('#theme-setting');
    if(select)select.value=state.settings.theme;
    return;
  }
  if(action==='unit-jump'){jumpToUnitSection(key);return;}
  if(action==='unit-step'){startUnitStep(key);return;}
  if(action==='unit-lesson-done'){
    const unit=lessonById.get(key);
    if(!unit||unitProgress(state,key).done.includes('lesson'))return;
    const at=Date.now();
    markUnitStep(state,key,'lesson',at);
    if(!state.lessons[key])state.unitFocus={topic:key,at};
    state.sessions.push({id:id(),at,title:unit.title+' · Ders notu',minutes:Math.max(1,Math.min(120,Math.round((at-viewStarted)/60000))),completed:true});
    persist();
    const step=unitProgress(state,key).next;
    if(step)startUnitStep(key+'|'+step.id);else render();
    return;
  }
  if(action==='cards'){startCards(key);return;}
  if(action==='exam'){startExam(key);return;}
  if(action==='one-task'){const task=tasks.find(q=>q.id===key);if(task)startQuiz([task],skills[task.skill].name);return;}
  if(action==='book-quiz'){
    const match=currentBookRef();
    if(match)startQuiz(bookRefTasks(match.source,match.ref),match.ref.label);
    return;
  }
  if(action==='skill-quiz'){const topic=currentTopic()||taskTopic;const group=tasks.filter(t=>t.skill===key&&(!topic||t.topic===topic)&&(!taskType||t.kind===taskType));startQuiz(currentPriority(group).slice(0,key==='speaking'||key==='writing'?3:8),skills[key].name);return;}
  if(action==='word-test'){startQuiz(currentPriority(tasks.filter(t=>t.skill==='words'&&t.subtype===key&&(!(currentTopic()||wordTopic)||t.topic===(currentTopic()||wordTopic)))).slice(0,12),'Kelime testi');return;}
  if(action==='diagnostic'){startQuiz(['grammar','listening','reading','words'].flatMap(skill=>currentPriority(tasks.filter(t=>t.skill===skill)).slice(0,3)),'Başlangıç yoklaması');return;}
  if(action==='mistakes'){startQuiz(mistakes(state,tasks).slice(0,12).map(item=>item.task),'Yanlış tekrarı');return;}
  if(action==='speak-word'){const word=words.find(w=>w.id===key);if(word)play(word.de,word.audio);return;}
  if(action==='example'){const [topic,i]=key.split('|');const example=lessonById.get(topic)?.examples[i];if(example)play(example[0],`./assets/audio/example-${topic}-${i}.mp3`);return;}
  if(action==='more-words'){wordLimit+=60;document.querySelector('#word-results').innerHTML=wordList();return;}
  if(action==='more-tasks'){taskLimit+=30;render();return;}
  if(action==='import-pack'){chooseFile('.json,application/json',async file=>{await installPack(await readJson(file));render();notify('Kişisel çalışma paketin yüklendi.');});return;}
  if(action==='bind-pdf'){bindPdf(key);return;}
  if(action==='source-page'){openPdf(key);return;}
  if(action==='copy-progress'){void copyProgress();return;}
  if(action==='close-dialog'){dialog.close();return;}
  if(action==='listen-record'){openRecording(key);return;}
  if(action==='delete-record'){deleteDevice(key).then(()=>{files.delete(key);dialog.close();showRecordings();notify('Ses kaydı silindi.');}).catch(()=>notify('Ses kaydı silinemedi.'));return;}
  if(action==='backup'){downloadBlob(new Blob([JSON.stringify({kind:'klar-backup',version:1,state,pack})],{type:'application/json'}),`klar-yedek-${localKey()}.json`);return;}
  if(action==='restore')chooseFile('.json,application/json',async file=>{
    const backup=await readJson(file);
    if(backup?.kind!=='klar-backup'||backup.version!==1||!backup.state||!Array.isArray(backup.state.sessions))throw new Error('Geçerli bir Klar yedek dosyası seç.');
    if(backup.pack&&(backup.pack.revision||1)>=(pack?.revision||1))await installPack(backup.pack);
    Object.assign(state,mergeState(state,backup.state));
    persist();applyTheme();render();notify('Yedekteki çalışmalar cihazındaki ilerlemeye eklendi.');
  });
});
document.addEventListener('submit',event=>{
  if(event.target.id!=='settings-form')return;
  event.preventDefault();
  const data=new FormData(event.target);
  const days=data.getAll('days').map(Number);
  if(!days.length){notify('En az bir çalışma günü seç.');return;}
  state.settings=normalizeState({settings:{daily:Number(data.get('daily')),days,level:data.get('level'),examDate:data.get('examDate'),theme:state.settings.theme}}).settings;
  persist();to('plan');notify('Çalışma planı güncellendi.');
});
document.addEventListener('input',event=>{
  if(event.target.id==='word-query'){wordQuery=event.target.value;wordLimit=60;document.querySelector('#word-results').innerHTML=wordList();}
  if(event.target.matches('[data-session-input]'))session.input(event.target);
});
document.addEventListener('change',event=>{
  if(event.target.id==='theme-setting'){state.settings.theme=event.target.value;persist();applyTheme();return;}
  if(event.target.id==='exam-set'){selectedExam=Number(event.target.value)||0;render();return;}
  if(event.target.id==='task-topic'){taskTopic=event.target.value;taskLimit=30;render();return;}
  if(event.target.id==='task-type'){taskType=event.target.value;taskLimit=30;render();return;}
  if(event.target.id==='word-topic'){wordTopic=event.target.value;wordLimit=60;document.querySelector('#word-results').innerHTML=wordList();}
});
dialog.addEventListener('close',()=>{dialog.querySelector('audio')?.pause();if(activeRecordUrl){URL.revokeObjectURL(activeRecordUrl);activeRecordUrl=null;}});
window.addEventListener('hashchange',historyRoute);
window.addEventListener('pagehide',()=>{session.stopRecording();stopSpeech();});
document.addEventListener('visibilitychange',()=>{if(document.hidden)session.pauseTime();else if(route[0]==='oturum')session.resumeTime();});
historyRoute();
Promise.all([readDevice('pack'),deviceKeys()]).then(([stored,keys])=>{
  if(stored){pack=validatePack(stored);rebuild();}
  files=new Set(keys);
  if(route[0]!=='oturum'&&!main.contains(document.activeElement))render();
  else if(route[0]!=='oturum'&&document.activeElement===main)render();
}).catch(()=>notify('Bu tarayıcıda dosya depolaması kullanılamıyor.'));
if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js').then(()=>navigator.serviceWorker.ready).then(showOfflineStatus).catch(()=>{});
