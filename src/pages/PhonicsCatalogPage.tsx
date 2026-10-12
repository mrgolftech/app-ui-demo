import { useState } from 'react';
import { CatalogLayout } from '../components/CatalogLayout';
import { BookCard } from '../components/BookCard';
import { phonicsSeries,phonicsBooks } from '../data/catalog';
export function PhonicsCatalogPage(){
 const [series,setSeries]=useState(phonicsSeries[0]);
 const books=phonicsBooks.filter(b=>b.series===series);
 return <CatalogLayout title="Oxford Phonics World" backTo="/" categories={phonicsSeries}
   active={series} onSelect={setSeries}>
  <div className="book-grid" data-role="phonics-book-grid">
    {books.length?books.map((book,index)=><BookCard key={book.id} {...book} index={index}
      to={'/phonics/book/'+book.id}/>):<div className="catalog-empty">📚 即将上线的系列</div>}
  </div>
 </CatalogLayout>;
}
