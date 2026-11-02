import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

// Source-level regression checks, not a substitute for browser layout review.
const jsx = readFileSync(new URL('../src/pages/About/About.jsx', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/pages/About/About.module.css', import.meta.url), 'utf8');
const globalCss = readFileSync(new URL('../src/styles/global.css', import.meta.url), 'utf8');
const classes = [...new Set([...jsx.matchAll(/styles\.(\w+)/g)].map(match => match[1]))];
for (const name of classes) assert(css.includes(`.${name}`), `Missing style: ${name}`);
for (const [, anchor] of jsx.matchAll(/aria-labelledby="([^"]+)"/g)) {
  assert(jsx.includes(`id="${anchor}"`), `Missing section label: ${anchor}`);
}
assert(jsx.includes('aria-pressed={selected === index}'));
assert(jsx.includes('aria-live="polite"'));
assert(jsx.includes('prefers-reduced-motion') || css.includes('prefers-reduced-motion'));
assert(existsSync(new URL('../public/images/syrena-studio-sculpture.png', import.meta.url)));

const tokens = Object.fromEntries([...globalCss.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6});/gi)].map(match => [match[1], match[2]]));
function luminance(hex) {
  const rgb = hex.slice(1).match(/../g).map(part => parseInt(part, 16) / 255).map(channel => channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4);
  return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
}
for (const [foreground, background] of [
  ['ink', 'cobalt'], ['ink', 'paper'], ['ink', 'butter'], ['ink', 'ice'],
  ['ink', 'coral'], ['ink', 'mint'], ['ink', 'lilac'], ['paper', 'navy'],
  ['ice', 'navy'], ['butter', 'navy'], ['white', 'electric'], ['electric', 'paper'],
]) {
  const values = [luminance(tokens[foreground]), luminance(tokens[background])].sort((a, b) => b - a);
  const ratio = (values[0] + .05) / (values[1] + .05);
  assert(ratio >= 4.5, `${foreground}/${background}: ${ratio.toFixed(2)} fails normal-text contrast`);
  console.log(`${foreground}/${background}: ${ratio.toFixed(2)}:1`);
}
console.log(`PASS: ${classes.length} style hooks, section labels, asset, motion preference, and 12 text color pairs.`);
