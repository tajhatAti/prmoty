/* ============================================================
   AhadOs v2 — all app views (React)
   ============================================================ */
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useOS } from '../os/OSContext';
import { AppIcon } from '../App';
import { CHATS, FILES, GALLERY_PHOTOS, NOTES_SEED, SONGS, STORE_APPS, WALLET, WEATHER } from '../os/data';

const fade = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
};

const useNow = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  return now;
};

/* ================= CLOCK ================= */
function ClockApp() {
  const now = useNow();
  const [alarms, setAlarms] = useState({ 7: true, 22: true });
  const [sw, setSw] = useState({ run: false, ms: 0 });
  useEffect(() => {
    if (!sw.run) return;
    const t0 = Date.now() - sw.ms;
    const int = setInterval(() => setSw(s => ({ ...s, ms: Date.now() - t0 })), 90);
    return () => clearInterval(int);
  }, [sw.run]);
  const fmtSW = (ms) => `${String(Math.floor(ms / 60000)).padStart(2, '0')}:${String(Math.floor((ms % 60000) / 1000)).padStart(2, '0')}.${Math.floor((ms % 1000) / 100)}`;
  return (
    <motion.div {...fade}>
      <div className="card"><div className="clock-face">
        <div className="big">{now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</div>
        <div className="sub">{now.toLocaleTimeString('en-US', { hour12: false })} · {now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
      </div></div>
      <div className="card"><h3>⏰ Alarms</h3>
        <div className="alarm-row"><span className="al-time">7:00 AM</span><div style={{ flex: 1 }}><div className="al-label">Wake up ☀️</div><div className="al-days">Mon–Fri</div></div>
          <button className={`switch ${alarms[7] ? 'on' : ''}`} onClick={() => setAlarms(a => ({ ...a, 7: !a[7] }))} /></div>
        <div className="alarm-row"><span className="al-time">10:30 PM</span><div style={{ flex: 1 }}><div className="al-label">Sleep 🌙</div><div className="al-days">Every day</div></div>
          <button className={`switch ${alarms[22] ? 'on' : ''}`} onClick={() => setAlarms(a => ({ ...a, 22: !a[22] }))} /></div>
      </div>
      <div className="card"><h3>⏱️ Stopwatch</h3>
        <div className="clock-face" style={{ padding: '8px 0 2px' }}>
          <div className="big" style={{ fontSize: 52 }}>{fmtSW(sw.ms)}</div>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 6 }}>
          <button className="btn pri" onClick={() => setSw(s => ({ ...s, run: !s.run }))}>{sw.run ? 'Stop' : 'Start'}</button>
          <button className="btn" onClick={() => setSw({ run: false, ms: 0 })}>Reset</button>
        </div>
      </div>
    </motion.div>
  );
}

