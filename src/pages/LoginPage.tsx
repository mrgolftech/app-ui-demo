import { useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowRight, Eye, EyeOff, BookOpen, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDemoAuth } from '../auth/DemoAuth';

export function LoginPage(){
 const navigate=useNavigate();
 const {signIn}=useDemoAuth();
 const [username,setUsername]=useState('');
 const [password,setPassword]=useState('');
 const [showPassword,setShowPassword]=useState(false);
 function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();
  // Intentionally accept *any* values, including blank strings. No credential check.
  // Neither field is persisted or transmitted; only a boolean session flag is stored.
  signIn();
  setPassword('');
  navigate('/',{replace:true});
 }
 return <main className="login-screen" data-screen="login">
  <section className="login-hero" aria-label="学习欢迎页">
    <span className="login-hero__eyebrow"><Sparkles size={17}/> ENGLISH LEARNING ADVENTURE</span>
    <h1>小小英语星球<br/><span>快乐学英语！</span></h1>
    <p>自然拼读 · 分级阅读 · 动画配音</p>
    <div className="login-hero__creator" aria-label="作者与小红书账号">
      <span className="login-hero__creator-label">原创学习空间 · 创作者</span>
      <strong>安宝贝的彩虹书架</strong>
      <span className="login-hero__social"><BookOpen size={14}/> 小红书同名博主</span>
    </div>
    <div className="login-hero__art" aria-hidden="true">
      <img src={import.meta.env.BASE_URL+'assets/rabbit.svg'} alt="" draggable={false}/>
    </div>
    <span className="login-hero__foot">陪孩子探索英语世界的每一个小惊喜</span>
  </section>
  <section className="login-side">
    <div className="login-panel">
      <div className="login-panel__heading">
        <div className="login-panel__eyebrow"><BookOpen size={18}/> 学习小天地</div>
        <h2>欢迎回来！</h2>
        <p>开启今天的英语学习之旅</p>
      </div>
      <form className="login-form" onSubmit={submit} autoComplete="off">
        <label htmlFor="demo-username">用户名</label>
        <input id="demo-username" name="username" type="text" value={username}
          onChange={e=>setUsername(e.target.value)} placeholder="随意输入用户名"
          autoCapitalize="off" spellCheck={false}/>
        <label htmlFor="demo-password">密码</label>
        <div className="login-password">
          <input id="demo-password" name="password" type={showPassword?'text':'password'}
            value={password} onChange={e=>setPassword(e.target.value)}
            placeholder="随意输入密码" autoComplete="off"/>
          <button type="button" aria-label={showPassword?'隐藏密码':'显示密码'} data-action="toggle-password"
            onClick={()=>setShowPassword(x=>!x)}>
            {showPassword?<EyeOff size={19}/>:<Eye size={19}/>}
          </button>
        </div>
        <button type="submit" className="login-submit" data-action="login">进入学习 <ArrowRight size={20}/></button>
      </form>
      <div className="login-disclaimer">纯前端演示 · 任意账号密码均可登录 · 不联网、不保存密码</div>
    </div>
  </section>
 </main>;
}
