import { Play, Volume2 } from 'lucide-react';
import type { Artwork } from '../types';
import type { ReactNode } from 'react';
import { useStageSwipe } from '../hooks/useStageSwipe';
const assets:Record<Artwork,string>={meadow:'rabbit.svg',forest:'rabbit.svg',bird:'bird.svg',
 pond:'pond.svg',ship:'ship.svg',village:'village.svg',fox:'fox.svg'};
interface Props {art:Artwork;counter:string;theme:'raz'|'phonics'|'dub'|'quiz';playLabel:string;
 onPlay:()=>void;onNext?:()=>void;onPrevious?:()=>void;children?:ReactNode}
export function MediaStage({art,counter,theme,playLabel,onPlay,onNext,onPrevious,children}:Props){
 const pointer=useStageSwipe(onNext||(()=>{}),onPrevious||(()=>{}));
 return <div className={'media-stage media-stage--'+theme} data-swipe-zone={theme} {...pointer}>
  <div className="media-stage__art"><img src={import.meta.env.BASE_URL+'assets/'+assets[art]}
    alt="原创儿童学习插画" draggable={false}/></div>
  <span className="media-stage__counter">{counter}</span>
  {children}
  <button type="button" className="media-stage__play" title={playLabel} aria-label={playLabel}
   data-action="play-stage" onClick={onPlay}>
   {theme==='dub'?<Play size={23} fill="currentColor"/>:<Volume2 size={24}/>}
  </button>
 </div>;
}
