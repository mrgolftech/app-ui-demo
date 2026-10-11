import { chromium } from 'playwright';
import fs from 'node:fs';
const viewports=[[1920,1080],[1600,900],[1280,800],[1024,768],[960,540],[844,390],[390,844]];
const screens=['home','raz','phonics','dub','quiz'];
const browser=await chromium.launch({headless:true});
let errors=[];const evidence=[];
fs.mkdirSync('visual-evidence',{recursive:true});
for(const [width,height] of viewports){
 const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1,hasTouch:true});
 await page.goto('http://127.0.0.1:4173/',{waitUntil:'load'});
 for(const screen of screens){
  await page.locator('[data-open="'+screen+'"]').first().click();
  const d=await page.evaluate(()=>{
   const root=document.documentElement,app=document.querySelector('#app'), main=document.querySelector('.main');
   const btn=[...document.querySelectorAll('.actions button,.course-card,.header-back')];
   const bad=btn.filter(b=>{const r=b.getBoundingClientRect();return r.width<44||r.height<40||r.top<0||r.bottom>window.innerHeight+2||r.left<0||r.right>window.innerWidth+2;}).map(b=>b.textContent.trim());
   const stage=document.querySelector('.stage')?.getBoundingClientRect();
   return {innerWidth,innerHeight,scrollWidth:root.scrollWidth,scrollHeight:root.scrollHeight,
     appHeight:app.getBoundingClientRect().height,mainHeight:main.getBoundingClientRect().height,
     stageSize:stage?{width:stage.width,height:stage.height}:null,
     textSelection:getComputedStyle(app.querySelector('.sentence')||app).userSelect,
     bad};
  });
  evidence.push({width,height,screen,...d});
  if(d.scrollWidth>width+2||d.scrollHeight>height+2||d.bad.length||d.textSelection!=='none')errors.push({width,height,screen,issue:d});
  if(screen!=='home'&&d.stageSize&&(d.stageSize.width<80||d.stageSize.height<90))errors.push({width,height,screen,issue:'stage too small'});
  await page.screenshot({path:`visual-evidence/${screen}-${width}x${height}.png`,fullPage:false});
 }
 await page.close();
}
const testPage=await browser.newPage({viewport:{width:844,height:390},hasTouch:true});
await testPage.goto('http://127.0.0.1:4173/',{waitUntil:'load'});
await testPage.locator('[data-open="raz"]').first().click();
const before=await testPage.locator('.stage-counter').innerText();
await testPage.locator('[data-action="next"]').click();
const after=await testPage.locator('.stage-counter').innerText();
if(before===after)errors.push({issue:'RAZ next tap did not turn page'});
// Synthetic touch pointer swipe across stage; should turn a page without stealing edge back gestures.
const box=await testPage.locator('.stage').boundingBox();
if(box){
 await testPage.evaluate(({x,y})=>{
  const target=document.querySelector('.stage-inner');
  const opts={bubbles:true,pointerType:'touch',pointerId:7,button:0};
  target.dispatchEvent(new PointerEvent('pointerdown',{...opts,clientX:x+110,clientY:y+80}));
  target.dispatchEvent(new PointerEvent('pointerup',{...opts,clientX:x+30,clientY:y+80}));
 },{x:box.x,y:box.y});
 const swiped=await testPage.locator('.stage-counter').innerText();
 if(swiped===after)errors.push({issue:'RAZ left swipe did not turn page'});
}
await testPage.locator('.header-back').click();
if(await testPage.locator('#app').getAttribute('data-screen')!=='home')errors.push({issue:'Header back did not navigate home'});
await testPage.locator('[data-open="phonics"]').first().click();
const word=await testPage.locator('.stage-counter').innerText();
await testPage.locator('[data-action="nextword"]').click();
if(word===await testPage.locator('.stage-counter').innerText())errors.push({issue:'Phonics next word did not switch mock content'});
await testPage.close();
await browser.close();
fs.writeFileSync('visual-evidence/layout-audit.json',JSON.stringify({errors,evidence},null,2));
console.log('Visual audit:',evidence.length,'views;',errors.length,'failures');
if(errors.length){console.error(JSON.stringify(errors,null,2));process.exitCode=1;}
