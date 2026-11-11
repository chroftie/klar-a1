import {lessons,skills} from './data/course.js';

export const courseSteps=[
  {id:'lesson', title:'Ders notu', icon:'school', hint:'Kuralı ve sesli örnekleri çalış.'},
  {id:'words', title:'Kelime kartları', icon:skills.words.icon, hint:'Türkçe anlamları ve telaffuzu çalış.'},
  {id:'grammar', title:'Dil bilgisi', icon:skills.grammar.icon, hint:'Ünitenin temel cümlelerini kur.'},
  {id:'listening', title:'Dinleme', icon:skills.listening.icon, hint:'Kısa bir konuşmayı dinle.'},
  {id:'reading', title:'Okuma', icon:skills.reading.icon, hint:'Bir metinden gerekli bilgiyi bul.'},
  {id:'writing', title:'Yazma', icon:skills.writing.icon, hint:'Form doldur veya kısa mesaj yaz.'},
  {id:'speaking', title:'Konuşma', icon:skills.speaking.icon, hint:'Sınav kartına sesli cevap ver.'},
  {id:'check', title:'Ünite kontrolü', icon:'check_circle', hint:'Karışık sorularla kendini dene.'},
];
const byId=new Map(courseSteps.map(step=>[step.id,step]));
const topics=new Set(lessons.map(lesson=>lesson.id));
export const stepById=id=>byId.get(id);

export function normalizeCourseProgress(raw){
  const progress={};
  for(const lesson of lessons){
    const entry=raw?.[lesson.id];
    if(!entry||typeof entry!=='object')continue;
    const steps={};
    for(const {id} of courseSteps)if(Number.isFinite(entry[id])&&entry[id]>0)steps[id]=entry[id];
    if(Object.keys(steps).length)progress[lesson.id]=steps;
  }
  return progress;
}
export function mergeCourseProgress(current,restored){
  const progress={};
  for(const id of new Set([...Object.keys(current),...Object.keys(restored)])){
    const merged={...current[id]};
    for(const [step,at] of Object.entries(restored[id]||{}))merged[step]=Math.max(merged[step]||0,at);
    progress[id]=merged;
  }
  return progress;
}
export function unitProgress(state,id){
  const seen=state.unitSteps?.[id]||{};
  const completed=Boolean(state.lessons[id]);
  const done=courseSteps.filter(step=>seen[step.id]).map(step=>step.id);
  const next=courseSteps.find(step=>!done.includes(step.id));
  return {done,completed,previousVersion:completed&&done.length<courseSteps.length,next};
}
export function activeUnit(state){
  const focused=state.unitFocus?.topic;
  return lessons.find(unit=>unit.id===focused&&!state.lessons[unit.id])||lessons.find(unit=>!state.lessons[unit.id]);
}
export function markUnitStep(state,topic,step,at){
  if(!topics.has(topic)||!byId.has(step))return false;
  const steps=state.unitSteps[topic]??={};
  steps[step]??=at;
  if(courseSteps.every(item=>steps[item.id]))state.lessons[topic]??=at;
  return true;
}
