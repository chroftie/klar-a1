import { lessons } from './data/course.js';

const stateKey='klar-study-v1';
export const defaults={daily:20, days:[1,2,3,4,5], examDate:'', level:'new', theme:'system'};
export function emptyState(){
  return {createdAt:Date.now(),settings:{...defaults,days:[...defaults.days]},attempts:[],sessions:[],cards:{},lessons:{},exams:[]};
}
export function loadState(){
  try {return normalizeState(JSON.parse(localStorage.getItem(stateKey)));}
  catch {return emptyState();}
}
export function storeState(state){localStorage.setItem(stateKey,JSON.stringify(state));}

function byId(items,check){
  return Array.isArray(items)?items.filter(item=>item&&typeof item.id==='string'&&check(item)):[];
}
export function normalizeState(raw){
  const base=emptyState();
  if(!raw || typeof raw!=='object') return base;
  if(Number.isFinite(raw.createdAt)&&raw.createdAt>0&&raw.createdAt<=Date.now())base.createdAt=raw.createdAt;
  else if(Array.isArray(raw.sessions)){
    const dates=raw.sessions.map(s=>s?.at).filter(at=>Number.isFinite(at)&&at>0&&at<=Date.now());
    if(dates.length)base.createdAt=Math.min(...dates);
  }
  const settings=raw.settings||{};
  const days=Array.isArray(settings.days)?[...new Set(settings.days.filter(d=>Number.isInteger(d)&&d>=0&&d<=6))]:[];
  base.settings={
    daily: [10,15,20,25,30,40,45,60].includes(settings.daily)?settings.daily:defaults.daily,
    days:days.length?days:base.settings.days,
    examDate:typeof settings.examDate==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(settings.examDate)&&!isNaN(fromKey(settings.examDate).getTime())?settings.examDate:'',
    level:['new','some','exam'].includes(settings.level)?settings.level:'new',
    theme:['system','light','dark'].includes(settings.theme)?settings.theme:'system',
  };
  base.attempts=byId(raw.attempts,a=>typeof a.task==='string'&&typeof a.skill==='string'&&Number.isFinite(a.at)&&Number.isFinite(a.score)&&a.score>=0&&a.score<=1).map(a=>({...a,self:Boolean(a.self)}));
  base.sessions=byId(raw.sessions,s=>Number.isFinite(s.at)&&Number.isInteger(s.minutes)&&s.minutes>=1&&s.minutes<=120);
  base.exams=byId(raw.exams,s=>Number.isFinite(s.at)&&typeof s.skill==='string'&&Number.isFinite(s.score)&&s.score>=0&&s.score<=1);
  for(const [key,value] of Object.entries(raw.cards||{})){
    if(key.startsWith('word-')&&value&&Number.isFinite(value.due)&&Number.isFinite(value.at)&&Number.isInteger(value.stage)&&value.stage>=0&&value.stage<=6)base.cards[key]=value;
  }
  for(const lesson of lessons)if(Number.isFinite(raw.lessons?.[lesson.id]))base.lessons[lesson.id]=raw.lessons[lesson.id];
  return base;
}
export function mergeState(current,backup){
  const restored=normalizeState(backup);
  const mergeList=(a,b)=>[...new Map([...a,...b].map(item=>[item.id,item])).values()].sort((x,y)=>x.at-y.at);
  const cards={...current.cards};
  for(const [key,card] of Object.entries(restored.cards))if(!cards[key]||card.at>=cards[key].at)cards[key]=card;
  return {...restored,createdAt:Math.min(current.createdAt,restored.createdAt),cards,lessons:{...current.lessons,...restored.lessons},
    attempts:mergeList(current.attempts,restored.attempts),
    sessions:mergeList(current.sessions,restored.sessions),
    exams:mergeList(current.exams,restored.exams)};
}

