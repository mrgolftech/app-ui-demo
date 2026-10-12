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
 // First screen must be the demo login (no authentication backend).
 if(await page.locator('[data-screen="login"]').count()!==1)errors.push({width,height,issue:'Unauthenticated first visit did not land on login'});
 if(await page.locator('.bottom-nav').count()!==0)errors.push({width,height,issue:'Bottom nav rendered on login'});
 const loginCheck=await page.evaluate(()=>{
  const root=document.documentElement,form=document.querySelector('.login-panel');
  const r=form?.getBoundingClientRect();
  const fields=[...document.querySelectorAll('.login-form input,.login-form button')];
  const clipped=fields.filter(b=>{
   const box=b.getBoundingClientRect();
   return box.height<38||box.width<35||box.top<0||box.bottom>innerHeight+2||box.left<0||box.right>innerWidth+2;
  }).map(b=>b.getAttribute('name')||b.textContent);
  return {scrollWidth:root.scrollWidth,scrollHeight:root.scrollHeight,
   formHeight:r?.height,clipped};
 });
 if(loginCheck.scrollWidth>width+2||loginCheck.scrollHeight>height+2||loginCheck.clipped.length)
  errors.push({width,height,screen:'login',issue:loginCheck});
 await page.screenshot({path:'visual-evidence/login-'+width+'x'+height+'.png',fullPage:false});
 // Any typed values are accepted. Neither user name nor password hits a backend.
 await page.locator('input[name="username"]').fill('demo-anyone');
 await page.locator('input[name="password"]').fill('any-password');
 await page.locator('[data-action="login"]').click();
 await page.locator('.app-shell[data-screen="home"]').waitFor({state:"visible"});
 if(await page.locator('.app-shell[data-screen="home"]').count()!==1)
  errors.push({width,height,issue:'Demo login failed'});
 for(const screen of screens){
  if(screen!=='home'){
   await page.locator('[data-action="open-menu"]').click();
   await page.locator('.module-menu__item[data-open="'+screen+'"]').click();
  }else if(await page.locator('.app-shell').getAttribute('data-screen')!=='home'){
   await page.locator('.header-back').click();
  }
  const d=await page.evaluate(()=>{
   const app=document.querySelector('.app-shell'),root=document.documentElement;
   const controls=[...document.querySelectorAll('.study-actions button,.course-card,.header-back,.header-menu,.header-logout')];
   const bad=controls.filter(b=>{
    const r=b.getBoundingClientRect();
    return r.height<39||r.width<38||r.top<0||r.bottom>innerHeight+2||r.left<0||r.right>innerWidth+2;
   }).map(x=>x.textContent.trim());
   const rect=document.querySelector('.media-stage')?.getBoundingClientRect();
   const image=document.querySelector('.media-stage__art img');
   return {scrollWidth:root.scrollWidth,scrollHeight:root.scrollHeight,
    appHeight:app.getBoundingClientRect().height,
    stage:rect?{width:rect.width,height:rect.height}:null,
    bad,imageReady:image?image.complete&&image.naturalWidth>0:true,
    selection:getComputedStyle(document.querySelector('.study-sentence')||app).userSelect,
    bottomNavCount:document.querySelectorAll('.bottom-nav').length,
    logoCount:document.querySelectorAll('.brand-mark').length,
    menuCount:document.querySelectorAll('.header-menu').length};
  });
  evidence.push({width,height,screen,...d});
  if(d.scrollWidth>width+2||d.scrollHeight>height+2||d.bad.length||!d.imageReady||
    d.selection!=='none'||d.bottomNavCount!==0||d.logoCount!==0||d.menuCount!==1)
    errors.push({width,height,screen,issue:d});
  if(screen!=='home'&&d.stage&&(d.stage.width<90||d.stage.height<90))
    errors.push({width,height,screen,issue:'Media stage too small'});
  await page.screenshot({path:'visual-evidence/'+screen+'-'+width+'x'+height+'.png',fullPage:false});
 }
 await page.close();
}
const p=await browser.newPage({viewport:{width:844,height:390},hasTouch:true});
await p.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
// Login should also accept empty credentials because this is explicitly a UI-only demo.
await p.locator('[data-action="login"]').click();
await p.locator('.app-shell[data-screen="home"]').waitFor({state:"visible"});
if(await p.locator('.app-shell[data-screen="home"]').count()!==1)errors.push({issue:'Empty demo credentials should log in'});
await p.locator('[data-action="open-menu"]').click();
await p.locator('.module-menu__item[data-open="raz"]').click();
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
if(curr===await p.locator('.media-stage__counter').innerText())errors.push({issue:'RAZ touch swipe did not turn page'});
await p.locator('.header-back').click();
await p.locator('.app-shell[data-screen="home"]').waitFor({state:"visible"});
if(await p.locator('.app-shell').getAttribute('data-screen')!=='home')errors.push({issue:'Header Back failed'});
await p.locator('[data-action="open-menu"]').click();
await p.locator('.module-menu__item[data-open="phonics"]').click();
prev=await p.locator('.media-stage__counter').innerText();
await p.locator('[data-action="nextword"]').click();
if(prev===await p.locator('.media-stage__counter').innerText())errors.push({issue:'Next phonics word failed'});
await p.locator('[data-action="open-menu"]').click();
await p.locator('.module-menu__item[data-open="dub"]').click();
await p.locator('[data-action="record"]').click();
if(!(await p.locator('.panel-footer').innerText()).includes('录音状态'))errors.push({issue:'Mock recording state failed'});
await p.locator('[data-action="open-menu"]').click();
await p.locator('.module-menu__item[data-open="quiz"]').click();
await p.locator('[data-choice="Rabbit"]').click();
if(await p.locator('.answer.is-correct').count()!==1)errors.push({issue:'Quiz correctness style missing'});
await p.locator('[data-action="logout"]').click();
await p.locator('.login-screen[data-screen="login"]').waitFor({state:"visible"});
if(await p.locator('[data-screen="login"]').count()!==1)errors.push({issue:'Logout did not return to login'});
// Protected learning route cannot be accessed without logging in again.
await p.goto('http://127.0.0.1:4173/#/raz');
await p.locator('.login-screen[data-screen="login"]').waitFor({state:"visible"});
if(await p.locator('[data-screen="login"]').count()!==1)errors.push({issue:'Protected route bypassed login'});
await p.close();
await browser.close();
fs.writeFileSync('visual-evidence/layout-audit.json',JSON.stringify({errors,evidence,loginViewports:viewports.length},null,2));
console.log('Visual audit:',evidence.length,'learning views +',viewports.length,'login views;',errors.length,'failures');
if(errors.length){console.error(JSON.stringify(errors,null,2));process.exitCode=1;}
