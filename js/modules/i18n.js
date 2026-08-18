/**
 * i18n.js — Bastione localisation system.
 *
 * Italian is the default/source language.
 * English and German translations are loaded from JSON dictionaries.
 */

import { CONFIG } from '../config.js';

let dictionaries = {};
let activeLanguage = CONFIG.locale.default;

function getValue(object, path) {
  return path.split('.').reduce((value, key) => {
    return value?.[key];
  }, object);
}

async function loadDictionary(language) {
  if (dictionaries[language]) {
    return dictionaries[language];
  }

  const response = await fetch(`data/i18n/${language}.json`);

  if (!response.ok) {
    throw new Error(`Unable to load language: ${language}`);
  }

  const dictionary = await response.json();

  dictionaries[language] = dictionary;

  return dictionary;
}

function updateLanguageButtons(language) {
  document.querySelectorAll('[data-language-option]').forEach((button) => {
    const isActive = button.dataset.languageOption === language;

    button.setAttribute('aria-pressed', String(isActive));
    button.classList.toggle('is-active', isActive);
  });
}

function translatePage(dictionary) {
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.dataset.i18n;
    const value = getValue(dictionary, key);

    if (value === undefined) {
      console.warn(`[i18n] Missing translation: ${key}`);
      return;
    }

    element.textContent = value;
  });

  document.querySelectorAll('[data-i18n-html]').forEach((element) => {
    const key = element.dataset.i18nHtml;
    const value = getValue(dictionary, key);

    if (value === undefined) {
      console.warn(`[i18n] Missing HTML translation: ${key}`);
      return;
    }

    element.innerHTML = value;
  });

  document.querySelectorAll('[data-i18n-aria]').forEach((element) => {
    const key = element.dataset.i18nAria;
    const value = getValue(dictionary, key);

    if (value === undefined) {
      console.warn(`[i18n] Missing ARIA translation: ${key}`);
      return;
    }

    element.setAttribute('aria-label', value);
  });
}

function updateDocumentLanguage(language, dictionary) {
  document.documentElement.lang = language;
  document.documentElement.dataset.language = language;

  if (dictionary.meta?.title) {
    document.title = dictionary.meta.title;
  }

  if (dictionary.meta?.description) {
    const description = document.querySelector('meta[name="description"]');

    if (description) {
      description.setAttribute('content', dictionary.meta.description);
    }
  }
}

function storeLanguage(language) {
  try {
    localStorage.setItem(CONFIG.locale.storageKey, language);
  } catch {
    // Ignore storage errors.
  }
}

function getStoredLanguage() {
  try {
    return localStorage.getItem(CONFIG.locale.storageKey);
  } catch {
    return null;
  }
}

async function setLanguage(language) {
  if (!CONFIG.locale.supported.includes(language)) {
    return;
  }

  try {
    const dictionary = await loadDictionary(language);

    translatePage(dictionary);
    updateDocumentLanguage(language, dictionary);
    updateLanguageButtons(language);

    activeLanguage = language;

    storeLanguage(language);
  } catch (error) {
    console.error('[i18n]', error);
  }
}

export function initI18n() {
  const storedLanguage = getStoredLanguage();

  const initialLanguage =
    CONFIG.locale.supported.includes(storedLanguage)
      ? storedLanguage
      : CONFIG.locale.default;

  document.querySelectorAll('[data-language-option]').forEach((button) => {
    button.addEventListener('click', () => {
      const language = button.dataset.languageOption;

      if (language === activeLanguage) {
        return;
      }

      setLanguage(language);
    });
  });

  setLanguage(initialLanguage);
}