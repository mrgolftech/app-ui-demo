import type { Artwork } from '../types';
import { ArrowUpRight, BookOpen, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
type Props={name:string;subtitle:string;art:Artwork;index:number;to:string;tag?:string};
const coverColors=['mint','peach','lime','lavender','rose','ice','sand','leaf'];
const asset:Record<Artwork,string>={
 meadow:'rabbit.svg',forest:'rabbit.svg',bird:'bird.svg',pond:'pond.svg',
 ship:'ship.svg',village:'village.svg',fox:'fox.svg'
};
export function BookCard({name,subtitle,art,index,to,tag}:Props){
 return <Link to={to} className="book-card" data-book={name}>
   <div className={'book-card__cover book-card__cover--'+coverColors[index%coverColors.length]}>
    <div className="book-card__cover-title"><BookOpen size={17}/> {subtitle}</div>
    <span className="book-card__edition">VOL {index+1}</span>
    <img alt="" draggable={false} src={import.meta.env.BASE_URL+'assets/'+asset[art]}/>
    {tag&&<span className="book-card__tag"><Sparkles size={13}/>{tag}</span>}
   </div>
   <div className="book-card__bottom"><span>{name}</span><ArrowUpRight size={18}/></div>
 </Link>;
}
