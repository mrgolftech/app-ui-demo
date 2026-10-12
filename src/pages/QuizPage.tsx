import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Star, Volume2, ChevronRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { PracticeBack } from '../components/PracticeBack';
import { IconButton } from '../components/IconButton';
import { quizForWord } from '../data/word-questions';
import { notify } from '../lib/notify';
import type { Artwork } from '../types';
const artFiles:Record<Artwork,string>={meadow:'rabbit.svg',forest:'rabbit.svg',bird:'bird.svg',pond:'pond.svg',ship:'ship.svg',village:'village.svg',fox:'fox.svg'};
export function QuizPage(){
 const location=useLocation();
 const words=(location.state as {words?:string[]}|null)?.words;
 const items=words?.length?words:['bridge','dam','mountain','road trip'];
 const [index,setIndex]=useState(0);
 const [answer,setAnswer]=useState('');
 const q=quizForWord(items[index%items.length],index);
 const correct=answer===q.zh;
 const next=()=>{setIndex(i=>(i+1)%items.length);setAnswer('');};
 const play=()=>notify('模拟英语发音 · '+q.word);
 return <div className="quiz-screen" data-role="vocab-quiz">
  <PracticeBack/>
  <header className="quiz-toolbar"><span>需学习 {index+1}</span>
   <div className="quiz-toolbar__spacer"/>
   <IconButton label="收藏当前单词" icon={<Star size={24}/>} onClick={()=>notify('已收藏（界面演示）')} tone="white"/>
  </header>
  <div className="quiz-prompt">
   <div className="quiz-prompt__image"><img alt={'演示词汇：'+q.word} draggable={false}
    src={import.meta.env.BASE_URL+'assets/'+artFiles[q.art]}/></div>
   <div className="quiz-prompt__text">
    <div className="quiz-prompt__word"><h1>{q.word}</h1>
     <IconButton label="播放单词发音" data-action="play" icon={<Volume2 size={25}/>} tone="white" onClick={play}/>
    </div>
    <div className="quiz-prompt__sentence">{q.sentence}
     <IconButton label="播放例句发音" icon={<Volume2 size={22}/>} tone="white" onClick={play}/>
    </div>
   </div>
  </div>
  <div className="quiz-choices" aria-label="单词释义选择">
   {q.choices.map(c=><button key={c} type="button" data-choice={c}
    className={'quiz-choice'+(answer===c?(correct?' is-correct':' is-wrong'):'')}
    onClick={()=>setAnswer(c)}>
     {c}{answer===c&&correct&&<CheckCircle2 size={23} color="#2c9a66"/>}
   </button>)}
  </div>
  <div className="quiz-status" aria-live="polite">
   <span>{answer?(correct?'🌟 回答正确！':'再试一次吧！'):'请选择正确释义'}</span>
   <div className="quiz-status__tools">
    <IconButton label="重试" data-action="retry" icon={<RotateCcw size={21}/>} onClick={()=>setAnswer('')}/>
    <IconButton label="下一题" data-action="nextquiz" icon={<ChevronRight size={25}/>} tone="primary" onClick={next}/>
   </div>
  </div>
 </div>;
}
