/* Offline-first visual acceptance only. No live course, network or recording. */
const app=document.querySelector('#app');
const state={screen:'home',page:2,sentence:1,wordIndex:0,recording:false,played:false,chosen:'',selectedLetters:[],quiz:0};
const pages=window.DEMO_DATA.raz.pages;
const words=window.DEMO_DATA.phonics.words;
const captions=window.DEMO_DATA.dub.lines;
const questions=window.DEMO_DATA.quizzes;
function icon(s){return s}
function svgScene(kind){
 if(kind==='rabbit')return `<svg class="scene" viewBox="0 0 640 360" role="img" aria-label="森林中的兔子原创示意插画" xmlns="http://www.w3.org/2000/svg">
 <defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#9bd7ff"/><stop offset="1" stop-color="#e2f6ff"/></linearGradient></defs>
 <rect width="640" height="360" rx="30" fill="url(#sky)"/><circle cx="543" cy="68" r="39" fill="#fff4a0"/>
 <path d="M0 239Q160 172 290 236T640 218V360H0Z" fill="#a8dc8a"/>
 <path d="M0 291Q140 254 282 292T640 274V360H0Z" fill="#6ec7a0"/>
 <g fill="#6bb58f"><circle cx="95" cy="155" r="71"/><circle cx="153" cy="168" r="54"/><circle cx="490" cy="164" r="60"/><circle cx="551" cy="176" r="47"/></g>
 <path d="M123 130V309M512 128V316" stroke="#997554" stroke-width="18" stroke-linecap="round"/>
 <g transform="translate(306 85)">
 <ellipse cx="-30" cy="73" rx="29" ry="79" fill="white" transform="rotate(-14 -30 73)"/>
 <ellipse cx="35" cy="70" rx="29" ry="79" fill="white" transform="rotate(11 35 70)"/>
 <ellipse cx="-30" cy="73" rx="13" ry="54" fill="#ffc0d5" transform="rotate(-14 -30 73)"/>
 <ellipse cx="35" cy="70" rx="13" ry="54" fill="#ffc0d5" transform="rotate(11 35 70)"/>
 <ellipse cx="0" cy="235" rx="91" ry="71" fill="#fff"/>
 <circle cy="164" r="70" fill="#fff"/><ellipse cx="-28" cy="151" rx="7" ry="10" fill="#41506c"/><ellipse cx="30" cy="151" rx="7" ry="10" fill="#41506c"/>
 <ellipse cy="175" rx="11" ry="8" fill="#ff9ca7"/><path d="M0 182q-12 20 -24 1M0 182q12 20 24 1" stroke="#8f899d" stroke-width="4" fill="none" stroke-linecap="round"/>
 <ellipse cx="-62" cy="290" rx="34" ry="17" fill="#fff"/><ellipse cx="60" cy="290" rx="34" ry="17" fill="#fff"/>
 </g><g fill="#fff"><circle cx="204" cy="70" r="9"/><circle cx="225" cy="66" r="12"/><circle cx="247" cy="73" r="8"/></g>
 <g fill="#ffb55e"><circle cx="223" cy="310" r="8"/><circle cx="556" cy="302" r="8"/></g></svg>`;
 if(kind==='fox')return `<svg class="scene" viewBox="0 0 640 360" role="img" aria-label="小狐狸森林动画示意场景" xmlns="http://www.w3.org/2000/svg">
 <rect width="640" height="360" rx="30" fill="#a5dbca"/><circle cx="524" cy="79" r="47" fill="#ffefd0"/>
 <path d="M0 252Q160 199 320 244T640 235V360H0" fill="#7ac18e"/>
 <g fill="#568f77"><circle cx="92" cy="115" r="74"/><circle cx="535" cy="139" r="92"/><circle cx="606" cy="95" r="65"/></g>
 <path d="M104 150V345M532 165V352" stroke="#a97755" stroke-width="22"/>
 <g transform="translate(314 75)"><path d="M-115 133L-92 13L-24 83L32 82L98 5L119 139Z" fill="#f58c42"/>
 <path d="M-93 34L-77 89L-38 91Z M83 30L46 91L89 90Z" fill="#ffd2b6"/>
 <ellipse cy="170" rx="118" ry="104" fill="#ef8d43"/>
 <path d="M-75 187Q0 126 76 187Q58 243 0 252Q-57 244-75 187" fill="#fff5e6"/>
 <ellipse cx="-43" cy="158" rx="9" ry="12" fill="#453e49"/><ellipse cx="43" cy="158" rx="9" ry="12" fill="#453e49"/>
 <ellipse cy="202" rx="13" ry="10" fill="#403744"/><path d="M0 207q-18 22 -31 3M0 207q18 22 31 3" stroke="#443b44" stroke-width="4" fill="none"/></g>
 <g fill="#fcf0a1"><circle cx="178" cy="269" r="7"/><circle cx="205" cy="284" r="6"/><circle cx="464" cy="290" r="8"/></g></svg>`;
 return `<svg class="scene" viewBox="0 0 640 360" role="img" aria-label="阳光下海面上的轮船插画" xmlns="http://www.w3.org/2000/svg">
 <rect width="640" height="360" rx="30" fill="#d0b8ff"/><circle cx="526" cy="75" r="39" fill="#fff4bc"/>
 <path d="M0 248Q80 217 160 248T320 248T480 248T640 248V360H0Z" fill="#82c5ff"/>
 <path d="M0 296Q80 261 160 296T320 296T480 296T640 296V360H0Z" fill="#5ca9f8"/>
 <path d="M170 225H461L414 284H224Z" fill="#f49d60"/><path d="M294 215V81L407 214Z" fill="#fff8df"/>
 <path d="M283 98V214H208Z" fill="#ffe5c2"/><path d="M294 76V224" stroke="#9d72ae" stroke-width="8"/>
 <circle cx="262" cy="247" r="12" fill="#fff"/><circle cx="308" cy="247" r="12" fill="#fff"/><circle cx="354" cy="247" r="12" fill="#fff"/>
 <path d="M108 127Q135 98 161 126M453 131Q478 102 505 130" stroke="#fff" stroke-width="11" fill="none" stroke-linecap="round"/></svg>`;
}
const title={home:'小小英语星球',raz:'RAZ 分级阅读',phonics:'Oxford 自然拼读',dub:'Little Fox 动画配音',quiz:'单词闯关'};
function head(){return `<header class="header">${state.screen==='home'?'<div class="logo" aria-hidden="true">✦</div>':'<button type="button" class="header-back" data-action="back" aria-label="返回上一页面">❮ 返回</button>'}
 <div class="brand">${title[state.screen]}</div><span class="header-small">横屏交互视觉样板 · Mock</span>
 <div class="header-center"><span class="pill ${state.screen==='raz'?'active':''}">📖 阅读</span>
 <span class="pill ${state.screen==='phonics'?'active':''}">🔤 拼读</span>
 <span class="pill ${state.screen==='dub'?'active':''}">🎬 配音</span></div>
 <div class="header-right"><span class="star">⭐ 120</span><div class="avatar">🧒</div></div></header>`;}
