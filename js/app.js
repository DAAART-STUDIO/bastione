/**
 * app.js — Bastione application entry point.
 */

import { initThemeSwitcher } from './modules/theme-switcher.js';
import { initNavigation } from './modules/navigation.js';
import { initI18n } from './modules/i18n.js';
import { initHeader } from './modules/header.js';
import { initViewGallery } from './modules/view-gallery.js';

document.addEventListener('DOMContentLoaded', () => {
  initThemeSwitcher();
  initNavigation();
  initI18n();
  initHeader();
  initViewGallery();
});