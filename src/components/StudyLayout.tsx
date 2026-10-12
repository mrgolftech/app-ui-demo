import type { ReactNode } from 'react';
import { PracticeBack } from './PracticeBack';
export function StudyLayout({stage,children}:{stage:ReactNode;children:ReactNode}){
 return <div className="study-layout">
  <PracticeBack/>
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
