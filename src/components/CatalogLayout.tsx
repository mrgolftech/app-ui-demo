import type { ReactNode } from 'react';
import { ArrowLeft, Search, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from './IconButton';
import { notify } from '../lib/notify';

type Props={title:string;backTo:string;categories:string[];active:string;onSelect:(s:string)=>void;
 children:ReactNode;toolbar?:ReactNode;searchable?:boolean;favorites?:boolean};
export function CatalogLayout({title,backTo,categories,active,onSelect,children,toolbar,searchable=true,favorites=true}:Props){
 const navigate=useNavigate();
 return <div className="catalog-screen">
  <header className="catalog-topbar">
   <IconButton label="返回" icon={<ArrowLeft size={23}/>} onClick={()=>navigate(backTo)} compact/>
   <h1>{title}</h1>
   <div className="catalog-topbar__spacer"/>
   {toolbar}
   {searchable&&<IconButton label="搜索" icon={<Search size={22}/>} onClick={()=>notify('搜索功能：模拟界面')} tone="white"/>}
   {favorites&&<IconButton label="收藏" icon={<Star size={22}/>} onClick={()=>notify('收藏列表：模拟界面')} tone="white"/>}
  </header>
  <div className="catalog-main">
   <nav className="category-rail" aria-label="分类目录">
    {categories.map(c=><button type="button" key={c}
     className={'category-rail__item'+(active===c?' is-selected':'')}
     aria-current={active===c?'page':undefined} onClick={()=>onSelect(c)}>
       <span>{c}</span>
     </button>)}
   </nav>
   <div className="catalog-content">{children}</div>
  </div>
 </div>;
}
