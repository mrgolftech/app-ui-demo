import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Header } from './Header';
import { PracticeExitDialog } from './PracticeExitDialog';
import { PracticeExitContext } from '../context/PracticeExitContext';
import { useAndroidBack } from '../hooks/useAndroidBack';

function isPracticePath(path:string){
 return ['/raz','/phonics','/dub','/quiz'].includes(path) ||
  /^\/reading\/book\/[^/]+\/(read|record|exercise|words)$/.test(path);
}
function categoryBack(path:string){
 if(path.startsWith('/reading/exercises'))return '/reading/catalog';
 if(path.startsWith('/phonics/book/'))return '/phonics/catalog';
 if(path.startsWith('/reading/')||path.startsWith('/phonics/'))return '/';
 return '/';
}
export function AppShell(){
 const navigate=useNavigate();
 const location=useLocation();
 const path=location.pathname;
 const home=path==='/';
 const practising=isPracticePath(path);
 const [exitOpen,setExitOpen]=useState(false);
 const [toast,setToast]=useState('');
 const lastHomeBack=useRef(0);
 const requestExit=useCallback(()=>setExitOpen(true),[]);
 const continuePractice=useCallback(()=>setExitOpen(false),[]);
 const confirmExit=useCallback(()=>{
  setExitOpen(false);
  const state=location.state as {returnTo?:string}|null;
  const origin=state?.returnTo;
  let fallback=path==='/phonics'?'/phonics/catalog':
    path==='/raz'?'/reading/catalog':
    path==='/quiz'?'/reading/exercises':
    path.startsWith('/reading/book/')?'/reading/catalog':'/';
  if(origin?.startsWith('/')&&!origin.startsWith('//'))fallback=origin;
  navigate(fallback,{replace:true});
 },[navigate,location.state,path]);
 useEffect(()=>{setExitOpen(false);},[path]);
 const back=useCallback(()=>{
  if(exitOpen){continuePractice();return;}
  if(practising){requestExit();return;}
  if(!home){navigate(categoryBack(path));return;}
  const now=Date.now();
  if(now-lastHomeBack.current<2200){
   if(Capacitor.isNativePlatform())void CapacitorApp.exitApp();
   else setToast('已在学习首页');
  }else{
   lastHomeBack.current=now;setToast('再按一次返回退出应用');
  }
 },[exitOpen,practising,home,path,requestExit,continuePractice,navigate]);
 useAndroidBack(back);
 const context=useMemo(()=>({requestExit}),[requestExit]);
 useEffect(()=>{
  let timer:ReturnType<typeof setTimeout>|undefined;
  const handler=(e:Event)=>{
   const msg=(e as CustomEvent<string>).detail;
   if(!msg)return;setToast(msg);clearTimeout(timer);timer=setTimeout(()=>setToast(''),1650);
  };
  window.addEventListener('kidui:toast',handler);
  return ()=>{window.removeEventListener('kidui:toast',handler);clearTimeout(timer);};
 },[]);
 const screen=home?'home':path.slice(1).replaceAll('/','-');
 return <PracticeExitContext.Provider value={context}>
  <div className={'app-shell'+(practising?' app-shell--practice':!home?' app-shell--workspace':'')}
    data-screen={screen}>
   {home&&<Header pageId="home"/>}
   <main className="app-main"><Outlet/></main>
   {toast&&<div className="app-toast" role="status">{toast}</div>}
   <PracticeExitDialog open={exitOpen} onContinue={continuePractice} onExit={confirmExit}/>
  </div>
 </PracticeExitContext.Provider>;
}
