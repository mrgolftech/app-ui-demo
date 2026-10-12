import type { Artwork } from '../types';
import type { ExerciseGroup } from '../components/ExerciseGroupCard';
export type CatalogBook={id:string;name:string;subtitle:string;art:Artwork;tag?:string;series:string};
export const phonicsSeries=['Oxford Phonics World','Now I’m reading','Phonics Kids','Phonics Monsters','Learning to Read','Go Go Phonics','Look into Phonics'];
export const phonicsBooks:CatalogBook[]=[
 {id:'world-1',name:'Phonics World 1',subtitle:'Phonics World',art:'bird',tag:'可测评',series:'Oxford Phonics World'},
 {id:'world-2',name:'Phonics World 2',subtitle:'Phonics World',art:'village',tag:'可测评',series:'Oxford Phonics World'},
 {id:'world-3',name:'Phonics World 3',subtitle:'Phonics World',art:'fox',tag:'可测评',series:'Oxford Phonics World'},
 {id:'world-4',name:'Phonics World 4',subtitle:'Phonics World',art:'ship',tag:'可测评',series:'Oxford Phonics World'},
 {id:'world-5',name:'Phonics World 5',subtitle:'Phonics World',art:'pond',tag:'可测评',series:'Oxford Phonics World'},
 {id:'workbook-1',name:'World 1 Workbook',subtitle:'Workbook',art:'bird',series:'Oxford Phonics World'},
 {id:'workbook-2',name:'World 2 Workbook',subtitle:'Workbook',art:'village',series:'Oxford Phonics World'},
 {id:'workbook-3',name:'World 3 Workbook',subtitle:'Workbook',art:'meadow',series:'Oxford Phonics World'}
];
export const readingCategories=['Nature','Science','Exploration','Life','People','Stories','Other'];
export const readingBooks:CatalogBook[]=[
 {id:'road-trip',name:'Road Trip',subtitle:'Reading A-Z C',art:'ship',tag:'Level C',series:'Exploration'},
 {id:'forest-friends',name:'Forest Friends',subtitle:'Reading A-Z C',art:'meadow',tag:'Level C',series:'Nature'},
 {id:'the-pond',name:'The Pond',subtitle:'Reading A-Z C',art:'pond',tag:'Level C',series:'Nature'},
 {id:'blue-bird',name:'Blue Bird',subtitle:'Reading A-Z C',art:'bird',tag:'Level C',series:'Science'},
 {id:'my-town',name:'My Town',subtitle:'Reading A-Z C',art:'village',tag:'Level C',series:'People'},
 {id:'the-little-fox',name:'The Little Fox',subtitle:'Reading A-Z C',art:'fox',tag:'Level C',series:'Stories'}
];
export const exerciseGroups:ExerciseGroup[]=[
 {id:'36',title:'36 · Mash the Potatoes',category:'Life',words:['boil','count','eat','mash','peel','potato']},
 {id:'37',title:'37 · Road Trip',category:'Exploration',words:['bridge','dam','Grand Canyon','mountain','road trip','yawn']},
 {id:'38',title:'38 · Shadows',category:'Exploration',words:['blocked','long','round','shape','short','square']},
 {id:'39',title:'39 · Blue Bird',category:'Nature',words:['bird','branch','fly','sky','sing','tree']},
 {id:'40',title:'40 · My Town',category:'People',words:['bridge','home','shop','street','town','walk']},
 {id:'41',title:'41 · Little Fox',category:'Stories',words:['day','friend','fox','forest','play','tomorrow']},
 {id:'42',title:'42 · Stars',category:'Science',words:['light','moon','night','space','star','sun']}
];