function nav(){return `<nav class="bottom" aria-label="学习模块导航">
 ${[['home','⌂','学习首页'],['raz','▣','绘本阅读'],['phonics','✎','自然拼读'],['dub','▶','动画配音'],['quiz','★','单词练习']].map(([s,g,n])=>`<button data-open="${s}" class="nav ${state.screen===s?'active':''}" aria-current="${state.screen===s?'page':'false'}"><span class="glyph" aria-hidden="true">${g}</span>${n}</button>`).join('')}
 </nav>`;}
function home(){return `<div class="page home">
 <section class="welcome"><div class="hello"><span class="eyebrow">GOOD MORNING · LET'S LEARN!</span><h1>今天也一起<br>快乐学英语！</h1><p>读绘本 · 学拼读 · 玩配音</p></div><div class="mascot" aria-hidden="true">🐰✨</div></section>
 <section class="home-cards">
 <button class="course-card raz" data-open="raz"><div class="course-bubble"><span>📚</span></div><h2>分级阅读</h2><p>RAZ · 自主阅读</p><div class="course-enter">打开绘本 <span>➜</span></div></button>
 <button class="course-card phonics" data-open="phonics"><div class="course-bubble"><span>🔤</span></div><h2>自然拼读</h2><p>Oxford Phonics World</p><div class="course-enter">开始拼读 <span>➜</span></div></button>
 <button class="course-card dub" data-open="dub"><div class="course-bubble"><span>🦊</span></div><h2>动画配音</h2><p>Little Fox · 跟读配音</p><div class="course-enter">一起配音 <span>➜</span></div></button>
 </section></div>`;}
