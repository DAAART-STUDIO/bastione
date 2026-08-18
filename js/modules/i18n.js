/**
 * i18n.js — Lightweight static-site localisation.
 *
 * The source content is authored in Italian.
 * Translation dictionaries are loaded from data/i18n/.
 */

import { CONFIG } from '../config.js';

const originalTexts = new Map();
const originalTitle = document.title;

let activeLanguage = CONFIG.locale.default;

function updateToggleState(language) {
  document.querySelectorAll('[data-language-option]').forEach((button) => {
    button.setAttribute(
      'aria-pressed',
      String(button.dataset.languageOption === language)
    );
  });
}

function shouldTranslate(node) {
  const parent = node.parentElement;

  return parent && !parent.closest('script, style, svg, title');
}

function replaceText(dictionary) {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT
  );

  let node = walker.nextNode();

  while (node) {
    if (shouldTranslate(node)) {
      const source = originalTexts.get(node) ?? node.nodeValue;

      originalTexts.set(node, source);

      const key = source.trim();
      const translation = dictionary[key];

      if (translation) {
        node.nodeValue = source.replace(key, translation);
      } else {
        node.nodeValue = source;
      }
    }

    node = walker.nextNode();
  }
}

async function loadDictionary(language) {
  if (language === CONFIG.locale.default) {
    return {
      strings: {},
      title: originalTitle,
    };
  }

  const response = await fetch(`data/i18n/${language}.json`);

  if (!response.ok) {
    throw new Error(`Translation file unavailable: ${language}`);
  }

  return response.json();
}

async function setLanguage(language) {
  if (!CONFIG.locale.supported.includes(language)) {
    return;
  }

  try {
    const dictionary = await loadDictionary(language);

    replaceText(dictionary.strings ?? {});

    document.title = dictionary.title ?? originalTitle;

    activeLanguage = language;

    document.documentElement.lang = language;
    document.documentElement.dataset.language = language;

    localStorage.setItem(CONFIG.locale.storageKey, language);

    updateToggleState(language);
  } catch (error) {
    console.error('[i18n]', error);

    if (language === CONFIG.locale.default) {
      return;
    }

    replaceText({});

    document.documentElement.lang = CONFIG.locale.default;
    document.documentElement.dataset.language = CONFIG.locale.default;

    updateToggleState(CONFIG.locale.default);
  }
}

/**
 * Initialise language controls and restore the visitor's saved choice.
 */
export function initI18n() {
  const storedLanguage = localStorage.getItem(CONFIG.locale.storageKey);

  const initialLanguage = CONFIG.locale.supported.includes(storedLanguage)
    ? storedLanguage
    : CONFIG.locale.default;

  document.querySelectorAll('[data-language-option]').forEach((button) => {
    button.addEventListener('click', () => {
      setLanguage(button.dataset.languageOption);
    });
  });

  updateToggleState(initialLanguage);

  if (initialLanguage !== activeLanguage) {
    setLanguage(initialLanguage);
  }
}