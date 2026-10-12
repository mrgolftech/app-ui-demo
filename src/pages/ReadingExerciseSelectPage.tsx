import { useMemo,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';
import { CatalogLayout } from '../components/CatalogLayout';
import { ExerciseGroupCard } from '../components/ExerciseGroupCard';
import { exerciseGroups,readingCategories } from '../data/catalog';
export function ReadingExerciseSelectPage(){
 const nav=useNavigate();
 const [category,setCategory]=useState('Exploration');
 const [selected,setSelected]=useState<Set<string>>(()=>new Set(
   exerciseGroups.filter(g=>g.category==='Exploration').flatMap(g=>g.words.map(w=>g.id+':'+w))
 ));
 const filtered=useMemo(()=>exerciseGroups.filter(g=>g.category===category),[category]);
 const selectedWords=filtered.flatMap(g=>g.words.filter(w=>selected.has(g.id+':'+w)));
 const toggle=(id:string,word:string)=>{
  const key=id+':'+word;
  setSelected(old=>{const next=new Set(old);if(next.has(key))next.delete(key);else next.add(key);return next;});
 };
 const selectAll=(g:typeof exerciseGroups[number])=>{
  setSelected(old=>{
   const next=new Set(old),all=g.words.every(w=>next.has(g.id+':'+w));
   g.words.forEach(w=>all?next.delete(g.id+':'+w):next.add(g.id+':'+w));
   return next;
  });
 };
 const start=()=>{if(selectedWords.length)nav('/quiz',{state:{returnTo:'/reading/exercises',words:selectedWords}});};
 return <CatalogLayout title="Reading AtoZ-C" backTo="/reading/catalog"
  categories={readingCategories} active={category} onSelect={setCategory}
  searchable={false} favorites={false} toolbar={<button type="button" onClick={start}
    disabled={!selectedWords.length} className="catalog-primary" data-action="start-exercise">
    <Play size={19} fill="currentColor"/><span>开始练习</span><small>{selectedWords.length}</small>
  </button>}>
  <div className="exercise-list" data-role="exercise-group-list">
   {filtered.map(group=><ExerciseGroupCard key={group.id} group={group}
     selected={selected} onToggle={toggle} onSelectAll={selectAll}/>)}
  </div>
 </CatalogLayout>;
}
