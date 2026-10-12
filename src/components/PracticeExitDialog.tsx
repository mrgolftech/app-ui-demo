import { useEffect, useRef } from 'react';
import { DoorOpen, Heart, X } from 'lucide-react';

/** Shared kid-friendly confirmation: retaining focus until exit is decided. */
export function PracticeExitDialog({open,onContinue,onExit}:{
  open:boolean;onContinue:()=>void;onExit:()=>void
}){
 const continueRef=useRef<HTMLButtonElement>(null);
 useEffect(()=>{
  if(open)continueRef.current?.focus();
 },[open]);
 if(!open)return null;
 return <div className="practice-exit-backdrop" data-role="practice-exit-backdrop">
  <section className="practice-exit-dialog" role="alertdialog" aria-modal="true"
   aria-labelledby="practice-exit-title" aria-describedby="practice-exit-message">
   <button className="practice-exit-close" type="button" aria-label="继续练习，关闭对话框"
     data-action="cancel-exit-close" onClick={onContinue}><X size={21}/></button>
   <span className="practice-exit-illustration" aria-hidden="true">🐻</span>
   <h2 id="practice-exit-title">要退出这次练习吗？</h2>
   <p id="practice-exit-message">再学一会儿吧！退出后会返回学习首页。</p>
   <div className="practice-exit-actions">
    <button type="button" ref={continueRef} className="practice-exit-continue"
      data-action="continue-practice" onClick={onContinue}>
       <Heart size={20} fill="currentColor"/> 继续学习
    </button>
    <button type="button" className="practice-exit-confirm"
      data-action="confirm-exit" onClick={onExit}>
       <DoorOpen size={19}/> 退出练习
    </button>
   </div>
  </section>
 </div>;
}
