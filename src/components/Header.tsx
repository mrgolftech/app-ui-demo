import { ArrowLeft, Grid2X2, LogOut, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ModuleMenu } from './ModuleMenu';
import { useDemoAuth } from '../auth/DemoAuth';
import type { PageId } from '../types';

const titles:Record<PageId,string>={
 home:'小小英语星球',raz:'RAZ 分级阅读',phonics:'Oxford 自然拼读',
 dub:'Little Fox 动画配音',quiz:'单词闯关'
};
export function Header({pageId}:{pageId:PageId}){
 const navigate=useNavigate();
 const {signOut}=useDemoAuth();
 const [menuOpen,setMenuOpen]=useState(false);
 function logout(){setMenuOpen(false);signOut();navigate('/login',{replace:true});}
 return <>
  <header className="app-header">
    {pageId!=='home'&&
     <button type="button" className="header-back" data-action="back" onClick={()=>navigate('/',{replace:true})} aria-label="返回学习首页">
      <ArrowLeft size={19} strokeWidth={2.5}/> <span>返回</span>
     </button>}
    <h1 className="app-header__title">{titles[pageId]}</h1>
    <div className="app-header__space"/>
    <button type="button" className="header-menu" data-action="open-menu"
      aria-expanded={menuOpen} aria-label="打开课程切换菜单" onClick={()=>setMenuOpen(true)}>
      <Grid2X2 size={20} strokeWidth={2.4}/> <span>课程</span>
    </button>
    <span className="star-counter"><Star size={17} fill="#ffc64b" strokeWidth={2.2}/>120</span>
    <button type="button" className="header-logout" data-action="logout"
      aria-label="退出演示账号" onClick={logout}><LogOut size={19}/></button>
  </header>
  {menuOpen&&<ModuleMenu close={()=>setMenuOpen(false)}/>}
 </>;
}
