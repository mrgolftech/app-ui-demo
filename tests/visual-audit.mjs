import { chromium } from 'playwright';
import fs from 'node:fs';
const viewports=[[1920,1080],[1600,900],[1280,800],[1024,768],[960,540],[844,390],[390,844]];
const routes=[
 {name:'home',path:'/'},
 {name:'phonics-catalog',path:'/phonics/catalog'},
 {name:'phonics-book',path:'/phonics/book/world-3'},
 {name:'reading-catalog',path:'/reading/catalog'},
 {name:'reading-exercises',path:'/reading/exercises'},
 {name:'reading-book-read',path:'/reading/book/road-trip/read'},
 {name:'reading-book-record',path:'/reading/book/road-trip/record'},
 {name:'reading-book-exercise',path:'/reading/book/road-trip/exercise'},
 {name:'reading-book-words',path:'/reading/book/road-trip/words'},
 {name:'raz',path:'/raz'},
 {name:'phonics',path:'/phonics'},
 {name:'dub',path:'/dub'},
 {name:'quiz',path:'/quiz'}
];
const errors=[],evidence=[];
const browser=await chromium.launch({headless:true});
fs.mkdirSync('visual-evidence',{recursive:true});
async function login(page){
 await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
 await page.locator('.login-screen').waitFor();
 await page.locator('[data-action="login"]').click();
 await page.locator('.app-shell[data-screen="home"]').waitFor();
}
for(const [width,height] of viewports){
 const page=await browser.newPage({viewport:{width,height},hasTouch:true,deviceScaleFactor:1});
 await login(page);
 // Screens are rendered by separate routes, never in one monolithic HTML file.
 for(const {name,path} of routes){
  await page.goto('http://127.0.0.1:4173/#'+path,{waitUntil:'networkidle'});
  await page.locator('.app-shell[data-screen="'+name+'"]').waitFor({state:'visible'});
  await page.evaluate(async()=>{
   await Promise.all([...document.images].map(img=>img.decode().catch(()=>{})));
  });
  const d=await page.evaluate(()=>{
   const root=document.documentElement;
   const app=document.querySelector('.app-shell');
   const controls=[...document.querySelectorAll(
    '.practice-back,.icon-button,.catalog-primary,.book-card,.unit-card,'+
    '.study-actions button,.quiz-choice,.exercise-group__select,.exercise-group__collapse,'+
    '.word-chip,.mode-tabs__item,.reader-mini-choices button'
   )];
   const clipped=controls.filter(b=>{
    const box=b.getBoundingClientRect();
    return box.width<36||box.height<39||box.right>innerWidth+2||box.bottom>innerHeight+2||
     box.top<-1||box.left<-1;
   }).map(b=>b.getAttribute('aria-label')||b.textContent.trim().slice(0,30));
   // Child overflow inside book grids is intentional (internal scroll), not root scrolling.
   const images=[...document.querySelectorAll('img')];
   const ready=images.filter(img=>img.complete&&img.naturalWidth>0).length;
   const artifacts=[...document.querySelectorAll('.reader-toolbar,.catalog-main,.quiz-choices,.book-grid')];
   return {
    scrollWidth:root.scrollWidth,scrollHeight:root.scrollHeight,
    appHeight:app.getBoundingClientRect().height,
    pageType:app.className,headerCount:document.querySelectorAll('.app-header').length,
    practiceBackCount:document.querySelectorAll('.practice-back').length,
    readerToolbarCount:document.querySelectorAll('.reader-toolbar').length,
    catalogCount:document.querySelectorAll('.catalog-main').length,
    images:images.length,ready,clipped,structure:artifacts.length
   };
  });
  evidence.push({width,height,screen:name,...d});
  const expectedHeader=name==='home'?1:0;
  const expectedBack=['raz','phonics','dub','quiz'].includes(name)?1:0;
  if(d.scrollWidth>width+2||d.scrollHeight>height+2||d.clipped.length||
    d.ready!==d.images||d.headerCount!==expectedHeader||d.practiceBackCount!==expectedBack){
   errors.push({width,height,screen:name,details:d});
  }
  if(name.startsWith('reading-book-')&&d.readerToolbarCount!==1)errors.push({width,height,screen:name,issue:'missing four-mode reading toolbar'});
  if(['reading-exercises','reading-catalog','phonics-catalog'].includes(name)&&d.catalogCount!==1)
    errors.push({width,height,screen:name,issue:'missing split category rail'});
  await page.screenshot({path:'visual-evidence/'+name+'-'+width+'x'+height+'.png',fullPage:false});
 }
 await page.close();
}
// Touch-like workflow tests on the actual phone landscape viewport.
const page=await browser.newPage({viewport:{width:844,height:390},hasTouch:true});
await login(page);
await page.locator('.course-card--phonics').click();
await page.locator('[data-role="phonics-book-grid"]').waitFor();
await page.locator('[data-book="Phonics World 3"]').click();
await page.locator('[data-unit="0"]').click();
await page.locator('.app-shell[data-screen="phonics"]').waitFor();
const before=await page.locator('.media-stage__counter').innerText();
await page.locator('[data-action="nextword"]').click();
if(before===await page.locator('.media-stage__counter').innerText())
 errors.push({issue:'phonics next word not updating'});
