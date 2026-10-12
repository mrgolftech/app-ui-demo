import { chromium } from 'playwright';
import fs from 'node:fs';

const viewports=[[1920,1080],[1600,900],[1280,800],[1024,768],[960,540],[844,390],[390,844]];
const screens=['home','raz','phonics','dub','quiz'];
const errors=[],evidence=[];
const browser=await chromium.launch({headless:true});
fs.mkdirSync('visual-evidence',{recursive:true});

for(const [width,height] of viewports){
 const page=await browser.newPage({viewport:{width,height},hasTouch:true,deviceScaleFactor:1});
 await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
 if(await page.locator('.login-screen').count()!==1)errors.push({width,height,issue:'Login not shown'});
 await page.screenshot({path:'visual-evidence/login-'+width+'x'+height+'.png'});
 await page.locator('input[name="username"]').fill('child-demo');
 await page.locator('input[name="password"]').fill('no-real-password');
 await page.locator('[data-action="login"]').click();
 await page.locator('.app-shell[data-screen="home"]').waitFor({state:'visible'});

 for(const screen of screens){
  if(screen!=='home')await page.goto('http://127.0.0.1:4173/#/'+screen,{waitUntil:'networkidle'});
  await page.locator('.app-shell[data-screen="'+screen+'"]').waitFor({state:'visible'});
  if(screen!=='home'){
   // A hash-only navigation can resolve before React updates the <img>.
   // Wait for decoding the CURRENT route's image instead of a timed sleep.
   await page.locator('.media-stage__art img').evaluate(async img=>{
    try{await img.decode();}catch{/* imageReady below reports actual failures */}
   });
  }
  const d=await page.evaluate(()=>{
   const root=document.documentElement,app=document.querySelector('.app-shell');
   const controls=[...document.querySelectorAll('.study-actions button,.course-card,.practice-back,.header-menu,.header-logout')];
   const bad=controls.filter(b=>{
    const r=b.getBoundingClientRect();
    return r.width<38||r.height<40||r.top<0||r.bottom>innerHeight+2||r.left<0||r.right>innerWidth+2;
   }).map(x=>x.getAttribute('aria-label')||x.textContent.trim());
   const art=document.querySelector('.media-stage')?.getBoundingClientRect();
   const pic=document.querySelector('.media-stage__art img');
   const back=document.querySelector('.practice-back')?.getBoundingClientRect();
   const counter=document.querySelector('.media-stage__counter')?.getBoundingClientRect();
   const overlaps=back&&counter&&back.left<counter.right&&back.right>counter.left&&back.top<counter.bottom&&back.bottom>counter.top;
   return {
    scrollWidth:root.scrollWidth,scrollHeight:root.scrollHeight,
    appHeight:app.getBoundingClientRect().height,
    stage:art?{width:art.width,height:art.height}:null,
    imageReady:pic?pic.complete&&pic.naturalWidth>0:true,
    selection:getComputedStyle(document.querySelector('.study-sentence')||app).userSelect,
    headerCount:document.querySelectorAll('.app-header').length,
    inStageBackCount:document.querySelectorAll('.practice-back').length,
    moduleMenuCount:document.querySelectorAll('.header-menu').length,
    navCount:document.querySelectorAll('.bottom-nav').length,
    overlaps,bad
   };
  });
  evidence.push({width,height,screen,...d});
  const practicing=screen!=='home';
  if(d.scrollWidth>width+2||d.scrollHeight>height+2||d.bad.length||
     !d.imageReady||d.selection!=='none'||d.navCount!==0||d.overlaps||
     d.headerCount!==(practicing?0:1)||d.inStageBackCount!==(practicing?1:0)||
     d.moduleMenuCount!==(practicing?0:1)){
   errors.push({width,height,screen,issue:d});
  }
  if(practicing&&d.stage&&(d.stage.width<90||d.stage.height<90)){
   errors.push({width,height,screen,issue:'stage too small'});
  }
  await page.screenshot({path:'visual-evidence/'+screen+'-'+width+'x'+height+'.png',fullPage:false});
 }
 await page.close();
}

