/* ============================================================
   AhadOs — Core OS engine
   ============================================================ */

const Ahad = {
  state: {
    unlocked: false,
    booted: false,
    appOpen: null,
    drawerOpen: false,
    shadeOpen: false,
    theme: 'ahad',
    mode: 'dark',
    wallpaper: 'aurora',
    brightness: 100,
    sound: true,
    wallpaperBlur: false,
    vibration: true,
    toggles: { wifi: true, bluetooth: false, flash: false, rotate: false, flight: false, data: true, battery: false, dnd: false },
    installed: JSON.parse(localStorage.getItem('ahados.installed') || '["phone","messages","browser","camera","photos","gallery","clock","calculator","weather","music","notes","files","store","wallet","themecenter","settings","about"]'),
  },

  $: (sel) => document.querySelector(sel),
  $$: (sel) => document.querySelectorAll(sel),

  init() {
    Ahad.loadPrefs();
    Ahad.buildIcons();
    Ahad.renderHome();
    Ahad.renderDrawer();
    Ahad.renderToggles();
    Ahad.renderNotifs();
    Ahad.bindCore();
    Ahad.applyTheme();
    Ahad.applyWallpaper(true);
    Ahad.startClock();
    setTimeout(() => Ahad.boot(), 700);
  },

  buildIcons() {
    AhadIcons.build();
  },

  loadPrefs() {
    try {
      const p = JSON.parse(localStorage.getItem('ahados.prefs') || '{}');
      if (p.theme) Ahad.state.theme = p.theme;
      if (p.mode) Ahad.state.mode = p.mode;
      if (p.wallpaper) Ahad.state.wallpaper = p.wallpaper;
      if (p.brightness !== undefined) Ahad.state.brightness = p.brightness;
      if (p.toggles) Object.assign(Ahad.state.toggles, p.toggles);
    } catch (e) {}
  },

  savePrefs() {
    localStorage.setItem('ahados.prefs', JSON.stringify({
      theme: Ahad.state.theme, mode: Ahad.state.mode, wallpaper: Ahad.state.wallpaper,
      brightness: Ahad.state.brightness, toggles: Ahad.state.toggles,
    }));
  },

  /* ---------------- Boot ---------------- */
  boot() {
    const boot = Ahad.$('#boot');
    const msgs = AhadData.bootMessages;
    const nameEl = boot.querySelector('.boot-name');
    let i = 0;
    const int = setInterval(() => {
      i++;
      if (i < msgs.length) nameEl.textContent = msgs[i].toUpperCase();
      else {
        clearInterval(int);
        boot.classList.add('done');
        Ahad.state.booted = true;
        Ahad.state.unlocked = false;
        Ahad.$('#lock').classList.remove('unlocked');
      }
    }, 500);
  },

  /* ---------------- Clock ---------------- */
  startClock() {
    const fmt = (d) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    const fmtDate = (d) => d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    const tick = () => {
      const d = new Date();
      const t = fmt(d);
      Ahad.$('#sb-time').textContent = t;
      const hw = Ahad.$('.hw-time');
      if (hw) hw.textContent = t;
      const sh = Ahad.$('.sh-time');
      if (sh) sh.textContent = t;
      const lk = Ahad.$('.lock-time');
      if (lk) lk.textContent = t;
      Ahad.$('.hw-date').textContent = fmtDate(d);
      Ahad.$('.sh-date').textContent = fmtDate(d);
      Ahad.$('.lock-date').textContent = fmtDate(d);
      const cb = Ahad.$('.clock-big');
      if (cb) cb.textContent = t;
    };
    tick();
    setInterval(tick, 1000);
  },

  /* ---------------- Home rendering ---------------- */
  appById(id) { return AhadData.apps.find(a => a.id === id); },

  appHTML(id) {
    const meta = Ahad.appById(id);
    if (!meta) return '';
    const ic = AhadIcons.map[id] || '';
    const badge = id === 'messages' ? '<span class="app-badge">3</span>' : '';
    return `<button class="app" data-app="${id}" style="animation-delay:${Math.random() * .2}s">
      <span class="app-ic-wrap">${ic}${badge}</span>
      <span class="app-name">${meta.name}</span>
    </button>`;
  },

  renderHome() {
    const grid = Ahad.$('#app-grid');
    const dock = Ahad.$('#dock');
    const homeApps = AhadData.home.flat().filter(id => Ahad.state.installed.includes(id));
    grid.innerHTML = homeApps.map(Ahad.appHTML).join('');
    dock.innerHTML = AhadData.dock.filter(id => Ahad.state.installed.includes(id)).map(Ahad.appHTML).join('');
    // small gap after grid section before the extras are reachable via drawer
    grid.querySelectorAll('.app').forEach(el => {
      el.addEventListener('click', () => Ahad.launch(el.dataset.app));
    });
    dock.querySelectorAll('.app').forEach(el => {
      el.addEventListener('click', () => Ahad.launch(el.dataset.app));
    });
  },

  renderDrawer() {
    const grid = Ahad.$('#drawer-grid');
    const apps = AhadData.apps.filter(a => Ahad.state.installed.includes(a.id));
    grid.innerHTML = apps.map(Ahad.appHTML).join('');
    grid.querySelectorAll('.app').forEach(el => {
      el.addEventListener('click', () => { Ahad.closeDrawer(); setTimeout(() => Ahad.launch(el.dataset.app), 150); });
    });
  },

  /* ---------------- Navigation ---------------- */
  launch(id) {
    const meta = Ahad.appById(id);
    if (!meta) return;
    Ahad.closeShade();
    Ahad.closeDrawer();
    Ahad.state.appOpen = id;
    Ahad.$('#appwin').classList.add('open');
    Ahad.$('#aw-title').textContent = meta.name;
    const body = Ahad.$('#aw-body');
    body.scrollTop = 0;
    // clear previous app's timers/listeners
    while (Ahad.cleanup.length) Ahad.cleanup.pop()();
    body.innerHTML = `<div class="empty-state">Loading ${meta.name}…</div>`;
    setTimeout(() => {
      if (Ahad.state.appOpen !== id) return;
      if (AhadApps.views[id]) AhadApps.views[id](body);
      else body.innerHTML = `<div class="empty-state">${meta.name} is not installed.</div>`;
    }, 260);
    Ahad.vibrate(8);
  },

  closeApp() {
    Ahad.state.appOpen = null;
    Ahad.$('#appwin').classList.remove('open');
    Ahad.vibrate(5);
  },

  openDrawer() {
    if (Ahad.state.shadeOpen) Ahad.closeShade();
    Ahad.state.drawerOpen = true;
    Ahad.$('#drawer').classList.add('open');
    setTimeout(() => Ahad.$('#drawer-input').focus(), 350);
  },
  closeDrawer() {
    Ahad.state.drawerOpen = false;
    Ahad.$('#drawer').classList.remove('open');
    Ahad.$('#drawer-input').value = '';
    Ahad.renderDrawer();
  },

  openShade() {
    if (Ahad.state.drawerOpen) Ahad.closeDrawer();
    Ahad.state.shadeOpen = true;
    Ahad.$('#shade').classList.add('open');
    Ahad.renderToggles();
  },
  closeShade() {
    Ahad.state.shadeOpen = false;
    Ahad.$('#shade').classList.remove('open');
  },

  /* ---------------- Lock screen ---------------- */
  unlock() {
    Ahad.state.unlocked = true;
    Ahad.$('#lock').classList.add('unlocked');
    Ahad.vibrate(10);
  },

  /* ---------------- Notifications ---------------- */
  notifTime(appId, title, text) {
    const n = AhadData.notifications.find(x => x.app === appId);
    return n || { app: appId, title, text, time: 'now' };
  },

  renderNotifs() {
    const list = Ahad.$('#notif-list');
    if (!AhadData.notifications.length) {
      list.innerHTML = `<div class="empty-state">No notifications yet</div>`;
      return;
    }
    list.innerHTML = AhadData.notifications.map(n => {
      const app = Ahad.appById(n.app);
      const ic = AhadIcons.map[n.app] || '';
      return `<div class="notif" style="--ncolor:${Ahad.notifColor(n.app)}">
        ${ic.replace('app-icon', 'notif-ic')}
        <div class="notif-body">
          <div class="notif-title">${n.title}</div>
          <div class="notif-text">${n.text}</div>
          ${n.app === 'messages' ? `<div class="notif-action"><button data-reply="${n.app}">Reply</button></div>` : ''}
        </div>
        <div class="notif-time">${n.time}</div>
      </div>`;
    }).join('');
    list.querySelectorAll('[data-reply]').forEach(b => {
      b.addEventListener('click', () => {
        Ahad.closeShade();
        setTimeout(() => Ahad.launch('messages'), 200);
      });
    });
  },

  notifColor(appId) {
    const colors = { phone: '#34c759', messages: '#34c759', camera: '#48484a', photos: '#ff3b30', gallery: '#af52de', settings: '#8e8e93', browser: '#0a84ff', files: '#ff9f0a', music: '#ff375f', clock: '#0a84ff', notes: '#ffd60a', calculator: '#30b0c7', weather: '#ffcc00', themecenter: '#bf5af2', store: '#00c7be', wallet: '#ff9f0a', about: '#8b5cf6' };
    return colors[appId] || '#8b5cf6';
  },

  clearNotifs() {
    AhadData.notifications = [];
    Ahad.renderNotifs();
    Ahad.toast('All notifications cleared');
  },

  sendNotif(appId, title, text) {
    AhadData.notifications.unshift({ app: appId, title, text, time: 'now' });
    Ahad.renderNotifs();
    Ahad.banner(appId, title, text);
  },

  /* ---------------- Banner (heads-up) ---------------- */
  banner(appId, title, text) {
    const wrap = Ahad.$('#banners');
    const el = document.createElement('div');
    el.className = 'banner';
    el.innerHTML = `${AhadIcons.map[appId].replace('app-icon', 'banner-ic')}
      <div class="banner-tx"><div class="banner-t">${title}</div><div class="banner-m">${text}</div></div>`;
    el.addEventListener('click', () => {
      el.classList.add('out');
      setTimeout(() => el.remove(), 350);
      Ahad.launch(appId);
    });
    wrap.appendChild(el);
    setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 350); }, 4500);
  },

  /* ---------------- Toast / flash / confetti ---------------- */
  toast(msg, ms = 2200) {
    const wrap = Ahad.$('#toasts');
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    wrap.appendChild(el);
    setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 320); }, ms);
  },

  flash() {
    const f = Ahad.$('#flash');
    f.classList.add('go');
    setTimeout(() => f.classList.remove('go'), 130);
  },

  confetti() {
    const c = Ahad.$('#confetti');
    const colors = ['#8b5cf6', '#06b6d4', '#f59e0b', '#ec4899', '#22c55e', '#facc15'];
    for (let i = 0; i < 90; i++) {
      const p = document.createElement('div');
      p.style.cssText = `position:absolute;left:${Math.random()*100}%;top:-14px;width:${6+Math.random()*7}px;height:${10+Math.random()*10}px;background:${colors[i%colors.length]};border-radius:2px;opacity:.95;animation:cf ${2+Math.random()*2.5}s linear ${Math.random()*.5}s forwards;transform:rotate(${Math.random()*360}deg)`;
      c.appendChild(p);
    }
    setTimeout(() => c.innerHTML = '', 5200);
  },

  vibrate(ms) {
    if (!Ahad.state.vibration) return;
    try { navigator.vibrate && navigator.vibrate(ms); } catch (e) {}
  },

  /* ---------------- Theme & wallpaper ---------------- */
  setTheme(t) {
    Ahad.state.theme = t;
    Ahad.applyTheme();
    Ahad.savePrefs();
  },
  setMode(m) {
    Ahad.state.mode = m;
    Ahad.applyTheme();
    Ahad.savePrefs();
  },
  applyTheme() {
    const html = document.documentElement;
    html.dataset.theme = Ahad.state.theme;
    html.dataset.mode = Ahad.state.mode;
  },

  setWallpaper(id) {
    Ahad.state.wallpaper = id;
    Ahad.applyWallpaper();
    Ahad.savePrefs();
  },
  applyWallpaper(skipTransition) {
    const wp = AhadData.wallpapers.find(w => w.id === Ahad.state.wallpaper) || AhadData.wallpapers[0];
    const img = Ahad.$('#wallpaper');
    img.style.transition = skipTransition ? 'none' : 'opacity .5s ease';
    img.src = wp.src;
    if (skipTransition) setTimeout(() => img.style.transition = '', 60);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = Ahad.state.mode === 'light' && Ahad.state.theme !== 'neon' ? '#f2f2f7' : '#0b0b12';
  },

  /* ---------------- Toggles ---------------- */
  renderToggles() {
    const wrap = Ahad.$('#quick-toggles');
    wrap.innerHTML = AhadData.quickToggles.map(t => {
      const on = Ahad.state.toggles[t.id];
      return `<button class="toggle ${on ? 'on' : ''}" data-tgl="${t.id}">
        <span class="tgl-ic">${t.icon}</span><span>${t.label}</span>
      </button>`;
    }).join('');
    wrap.querySelectorAll('.toggle').forEach(el => {
      el.addEventListener('click', () => Ahad.toggle(el.dataset.tgl));
    });
  },

  toggle(id) {
    const st = Ahad.state.toggles;
    st[id] = !st[id];
    Ahad.renderToggles();
    Ahad.savePrefs();
    Ahad.vibrate(6);
    const label = AhadData.quickToggles.find(t => t.id === id)?.label || id;
    if (id === 'flash') {
      const scr = Ahad.$('#screen');
      if (st.flash) { scr.style.filter = 'brightness(2.4) saturate(.4)'; Ahad.toast('Flashlight on 🔦'); }
      else { scr.style.filter = ''; Ahad.toast('Flashlight off'); }
    } else if (id === 'flight') {
      Ahad.toast(st.flight ? 'Airplane mode on ✈️' : 'Airplane mode off');
    } else if (id === 'dnd') {
      Ahad.toast(st.dnd ? 'Do Not Disturb on 🌙' : 'Do Not Disturb off');
    } else {
      Ahad.toast(`${label} ${st[id] ? 'on' : 'off'}`);
    }
  },

  /* ---------------- Global events ---------------- */
  bindCore() {
    const scr = Ahad.$('#screen');

    // App window back button
    Ahad.$('#aw-back').addEventListener('click', () => Ahad.closeApp());

    // Home pill / navbar — go home
    Ahad.$('#navbar').addEventListener('click', () => {
      if (Ahad.state.appOpen) { Ahad.closeApp(); return; }
      if (Ahad.state.drawerOpen) { Ahad.closeDrawer(); return; }
      if (Ahad.state.shadeOpen) { Ahad.closeShade(); return; }
      if (!Ahad.state.unlocked) Ahad.unlock();
    });

    // Drawer search
    Ahad.$('#drawer-input').addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      Ahad.$$('#drawer-grid .app').forEach(el => {
        const name = el.querySelector('.app-name').textContent.toLowerCase();
        el.style.display = name.includes(q) ? '' : 'none';
      });
    });

    // Clear all notifications
    Ahad.$('#clear-all').addEventListener('click', () => Ahad.clearNotifs());

    // Lock screen swipe-up
    const lock = Ahad.$('#lock');
    let lStart = null;
    lock.addEventListener('pointerdown', e => { lStart = e.clientY; });
    lock.addEventListener('pointerup', e => {
      if (lStart !== null && lStart - e.clientY > 70) Ahad.unlock();
      lStart = null;
    });

    // Back key (Android)
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (Ahad.state.appOpen) Ahad.closeApp();
        else if (Ahad.state.drawerOpen) Ahad.closeDrawer();
        else if (Ahad.state.shadeOpen) Ahad.closeShade();
        else if (!Ahad.state.unlocked) Ahad.unlock();
      }
    });

    // Clicking the wallpaper area closes the drawer / shade
    Ahad.$('#wallpaper').addEventListener('click', () => {
      if (Ahad.state.drawerOpen) Ahad.closeDrawer();
      if (Ahad.state.shadeOpen) Ahad.closeShade();
    });

    // Welcome notification once
    if (!localStorage.getItem('ahados.welcome')) {
      setTimeout(() => {
        Ahad.sendNotif('about', 'Welcome to AhadOs 🎉', 'Your own OS is ready — swipe down for notifications, hold nothing back!');
      }, 4500);
      localStorage.setItem('ahados.welcome', '1');
    }
  },
};

/* Boot animations */
const bootStyle = document.createElement('style');
bootStyle.textContent = `
@keyframes cf {
  0% { transform: translateY(0) rotate(0); opacity: .95; }
  100% { transform: translateY(105vh) rotate(720deg); opacity: .1; }
}`;
document.head.appendChild(bootStyle);
