import {lessons,skills,externalSources} from './data/course.js';
import {words as baseWords} from './data/words.js';
import {tasks as firstTasks,examParts} from './data/tasks.js';
import {extraTasks,examSetB} from './data/extra.js';
import {loadState,storeState,normalizeState,mergeState,activity,addDays,localKey,fromKey,examDistance,dueCards,mistakes,skillStats,recommendation,weekPlan,monthPlan,lastAttempts,id} from './study.js';
import {readDevice,writeDevice,deviceKeys,deleteDevice,validatePack} from './device.js';
import {esc,icon,tile,button,link,inline,pill,track,fmt,pct,intro,head,option} from './ui.js';
import {createSession} from './session.js';
import {vocabularyQuestions} from './data/vocab-quiz.js';
import {drills} from './data/drills.js';

const main=document.querySelector('#content');
const dialog=document.querySelector('#dialog');
const status=document.querySelector('#status');
const pages=[
  ['bugun','Bugün','home'],['calis','Çalış','book_2'],['deneme','Deneme','event'],
  ['ilerleme','İlerleme','bar_chart'],['plan','Planım','calendar_month'],
];
const names={...Object.fromEntries(pages.map(([key,name])=>[key,name])),kaynaklar:'Kaynaklar',ayarlar:'Ayarlar',oturum:'Çalışma oturumu'};
const baseTasks=[...firstTasks,...extraTasks,...drills];
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
let taskLimit=30, taskTopic='', taskType='';
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
    taskLimit=30;taskTopic='';taskType='';
  }
  route=parts;
  render();startOfView();
}

function quick(skill){
  const s=skills[skill];
  return `<a href="#calis/${skill}" class="quick card">${tile(s.icon,skill)}<span><b>${s.name}</b><small lang="de">${s.german}</small></span><span class="mi arrow" aria-hidden="true">chevron_right</span></a>`;
}
function goal(label,done,target,unit=''){
  return `<div><div class="goal-label"><span>${esc(label)}</span><span>${done} / ${target} ${esc(unit)}</span></div>${track(done,target,label)}</div>`;
}
function dayCells(stats){
  return `<div class="week-grid">${stats.week.map((day,i)=>`<div class="day-cell"><span>${weekdays[i][0]}</span><span class="day-dot ${day.minutes?'done':''} ${day.key===stats.today?'today':''}" aria-label="${fmt(day.date,{weekday:'long'})}, ${day.minutes} dakika">${day.minutes?icon('check'):day.date.getDate()}</span></div>`).join('')}</div>`;
}
function suggestionLink(focus,label='Çalışmaya başla'){
  if(focus.type==='lesson')return link(label,'#calis/konu/'+focus.topic,'arrow_forward');
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
  const next=lessonById.get(focus.topic);
  const heroTitle=next?.title||focus.title;
  const recent=session.hasUnfinished();
  return intro('Bugün',examDays===null?'Almanca A1 çalışma planın.':examDays<0?'Sınav tarihi geçti. Planından yeni bir tarih belirleyebilirsin.':examDays===0?'Bugün sınav günün.':`Goethe A1 sınavına ${examDays} gün kaldı.`,pill('Goethe A1 · Start Deutsch 1','school'))+
    `<div class="dashboard"><div class="stack">
      <section class="hero card"><div class="hero-copy">
        <div class="hero-label">${icon(studied?'check_circle':'bolt')} ${studied?'Günlük hedef tamamlandı':'Bugünün odağı'}</div>
        <h2>${esc(heroTitle)}</h2><p>${esc(focus.description)}</p>
        ${recent?link('Oturuma dön','#oturum','arrow_forward'):suggestionLink(focus)}
      </div></section>
      <section>${head('Sınav becerileri',inline('Deneme çöz','#deneme'))}
        <div class="quick-list">${examSkills.map(quick).join('')}</div>
      </section>
      <section>${head('A1 çalışma rotası',inline('Tüm konular','#calis'))}
        <div class="quick-list">${quick('words')}${quick('grammar')}</div>
      </section>
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
      ${pack?`<section class="card"><div class="row">${tile('folder_open')}<div><h3>Kaynak paketin hazır</h3><p class="small muted">${pack.sources.length} kaynak · ${pack.tasks.length} ek görev</p></div></div><div class="actions">${inline('Kaynakları aç','#kaynaklar')}</div></section>`:
        `<section class="card"><div class="row">${tile('folder_open')}<div><h3>Kendi kaynaklarını ekle</h3><p class="small muted">PDF’lerinden hazırlanan Klar paketini yükle.</p></div></div><div class="actions">${button('Paket yükle','import-pack','','upload','secondary slim')}${inline('Kaynaklar','#kaynaklar')}</div></section>`}
    </div></div>`;
}

