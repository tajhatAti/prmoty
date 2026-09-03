/* ============================================================
   AhadOs — App views
   ============================================================ */

const AhadApps = {
  views: {},

  /* ================= CLOCK ================= */
  clock(body) {
    body.innerHTML = `
      <div class="card">
        <div class="clock-face">
          <div class="big clock-big">10:24</div>
          <div class="sub" id="clk-sec">--</div>
        </div>
      </div>
      <div class="card">
        <h3>⏰ Alarms</h3>
        <div id="alarm-list">
          <div class="alarm-row">
            <span class="al-time">7:00 AM</span>
            <div class="al-tx"><div class="al-label">Wake up ☀️</div><div class="al-days">Mon–Fri</div></div>
            <button class="switch on" data-alarm="7"></button>
          </div>
          <div class="alarm-row">
            <span class="al-time">10:30 PM</span>
            <div class="al-tx"><div class="al-label">Sleep 🌙</div><div class="al-days">Every day</div></div>
            <button class="switch on" data-alarm="22"></button>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>⏱️ Stopwatch</h3>
        <div class="clock-face" style="padding:8px 0 2px">
          <div class="big" id="sw-disp" style="font-size:52px">00:00.0</div>
        </div>
        <div style="display:flex;gap:10px;justify-content:center;margin-top:6px">
          <button class="btn pri" id="sw-start">Start</button>
          <button class="btn" id="sw-reset">Reset</button>
        </div>
      </div>`;
    // seconds ticker
    const tickSec = () => {
      const d = new Date();
      body.querySelector('#clk-sec').textContent = d.toLocaleTimeString('en-US', { hour12: false }) + ' · ' + d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };
    tickSec();
    const secInt = setInterval(tickSec, 1000);
    Ahad.cleanup.push(() => clearInterval(secInt));
    body.querySelectorAll('[data-alarm]').forEach(s => s.addEventListener('click', () => {
      s.classList.toggle('on');
      Ahad.toast(s.classList.contains('on') ? 'Alarm set' : 'Alarm off');
    }));
    // stopwatch
    let sw = { running: false, t: 0, int: null };
    const disp = body.querySelector('#sw-disp');
    const fmtSW = (ms) => {
      const m = Math.floor(ms / 60000), s = Math.floor((ms % 60000) / 1000), d = Math.floor((ms % 1000) / 100);
      return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${d}`;
    };
    body.querySelector('#sw-start').addEventListener('click', () => {
      if (!sw.running) {
        sw.running = true;
        const start = Date.now() - sw.t;
        sw.int = setInterval(() => { sw.t = Date.now() - start; disp.textContent = fmtSW(sw.t); }, 90);
        body.querySelector('#sw-start').textContent = 'Stop';
      } else {
        clearInterval(sw.int); sw.running = false;
        body.querySelector('#sw-start').textContent = 'Start';
      }
    });
    body.querySelector('#sw-reset').addEventListener('click', () => {
      clearInterval(sw.int); sw.running = false; sw.t = 0;
      disp.textContent = '00:00.0';
      body.querySelector('#sw-start').textContent = 'Start';
    });
    Ahad.cleanup.push(() => clearInterval(sw.int));
  },

  /* ================= CALCULATOR ================= */
  calculator(body) {
    body.innerHTML = `
      <div class="card" style="padding:10px 14px">
        <div class="calc-display">
          <div class="calc-expr" id="c-expr">&nbsp;</div>
          <div id="c-disp">0</div>
        </div>
        <div class="calc-grid" id="c-grid"></div>
      </div>`;
    const keys = [
      ['C', 'op'], ['(', 'op'], [')', 'op'], ['÷', 'op'],
      ['7', ''], ['8', ''], ['9', ''], ['×', 'op'],
      ['4', ''], ['5', ''], ['6', ''], ['−', 'op'],
      ['1', ''], ['2', ''], ['3', ''], ['+', 'op'],
      ['0', 'zero'], ['.', ''], ['⌫', 'op'], ['=', 'eq'],
    ];
    const grid = body.querySelector('#c-grid');
    grid.innerHTML = keys.map(([k, cls]) => `<button class="calc-btn ${cls}" data-k="${k}">${k}</button>`).join('');
    let expr = '';
    const disp = body.querySelector('#c-disp');
    const exprEl = body.querySelector('#c-expr');
    const norm = (s) => s.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
    grid.querySelectorAll('.calc-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const k = btn.dataset.k;
        if (k === 'C') { expr = ''; disp.textContent = '0'; exprEl.innerHTML = '&nbsp;'; return; }
        if (k === '⌫') { expr = expr.slice(0, -1); disp.textContent = expr || '0'; exprEl.innerHTML = '&nbsp;'; return; }
        if (k === '=') {
          try {
            const val = Function('"use strict";return (' + norm(expr) + ')')();
            exprEl.textContent = expr;
            disp.textContent = String(Math.round(val * 1e9) / 1e9);
            expr = String(Math.round(val * 1e9) / 1e9);
          } catch (e) { disp.textContent = 'Error'; expr = ''; }
          return;
        }
        expr += k === '÷' ? '÷' : k;
        disp.textContent = expr;
      });
    });
  },

  /* ================= NOTES ================= */
  notes(body) {
    const render = () => {
      body.innerHTML = `
        <div style="display:flex;gap:8px;margin-bottom:14px">
          <button class="btn pri" id="note-add" style="flex:1">+ New note</button>
        </div>
        <div id="note-list">${AhadData.notes.map(n => `
          <div class="note-item" data-id="${n.id}">
            <div class="n-title">${n.title}</div>
            <div class="n-text">${n.text}</div>
            <div class="n-time">${n.time}</div>
          </div>`).join('') || '<div class="empty-state">No notes yet</div>'}
        </div>`;
      body.querySelector('#note-add').addEventListener('click', () => {
        AhadData.notes.unshift({ id: Date.now(), title: 'New note', text: 'Tap to edit…', time: 'Just now' });
        render();
        const item = body.querySelector('[data-id]');
        if (item && item.scrollIntoView) item.scrollIntoView({ behavior: 'smooth' });
      });
      body.querySelectorAll('.note-item').forEach(el => {
        el.addEventListener('click', () => {
          const n = AhadData.notes.find(x => x.id == el.dataset.id);
          body.innerHTML = `
            <input class="input" id="note-title" value="${n.title}" style="font-size:18px;font-weight:700;margin-bottom:12px">
            <textarea class="input" id="note-text" rows="10" style="line-height:1.6">${n.text}</textarea>
            <div style="display:flex;gap:8px;margin-top:14px">
              <button class="btn pri" id="note-save" style="flex:1">Save</button>
              <button class="btn" id="note-del">Delete</button>
            </div>`;
          body.querySelector('#note-save').addEventListener('click', () => {
            n.title = body.querySelector('#note-title').value || 'Untitled';
            n.text = body.querySelector('#note-text').value;
            n.time = 'Just now';
            render();
            Ahad.toast('Note saved ✅');
          });
          body.querySelector('#note-del').addEventListener('click', () => {
            AhadData.notes = AhadData.notes.filter(x => x.id !== n.id);
            render();
            Ahad.toast('Note deleted');
          });
        });
      });
    };
    render();
  },

  /* ================= WEATHER ================= */
  weather(body) {
    const w = AhadData.weather;
    body.innerHTML = `
      <div class="card">
        <div class="weather-hero">
          <div style="font-size:52px">${w.emoji}</div>
          <div class="weather-temp">${w.temp}°</div>
          <div class="weather-desc">${w.desc} · ${w.city}, BD</div>
          <div style="font-size:13px;color:var(--text-muted);margin-top:4px">H:${w.hi}° L:${w.lo}°</div>
        </div>
      </div>
      <div class="card">
        <h3>6-day forecast</h3>
        <div class="weather-grid">${w.days.map(d => `
          <div class="w-day"><div class="d">${d.d}</div><div class="i">${d.i}</div><div class="t">${d.t}</div></div>`).join('')}
        </div>
      </div>
      <div class="card">
        <h3>Details</h3>
        <div class="weather-stats">
          <div class="wstat"><span class="i">🌡️</span><div><div class="t">Feels like</div><div class="v">${w.feel}°</div></div></div>
          <div class="wstat"><span class="i">💧</span><div><div class="t">Humidity</div><div class="v">${w.hum}%</div></div></div>
          <div class="wstat"><span class="i">💨</span><div><div class="t">Wind</div><div class="v">${w.wind}</div></div></div>
          <div class="wstat"><span class="i">🌧️</span><div><div class="t">Rain chance</div><div class="v">${w.rain}</div></div></div>
        </div>
      </div>`;
  },

  /* ================= MUSIC ================= */
  music(body) {
    const songs = AhadData.songs;
    let cur = 0, playing = false, prog = 0;
    body.innerHTML = `
      <div class="card" style="padding:14px">
        <div class="music-hero">
          <div class="music-art" id="m-art" style="background:${songs[0].grad}">${songs[0].emoji}</div>
          <div class="music-title" id="m-title">${songs[0].title}</div>
          <div class="music-artist" id="m-artist">${songs[0].artist}</div>
        </div>
        <input type="range" id="m-range" min="0" max="100" value="0" style="width:100%;accent-color:var(--accent)">
        <div class="music-times"><span id="m-cur">0:00</span><span id="m-dur">${songs[0].dur}</span></div>
        <div class="music-controls">
          <button class="mc" id="m-prev"><span class="ic"><svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><polygon points="19 20 9 12 19 4"/><rect x="5" y="4" width="2.5" height="16" rx="1"/></svg></span></button>
          <button class="mc main" id="m-play"><span class="ic" id="m-play-ic"><svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><polygon points="7 4 20 12 7 20"/></svg></span></button>
          <button class="mc" id="m-next"><span class="ic"><svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 4 15 12 5 20"/><rect x="16.5" y="4" width="2.5" height="16" rx="1"/></svg></span></button>
        </div>
      </div>
      <div class="card">
        <h3>Up next</h3>
        <div id="m-list">${songs.map((s, i) => `
          <div class="song-item ${i === cur ? 'playing' : ''}" data-i="${i}">
            <div class="s-art" style="background:${s.grad}">${s.emoji}</div>
            <div style="flex:1;min-width:0"><div class="s-t">${s.title}</div><div class="s-a">${s.artist} · ${s.dur}</div></div>
            ${i === cur && playing ? '<span class="eq"><i></i><i></i><i></i><i></i></span>' : ''}
          </div>`).join('')}
        </div>
      </div>`;

    const art = body.querySelector('#m-art'), ttl = body.querySelector('#m-title'),
          artEl = body.querySelector('#m-artist'), range = body.querySelector('#m-range'),
          curT = body.querySelector('#m-cur'), durT = body.querySelector('#m-dur'),
          playIc = body.querySelector('#m-play-ic');
    let tick = null;
    const load = (i) => {
      cur = i; const s = songs[i];
      art.style.background = s.grad; art.textContent = s.emoji;
      ttl.textContent = s.title; artEl.textContent = s.artist;
      durT.textContent = s.dur;
      prog = 0; range.value = 0; curT.textContent = '0:00';
      body.querySelectorAll('.song-item').forEach(el => {
        el.classList.toggle('playing', el.dataset.i == i);
        el.querySelector('.eq')?.remove();
      });
    };
    const play = () => {
      playing = true;
      playIc.innerHTML = '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>';
      const curItem = body.querySelector(`.song-item[data-i="${cur}"]`);
      if (curItem && !curItem.querySelector('.eq')) {
        curItem.insertAdjacentHTML('beforeend', '<span class="eq"><i></i><i></i><i></i><i></i></span>');
      }
      tick = setInterval(() => {
        prog = Math.min(100, prog + 1.2);
        range.value = prog;
        const secs = Math.round(prog / 100 * 253);
        curT.textContent = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
        if (prog >= 100) next();
      }, 1000);
    };
    const pause = () => {
      playing = false;
      clearInterval(tick);
      playIc.innerHTML = '<polygon points="7 4 20 12 7 20"/>';
      body.querySelectorAll('.eq').forEach(e => e.remove());
    };
    const next = () => { pause(); load((cur + 1) % songs.length); play(); };
    const prev = () => { pause(); load((cur - 1 + songs.length) % songs.length); play(); };

    body.querySelector('#m-play').addEventListener('click', () => playing ? pause() : play());
    body.querySelector('#m-next').addEventListener('click', next);
    body.querySelector('#m-prev').addEventListener('click', prev);
    range.addEventListener('input', () => { prog = +range.value; curT.textContent = '0:00'; });
    body.querySelectorAll('.song-item').forEach(el => {
      el.addEventListener('click', () => { const i = +el.dataset.i; if (i !== cur) { pause(); load(i); } play(); });
    });
    Ahad.cleanup.push(() => clearInterval(tick));
  },

  /* ================= GALLERY ================= */
  gallery(body) {
    const items = [
      { src: 'assets/wallpapers/photo-food.jpg', cap: 'Lunch today 🍛' },
      { src: 'assets/wallpapers/photo-travel.jpg', cap: "Cox's Bazar 🌊" },
      { src: 'assets/wallpapers/wall-sunset.jpg', cap: 'Sunset 🌅' },
      { src: 'assets/wallpapers/wall-neon.jpg', cap: 'Neon city 🌆' },
      { src: 'assets/wallpapers/wall-aurora.jpg', cap: 'Aurora ✨' },
      { src: 'assets/wallpapers/wall-ahad.jpg', cap: 'AhadOs 💜' },
    ];
    body.innerHTML = `
      <div class="gal-sep">Recents</div>
      <div class="gal-grid">${items.slice(0, 3).map((p, i) => `<img src="${p.src}" data-i="${i}" alt="">`).join('')}</div>
      <div class="gal-sep">All photos</div>
      <div class="gal-grid">${items.map((p, i) => `<img src="${p.src}" data-i="${i}" alt="">`).join('')}</div>`;
    body.querySelectorAll('.gal-grid img').forEach(img => {
      img.addEventListener('click', () => {
        const i = +img.dataset.i;
        const lb = document.createElement('div');
        lb.className = 'lightbox';
        lb.innerHTML = `<img src="${items[i].src}"><button class="lb-close">✕</button><div class="lb-cap">${items[i].cap}</div>`;
        lb.addEventListener('click', () => lb.remove());
        body.appendChild(lb);
      });
    });
  },

  /* ================= CAMERA ================= */
  camera(body) {
    body.innerHTML = `
      <div class="camera-app">
        <div class="cam-view">
          <div class="cam-hint">AhadOs Camera</div>
          <div class="cam-moon">🌙</div>
          <div>
            <div style="text-align:center;margin-bottom:16px">
              <div class="cam-mode" id="cam-mode">PHOTO</div>
            </div>
            <div class="cam-controls">
              <button class="cam-shutter" id="cam-shot"></button>
            </div>
          </div>
        </div>
      </div>`;
    body.querySelector('#cam-shot').addEventListener('click', () => {
      Ahad.flash();
      Ahad.vibrate(20);
      const mode = body.querySelector('#cam-mode').textContent;
      setTimeout(() => {
        Ahad.sendNotif('gallery', 'Camera', mode === 'PHOTO'
          ? 'Photo captured! Saved to Gallery 📸'
          : 'Video saved (4s) 🎬');
        Ahad.toast(mode === 'PHOTO' ? '📸 Photo captured' : '🎬 Video saved');
      }, 350);
    });
  },

  /* ================= FILES ================= */
  files(body) {
    let path = ['root'];
    const render = () => {
      const dir = path[path.length - 1];
      const list = AhadData.files[dir];
      const icon = (t) => ({ folder: '📁', image: '🖼️', text: '📄', audio: '🎵', video: '🎬', zip: '🗜️' }[t] || '📄');
      body.innerHTML = `
        <div class="files-path">📂 ${path.join(' / ')}</div>
        ${list.map(f => `
          <div class="file-row" data-f="${f.name}" data-t="${f.type}">
            <span class="f-ic">${icon(f.type)}</span>
            <div class="f-tx"><div class="f-t">${f.name}</div><div class="f-s">${f.size || 'Folder'}</div></div>
            ${f.type === 'image' ? '<span style="font-size:12px;color:var(--accent)">View</span>' : ''}
          </div>`).join('')}`;
      body.querySelectorAll('.file-row').forEach(el => {
        el.addEventListener('click', () => {
          const t = el.dataset.t;
          if (t === 'folder') {
            if (path[path.length - 1] === 'root') path = [el.dataset.f]; else path.push(el.dataset.f);
            render();
          } else if (t === 'image') {
            Ahad.toast('🖼️ Opening image…');
            const src = el.dataset.f === 'logo.png' ? 'assets/icons/icon-512.png'
              : el.dataset.f.includes('aurora') ? 'assets/wallpapers/wall-aurora.jpg'
              : el.dataset.f.includes('neon') ? 'assets/wallpapers/wall-neon.jpg'
              : 'assets/wallpapers/wall-minimal.jpg';
            setTimeout(() => {
              const lb = document.createElement('div');
              lb.className = 'lightbox';
              lb.innerHTML = `<img src="${src}"><button class="lb-close">✕</button><div class="lb-cap">${el.dataset.f}</div>`;
              lb.addEventListener('click', () => lb.remove());
              body.appendChild(lb);
            }, 250);
          } else if (t === 'audio') {
            Ahad.sendNotif('music', 'Music', `Now playing: ${el.dataset.f.replace('.mp3', '')} 🎵`);
          } else {
            Ahad.toast(`Opening ${el.dataset.f}…`);
          }
        });
      });
    };
    render();
  },

  /* ================= MESSAGES ================= */
  messages(body) {
    const chats = Object.entries(AhadData.chats);
    const listView = () => {
      body.innerHTML = `
        <div style="font-size:11.5px;color:var(--text-muted);margin-bottom:10px;text-transform:uppercase;letter-spacing:.06em;font-weight:700">Chats</div>
        ${chats.map(([id, c]) => `
          <div class="chat-list-item" data-c="${id}">
            <div class="chat-avatar" style="background:${c.grad}">${c.emoji}</div>
            <div style="min-width:0;flex:1">
              <div class="chat-name">${c.name}</div>
              <div class="chat-last">${c.msgs[c.msgs.length - 1].t}</div>
            </div>
            <div class="chat-time">now</div>
          </div>`).join('')}`;
      body.querySelectorAll('.chat-list-item').forEach(el => {
        el.addEventListener('click', () => threadView(el.dataset.c));
      });
    };
    const threadView = (id) => {
      const c = AhadData.chats[id];
      body.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
          <div class="chat-avatar" style="width:38px;height:38px;font-size:17px;background:${c.grad}">${c.emoji}</div>
          <div style="flex:1"><div class="chat-name">${c.name}</div><div style="font-size:11px;color:var(--text-muted)">online</div></div>
          <button class="btn" id="c-back" style="padding:8px 12px;font-size:12.5px">← Back</button>
        </div>
        <div class="chat-thread" id="c-thread">${c.msgs.map(m => `
          <div class="chat-row ${m.me ? 'me' : 'other'}"><div class="msg-bubble">${m.t}</div></div>`).join('')}</div>
        <div class="chat-input-row">
          <input class="input" id="c-in" placeholder="Message…" autocomplete="off">
          <button class="btn pri" id="c-send">➤</button>
        </div>`;
      body.querySelector('#c-back').addEventListener('click', listView);
      const thread = body.querySelector('#c-thread');
      thread.scrollTop = thread.scrollHeight;
      const send = () => {
        const inp = body.querySelector('#c-in');
        const v = inp.value.trim();
        if (!v) return;
        c.msgs.push({ me: true, t: v });
        inp.value = '';
        thread.insertAdjacentHTML('beforeend', `<div class="chat-row me"><div class="msg-bubble">${AhadApps.esc(v)}</div></div>`);
        thread.scrollTop = thread.scrollHeight;
        const typing = document.createElement('div');
        typing.className = 'chat-row other';
        typing.innerHTML = `<div class="msg-bubble typing-dot"><i></i><i></i><i></i></div>`;
        thread.appendChild(typing);
        thread.scrollTop = thread.scrollHeight;
        const replies = ['Wow! 😍', 'Nice, tell me more!', 'Bhalo kotha 🫡', 'Screenshot niye rakhlam!', 'Aha! Darun 🔥', 'Hmm, interesting…'];
        setTimeout(() => {
          typing.remove();
          const reply = replies[Math.floor(Math.random() * replies.length)];
          c.msgs.push({ me: false, t: reply });
          thread.insertAdjacentHTML('beforeend', `<div class="chat-row other"><div class="msg-bubble">${reply}</div></div>`);
          thread.scrollTop = thread.scrollHeight;
        }, 1400 + Math.random() * 900);
      };
      body.querySelector('#c-send').addEventListener('click', send);
      body.querySelector('#c-in').addEventListener('keydown', e => { if (e.key === 'Enter') send(); });
      setTimeout(() => { const inp = body.querySelector('#c-in'); if (inp) inp.focus(); }, 300);
    };
    listView();
  },

  /* ================= BROWSER ================= */
  browser(body) {
    const pages = {
      home: {
        title: 'AhadOs Search',
        html: `
          <h1 style="text-align:center;font-size:24px;margin:30px 0 6px">🔎 AhadOs Search</h1>
          <p style="text-align:center;color:var(--text-muted);margin-bottom:20px">Search the web (simulated)</p>
          <div class="browser-bar" style="margin-bottom:26px">
            <input id="b-q" placeholder="Type something…" autocomplete="off">
            <button class="btn pri" id="b-go" style="padding:9px 14px">Go</button>
          </div>
          <div class="card" style="cursor:pointer" data-page="ahad">
            <div style="display:flex;align-items:center;gap:12px">
              <span class="app-icon" style="background:linear-gradient(135deg,#8b5cf6,#06b6d4);font-family:var(--font-display);font-weight:800;color:#fff;font-size:22px;width:46px;height:46px">A</span>
              <div><div style="font-weight:700">AhadOs — your own OS</div>
              <div style="font-size:12.5px;color:var(--text-muted)">Apps · icons · wallpapers · notifications</div></div>
            </div>
          </div>
          <div class="card" data-page="wiki">
            <div style="display:flex;align-items:center;gap:12px">
              <span style="font-size:26px">🇧🇩</span>
              <div><div style="font-weight:700">Bangladesh</div>
              <div style="font-size:12.5px;color:var(--text-muted)">A beautiful country of rivers &amp; green</div></div>
            </div>
          </div>`,
      },
      ahad: {
        title: 'AhadOs — Wikipedia',
        html: `
          <h1>AhadOs</h1>
          <p>AhadOs is a custom mobile operating system designed entirely by <b>Ahad</b> — with its own app icons, wallpapers, notification style, themes and app launcher. It runs right inside the browser and can be installed on any phone as a PWA.</p>
          <h2>Features</h2>
          <p>✅ 4 unique themes — Minimal, iOS, Neon &amp; custom light/dark modes.<br>✅ Hand-crafted app icons for every app.<br>✅ Notification shade with quick settings toggles.<br>✅ Built-in apps: Clock, Calculator, Notes, Weather, Music, Gallery, Files, Chat, Browser &amp; more.<br>✅ Ahad Store to install new apps.<br>✅ Wallpaper gallery with 6 exclusive wallpapers.</p>
          <h2>History</h2>
          <p>The first version of AhadOs was launched on <b>August 31, 2026</b> — built by one person, for one person: its creator.</p>`,
      },
      wiki: {
        title: 'Bangladesh — Wikipedia',
        html: `
          <h1>Bangladesh 🇧🇩</h1>
          <p>Bangladesh is a South Asian country, home to lush green landscapes and the largest river delta in the world, formed by the Ganges, Brahmaputra and Meghna rivers.</p>
          <h2>Capital</h2>
          <p><b>Dhaka</b> — one of the most densely populated cities in the world, famous for rickshaws, biryani and its vibrant startup scene.</p>
          <h2>Culture</h2>
          <p>Known for the Bengali language movement, Pohela Boishakh, and world-famous textiles. The national language is Bengali (বাংলা), and the country is often called the "Land of Rivers".</p>
          <h2>Tech</h2>
          <p>Bangladesh has a rapidly growing tech sector — freelancing, mobile apps and software exports are booming, with thousands of young developers building products for the world.</p>`,
      },
    };
    let q = '';
    const renderSearch = () => {
      body.innerHTML = `
        <div class="browser-bar">
          <input id="b-q" value="${q}" autocomplete="off">
          <button class="btn pri" id="b-go" style="padding:9px 14px">Go</button>
        </div>
        <div class="browser-page">
          <h2 style="font-size:16px">Results for “${AhadApps.esc(q)}”</h2>
          <div class="card" style="margin-top:12px"><b>AhadOs</b> — your own phone OS with custom icons, wallpapers &amp; notifications.</div>
          <div class="card"><b>Bangladesh</b> — land of rivers, Dhaka.</div>
          <div class="card"><b>Fun fact</b> — you just searched "${AhadApps.esc(q)}" on your own OS! 😄</div>
        </div>`;
      body.querySelector('#b-go').addEventListener('click', () => {
        const v = body.querySelector('#b-q').value.trim();
        if (v) { q = v; renderSearch(); }
      });
      body.querySelector('#b-q').addEventListener('keydown', e => {
        if (e.key === 'Enter') body.querySelector('#b-go').click();
      });
      body.querySelector('#b-q').focus();
    };
    const render = (key) => {
      if (key === 'search') return renderSearch();
      const p = pages[key] || pages.home;
      body.innerHTML = `
        <div class="browser-bar">
          <input id="b-q" placeholder="Search or type URL…" value="${q}" autocomplete="off">
          <button class="btn pri" id="b-go" style="padding:9px 14px">Go</button>
        </div>
        <div class="browser-page">${p.html}</div>`;
      body.querySelector('#b-go').addEventListener('click', () => {
        const v = body.querySelector('#b-q').value.trim();
        if (!v) return;
        q = v;
        render('search');
      });
      body.querySelector('#b-q').addEventListener('keydown', e => {
        if (e.key === 'Enter') body.querySelector('#b-go').click();
      });
      body.querySelectorAll('[data-page]').forEach(el => {
        el.addEventListener('click', () => { q = ''; render(el.dataset.page); });
      });
      body.querySelector('#b-q').focus();
    };
    render('home');
  },

  /* ================= SETTINGS ================= */
  settings(body) {
    const st = Ahad.state;
    const wall = AhadData.wallpapers.find(w => w.id === st.wallpaper);
    const wpPrev = (id) => {
      const w = AhadData.wallpapers.find(x => x.id === id);
      return `<img src="${w.src}" alt="">`;
    };
    const render = () => {
      body.innerHTML = `
        <!-- Live preview -->
        <div class="preview-card">
          <div class="preview-screen">
            ${wpPrev(st.wallpaper)}
            <div class="ps-ui"></div>
            <div class="ps-time">10:24</div>
            <div class="ps-icons" style="bottom:auto;top:66px;right:12px;left:auto;display:flex;gap:6px">
              <span style="width:22px;height:22px;border-radius:7px;background:linear-gradient(135deg,#8b5cf6,#06b6d4);font-size:11px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800">A</span>
            </div>
            <div class="ps-icons">
              <span class="ps-app" style="background:linear-gradient(135deg,#0a84ff,#64d2ff)">🕐</span>
              <span class="ps-app" style="background:linear-gradient(135deg,#34c759,#30b0c7)">💬</span>
              <span class="ps-app" style="background:linear-gradient(135deg,#ff9f0a,#ff375f)">📁</span>
              <span class="ps-app" style="background:linear-gradient(135deg,#8e8e93,#636366)">⚙️</span>
            </div>
          </div>
        </div>

        <div class="setting-group">
          <div class="group-label">Theme style</div>
          <div class="setting-row">
            <span class="s-ic" style="background:linear-gradient(135deg,#f59e0b,#ef4444)">🎨</span>
            <div class="s-tx"><div class="s-t">Theme look</div><div class="s-s">4 styles to choose from</div></div>
            <div class="seg" style="width:230px" id="theme-seg">
              <button data-t="ahad" class="${st.theme === 'ahad' ? 'on' : ''}">Ahad</button>
              <button data-t="ios" class="${st.theme === 'ios' ? 'on' : ''}">iOS</button>
              <button data-t="minimal" class="${st.theme === 'minimal' ? 'on' : ''}">Minimal</button>
              <button data-t="neon" class="${st.theme === 'neon' ? 'on' : ''}">Neon</button>
            </div>
          </div>
          <div class="setting-row">
            <span class="s-ic" style="background:linear-gradient(135deg,#636366,#48484a)">🌗</span>
            <div class="s-tx"><div class="s-t">Dark mode</div><div class="s-s">${st.theme === 'neon' ? 'Neon is always dark' : 'Switch light / dark'}</div></div>
            <button class="switch ${st.mode === 'dark' ? 'on' : ''}" id="mode-sw" ${st.theme === 'neon' ? 'style="opacity:.4;pointer-events:none"' : ''}></button>
          </div>
        </div>

        <div class="setting-group">
          <div class="group-label">Wallpaper</div>
          <div class="setting-row" style="flex-wrap:wrap;padding-bottom:16px">
            <div class="chip-row" style="width:100%">
              ${AhadData.wallpapers.map(w => `<button class="chip ${w.id === st.wallpaper ? 'sel' : ''}" data-wp="${w.id}"><img src="${w.src}" alt=""></button>`).join('')}
            </div>
          </div>
        </div>

        <div class="setting-group">
          <div class="group-label">Display & sound</div>
          <div class="setting-row">
            <span class="s-ic" style="background:linear-gradient(135deg,#ffcc00,#ff9f0a)">🔆</span>
            <div class="s-tx"><div class="s-t">Brightness</div></div>
            <input type="range" id="bright" min="40" max="100" value="${st.brightness}" style="width:130px;accent-color:var(--accent)">
          </div>
          <div class="setting-row">
            <span class="s-ic" style="background:linear-gradient(135deg,#ff375f,#bf5af2)">🔔</span>
            <div class="s-tx"><div class="s-t">Sounds</div></div>
            <button class="switch ${st.sound ? 'on' : ''}" id="snd-sw"></button>
          </div>
          <div class="setting-row">
            <span class="s-ic" style="background:linear-gradient(135deg,#30b0c7,#0a84ff)">📳</span>
            <div class="s-tx"><div class="s-t">Vibration</div></div>
            <button class="switch ${st.vibration ? 'on' : ''}" id="vib-sw"></button>
          </div>
        </div>

        <div class="setting-group">
          <div class="group-label">System</div>
          <div class="setting-row" id="row-about">
            <span class="s-ic" style="background:linear-gradient(135deg,#8b5cf6,#06b6d4)">ℹ️</span>
            <div class="s-tx"><div class="s-t">About AhadOs</div><div class="s-s">Version, device info</div></div>
            <span class="chev">›</span>
          </div>
          <div class="setting-row" id="row-reset">
            <span class="s-ic" style="background:linear-gradient(135deg,#ff3b30,#ff2d55)">♻️</span>
            <div class="s-tx"><div class="s-t">Reset OS</div><div class="s-s">Restore factory settings</div></div>
            <span class="chev">›</span>
          </div>
        </div>

        <div class="setting-group" style="border:none;background:none">
          <div class="group-label" style="text-align:center;padding:6px 0">AhadOs v1.0 · built by Ahad 💜</div>
        </div>`;

      // Theme segment
      body.querySelectorAll('#theme-seg button').forEach(b => {
        b.addEventListener('click', () => {
          Ahad.setTheme(b.dataset.t);
          body.querySelectorAll('#theme-seg button').forEach(x => x.classList.toggle('on', x === b));
          const sw = body.querySelector('#mode-sw');
          if (Ahad.state.theme === 'neon') { sw.style.opacity = '.4'; sw.style.pointerEvents = 'none'; sw.classList.add('on'); }
          else { sw.style.opacity = ''; sw.style.pointerEvents = ''; sw.classList.toggle('on', Ahad.state.mode === 'dark'); }
          render(); // re-render preview
          Ahad.toast(`Theme: ${Ahad.state.theme[0].toUpperCase() + Ahad.state.theme.slice(1)}`);
        });
      });
      // Mode switch
      const modeSw = body.querySelector('#mode-sw');
      if (modeSw) modeSw.addEventListener('click', () => {
        const dark = !(Ahad.state.mode === 'dark');
        Ahad.setMode(dark ? 'dark' : 'light');
        modeSw.classList.toggle('on', dark);
        render();
      });
      // Wallpaper chips
      body.querySelectorAll('[data-wp]').forEach(c => {
        c.addEventListener('click', () => {
          Ahad.setWallpaper(c.dataset.wp);
          body.querySelectorAll('[data-wp]').forEach(x => x.classList.toggle('sel', x === c));
          render();
          Ahad.toast('Wallpaper changed ✨');
        });
      });
      // Brightness
      body.querySelector('#bright').addEventListener('input', (e) => {
        st.brightness = +e.target.value;
        Ahad.$('#wallpaper').style.filter = Ahad.state.wallpaperBlur ? `brightness(${st.brightness / 100}) blur(14px)` : `brightness(${st.brightness / 100})`;
        Ahad.savePrefs();
      });
      // Sound
      body.querySelector('#snd-sw').addEventListener('click', function () {
        st.sound = !st.sound; this.classList.toggle('on', st.sound);
        Ahad.savePrefs();
        if (st.sound) { Ahad.toast('Sound on 🔔'); Ahad.flash(); }
        else Ahad.toast('Sound off');
      });
      // Vibration
      body.querySelector('#vib-sw').addEventListener('click', function () {
        st.vibration = !st.vibration; this.classList.toggle('on', st.vibration);
        Ahad.savePrefs();
        Ahad.toast(st.vibration ? 'Vibration on 📳' : 'Vibration off');
      });
      // About
      body.querySelector('#row-about').addEventListener('click', () => Ahad.launch('about'));
      // Reset (inline confirm — avoids blocked browser dialogs)
      const rowReset = body.querySelector('#row-reset');
      rowReset.addEventListener('click', () => {
        if (!rowReset.dataset.confirm) {
          rowReset.dataset.confirm = '1';
          rowReset.querySelector('.s-t').textContent = 'Tap again to reset!';
          setTimeout(() => { delete rowReset.dataset.confirm; rowReset.querySelector('.s-t').textContent = 'Reset OS'; }, 2500);
          return;
        }
        localStorage.removeItem('ahados.prefs');
        localStorage.removeItem('ahados.installed');
        localStorage.removeItem('ahados.welcome');
        Ahad.toast('Resetting…');
        setTimeout(() => location.reload(), 900);
      });
    };
    render();
  },

  /* ================= STORE ================= */
  store(body) {
    const render = () => {
      body.innerHTML = `
        <div style="font-size:11.5px;color:var(--text-muted);margin-bottom:10px;text-transform:uppercase;letter-spacing:.06em;font-weight:700">Featured apps</div>
        ${AhadData.storeApps.map(a => `
          <div class="card" style="display:flex;align-items:center;gap:12px;margin-bottom:10px">
            <span class="app-icon" style="width:52px;height:52px;font-size:24px;background:${a.grad};flex-shrink:0">${a.emoji}</span>
            <div style="flex:1;min-width:0">
              <div style="font-weight:700;font-size:14.5px">${a.name}</div>
              <div style="font-size:12px;color:var(--text-muted)">${a.desc}</div>
              <div style="font-size:11px;color:var(--text-muted);margin-top:2px">${a.installed ? '✅ Installed' : '⭐ 4.8 · Free'}</div>
            </div>
            <button class="btn ${a.installed ? '' : 'pri'}" data-store="${a.id}" style="padding:9px 14px;font-size:12.5px">${a.installed ? 'Open' : 'Get'}</button>
          </div>`).join('')}
        <div class="empty-state">More apps coming soon 🚀</div>`;

      body.querySelectorAll('[data-store]').forEach(b => {
        b.addEventListener('click', () => {
          const a = AhadData.storeApps.find(x => x.id === b.dataset.store);
          if (a.installed) {
            if (a.id === 'chatgpt-clone') { Ahad.toast('Ahad AI — your assistant is everywhere 🧠'); }
            else Ahad.toast(`${a.name} opened`);
          } else {
            b.textContent = '…';
            Ahad.vibrate(10);
            setTimeout(() => {
              a.installed = true;
              if (a.id === 'game-snake') {
                // installs a playable game into the OS
                AhadData.apps.push({ id: 'snake', name: 'Snake', page: true });
                Ahad.state.installed.push('snake');
                localStorage.setItem('ahados.installed', JSON.stringify(Ahad.state.installed));
                Ahad.renderHome(); Ahad.renderDrawer();
                Ahad.confetti();
                Ahad.sendNotif('store', 'Ahad Store', 'Snake installed! 🐍 Find it in your app drawer.');
                render();
              } else if (a.id === 'game-2048') {
                AhadData.apps.push({ id: 'game2048', name: '2048', page: true });
                Ahad.state.installed.push('game2048');
                localStorage.setItem('ahados.installed', JSON.stringify(Ahad.state.installed));
                Ahad.renderHome(); Ahad.renderDrawer();
                Ahad.confetti();
                Ahad.sendNotif('store', 'Ahad Store', '2048 installed! 🔢 Check your drawer.');
                render();
              } else {
                Ahad.confetti();
                Ahad.toast(`${a.name} installed! 🎉`);
                Ahad.sendNotif('store', 'Ahad Store', `${a.name} installed successfully!`);
                render();
              }
            }, 800);
          }
        });
      });
    };
    render();
  },

  /* ================= WALLET ================= */
  wallet(body) {
    const w = AhadData.wallet;
    const fmt = (n) => (n < 0 ? '-' : '+') + w.currency + Math.abs(n).toLocaleString();
    body.innerHTML = `
      <div class="card" style="background:linear-gradient(135deg,#8b5cf6,#06b6d4);border:none;color:#fff;position:relative;overflow:hidden">
        <div style="position:absolute;right:-30px;top:-30px;font-size:110px;opacity:.15">৳</div>
        <div style="font-size:12.5px;opacity:.85;font-weight:600;letter-spacing:.05em">AhadOs Wallet</div>
        <div style="font-size:34px;font-weight:800;margin:10px 0 2px;font-variant-numeric:tabular-nums">${w.currency}${w.balance.toLocaleString()}</div>
        <div style="font-size:12.5px;opacity:.9">${w.name} · **** 4821</div>
      </div>
      <div style="display:flex;gap:8px;margin-bottom:14px">
        <button class="btn pri" id="w-add" style="flex:1">+ Add money</button>
        <button class="btn" id="w-send">Send</button>
      </div>
      <div class="card">
        <h3>Transactions</h3>
        ${w.transactions.map(t => `
          <div class="list-row">
            <span class="list-ic" style="background:var(--surface-3);color:var(--text);font-size:18px">${t.icon}</span>
            <div class="list-tx"><div class="list-t">${t.title}</div><div class="list-s">${t.time}</div></div>
            <div style="font-weight:700;font-size:14.5px;color:${t.amt > 0 ? 'var(--accent-2)' : 'var(--text)'}">${fmt(t.amt)}</div>
          </div>`).join('')}
      </div>`;
    body.querySelector('#w-add').addEventListener('click', () => {
      Ahad.sendNotif('wallet', 'Wallet', '৳1,000 added to your balance ✅');
      AhadData.wallet.balance += 1000;
      body.querySelector('.card .card')?.remove();
      Ahad.toast('৳1,000 added');
      Ahad.confetti();
      setTimeout(() => Ahad.launch('wallet'), 600);
    });
    body.querySelector('#w-send').addEventListener('click', () => {
      Ahad.toast('Send money — coming in v1.1 🚀');
    });
  },

  /* ================= THEME CENTER ================= */
  themecenter(body) {
    const themes = [
      { id: 'ahad', name: 'Ahad', desc: 'Monochrome, signature look', emoji: '◐', grad: 'linear-gradient(135deg,#3a3a3c,#e8e8ea)' },
      { id: 'ios', name: 'iOS', desc: 'Frosted glass, rounded icons', emoji: '🍎', grad: 'linear-gradient(135deg,#0a84ff,#64d2ff)' },
      { id: 'minimal', name: 'Minimal', desc: 'Warm flat & clean', emoji: '🎨', grad: 'linear-gradient(135deg,#d95d39,#f2cc8f)' },
      { id: 'neon', name: 'Neon', desc: 'Cyberpunk glow', emoji: '⚡', grad: 'linear-gradient(135deg,#a855f7,#22d3ee)' },
    ];
    const render = () => {
      body.innerHTML = `
        <div style="font-size:11.5px;color:var(--text-muted);margin-bottom:10px;text-transform:uppercase;letter-spacing:.06em;font-weight:700">Pick your look</div>
        ${themes.map(t => `
          <div class="card" style="display:flex;align-items:center;gap:14px;cursor:pointer" data-theme-pick="${t.id}">
            <span class="app-icon" style="width:54px;height:54px;font-size:26px;background:${t.grad};flex-shrink:0">${t.emoji}</span>
            <div style="flex:1"><div style="font-weight:800;font-size:15px">${t.name}</div>
            <div style="font-size:12.5px;color:var(--text-muted)">${t.desc}</div></div>
            ${Ahad.state.theme === t.id ? '<span style="color:var(--accent);font-size:20px">●</span>' : '<button class="btn pri" style="padding:8px 14px;font-size:12.5px">Apply</button>'}
          </div>`).join('')}
        <div class="card" style="display:flex;align-items:center;gap:14px">
          <span class="app-icon" style="width:54px;height:54px;font-size:26px;background:linear-gradient(135deg,#111,#444);flex-shrink:0">🌗</span>
          <div style="flex:1"><div style="font-weight:800;font-size:15px">Light / Dark</div>
          <div style="font-size:12.5px;color:var(--text-muted)">Quick mode switch</div></div>
          <button class="switch ${Ahad.state.mode === 'dark' ? 'on' : ''}" id="tc-mode"></button>
        </div>`;
      body.querySelectorAll('[data-theme-pick]').forEach(el => {
        el.addEventListener('click', () => {
          Ahad.setTheme(el.dataset.themePick);
          Ahad.toast(`${el.dataset.themePick[0].toUpperCase() + el.dataset.themePick.slice(1)} theme applied ✨`);
          render();
        });
      });
      const msw = body.querySelector('#tc-mode');
      if (msw) msw.addEventListener('click', () => {
        if (Ahad.state.theme === 'neon') { Ahad.toast('Neon is always dark ⚡'); return; }
        Ahad.setMode(Ahad.state.mode === 'dark' ? 'light' : 'dark');
        msw.classList.toggle('on', Ahad.state.mode === 'dark');
        render();
      });
    };
    render();
  },

  /* ================= ABOUT ================= */
  about(body) {
    body.innerHTML = `
      <div class="about-hero">
        <div class="about-logo">A</div>
        <h2>AhadOs</h2>
        <p>Your phone, your rules.</p>
        <div class="ver-badge">Version 1.0.0</div>
      </div>
      <div class="card">
        <h3>📱 Device</h3>
        <div class="list-row"><span class="list-ic" style="background:linear-gradient(135deg,#8b5cf6,#06b6d4)">📟</span><div class="list-tx"><div class="list-t">AhadOS One</div><div class="list-s">Made for Ahad</div></div></div>
        <div class="list-row"><span class="list-ic" style="background:linear-gradient(135deg,#636366,#48484a)">⚙️</span><div class="list-tx"><div class="list-t">AhadOS Kernel v1.0</div><div class="list-s">HTML · CSS · JavaScript</div></div></div>
        <div class="list-row"><span class="list-ic" style="background:linear-gradient(135deg,#ff9f0a,#ff375f)">🎨</span><div class="list-tx"><div class="list-t">4 themes</div><div class="list-s">iOS · Minimal · Neon · Light/Dark</div></div></div>
        <div class="list-row"><span class="list-ic" style="background:linear-gradient(135deg,#34c759,#30b0c7)">🖼️</span><div class="list-tx"><div class="list-t">6 wallpapers</div><div class="list-s">All designed for AhadOs</div></div></div>
      </div>
      <div class="card">
        <h3>💜 Made by</h3>
        <p style="font-size:13.5px;line-height:1.6;color:var(--text-muted)">
          AhadOs is designed and built entirely by <b style="color:var(--text)">Ahad</b> — the icons, the wallpapers, the notification style, the themes, everything. Because the best OS is the one you make yourself. 😎
        </p>
        <div style="display:flex;gap:8px;margin-top:14px">
          <button class="btn pri" id="ab-share" style="flex:1">Share AhadOs</button>
          <button class="btn" id="ab-install">Install</button>
        </div>
      </div>`;
    body.querySelector('#ab-share').addEventListener('click', () => {
      if (navigator.share) {
        navigator.share({ title: 'AhadOs', text: 'Check out my own OS — AhadOs! 🚀', url: location.href }).catch(() => {});
      } else {
        navigator.clipboard?.writeText(location.href);
        Ahad.toast('Link copied 🔗');
      }
    });
    body.querySelector('#ab-install').addEventListener('click', () => {
      if (window.__pwaPrompt) {
        window.__pwaPrompt.prompt();
        window.__pwaPrompt.userChoice.then(() => Ahad.toast('Installing AhadOs… 📲'));
      } else {
        Ahad.toast('Open in browser → Add to Home Screen 📲');
      }
    });
  },

  /* ================= SNAKE (store install) ================= */
  snake(body) {
    const size = 15;
    let snake = [{ x: 7, y: 7 }], dir = { x: 1, y: 0 }, food = { x: 10, y: 7 }, score = 0, dead = false, int = null;
    const grid = Array.from({ length: size }, () => Array(size).fill(0));
    body.innerHTML = `
      <div class="card" style="text-align:center">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
          <b>🐍 Snake</b><span id="sn-score">Score: 0</span>
        </div>
        <div id="sn-board" style="display:grid;grid-template-columns:repeat(${size},1fr);gap:2px;background:var(--surface-3);padding:8px;border-radius:14px"></div>
        <div style="display:flex;gap:8px;margin-top:12px;justify-content:center">
          <button class="btn pri" id="sn-start">Start</button>
          <button class="btn" id="sn-reset">Reset</button>
        </div>
      </div>`;
    const board = body.querySelector('#sn-board');
    const draw = () => {
      board.innerHTML = '';
      for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
        const c = document.createElement('div');
        c.style.aspectRatio = '1';
        c.style.borderRadius = '4px';
        if (snake.some(s => s.x === x && s.y === y)) c.style.background = 'var(--accent)';
        else if (food.x === x && food.y === y) c.style.background = '#ff3b30';
        else c.style.background = 'transparent';
        board.appendChild(c);
      }
      body.querySelector('#sn-score').textContent = `Score: ${score}`;
    };
    const spawnFood = () => {
      do { food = { x: Math.floor(Math.random() * size), y: Math.floor(Math.random() * size) }; }
      while (snake.some(s => s.x === food.x && s.y === food.y));
    };
    const step = () => {
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
      if (head.x < 0 || head.y < 0 || head.x >= size || head.y >= size || snake.some(s => s.x === head.x && s.y === head.y)) {
        dead = true; clearInterval(int);
        Ahad.sendNotif('store', 'Snake', `Game over! Final score: ${score} 🐍`);
        Ahad.toast(`Game over — ${score} points`);
        return;
      }
      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) { score++; spawnFood(); }
      else snake.pop();
      draw();
    };
    body.querySelector('#sn-start').addEventListener('click', function () {
      if (dead) { snake = [{ x: 7, y: 7 }]; dir = { x: 1, y: 0 }; score = 0; dead = false; spawnFood(); }
      if (int) clearInterval(int);
      int = setInterval(step, 160);
      this.textContent = 'Playing…';
    });
    body.querySelector('#sn-reset').addEventListener('click', () => {
      clearInterval(int); int = null;
      snake = [{ x: 7, y: 7 }]; dir = { x: 1, y: 0 }; score = 0; dead = false; spawnFood();
      body.querySelector('#sn-start').textContent = 'Start';
      draw();
    });
    window.addEventListener('keydown', (e) => {
      if (Ahad.state.appOpen !== 'snake') return;
      const k = e.key.toLowerCase();
      if (k === 'arrowup' || k === 'w') if (dir.y !== 1) dir = { x: 0, y: -1 };
      if (k === 'arrowdown' || k === 's') if (dir.y !== -1) dir = { x: 0, y: 1 };
      if (k === 'arrowleft' || k === 'a') if (dir.x !== 1) dir = { x: -1, y: 0 };
      if (k === 'arrowright' || k === 'd') if (dir.x !== -1) dir = { x: 1, y: 0 };
    });
    // swipe controls
    let t0 = null;
    body.addEventListener('touchstart', e => { t0 = e.touches[0]; }, { passive: true });
    body.addEventListener('touchend', e => {
      if (!t0) return;
      const dx = e.changedTouches[0].clientX - t0.clientX;
      const dy = e.changedTouches[0].clientY - t0.clientY;
      t0 = null;
      if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;
      if (Math.abs(dx) > Math.abs(dy)) dir = dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 };
      else dir = dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 };
    }, { passive: true });
    draw();
    Ahad.cleanup.push(() => clearInterval(int));
  },

  /* ================= 2048 (store install) ================= */
  game2048(body) {
    let board = [], score = 0, int = null;
    const newBoard = () => Array.from({ length: 4 }, () => Array(4).fill(0));
    const addTile = () => {
      const empty = [];
      board.forEach((r, y) => r.forEach((v, x) => { if (!v) empty.push([x, y]); }));
      if (!empty.length) return;
      const [x, y] = empty[Math.floor(Math.random() * empty.length)];
      board[y][x] = Math.random() < .9 ? 2 : 4;
    };
    const slide = (row) => {
      const nz = row.filter(v => v);
      for (let i = 0; i < nz.length - 1; i++) {
        if (nz[i] === nz[i + 1]) { nz[i] *= 2; score += nz[i]; nz.splice(i + 1, 1); }
      }
      while (nz.length < 4) nz.push(0);
      return nz;
    };
    const move = (dir) => {
      let moved = false;
      for (let i = 0; i < 4; i++) {
        let row = dir === 'l' ? board[i].slice() : dir === 'r' ? board[i].slice().reverse() :
                  dir === 'u' ? board.map(r => r[i]) : board.map(r => r[i]).reverse();
        const nrow = slide(row);
        if (JSON.stringify(nrow) !== JSON.stringify(row)) moved = true;
        if (dir === 'l') board[i] = nrow;
        else if (dir === 'r') board[i] = nrow.reverse();
        else if (dir === 'u') board.forEach((r, j) => r[i] = nrow[j]);
        else board.forEach((r, j) => r[i] = nrow.reverse()[j]);
      }
      if (moved) { addTile(); draw(); }
    };
    const colors = { 2: '#eee4da', 4: '#ede0c8', 8: '#f2b179', 16: '#f59563', 32: '#f67c5f', 64: '#f65e3b', 128: '#edcf72', 256: '#edcc61', 512: '#edc850', 1024: '#edc53f', 2048: '#edc22e' };
    const draw = () => {
      const cont = body.querySelector('#g2048-grid');
      if (!cont) return;
      cont.innerHTML = '';
      board.forEach(r => r.forEach(v => {
        const c = document.createElement('div');
        c.style.cssText = `display:flex;align-items:center;justify-content:center;font-weight:800;font-size:${v >= 1024 ? 18 : 24}px;border-radius:8px;aspect-ratio:1;background:${colors[v] || '#3c3c43'};color:${v > 4 ? '#f9f6f2' : '#776e65'};transition:all .12s`;
        c.textContent = v || '';
        cont.appendChild(c);
      }));
      body.querySelector('#g2048-score').textContent = `Score: ${score}`;
    };
    body.innerHTML = `
      <div class="card" style="text-align:center">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
          <b>🔢 2048</b><span id="g2048-score">Score: 0</span>
        </div>
        <div id="g2048-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;background:var(--surface-3);padding:10px;border-radius:14px"></div>
        <div style="margin-top:12px;font-size:12px;color:var(--text-muted)">Swipe or use arrow keys</div>
      </div>`;
    board = newBoard(); addTile(); addTile(); draw();
    const keyH = (e) => {
      if (Ahad.state.appOpen !== 'game2048') return;
      const k = e.key.toLowerCase();
      if (k === 'arrowup' || k === 'w') move('u');
      if (k === 'arrowdown' || k === 's') move('d');
      if (k === 'arrowleft' || k === 'a') move('l');
      if (k === 'arrowright' || k === 'd') move('r');
    };
    window.addEventListener('keydown', keyH);
    let t0 = null;
    body.addEventListener('touchstart', e => { t0 = e.touches[0]; }, { passive: true });
    body.addEventListener('touchend', e => {
      if (!t0) return;
      const dx = e.changedTouches[0].clientX - t0.clientX;
      const dy = e.changedTouches[0].clientY - t0.clientY;
      t0 = null;
      if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;
      if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? 'r' : 'l');
      else move(dy > 0 ? 'd' : 'u');
    }, { passive: true });
    Ahad.cleanup.push(() => window.removeEventListener('keydown', keyH));
  },

  esc(s) {
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  },
};
