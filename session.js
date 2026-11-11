import {skills} from './data/course.js';
import {gradeTask,formMatches,weightedSelf,id,reviewCard} from './study.js';
import {esc,icon,button,link,pill,track,pct,head} from './ui.js';

export function createSession(deps){
  const {main,state,persist,to,notify,play,stopSpeech,saveRecording,findSource,openPdf,topicName,onComplete,unitResultAction}=deps;
  let current=null,clock,recorder,microphoneRequest,recordingUrls=[];
  const currentTask=()=>current?.items[current.index];
  const focusCard=()=>requestAnimationFrame(()=>main.querySelector('.study-card h2')?.focus({preventScroll:true}));
  const name=skill=>skills[skill]?.name||'Alıştırma';
  const taskResponse=task=>current.responses.get(task.id);
  const answerChoice=(task,response)=>task.options[Number.isInteger(response)?response:-1];
  const currentPart=()=>current.parts?.[current.partIndex];
  const sectionTitle=()=>current.exam?name(currentPart().skill):current.title;
  const letters=['A','B','C','D'];
  const safeUrl=url=>typeof url==='string'&&/^\.\/assets\/audio\/[a-z0-9-]+\.mp3$/.test(url)?url:'';
  function fresh(items,title,returnRoute,options={}){
    stopRecording();
    stopSpeech();
    clearInterval(clock);
    recordingUrls.forEach(url=>URL.revokeObjectURL(url));
    recordingUrls=[];
    current={items,title,returnRoute,started:Date.now(),activityId:id(),elapsed:0,activeAt:Date.now(),index:0,results:new Map(),
      responses:new Map(),recordings:new Map(),plays:new Map(),checks:new Map(),completed:false,show:false,...options};
  }
  function quiz(items,title,options){
    fresh(items,title,options.returnRoute,{type:'quiz',...options});
    if(current.exam){
      current.partIndex=0;
      current.parts=options.parts.map((part,i)=>({...part,start:options.parts.slice(0,i).reduce((n,p)=>n+p.tasks.length,0)}));
      current.deadline=Date.now()+currentPart().minutes*60000;
    }
  }
  function cards(items,title,returnRoute,options={}){
    fresh(items,title,returnRoute,{type:'cards',reviewed:0,...options});
  }
  function pauseTime(){
    if(!current||!current.activeAt)return;
    current.elapsed+=Date.now()-current.activeAt;
    current.activeAt=null;
    clearInterval(clock);
  }
  function resumeTime(){
    if(!current||current.completed)return;
    if(!current.activeAt)current.activeAt=Date.now();
    clearInterval(clock);
    if(current.exam)clock=setInterval(tick,300);
  }
  function leave(){
    if(!current)return;
    stopRecording();
    stopSpeech();
    pauseTime();
    if(!current.exam&&!current.completed&&(current.results.size||current.reviewed))finish(false);
    to(current.returnRoute||'calis');
  }
  function tick(){
    if(!current?.exam||current.completed)return;
    const remaining=Math.max(0,Math.ceil((current.deadline-Date.now())/1000));
    const timer=document.querySelector('#exam-clock');
    if(timer)timer.textContent=`${String(Math.floor(remaining/60)).padStart(2,'0')}:${String(remaining%60).padStart(2,'0')}`;
    if(!remaining){
      stopRecording();
      stopSpeech();
      if(current.partIndex+1<current.parts.length){advancePart(true);notify('Bölüm süresi doldu. Sıradaki bölüm başladı.');}
      else {finish(true);notify('Süre doldu. Sonuçlarını inceleyebilirsin.');}
    }
  }
  function advancePart(automatic=false){
    current.partIndex++;
    current.index=currentPart().start;
    current.deadline=(automatic?current.deadline:Date.now())+currentPart().minutes*60000;
    render();
    focusCard();
  }
  function updateAttempt(task,result){
    const score=result.total?result.earned/result.total:0;
    const old=current.results.get(task.id);
    const record={id:old?.attemptId||id(),task:task.id,skill:task.skill,at:Date.now(),score,self:result.self};
    current.results.set(task.id,{...result,attemptId:record.id});
    const existing=state.attempts.findIndex(a=>a.id===record.id);
    if(existing<0)state.attempts.push(record);else state.attempts[existing]=record;
    persist();
  }
  function saveExamSummary(){
    const values=[...current.results.values()].filter(result=>!result.self||result.assessed);
    const total=values.reduce((n,r)=>n+r.total,0), earned=values.reduce((n,r)=>n+r.earned,0);
    const pending=[...current.results.values()].filter(r=>r.self&&!r.assessed).length;
    if(total){
      const score={id:current.examId||id(),skill:current.exam,set:current.examSet,at:current.finishedAt,score:earned/total,pending};
      current.examId=score.id;
      const index=state.exams.findIndex(item=>item.id===score.id);
      if(index>=0)state.exams[index]=score;else state.exams.push(score);
      persist();
    }
    return {total,earned,pending};
  }
  function finish(completed){
    if(current.completed)return;
    pauseTime();stopRecording();stopSpeech();
    current.completed=true;
    current.finishedAt=Date.now();
    current.finishedNaturally=completed;
    if(current.exam&&completed){
      for(const task of current.items){
        const result=gradeTask(task,taskResponse(task));
        if(result.self)current.results.set(task.id,result);
        else updateAttempt(task,result);
      }
      saveExamSummary();
    }
    logActivity(completed);
    render();
    focusCard();
  }

  function logActivity(completed){
    const minutes=Math.max(1,Math.min(120,Math.round(current.elapsed/60000)));
    onComplete({id:current.activityId,title:current.title,at:current.finishedAt||Date.now(),minutes,completed},current.topic,current.unitStep);
  }
  function checkpoint(){
    if(current&&!current.completed&&!current.exam&&(current.results.size||current.reviewed))logActivity(false);
  }

  function rubricItems(task){
    return task.kind==='writing'?[...task.points.slice(0,3),'Uygun hitap ve kapanış ekledim.']:task.points;
  }
  function model(task){
    return task.model?`<div class="model"><strong>Örnek yanıt</strong><p lang="de">${esc(task.model)}</p>${task.modelTr?`<p class="small muted">${esc(task.modelTr)}</p>`:''}</div>`:
      '<p class="callout">Görevdeki her madde için bir veya iki kısa cümle yaz. Alıcıya uygun bir selamlama ve kapanış ekle.</p>';
  }
  function rubric(task,scope){
    const checks=current.checks.get(task.id)||[];
    const result=current.results.get(task.id);
    return `${model(task)}<fieldset class="rubric"><legend class="small"><strong>Kendi yanıtını kontrol et</strong></legend>
      ${rubricItems(task).map((point,i)=>`<label><input type="checkbox" data-session-input="rubric" data-task="${esc(task.id)}" value="${i}" ${checks[i]?'checked':''}><span>${esc(point)}</span></label>`).join('')}
    </fieldset>${button(result?.assessed?'Öz puanı güncelle':'Öz puanı kaydet',scope,task.id,'check','secondary slim')}${result?.assessed?` <span class="small muted">${result.earned} / ${result.total} puan</span>`:''}`;
  }
  function feedback(task){
    const response=taskResponse(task),result=current.results.get(task.id);
    if(['choice','form','match','order'].includes(task.kind)){
      const graded=result||gradeTask(task,response);
      return `<div class="callout feedback ${graded.earned===graded.total?'':'error'}">
        <strong>${graded.earned===graded.total?'Doğru!':graded.total>1?`${graded.earned} / ${graded.total} alan doğru`:'Tekrar bakalım'}</strong>
        ${task.kind==='order'?`<p lang="de"><b>${esc(task.tokens.join(' '))}</b></p>`:''}
        ${task.kind==='choice'?`<p>Doğru cevap: <b lang="de">${esc(task.options[task.answer])}</b></p>`:''}
        ${task.explain?`<p>${esc(task.explain)}</p>`:''}
        ${task.transcript?`<details><summary>Almanca ses metni</summary><p lang="de">${esc(task.transcript)}</p></details>`:''}
      </div>`;
    }
    return `<div class="feedback">${rubric(task,'session-self')}</div>`;
  }
  function recordingControls(task,allowRecord){
    const recording=current.recordings.get(task.id);
    const active=recorder?.task===task.id;
    return `<div class="actions">
      ${allowRecord?button(active?'Kaydı durdur':'Sesimi kaydet',active?'session-stop-record':'session-record',task.id,'mic','secondary'):''}
      ${recording&&!recording.saved?button('Kaydı cihazda sakla','session-save-record',task.id,'download','secondary slim'):''}
      ${recording?.saved?pill('Cihaza kaydedildi','check'):''}
    </div>
    ${recording?`<audio controls aria-label="Konuşma kaydın" src="${recording.url}"></audio>`:''}`;
  }
  function sourceFoot(task){
    const source=findSource(task.source);
    return source?`<p class="footer-note">Kaynak · ${esc(source.title)}${task.page?` · ${button('PDF s. '+task.page,'session-source',source.id+'|'+task.page,'','ghost slim')}`:''}</p>`:'';
  }
  function quizCard(task){
    const value=taskResponse(task),checked=current.show;
    const instructions=task.kind==='match'?'Her öğe için doğru karşılığı seç.':task.kind==='order'?'Kelimelere doğru sırayla dokun.':task.kind==='form'?(task.skill==='grammar'?'Boşlukları Almanca doldur.':task.skill==='listening'?'Sesi dinle ve duyduğun cümleyi Almanca yaz.':'Metne göre formu doldur.'):task.kind==='writing'?'Almanca kısa bir mesaj yaz. Üç noktaya değin ve hitap ile kapanışı ekle.':task.kind==='speaking'?'Görevi Almanca sesli yap. İstersen kaydedip kendini dinleyebilirsin.':'Doğru seçeneği işaretle.';
    let interaction='';
    if(task.kind==='choice'){
      interaction=`<div class="choices" role="group" aria-label="Cevap seçenekleri">${task.options.map((answer,i)=>`<button type="button" class="choice ${value===i?'selected':''} ${checked?(task.answer===i?'good':value===i?'bad':''):''}" data-action="session-choice" data-value="${i}" aria-pressed="${value===i}" ${checked?'aria-disabled="true"':''}><span class="letter">${letters[i]||i+1}</span><span lang="${task.optionLang||'de'}">${esc(answer)}</span></button>`).join('')}</div>`;
    }else if(task.kind==='match'){
      const options=[...new Set(task.pairs.map(pair=>pair[1]))].sort((a,b)=>a.localeCompare(b,'de'));
      interaction=`<div class="fieldset">${task.pairs.map(([prompt,answer],i)=>`<label class="field match-row"><span lang="de">${esc(prompt)}</span><select lang="de" data-session-input="field" data-task="${esc(task.id)}" data-index="${i}" ${checked?'disabled':''}><option value="">Karşılık seç</option>${options.map(item=>`<option ${item===value?.[i]?'selected':''} value="${esc(item)}">${esc(item)}</option>`).join('')}</select>${checked?`<span class="small ${value?.[i]===answer?'muted':'answer-error'}">${value?.[i]===answer?'✓ ':'Doğru: '}${esc(answer)}</span>`:''}</label>`).join('')}</div>`;
    }else if(task.kind==='order'){
      const ordered=value||[];
      const scrambled=task.tokens.map((_,i)=>i).sort((a,b)=>((a+1)*13%17)-((b+1)*13%17));
      interaction=`<div class="order-zone" aria-label="Kurduğun cümle" lang="de">${ordered.length?ordered.map(i=>esc(task.tokens[i])).join(' '):'<span class="muted" lang="tr">Sözcükleri buraya sırala</span>'}</div><div class="actions order-tokens">${scrambled.filter(i=>!ordered.includes(i)).map(i=>button(task.tokens[i],'session-order',i,'','secondary')).join('')}${!checked&&ordered.length?button('Baştan al','session-reset-order','','refresh','ghost slim'):''}</div>`;
    }else if(task.kind==='form'){
      interaction=`<div class="form-grid fieldset">${task.fields.map((field,i)=>`<label class="field"><span lang="de">${esc(field.label)}</span><input data-session-input="field" data-task="${esc(task.id)}" data-index="${i}" value="${esc(value?.[i]||'')}" maxlength="200" autocomplete="off" ${checked?'readonly':''}>${checked?`<span class="small ${formMatches(value?.[i],field.answers)?'muted':'answer-error'}">${formMatches(value?.[i],field.answers)?'✓ ':'Doğru: '}${esc(field.answers[0])}</span>`:''}</label>`).join('')}</div>`;
    }else if(task.kind==='writing'){
      const n=String(value||'').trim().split(/\s+/).filter(Boolean).length;
      interaction=`<ul class="task-points" lang="de">${task.points.map(point=>`<li>${esc(point)}</li>`).join('')}</ul>
        <label class="field">Mesajın<textarea lang="de" maxlength="4000" data-session-input="writing" data-task="${esc(task.id)}" ${checked?'readonly':''}>${esc(value||'')}</textarea></label><p class="footer-note" id="word-count">${n} kelime · Yaklaşık 30 kelime hedefle</p>`;
    }else{
      interaction=recordingControls(task,!checked);
    }
    const played=current.plays.get(task.id)||0;
    const plays=task.plays||2;
    const canPlay=!current.exam||played<plays;
    return `<section class="card study-card">
      <div class="row between"><span class="row">${pill(name(task.skill),skills[task.skill].icon)}<span class="small muted">${esc(topicName(task.topic))}</span></span>
      ${current.exam?'<span class="timer" id="exam-clock" aria-label="Kalan süre"></span>':''}</div>
      <h2 tabindex="-1" lang="${task.stemLang||(task.skill==='grammar'||task.source?'tr':'de')}">${esc(task.stem)}</h2>
      <p class="instructions">${instructions}</p>
      ${task.transcript?`<div class="actions">${canPlay?button('Sesi dinle','session-audio',task.id,'headphones','secondary'):pill('Dinleme hakkı bitti')}${current.exam?`<span class="small muted">${played} / ${plays} dinleme</span>`:'<span class="small muted">Alıştırma sesi</span>'}</div>`:''}
      ${typeof task.image==='string'&&/^data:image\/webp;base64,[a-zA-Z0-9+/=]+$/.test(task.image)?`<img class="task-picture" src="${task.image}" alt="${esc(task.imageAlt||'Görsel konuşma kartı')}">`:''}
      ${task.text?`<div class="stimulus" lang="de">${esc(task.text)}</div>`:''}
      ${interaction}
      ${checked?feedback(task):''}
      ${sourceFoot(task)}
      <div class="actions">
        ${current.exam?(current.index>currentPart().start?button('Önceki','session-prev','','arrow_back','secondary'):'')+(current.index===currentPart().start+currentPart().tasks.length-1
          ?button(current.partIndex===current.parts.length-1?'Denemeyi bitir':'Bölümü bitir','session-exam-submit','','check')
          :button('Sonraki','session-next','','arrow_forward')):
          checked?button(current.index+1===current.items.length?'Sonucu gör':'Sonraki','session-next','','arrow_forward'):
          button(task.kind==='writing'||task.kind==='speaking'?'Yanıtı değerlendir':'Cevabı kontrol et','session-check','','check')}
      </div>
    </section>`;
  }
  function wordCard(word){
    return `<section class="card study-card word-card">
      ${pill(topicName(word.topic),'library_books')}
      <h2 tabindex="-1" lang="de">${esc(word.de)}</h2>
      <div class="row">${button('Telaffuz','session-word-audio','','volume_up','secondary slim')}</div>
      ${current.show?`<div class="word-meaning">${esc(word.tr)}</div>${word.example?`<div class="word-example"><p lang="de">${esc(word.example)}</p><p>${esc(word.exampleTr||'')}</p></div>`:''}
        <div class="actions">${button('Tekrar','session-rate','again','refresh','secondary')}${button('Zor','session-rate','hard','','secondary')}${button('Bildim','session-rate','good','check')}</div>`:
        `<p class="muted">Türkçe anlamını hatırlamayı dene.</p>${button('Türkçesini göster','session-flip','','arrow_forward')}`}
    </section>`;
  }
  function reviewLine(task){
    const result=current.results.get(task.id),value=taskResponse(task);
    return `<details class="list-item result-detail" ${result?.self?'open':''}><summary><span>${esc(task.stem)}</span><span class="small">${result?.self?result.assessed?`${result.earned}/${result.total}`:'Öz değerlendirme':`${result?.earned??0}/${result?.total??1}`}</span></summary>
      <div class="meta-list">
        ${task.kind==='choice'?`<p class="small">Cevabın: <b>${esc(answerChoice(task,value)||'Boş')}</b></p>`:''}
        ${task.kind==='form'?task.fields.map((field,i)=>`<p class="small"><b>${esc(field.label)}:</b> ${esc(value?.[i]||'Boş')} → ${esc(field.answers[0])}</p>`).join(''):''}
        ${task.kind==='writing'?`<p class="stimulus" lang="de">${esc(value||'Yanıt girilmedi.')}</p>`:''}
        ${task.kind==='speaking'?recordingControls(task,false):''}
        ${result?.self?rubric(task,'session-self'):feedback(task)}
      </div></details>`;
  }
  function results(){
    const values=[...current.results.values()];
    const graded=values.filter(r=>!r.self),earned=graded.reduce((n,r)=>n+r.earned,0),possible=graded.reduce((n,r)=>n+r.total,0);
    const self=values.filter(r=>r.self&&r.assessed).length;
    const summary=current.exam?saveExamSummary():null;
    let metric;
    if(current.type==='cards')metric=`${current.reviewed} kelime çalışıldı.`;
    else if(current.exam)metric=summary.total?`${summary.earned} / ${summary.total} puan${summary.pending?' · Öz değerlendirme bekliyor':''}`:'Model yanıtları kullanarak öz değerlendirmeni tamamla.';
    else metric=[possible?`${earned} / ${possible} puan`:'',self?`${self} öz değerlendirme`:''].filter(Boolean).join(' · ')||'Çalışman kaydedildi.';
    const review=current.type==='quiz'?(current.exam?current.items:current.items.filter(task=>current.results.has(task.id))):[];
    return `<div class="study-frame"><section class="card study-card tint">
      ${pill(current.title,'check_circle')}
      <h2 tabindex="-1">${current.exam?'Deneme sonucu':current.unitStep==='check'&&state.lessons[current.topic]?'Ünite tamamlandı':'Çalışma tamamlandı'}</h2>
      <p>${esc(metric)}</p>
      ${current.exam?'<p class="footer-note">Bu puan bir çalışma göstergesidir. Yazma ve konuşma puanına kendi değerlendirmen eklenir.</p>':''}
      <div class="actions">${current.unitStep?unitResultAction(current.topic):link('Bugün’e dön','#bugun','home')}${current.unitStep?link('Üniteye dön',current.returnRoute.startsWith('#')?current.returnRoute:'#'+current.returnRoute,'arrow_back','secondary'):link('İlerlememi gör','#ilerleme','bar_chart','secondary')}</div>
    </section>${review.length?`<section class="card">${head('Cevaplarını incele')}<div class="list">${review.map(reviewLine).join('')}</div></section>`:''}</div>`;
  }
  function render(){
    if(!current)return;
    if(current.completed){main.innerHTML=results();return;}
    const task=currentTask();
    const part=currentPart();
    const total=part?.tasks.length||current.items.length;
    const index=current.index-(part?.start||0);
    main.innerHTML=`<div class="study-frame">
      <div class="study-meta">${button('Çalışmaya dön','session-leave','','arrow_back','ghost slim')}<span>${esc(sectionTitle())} · ${index+1} / ${total}</span></div>
      ${track(index,total,'Oturum ilerlemesi')}
      ${current.type==='cards'?wordCard(task):quizCard(task)}
    </div>`;
    if(current.exam&&document.querySelector('#exam-clock')){
      const remaining=Math.max(0,Math.ceil((current.deadline-Date.now())/1000));
      document.querySelector('#exam-clock').textContent=`${String(Math.floor(remaining/60)).padStart(2,'0')}:${String(remaining%60).padStart(2,'0')}`;
    }
  }
  function setResponse(task,value){current.responses.set(task.id,value);}
  function input(element){
    if(!current)return;
    const task=current.items.find(t=>t.id===element.dataset.task);
    if(!task)return;
    if(element.dataset.sessionInput==='rubric'){
      const checks=current.checks.get(task.id)||[];
      checks[Number(element.value)]=element.checked;
      current.checks.set(task.id,checks);
      return;
    }
    if(element.dataset.sessionInput==='field'){
      const values=taskResponse(task)||[];
      values[Number(element.dataset.index)]=element.value;
      setResponse(task,values);
      return;
    }
    setResponse(task,element.value);
    const counter=document.querySelector('#word-count');
    if(counter)counter.textContent=`${element.value.trim().split(/\s+/).filter(Boolean).length} kelime · Yaklaşık 30 kelime hedefle`;
  }
  function next(){
    stopRecording();stopSpeech();current.show=false;
    if(current.index+1>=current.items.length){finish(true);return;}
    current.index++;render();focusCard();
  }
  function submitExam(){
    stopRecording();stopSpeech();
    if(current.partIndex+1<current.parts.length)advancePart();
    else finish(true);
  }
  function stopRecording(){
    if(!recorder)return;
    const active=recorder;
    recorder=null;
    if(active.media.state!=='inactive')active.media.stop();
    active.stream.getTracks().forEach(track=>track.stop());
  }
  async function record(task){
    if(microphoneRequest||recorder)return;
    if(!navigator.mediaDevices?.getUserMedia||typeof MediaRecorder!=='function'){
      notify('Bu tarayıcı mikrofon kaydını desteklemiyor. Görevi sesli yapıp kendini değerlendirebilirsin.');return;
    }
    const owner=current;
    microphoneRequest=true;
    let stream;
    try{
      stream=await navigator.mediaDevices.getUserMedia({audio:true});
      if(current!==owner||currentTask()?.id!==task.id||location.hash!=='#oturum'||current.completed||current.show){
        stream.getTracks().forEach(track=>track.stop());return;
      }
      const media=new MediaRecorder(stream),chunks=[];
      media.ondataavailable=event=>{if(event.data.size)chunks.push(event.data);};
      media.onstop=()=>{
        if(current!==owner)return;
        const blob=new Blob(chunks,{type:media.mimeType||chunks[0]?.type||'audio/webm'});
        if(!blob.size)return;
        const url=URL.createObjectURL(blob);
        recordingUrls.push(url);current.recordings.set(task.id,{blob,url});
        if(location.hash==='#oturum')render();
      };
      recorder={media,stream,task:task.id};
      media.start();
      render();
    }catch{
      stream?.getTracks().forEach(track=>track.stop());
      recorder=null;
      notify('Mikrofon açılamadı. Tarayıcı izinlerini kontrol edebilirsin.');
    }finally{microphoneRequest=false;}
  }
  function action(action,value){
    if(!current)return;
    const task=currentTask();
    if(action==='leave'){leave();return;}
    if(action==='source'){openPdf(value);return;}
    if(action==='save-record'){
      const record=current.recordings.get(value),item=current.items.find(t=>t.id===value);
      if(record&&!record.saved&&!record.saving){
        const owner=current;
        record.saving=true;
        saveRecording(record.blob,item.stem).then(()=>{record.saved=true;if(current===owner&&location.hash==='#oturum')render();}).catch(()=>notify('Ses kaydı saklanamadı.')).finally(()=>{record.saving=false;});
      }
      return;
    }
    if(action==='self'){
      const item=current.items.find(t=>t.id===value);
      if(!item)return;
      const result=gradeTask(item,taskResponse(item));
      result.earned=weightedSelf(item,current.checks.get(value)||[]);
      result.assessed=true;
      updateAttempt(item,result);render();return;
    }
    if(current.completed||!task)return;
    if(action==='flip'){current.show=true;render();return;}
    if(action==='word-audio'){play(task.de,task.audio);return;}
    if(action==='rate'){
      if(!current.show)return;
      reviewCard(state,task,value);persist();current.reviewed++;next();return;
    }
    if(action==='audio'){
      const played=current.plays.get(task.id)||0;
      if(!current.exam||played<(task.plays||2)){
        current.plays.set(task.id,played+1);
        play(task.transcript,safeUrl(task.audio));
        if(current.exam)render();
      }
      return;
    }
    if(action==='order'&&!current.show){
      const ordered=taskResponse(task)||[];
      const index=Number(value);
      if(task.kind==='order'&&Number.isInteger(index)&&index>=0&&index<task.tokens.length&&!ordered.includes(index))setResponse(task,[...ordered,index]);
      render();return;
    }
    if(action==='reset-order'&&!current.show){setResponse(task,[]);render();return;}
    if(action==='choice'&&!current.show){
      setResponse(task,Number(value));
      main.querySelectorAll('.choice').forEach(el=>{
        const selected=el.dataset.value===value;el.classList.toggle('selected',selected);el.setAttribute('aria-pressed',String(selected));
      });
      return;
    }
    if(action==='record'){stopSpeech();record(task);return;}
    if(action==='stop-record'){stopRecording();render();return;}
    if(action==='prev'&&current.exam&&current.index>currentPart().start){
      stopRecording();stopSpeech();current.index--;render();focusCard();return;
    }
    if(action==='exam-submit'&&current.exam){submitExam();return;}
    if(action==='next'){
      if(current.exam){if(current.index+1<currentPart().start+currentPart().tasks.length)next();}
      else if(current.show)next();
      return;
    }
    if(action==='check'&&!current.show){
      const response=taskResponse(task);
      const answered=task.kind==='choice'?Number.isInteger(response):['form','match'].includes(task.kind)?response?.some(field=>field.trim()):task.kind==='order'?response?.length===task.tokens.length:task.kind==='writing'?response?.trim():true;
      if(!answered){notify(task.kind==='order'?'Önce bütün sözcükleri sırala.':'Önce bir cevap gir.');return;}
      stopRecording();current.show=true;
      const graded=gradeTask(task,response);
      if(!graded.self)updateAttempt(task,graded);
      else if(!current.results.has(task.id)){
        updateAttempt(task,graded);
      }
      render();main.querySelector('.feedback')?.scrollIntoView({block:'nearest',behavior:'smooth'});
    }
  }
  return {get current(){return current;},hasUnfinished:()=>Boolean(current&&!current.completed),quiz,cards,render,action,input,pauseTime,resumeTime,stopRecording,checkpoint};
}
