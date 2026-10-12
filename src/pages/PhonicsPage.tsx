import { useState } from 'react';
import { Check, ChevronRight, RotateCcw } from 'lucide-react';
import { phonics } from '../data/mock';
import { MediaStage } from '../components/MediaStage';
import { StudyLayout,PanelMeta,Actions,PanelFooter } from '../components/StudyLayout';
import { ActionButton } from '../components/ActionButton';
import { notify } from '../lib/notify';

export function PhonicsPage(){
 const [wordIndex,setWordIndex]=useState(0);
 const [selected,setSelected]=useState<number[]>([]);
 const w=phonics.words[wordIndex];
 const next=()=>{setWordIndex(i=>(i+1)%phonics.words.length);setSelected([]);};
 const add=(id:number)=>setSelected(ids=>ids.includes(id)?ids:[...ids,id]);
 const check=()=>notify(selected.map(i=>w.letters[i]).join('')===w.word?'🎉 拼写正确！':'再试一次，加油！');
 return <StudyLayout stage={<MediaStage theme="phonics" art={w.art}
   counter={phonics.unit+' · '+(wordIndex+1)+'/'+phonics.words.length}
   playLabel="听单词" onPlay={()=>notify('示例音频尚未接入')} onNext={next}/>}>
   <PanelMeta label="🔤 PHONICS · UNIT 3" progress={(wordIndex+1)+' / '+phonics.words.length}/>
   <h1>学习字母组合 <em className="accent-purple">sh</em></h1>
   <p className="study-sentence"><span className="accent-purple">{w.sound}</span>{w.rest}</p>
   <p className="study-translation">看图拼写 · {w.zh}</p>
   <div className="letter-bank" aria-label="拼读字母选项">
    {w.letters.map((c,i)=><button key={i} type="button" data-letter={i}
     className={selected.includes(i)?'is-used':''} onClick={()=>add(i)}>{c}</button>)}
   </div>
   <div className="panel-spacer"/>
   <Actions>
    <ActionButton data-action="clear" title="重试" aria-label="重试" onClick={()=>setSelected([])}>
     <RotateCcw size={25}/></ActionButton>
    <ActionButton tone="purple" data-action="check" title="检查拼写" aria-label="检查拼写" onClick={check}>
     <Check size={27}/></ActionButton>
    <ActionButton data-action="nextword" title="下一个单词" aria-label="下一个单词" onClick={next}>
     <ChevronRight size={27}/></ActionButton>
   </Actions>
   <PanelFooter left="离线模拟拼读练习" right={selected.map(i=>w.letters[i]).join('').toUpperCase()||'○ ○ ○ ○'}/>
 </StudyLayout>;
}
