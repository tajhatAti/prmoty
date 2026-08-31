/* ============================================================
   AhadOs v2 — global OS state
   ============================================================ */
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { APPS, DEFAULT_INSTALLED, WALLPAPERS } from './data';

const OSContext = createContext(null);

const load = (k, d) => {
  try { const v = localStorage.getItem('ahados2.' + k); return v ? JSON.parse(v) : d; } catch { return d; }
};
const save = (k, v) => {
  try { localStorage.setItem('ahados2.' + k, JSON.stringify(v)); } catch {}
};

export function OSProvider({ children }) {
  const [booted, setBooted] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [app, setApp] = useState(null);          // open app id
  const [drawer, setDrawer] = useState(false);
  const [shade, setShade] = useState(false);
  const [wallpaper, setWallpaper] = useState(() => load('wallpaper', 'aurora'));
  const [brightness, setBrightness] = useState(() => load('brightness', 100));
  const [toggles, setToggles] = useState(() => ({ wifi: true, bluetooth: false, flash: false, rotate: false, flight: false, data: true, battery: false, dnd: false }));
  const [notifs, setNotifs] = useState(() => load('notifs', null) || null);
  const [installed, setInstalled] = useState(() => load('installed', DEFAULT_INSTALLED));
  const [toasts, setToasts] = useState([]);
  const [flashOn, setFlashOn] = useState(false);
  const toastId = useRef(0);

  // boot
  useEffect(() => { const t = setTimeout(() => setBooted(true), 3400); return () => clearTimeout(t); }, []);

  // notifs seed (once)
  useEffect(() => {
    if (!notifs) setNotifs([...initialNotifs()]);
  }, []);
  useEffect(() => { if (notifs) save('notifs', notifs); }, [notifs]);
  useEffect(() => save('wallpaper', wallpaper), [wallpaper]);
  useEffect(() => save('brightness', brightness), [brightness]);
  useEffect(() => save('installed', installed), [installed]);

  const appMeta = (id) => APPS.find(a => a.id === id);

  const toast = (msg, ms = 2200) => {
    const id = ++toastId.current;
    setToasts(t => [...t, { id, msg }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), ms);
  };

  const vibrate = (ms = 8) => { try { navigator.vibrate && navigator.vibrate(ms); } catch {} };

  const launch = (id) => {
    setShade(false); setDrawer(false); setApp(id);
    vibrate(8);
  };
  const closeApp = () => { setApp(null); vibrate(5); };

  const toggle = (id) => {
    setToggles(t => {
      const nv = { ...t, [id]: !t[id] };
      if (id === 'flash') setFlashOn(nv.flash);
      const label = { wifi: 'Wi-Fi', bluetooth: 'Bluetooth', flash: 'Flashlight', rotate: 'Rotate', flight: 'Airplane mode', data: 'Mobile data', battery: 'Battery saver', dnd: 'Do Not Disturb' }[id];
      if (id === 'flash') toast(nv.flash ? 'Flashlight on 🔦' : 'Flashlight off');
      else toast(`${label} ${nv[id] ? 'on' : 'off'}`);
      return nv;
    });
    vibrate(6);
  };

  const install = (id) => {
    setInstalled(l => l.includes(id) ? l : [...l, id]);
  };

  const addNotif = (n) => setNotifs(list => [{ id: Date.now(), time: 'now', ...n }, ...(list || [])]);

  const clearNotifs = () => setNotifs([]);

  const wpSrc = (id) => (WALLPAPERS.find(w => w.id === id) || WALLPAPERS[0]).src;

  return (
    <OSContext.Provider value={{
      booted, unlocked, setUnlocked,
      app, launch, closeApp,
      drawer, setDrawer, shade, setShade,
      wallpaper, setWallpaper, wpSrc,
      brightness, setBrightness,
      toggles, toggle, flashOn,
      notifs, addNotif, clearNotifs,
      installed, install, appMeta,
      toast, toasts, vibrate,
    }}>
      {children}
    </OSContext.Provider>
  );
}

export const useOS = () => useContext(OSContext);

function initialNotifs() {
  return [
    { id: 1, app: 'messages', title: 'Sadia', text: 'Hey Ahad! Eid Mubarak in advance 🎉', time: '2m ago' },
    { id: 2, app: 'weather', title: 'Weather', text: 'Rain expected in Dhaka tomorrow — take an umbrella ☔', time: '18m ago' },
    { id: 3, app: 'browser', title: 'Browser', text: 'Download complete: wallpaper pack', time: '1h ago' },
    { id: 4, app: 'store', title: 'Ahad Store', text: 'New apps are now available for install!', time: '3h ago' },
    { id: 5, app: 'phone', title: 'Missed call', text: 'Ahad +880 17XX-XXXXXX (1 missed call)', time: '5h ago' },
  ];
}
