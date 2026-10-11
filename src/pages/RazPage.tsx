import { useState } from 'react';
import { ChevronLeft, ChevronRight, Volume2 } from 'lucide-react';
import { raz } from '../data/mock';
import { notify } from '../lib/notify';
import { StudyLayout,PanelMeta,Actions,PanelFooter } from '../components/StudyLayout';
import { ActionButton } from '../components/ActionButton';
import { MediaStage } from '../components/MediaStage';

export function RazPage(){
  const [index,setIndex]=useState(2);
  const page=raz.pages[index];
  const next=()=>setIndex(i=>Math.min(raz.pages.length-1,i+1));
  const previous=()=>setIndex(i=>Math.max(0,i-1));
  const play=()=>notify('示例朗读：未接入音频资源');
  return <StudyLayout stage={<MediaStage art={page.art} theme="raz" counter={'第 '+(index+1)+' / '+raz.pages.length+' 页'}
    playLabel="听一听 · 示例朗读" onPlay={play} onNext={next} onPrevious={previous}/>}>
    <PanelMeta label="📖 LEVEL C · FOREST FRIENDS" progress={(index+1)+' / '+raz.pages.length}/>
    <h1>{raz.title}</h1>
    <p className="study-sentence">{page.en}</p>
    <p className="study-translation">{page.zh}</p>
    <div className="panel-spacer"/>
    <Actions>
      <ActionButton data-action="prev" onClick={previous} disabled={index===0}><ChevronLeft size={20}/>上一页</ActionButton>
      <ActionButton tone="blue" data-action="play" onClick={play}><Volume2 size={20}/>朗读</ActionButton>
      <ActionButton data-action="next" onClick={next} disabled={index===raz.pages.length-1}>下一页<ChevronRight size={20}/></ActionButton>
    </Actions>
    <PanelFooter left="左右滑动插画翻页 · 主要控件始终可见" right={(index+1)+' / '+raz.pages.length}/>
  </StudyLayout>;
}
