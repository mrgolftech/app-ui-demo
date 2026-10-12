/**
 * 彩虹书架: deterministic web/Android brand exports from one SVG master.
 * npm install --no-save --no-package-lock sharp@0.34.4
 * node brand/tools/generate.mjs
 */
import { readFile, mkdir, writeFile, rm } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sourceDir = join(root, 'src');
const out = join(root, 'dist');
const mark = await readFile(join(sourceDir, 'logo-mark.svg'), 'utf8');
const favicon = await readFile(join(sourceDir, 'favicon.svg'), 'utf8');
const body = mark.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
function wrap(inner, viewBox='0 0 512 512') {
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + viewBox + '">' + inner + '</svg>';
}
function transformed(scale, offsetX, offsetY) {
  return '<g transform="translate(' + offsetX + ' ' + offsetY + ') scale(' + scale + ')">' + body + '</g>';
}
const lightTile = wrap(
  '<defs><linearGradient id="tile" x2="1" y2="1"><stop stop-color="#FCFDFF"/><stop offset="1" stop-color="#EAF0FF"/></linearGradient></defs>' +
  '<rect width="512" height="512" rx="112" fill="url(#tile)"/>' +
  transformed(0.87, 33.3, 31.5)
);
const darkTile = wrap('<rect width="512" height="512" rx="72" fill="#081334"/>' + transformed(0.91, 23, 19));
const foreground = wrap(transformed(0.73, 69, 69));
const horizontal = wrap(transformed(0.58, 12, 19) +
  '<text x="335" y="224" font-size="119" font-weight="800" font-family="Noto Sans CJK SC,Noto Sans SC,Microsoft YaHei,sans-serif" fill="#17235B" letter-spacing="3">彩虹书架</text>', '0 0 1180 330');
const horizontalDark = wrap(transformed(0.58, 12, 19) +
  '<text x="335" y="224" font-size="119" font-weight="800" font-family="Noto Sans CJK SC,Noto Sans SC,Microsoft YaHei,sans-serif" fill="#FFFFFF" letter-spacing="3">彩虹书架</text>', '0 0 1180 330');

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
async function svg(name, data) {
  const file = join(out, name);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, data, 'utf8');
}
async function png(name, data, width, height=width) {
  const file = join(out, name);
  await mkdir(dirname(file), { recursive: true });
  const buf = await sharp(Buffer.from(data)).resize(width, height, { fit: 'fill' }).png({
    compressionLevel: 9, palette: width <= 48
  }).toBuffer();
  const info = await sharp(buf).metadata();
  if (info.width !== width || info.height !== height) throw new Error('Size mismatch: '+name);
  await writeFile(file, buf);
}
await Promise.all([
  svg('logo-mark.svg', mark),
  svg('logo-horizontal.svg', horizontal),
  svg('logo-horizontal-dark.svg', horizontalDark),
  svg('logo-dark-tile.svg', darkTile),
  svg('app-icon.svg', lightTile),
  svg('favicon.svg', favicon),
  svg('android/adaptive-foreground.svg', foreground)
]);
for (const size of [128,256,512,1024]) await png('logo-mark-'+size+'.png', mark, size);
for (const size of [192,512,1024]) await png('app-icon-'+size+'.png', lightTile, size);
await png('logo-horizontal-1180.png', horizontal, 1180,330);
await png('logo-horizontal-dark-1180.png', horizontalDark, 1180,330);
await png('logo-dark-tile-512.png', darkTile, 512);
for (const size of [16,32,48]) await png('favicon-'+size+'.png', favicon, size);
await png('apple-touch-icon-180.png', lightTile, 180);
for (const [density, size] of Object.entries({mdpi:48,hdpi:72,xhdpi:96,xxhdpi:144,xxxhdpi:192})) {
  await png('android/mipmap-'+density+'/ic_launcher.png', lightTile, size);
}
for (const [density, size] of Object.entries({mdpi:108,hdpi:162,xhdpi:216,xxhdpi:324,xxxhdpi:432})) {
  await png('android/mipmap-'+density+'/ic_launcher_foreground.png', foreground, size);
}
await svg('android/mipmap-anydpi-v26/ic_launcher.xml',
  '<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android"><background android:drawable="@color/brand_launcher_background"/><foreground android:drawable="@mipmap/ic_launcher_foreground"/></adaptive-icon>');
await svg('android/values/brand_colors.xml',
  '<resources><color name="brand_launcher_background">#F4F8FF</color></resources>');
await svg('android/README.md',
  '# Android reference files\n\nLegacy mipmaps and adaptive foreground are pre-generated. In a Capacitor 8 Android build, copy mipmap-* directories into android/app/src/main/res and brand_colors.xml into res/values. Ensure the Android manifest icon points at @mipmap/ic_launcher. The foreground fits the center-safe region of an Android adaptive icon. Apply these AFTER npx cap add android and BEFORE assembling the APK.\n');
const manifest = {
  brand: '彩虹书架', version: '1.0.0',
  status: 'geometric-vector-redraw-based-on-approved-image-concept',
  source: ['../src/logo-mark.svg', '../src/favicon.svg'],
  background: { light: '#F4F8FF', dark: '#081334', navy: '#17235B' },
  note: 'The main mark has no Chinese text; only A/B/C are integrated. Horizontal wordmark remains live SVG text and needs font review before formal trademark artwork.',
  vectorSourceSha256: createHash('sha256').update(mark).digest('hex')
};
await writeFile(join(out, 'manifest.json'), JSON.stringify(manifest,null,2)+'\n');
console.log('Generated all assets in brand/dist');
