import { useEffect, useState } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { Header } from './Header';
import { useAndroidBack } from '../hooks/useAndroidBack';
import type { PageId } from '../types';
function pageFromPath(path:string):PageId{
 const slug=path.replace(/^\/+/, '');
 return (['home','raz','phonics','dub','quiz'].includes(slug)?slug:'home') as PageId;
}
export function AppShell(){
 const location=useLocation();
 const id=pageFromPath(location.pathname);
 const [toast,setToast]=useState('');
 useAndroidBack();
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
 return <div className={'app-shell theme-'+id} data-screen={id}>
  <Header pageId={id}/>
  <main className="app-main"><Outlet/></main>
  {toast&&<div className="app-toast" role="status">{toast}</div>}
 </div>;
}
