# app-ui-demo · 儿童英语学习横屏 UI 验收

**在线 Demo：** https://mrgolftech.github.io/app-ui-demo/

采用 React 19 + TypeScript + Vite + React Router + Lucide React + Capacitor 8，用于儿童学习 App 的横屏界面、登录流程、Android APK 构建、真机手势和视觉验收。**只有前端模拟数据，不连接真实用户系统。**

## V0.3：沉浸式横屏及前端登录

- **登录页单独组件** `src/pages/LoginPage.tsx`：用户名、密码可随意填写，**也可留空直接进入**；不验证账号、不请求服务器、不保存密码。仅在 `sessionStorage` 保留演示登录状态，退出即清除。
- **完整学习画面**：底部模块导航栏已移除，学习区扩展至屏幕下方；顶部左侧 Logo 已移除，顶部只保留页面标题、返回、一个“课程”入口、积分与退出。
- **切换模块**：在首页点课程卡片；任意学习页点顶部 **课程** 按钮，弹出五个模块的网格菜单。菜单使用 Lucide SVG 图标，不额外占屏幕高度。
- **真正的 Android 状态栏隐藏**：`@capacitor/status-bar` 的 `StatusBar.hide()`，加上 `scripts/patch-android.mjs` 修改原生 MainActivity，启动及重新获得窗口焦点时隐藏顶部系统状态栏。
- **Android 系统导航保留**：仅隐藏顶部状态栏，不隐藏 Android 的返回/Home 导航手势区域；学习页系统返回进首页，首页再次连续返回退出。原生状态栏隐藏仍需真机安装确认。
- **自造课程数据**：12 页英文森林小故事、4 个拼读单词、6 句动画配音和 4 道选择题，配原创本地 SVG 素材，完全离线。录音、媒体、评分仍是 Mock。

## 前端框架

```
src/
  auth/DemoAuth.tsx, RequireDemoAuth.tsx  # 演示登录和路由保护
  pages/
    LoginPage.tsx                         # 登录页面
    HomePage.tsx                          # 课程首页
    RazPage.tsx                           # RAZ 风格阅读
    PhonicsPage.tsx                       # Oxford 风格拼读
    DubbingPage.tsx                       # Little Fox 风格配音
    QuizPage.tsx                          # 单词闯关
  components/
    AppShell.tsx                          # 两区布局：顶部栏、学习主内容
    Header.tsx, ModuleMenu.tsx            # 无 Logo 的顶部栏 + 浮动课程选择
    StudyLayout.tsx, MediaStage.tsx       # 共享的学习舞台/文本面板
    ActionButton.tsx                      # 通用学习按钮
  hooks/
    useAndroidBack.ts                     # Android 系统返回导航
    useFullscreenStatusBar.ts             # 顶部状态栏隐藏
    useStageSwipe.ts                      # 绘本左右翻页
  styles/{tokens,shell,home,study,login}.css
  data/mock.ts
scripts/patch-android.mjs                 # 生成 Android 后执行原生沉浸式配置
public/assets/                            # 原创离线 SVG
```

一个 `index.html` 只承载 React 挂载点，各页面是独立路由组件，公共组件统一样式和交互。

## 运行与验证

```bash
npm install
npm run dev          # http://localhost:5173/
npm run build
npm run preview      # http://localhost:4173/
npm run test:visual  # 7 种分辨率 × [登录+五页] = 42 个截图与交互检查
```

自动视觉验收覆盖 1920×1080、1600×900、1280×800、1024×768、960×540、844×390、390×844。验证首屏显示登录页、任意账号密码可登录、无底部导航/Logo、课程切换、返回、登出、登录保护和核心布局。

## CI 构建与下载

- [GitHub Pages 自动部署](https://github.com/mrgolftech/app-ui-demo/actions/workflows/pages.yml)：发布 Vite `dist/`。
- [浏览器 UI 截图与验收](https://github.com/mrgolftech/app-ui-demo/actions/workflows/visual-check.yml)。
- [Android Debug APK](https://github.com/mrgolftech/app-ui-demo/actions/workflows/android-apk.yml)：先 Vite 构建，再 `npx cap add android && npx cap sync android`，运行 `node scripts/patch-android.mjs`，最后 Gradle 打包 `app-debug.apk`，以 Actions Artifact 提供。

Android 16 新的 Edge-to-Edge 机制会影响部分状态栏背景和覆盖参数；这里使用的是隐藏**状态栏本身**的接口，而不是更改背景色。构建成功仅验证 APK 产生，状态栏、手势、刘海/安全区和沉浸式视觉体验仍需真机验收。

## 安全与边界

**前端 Mock 登录不是安全认证**：任何人都能进入，公开 GitHub Pages 和 APK 均无真实访问控制；未来接入正式应用时应使用 FastAPI 后端身份验证，不要复制这套演示登录逻辑。无真实版权课程、秘密信息或用户密码存储。
