import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardCheck,ArrowRight } from 'lucide-react';
import { CatalogLayout } from '../components/CatalogLayout';
import { BookCard } from '../components/BookCard';
import { readingBooks,readingCategories } from '../data/catalog';
export function ReadingCatalogPage(){
 const [category,setCategory]=useState('Exploration');
 const books=readingBooks.filter(b=>b.series===category);
 return <CatalogLayout title="Reading A-Z · Level C" backTo="/"
  categories={readingCategories} active={category} onSelect={setCategory}
  toolbar={<Link className="catalog-primary" data-action="open-exercises" to="/reading/exercises">
   <ClipboardCheck size={19}/><span>词汇练习</span><ArrowRight size={17}/>
  </Link>}>
  <div className="book-grid" data-role="reading-book-grid">
    {books.map((book,i)=><BookCard key={book.id} {...book} index={i} to={'/reading/book/'+book.id+'/read'}/>)}
  </div>
 </CatalogLayout>;
}
