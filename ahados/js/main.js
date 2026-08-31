/* ============================================================
   AhadOs — Entry point
   ============================================================ */

Ahad.cleanup = [];

document.addEventListener('DOMContentLoaded', () => {
  // Register each app view (system apps only — store apps register themselves)
  AhadApps.views.clock = (b) => AhadApps.clock(b);
  AhadApps.views.calculator = (b) => AhadApps.calculator(b);
  AhadApps.views.notes = (b) => AhadApps.notes(b);
  AhadApps.views.weather = (b) => AhadApps.weather(b);
  AhadApps.views.music = (b) => AhadApps.music(b);
  AhadApps.views.gallery = (b) => AhadApps.gallery(b);
  AhadApps.views.camera = (b) => AhadApps.camera(b);
  AhadApps.views.files = (b) => AhadApps.files(b);
  AhadApps.views.messages = (b) => AhadApps.messages(b);
  AhadApps.views.browser = (b) => AhadApps.browser(b);
  AhadApps.views.settings = (b) => AhadApps.settings(b);
  AhadApps.views.store = (b) => AhadApps.store(b);
  AhadApps.views.wallet = (b) => AhadApps.wallet(b);
  AhadApps.views.themecenter = (b) => AhadApps.themecenter(b);
  AhadApps.views.about = (b) => AhadApps.about(b);
  AhadApps.views.snake = (b) => AhadApps.snake(b);
  AhadApps.views.game2048 = (b) => AhadApps.game2048(b);

  Ahad.init();

  // PWA install prompt hook
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    window.__pwaPrompt = e;
  });
});
