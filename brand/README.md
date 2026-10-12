# 彩虹书架 · 品牌设计资源 V1.0

> 定位：面向中国家庭的儿童英语学习产品；自然拼读 / 分级阅读 / 动画配音。品牌名「彩虹书架」，小红书创作者账号「安宝贝的彩虹书架」。

## 状态与边界

- 本目录是**第一批工程化品牌资源**，以已确认的「彩虹 + 书本 + ABC」原创视觉方案为依据。
- `src/logo-mark.svg` 是**人工几何重绘的可编辑矢量稿**，不是把 PNG 改后缀，也**不承诺与上一批 AI 视觉稿逐像素一致**。
- 主图形不含任何中文名称，只保留与书脊融合的 A/B/C 字母。横版字标在图形外追加「彩虹书架」，便于网站导航和营销页面。
- 所有光栅尺寸从统一 SVG 自动导出。不要独立修改各尺寸 PNG。
- **当前仅存为品牌参考素材，不修改已上线的 React 登录页、应用名、Favicon、Android 包名或签名流程。** UI 实际替换应在后续独立功能提交里进行。
- 生成图形未做商标近似检索、版权法律审查。商业上架前须完成检查并确认标准字。

## 目录约定

```text
brand/
├── README.md                     # 本文：设计规范与使用方式
├── tokens.json                   # 品牌颜色/留白/小尺寸规范
├── src/
│   ├── logo-mark.svg             # 唯一主要图形 SVG 源文件
│   └── favicon.svg               # 小尺寸图形专用 SVG
├── tools/
│   └── generate.mjs              # 各端素材自动导出
└── dist/                         # GitHub Actions 生成并提交，禁止手动修图
    ├── logo-mark.svg
    ├── logo-mark-{128,256,512,1024}.png
    ├── logo-horizontal.svg
    ├── logo-horizontal-1180.png
    ├── logo-horizontal-dark.svg
    ├── logo-horizontal-dark-1180.png
    ├── logo-dark-tile.svg
    ├── logo-dark-tile-512.png
    ├── app-icon.svg
    ├── app-icon-{192,512,1024}.png
    ├── favicon.svg
    ├── favicon-{16,32,48}.png
    ├── apple-touch-icon-180.png
    ├── android/
    │   ├── adaptive-foreground.svg
    │   ├── mipmap-*/ic_launcher.png
    │   ├── mipmap-*/ic_launcher_foreground.png
    │   ├── mipmap-anydpi-v26/ic_launcher.xml
    │   └── values/brand_colors.xml
    └── manifest.json
```

## 用哪个文件

| 场景 | 使用 | 要求 |
| --- | --- | --- |
| 首页、登录页品牌图形 | `dist/logo-mark.svg` | 透明背景；不在图形内部添加中文 |
| 网站导航 Header | `dist/logo-horizontal.svg` | 容器宽度足够；字标不要缩到难以阅读 |
| 深色背景导航 | `dist/logo-horizontal-dark.svg` | 白色标准字；彩色图形沿用 |
| App Launcher / PWA icon | `dist/app-icon-512.png`、`dist/app-icon-192.png` | 图标是完整浅色方形，Android 可能再施加裁切 |
| Android adaptive icon | `dist/android/mipmap-*/ic_launcher_foreground.png` + 背景色 | 图形位于 108dp 画布中心安全范围，不再自行裁成圆形 |
| 网页 favicon | `dist/favicon.svg`，或 `favicon-32.png` | 16~32px 不用带 ABC 的复杂主图 |
| iOS / Safari | `dist/apple-touch-icon-180.png` | 直接提供 180px 方形 |
| 暗色启动页插图 | `dist/logo-dark-tile-512.png` | 此图已有背景；不要当透明素材 |
| 印刷/放大绘制 | `src/logo-mark.svg` | 保留可缩放的路径与渐变 |

## 生成/验证

使用 Node.js 22+：

```bash
npm install --no-save --no-package-lock sharp@0.34.4
node brand/tools/generate.mjs
```

该命令**先清空 `brand/dist`，再按固定规格全部重建**；只编辑 `src/` 和 `tokens.json`，不要手工修补 `dist`。CI 工作流 `.github/workflows/brand-assets.yml` 可在变更时重建并提交 `dist`。

推荐发布前逐项检查：透明 PNG alpha 通道；所有导出尺寸；浅/深背景对比；16px favicon 识别度；48px Android 桌面图标；中文横向标准字字体兼容；Android adaptive icon 蒙版下边缘是否被裁切。

## Web 端接入（未来 UI 合并时执行）

如果静态资源复制到 `public/brand/`，Vite 的 GitHub Pages 子路径需要注意：

```tsx
const base = import.meta.env.BASE_URL;
<img src={base + 'brand/logo-mark.svg'} alt="彩虹书架" />
```

`index.html` 的 favicon 可写为：

```html
<link rel="icon" href="%BASE_URL%brand/favicon.svg" type="image/svg+xml" />
```

不要直接写绝对路径 `/brand/...`，否则在 `/app-ui-demo/` 子路径部署时可能 404。对高 DPI 图标优先使用 SVG；对系统图标和分享图使用 PNG。

## Android / Capacitor 8 接入（未来 APK 合并时执行）

本仓库 CI 当前在每次构建时执行 `npx cap add android` 生成原生壳。因此在 `npx cap sync android` **之后**、`assembleRelease` **之前**才应用本目录的 Android mipmap / adaptive 资源。复制到 `android/app/src/main/res`，并确保 `AndroidManifest.xml` 指向 `@mipmap/ic_launcher`。不要将本次品牌素材变更与 keystore、签名证书或包名变更捆绑。

## 品牌使用规则

- 清晰留白建议 ≥图形宽度的 10%；图形最小建议 64px，低于此使用简化 favicon。
- 主图形只展示彩虹、竖立书脊、ABC 和翻开的书页；禁止在图标内部挤入「彩虹书架」四字或 slogan。
- 白底优先使用 `logo-mark.svg`；暗色页面可直接使用透明的主图，或展示暗色底版。
- 整体色彩与位置以主 SVG 为准；避免在 CSS 上单独 recolor logo 或把它拉伸变形。
- 横版中的中文使用 SVG 实时文本，取决于字体环境；**正式注册商标和跨端严格统一之前，需要对中文字标转路径并人工校对**。
- 网站/app的主色与插画可以借鉴 token，但不要求整个产品界面使用全彩虹色。

## 后续接入检查

1. 确认品牌商标和第三方相似图形风险。
2. 人工审校字标，生成可编辑路径版与 monochrome 版。
3. 在独立 PR 中把登录页现有「小小英语星球」更名为「彩虹书架」，替换 Favicon / Launcher，并更新视觉验收截图。
4. 仅在真机验证横屏、沉浸式、Android 适配图标和 Play Protect 后才作为商业正式版发布。