await page.locator('.practice-back').click();
await page.locator('[data-action="continue-practice"]').click();
if(await page.locator('.app-shell').getAttribute('data-screen')!=='phonics')
 errors.push({issue:'cancel exit did not preserve phonics'});
await page.keyboard.press('Escape');
await page.locator('.practice-exit-dialog').waitFor();
await page.locator('[data-action="confirm-exit"]').click();
await page.locator('.app-shell[data-screen="phonics-book-world-3"]').waitFor();
await page.goto('http://127.0.0.1:4173/#/reading/catalog',{waitUntil:'networkidle'});
await page.locator('.category-rail__item').filter({hasText:'Nature'}).click();
if(await page.locator('[data-book="Forest Friends"]').count()!==1)
 errors.push({issue:'reading catalog category filtering failed'});
await page.locator('[data-action="open-exercises"]').click();
await page.locator('[data-group="37"]').waitFor();
await page.locator('[data-word="bridge"]').click();
if(await page.locator('[data-word="bridge"]').getAttribute('aria-pressed')!=='false')
 errors.push({issue:'word chip did not deselect'});
await page.locator('[data-word="bridge"]').click();
await page.locator('[data-collapse="37"]').click();
if(await page.locator('[data-group="37"] [data-word="bridge"]').count()!==0)
 errors.push({issue:'group collapse failed'});
await page.locator('[data-collapse="37"]').click();
await page.locator('[data-select-all="37"]').click();
await page.locator('[data-select-all="37"]').click();
await page.locator('[data-action="start-exercise"]').click();
await page.locator('.quiz-screen').waitFor();
if(!(await page.locator('.quiz-prompt__word h1').innerText()).includes('bridge'))
 errors.push({issue:'selected words were not passed into quiz'});
await page.locator('[data-choice="n. 桥"]').click();
if(await page.locator('.quiz-choice.is-correct').count()!==1)
 errors.push({issue:'vocabulary answer was not evaluated'});
await page.locator('[data-action="nextquiz"]').click();
await page.locator('.practice-back').click();
await page.locator('[data-action="confirm-exit"]').click();
await page.locator('.app-shell[data-screen="reading-exercises"]').waitFor();
await page.goto('http://127.0.0.1:4173/#/reading/book/road-trip/read',{waitUntil:'networkidle'});
for(const mode of ['record','exercise','words','read']){
 await page.locator('[data-mode="'+mode+'"]').click();
 await page.locator('.reader-toolbar').waitFor();
 if(!page.url().includes('/'+mode))errors.push({issue:'reading mode route not switched: '+mode});
}
await page.locator('.reader-toolbar [data-action="back"]').click();
await page.locator('.practice-exit-dialog').waitFor();
await page.screenshot({path:'visual-evidence/exit-confirm-844x390.png'});
await page.keyboard.press('Escape');
if(await page.locator('.practice-exit-dialog').count())
 errors.push({issue:'Escape should dismiss exit dialog'});
await page.locator('.reader-toolbar [data-action="back"]').click();
await page.locator('[data-action="confirm-exit"]').click();
await page.locator('.app-shell[data-screen="reading-catalog"]').waitFor();
await page.close();
await browser.close();
fs.writeFileSync('visual-evidence/layout-audit.json',JSON.stringify({errors,evidence,viewports,routes:routes.map(s=>s.name)},null,2));
console.log('Visual audit:',evidence.length,'route/viewport screenshots;',errors.length,'failures');
if(errors.length){console.error(JSON.stringify(errors.slice(0,30),null,2));process.exitCode=1;}
