# AhadOs 📱💜

**আপনার নিজের ফোন OS — React + Three.js দিয়ে বানানো, 3D glass design।**

AhadOs v2 is a fully working phone OS that runs in the browser (and installs on any phone as a PWA). Built entirely by **Ahad** — every icon, wallpaper, 3D scene, and animation.

## ✨ Features (v2)

- **Unified design** — glassmorphism + neon glow + iOS-style icons + minimal typography, all blended into ONE signature look (no separate themes)
- **3D animated background** — floating glass shapes + glowing particles (Three.js)
- **Buttery animations** — Framer Motion everywhere (lock screen drag, app opening, shade, toasts)
- **18 apps** — Phone, Messages (auto-replies 😄), Browser, Camera, Photos, Gallery, Clock (alarms + stopwatch), Calculator, Weather (Dhaka), Music, Notes, Files, Wallet, Ahad Store, Settings, About + playable **Snake** & **2048**
- **Notification shade** — quick toggles, heads-up banners, actionable notifications
- **6 wallpapers** — switch anytime from Settings
- **PWA** — install on your phone's home screen, runs fullscreen

## 🌍 LIVE

**https://tajhatati.github.io/prmoty/** — auto-deploys via GitHub Actions on every push.

## 🚀 Develop

```bash
cd ahados-react
npm install
npm run dev        # dev server
npm run build      # builds into ../ahados (deployed folder)
```

## 📂 Structure

```
ahados-react/          # React source (v2)
├── src/
│   ├── main.jsx       # entry
│   ├── App.jsx        # OS shell (lock, home, shade, app window, nav)
│   ├── os/
│   │   ├── OSContext.jsx  # global state (boot, apps, toggles, notifs)
│   │   ├── Scene3D.jsx    # Three.js glass + particles background
│   │   ├── icons.jsx      # SVG icon library
│   │   └── data.js        # all app/content data
│   ├── apps/Apps.jsx      # all app views
│   └── styles/global.css  # unified design system
└── public/            # wallpapers, icons, manifest, sw
ahados/                # build output (deployed to GitHub Pages)
```

## 📲 Install on your phone

1. Open https://tajhatati.github.io/prmoty/ in Chrome
2. Menu → **Add to Home Screen**
3. Launch it — fullscreen OS experience 🎉

## 🛠️ Coming next

- [ ] More store apps & games
- [ ] Live wallpaper (video/particles)
- [ ] Widgets on home screen
- [ ] Bengali (বাংলা) UI

---
Built with 💜 by Ahad · v2.0.0 · React 19 + Three.js + Framer Motion
