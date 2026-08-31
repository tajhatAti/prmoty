/* ============================================================
   AhadOs — App & content data
   ============================================================ */

const AhadData = {

  wallpapers: [
    { id: 'aurora',  name: 'Aurora Dreams', src: 'assets/wallpapers/wall-aurora.jpg' },
    { id: 'neon',    name: 'Neon City',     src: 'assets/wallpapers/wall-neon.jpg' },
    { id: 'minimal', name: 'Minimal Art',   src: 'assets/wallpapers/wall-minimal.jpg' },
    { id: 'dark',    name: 'Dark Waves',    src: 'assets/wallpapers/wall-dark.jpg' },
    { id: 'sunset',  name: 'Sunset River',  src: 'assets/wallpapers/wall-sunset.jpg' },
    { id: 'ahad',    name: 'Ahad Signature', src: 'assets/wallpapers/wall-ahad.jpg' },
  ],

  apps: [
    { id: 'phone',      name: 'Phone',      page: true },
    { id: 'messages',   name: 'Messages',   page: true },
    { id: 'browser',    name: 'Browser',    page: true },
    { id: 'camera',     name: 'Camera',     page: true },
    { id: 'photos',     name: 'Photos',     page: true },
    { id: 'gallery',    name: 'Gallery',    page: true },
    { id: 'clock',      name: 'Clock',      page: true },
    { id: 'calculator', name: 'Calculator', page: true },
    { id: 'weather',    name: 'Weather',    page: true },
    { id: 'music',      name: 'Music',      page: true },
    { id: 'notes',      name: 'Notes',      page: true },
    { id: 'files',      name: 'Files',      page: true },
    { id: 'store',      name: 'Ahad Store', page: true },
    { id: 'wallet',     name: 'Wallet',     page: true },
    { id: 'themecenter',name: 'Theme',      page: true },
    { id: 'settings',   name: 'Settings',   page: true },
    { id: 'about',      name: 'About',      page: true },
  ],

  dock: ['phone', 'messages', 'browser', 'camera'],

  home: [
    ['clock', 'photos', 'gallery', 'music'],
    ['messages', 'browser', 'camera', 'notes'],
    ['weather', 'files', 'calculator', 'store'],
  ],
  homeMore: ['wallet', 'themecenter', 'settings', 'about'],

  // notifications: appId, title, text, time, color
  notifications: [
    { app: 'messages', title: 'Sadia', text: 'Hey Ahad! Eid Mubarak in advance 🎉', time: '2m ago' },
    { app: 'weather',  title: 'Weather', text: 'Rain expected in Dhaka tomorrow — take an umbrella ☔', time: '18m ago' },
    { app: 'browser',  title: 'Browser', text: 'Download complete: wallpaper pack', time: '1h ago' },
    { app: 'store',    title: 'Ahad Store', text: 'New apps are now available for install!', time: '3h ago' },
    { app: 'phone',    title: 'Missed call', text: 'Ahad +880 17XX-XXXXXX (1 missed call)', time: '5h ago' },
  ],

  quickToggles: [
    { id: 'wifi',    label: 'Wi-Fi',  icon: '📶' },
    { id: 'bluetooth', label: 'Bluetooth', icon: '🔵' },
    { id: 'flash',   label: 'Flash',  icon: '🔦' },
    { id: 'rotate',  label: 'Rotate', icon: '🔄' },
    { id: 'flight',  label: 'Airplane', icon: '✈️' },
    { id: 'data',    label: 'Mobile Data', icon: '📡' },
    { id: 'battery', label: 'Battery Saver', icon: '🔋' },
    { id: 'dnd',     label: 'DND',     icon: '🌙' },
  ],

  songs: [
    { title: 'Tumi Robe Nirobe',   artist: 'Ahad', dur: '4:12', emoji: '🎹', grad: 'linear-gradient(135deg,#8b5cf6,#ec4899)' },
    { title: 'Nova City Lights',   artist: 'Ahad', dur: '3:45', emoji: '🌆', grad: 'linear-gradient(135deg,#06b6d4,#3b82f6)' },
    { title: 'Purono Bondhura',    artist: 'Ahad', dur: '3:58', emoji: '🎸', grad: 'linear-gradient(135deg,#f59e0b,#ef4444)' },
    { title: 'Midnight Dhaka',     artist: 'Ahad', dur: '4:33', emoji: '🌃', grad: 'linear-gradient(135deg,#111827,#4f46e5)' },
    { title: 'Moner Golpo',        artist: 'Ahad', dur: '3:21', emoji: '💭', grad: 'linear-gradient(135deg,#10b981,#0ea5e9)' },
  ],

  chats: {
    'sadia': {
      name: 'Sadia', emoji: '👩🏻', grad: 'linear-gradient(135deg,#f472b6,#a855f7)',
      msgs: [
        { me: false, t: 'Hey Ahad! What are you building? 😄' },
        { me: true,  t: 'A whole OS! Apps, icons, wallpapers, notifications — everything' },
        { me: false, t: 'Waaah! AhadOS!! 🤩' },
        { me: false, t: "Can't wait to try it" },
        { me: true,  t: 'Opening soon in your browser 😎' },
      ]
    },
    'rafi': {
      name: 'Rafi', emoji: '🧑🏽', grad: 'linear-gradient(135deg,#3b82f6,#06b6d4)',
      msgs: [
        { me: false, t: 'Bhai, OS er demo kobe? 🚀' },
        { me: true,  t: 'Ajkei! Live preview ready' },
        { me: false, t: '🔥🔥🔥' },
      ]
    },
    'mama': {
      name: 'Mama (Dhaka)', emoji: '🧔🏻', grad: 'linear-gradient(135deg,#059669,#10b981)',
      msgs: [
        { me: false, t: 'Kemon acho beta?' },
        { me: true,  t: 'Valo mama, apnar kemon?' },
        { me: false, t: 'Valo valo. Ekdin bari eo 😊' },
      ]
    },
    'anna': {
      name: 'Anna', emoji: '👩🏼‍💻', grad: 'linear-gradient(135deg,#ec4899,#8b5cf6)',
      msgs: [
        { me: false, t: 'Did you push the new theme system?' },
        { me: true,  t: 'Yes! 4 themes now. Switching is buttery smooth ✨' },
      ]
    },
  },

  files: {
    root: [
      { name: 'Wallpapers', type: 'folder' },
      { name: 'Music', type: 'folder' },
      { name: 'Notes', type: 'folder' },
      { name: 'Download', type: 'folder' },
      { name: 'ahados-demo.mp4', type: 'video', size: '48 MB' },
      { name: 'my-ideas.txt', type: 'text', size: '2 KB' },
      { name: 'logo.png', type: 'image', size: '340 KB' },
    ],
    Wallpapers: [
      { name: 'aurora.jpg', type: 'image', size: '1.2 MB' },
      { name: 'neon-city.jpg', type: 'image', size: '1.8 MB' },
      { name: 'minimal.jpg', type: 'image', size: '900 KB' },
    ],
    Music: [
      { name: 'nova-city.mp3', type: 'audio', size: '6.4 MB' },
      { name: 'midnight-dhaka.mp3', type: 'audio', size: '5.1 MB' },
    ],
    Notes: [
      { name: 'os-ideas.txt', type: 'text', size: '1 KB' },
      { name: 'todo.txt', type: 'text', size: '400 B' },
    ],
    Download: [
      { name: 'wallpaper-pack.zip', type: 'zip', size: '14 MB' },
      { name: 'icon-set.png', type: 'image', size: '2.3 MB' },
    ],
  },

  weather: {
    city: 'Dhaka',
    temp: 32, desc: 'Partly Cloudy',
    emoji: '⛅',
    hi: 34, lo: 27,
    feel: 36, hum: 74, wind: '9 km/h', rain: '40%', uv: '7 High',
    days: [
      { d: 'Sun', i: '⛅', t: '32°' },
      { d: 'Mon', i: '🌧️', t: '29°' },
      { d: 'Tue', i: '⛈️', t: '28°' },
      { d: 'Wed', i: '🌦️', t: '30°' },
      { d: 'Thu', i: '☀️', t: '33°' },
      { d: 'Fri', i: '☀️', t: '34°' },
    ],
  },

  storeApps: [
    { id: 'chatgpt', name: 'ChatGPT', desc: 'AI assistant', emoji: '🤖', grad: 'linear-gradient(135deg,#10a37f,#0d9488)', installed: false },
    { id: 'youtube', name: 'YouTube', desc: 'Videos & music', emoji: '▶️', grad: 'linear-gradient(135deg,#ff0000,#dc2626)', installed: false },
    { id: 'instagram', name: 'Instagram', desc: 'Social', emoji: '📸', grad: 'linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', installed: false },
    { id: 'chatgpt-clone', name: 'Ahad AI', desc: 'Your personal assistant', emoji: '🧠', grad: 'linear-gradient(135deg,#8b5cf6,#06b6d4)', installed: true },
    { id: 'game-snake', name: 'Snake', desc: 'Classic arcade', emoji: '🐍', grad: 'linear-gradient(135deg,#22c55e,#16a34a)', installed: false },
    { id: 'game-2048', name: '2048', desc: 'Number puzzle', emoji: '🔢', grad: 'linear-gradient(135deg,#f59e0b,#f97316)', installed: false },
  ],

  wallet: {
    name: 'Ahad Ahmed',
    balance: 24500,
    currency: '৳',
    transactions: [
      { icon: '🛵', title: 'Food delivery', amt: -320, time: 'Today, 1:20 PM' },
      { icon: '💳', title: 'Mobile recharge', amt: -200, time: 'Today, 11:05 AM' },
      { icon: '💰', title: 'Freelance payment', amt: +15000, time: 'Yesterday' },
      { icon: '🍔', title: 'Burger King', amt: -450, time: 'Yesterday' },
      { icon: '🎁', title: 'Birthday gift', amt: +1000, time: 'Aug 27' },
    ],
  },

  notes: [
    { id: 1, title: 'AhadOs ideas 🚀', text: 'Custom icons, 4 themes, neon mode, notification shade, live wallpaper, own app store...', time: 'Aug 30' },
    { id: 2, title: 'Groceries', text: 'Eggs, milk, rice, bananas, chips 🍿', time: 'Aug 29' },
    { id: 3, title: 'Bangla', text: 'Ami nijer OS banai! Sob nijer moto — icon, wallpaper, notification style...', time: 'Aug 28' },
  ],

  bootMessages: [
    'Starting AhadOs kernel…',
    'Loading themes…',
    'Waking up icons…',
    'Polishing notifications…',
    'AhadOs is ready!',
  ],
};
