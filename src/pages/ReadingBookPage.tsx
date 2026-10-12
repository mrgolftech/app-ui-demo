import { useState } from 'react';
import { ChevronLeft, ChevronRight, Volume2, HandPointer, Settings2,
   List, Headphones, Mic, Check, RotateCcw, Star } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { IconButton } from '../components/IconButton';
import { ModeTabBar } from '../components/ModeTabBar';
import { usePracticeExit } from '../context/PracticeExitContext';
import { notify } from '../lib/notify';
import { raz } from '../data/mock';
import { readingBooks } from '../data/catalog';
import type { Artwork } from '../types';
const assets:Record<Artwork,string>={meadow:'rabbit.svg',forest:'rabbit.svg',bird:'bird.svg',pond:'pond.svg',ship:'ship.svg',village:'village.svg',fox:'fox.svg'};
export function ReadingBookPage(){
 const {bookId='road-trip',mode='read'}=useParams();
 const book=readingBooks.find(x=>x.id===bookId)||readingBooks[0];
 const {requestExit}=usePracticeExit();
 const [page,setPage]=useState(0);
 const [recording,setRecording]=useState(false);
 const [tapped,setTapped]=useState('');
 const sentence=raz.pages[page%raz.pages.length];
 const art=book.art;
 const next=()=>setPage(p=>Math.min(raz.pages.length-1,p+1));
 const previous=()=>setPage(p=>Math.max(0,p-1));
 const speak=()=>notify('模拟语音：未接入真实音频');
 const modes=['read','record','exercise','words'];
 return <div className="reader-screen" data-role="reader-book-screen">
   <header className="reader-toolbar">
    <IconButton label="退出阅读" tone="white" icon={<ChevronLeft size={23}/>} data-action="back" onClick={requestExit}/>
    <ModeTabBar/>
    <div className="reader-toolbar__title"><strong>{book.name}</strong><small>Reading A-Z · Level C</small></div>
    <IconButton label="听书" icon={<Headphones size={22}/>} onClick={speak} tone="white"/>
    <IconButton label="点读" icon={<HandPointer size={22}/>} onClick={()=>notify('点读模式：模拟')} tone="white"/>
    <IconButton label="设置" icon={<Settings2 size={22}/>} onClick={()=>notify('阅读设置：模拟')} tone="white"/>
   </header>
   <div className="reader-content">
    {mode==='read'&&<div className="reader-read">
      <div className="reader-book-stage">
       <div className="reader-book-page">
        <img src={import.meta.env.BASE_URL+'assets/'+assets[page===0?art:sentence.art]} alt="原创模拟阅读插画" draggable={false}/>
        <p>{sentence.en}</p>
       </div>
       <div className="reader-floating"><span>{page+1} / {raz.pages.length}</span></div>
      </div>
      <div className="reader-subtitle-bar">
       <IconButton label="上一页" icon={<ChevronLeft size={28}/>} onClick={previous} disabled={page===0}/>
       <IconButton label="播放本页音频" icon={<Volume2 size={25}/>} tone="primary" onClick={speak}/>
       <div className="reader-subtitle"><strong>{sentence.en}</strong><span>{sentence.zh}</span></div>
       <IconButton label="录制跟读" icon={<Mic size={27}/>} tone="primary"
        onClick={()=>notify('录音功能：静态演示')}/>
       <IconButton label="下一页" icon={<ChevronRight size={28}/>} onClick={next} disabled={page===raz.pages.length-1}/>
      </div>
    </div>}
    {mode==='record'&&<div className="reader-mode-body">
      <div className="reader-mode__art"><img src={import.meta.env.BASE_URL+'assets/'+assets[art]} alt="原创阅读插画"/></div>
      <div className="reader-mode__panel"><h2>跟着读一读</h2><p>{sentence.en}</p>
       <button type="button" className={'reader-record'+(recording?' is-active':'')} data-action="record" onClick={()=>setRecording(v=>!v)}>
        {recording?<Check size={33}/>:<Mic size={33}/>}
       </button><span>{recording?'录音中（模拟状态）':'点击麦克风开始朗读'}</span>
      </div>
    </div>}
    {mode==='exercise'&&<div className="reader-mode-body">
      <div className="reader-mode__art"><img src={import.meta.env.BASE_URL+'assets/'+assets[art]} alt="原创阅读插画"/></div>
      <div className="reader-mode__panel"><h2>看图选一选</h2><p>Where are our friends going?</p>
       <div className="reader-mini-choices">
        {['Road Trip','Space','Underwater','School'].map(s=><button type="button" key={s} data-choice={s}
          className={tapped===s?(s==='Road Trip'?'is-right':'is-wrong'):''} onClick={()=>setTapped(s)}>{s}</button>)}
       </div><span>{tapped?(tapped==='Road Trip'?'🌟 答对啦！':'再试一次吧！'):'选择正确答案'}</span>
      </div>
    </div>}
    {mode==='words'&&<div className="reader-words-mode">
      <div className="reader-words-title"><Star size={23}/> Road Trip · Words</div>
      <div className="reader-word-list">
       {['road trip','bridge','mountain','dam','yawn','Grand Canyon'].map(w=><button type="button" key={w} onClick={()=>{notify('模拟单词音频：'+w);setTapped(w);}}
         className={tapped===w?'is-picked':''}><Volume2 size={20}/>{w}</button>)}
      </div>
      <IconButton label="重新练习" icon={<RotateCcw size={20}/>} onClick={()=>setTapped('')}/>
    </div>}
   </div>
   {modes.includes(mode)&&mode==='read'&&<div className="reader-progress" aria-label="当前阅读进度">{page+1} / {raz.pages.length}</div>}
   <div className="reader-quick"><IconButton label="目录" icon={<List size={23}/>} onClick={()=>notify('目录功能：模拟')}/></div>
 </div>;
}
