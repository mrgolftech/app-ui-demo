import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar } from '@capacitor/status-bar';

/** Hide top Android status bar while leaving the system navigation bar/gestures available. */
export function useFullscreenStatusBar(){
 useEffect(()=>{
  if(!Capacitor.isNativePlatform())return;
  // Native MainActivity also hides this at startup to avoid a launch-time flash.
  void StatusBar.hide().catch(err=>console.warn('Unable to hide Android status bar:',err));
  const rehide=()=>{void StatusBar.hide().catch(()=>{});};
  document.addEventListener('resume',rehide);
  return ()=>document.removeEventListener('resume',rehide);
 },[]);
}
