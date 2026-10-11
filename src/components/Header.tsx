import { ArrowLeft, Star, Sparkles } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { PageId } from '../types';
const titles:Record<PageId,string>={
  home:'小小英语星球',raz:'RAZ 分级阅读',phonics:'Oxford 自然拼读',
  dub:'Little Fox 动画配音',quiz:'单词闯关'
};
export function Header({pageId}:{pageId:PageId}){
  const nav=useNavigate();
  const location=useLocation();
  const isHome=location.pathname==='/'||pageId==='home';
  return <header className="app-header">
    {isHome?<div className="brand-mark"><Sparkles size={25} strokeWidth={2.7}/></div>:
      <button type="button" className="header-back" data-action="back" onClick={()=>nav(-1)} aria-label="返回上一页面">
        <ArrowLeft size={20} strokeWidth={2.7}/> <span>返回</span>
      </button>}
    <div className="app-header__title">{titles[pageId]}</div>
    <span className="app-header__hint">横屏学习 · 静态演示</span>
    <div className="app-header__space"/>
    <span className="star-counter"><Star size={18} fill="#ffc64b" strokeWidth={2.2}/>120</span>
    <span className="avatar" aria-label="演示用户">🧒</span>
  </header>;
}