function studyStage(kind,playText,progress,art){const files={bird:'bird.svg',pond:'pond.svg',village:'village.svg'};
 const illustration=art&&files[art]?'<img class="scene" src="./assets/'+files[art]+'" alt="原创儿童学习示意插画" draggable="false">':svgScene(art==='fox'?'fox':art==='ship'?'ship':kind==='dub'?'fox':kind==='phonics'?'ship':'rabbit');
 return `<div class="stage scene-${kind}" data-swipe-zone="${kind}">
 <div class="stage-inner">${illustration}</div>
 <div class="stage-counter">${progress}</div>
 <button class="scene-play" data-action="play">▶ ${playText}</button></div>`;}
function raz(){const p=pages[state.page-1];return `<div class="page study">
 ${studyStage('raz','听一听 · 模拟朗读',`第 ${state.page} / ${pages.length} 页`,p.art)}
 <section class="panel"><div class="panel-top"><span class="kicker">📖 LEVEL C · FOREST FRIENDS</span><span class="progress">${state.page}/${pages.length}</span></div>
 <h1>${window.DEMO_DATA.raz.title}</h1><p class="sentence">${p.en}</p><span class="translation">${p.zh}</span>
 <div class="spacer"></div><div class="actions"><button class="btn pale" data-action="prev" aria-label="上一页">❮ 上一页</button>
 <button class="btn blue" data-action="play">🔊 朗读</button><button class="btn pale" data-action="next">下一页 ❯</button></div>
 <div class="subline"><span>点读 · 翻页 · 一屏完成</span><span>● ● ● ○ ○</span></div>
 </section></div>`;}
function phonics(){const w=words[state.wordIndex%words.length];return `<div class="page study">
 ${studyStage('phonics','听单词 · 模拟发音',`Unit 3 · ${state.wordIndex+1}/${words.length}`,w.art)}
 <section class="panel"><div class="panel-top"><span class="kicker">🔤 OXFORD PHONICS WORLD 3</span><span class="progress">Unit 3</span></div>
 <h1>今天认识字母组合 <span style="color:#8963de">sh</span></h1>
 <p class="sentence">拼出单词：<span style="color:#8963de">${w.sound}</span>${w.rest}</p>
 <span class="translation">点击字母块，听音并拼写 · ${w.zh}</span>
 <div class="letter-bank">${w.letters.map((c,i)=>`<button data-letter="${i}" class="${state.selectedLetters.includes(i)?'used':''}">${c}</button>`).join('')}</div>
 <div class="spacer"></div><div class="actions"><button class="btn pale" data-action="clear">重试</button>
 <button class="btn purple" data-action="check">✓ 检查拼写</button><button class="btn pale" data-action="nextword">下一词 ❯</button></div>
 <div class="subline"><span>示意音频与拼写，不接真实评分服务</span><span>${state.selectedLetters.map(i=>w.letters[i]).join('').toUpperCase()||'○ ○ ○ ○'}</span></div></section></div>`;}
