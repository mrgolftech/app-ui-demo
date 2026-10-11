import { chromium } from 'playwright';
import fs from 'node:fs';
const viewports=[[1920,1080],[1600,900],[1280,800],[1024,768],[960,540],[844,390],[390,844]];
const screens=['home','raz','phonics','dub','quiz'];
const browser=await chromium.launch({headless:true});
const errors=[],evidence=[];
fs.mkdirSync('visual-evidence',{recursive:true});
for(const [width,height] of viewports){
 const page=await browser.newPage({viewport:{width,height},hasTouch:true,deviceScaleFactor:1});
 await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
 for(const screen of screens){
  await page.locator('[data-nav="'+screen+'"]').first().click();
  const d=await page.evaluate(()=>{
   const app=document.querySelector('.app-shell'),root=document.documentElement;
   const controls=[...document.querySelectorAll('.study-actions button,.course-card,.header-back,.bottom-nav__item')];
   const bad=controls.filter(b=>{
    const r=b.getBoundingClientRect();
    return r.height<40||r.width<38||r.top<0||r.bottom>innerHeight+2||r.left<0||r.right>innerWidth+2;
   }).map(x=>x.textContent.trim());
   const r=document.querySelector('.media-stage')?.getBoundingClientRect();
   const image=document.querySelector('.media-stage__art img');
   return {scrollWidth:root.scrollWidth,scrollHeight:root.scrollHeight,
     appHeight:app.getBoundingClientRect().height,stage:r?{width:r.width,height:r.height}:null,
     bad,icons:document.querySelectorAll('.bottom-nav__item svg').length,
     imageReady:image?image.complete&&image.naturalWidth>0:true,
     selection:getComputedStyle(document.querySelector('.study-sentence')||app).userSelect
   };
  });
  evidence.push({width,height,screen,...d});
  if(d.scrollWidth>width+2||d.scrollHeight>height+2||d.bad.length||
    d.icons!==5||!d.imageReady||d.selection!=='none')errors.push({width,height,screen,issue:d});
  if(screen!=='home'&&d.stage&&(d.stage.width<90||d.stage.height<90))errors.push({width,height,screen,issue:'Media stage too small'});
  await page.screenshot({path:'visual-evidence/'+screen+'-'+width+'x'+height+'.png',fullPage:false});
 }
 await page.close();
}
const p=await browser.newPage({viewport:{width:844,height:390},hasTouch:true});
await p.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
await p.locator('[data-nav="raz"]').click();
let prev=await p.locator('.media-stage__counter').innerText();
await p.locator('[data-action="next"]').click();
let curr=await p.locator('.media-stage__counter').innerText();
if(prev===curr)errors.push({issue:'RAZ next tap did not change page'});
await p.evaluate(()=>{
 const el=document.querySelector('.media-stage__art'),b=el.getBoundingClientRect();
 const opts={bubbles:true,pointerType:'touch',pointerId:7,button:0};
 el.dispatchEvent(new PointerEvent('pointerdown',{...opts,clientX:b.left+175,clientY:b.top+94}));
 el.dispatchEvent(new PointerEvent('pointerup',{...opts,clientX:b.left+90,clientY:b.top+94}));
});
if(curr===await p.locator('.media-stage__counter').innerText())errors.push({issue:'Touch swipe did not turn RAZ page'});
await p.locator('.header-back').click();
if(await p.locator('.app-shell').getAttribute('data-screen')!=='home')errors.push({issue:'Header back failed'});
await p.locator('[data-nav="phonics"]').click();
prev=await p.locator('.media-stage__counter').innerText();
await p.locator('[data-action="nextword"]').click();
if(prev===await p.locator('.media-stage__counter').innerText())errors.push({issue:'Next phonics word failed'});
await p.locator('[data-nav="dub"]').click();
await p.locator('[data-action="record"]').click();
if(!(await p.locator('.panel-footer').innerText()).includes('录音状态'))errors.push({issue:'Mock recording state failed'});
await p.locator('[data-nav="quiz"]').click();
await p.locator('[data-choice="Rabbit"]').click();
if(await p.locator('.answer.is-correct').count()!==1)errors.push({issue:'Quiz correctness style missing'});
await p.close();
await browser.close();
fs.writeFileSync('visual-evidence/layout-audit.json',JSON.stringify({errors,evidence},null,2));
console.log('Visual audit:',evidence.length,'views;',errors.length,'failures');
if(errors.length){console.error(JSON.stringify(errors,null,2));process.exitCode=1;}
