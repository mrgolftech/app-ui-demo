import { BookOpen, House, Clapperboard, SpellCheck, Trophy, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
const modules:{to:string;id:string;label:string;icon:ReactNode}[]=[
 {to:'/',id:'home',label:'学习首页',icon:<House size={21}/>},
 {to:'/reading/catalog',id:'raz',label:'绘本阅读',icon:<BookOpen size={21}/>},
 {to:'/phonics/catalog',id:'phonics',label:'自然拼读',icon:<SpellCheck size={21}/>},
 {to:'/dub',id:'dub',label:'动画配音',icon:<Clapperboard size={21}/>},
 {to:'/reading/exercises',id:'quiz',label:'单词闯关',icon:<Trophy size={21}/>}
];
export function ModuleMenu({close}:{close:()=>void}){
 return <div className="module-menu__backdrop" onClick={close} data-role="menu-backdrop">
   <div className="module-menu" role="dialog" aria-modal="true" aria-label="选择学习模块" onClick={e=>e.stopPropagation()}>
    <div className="module-menu__title"><strong>选择学习模块</strong>
     <button type="button" aria-label="关闭课程菜单" onClick={close}><X size={23}/></button>
    </div>
    <div className="module-menu__grid">
     {modules.map(({to,id,label,icon})=><NavLink to={to} key={id} data-open={id}
       onClick={close} className={({isActive})=>'module-menu__item'+(isActive?' is-current':'')}>
      {icon}<span>{label}</span>
     </NavLink>)}
    </div>
    <span className="module-menu__tip">选好课程或单词后，再开始学习</span>
   </div>
  </div>;
}
