# AhadOs 📱💜

**আপনার নিজের ফোন OS — আপনার আইকন, আপনার wallpaper, আপনার notification style, সবকিছু আপনার।**

AhadOs is a fully working phone OS that runs right in the browser (and installs on any phone as a PWA). Built entirely by **Ahad** — every icon, wallpaper, and theme.

## ✨ Features

- **4 theme looks** — iOS (frosted glass), Minimal (warm flat), Neon (cyberpunk glow) × Light/Dark modes
- **17+ built-in apps** — Phone, Messages (with auto-replies 😄), Browser, Camera, Photos, Gallery, Clock (alarms + stopwatch), Calculator, Weather (Dhaka), Music player, Notes, Files, Wallet, Ahad Store, Theme Center, Settings, About
- **Ahad Store** — install playable **Snake** and **2048** games right into your OS
- **Notification shade** — quick settings toggles (Wi-Fi, Bluetooth, Flashlight, DND…), heads-up banners, actionable notifications
- **6 exclusive wallpapers** — switch anytime from Settings
- **Lock screen** with swipe-up unlock + boot animation
- **PWA** — add to your phone's home screen and it runs fullscreen like a real OS

## 🚀 Run it

```bash
cd ahados
python3 -m http.server 8080
# open http://localhost:8080
```

## 📂 Structure

```
ahados/
├── index.html          # OS shell (screen, lock, home, shade, app window)
├── manifest.webmanifest # PWA manifest
├── sw.js               # service worker (offline)
├── css/
│   ├── themes.css      # 4 themes × light/dark variables
│   ├── os.css          # core OS chrome (status bar, shade, boot…)
│   └── apps.css        # in-app UI styles
├── js/
│   ├── icons.js        # hand-coded app icon library (SVG)
│   ├── data.js         # apps, wallpapers, notifications, songs, chats…
│   ├── core.js         # OS engine (launcher, clock, shade, toggles)
│   ├── apps.js         # all app views
│   └── main.js         # entry point
└── assets/
    ├── icons/          # app icon / PWA icon
    └── wallpapers/     # 6 wallpapers + gallery photos
```

## 📲 Install on your phone

1. Open the AhadOs URL in Chrome on your phone
2. Menu → **Add to Home Screen**
3. Launch it — it opens fullscreen like a real OS 🎉

## 🛠️ Coming next

- [ ] More store apps (music player skins, games…)
- [ ] Live wallpaper mode
- [ ] Widgets on home screen
- [ ] Bengali (বাংলা) UI language

---
Built with 💜 by Ahad · v1.0.1 (GitHub Pages live!) · 2026-08-31
