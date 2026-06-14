// ─── LOGGER INTEGRATION ───
 // Logger is loaded via js/logger.js before this file.
 // Wrap form submit and lightbox with log events.
 (function wireLogger() {
 if (typeof Logger === 'undefined') return;

 // Log page load
 Logger.info('page', 'Page loaded', { url: location.href, ua: navigator.userAgent.slice(0, 80) });

 // Log form submissions
 const form = document.getElementById('contactForm');
 if (form) {
 form.addEventListener('submit', () => {
 Logger.info('form', 'Contact form submitted', {
 service: form.service?.value,
 hasPhone: !!form.phone?.value,
 });
 }, true); // capture phase so it runs before main handler
 }

 // Log project lightbox opens
 document.querySelectorAll('.project-card').forEach(card => {
 card.addEventListener('click', () => {
 const title = card.querySelector('h3')?.textContent;
 Logger.info('ui', 'Project lightbox opened', { project: title });
 });
 });
 })();


/* AGSR Engineering — Client-Side Logger Utility */
/* Logs form submissions, errors, and UI events to console + localStorage */
 
const Logger = (() => {
  const MAX_ENTRIES = 200;
  const KEY = 'agsr_logs';
 
  function timestamp() {
    return new Date().toISOString();
  }
 
  function read() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '[]');
    } catch {
      return [];
    }
  }
 
  function write(entries) {
    try {
      localStorage.setItem(KEY, JSON.stringify(entries.slice(-MAX_ENTRIES)));
    } catch { /* storage full */ }
  }
 
  function log(level, category, message, data = null) {
    const entry = { ts: timestamp(), level, category, message, data };
    console[level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'](
      `[AGSR][${level.toUpperCase()}][${category}]`, message, data || ''
    );
    const entries = read();
    entries.push(entry);
    write(entries);
  }
 
  return {
    info:  (cat, msg, data) => log('info',  cat, msg, data),
    warn:  (cat, msg, data) => log('warn',  cat, msg, data),
    error: (cat, msg, data) => log('error', cat, msg, data),
    getAll: () => read(),
    clear:  () => localStorage.removeItem(KEY),
    download() {
      const entries = read();
      const blob = new Blob(
        [entries.map(e => `[${e.ts}][${e.level.toUpperCase()}][${e.category}] ${e.message}${e.data ? ' | ' + JSON.stringify(e.data) : ''}`).join('\n')],
        { type: 'text/plain' }
      );
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `agsr-log-${new Date().toISOString().slice(0,10)}.txt`;
      a.click();
      URL.revokeObjectURL(a.href);
    }
  };
})();