export const localKey=(date=new Date())=>[date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');
export function fromKey(key){
  const [y,m,d]=key.split('-').map(Number);
  return new Date(y,m-1,d,12);
}
export function addDays(date,days){
  const result=new Date(date); result.setDate(result.getDate()+days); return result;
}
export function monday(date){
  return addDays(fromKey(localKey(date)),-((date.getDay()+6)%7));
}
function dateDistance(a,b){
  const utc=d=>Date.UTC(d.getFullYear(),d.getMonth(),d.getDate());
  return Math.round((utc(b)-utc(a))/86400000);
}
export function examDistance(settings,now=new Date()){
  return settings.examDate?dateDistance(now,fromKey(settings.examDate)):null;
}
export function activity(state,now=new Date()){
  const totals={};
  for(const session of state.sessions){
    const key=localKey(new Date(session.at));totals[key]=(totals[key]||0)+session.minutes;
  }
  const today=localKey(now);
  const start=monday(now);
  const week=Array.from({length:7},(_,i)=>{
    const date=addDays(start,i);const key=localKey(date);return {date,key,minutes:totals[key]||0};
  });
  const created=localKey(new Date(state.createdAt));
  const weekGoal=week.filter(d=>d.key>=created&&state.settings.days.includes(d.date.getDay())).length;
  const monthPrefix=today.slice(0,7);
  const monthDays=Object.keys(totals).filter(key=>key.startsWith(monthPrefix)).length;
  const daysInMonth=new Date(now.getFullYear(),now.getMonth()+1,0).getDate();
  const monthGoal=Array.from({length:daysInMonth},(_,i)=>new Date(now.getFullYear(),now.getMonth(),i+1)).filter(date=>localKey(date)>=created&&state.settings.days.includes(date.getDay())).length;
  return {today,totals,week,weekDays:week.filter(d=>d.minutes>0).length,weekGoal,monthDays,monthGoal,todayMinutes:totals[today]||0,
    minutes:state.sessions.reduce((sum,s)=>sum+s.minutes,0)};
}
export const id=()=>globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random().toString(36).slice(2)}`;
export function reviewCard(state,word,rating,now=Date.now()){
  const current=state.cards[word.id]?.stage||0;
  const stage=rating==='again'?0:rating==='hard'?Math.max(1,current):Math.min(6,current+1);
  const offset=rating==='again'?10/1440:rating==='hard'?1:[0,1,3,7,14,30,60][stage];
  state.cards[word.id]={stage,due:now+offset*86400000,at:now};
  return state.cards[word.id];
}
export function dueCards(state,words,now=Date.now()){
  return words.filter(w=>state.cards[w.id]&&state.cards[w.id].due<=now).sort((a,b)=>state.cards[a.id].due-state.cards[b.id].due);
}
export function lastAttempts(state){
  const latest=new Map();
  for(const attempt of state.attempts)if(!latest.has(attempt.task)||latest.get(attempt.task).at<=attempt.at)latest.set(attempt.task,attempt);
  return latest;
}
export function mistakes(state,tasks){
  const index=new Map(tasks.map(q=>[q.id,q]));
  return [...lastAttempts(state).values()]
    .filter(a=>!a.self&&a.score<1&&index.has(a.task)).sort((a,b)=>b.at-a.at)
    .map(a=>({attempt:a,task:index.get(a.task)}));
}
export function skillStats(state,skill){
  const attempts=[...lastAttempts(state).values()].filter(a=>a.skill===skill&&!a.self);
  const self=[...lastAttempts(state).values()].filter(a=>a.skill===skill&&a.self);
  return {count:attempts.length, accuracy:attempts.length?attempts.reduce((sum,a)=>sum+a.score,0)/attempts.length:null,self:self.length};
}
export function recommendation(state,tasks,words){
  const due=dueCards(state,words);
  const wrong=mistakes(state,tasks);
  const remaining=examDistance(state.settings);
  const lesson=lessons.find(l=>!state.lessons[l.id])||lessons[0];
  if(due.length>=3) return {type:'cards',title:'Kelime tekrarı',description:`${due.length} kartın tekrar zamanı geldi. Önce bu kelimeleri hatırlamayı dene.`,icon:'refresh'};
  if(wrong.length>=2) return {type:'mistakes',title:'Yanlışlarına dön',description:`${wrong.length} soru yeniden çözülebilir. Son denemendeki hatalarla başla.`,icon:'bolt'};
  if(remaining!==null&&remaining>=0&&remaining<=7 || state.settings.level==='exam'){
    const skills=['listening','reading','writing','speaking'];
    const skill=skills.find(s=>!state.exams.some(e=>e.skill===s))||skills.sort((a,b)=>(skillStats(state,a).accuracy??1)-(skillStats(state,b).accuracy??1))[0];
    return {type:'exam',skill,title:'Sınav provası',description:'Süre tutarak bir Goethe A1 bölümü çöz, ardından cevaplarını gözden geçir.',icon:'event'};
  }
  if(state.settings.level==='some'&&!state.attempts.some(a=>!a.self))return {type:'diagnostic',title:'Seviyeni yokla',description:'Karışık bir başlangıç seti çöz. Sonraki öneriler cevaplarına göre şekillenecek.',icon:'target'};
  return {type:'lesson',topic:lesson.id,title:lesson.title,description:lesson.description,icon:'route'};
}
export function weekPlan(state,tasks,words,now=new Date()){
  const today=localKey(now);
  const start=monday(now);
  const focus=recommendation(state,tasks,words);
  const unused=lessons.filter(l=>!state.lessons[l.id]);
  const priority=['listening','reading','writing','speaking'];
  let planned=0, nextUnit=0;
  return Array.from({length:7},(_,i)=>{
    const date=addDays(start,i),key=localKey(date);
    const scheduled=state.settings.days.includes(date.getDay());
    const past=key<today;
    const lesson=unused[nextUnit%Math.max(unused.length,1)]||lessons[nextUnit%lessons.length];
    const action=!scheduled||past?null:planned===0?focus:planned%3===2
      ?{type:'skill',skill:priority[(planned-2)%priority.length]}
      :{type:'lesson',topic:lesson.id};
    if(scheduled&&!past)planned++;
    if(action?.type==='lesson')nextUnit++;
    return {date,key,scheduled,past,action};
  });
}
const comparable=value=>String(value??'').normalize('NFKC').toLocaleLowerCase('de').replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^\p{L}\p{N}@]/gu,'');
export const formMatches=(value,answers)=>Boolean(String(value??'').trim())&&answers.some(answer=>comparable(answer)?comparable(answer)===comparable(value):String(value).trim()===answer.trim());
export function gradeTask(task,response){
  if(task.kind==='choice')return {earned:response===task.answer?1:0,total:1,self:false};
  if(task.kind==='match'){
    const earned=task.pairs.filter((pair,i)=>response?.[i]===pair[1]).length;
    return {earned,total:task.pairs.length,self:false};
  }
  if(task.kind==='order'){
    const correct=Array.isArray(response)&&response.length===task.tokens.length&&response.map(i=>task.tokens[i]).join(' ')===task.tokens.join(' ');
    return {earned:correct?1:0,total:1,self:false};
  }
  if(task.kind==='form'){
    const earned=task.fields.filter((field,i)=>formMatches(response?.[i],field.answers)).length;
    return {earned,total:task.fields.length,self:false};
  }
  return {earned:0,total:task.kind==='writing'?10:['speak-1','speak-b-1'].includes(task.id)?3:6,self:true};
}
export function monthPlan(state,now=new Date()){
  const remaining=lessons.filter(l=>!state.lessons[l.id]);
  const currentMonth=now.getMonth();
  const first=monday(now);
  let lessonIndex=0;
  const weeks=[];
  for(let offset=0;offset<35;offset+=7){
    const week=Array.from({length:7},(_,i)=>addDays(first,offset+i)).filter(date=>date.getMonth()===currentMonth&&localKey(date)>=localKey(now));
    if(!week.length)continue;
    const days=week.filter(date=>state.settings.days.includes(date.getDay())).length;
    const examNear=state.settings.examDate&&examDistance(state.settings,week[0])>=0&&examDistance(state.settings,week[0])<=7;
    const topics=examNear?[]:remaining.slice(lessonIndex,lessonIndex+Math.min(2,Math.max(0,days-1)));
    lessonIndex+=topics.length;
    weeks.push({start:week[0],end:week.at(-1),days,topics,examNear});
  }
  return weeks;
}
export function weightedSelf(task,checks){
  if(task.kind==='writing')return checks.reduce((n,checked,i)=>n+(checked?(i<3?3:1):0),0);
  return checks.filter(Boolean).length*(['speak-1','speak-b-1'].includes(task.id)?1:2);
}
