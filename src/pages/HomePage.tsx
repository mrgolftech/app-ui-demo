import { NavLink } from 'react-router-dom';
import { ArrowRight, BookOpen, Clapperboard, SpellCheck, Sparkles } from 'lucide-react';
const cards=[
 {to:'/reading/catalog',id:'raz',title:'分级阅读',sub:'阅读 A-Z · 绘本、练习与单词',action:'打开绘本',icon:BookOpen,emoji:'📚'},
 {to:'/phonics/catalog',id:'phonics',title:'自然拼读',sub:'Oxford · 教材与单元练习',action:'开始拼读',icon:SpellCheck,emoji:'🔤'},
 {to:'/dub',id:'dub',title:'动画配音',sub:'Little Fox · 跟读与配音',action:'一起配音',icon:Clapperboard,emoji:'🦊'}
] as const;
export function HomePage(){
 return <div className="home-page">
  <section className="welcome-card"><div>
   <span className="welcome-card__kicker"><Sparkles size={17}/> GOOD MORNING!</span>
   <h1>今天也一起<br/>快乐学英语！</h1>
   <p>读绘本 · 学拼读 · 玩配音</p></div>
   <span className="welcome-card__mascot" aria-hidden="true">🐰✨</span>
  </section>
  <div className="home-cards">
   {cards.map(({to,id,title,sub,action,icon:Icon,emoji})=>
    <NavLink key={id} to={to} data-open={id} className={'course-card course-card--'+id}>
     <div className="course-card__art" aria-hidden="true"><span>{emoji}</span></div>
     <div className="course-card__meta"><h2><Icon size={21} strokeWidth={2.5}/>{title}</h2><p>{sub}</p></div>
     <div className="course-card__action"><span>{action}</span><ArrowRight size={22}/></div>
    </NavLink>)}
  </div>
 </div>;
}
