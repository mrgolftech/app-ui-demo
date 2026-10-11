# app-ui-demo · 儿童英语学习横屏 UI 原型

**在线预览：** https://mrgolftech.github.io/app-ui-demo/

本项目采用 React 19 + TypeScript + Vite + React Router（HashRouter）+ Lucide React + Capacitor 8，用于横屏儿童英语学习 App 的 UI 视觉验收、导航交互和 Android APK 构建。

## 独立页面和公共组件

- `index.html` 只挂载 React，不承载具体页面内容。
- `src/main.tsx` 配置五个路由与统一 `AppShell`。
- `src/pages/`：`HomePage`、`RazPage`、`PhonicsPage`、`DubbingPage`、`QuizPage`，每个是独立 TSX 组件。
- `src/components/`：共享 `AppShell`、`Header`、`BottomNav`、`StudyLayout`、`MediaStage`、`ActionButton`。
- `src/hooks/`：共享 `useAndroidBack`（Android 返回手势/按键）和 `useStageSwipe`（插画内容左右翻页）。
- `src/data/mock.ts`：12 页原创绘本、4 个 phonics 单词、6 句配音和 4 道单词题。
- `public/assets/`：原创离线 SVG 插画。
- `src/styles/`：tokens、shell、study、home 设计规则，横屏优先、无整页滚动。

底部五个导航图标统一来自 lucide-react：House、BookOpen、SpellCheck、Clapperboard、Trophy，并配文字标签。普通儿童学习文字不可长按选择；Android 系统返回导航、返回手势和主屏手势保留可用。首次打包为 debug APK；真实录音/朗读/视频/评分仍是 UI Mock。

## 本地运行

1. `npm install`
2. `npm run dev`：打开 http://localhost:5173/
3. `npm run build`
4. `npm run preview`：打开 http://localhost:4173/
5. `npm run test:visual`：Playwright 7 组视口×5 页并产生截图。

## GitHub Pages / APK 构建

- [GitHub Pages](https://github.com/mrgolftech/app-ui-demo/actions/workflows/pages.yml)：将相同 React 工程编译到 `dist/` 并部署网页。
- [UI 视觉截图](https://github.com/mrgolftech/app-ui-demo/actions/workflows/visual-check.yml)：构建后执行布局和交互测试。
- [Android Debug APK](https://github.com/mrgolftech/app-ui-demo/actions/workflows/android-apk.yml)：先构建 `dist/`，再运行 `npx cap add android`、`npx cap sync android`、`./gradlew assembleDebug`，产出可安装 APK artifact。

手机请求横屏 `sensorLandscape`，系统返回通过 `@capacitor/app` 处理；大屏强制方向限制和实际系统手势体验仍需真机验证。UI 插画、内容均为自行造的静态 Mock，不包含私有 app-analyse 数据或教材版权资源。

## 验收原则

学习任务单屏显示，完整可用的媒体区、文字、控件不依赖整页下滑；布局检查不能替代与原 App 截图 / Figma 的像素级视觉对照。当前版本重点验证统一框架、儿童横屏交互、Android 包装和 UI 风格。
