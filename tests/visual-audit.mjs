import { chromium } from 'playwright';
import fs from 'node:fs';
const viewports=[[1920,1080],[1600,900],[1280,800],[1024,768],[960,540],[844,390],[390,844]];
const screens=['home','raz','phonics','dub','quiz'];
const browser=await chromium.launch({headless:true});
let errors=[];const evidence=[];
fs.mkdirSync('visual-evidence',{recursive:true});
for(const [width,height] of viewports){
 const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
 await page.goto('http://127.0.0.1:4173/',{waitUntil:'load'});
 for(const screen of screens){
  if(screen!=='home')await page.locator('[data-open="'+screen+'"]').first().click();
  else await page.locator('[data-open="home"]').first().click();
  const d=await page.evaluate(()=>{
   const root=document.documentElement,app=document.querySelector('#app'), main=document.querySelector('.main');
   const btn=[...document.querySelectorAll('.actions button,.course-card')];
   const bad=btn.filter(b=>{const r=b.getBoundingClientRect();return r.width<44||r.height<44||r.top<0||r.bottom>window.innerHeight+2||r.left<0||r.right>window.innerWidth+2;}).map(b=>b.textContent.trim());
   const stage=document.querySelector('.stage')?.getBoundingClientRect();
   return {innerWidth,innerHeight,scrollWidth:root.scrollWidth,scrollHeight:root.scrollHeight,
     appHeight:app.getBoundingClientRect().height,mainHeight:main.getBoundingClientRect().height,
     stageSize:stage?{width:stage.width,height:stage.height}:null,bad};
  });
  evidence.push({width,height,screen,...d});
  if(d.scrollWidth>width+2||d.scrollHeight>height+2||d.bad.length)errors.push({width,height,screen,issue:d});
  if(screen!=='home'&&d.stageSize&&(d.stageSize.width<80||d.stageSize.height<90))errors.push({width,height,screen,issue:'stage too small'});
  await page.screenshot({path:`visual-evidence/${screen}-${width}x${height}.png`,fullPage:false});
 }
 await page.close();
}
await browser.close();
fs.writeFileSync('visual-evidence/layout-audit.json',JSON.stringify({errors,evidence},null,2));
console.log('Visual audit:',evidence.length,'views;',errors.length,'failures');
if(errors.length){console.error(JSON.stringify(errors,null,2));process.exitCode=1;}
