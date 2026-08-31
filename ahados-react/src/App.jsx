/* ============================================================
   AhadOs v2 — root App: phone frame + layers
   ============================================================ */
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useOS } from './os/OSContext';
import Scene3D from './os/Scene3D';
import { ICONS, ICON_GRADS } from './os/icons';
import { APPS, BOOT_MESSAGES, DOCK, HOME_GRID, NOTIFICATIONS, QUICK_TOGGLES, WALLPAPERS } from './os/data';
import Apps from './apps/Apps';

/* ---------- helpers ---------- */
const useClock = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  const t = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const d = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const sec = now.toLocaleTimeString('en-US', { hour12: false });
  return { t, d, sec };
};

const NOTIF_COLORS = {
  phone: 'linear-gradient(135deg,#34c759,#0a9418)', messages: 'linear-gradient(135deg,#34c759,#30b0c7)',
  camera: 'linear-gradient(135deg,#1d1d1f,#48484a)', photos: 'linear-gradient(135deg,#ff3b30,#ff9500)',
  gallery: 'linear-gradient(135deg,#af52de,#5856d6)', settings: 'linear-gradient(135deg,#8e8e93,#636366)',
  browser: 'linear-gradient(135deg,#0a84ff,#5e5ce6)', files: 'linear-gradient(135deg,#ff9f0a,#ff375f)',
  music: 'linear-gradient(135deg,#ff375f,#bf5af2)', clock: 'linear-gradient(135deg,#0a84ff,#64d2ff)',
  notes: 'linear-gradient(135deg,#ffd60a,#ff9f0a)', calculator: 'linear-gradient(135deg,#30b0c7,#0a84ff)',
  weather: 'linear-gradient(135deg,#ffcc00,#ff9f0a)', store: 'linear-gradient(135deg,#00c7be,#30b0c7)',
  wallet: 'linear-gradient(135deg,#ff9f0a,#ff2d55)', about: 'linear-gradient(135deg,#8b5cf6,#06b6d4)',
  snake: 'linear-gradient(135deg,#22c55e,#16a34a)', game2048: 'linear-gradient(135deg,#f59e0b,#f97316)',
};

export const AppIcon = ({ id, size = 58 }) => (
  <span className="app-icon" style={{ width: size, height: size, fontSize: size * 0.5, background: ICON_GRADS[id] || ICON_GRADS.about }}>
    <span className="ico">{ICONS[id] || ICONS.about}</span>
  </span>
);

const AppTile = ({ id, name, onClick, badge }) => (
  <motion.button
    className="app" onClick={onClick}
    whileTap={{ scale: 0.86 }}
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ type: 'spring', stiffness: 300, damping: 24 }}
  >
    <span style={{ position: 'relative' }}>
      <AppIcon id={id} />
      {badge ? <span className="app-badge">{badge}</span> : null}
    </span>
    <span className="app-name">{name}</span>
  </motion.button>
);

/* ---------- Status bar ---------- */
function StatusBar() {
  const { t, sec } = useClock();
  const { flashOn } = useOS();
  return (
    <div className="statusbar">
      <div className="sb-time">{t}</div>
      <div id="notch"></div>
      <div className="sb-right">
        <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="1"/><rect x="4.5" y="4.5" width="3" height="6.5" rx="1"/><rect x="9" y="2" width="3" height="9" rx="1"/><rect x="13.5" y="0" width="3" height="11" rx="1"/></svg>
        <svg width="15" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
        <div className="batt"><i style={{ width: flashOn ? '100%' : '86%' }}></i></div>
        <span style={{ fontSize: 11.5, fontWeight: 600 }}>{sec.split(':').slice(0, 2).join(':')}</span>
      </div>
    </div>
  );
}

/* ---------- Boot ---------- */
function Boot() {
  const [msg, setMsg] = useState(0);
  useEffect(() => {
    const int = setInterval(() => setMsg(m => Math.min(m + 1, BOOT_MESSAGES.length - 1)), 620);
    return () => clearInterval(int);
  }, []);
  return (
    <motion.div className="boot" style={{
      position: 'absolute', inset: 0, zIndex: 300, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 18, background: '#05040c'
    }}
      exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.55 }}>
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 16 }}
        style={{
          width: 86, height: 86, borderRadius: 26, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-neon)', fontWeight: 800, fontSize: 44, color: '#fff',
          background: 'var(--accent-grad)', boxShadow: '0 0 40px rgba(139,92,246,.65)'
        }}>A</motion.div>
      <div style={{ fontFamily: 'var(--font-neon)', letterSpacing: '.42em', fontSize: 14, color: '#c4b5fd', paddingLeft: '.42em' }}>AHADOS</div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,.5)' }}>{BOOT_MESSAGES[msg]}</div>
      <div style={{ width: 150, height: 3, borderRadius: 3, background: 'rgba(255,255,255,.12)', overflow: 'hidden' }}>
        <motion.div style={{ height: '100%', borderRadius: 3, background: 'var(--accent-grad)' }}
          initial={{ x: '-120%' }} animate={{ x: '320%' }}
          transition={{ repeat: Infinity, duration: 1.1, ease: 'easeInOut' }} />
      </div>
    </motion.div>
  );
}

