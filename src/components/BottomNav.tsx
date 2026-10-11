import { NavLink } from 'react-router-dom';
import { House, BookOpen, SpellCheck, Clapperboard, Trophy } from 'lucide-react';
import type { ComponentType } from 'react';

type NavItem={to:string;label:string;id:string;icon:ComponentType<{size?:number;strokeWidth?:number;className?:string}>};
const items:NavItem[]=[
  {to:'/',id:'home',label:'学习首页',icon:House},
  {to:'/raz',id:'raz',label:'绘本阅读',icon:BookOpen},
  {to:'/phonics',id:'phonics',label:'自然拼读',icon:SpellCheck},
  {to:'/dub',id:'dub',label:'动画配音',icon:Clapperboard},
  {to:'/quiz',id:'quiz',label:'单词练习',icon:Trophy}
];
export function BottomNav(){
  return <nav className="bottom-nav" aria-label="学习模块导航">
    {items.map(({to,id,label,icon:Icon})=><NavLink
      key={id} to={to} end={to==='/'} data-nav={id}
      className={({isActive})=>'bottom-nav__item'+(isActive?' is-active':'')}>
      <Icon size={24} strokeWidth={2.4} className="bottom-nav__icon" aria-hidden="true"/>
      <span>{label}</span>
    </NavLink>)}
  </nav>;
}
