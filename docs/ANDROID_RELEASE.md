# Android 固定签名 Release APK

本项目是纯前端演示 App，包名 `com.mrgolftech.kidsvisualdemo`。正式安装测试请使用 GitHub Actions 自动生成的 **Release** 包，而非 `assembleDebug`。

## 1. 首次设置签名密钥（必须只做一次）

签名私钥**不在仓库中**，也不会由 CI 临时生成。需要先在 GitHub 仓库配置两个 Actions Repository Secrets：

| 名称 | 内容 |
| --- | --- |
| `ANDROID_RELEASE_KEYSTORE_B64` | 固定 PKCS12 keystore 文件的 Base64（不要加引号或换行） |
| `ANDROID_RELEASE_STORE_PASSWORD` | keystore 的保护密码，同时用于密钥口令 |

密钥别名固定为 `kids-ui-demo-release`。仓库维护者需要妥善保存私钥和密码的离线备份；丢失则无法继续用原证书更新已经安装的应用。**不能把 keystore、Base64、密码、`github-secrets.env` 提交到 GitHub。**

配置方法：

1. 打开 [Settings → Secrets and variables → Actions](https://github.com/mrgolftech/app-ui-demo/settings/secrets/actions)，创建上述两个 Repository Secrets。
2. 或使用 GitHub CLI：`gh auth login`，然后在本地保密目录运行 `gh secret set -R mrgolftech/app-ui-demo -f github-secrets.env`。
3. 打开 [Android Signed Release APK 工作流](https://github.com/mrgolftech/app-ui-demo/actions/workflows/android-apk.yml) → **Run workflow** → main。添加 Secrets 本身**不会自动触发**新的 workflow run。

GitHub 官方建议使用 Repository Secrets 存储二进制签名资料的 Base64 文本；请注意 Base64 本身不加密，安全性依赖 GitHub Secrets 的权限隔离。

## 2. Release 构建与验收

工作流 `.github/workflows/android-apk.yml` 会：

1. 检查必需的两个 Secrets 是否存在（不输出私钥/密码）。
2. 构建 React/Vite 前端并用 Capacitor 8 创建 Android 工程。
3. 运行 `scripts/patch-android.mjs`（横屏、沉浸式系统栏）和 `scripts/patch-android-release.mjs`（固定签名、版本号）。
4. 将 keystore 暂存在 CI runner 的 `android/app/signing/release.p12`，仅在 Gradle 构建步骤注入密码。
5. 运行 `./gradlew --no-daemon assembleRelease`。
6. 执行 `apksigner verify --verbose --print-certs` 和 `sha256sum`，成功后上传 Artifact `app-ui-demo-signed-release-apk`。

下载 artifact 的 ZIP，解压获得 **`app-release.apk`**。请等待 workflow 全部绿色成功后再下载，不要使用旧的 Debug APK 替代。

签名证书的预期 SHA-256 指纹（便于核对是否拿错密钥或密钥被替换）：

```
7D:0D:B4:5A:5B:AA:77:32:59:11:EB:66:42:6E:A5:5D:7D:DA:4F:95:33:B6:28:E8:94:9B:63:EC:39:64:1C:2A
```

## 3. 版本与安装

- Android `versionCode = 10000 + GITHUB_RUN_NUMBER`，`versionName = 0.6.<run-number>`。工作流每次新运行会自动更新版本；不要手动回退版本号。
- 包名不变：`com.mrgolftech.kidsvisualdemo`。
- **从以前的 Debug APK 切换到首次 Release 包需要先卸载旧版**，因为签名证书不同；之后使用相同 Release 密钥和更高 `versionCode` 可以覆盖升级。
- 卸载会清除该演示 App 本地数据。请在实际产生重要本地学习进度之前完成签名迁移。
- 正式签名**不保证**免除 Google Play Protect 和荣耀手机的未知来源/未审核警告；不要关闭系统安全机制来绕过安全检查。
- 真机还需验证横屏资源页不再出现右侧大面积留白、顶部状态栏与底部系统手势区临时隐藏、Android 返回手势以及安装/升级路径。

## 4. 故障定位

| 现象 | 解决 |
| --- | --- |
| CI 在 Check fixed-signing configuration 失败 | 尚未配置 Secrets，或名称拼写错误 |
| `base64 --decode` 失败 | Base64 缺失/多余字符；请不要添加 shell 引号 |
| Gradle 提示 keystore password 或 alias 错误 | 用原始 keystore 和密码重新配置；别更换证书 |
| APK 安装时提示签名不一致 | 卸载旧 Debug，或检查 Release 证书指纹 |
| APK 提示版本降级 | 必须使用更高 `versionCode` 构建 |
| Google Play Protect/荣耀发出未知来源警告 | 属于平台安全检查，分别排查，不代表 Release 构建错误 |
| 无 APK artifact | 工作流未成功或验签失败，先查看失败步骤日志 |

### 安全边界

这是 UI 演示项目使用的固定签名。正式投放大规模用户之前，建议自行在可信设备上生成和管理长期正式密钥，并对 APK 权限、网络与第三方依赖进行独立审查。将来如果改用 Google Play App Signing，须按官方流程设置对应的上传密钥与应用签名身份。
