import { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Square, CheckSquare } from 'lucide-react';
export type ExerciseGroup={id:string;title:string;category:string;words:string[]};
type Props={group:ExerciseGroup;selected:Set<string>;onToggle:(id:string,word:string)=>void;onSelectAll:(g:ExerciseGroup)=>void};
export function ExerciseGroupCard({group,selected,onToggle,onSelectAll}:Props){
 const [expanded,setExpanded]=useState(true);
 const all=group.words.every(word=>selected.has(group.id+':'+word));
 return <section className="exercise-group" data-group={group.id}>
  <div className="exercise-group__header">
   <BookOpen size={22} color="#3493e9" strokeWidth={2.5}/>
   <strong>{group.title}</strong>
   <button type="button" className="exercise-group__select" aria-label={'全选 '+group.title}
    data-select-all={group.id} onClick={()=>onSelectAll(group)}>
    {all?<CheckSquare size={22} color="#258bf1" fill="#dcecff"/>:<Square size={22}/>}
    <span>全选</span>
   </button>
   <button type="button" className="exercise-group__collapse" aria-label={expanded?'收起':'展开'}
    data-collapse={group.id} onClick={()=>setExpanded(v=>!v)}>
     {expanded?<ChevronUp size={23}/>:<ChevronDown size={23}/>}
   </button>
  </div>
  {expanded&&<div className="exercise-group__words">
   {group.words.map(word=><button key={word} type="button" data-word={word}
    aria-pressed={selected.has(group.id+':'+word)}
    className={'word-chip'+(selected.has(group.id+':'+word)?' is-picked':'')}
    onClick={()=>onToggle(group.id,word)}>{word}</button>)}
  </div>}
 </section>;
}