function dub(){return `<div class="page study">
 ${studyStage('dub','▶ 预览动画画面',`Little Fox · ${state.sentence}/${captions.length} 句`,captions[state.sentence-1].art)}
 <section class="panel"><div class="panel-top"><span class="kicker" style="color:#d98b26">🎬 LITTLE FOX · GREEN FOREST</span><span class="progress">${state.sentence}/4</span></div>
 <h1>我来给小狐狸配音！</h1><p class="sentence">${captions[state.sentence-1].en}</p>
 <span class="translation">${captions[state.sentence-1].zh} · 跟着说</span>
 <div class="spacer"></div><div class="actions">
 <button class="btn pale" data-action="prevsentence" aria-label="上一句">❮ 上句</button>
 <button class="btn orange" data-action="record">${state.recording?'■ 停止模拟录音':'🎙 开始配音'}</button>
 <button class="btn pale" data-action="nextsentence" aria-label="下一句">下句 ❯</button></div>
 <div class="subline"><span>${state.recording?'● 录音中（仅界面状态）':'模拟流程 · 暂不采集麦克风'}</span><span>🎧 语速 1.0×</span></div></section></div>`;}
function quiz(){const q=questions[state.quiz%questions.length];return `<div class="page study">
 ${studyStage('phonics','🔊 听题（演示）',`第 ${state.quiz+1}/${questions.length} 题`,q.art)}
 <section class="panel"><div class="panel-top"><span class="kicker">⭐ WORD CHALLENGE</span><span class="progress">+${state.chosen===q.a?10:0} 分</span></div>
 <h1>${q.q}</h1><p class="translation">看插画，选出正确的英文单词</p>
 <div class="answers">${q.choices.map(c=>`<button class="answer ${state.chosen===c?(c===q.a?'correct':'wrong'):''}" data-choice="${c}">${c}</button>`).join('')}</div>
 <div class="spacer"></div><div class="actions"><button class="btn pale" data-action="play">🔊 重播</button>
 <button class="btn blue" data-action="nextquiz">下一题 ❯</button></div>
 <div class="subline"><span>${state.chosen?(state.chosen===q.a?'太棒啦！答对了！':'再想想，继续尝试吧！'):'一次只完成一道互动题目'}</span><span>🌟 加油</span></div></section></div>`;}