/* ================= CALCULATOR ================= */
function CalcApp() {
  const exprRef = useRef('');
  const [disp, setDisp] = useState('0');
  const keys = [['C','op'],['(', 'op'],[')','op'],['÷','op'],['7',''],['8',''],['9',''],['×','op'],['4',''],['5',''],['6',''],['−','op'],['1',''],['2',''],['3',''],['+','op'],['0','zero'],['.',''],['⌫','op'],['=','eq']];
  const [expr, setExpr] = useState('');
  const press = (k) => {
    if (k === 'C') { exprRef.current = ''; setExpr(''); setDisp('0'); return; }
    if (k === '⌫') { exprRef.current = exprRef.current.slice(0, -1); setExpr(exprRef.current); setDisp(exprRef.current || '0'); return; }
    if (k === '=') {
      try {
        const v = Function('"use strict";return (' + exprRef.current.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-') + ')')();
        exprRef.current = String(Math.round(v * 1e9) / 1e9);
        setExpr(exprRef.current); setDisp(exprRef.current);
      } catch { setDisp('Error'); exprRef.current = ''; setExpr(''); }
      return;
    }
    exprRef.current += k;
    setExpr(exprRef.current); setDisp(exprRef.current);
  };
  return (
    <motion.div {...fade}>
      <div className="card" style={{ padding: '10px 14px' }}>
        <div className="calc-display"><div className="calc-expr">{expr || '\u00A0'}</div><div>{disp}</div></div>
        <div className="calc-grid">
          {keys.map(([k, cls]) => (
            <button key={k} className={`calc-btn ${cls}`} onClick={() => press(k)}>{k}</button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ================= NOTES ================= */
function NotesApp() {
  const [notes, setNotes] = useState(NOTES_SEED);
  const [edit, setEdit] = useState(null);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const { toast } = useOS();
  if (edit) {
    return (
      <motion.div {...fade}>
        <input className="input" value={title} onChange={e => setTitle(e.target.value)} style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }} />
        <textarea className="input" rows="10" value={text} onChange={e => setText(e.target.value)} style={{ lineHeight: 1.6 }} />
        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          <button className="btn pri" style={{ flex: 1 }} onClick={() => {
            setNotes(ns => ns.map(n => n.id === edit ? { ...n, title: title || 'Untitled', text, time: 'Just now' } : n));
            setEdit(null); toast('Note saved ✅');
          }}>Save</button>
          <button className="btn" onClick={() => { setNotes(ns => ns.filter(n => n.id !== edit)); setEdit(null); toast('Note deleted'); }}>Delete</button>
        </div>
      </motion.div>
    );
  }
  return (
    <motion.div {...fade}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <button className="btn pri" style={{ flex: 1 }} onClick={() => {
          const n = { id: Date.now(), title: 'New note', text: 'Tap to edit…', time: 'Just now' };
          setNotes(ns => [n, ...ns]); setEdit(n.id); setTitle('New note'); setText('Tap to edit…');
        }}>+ New note</button>
      </div>
      <AnimatePresence>
        {notes.map(n => (
          <motion.div key={n.id} className="note-item" layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            onClick={() => { setEdit(n.id); setTitle(n.title); setText(n.text); }}>
            <div className="n-title">{n.title}</div>
            <div className="n-text">{n.text}</div>
            <div className="n-time">{n.time}</div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

/* ================= WEATHER ================= */
function WeatherApp() {
  const w = WEATHER;
  return (
    <motion.div {...fade}>
      <div className="card"><div className="weather-hero">
        <div style={{ fontSize: 52 }}>{w.emoji}</div>
        <div className="weather-temp">{w.temp}°</div>
        <div className="weather-desc">{w.desc} · {w.city}, BD</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>H:{w.hi}° L:{w.lo}°</div>
      </div></div>
      <div className="card"><h3>6-day forecast</h3>
        <div className="weather-grid">{w.days.map(d => (
          <div className="w-day" key={d.d}><div className="d">{d.d}</div><div className="i">{d.i}</div><div className="t">{d.t}</div></div>
        ))}</div>
      </div>
      <div className="card"><h3>Details</h3>
        <div className="weather-stats">
          <div className="wstat"><span className="i">🌡️</span><div><div className="t">Feels like</div><div className="v">{w.feel}°</div></div></div>
          <div className="wstat"><span className="i">💧</span><div><div className="t">Humidity</div><div className="v">{w.hum}%</div></div></div>
          <div className="wstat"><span className="i">💨</span><div><div className="t">Wind</div><div className="v">{w.wind}</div></div></div>
          <div className="wstat"><span className="i">🌧️</span><div><div className="t">Rain</div><div className="v">{w.rain}</div></div></div>
        </div>
      </div>
    </motion.div>
  );
}

/* ================= MUSIC ================= */
function MusicApp() {
  const [cur, setCur] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [prog, setProg] = useState(0);
  const intRef = useRef(null);
  useEffect(() => {
    if (!playing) return;
    intRef.current = setInterval(() => {
      setProg(p => {
        if (p >= 99) { setCur(c => (c + 1) % SONGS.length); return 0; }
        return p + 1.2;
      });
    }, 1000);
    return () => clearInterval(intRef.current);
  }, [playing]);
  const s = SONGS[cur];
  const toggle = () => setPlaying(p => !p);
  return (
    <motion.div {...fade}>
      <div className="card" style={{ padding: 14 }}>
        <div className="music-hero">
          <div className="music-art" style={{ background: s.grad }}>{s.emoji}</div>
          <div className="music-title">{s.title}</div>
          <div className="music-artist">{s.artist}</div>
        </div>
        <input type="range" min="0" max="100" value={prog} onChange={e => setProg(+e.target.value)}
          style={{ width: '100%', accentColor: '#a855f7' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>
          <span>{Math.floor(prog / 100 * 253 / 60)}:{String(Math.round(prog / 100 * 253) % 60).padStart(2, '0')}</span><span>{s.dur}</span>
        </div>
        <div className="music-controls">
          <button className="mc" onClick={() => { setCur((cur - 1 + SONGS.length) % SONGS.length); setProg(0); }}>
            <span className="ic"><svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><polygon points="19 20 9 12 19 4"/><rect x="5" y="4" width="2.5" height="16" rx="1"/></svg></span></button>
          <button className="mc main" onClick={toggle}>
            <span className="ic">{playing
              ? <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
              : <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><polygon points="7 4 20 12 7 20"/></svg>}</span></button>
          <button className="mc" onClick={() => { setCur((cur + 1) % SONGS.length); setProg(0); }}>
            <span className="ic"><svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 4 15 12 5 20"/><rect x="16.5" y="4" width="2.5" height="16" rx="1"/></svg></span></button>
        </div>
      </div>
      <div className="card"><h3>Up next</h3>
        {SONGS.map((x, i) => (
          <div key={i} className={`song-item ${i === cur ? 'playing' : ''}`} onClick={() => { setCur(i); setProg(0); setPlaying(true); }}>
            <div className="s-art" style={{ background: x.grad }}>{x.emoji}</div>
            <div style={{ flex: 1, minWidth: 0 }}><div className="s-t">{x.title}</div><div className="s-a">{x.artist} · {x.dur}</div></div>
            {i === cur && playing ? <span className="eq"><i></i><i></i><i></i><i></i></span> : null}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ================= PHOTOS ================= */
function PhotosApp() {
  const [lb, setLb] = useState(null);
  const photos = GALLERY_PHOTOS;
  return (
    <motion.div {...fade}>
      <div className="gal-sep">Photos</div>
      <div className="gal-grid">
        {photos.map((p, i) => <img key={i} src={p.src} onClick={() => setLb(i)} alt="" />)}
      </div>
      {lb !== null && (
        <div className="lightbox" onClick={() => setLb(null)}>
          <img src={photos[lb].src} />
          <button className="lb-close">✕</button>
          <div className="lb-cap">{photos[lb].cap}</div>
        </div>
      )}
    </motion.div>
  );
}

/* ================= GALLERY ================= */
function GalleryApp() {
  const [lb, setLb] = useState(null);
  return (
    <motion.div {...fade}>
      <div className="gal-sep">Recents</div>
      <div className="gal-grid">
        {GALLERY_PHOTOS.slice(0, 3).map((p, i) => <img key={i} src={p.src} onClick={() => setLb(i)} alt="" />)}
      </div>
      <div className="gal-sep">All photos</div>
      <div className="gal-grid">
        {GALLERY_PHOTOS.map((p, i) => <img key={i} src={p.src} onClick={() => setLb(i)} alt="" />)}
      </div>
      {lb !== null && (
        <div className="lightbox" onClick={() => setLb(null)}>
          <img src={GALLERY_PHOTOS[lb].src} />
          <button className="lb-close">✕</button>
          <div className="lb-cap">{GALLERY_PHOTOS[lb].cap}</div>
        </div>
      )}
    </motion.div>
  );
}

/* ================= CAMERA ================= */
function CameraApp() {
  const { addNotif, toast, vibrate } = useOS();
  return (
    <motion.div {...fade}>
      <div className="camera-app"><div className="cam-view">
        <div className="cam-hint">AhadOs Camera</div>
        <div className="cam-moon">🌙</div>
        <div>
          <div style={{ textAlign: 'center', marginBottom: 16 }}><div className="cam-mode">PHOTO</div></div>
          <div className="cam-controls">
            <button className="cam-shutter" onClick={() => {
              vibrate(20);
              document.getElementById('flash')?.classList.add('go');
              setTimeout(() => document.getElementById('flash')?.classList.remove('go'), 130);
              setTimeout(() => {
                addNotif({ app: 'gallery', title: 'Camera', text: 'Photo captured! Saved to Gallery 📸' });
                toast('📸 Photo captured');
              }, 350);
            }} />
          </div>
        </div>
      </div></div>
    </motion.div>
  );
}

/* ================= FILES ================= */
function FilesApp() {
  const [path, setPath] = useState(['root']);
  const { toast, addNotif } = useOS();
  const dir = path[path.length - 1];
  const list = FILES[dir] || [];
  const icon = (t) => ({ folder: '📁', image: '🖼️', text: '📄', audio: '🎵', video: '🎬', zip: '🗜️' }[t] || '📄');
  return (
    <motion.div {...fade}>
      <div className="files-path">📂 {path.join(' / ')}</div>
      {list.map(f => (
        <div className="file-row" key={f.name} onClick={() => {
          if (f.type === 'folder') setPath(p => p[p.length - 1] === 'root' ? [f.name] : [...p, f.name]);
          else if (f.type === 'image') toast('🖼️ Opening image…');
          else if (f.type === 'audio') { addNotif({ app: 'music', title: 'Music', text: `Now playing: ${f.name.replace('.mp3', '')} 🎵` }); }
          else toast(`Opening ${f.name}…`);
        }}>
          <span className="f-ic">{icon(f.type)}</span>
          <div className="f-tx"><div className="f-t">{f.name}</div><div className="f-s">{f.size || 'Folder'}</div></div>
        </div>
      ))}
      {path.length > 1 && <button className="btn" style={{ marginTop: 10 }} onClick={() => setPath(p => p.slice(0, -1))}>← Back</button>}
    </motion.div>
  );
}

/* ================= MESSAGES ================= */
function MessagesApp() {
  const [chatId, setChatId] = useState(null);
  const [msgs, setMsgs] = useState(CHATS);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const threadRef = useRef(null);
  useEffect(() => { if (threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight; }, [chatId, msgs, typing]);
  const send = () => {
    const v = input.trim(); if (!v) return;
    setMsgs(m => ({ ...m, [chatId]: { ...m[chatId], msgs: [...m[chatId].msgs, { me: true, t: v }] } }));
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const replies = ['Wow! 😍', 'Nice, tell me more!', 'Bhalo kotha 🫡', 'Screenshot niye rakhlam!', 'Aha! Darun 🔥', 'Hmm, interesting…'];
      setMsgs(m => ({ ...m, [chatId]: { ...m[chatId], msgs: [...m[chatId].msgs, { me: false, t: replies[Math.floor(Math.random() * replies.length)] }] } }));
    }, 1500 + Math.random() * 900);
  };
  if (chatId) {
    const c = msgs[chatId];
    return (
      <motion.div {...fade} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div className="chat-avatar" style={{ width: 38, height: 38, fontSize: 17, background: c.grad }}>{c.emoji}</div>
          <div style={{ flex: 1 }}><div className="chat-name">{c.name}</div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>online</div></div>
          <button className="btn" style={{ padding: '8px 12px', fontSize: 12.5 }} onClick={() => setChatId(null)}>← Back</button>
        </div>
        <div className="chat-thread" ref={threadRef}>
          {c.msgs.map((m, i) => (
            <div key={i} className={`chat-row ${m.me ? 'me' : 'other'}`}><div className="msg-bubble">{m.t}</div></div>
          ))}
          {typing && <div className="chat-row other"><div className="msg-bubble typing-dot"><i></i><i></i><i></i></div></div>}
        </div>
        <div className="chat-input-row">
          <input className="input" value={input} onChange={e => setInput(e.target.value)} placeholder="Message…"
            onKeyDown={e => e.key === 'Enter' && send()} />
          <button className="btn pri" onClick={send}>➤</button>
        </div>
      </motion.div>
    );
  }
  return (
    <motion.div {...fade}>
      <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 700 }}>Chats</div>
      {Object.entries(msgs).map(([id, c]) => (
        <div className="chat-list-item" key={id} onClick={() => setChatId(id)}>
          <div className="chat-avatar" style={{ background: c.grad }}>{c.emoji}</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="chat-name">{c.name}</div>
            <div className="chat-last">{c.msgs[c.msgs.length - 1].t}</div>
          </div>
          <div className="chat-time">now</div>
        </div>
      ))}
    </motion.div>
  );
}

/* ================= BROWSER ================= */
function BrowserApp() {
  const [page, setPage] = useState('home');
  const [q, setQ] = useState('');
  const pages = {
    home: {
      title: 'AhadOs Search',
      html: (
        <>
          <h1 style={{ textAlign: 'center', fontSize: 24, margin: '30px 0 6px' }}>🔎 AhadOs Search</h1>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: 20 }}>Search the web (simulated)</p>
          <div className="card" style={{ cursor: 'pointer' }} onClick={() => setPage('ahad')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <AppIcon id="about" size={46} />
              <div><div style={{ fontWeight: 700 }}>AhadOs — your own OS</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>Apps · icons · wallpapers · notifications</div></div>
            </div>
          </div>
          <div className="card" style={{ cursor: 'pointer' }} onClick={() => setPage('wiki')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 26 }}>🇧🇩</span>
              <div><div style={{ fontWeight: 700 }}>Bangladesh</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>A beautiful country of rivers &amp; green</div></div>
            </div>
          </div>
        </>
      )
    },
    ahad: {
      title: 'AhadOs — Wiki',
      html: (
        <>
          <h1>AhadOs</h1>
          <p>AhadOs is a custom mobile operating system designed entirely by <b>Ahad</b> — with its own app icons, wallpapers, notification style, 3D glass design and app launcher. It runs right inside the browser and can be installed on any phone as a PWA.</p>
          <h2>Features</h2>
          <p>✅ Unified glass + neon + iOS + minimal design.<br />✅ 3D animated background (Three.js).<br />✅ Notification shade with quick toggles.<br />✅ 17+ built-in apps.<br />✅ Ahad Store with playable games.</p>
        </>
      )
    },
    wiki: {
      title: 'Bangladesh — Wiki',
      html: (
        <>
          <h1>Bangladesh 🇧🇩</h1>
          <p>Bangladesh is a South Asian country, home to lush green landscapes and the largest river delta in the world, formed by the Ganges, Brahmaputra and Meghna rivers.</p>
          <h2>Capital</h2>
          <p><b>Dhaka</b> — one of the most densely populated cities in the world, famous for rickshaws, biryani and its vibrant startup scene.</p>
          <h2>Tech</h2>
          <p>Bangladesh has a rapidly growing tech sector — freelancing, mobile apps and software exports are booming, with thousands of young developers building products for the world.</p>
        </>
      )
    },
  };
  const go = () => { if (q.trim()) setPage('search'); };
  const p = pages[page] || pages.home;
  return (
    <motion.div {...fade}>
      <div className="browser-bar">
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search or type URL…"
          onKeyDown={e => e.key === 'Enter' && go()} />
        <button className="btn pri" style={{ padding: '9px 14px' }} onClick={go}>Go</button>
      </div>
      <div className="browser-page">
        {page === 'search' ? (
          <>
            <h2 style={{ fontSize: 16 }}>Results for “{q}”</h2>
            <div className="card" style={{ marginTop: 12 }}><b>AhadOs</b> — your own phone OS with custom icons, wallpapers &amp; notifications.</div>
            <div className="card"><b>Bangladesh</b> — land of rivers, Dhaka.</div>
            <div className="card"><b>Fun fact</b> — you just searched "{q}" on your own OS! 😄</div>
          </>
        ) : p.html}
      </div>
    </motion.div>
  );
}

/* ================= SETTINGS ================= */
function SettingsApp() {
  const os = useOS();
  const { wallpaper, setWallpaper, brightness, setBrightness, toggles } = os;
  const [resetArmed, setResetArmed] = useState(false);
  const wall = (id) => <img src={requireWall(id)} alt="" />;
  return (
    <motion.div {...fade}>
      <div className="preview-card">
        <div className="preview-screen">
          <img src={requireWall(wallpaper)} alt="" />
          <div className="ps-ui"></div>
          <div className="ps-time">10:24</div>
          <div className="ps-icons">
            <span className="ps-app" style={{ background: 'linear-gradient(135deg,#0a84ff,#64d2ff)' }}>🕐</span>
            <span className="ps-app" style={{ background: 'linear-gradient(135deg,#34c759,#30b0c7)' }}>💬</span>
            <span className="ps-app" style={{ background: 'linear-gradient(135deg,#ff9f0a,#ff375f)' }}>📁</span>
            <span className="ps-app" style={{ background: 'linear-gradient(135deg,#8b5cf6,#22d3ee)' }}>A</span>
          </div>
        </div>
      </div>
      <div className="setting-group">
        <div className="group-label">Design</div>
        <div className="setting-row">
          <span className="s-ic" style={{ background: 'linear-gradient(135deg,#a855f7,#22d3ee)' }}>✨</span>
          <div className="s-tx"><div className="s-t">Unified 3D glass design</div><div className="s-s">Glass + neon + iOS + minimal — one signature look</div></div>
          <span style={{ color: '#67e8f9' }}>ON</span>
        </div>
      </div>
      <div className="setting-group">
        <div className="group-label">Wallpaper</div>
        <div className="setting-row" style={{ flexWrap: 'wrap', paddingBottom: 16 }}>
          <div className="chip-row" style={{ width: '100%' }}>
            {[['aurora', 'Aurora'], ['neon', 'Neon'], ['minimal', 'Minimal'], ['dark', 'Dark'], ['sunset', 'Sunset'], ['ahad', 'Ahad']].map(([id, name]) => (
              <button key={id} className={`chip ${wallpaper === id ? 'sel' : ''}`} onClick={() => setWallpaper(id)}>
                <img src={requireWall(id)} alt={name} />
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="setting-group">
        <div className="group-label">Display</div>
        <div className="setting-row">
          <span className="s-ic" style={{ background: 'linear-gradient(135deg,#ffcc00,#ff9f0a)' }}>🔆</span>
          <div className="s-tx"><div className="s-t">Brightness</div></div>
          <input type="range" min="40" max="100" value={brightness} onChange={e => setBrightness(+e.target.value)}
            style={{ width: 130, accentColor: '#a855f7' }} />
        </div>
        <div className="setting-row" onClick={() => os.toggle('dnd')}>
          <span className="s-ic" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>🌙</span>
          <div className="s-tx"><div className="s-t">Do Not Disturb</div></div>
          <button className={`switch ${toggles.dnd ? 'on' : ''}`}></button>
        </div>
        <div className="setting-row" onClick={() => os.toggle('battery')}>
          <span className="s-ic" style={{ background: 'linear-gradient(135deg,#22c55e,#16a34a)' }}>🔋</span>
          <div className="s-tx"><div className="s-t">Battery Saver</div></div>
          <button className={`switch ${toggles.battery ? 'on' : ''}`}></button>
        </div>
      </div>
      <div className="setting-group">
        <div className="group-label">System</div>
        <div className="setting-row" onClick={() => os.launch('about')}>
          <span className="s-ic" style={{ background: 'linear-gradient(135deg,#8b5cf6,#06b6d4)' }}>ℹ️</span>
          <div className="s-tx"><div className="s-t">About AhadOs</div><div className="s-s">Version, device info</div></div>
          <span className="chev">›</span>
        </div>
        <div className="setting-row" onClick={() => {
          if (!resetArmed) { setResetArmed(true); setTimeout(() => setResetArmed(false), 2500); return; }
          localStorage.clear(); location.reload();
        }}>
          <span className="s-ic" style={{ background: 'linear-gradient(135deg,#ff3b30,#ff2d55)' }}>♻️</span>
          <div className="s-tx"><div className="s-t">{resetArmed ? 'Tap again to reset!' : 'Reset OS'}</div><div className="s-s">Restore factory settings</div></div>
          <span className="chev">›</span>
        </div>
      </div>
      <div style={{ textAlign: 'center', padding: '6px 0', color: 'var(--text-muted)', fontSize: 12 }}>AhadOs v2.0 · React + Three.js · built by Ahad 💜</div>
    </motion.div>
  );
}
const requireWall = (id) => `./assets/wallpapers/${{
  aurora: 'wall-aurora', neon: 'wall-neon', minimal: 'wall-minimal', dark: 'wall-dark', sunset: 'wall-sunset', ahad: 'wall-ahad'
}[id]}.jpg`;

/* ================= STORE ================= */
function StoreApp() {
  const { installed, install, toast, addNotif, launch } = useOS();
  const [busy, setBusy] = useState(null);
  return (
    <motion.div {...fade}>
      <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 700 }}>Featured apps</div>
      {STORE_APPS.map(a => {
        const isInst = installed.includes(a.id);
        return (
          <div className="card" key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <span className="app-icon" style={{ width: 52, height: 52, fontSize: 24, background: a.grad, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{a.emoji}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14.5 }}>{a.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{a.desc}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{isInst ? '✅ Installed' : '⭐ 4.8 · Free'}</div>
            </div>
            <button className={`btn ${isInst ? '' : 'pri'}`} style={{ padding: '9px 14px', fontSize: 12.5 }}
              disabled={busy === a.id}
              onClick={() => {
                if (isInst) { if (a.real) launch(a.id); else toast(`${a.name} opened`); return; }
                setBusy(a.id);
                setTimeout(() => {
                  install(a.id);
                  setBusy(null);
                  if (a.real) { toast(`${a.name} installed! 🎉`); addNotif({ app: 'store', title: 'Ahad Store', text: `${a.name} installed! Check your drawer.` }); }
                  else { toast(`${a.name} installed! 🎉`); addNotif({ app: 'store', title: 'Ahad Store', text: `${a.name} installed successfully!` }); }
                }, 700);
              }}>
              {busy === a.id ? '…' : isInst ? 'Open' : 'Get'}
            </button>
          </div>
        );
      })}
      <div className="empty-state">More apps coming soon 🚀</div>
    </motion.div>
  );
}

/* ================= WALLET ================= */
function WalletApp() {
  const { toast, addNotif } = useOS();
  const [balance, setBalance] = useState(WALLET.balance);
  const fmt = (n) => (n < 0 ? '-' : '+') + '৳' + Math.abs(n).toLocaleString();
  return (
    <motion.div {...fade}>
      <div className="card" style={{ background: 'linear-gradient(135deg,#7c3aed,#0891b2)', border: 'none', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -30, top: -30, fontSize: 110, opacity: 0.15 }}>৳</div>
        <div style={{ fontSize: 12.5, opacity: 0.85, fontWeight: 600, letterSpacing: '.05em' }}>AhadOs Wallet</div>
        <div style={{ fontSize: 34, fontWeight: 800, margin: '10px 0 2px', fontVariantNumeric: 'tabular-nums' }}>৳{balance.toLocaleString()}</div>
        <div style={{ fontSize: 12.5, opacity: 0.9 }}>{WALLET.name} · **** 4821</div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <button className="btn pri" style={{ flex: 1 }} onClick={() => {
          setBalance(b => b + 1000);
          addNotif({ app: 'wallet', title: 'Wallet', text: '৳1,000 added to your balance ✅' });
          toast('৳1,000 added');
        }}>+ Add money</button>
        <button className="btn" onClick={() => toast('Send money — coming in v2.1 🚀')}>Send</button>
      </div>
      <div className="card"><h3>Transactions</h3>
        {WALLET.transactions.map((t, i) => (
          <div className="list-row" key={i}>
            <span className="list-ic" style={{ background: 'var(--glass)', color: 'var(--text)', fontSize: 18 }}>{t.icon}</span>
            <div className="list-tx"><div className="list-t">{t.title}</div><div className="list-s">{t.time}</div></div>
            <div style={{ fontWeight: 700, fontSize: 14.5, color: t.amt > 0 ? '#34d399' : 'var(--text)' }}>{fmt(t.amt)}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ================= ABOUT ================= */
function AboutApp() {
  const { toast } = useOS();
  return (
    <motion.div {...fade}>
      <div className="about-hero">
        <div className="about-logo">A</div>
        <h2>AhadOs</h2>
        <p>Your phone, your rules.</p>
        <div className="ver-badge">Version 2.0.0 · React</div>
      </div>
      <div className="card"><h3>📱 Device</h3>
        <div className="list-row"><span className="list-ic" style={{ background: 'linear-gradient(135deg,#8b5cf6,#06b6d4)' }}>📟</span><div className="list-tx"><div className="list-t">AhadOS One</div><div className="list-s">Made for Ahad</div></div></div>
        <div className="list-row"><span className="list-ic" style={{ background: 'linear-gradient(135deg,#636366,#48484a)' }}>⚙️</span><div className="list-tx"><div className="list-t">AhadOS Engine v2</div><div className="list-s">React 19 · Three.js · Framer Motion</div></div></div>
        <div className="list-row"><span className="list-ic" style={{ background: 'linear-gradient(135deg,#a855f7,#22d3ee)' }}>✨</span><div className="list-tx"><div className="list-t">Unified design</div><div className="list-s">Glass + neon + iOS + minimal</div></div></div>
      </div>
      <div className="card"><h3>💜 Made by</h3>
        <p style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--text-muted)' }}>
          AhadOs is designed and built entirely by <b style={{ color: 'var(--text)' }}>Ahad</b> — the icons, the wallpapers, the 3D scene, the notification style, everything. Because the best OS is the one you make yourself. 😎
        </p>
        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          <button className="btn pri" style={{ flex: 1 }} onClick={() => {
            if (navigator.share) navigator.share({ title: 'AhadOs', text: 'Check out my own OS — AhadOs! 🚀', url: location.href }).catch(() => {});
            else { navigator.clipboard?.writeText(location.href); toast('Link copied 🔗'); }
          }}>Share AhadOs</button>
        </div>
      </div>
    </motion.div>
  );
}

/* ================= SNAKE ================= */
function SnakeApp() {
  const size = 15;
  const [snake, setSnake] = useState([{ x: 7, y: 7 }]);
  const [dir, setDir] = useState({ x: 1, y: 0 });
  const [food, setFood] = useState({ x: 10, y: 7 });
  const [score, setScore] = useState(0);
  const [dead, setDead] = useState(false);
  const [running, setRunning] = useState(false);
  const dirRef = useRef(dir);
  const { toast } = useOS();

  useEffect(() => {
    const onKey = (e) => {
      const k = e.key.toLowerCase();
      if (['arrowup', 'w'].includes(k)) setDirRef('u');
      if (['arrowdown', 's'].includes(k)) setDirRef('d');
      if (['arrowleft', 'a'].includes(k)) setDirRef('l');
      if (['arrowright', 'd'].includes(k)) setDirRef('r');
    };
    const setDirRef = (d) => {
      dirRef.current = d === 'u' ? (dirRef.current.y !== 1 ? { x: 0, y: -1 } : dirRef.current)
        : d === 'd' ? (dirRef.current.y !== -1 ? { x: 0, y: 1 } : dirRef.current)
        : d === 'l' ? (dirRef.current.x !== 1 ? { x: -1, y: 0 } : dirRef.current)
        : (dirRef.current.x !== -1 ? { x: 1, y: 0 } : dirRef.current);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!running) return;
    const int = setInterval(() => {
      setSnake(s => {
        const d = dirRef.current;
        const head = { x: s[0].x + d.x, y: s[0].y + d.y };
        if (head.x < 0 || head.y < 0 || head.x >= size || head.y >= size || s.some(p => p.x === head.x && p.y === head.y)) {
          setDead(true); setRunning(false);
          toast(`Game over — ${score} points 🐍`);
          return s;
        }
        const ns = [head, ...s];
        if (head.x === food.x && head.y === food.y) {
          setScore(sc => sc + 1);
          setFood(f => { let nf; do { nf = { x: Math.floor(Math.random() * size), y: Math.floor(Math.random() * size) }; } while (s.some(p => p.x === nf.x && p.y === nf.y)); return nf; });
        } else ns.pop();
        return ns;
      });
    }, 150);
    return () => clearInterval(int);
  }, [running]);

  const reset = () => { setSnake([{ x: 7, y: 7 }]); dirRef.current = { x: 1, y: 0 }; setFood({ x: 10, y: 7 }); setScore(0); setDead(false); setRunning(true); };
  return (
    <motion.div {...fade}>
      <div className="card" style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <b>🐍 Snake</b><span>Score: {score}</span>
        </div>
        <div className="snake-grid" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
          {Array.from({ length: size * size }).map((_, i) => {
            const x = i % size, y = Math.floor(i / size);
            const isSnake = snake.some(p => p.x === x && p.y === y);
            const isFood = food.x === x && food.y === y;
            return <div key={i} className="snake-cell" style={{ background: isFood ? '#ff3b30' : isSnake ? 'linear-gradient(135deg,#a855f7,#22d3ee)' : 'transparent', boxShadow: isSnake ? 'var(--glow)' : 'none' }} />;
          })}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'center' }}>
          <button className="btn pri" onClick={reset} disabled={running && !dead}>{dead ? 'Play again' : running ? 'Playing…' : 'Start'}</button>
        </div>
      </div>
    </motion.div>
  );
}

/* ================= 2048 ================= */
function Game2048App() {
  const create = () => Array.from({ length: 4 }, () => Array(4).fill(0));
  const [board, setBoard] = useState(() => { const b = create(); return b; });
  const [score, setScore] = useState(0);
  const colors = { 2: '#eee4da', 4: '#ede0c8', 8: '#f2b179', 16: '#f59563', 32: '#f67c5f', 64: '#f65e3b', 128: '#edcf72', 256: '#edcc61', 512: '#edc850', 1024: '#edc53f', 2048: '#edc22e' };
  const slide = (row) => {
    const nz = row.filter(v => v);
    for (let i = 0; i < nz.length - 1; i++) if (nz[i] === nz[i + 1]) { nz[i] *= 2; setScore(s => s + nz[i]); nz.splice(i + 1, 1); }
    while (nz.length < 4) nz.push(0);
    return nz;
  };
  const move = (d) => {
    setBoard(b => {
      let moved = false;
      const nb = b.map(r => r.slice());
      for (let i = 0; i < 4; i++) {
        let row = d === 'l' ? nb[i].slice() : d === 'r' ? nb[i].slice().reverse() : d === 'u' ? nb.map(r => r[i]) : nb.map(r => r[i]).reverse();
        const nrow = slide(row);
        if (JSON.stringify(nrow) !== JSON.stringify(row)) moved = true;
        if (d === 'l') nb[i] = nrow;
        else if (d === 'r') nb[i] = nrow.reverse();
        else if (d === 'u') nb.forEach((r, j) => r[i] = nrow[j]);
        else nb.forEach((r, j) => r[i] = nrow.reverse()[j]);
      }
      if (moved) {
        const empty = [];
        nb.forEach((r, y) => r.forEach((v, x) => { if (!v) empty.push([x, y]); }));
        if (empty.length) { const [x, y] = empty[Math.floor(Math.random() * empty.length)]; nb[y][x] = Math.random() < .9 ? 2 : 4; }
      }
      return nb;
    });
  };
  useEffect(() => {
    const onKey = (e) => {
      const k = e.key.toLowerCase();
      if (k === 'arrowup' || k === 'w') move('u');
      if (k === 'arrowdown' || k === 's') move('d');
      if (k === 'arrowleft' || k === 'a') move('l');
      if (k === 'arrowright' || k === 'd') move('r');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  return (
    <motion.div {...fade}>
      <div className="card" style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <b>🔢 2048</b><span>Score: {score}</span>
        </div>
        <div className="g2048-grid">
          {board.flat().map((v, i) => (
            <div key={i} className="g2048-cell" style={{
              background: colors[v] || 'rgba(255,255,255,.06)',
              color: v > 4 ? '#f9f6f2' : '#776e65',
              fontSize: v >= 1024 ? 18 : 24,
              boxShadow: v ? '0 0 14px rgba(168,85,247,.25)' : 'none'
            }}>{v || ''}</div>
          ))}
        </div>
        <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-muted)' }}>Swipe or use arrow keys</div>
      </div>
    </motion.div>
  );
}

/* ================= registry ================= */
const REG = {
  clock: ClockApp, calculator: CalcApp, notes: NotesApp, weather: WeatherApp,
  music: MusicApp, gallery: GalleryApp, photos: PhotosApp, camera: CameraApp, files: FilesApp,
  messages: MessagesApp, browser: BrowserApp, settings: SettingsApp, store: StoreApp,
  wallet: WalletApp, about: AboutApp, snake: SnakeApp, game2048: Game2048App,
};

export default function Apps({ id }) {
  const Comp = REG[id];
  if (!Comp) return <div className="empty-state">Coming soon ✨</div>;
  return <Comp />;
}
