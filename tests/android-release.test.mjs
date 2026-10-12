import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

test('generated Android Gradle file gets idempotent fixed release signing and versioning', () => {
  const dir = mkdtempSync(join(tmpdir(), 'ui-demo-android-release-'));
  try {
    mkdirSync(join(dir, 'android/app'), { recursive: true });
    const gradle = join(dir, 'android/app/build.gradle');
    writeFileSync(gradle, "apply plugin: 'com.android.application'\nandroid { defaultConfig { versionCode 1 } }\n");
    const patch = resolve('scripts/patch-android-release.mjs');
    execFileSync(process.execPath, [patch], { cwd: dir, stdio: 'pipe' });
    execFileSync(process.execPath, [patch], { cwd: dir, stdio: 'pipe' });
    const built = readFileSync(gradle, 'utf8');
    assert.equal(built.split('BEGIN APP-UI-DEMO FIXED-SIGNATURE RELEASE CONFIG').length, 2);
    assert.match(built, /signingConfig signingConfigs\.ciRelease/);
    assert.match(built, /versionCode = 10000 \+ ciReleaseBuildNumber/);
    assert.match(built, /versionName = "0\.6\." \+ ciReleaseBuildNumber/);
    assert.match(built, /System\.getenv\('ANDROID_RELEASE_STORE_PASSWORD'\)/);
    assert.match(built, /keyAlias 'kids-ui-demo-release'/);
    assert.doesNotMatch(built, /storePassword android|storePassword 'test'|storePassword "test"/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
