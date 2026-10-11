import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

/**
 * Capacitor listens to Android hardware buttons and gesture navigation.
 * Normal browser back/history stays controlled by HashRouter.
 * No Android system navigation modes are hidden or intercepted by CSS.
 */
export function useAndroidBack(){
  const navigate=useNavigate();
  const location=useLocation();
  const pathname=useRef(location.pathname);
  const lastBack=useRef(0);
  useEffect(()=>{pathname.current=location.pathname;},[location.pathname]);
  useEffect(()=>{
    if(!Capacitor.isNativePlatform())return;
    let cancelled=false;
    const listener=CapacitorApp.addListener('backButton',()=>{
      if(pathname.current!=='/'){
        // HashRouter owns the browser history stack.
        if(typeof window.history.state?.idx==='number'&&window.history.state.idx>0)navigate(-1);
        else navigate('/',{replace:true});
        lastBack.current=0;
        return;
      }
      const now=Date.now();
      if(now-lastBack.current<2200){
        void CapacitorApp.exitApp();
      }else{
        lastBack.current=now;
        window.dispatchEvent(new CustomEvent('kidui:toast',{detail:'再按一次返回退出应用'}));
      }
    });
    if(cancelled)void listener.then(h=>h.remove());
    return ()=>{cancelled=true;void listener.then(h=>h.remove());};
  },[navigate]);
}
