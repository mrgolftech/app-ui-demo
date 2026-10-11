import { useState } from 'react';
import { ChevronRight, Volume2 } from 'lucide-react';
import { quizzes } from '../data/mock';
import { MediaStage } from '../components/MediaStage';
import { StudyLayout,PanelMeta,Actions,PanelFooter } from '../components/StudyLayout';
import { ActionButton } from '../components/ActionButton';
import { notify } from '../lib/notify';
export function QuizPage(){
 const [index,setIndex]=useState(0);
 const [answer,setAnswer]=useState('');
 const item=quizzes[index];
 const next=()=>{setIndex(i=>(i+1)%quizzes.length);setAnswer('');};
 return <StudyLayout stage={<MediaStage art={item.art} theme="quiz"
   counter={'第 '+(index+1)+' / '+quizzes.length+' 题'}
   playLabel="听题 · 示范音频" onPlay={()=>notify('音频暂为演示')} onNext={next}/>}>
    <PanelMeta label="⭐ WORD CHALLENGE" progress={(index+1)+' / '+quizzes.length}/>
    <h1>{item.q}</h1>
    <p className="study-translation">看插画，选择正确的英文单词</p>
    <div className="answer-grid">
      {item.choices.map(c=><button key={c} type="button" data-choice={c} onClick={()=>setAnswer(c)}
       className={'answer'+(answer===c?(c===item.a?' is-correct':' is-wrong'):'')}>{c}</button>)}
    </div>
    <div className="panel-spacer"/>
    <Actions>
      <ActionButton data-action="play" onClick={()=>notify('音频暂为演示')}><Volume2 size={18}/>重播</ActionButton>
      <ActionButton tone="blue" data-action="nextquiz" onClick={next}>下一题<ChevronRight size={18}/></ActionButton>
    </Actions>
    <PanelFooter left={answer?(answer===item.a?'🎉 答对啦！':'再想一想！'):'每屏只完成一道题'} right="🌟 加油"/>
 </StudyLayout>;
}
