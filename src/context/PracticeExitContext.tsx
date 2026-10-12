import { createContext, useContext } from 'react';
export interface PracticeExitValue { requestExit:()=>void }
export const PracticeExitContext=createContext<PracticeExitValue|null>(null);
export function usePracticeExit(){
 const ctx=useContext(PracticeExitContext);
 if(!ctx)throw new Error('usePracticeExit requires AppShell');
 return ctx;
}
