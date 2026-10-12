# app-ui-demo · 儿童英语学习横屏 UI 验收

**在线 Demo：** https://mrgolftech.github.io/app-ui-demo/

采用 React 19 + TypeScript + Vite + React Router + Lucide React + Capacitor 8，用于儿童学习 App 的横屏界面、登录流程、Android APK 构建、真机手势和视觉验收。**只有前端模拟数据，不连接真实用户系统。**

## V0.3：沉浸式横屏及前端登录

- **登录页单独组件** `src/pages/LoginPage.tsx`：用户名、密码可随意填写，**也可留空直接进入**；不验证账号、不请求服务器、不保存密码。仅在 `sessionStorage` 保留演示登录状态，退出即清除。
- **完整学习画面**：底部模块导航栏已移除，学习区扩展至屏幕下方；顶部左侧 Logo 已移除，仅学习首页保留紧凑的顶部标题、课程选择、积分与退出；进入练习后移除整个顶部栏。
- **切换模块**：在首页点击课程卡片，或通过首页顶部 **课程** 菜单选择模块。练习页没有课程菜单，退出练习需确认。
- **真正的 Android 状态栏隐藏**：`@capacitor/status-bar` 的 `StatusBar.hide()`，加上 `scripts/patch-android.mjs` 修改原生 MainActivity，启动及重新获得窗口焦点时隐藏顶部系统状态栏。
- **Android 系统导航保留**：仅隐藏顶部状态栏，不隐藏 Android 的返回/Home 导航手势区域；练习页系统返回先打开退出确认框，选择继续学习可保留当前页面；确认后回首页，首页连续返回才退出 App。原生状态栏隐藏仍需真机安装确认。
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
    StudyLayout.tsx, MediaStage.tsx       # 共享的学习舞台/文本面板、舞台左上角返回按钮
    ActionButton.tsx                      # 通用学习按钮
    PracticeExitDialog.tsx                # 统一的儿童练习退出确认
  context/PracticeExitContext.tsx         # 统一的退出请求接口
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
npm run test:visual  # 9 组分辨率 × 13 个路由，另覆盖登录和交互
```

自动视觉验收覆盖 1920×1080、1600×900、1280×800、1024×768、960×540、844×390、390×844。验证首屏显示登录页、任意账号密码可登录、学习页无顶部/底部导航、练习舞台左上返回、确认/取消退出、Esc（模拟系统返回键）、登出、登录保护和核心布局。

## CI 构建与下载

- [GitHub Pages 自动部署](https://github.com/mrgolftech/app-ui-demo/actions/workflows/pages.yml)：发布 Vite `dist/`。
- [浏览器 UI 截图与验收](https://github.com/mrgolftech/app-ui-demo/actions/workflows/visual-check.yml)。
- [Android 固定签名 Release APK](https://github.com/mrgolftech/app-ui-demo/actions/workflows/android-apk.yml)：从 Repository Secrets 恢复固定私钥，打包 `assembleRelease`，执行 `apksigner verify`，产物为 `app-ui-demo-signed-release-apk`（内含 `app-release.apk`）。**首次需要先配置两个 Repository Secrets**，见 [Android Release 签名与下载安装指南](docs/ANDROID_RELEASE.md)。

Android 16 新的 Edge-to-Edge 机制会影响系统栏与安全区；当前原生沉浸式模式会在 App 启动和恢复焦点时隐藏顶部状态栏及底部导航条，用户滑动可以临时呼出。CI 通过不等于真机验收通过。

## 安全与边界

**前端 Mock 登录不是安全认证**：任何人都能进入，公开 GitHub Pages 和 APK 均无真实访问控制；未来接入正式应用时应使用 FastAPI 后端身份验证，不要复制这套演示登录逻辑。无真实版权课程、秘密信息或用户密码存储。

## V0.4：儿童练习沉浸式全屏

RAZ 阅读、Oxford 拼读、Little Fox 配音和单词闯关进入后，顶部整条应用导航栏不显示，画面主区占满高度；插画左上角只有通用 **返回** 按钮，右上角显示页数/进度。

退出必须两步：点击舞台返回按钮或使用 Android 系统返回键/返回手势 → 出现“要退出这次练习吗？”确认框 → **继续学习**（推荐，保留当前页面状态）或 **退出练习**（回到课程首页，重新进入将重置本页演示进度）。提示出现时再次按系统返回则取消提示。该确认逻辑在 `AppShell` 统一管理，所有练习页调用同一个 `usePracticeExit()`。首页仍保留顶部栏及课程入口。

GitHub Pages 中可按 **Esc** 模拟 Android 返回键验证该交互；APK 通过 `@capacitor/app` 的 `backButton` 事件处理 Android 返回。原生设备系统返回手势行为还需安装最新版 APK 实测。

## V0.5 横屏原生风格：分类 → 选练习 → 学习

参考提供的五张横屏截图，布局借鉴，插画和课程文本是自行编写的离线 mock，不导入原 App 版权媒体。

页面路由：
- /phonics/catalog：系列侧栏 + 教材封面网格、搜索与收藏图标
- /phonics/book/:bookId：自然拼读教材单元选择
- /reading/catalog：主题分类侧栏 + 绘本封面目录
- /reading/exercises：左侧主题，右侧分组展开/折叠、全选/取消、单词 chip、开始练习
- /reading/book/:bookId/{read|record|exercise|words}：四模式图标工具栏阅读、录音、练习与单词
- /quiz：单题全屏图文、发音图标、四宫格中文选项，使用勾选的词汇

新增共享组件：CatalogLayout、BookCard、ExerciseGroupCard、ModeTabBar、IconButton、PracticeBack。

验收：7 组视口 × 13 个路由 = 91 个页面截图，加上菜单、教材、选词、答案反馈、退出确认与模式切换交互验证。
正式学习页一屏完成；目录浏览允许局部滚动；所有工具图标带 aria-label；播放、录音、收藏与服务器鉴权仍为 Mock。


## V0.6：Android 真机适配修复和作者品牌

- 修复 `src/styles/catalog.css` 中高度 ≤540px 的横屏断点：`.catalog-main` 的双列网格被误写为单列，导致 APK 内教材封面挤到左侧、右侧大面积空白。保留原浏览器设计，不重做资源内容。
- 登录页延续蓝色渐变、插画和卡片化表单，展示 App 名称 **小小英语星球**、原创作者账号 **小红书 · 安宝贝的彩虹书架**。前端演示登录仍允许任意账号密码进入，未连接真实账号服务。
- Android Activity 使用 `WindowInsetsController.hide(statusBars | navigationBars)`、滑动临时显示系统栏的 immersive sticky 体验，兼容旧系统的 `SYSTEM_UI_FLAG_IMMERSIVE_STICKY`；在启动、前后台切换、焦点恢复时重申。系统导航/返回手势保留，部分机型导航提示条可能短暂显示。
- 取消 React 层再次调用 `StatusBar.hide()`，避免与原生 WindowInsets 策略冲突。安全区 CSS 仍保持，刘海、手势及 Android 16 需实机核验。
- Playwright 添加 900×420、1024×480 两组横屏 WebView 典型尺寸，并针对所有带分类侧栏页面检查 **侧栏与内容同一行、内容占满右侧区域**；登录界面也核验作者信息。
- 构建：提交触发 [Android APK CI](https://github.com/mrgolftech/app-ui-demo/actions/workflows/android-apk.yml) 和 [视觉验收 CI](https://github.com/mrgolftech/app-ui-demo/actions/workflows/visual-check.yml)。CI 成功不等于 Android 真机验收成功。

## V0.7：固定签名 Release 测试包

- 用私有 PKCS12 keystore + 两个 GitHub Actions Secrets 实现稳定开发者签名；不在公开仓库提交私钥。
- 自动增长 Android `versionCode`，从此前 Debug 包切换到 Release 包需要先卸载旧版，之后可用相同私钥覆盖升级。
- Release APK 完成后先执行 Android `apksigner verify --verbose --print-certs`，再上传 `app-ui-demo-signed-release-apk`。
- [完整签名配置、构建、下载安装、常见问题](docs/ANDROID_RELEASE.md)。
- Play Protect/荣耀应用市场未审核提醒并不因 Release 签名自动消失，应正常完成安全检测。