function tabs(active){
  const opts=[['','Konular'],...Object.entries(skills).map(([key,s])=>[key,s.name])];
  return `<div class="tabs" aria-label="Çalışma türü">${opts.map(([key,name])=>`<a class="tab ${active===key?'active':''}" ${active===key?'aria-current="page"':''} href="#calis${key?'/'+key:''}">${esc(name)}</a>`).join('')}</div>`;
}
function topicCard(l){
  const done=Boolean(state.lessons[l.id]);
  return `<a class="module card" href="#calis/konu/${l.id}">
    <div class="row between"><span class="module-name" lang="de">${esc(l.german)}</span>${done?pill('Çalışıldı','check'):''}</div>
    <h3>${esc(l.title)}</h3><p>${esc(l.description)}</p>
    <div class="row"><span class="small muted">${words.filter(w=>w.topic===l.id).length} kelime</span><span class="mi arrow" aria-hidden="true">arrow_forward</span></div>
  </a>`;
}
function lessonView(l){
  const related=tasks.filter(t=>t.topic===l.id);
  const sourceRefs=(pack?.sources||[]).flatMap(source=>source.refs.filter(ref=>ref.topic===l.id).map(ref=>({source,ref})));
  return `${link('Konulara dön','#calis','arrow_back','ghost slim')}${intro(l.title,l.description,pill(l.german))}
    <div class="dual">
      <section class="card lesson-body"><h2>Ders notu</h2><p class="lesson-note">${esc(l.note)}</p>
        <div>${l.examples.map(([de,tr],i)=>`<div class="row between lesson-example"><div><strong lang="de">${esc(de)}</strong><p>${esc(tr)}</p></div><button class="icon-btn" type="button" data-action="example" data-value="${l.id}|${i}" aria-label="Cümleyi dinle">${icon('volume_up')}</button></div>`).join('')}</div>
        <div class="actions">${related.length?button('Konu alıştırması','topic-quiz',l.id,'play_arrow'):''}${button('Kelime kartları','cards',l.id,'library_books','secondary')}</div>
      </section>
      <div class="stack">
        <section class="card"><h2>Bu konuda çalış</h2><div class="meta-list">${[...examSkills,'grammar'].filter(key=>related.some(t=>t.skill===key)).map(key=>`<div class="row between"><span>${esc(skills[key].name)} · ${related.filter(t=>t.skill===key).length} görev</span>${button('Başlat','topic-skill',l.id+'|'+key,'','secondary slim')}</div>`).join('')}</div></section>
        ${sourceRefs.length?`<section class="card"><h2>İlgili kaynak sayfaları</h2><div class="source-pages">${sourceRefs.map(({source,ref})=>`<button type="button" data-action="source-page" data-value="${source.id}|${ref.page}">${esc(source.title)} · s. ${ref.page} · ${esc(ref.label)}</button>`).join('')}</div></section>`:''}
      </div>
    </div>`;
}
function searchWords(){
  const normalized=value=>value.toLocaleLowerCase('tr').normalize('NFD').replace(/\p{Diacritic}/gu,'').replaceAll('ı','i').replaceAll('ß','ss');
  const query=normalized(wordQuery.trim());
  return words.filter(w=>(!wordTopic||w.topic===wordTopic)&&(!query||normalized(w.de+' '+w.tr).includes(query)));
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
  const due=dueCards(state,words).length;
  return intro('Kelime kartları',`${words.length} Almanca kelime ve kalıp. Türkçe karşılığına bak, telaffuzu dinle ve kendini dene.`)+tabs('words')+
    `<section class="card">
      <div class="row wrap between"><div class="row wrap">
        <label class="search">${icon('search')}<input type="search" id="word-query" aria-label="Almanca veya Türkçe kelime ara" placeholder="Almanca veya Türkçe ara" value="${esc(wordQuery)}"></label>
        <label class="field"><select id="word-topic" aria-label="Konu seç">${option('','Tüm konular',!wordTopic)}${lessons.map(l=>option(l.id,l.title,wordTopic===l.id)).join('')}</select></label>
      </div><div class="row wrap">${due?button(`${due} kartı tekrarla`,'cards','due','refresh','secondary'):''}${button('Kartları çalış','cards',wordTopic||'new','play_arrow')}</div></div>
      <div class="actions">${button('Almanca → Türkçe','word-test','de-tr','','secondary slim')}${button('Türkçe → Almanca','word-test','tr-de','','secondary slim')}${button('Artikel testi','word-test','artikel','','secondary slim')}</div>
      <div id="word-results" class="meta-list">${wordList()}</div>
    </section>`;
}
function skillView(key){
  const s=skills[key];
  const available=tasks.filter(t=>t.skill===key);
  const completed=lastAttempts(state);
  const types={choice:'Çoktan seçmeli',form:key==='grammar'?'Boşluk doldurma':key==='listening'?'Dikte':'Form',match:'Eşleştirme',order:'Sıralama',writing:'Mektup',speaking:'Konuşma kartı'};
  const listed=available.filter(t=>(!taskTopic||t.topic===taskTopic)&&(!taskType||t.kind===taskType));
  return intro(s.name,s.description,pill(s.german))+tabs(key)+
    `<section class="card">${head('Alıştırmalar',button('Önerilen seti çöz','skill-quiz',key,'play_arrow'),`${listed.length} görev`)}
      <div class="row wrap filters"><label class="field"><select id="task-topic" aria-label="Alıştırma konusu">${option('','Tüm konular',!taskTopic)}${lessons.filter(l=>available.some(t=>t.topic===l.id)).map(l=>option(l.id,l.title,taskTopic===l.id)).join('')}</select></label>
      <label class="field"><select id="task-type" aria-label="Alıştırma türü">${option('','Tüm türler',!taskType)}${[...new Set(available.map(t=>t.kind))].map(kind=>option(kind,types[kind],taskType===kind)).join('')}</select></label></div>
      <div class="list">${listed.slice(0,taskLimit).map(t=>`<button type="button" class="list-item" data-action="one-task" data-value="${esc(t.id)}">${tile(s.icon,key)}<span class="grow"><strong>${esc(t.stem)}</strong><p>${esc(lessonById.get(t.topic)?.title||s.name)}${t.source?' · Kaynak paketi':''} · ${types[t.kind]}</p></span>${completed.has(t.id)?pill(completed.get(t.id).self?'Pratik yapıldı':pct(completed.get(t.id).score),'check'):''}<span class="mi arrow" aria-hidden="true">chevron_right</span></button>`).join('')}</div>
      ${listed.length>taskLimit?`<div class="actions">${button('Daha fazla göster','more-tasks','','','secondary')}</div>`:''}
    </section>`;
}
function learn(){
  const [,tab,topic]=route;
  if(tab==='konu'&&lessonById.has(topic))return lessonView(lessonById.get(topic));
  if(tab==='words')return wordsView();
  if(skillById(tab))return skillView(tab);
  return intro('Çalış', 'A1 konularında adım adım ilerle veya doğrudan bir sınav becerisine geç.')+tabs('')+
    `<div class="modules">${lessons.map(topicCard).join('')}</div>`;
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
          return `<div class="list-item plan-day ${day.key===stats.today?'today':''}"><time datetime="${day.key}">${fmt(day.date,{day:'numeric',month:'short'})}<br><span class="muted">${fmt(day.date,{weekday:'short'})}</span></time><div><strong>${esc(title)}</strong><p>${minutes?`${minutes} dk tamamlandı`:day.scheduled&&!day.past?`${state.settings.daily} dk hedef`:''}</p></div>${action}</div>`;
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
  return intro('Kaynaklar','Kendi PDF’lerine dön, kişisel çalışma paketini yükle veya ücretsiz resmî örnekleri aç.')+
    `<div class="stack">
      <section class="card tint"><div class="row wrap between"><div><h2>Kişisel çalışma paketi</h2><p>${pack?`${pack.sources.length} kaynak, ${pack.tasks.length} görev ve ${pack.words.length} ek kart cihazında.`:'Klar-kaynak-paketi.json dosyasını bu cihaza ekle.'}</p></div>${button(pack?'Paketi güncelle':'Paket yükle','import-pack','','upload')}</div></section>
      ${pack?`<section>${head('Kütüphanem')}
        <div class="dual">${pack.sources.map(s=>`<article class="card source-card">
          <div class="row">${tile('book_2')}<div><h3>${esc(s.title)}</h3><p class="small">${s.pages} PDF sayfası</p></div></div>
          <p class="small">${esc(s.note)}</p>
          <div class="row wrap">${files.has('pdf:'+s.id)?button('PDF’yi aç','source-page',s.id+'|1','folder_open','secondary slim'):button('PDF bağla','bind-pdf',s.id,'upload','secondary slim')}
          ${files.has('pdf:'+s.id)?button('Dosyayı değiştir','bind-pdf',s.id,'','ghost slim'):''}</div>
          ${s.refs.length?`<details><summary>İlgili sayfalar</summary><div class="source-pages">${s.refs.map(ref=>`<button type="button" data-action="source-page" data-value="${s.id}|${ref.page}">s. ${ref.page} · ${esc(ref.label)}</button>`).join('')}</div></details>`:''}
        </article>`).join('')}</div></section>`:''}
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
  document.querySelector('#breadcrumb').textContent=page==='calis'&&route.length>1?'Çalışma alanı':page==='oturum'?'Çalışma oturumu':'';
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
function mixedTopic(topic){
  const group=tasks.filter(t=>t.topic===topic);
  return ['grammar','listening','reading','writing','speaking'].flatMap(skill=>currentPriority(group.filter(t=>t.skill===skill)).slice(0,skill==='grammar'?2:1));
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
function startCards(key){
  const due=dueCards(state,words);
  const available=key==='due'?due:key==='new'?[...due,...words.filter(w=>!state.cards[w.id])]:words.filter(w=>w.topic===key).sort((a,b)=>(state.cards[a.id]?.due||0)-(state.cards[b.id]?.due||0));
  if(!available.length){notify('Şimdilik tekrarı gelen kart yok.');return;}
  session.cards(available.slice(0,12),key==='due'?'Kelime tekrarı':'Kelime kartları',route.join('/'));
  to('oturum');
}
function chooseFile(accept,onFile){
  fileInput.value='';
  fileInput.accept=accept;
  fileInput.onchange=async()=>{
    const file=fileInput.files?.[0];
    if(file)try {await onFile(file);}
    catch(error){notify(error.message||'Dosya açılamadı.');}
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
function bindPdf(key){
  const source=sourceById(key);
  if(!source)return;
  chooseFile('.pdf,application/pdf',async file=>{
    if(!file.name.toLowerCase().endsWith('.pdf')||!(await file.slice(0,5).text()).startsWith('%PDF-'))throw new Error('Bir PDF dosyası seç.');
    if(file.size>120*1024*1024)throw new Error('PDF 120 MB sınırını aşıyor.');
    await writeDevice('pdf:'+key,file);
    files.add('pdf:'+key);
    render();notify(source.title+' bağlandı.');
  });
}
async function openPdf(value){
  const [key,page]=value.split('|');
  if(!files.has('pdf:'+key)){bindPdf(key);return;}
  try {
    const pdf=await readDevice('pdf:'+key);
    if(!pdf){files.delete('pdf:'+key);render();notify('PDF’yi yeniden bağla.');return;}
    if(pdfUrl)URL.revokeObjectURL(pdfUrl);
    pdfUrl=URL.createObjectURL(pdf);
    const source=sourceById(key);
    dialog.innerHTML=`<h2>${esc(source.title)}</h2><p>PDF sayfası ${esc(page)}. Bazı görüntüleyiciler dosyayı ilk sayfadan açabilir.</p><div class="actions"><a class="button" href="${pdfUrl}#page=${Number(page)||1}" target="_blank" rel="noopener">${icon('folder_open')} PDF’yi aç</a>${button('Kapat','close-dialog','','','secondary')}</div>`;
    if(!dialog.open)dialog.showModal();
  }catch {notify('PDF okunamadı.');}
}
function downloadBlob(blob,name){
  const url=URL.createObjectURL(blob);
  const anchor=document.createElement('a');anchor.href=url;anchor.download=name;
  document.body.append(anchor);anchor.click();anchor.remove();
  setTimeout(()=>URL.revokeObjectURL(url),60000);
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
  onComplete:(record,topic)=>{
    if(topic&&record.completed)state.lessons[topic]=record.at;
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
  if(action==='cards'){startCards(key);return;}
  if(action==='exam'){startExam(key);return;}
  if(action==='one-task'){const task=tasks.find(q=>q.id===key);if(task)startQuiz([task],skills[task.skill].name);return;}
  if(action==='skill-quiz'){const group=tasks.filter(t=>t.skill===key&&(!taskTopic||t.topic===taskTopic)&&(!taskType||t.kind===taskType));startQuiz(currentPriority(group).slice(0,key==='speaking'||key==='writing'?3:8),skills[key].name);return;}
  if(action==='word-test'){startQuiz(currentPriority(tasks.filter(t=>t.skill==='words'&&t.subtype===key&&(!wordTopic||t.topic===wordTopic))).slice(0,12),'Kelime testi');return;}
  if(action==='diagnostic'){startQuiz(['grammar','listening','reading','words'].flatMap(skill=>currentPriority(tasks.filter(t=>t.skill===skill)).slice(0,3)),'Başlangıç yoklaması');return;}
  if(action==='topic-quiz'){startQuiz(mixedTopic(key),lessonById.get(key).title,{topic:key});return;}
  if(action==='topic-skill'){const [topic,skill]=key.split('|');startQuiz(currentPriority(tasks.filter(t=>t.topic===topic&&t.skill===skill)).slice(0,8),lessonById.get(topic).title+' · '+skills[skill].name);return;}
  if(action==='mistakes'){startQuiz(mistakes(state,tasks).slice(0,12).map(item=>item.task),'Yanlış tekrarı');return;}
  if(action==='speak-word'){const word=words.find(w=>w.id===key);if(word)play(word.de,word.audio);return;}
  if(action==='example'){const [topic,i]=key.split('|');const example=lessonById.get(topic)?.examples[i];if(example)play(example[0],`./assets/audio/example-${topic}-${i}.mp3`);return;}
  if(action==='more-words'){wordLimit+=60;document.querySelector('#word-results').innerHTML=wordList();return;}
  if(action==='more-tasks'){taskLimit+=30;render();return;}
  if(action==='import-pack'){chooseFile('.json,application/json',async file=>{await installPack(await readJson(file));render();notify('Kişisel çalışma paketin yüklendi.');});return;}
  if(action==='bind-pdf'){bindPdf(key);return;}
  if(action==='source-page'){openPdf(key);return;}
  if(action==='close-dialog'){dialog.close();return;}
  if(action==='listen-record'){openRecording(key);return;}
  if(action==='delete-record'){deleteDevice(key).then(()=>{files.delete(key);dialog.close();showRecordings();notify('Ses kaydı silindi.');}).catch(()=>notify('Ses kaydı silinemedi.'));return;}
  if(action==='backup'){downloadBlob(new Blob([JSON.stringify({kind:'klar-backup',version:1,state,pack})],{type:'application/json'}),`klar-yedek-${localKey()}.json`);return;}
  if(action==='restore')chooseFile('.json,application/json',async file=>{
    const backup=await readJson(file);
    if(backup?.kind!=='klar-backup'||backup.version!==1||!backup.state||!Array.isArray(backup.state.sessions))throw new Error('Geçerli bir Klar yedek dosyası seç.');
    if(backup.pack)await installPack(backup.pack);
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
