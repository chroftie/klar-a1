function rotate(items,position){
  const split=position%items.length;
  return [...items.slice(split),...items.slice(0,split)];
}

export function vocabularyQuestions(words){
  return words.flatMap((word,index)=>{
    const others=words.filter(candidate=>candidate.topic===word.topic&&candidate.tr!==word.tr&&candidate.de!==word.de);
    const alternatives=rotate(others,index*7).filter((candidate,i,all)=>all.findIndex(w=>w.tr===candidate.tr)===i).slice(0,3);
    if(alternatives.length<3)return [];
    const fromGerman=rotate([word,...alternatives],index*3);
    const fromTurkish=rotate([word,...alternatives],index*5+1);
    const questions=[
      {id:'word-de-'+word.id,kind:'choice',skill:'words',topic:word.topic,stem:word.de,
        options:fromGerman.map(w=>w.tr),answer:fromGerman.indexOf(word),explain:`${word.de} · ${word.tr}`,optionLang:'tr',stemLang:'de',subtype:'de-tr'},
      {id:'word-tr-'+word.id,kind:'choice',skill:'words',topic:word.topic,stem:word.tr,
        options:fromTurkish.map(w=>w.de),answer:fromTurkish.indexOf(word),explain:`${word.de} · ${word.tr}`,optionLang:'de',stemLang:'tr',subtype:'tr-de'},
    ];
    const noun=/^(der|die|das) (.+)$/.exec(word.de);
    if(noun){
      const articles=rotate(['der','die','das'],index);
      questions.push({id:'word-article-'+word.id,kind:'choice',skill:'words',topic:word.topic,stem:`___ ${noun[2]}`,
        options:articles,answer:articles.indexOf(noun[1]),explain:`${word.de} · ${word.tr}`,optionLang:'de',stemLang:'de',subtype:'artikel'});
    }
    return questions;
  });
}