/* ---------- Lock screen ---------- */
function LockScreen() {
  const { t, d } = useClock();
  const { setUnlocked } = useOS();
  const [dragY, setDragY] = useState(0);
  return (
    <motion.div
      className="lock"
      drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0.6, bottom: 0 }}
      onDrag={(e, info) => setDragY(Math.max(0, info.offset.y))}
      onDragEnd={(e, info) => { if (info.offset.y < -80) setUnlocked(true); setDragY(0); }}
      animate={dragY > 0 ? { y: dragY, opacity: 1 - dragY / 400 } : {}}
      exit={{ y: -1100, opacity: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }}
    >
      <div className="lock-mid">
        <div className="lock-time">{t}</div>
        <div className="lock-date">{d}</div>
      </div>
      <div className="lock-bot">
        <div className="lock-hint"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>&nbsp;Swipe to unlock</div>
        <div className="lock-brand">AhadOs</div>
      </div>
    </motion.div>
  );
}

/* ---------- Home ---------- */
function Home() {
  const { launch, installed, drawer, setDrawer, shade, setShade, wpSrc, wallpaper } = useOS();
  const { t, d } = useClock();
  const gridApps = HOME_GRID.flat().filter(id => installed.includes(id));
  const dockApps = DOCK.filter(id => installed.includes(id));
  return (
    <motion.div className="home"
      animate={drawer || shade ? { y: -26, scale: 0.94, opacity: 0.35 } : { y: 0, scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => { if (drawer) setDrawer(false); if (shade) setShade(false); }}
    >
      <div className="widget">
        <div className="hw-time">{t}</div>
        <div className="hw-date">{d}</div>
        <div className="hw-weather">☀️ 32°C · Dhaka</div>
      </div>
      <div className="app-grid" onClick={e => e.stopPropagation()}>
        {gridApps.map(id => {
          const meta = APPS.find(a => a.id === id);
          return <AppTile key={id} id={id} name={meta.name} badge={id === 'messages' ? 3 : 0}
            onClick={() => launch(id)} />;
        })}
      </div>
      <div className="dock" onClick={e => e.stopPropagation()}>
        {dockApps.map(id => {
          const meta = APPS.find(a => a.id === id);
          return <AppTile key={id} id={id} name={meta.name} onClick={() => launch(id)} />;
        })}
      </div>
    </motion.div>
  );
}

/* ---------- Drawer ---------- */
function Drawer() {
  const { drawer, setDrawer, launch, installed } = useOS();
  const [q, setQ] = useState('');
  const list = APPS.filter(a => installed.includes(a.id) && a.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <motion.div className="drawer"
      initial={{ y: '100%' }} animate={drawer ? { y: 0 } : { y: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 32 }}
    >
      <div className="drawer-search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search apps" autoFocus={drawer} />
      </div>
      <div className="drawer-grid">
        {list.map(id => {
          const meta = APPS.find(a => a.id === id);
          return <AppTile key={id} id={id} name={meta.name} onClick={() => { setDrawer(false); setTimeout(() => launch(id), 180); }} />;
        })}
      </div>
    </motion.div>
  );
}

/* ---------- Shade ---------- */
function Shade() {
  const { shade, setShade, toggles, toggle, notifs, clearNotifs, launch, closeApp, app } = useOS();
  const { t, d } = useClock();
  return (
    <motion.div className="shade"
      initial={{ y: '-105%' }} animate={shade ? { y: 0 } : { y: '-105%' }}
      transition={{ type: 'spring', stiffness: 280, damping: 30 }}
    >
      <div className="shade-grab"></div>
      <div className="sh-time">{t}</div>
      <div className="sh-date">{d}</div>
      <div className="quick-toggles">
        {QUICK_TOGGLES.map(x => (
          <motion.button key={x.id} className={`toggle ${toggles[x.id] ? 'on' : ''}`} onClick={() => toggle(x.id)}
            whileTap={{ scale: 0.9 }}>
            <span className="tgl-ic">{x.icon}</span><span>{x.label}</span>
          </motion.button>
        ))}
      </div>
      <div className="sh-sub"><span>Notifications</span><button id="clear-all" onClick={clearNotifs}>Clear all</button></div>
      <div className="notif-list">
        {notifs?.length ? notifs.map(n => (
          <motion.div key={n.id} className="notif" style={{ '--ncolor': NOTIF_COLORS[n.app] || '#a855f7' }}
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} layout
            onClick={() => { setShade(false); setTimeout(() => launch(n.app), 250); }}>
            <span className="notif-ic" style={{ background: NOTIF_COLORS[n.app] || '#a855f7' }}>{ICONS[n.app] || '🔔'}</span>
            <div className="notif-body">
              <div className="notif-title">{n.title}</div>
              <div className="notif-text">{n.text}</div>
            </div>
            <div className="notif-time">{n.time}</div>
          </motion.div>
        )) : <div className="empty-state">No notifications yet</div>}
      </div>
    </motion.div>
  );
}