let toastTimer;
function notify(s){
 document.querySelector('.toast')?.remove();
 const t=document.createElement('div');t.className='toast';t.textContent=s;
 app.appendChild(t);clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.remove(),1700);
}
function render(){
 app.className='app theme-'+state.screen;
 app.dataset.screen=state.screen;
 app.innerHTML=head()+'<main class="main">'+({home,raz,phonics,dub,quiz})[state.screen]()+'</main>'+nav();
}
let routeDepth=0;
let lastExitRequest=0;
window.history.replaceState({uiDemo:true,screen:'home',depth:0},'');
function open(s,{replace=false}={}){
 if(!({home,raz,phonics,dub,quiz})[s]||s===state.screen)return;
 if(replace){
   window.history.replaceState({uiDemo:true,screen:s,depth:routeDepth},'');
 }else{
   routeDepth++;
   window.history.pushState({uiDemo:true,screen:s,depth:routeDepth},'');
 }
 state.screen=s;state.recording=false;state.chosen='';render();
}
window.addEventListener('popstate',({state:route})=>{
 routeDepth=route?.uiDemo?route.depth:0;
 state.screen=route?.uiDemo&&({home,raz,phonics,dub,quiz})[route.screen]?route.screen:'home';
 state.recording=false;state.chosen='';render();
});
function goBack(){
 if(routeDepth>0){window.history.back();return;}
 if(state.screen!=='home'){open('home',{replace:true});return;}
 const now=Date.now();
 if(now-lastExitRequest<2200){
   const nativeApp=window.Capacitor?.Plugins?.App;
   if(nativeApp?.exitApp){nativeApp.exitApp().catch(()=>notify('请使用系统手势退出'));}
   else notify('演示首页 · 再次返回将退出 Android App');
 }else{lastExitRequest=now;notify('再按一次返回退出应用');}
}
function nativeBackSetup(){
 // Capacitor 8 injects its native plugin proxies into the Android WebView.
 // In a regular browser this is absent; normal browser history still works.
 const nativeApp=window.Capacitor?.Plugins?.App;
 if(!nativeApp?.addListener)return;
 nativeApp.addListener('backButton',()=>goBack()).catch(err=>{
   console.warn('Native back button listener unavailable:',err);
 });
}
function changeStudy(action){
 if(action==='next'){state.page=state.page%pages.length+1;}
 else if(action==='prev'){state.page=Math.max(1,state.page-1);}
 else if(action==='nextword'){state.wordIndex=(state.wordIndex+1)%words.length;state.selectedLetters=[];}
 else if(action==='clear'){state.selectedLetters=[];}
 else if(action==='record'){state.recording=!state.recording;notify(state.recording?'模拟录音中，不使用麦克风':'模拟录音完成');}
 else if(action==='nextsentence'){state.sentence=state.sentence%captions.length+1;}
 else if(action==='prevsentence'){state.sentence=Math.max(1,state.sentence-1);}
 else if(action==='nextquiz'){state.quiz=(state.quiz+1)%questions.length;state.chosen='';}
 else if(action==='play'){notify('🔊 音视频为视觉演示；未接入真实媒体');return;}
 else if(action==='check'){
   const w=words[state.wordIndex%words.length];
   notify(state.selectedLetters.map(i=>w.letters[i]).join('')===w.word?'🎉 拼写正确！':'再试一次，加油！');
   return;
 }
 else if(action==='back'){goBack();return;}
 else return;
 render();
}
app.addEventListener('click',e=>{
 const el=e.target.closest('button');if(!el)return;
 if(el.dataset.open){open(el.dataset.open);return;}
 if(el.dataset.letter!==undefined){
  const i=Number(el.dataset.letter);
  if(!state.selectedLetters.includes(i)){state.selectedLetters.push(i);render();}
  return;
 }
 if(el.dataset.choice){state.chosen=el.dataset.choice;render();return;}
 changeStudy(el.dataset.action);
});
// Within the media stage, swiping across a page changes the learning card;
// exclude 32 CSS px at both viewport edges so Android system gestures win.
let touchStart=null;
app.addEventListener('pointerdown',e=>{
 if(e.pointerType!=='touch'||e.button!==0||e.target.closest('button')||!e.target.closest('[data-swipe-zone]'))return;
 if(e.clientX<32||e.clientX>innerWidth-32)return;
 touchStart={id:e.pointerId,x:e.clientX,y:e.clientY,time:Date.now(),screen:state.screen};
});
app.addEventListener('pointercancel',()=>{touchStart=null;});
app.addEventListener('pointerup',e=>{
 if(!touchStart||e.pointerId!==touchStart.id)return;
 const start=touchStart;touchStart=null;
 if(start.screen!==state.screen||Date.now()-start.time>1200)return;
 const dx=e.clientX-start.x,dy=e.clientY-start.y;
 if(Math.abs(dx)<65||Math.abs(dx)<Math.abs(dy)*1.35)return;
 const forward=dx<0;
 if(state.screen==='raz')changeStudy(forward?'next':'prev');
 else if(state.screen==='dub')changeStudy(forward?'nextsentence':'prevsentence');
 else if(state.screen==='phonics'&&forward)changeStudy('nextword');
 else if(state.screen==='quiz'&&forward)changeStudy('nextquiz');
});
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'||(e.key==='Backspace'&&!e.target.matches('input,textarea,[contenteditable]'))){
  e.preventDefault();goBack();
 }else if(e.key==='ArrowRight'){
  if(state.screen==='raz')changeStudy('next');
  else if(state.screen==='dub')changeStudy('nextsentence');
 }else if(e.key==='ArrowLeft'){
  if(state.screen==='raz')changeStudy('prev');
  else if(state.screen==='dub')changeStudy('prevsentence');
 }
});
// Avoid OS long-press context menus on decorative illustrations in the demo.
// Native selections should remain possible in future input/textarea exercises.
app.addEventListener('contextmenu',event=>{
 if(!event.target.closest('input,textarea,[contenteditable],.allow-selection'))event.preventDefault();
});
render();
nativeBackSetup();
