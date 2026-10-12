import { ArrowLeft } from 'lucide-react';
import { usePracticeExit } from '../context/PracticeExitContext';
/** Same icon-only back control on every immersive learning page. */
export function PracticeBack(){
 const {requestExit}=usePracticeExit();
 return <button className="practice-back" data-action="back" type="button"
  title="退出练习" aria-label="退出当前练习" onClick={requestExit}>
  <ArrowLeft size={25} strokeWidth={2.8}/><span className="sr-only">返回</span>
 </button>;
}
