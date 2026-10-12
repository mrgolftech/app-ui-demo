import { useEffect, useRef } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

/** One source of truth for Android back button, back gesture and web Escape key. */
export function useAndroidBack(onBack:()=>void){
 const current=useRef(onBack);
 useEffect(()=>{current.current=onBack;},[onBack]);
 useEffect(()=>{
  let disposed=false;
  let subscription:Promise<{remove:()=>Promise<void>}>|null=null;
  if(Capacitor.isNativePlatform()){
    // App's backButton event replaces native default behavior.
    subscription=CapacitorApp.addListener('backButton',()=>current.current());
  }
  function keydown(e:KeyboardEvent){
    if(e.key!=='Escape'&&e.key!=='Backspace')return;
    if((e.target as HTMLElement)?.closest('input,textarea,select,[contenteditable="true"]'))return;
    e.preventDefault();
    current.current();
  }
  document.addEventListener('keydown',keydown);
  if(disposed&&subscription)void subscription.then(h=>h.remove());
  return ()=>{
    disposed=true;
    document.removeEventListener('keydown',keydown);
    if(subscription)void subscription.then(h=>h.remove());
  };
 },[]);
}