/* ---------- App window ---------- */
function AppWindow() {
  const { app, closeApp, appMeta } = useOS();
  const meta = app ? appMeta(app) : null;
  return (
    <AnimatePresence>
      {app && meta && (
        <motion.div className="appwin"
          initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 320, damping: 34 }}
        >
          <div className="aw-header">
            <button className="aw-back" onClick={closeApp} aria-label="Back">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <div className="aw-title">{meta.name}</div>
            <div style={{ width: 36 }}></div>
          </div>
          <div className="aw-body">
            <Apps id={app} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- Banners & toasts ---------- */
function Banners() {
  const { notifs, launch, setShade } = useOS();
  const [hidden, setHidden] = useState({});
  useEffect(() => {
    if (!notifs?.length) return;
    const t = setTimeout(() => setHidden(h => ({ ...h, [notifs[0].id]: true })), 4500);
    return () => clearTimeout(t);
  }, [notifs]);
  const top = notifs?.[0];
  if (!top || hidden[top.id]) return null;
  return (
    <div className="banners">
      <motion.div className="banner" initial={{ y: -130, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        exit={{ y: -130, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        onClick={() => { setHidden(h => ({ ...h, [top.id]: true })); setShade(false); launch(top.app); }}>
        <span className="banner-ic" style={{ background: NOTIF_COLORS[top.app] || '#a855f7' }}>{ICONS[top.app] || '🔔'}</span>
        <div className="banner-tx"><div className="banner-t">{top.title}</div><div className="banner-m">{top.text}</div></div>
      </motion.div>
    </div>
  );
}

function Toasts() {
  const { toasts } = useOS();
  return (
    <div className="toasts">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div key={t.id} className="toast"
            initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}>
            {t.msg}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Root ---------- */
export default function App() {
  const os = useOS();
  const { booted, unlocked, drawer, shade, app, setDrawer, setShade, closeApp, wpSrc, wallpaper, brightness, flashOn, toasts } = os;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (app) closeApp();
        else if (drawer) setDrawer(false);
        else if (shade) setShade(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [app, drawer, shade]);

  return (
    <div className="phone-frame">
      <span className="side-btn sb-a" /><span className="side-btn sb-b" /><span className="side-btn sb-c" />
      <div className="screen" style={{ filter: flashOn ? 'brightness(2.3) saturate(.35)' : `brightness(${brightness / 100})` }}>
        <div className="wallpaper-layer">
          <motion.img key={wallpaper} src={wpSrc(wallpaper)} alt="" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} />
        </div>
        <Scene3D />
        <StatusBar />

        <AnimatePresence>{!booted && <Boot key="boot" />}</AnimatePresence>
        <AnimatePresence>{booted && !unlocked && <LockScreen key="lock" />}</AnimatePresence>

        <Home />
        <Drawer />
        <Shade />
        <AppWindow />

        <Banners />
        <Toasts />
        <div id="flash" className={flashOn ? 'go' : ''}></div>

        <div className="navbar" onClick={() => {
          if (app) closeApp();
          else if (drawer) setDrawer(false);
          else if (shade) setShade(false);
          else if (!unlocked) os.setUnlocked(true);
        }}>
          <div className="home-pill"></div>
        </div>
      </div>
    </div>
  );
}
