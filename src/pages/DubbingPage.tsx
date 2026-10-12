import { useState } from 'react';
import { ChevronLeft,ChevronRight,Mic,Square } from 'lucide-react';
import { dubbing } from '../data/mock';
import { MediaStage } from '../components/MediaStage';
import { StudyLayout,PanelMeta,Actions,PanelFooter } from '../components/StudyLayout';
import { ActionButton } from '../components/ActionButton';
import { notify } from '../lib/notify';
export function DubbingPage(){
 const [index,setIndex]=useState(0);
 const [recording,setRecording]=useState(false);
 const line=dubbing.lines[index];
 const next=()=>{setIndex(i=>Math.min(dubbing.lines.length-1,i+1));setRecording(false);};
 const previous=()=>{setIndex(i=>Math.max(0,i-1));setRecording(false);};
 const toggle=()=>{setRecording(v=>!v);notify(recording?'模拟录音完成':'模拟录音中 · 未使用麦克风');};
 return <StudyLayout stage={<MediaStage theme="dub" art={line.art}
    counter={'第 '+(index+1)+' / '+dubbing.lines.length+' 句'}
    playLabel="预览动画画面" onPlay={()=>notify('插画用于展示布局，非实际视频')}
    onNext={next} onPrevious={previous}/>}>
  <PanelMeta label="🎬 LITTLE FOX · GREEN FOREST" progress={(index+1)+' / '+dubbing.lines.length}/>
  <h1>小狐狸的森林一天</h1>
  <p className="study-sentence">{line.en}</p>
  <p className="study-translation">{line.zh}</p>
  <div className="panel-spacer"/>
  <Actions>
   <ActionButton data-action="prevsentence" aria-label="上一句" title="上一句"
    disabled={index===0} onClick={previous}><ChevronLeft size={27}/></ActionButton>
   <ActionButton tone="orange" data-action="record" aria-label={recording?'停止录音':'开始配音'}
    title={recording?'停止录音':'开始配音'} onClick={toggle}>
    {recording?<Square size={25} fill="currentColor"/>:<Mic size={27}/>}</ActionButton>
   <ActionButton data-action="nextsentence" aria-label="下一句" title="下一句"
    disabled={index===dubbing.lines.length-1} onClick={next}><ChevronRight size={27}/></ActionButton>
  </Actions>
  <PanelFooter left={recording?'● 录音状态演示中':'本页不会采集真实音频'} right="🎧 1.0×"/>
 </StudyLayout>;
}
