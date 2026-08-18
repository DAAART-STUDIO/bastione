/** Global configuration constants shared between frontend modules. */

export const CONFIG = Object.freeze({
  theme: {
    default: 'light',
    storageKey: 'bastione:theme',
  },
  locale: {
    default: 'it',
    supported: ['it', 'en', 'de'],
    storageKey: 'bastione:language',
  },
  motion: {
    reducedQuery: '(prefers-reduced-motion: reduce)',
  },
  nav: {
    desktopBreakpoint: 1180,
  },
});
