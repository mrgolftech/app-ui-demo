# app-ui-demo · 儿童英语学习横屏视觉验收

[![Visual Audit](https://github.com/mrgolftech/app-ui-demo/actions/workflows/visual-check.yml/badge.svg)](https://github.com/mrgolftech/app-ui-demo/actions/workflows/visual-check.yml)
[![Android Debug APK](https://github.com/mrgolftech/app-ui-demo/actions/workflows/android-apk.yml/badge.svg)](https://github.com/mrgolftech/app-ui-demo/actions/workflows/android-apk.yml)
[![GitHub Pages](https://github.com/mrgolftech/app-ui-demo/actions/workflows/pages.yml/badge.svg)](https://github.com/mrgolftech/app-ui-demo/actions/workflows/pages.yml)

本仓库用于**横屏儿童英语学习 UI 视觉验收**、在线交互预览、Android APK 打包流程验证，不涉及服务端、用户账户、真实课程内容或在线录音评分。

## 在线预览

GitHub Pages 目标地址：**https://mrgolftech.github.io/app-ui-demo/**

**首次启用**：打开 [Settings → Pages](https://github.com/mrgolftech/app-ui-demo/settings/pages)，在 Build and deployment 中选择 Source = **GitHub Actions**。保存后打开 [Deploy UI Demo to GitHub Pages](https://github.com/mrgolftech/app-ui-demo/actions/workflows/pages.yml)，通过 **Run workflow** 手动触发一次，之后 main 的 UI 变更将自动重新部署。*未启用 Pages 之前，目标 URL 不代表当前已经上线。*

## 视觉验收屏幕

- 学习首页、RAZ 绘本阅读、Oxford 自然拼读、Little Fox 配音、单词选择题
- 真实可点击：切换模块、绘本翻页、单词拼写、切句、模拟录音状态、题目选择与反馈
- 页面独立完整展示：导航区 + 媒体主舞台 + 当前任务 + 操作按钮，不需要下滑找主要操作
- 离线演示：SVG 插画为原创占位示意，不是原 App 课程图片；朗读、视频、录音、评分均为 Mock，不调用音频设备

## 本地运行

```bash
python3 -m http.server 4173 --directory www
# http://localhost:4173
```

## 自动化验收

```bash
npm install
npx playwright install chromium
python3 -m http.server 4173 --directory www &
npm run test:visual
```

测试 7 组 viewport：1920×1080、1600×900、1280×800、1024×768、960×540、844×390、390×844；5 屏 × 7 组 = 35 场景。截图与 `layout-audit.json` 可从 [Visual Layout Audit](https://github.com/mrgolftech/app-ui-demo/actions/workflows/visual-check.yml) 的 Artifact 下载。

## 自动构建 Android APK

推送 main 即触发 [Android Debug APK](https://github.com/mrgolftech/app-ui-demo/actions/workflows/android-apk.yml)；也可以点 Run workflow。成功后在该 run 页面的 **Artifacts → app-ui-demo-landscape-debug-apk** 下载 zip，解压后得到 `app-debug.apk`，安装到 Android 手机测试。

本 APK 是 Capacitor 8 构建的**完全离线的 UI 演示包**，采用 `android:screenOrientation="sensorLandscape"` 请求横屏；Android 大屏/分屏窗口存在系统方向限制，仍有竖屏降级布局。此包为 debug 签名，非应用商店发布包。

本地打包：
```bash
npm install
npx cap add android
npx cap sync android
# 给 AndroidManifest.xml MainActivity 配置 android:screenOrientation="sensorLandscape"
cd android && ./gradlew assembleDebug
```

## 与现有项目的关系

这个仓库**只复制了我们自主实现的独立 UI Demo 代码**，不复制私有项目 `app-analyse` 的抓包文件、凭据、课程媒体、数据库、后端与其他保密资料。Figma Starter 暂时无法读取设计节点，高保真/逐像素对照尚未完成；当前为儿童交互与横屏布局样板。

**验收流程**：在真实手机横屏打开 Pages 逐页检查 → 指定页面和截图反馈问题 → 在本仓库修改 UI → 自动浏览器截图检查 → 自动构建 APK → 真机安装确认。

## Mock 内容与 Android 交互（2026-10）
- `www/mock-data.js` 集中保存 12 页独立的 RAZ 森林故事、4 个 phonics 单词、6 个动画句子和 4 道单词题目，均为自行编写的虚构示例。新增 `www/assets/` 彩色 SVG 场景插画，离线可用。
- 学习区域禁用长按文字选择、复制气泡和插画长按菜单（CSS `user-select:none` / Android WebView 行为；不是 DRM、防抓取保护）。未来可编辑文本框仍可正常复制/输入。
- 首页和各学习页支持导航按钮；Android Back / 系统返回手势由 `@capacitor/app` 监听，返回上一个页面；首页连续两次 Back 退出应用。
- RAZ 插画区域左右滑动切换阅读页，Little Fox 句子切换亦可左右滑动；从屏幕最外侧启动的系统返回手势不被学习页抢占。电脑浏览器可通过 Esc/Backspace 和方向键复验。
- Android 状态栏/手势导航由系统管理，保持可用，不强制屏蔽系统返回或 Home。请在真机检查 3 键导航和全面屏手势模式。
- 原始测试 APK 的安装结果与 Android 系统手势/视觉效果只有真机实测才能确认；本仓库的自动验证覆盖 HTML、交互和构建，不代替真机验收。
