import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { usePracticeExit } from '../context/PracticeExitContext';

export function StudyLayout({stage,children}:{stage:ReactNode;children:ReactNode}){
 const {requestExit}=usePracticeExit();
 return <div className="study-layout">
   <button type="button" className="practice-back" data-action="back" aria-label="退出当前练习"
     onClick={requestExit}><ArrowLeft size={21} strokeWidth={2.6}/><span>返回</span></button>
   {stage}
   <section className="study-panel">{children}</section>
 </div>;
}
export function PanelMeta({label,progress}:{label:string;progress:string}){
 return <div className="panel-meta"><strong>{label}</strong><span>{progress}</span></div>;
}
export function Actions({children}:{children:ReactNode}){
 return <div className="study-actions">{children}</div>;
}
export function PanelFooter({left,right}:{left:string;right:string}){
 return <div className="panel-footer"><span>{left}</span><span>{right}</span></div>;
}
