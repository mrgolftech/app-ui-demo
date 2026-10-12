import { useParams,Link,useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Headphones, BookOpenText, Sparkles, Play } from 'lucide-react';
import { IconButton } from '../components/IconButton';
import { phonics } from '../data/mock';
import { phonicsBooks } from '../data/catalog';
export function PhonicsBookPage(){
 const {bookId='world-3'}=useParams();
 const book=phonicsBooks.find(b=>b.id===bookId)||phonicsBooks[2];
 const nav=useNavigate();
 return <div className="unit-screen">
  <header className="unit-topbar">
   <IconButton label="返回教材列表" icon={<ArrowLeft size={23}/>} onClick={()=>nav('/phonics/catalog')}/>
   <h1>{book.name}</h1>
   <span className="unit-topbar__hint"><Headphones size={18}/> 自然拼读</span>
   <div className="catalog-topbar__spacer"/>
   <span className="unit-topbar__badge"><Sparkles size={17}/> 4 组练习</span>
  </header>
  <div className="unit-list">
   {[
    {name:'Listen & Repeat',desc:'听音 · 看图 · 跟读',icon:Headphones},
    {name:'Sound & Letters',desc:'sh 字母组合拼写',icon:BookOpenText},
    {name:'Let’s Practice',desc:'完成单词拼读',icon:Sparkles},
    {name:'Review',desc:'巩固已学单词',icon:Play}
   ].map(({name,desc,icon:Icon},i)=><Link to="/phonics" state={{returnTo:'/phonics/book/'+book.id}}
     className="unit-card" key={name} data-unit={i}>
     <div className={'unit-card__icon unit-card__icon--'+i}><Icon size={30}/></div>
     <div className="unit-card__text"><strong>Unit {i+1} · {name}</strong><small>{desc} · {phonics.words.length} 词</small></div>
     <ChevronRight size={24} color="#8da9cd"/>
   </Link>)}
  </div>
 </div>;
}
