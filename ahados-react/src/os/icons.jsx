/* ============================================================
   AhadOs v2 — app icons (SVG, one unified glass+neon style)
   ============================================================ */

const S = (children) => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
    stroke="rgba(255,255,255,.97)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

export const ICON_GRADS = {
  phone: 'linear-gradient(135deg,#34c759,#0a9418)',
  messages: 'linear-gradient(135deg,#34c759,#30b0c7)',
  camera: 'linear-gradient(135deg,#1d1d1f,#48484a)',
  photos: 'linear-gradient(135deg,#ff3b30,#ff9500)',
  gallery: 'linear-gradient(135deg,#af52de,#5856d6)',
  settings: 'linear-gradient(135deg,#8e8e93,#636366)',
  browser: 'linear-gradient(135deg,#0a84ff,#5e5ce6)',
  files: 'linear-gradient(135deg,#ff9f0a,#ff375f)',
  music: 'linear-gradient(135deg,#ff375f,#bf5af2)',
  clock: 'linear-gradient(135deg,#0a84ff,#64d2ff)',
  notes: 'linear-gradient(135deg,#ffd60a,#ff9f0a)',
  calculator: 'linear-gradient(135deg,#30b0c7,#0a84ff)',
  weather: 'linear-gradient(135deg,#ffcc00,#ff9f0a)',
  store: 'linear-gradient(135deg,#00c7be,#30b0c7)',
  wallet: 'linear-gradient(135deg,#ff9f0a,#ff2d55)',
  about: 'linear-gradient(135deg,#8b5cf6,#06b6d4)',
  snake: 'linear-gradient(135deg,#22c55e,#16a34a)',
  game2048: 'linear-gradient(135deg,#f59e0b,#f97316)',
};

export const ICONS = {
  phone: S(<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />),
  messages: S(<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />),
  camera: S(<><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></>),
  photos: S(<><rect x="3" y="3" width="18" height="18" rx="4" /><circle cx="8.5" cy="8.5" r="1.5" fill="rgba(255,255,255,.97)" stroke="none" /><path d="M21 15l-5-5L5 21" /></>),
  gallery: S(<><rect x="3" y="5" width="18" height="14" rx="3" /><circle cx="8.5" cy="10" r="1.6" fill="rgba(255,255,255,.97)" stroke="none" /><path d="M21 16l-4.5-4.5L7 21" /></>),
  settings: S(<><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></>),
  browser: S(<><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></>),
  files: S(<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />),
  music: S(<><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></>),
  clock: S(<><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>),
  notes: S(<><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" /></>),
  calculator: S(<><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" y1="6" x2="16" y2="6" /><line x1="8" y1="12" x2="8" y2="12.01" /><line x1="12" y1="12" x2="12" y2="12.01" /><line x1="16" y1="12" x2="16" y2="12.01" /><line x1="8" y1="17" x2="8" y2="17.01" /><line x1="12" y1="17" x2="12" y2="17.01" /><line x1="16" y1="17" x2="16" y2="17.01" /></>),
  weather: S(<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z" />),
  store: S(<><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></>),
  wallet: S(<><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4z" /></>),
  snake: S(<path d="M12 2a7 7 0 0 1 7 7c0 3.5-2 6.5-5 8a7 7 0 0 1-7-8" />),
  game2048: S(<><rect x="3" y="3" width="18" height="18" rx="4" /><path d="M9 8l3 3 3-3" /><path d="M9 16l3-3 3 3" /></>),
};
