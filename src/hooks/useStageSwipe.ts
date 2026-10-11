import { useRef } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';

/** Horizontal learning page swipes; keep Android's 32px screen-edge gestures free. */
export function useStageSwipe(onNext:()=>void,onPrevious:()=>void){
  const touch=useRef<{id:number;x:number;y:number;time:number}|null>(null);
  function onPointerDown(e:ReactPointerEvent<HTMLElement>){
    if(e.pointerType!=='touch'||e.clientX<32||e.clientX>innerWidth-32)return;
    if((e.target as HTMLElement).closest('button'))return;
    touch.current={id:e.pointerId,x:e.clientX,y:e.clientY,time:Date.now()};
  }
  function onPointerUp(e:ReactPointerEvent<HTMLElement>){
    const start=touch.current;touch.current=null;
    if(!start||e.pointerId!==start.id||Date.now()-start.time>1200)return;
    const dx=e.clientX-start.x,dy=e.clientY-start.y;
    if(Math.abs(dx)<65||Math.abs(dx)<Math.abs(dy)*1.35)return;
    if(dx<0)onNext();else onPrevious();
  }
  function onPointerCancel(){touch.current=null;}
  return {onPointerDown,onPointerUp,onPointerCancel};
}
