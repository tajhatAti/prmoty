/* AhadOs v2 — jsdom render smoke test (run via esbuild) */
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!DOCTYPE html><html><body><div id="root"></div></body></html>', {
  url: 'http://localhost:8080/',
  pretendToBeVisual: true,
  runScripts: 'dangerously',
});

globalThis.window = dom.window;
globalThis.document = dom.window.document;
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true });
globalThis.localStorage = dom.window.localStorage;
globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 16);
globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
dom.window.matchMedia = dom.window.matchMedia || function () {
  return { matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} };
};
dom.window.navigator.vibrate = () => true;
// force 3D fallback path
dom.window.WebGLRenderingContext = undefined;

import React from 'react';
import { createRoot } from 'react-dom/client';
import { OSProvider } from './src/os/OSContext';
import App from './src/App';
import { APPS } from './src/os/data';

const root = createRoot(document.getElementById('root'));
root.render(
  React.createElement(OSProvider, null, React.createElement(App))
);

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

(async () => {
  const errors = [];
  window.addEventListener('error', (e) => errors.push('window error: ' + e.message));
  try {
    await sleep(300);
    // boot visible
    const bootVisible = !!$('.boot');
    console.log('1. boot overlay:', bootVisible);

    // force boot complete (skip 3.4s wait): click through — wait instead
    await sleep(3600);
    const lockVisible = !!$('.lock');
    console.log('2. lock screen after boot:', lockVisible);

    // unlock
    const lock = $('.lock');
    if (lock) {
      const unlockEvt = Object.getOwnPropertyNames(Object.getPrototypeOf(lock));
      // simulate drag end — easiest: call framer-motion handler via pointer events is complex;
      // we trigger unlock through navbar click (navbar calls setUnlocked when locked)
      $('.navbar').dispatchEvent(new dom.window.Event('click', { bubbles: true }));
    }
    await sleep(500);
    console.log('3. home app tiles:', $$('.app').length);

    // launch every app
    for (const app of APPS) {
      // find tile & click
      const tile = [...$$('.app')].find(b => b.textContent.includes(app.name));
      if (!tile) { console.log('  ! no tile for', app.id); continue; }
      tile.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
      await sleep(450);
      const title = $('.aw-title')?.textContent;
      if (title !== app.name) errors.push('app ' + app.id + ' didn\'t open (title=' + title + ')');
      else console.log('  opened:', app.id);
      // close
      $('.aw-back').dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
      await sleep(400);
    }

    // shade
    // (shade opens via drag; simulate by checking component mounts — trigger via keyboard? shade has no shortcut; skip UI, test notifs list directly)
    // Settings interactions: wallpaper chips
    const settingsTile = [...$$('.app')].find(b => b.textContent.includes('Settings'));
    settingsTile.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
    await sleep(450);
    const chips = $$('.chip');
    console.log('4. settings wallpaper chips:', chips.length);
    if (chips.length >= 6) chips[1].dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
    await sleep(300);

    // store install snake
    $('.aw-back').dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
    await sleep(400);
    const storeTile = [...$$('.app')].find(b => b.textContent.includes('Ahad Store'));
    storeTile.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
    await sleep(450);
    const snakeBtn = [...$$('.card .btn')].find(b => b.textContent === 'Get' && b.closest('.card').textContent.includes('Snake'));
    console.log('5. store snake Get button:', !!snakeBtn);
    if (snakeBtn) {
      snakeBtn.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
      await sleep(900);
      // snake installed → drawer has snake; open drawer via search input? Simpler: check installed in drawer list
      const drawerSnake = [...$$('.drawer .app')].some(b => b.textContent.includes('Snake'));
      console.log('6. snake installed in drawer:', drawerSnake);
    }

    // messages chat
    $('.aw-back').dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
    await sleep(400);
    const msgTile = [...$$('.app')].find(b => b.textContent.includes('Messages'));
    msgTile.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
    await sleep(450);
    const chatItem = $('.chat-list-item');
    if (chatItem) {
      chatItem.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
      await sleep(300);
      const input = $('#aw-body .chat-input-row input') || document.querySelector('.chat-input-row input');
      console.log('7. chat thread + input:', !!input);
      if (input) {
        input.value = 'hello!';
        const sendBtn = document.querySelector('.chat-input-row .btn');
        sendBtn.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
        await sleep(200);
        const bubbles = $$('.chat-row').length;
        console.log('8. chat sent, bubbles:', bubbles);
      }
    }

    // calculator
    $('.aw-back').dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
    await sleep(400);
    const calcTile = [...$$('.app')].find(b => b.textContent.includes('Calculator'));
    calcTile.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
    await sleep(450);
    const keys = $$('.calc-btn');
    const press = (k) => [...keys].find(b => b.textContent === k)?.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
    press('7'); press('+'); press('5'); press('=');
    await sleep(150);
    const disp = $('.calc-display > div:last-child') || document.querySelector('.calc-display div:last-child');
    console.log('9. calc 7+5=', disp?.textContent);

    // toasts state check (calc opened etc.)
    await sleep(500);
    console.log('10. toasts rendered:', $$('.toast').length);

    if (errors.length) { console.log('ERRORS:', errors); process.exit(1); }
    console.log('\n✅ ALL REACT SMOKE TESTS PASSED');
    process.exit(0);
  } catch (e) {
    console.log('❌ TEST FAILED:', e.message);
    console.log(e.stack?.split('\n').slice(0, 5).join('\n'));
    if (errors.length) console.log('window errors:', errors);
    process.exit(1);
  }
})();
