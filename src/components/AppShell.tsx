import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Header } from './Header';
import { PracticeExitDialog } from './PracticeExitDialog';
import { PracticeExitContext } from '../context/PracticeExitContext';
import { useAndroidBack } from '../hooks/useAndroidBack';
import type { PageId } from '../types';

function pageFromPath(path:string):PageId{
 const slug=path.replace(/^\/+/, '');
 return (['home','raz','phonics','dub','quiz'].includes(slug)?slug:'home') as PageId;
}
export function AppShell(){
 const navigate=useNavigate();
 const location=useLocation();
 const id=pageFromPath(location.pathname);
 const practising=id!=='home';
 const [exitOpen,setExitOpen]=useState(false);
 const [toast,setToast]=useState('');
 const lastHomeBack=useRef(0);
 const requestExit=useCallback(()=>setExitOpen(true),[]);
 const continuePractice=useCallback(()=>setExitOpen(false),[]);
 const confirmExit=useCallback(()=>{
  setExitOpen(false);
  navigate('/',{replace:true});
 },[navigate]);

 // Hide the dialog when a route has genuinely changed (e.g. logout).
 useEffect(()=>{setExitOpen(false);},[location.pathname]);
 const back=useCallback(()=>{
  if(exitOpen){continuePractice();return;}
  if(practising){requestExit();return;}
  const now=Date.now();
  if(now-lastHomeBack.current<2200){
   if(Capacitor.isNativePlatform())void CapacitorApp.exitApp();
   else setToast('已在学习首页');
  }else{
   lastHomeBack.current=now;
   setToast('再按一次返回退出应用');
  }
 },[exitOpen,practising,requestExit,continuePractice]);
 useAndroidBack(back);
 const context=useMemo(()=>({requestExit}),[requestExit]);
 useEffect(()=>{
  let timer:ReturnType<typeof setTimeout>|undefined;
  const handler=(e:Event)=>{
   const msg=(e as CustomEvent<string>).detail;
   if(!msg)return;
   setToast(msg);clearTimeout(timer);timer=setTimeout(()=>setToast(''),1650);
  };
  window.addEventListener('kidui:toast',handler);
  return ()=>{window.removeEventListener('kidui:toast',handler);clearTimeout(timer);};
 },[]);
 return <PracticeExitContext.Provider value={context}>
  <div className={'app-shell theme-'+id+(practising?' app-shell--practice':'')} data-screen={id}>
    {!practising&&<Header pageId="home"/>}
    <main className="app-main"><Outlet/></main>
    {toast&&<div className="app-toast" role="status">{toast}</div>}
    <PracticeExitDialog open={exitOpen} onContinue={continuePractice} onExit={confirmExit}/>
  </div>
 </PracticeExitContext.Provider>;
}