// A single workflow validates both the in-stage back arrow and Escape,
// which shares the Android native back event's guarded exit behavior.
const page=await browser.newPage({viewport:{width:844,height:390},hasTouch:true});
await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
await page.locator('[data-action="login"]').click();
await page.locator('.app-shell[data-screen="home"]').waitFor({state:'visible'});

// Navigate using the home course card; RAZ exercises have no global header.
await page.locator('.course-card--raz').click();
await page.locator('.app-shell[data-screen="raz"]').waitFor({state:'visible'});
let initial=await page.locator('.media-stage__counter').innerText();
await page.locator('[data-action="next"]').click();
let afterNext=await page.locator('.media-stage__counter').innerText();
if(initial===afterNext)errors.push({issue:'Next RAZ page did not advance'});

// A swipe inside the art still turns the page.
await page.evaluate(()=>{
 const art=document.querySelector('.media-stage__art');
 const b=art.getBoundingClientRect();
 const opt={bubbles:true,pointerId:13,pointerType:'touch',button:0};
 art.dispatchEvent(new PointerEvent('pointerdown',{...opt,clientX:b.left+185,clientY:b.top+105}));
 art.dispatchEvent(new PointerEvent('pointerup',{...opt,clientX:b.left+95,clientY:b.top+105}));
});
if(afterNext===await page.locator('.media-stage__counter').innerText())errors.push({issue:'RAZ art swipe did not advance'});

await page.locator('.practice-back').click();
await page.locator('.practice-exit-dialog[role="alertdialog"]').waitFor({state:'visible'});
if(await page.locator('.app-shell').getAttribute('data-screen')!=='raz')errors.push({issue:'Back button exited without confirmation'});
await page.screenshot({path:'visual-evidence/confirm-exit-844x390.png'});
await page.locator('[data-action="continue-practice"]').click();
if(await page.locator('.practice-exit-dialog').count())errors.push({issue:'Keep learning did not dismiss dialog'});
if(await page.locator('.app-shell').getAttribute('data-screen')!=='raz')errors.push({issue:'Cancel lost practice state'});

await page.keyboard.press('Escape');
await page.locator('.practice-exit-dialog').waitFor({state:'visible'});
await page.keyboard.press('Escape');
if(await page.locator('.practice-exit-dialog').count())errors.push({issue:'Second system back did not cancel dialog'});
if(await page.locator('.app-shell').getAttribute('data-screen')!=='raz')errors.push({issue:'Cancelling dialog exited practice'});

await page.locator('.practice-back').click();
await page.locator('[data-action="confirm-exit"]').click();
await page.locator('.app-shell[data-screen="home"]').waitFor({state:'visible'});
if(await page.locator('.practice-back').count())errors.push({issue:'Practice back still visible on home'});

// Other modules preserve their own interactions and all share the same confirmation.
for(const [screen,control] of [
 ['phonics','nextword'],['dub','nextsentence'],['quiz','nextquiz']
]){
 await page.goto('http://127.0.0.1:4173/#/'+screen,{waitUntil:'networkidle'});
 const oldCounter=await page.locator('.media-stage__counter').innerText();
 await page.locator('[data-action="'+control+'"]').click();
 if(oldCounter===await page.locator('.media-stage__counter').innerText())errors.push({issue:screen+' next interaction failed'});
 await page.keyboard.press('Escape');
 await page.locator('.practice-exit-dialog').waitFor({state:'visible'});
 if(await page.locator('.app-header').count())errors.push({issue:screen+' shows top nav in modal'});
 await page.locator('[data-action="confirm-exit"]').click();
 await page.locator('.app-shell[data-screen="home"]').waitFor({state:'visible'});
}

await page.locator('[data-action="logout"]').click();
await page.locator('.login-screen').waitFor({state:'visible'});
await page.goto('http://127.0.0.1:4173/#/raz');
await page.locator('.login-screen').waitFor({state:'visible'});
await page.close();
await browser.close();
fs.writeFileSync('visual-evidence/layout-audit.json',JSON.stringify({errors,evidence,loginViewports:viewports.length},null,2));
console.log('Visual audit:',evidence.length,'learning views +',viewports.length,'login views;',errors.length,'failures');
if(errors.length){console.error(JSON.stringify(errors,null,2));process.exitCode=1;}
