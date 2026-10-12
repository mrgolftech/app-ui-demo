import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

/** Preserve Android navigation gestures: details go to learning home; home exits on double back. */
export function useAndroidBack(){
 const navigate=useNavigate();
 const location=useLocation();
 const path=useRef(location.pathname);
 const lastBack=useRef(0);
 useEffect(()=>{path.current=location.pathname;},[location.pathname]);
 useEffect(()=>{
  if(!Capacitor.isNativePlatform())return;
  let disposed=false;
  const listener=CapacitorApp.addListener('backButton',()=>{
   if(path.current!=='/'){
    navigate('/',{replace:true});lastBack.current=0;return;
   }
   const now=Date.now();
   if(now-lastBack.current<2200){void CapacitorApp.exitApp();}
   else{
    lastBack.current=now;
    window.dispatchEvent(new CustomEvent('kidui:toast',{detail:'再按一次返回退出应用'}));
   }
  });
  if(disposed)void listener.then(h=>h.remove());
  return ()=>{disposed=true;void listener.then(h=>h.remove());};
 },[navigate]);
}
