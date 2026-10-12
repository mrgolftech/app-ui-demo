import { BookOpen, Mic, ClipboardCheck, BookA } from 'lucide-react';
import { NavLink, useParams } from 'react-router-dom';
export const readingModes=[
 {id:'read',label:'阅读',icon:BookOpen},
 {id:'record',label:'录音',icon:Mic},
 {id:'exercise',label:'练习',icon:ClipboardCheck},
 {id:'words',label:'单词',icon:BookA}
] as const;
export type ReadingMode=(typeof readingModes)[number]['id'];
export function ModeTabBar(){
 const {bookId='road-trip'}=useParams();
 return <nav className="mode-tabs" aria-label="阅读模式">
  {readingModes.map(({id,label,icon:Icon})=><NavLink key={id}
   className={({isActive})=>'mode-tabs__item'+(isActive?' is-active':'')}
   aria-label={label} data-mode={id}
   to={'/reading/book/'+bookId+'/'+id} replace>
    <Icon size={22} strokeWidth={2.35}/><span>{label}</span>
   </NavLink>)}
 </nav>;
}
