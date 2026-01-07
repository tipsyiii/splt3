import { createI18n } from 'vue-i18n';
//eslint-disable-next-line @dword-design/import-alias/prefer-alias
import languages from '../assets/i18n/index.mjs';

const LANGUAGE_KEY = 'lang';

function normalizeLanguageCode(code) {
  if (!code) {
    return '';
  }

  return String(code).replace('_', '-');
}

function getStoredLanguageCode() {
  try {
    if (typeof uni !== 'undefined' && typeof uni.getStorageSync === 'function') {
      return uni.getStorageSync(LANGUAGE_KEY);
    }
  } catch (e) {
    //
  }

  try {
    if (typeof localStorage !== 'undefined' && localStorage) {
      return localStorage.getItem(LANGUAGE_KEY);
    }
  } catch (e) {
    //
  }

  return null;
}

function setStoredLanguageCode(value) {
  try {
    if (typeof uni !== 'undefined' && typeof uni.setStorageSync === 'function') {
      uni.setStorageSync(LANGUAGE_KEY, value);
      return;
    }
  } catch (e) {
    //
  }

  try {
    if (typeof localStorage !== 'undefined' && localStorage) {
      localStorage.setItem(LANGUAGE_KEY, value);
    }
  } catch (e) {
    //
  }
}

function setCssVar(name, value) {
  try {
    if (typeof document !== 'undefined' && document.documentElement?.style?.setProperty) {
      document.documentElement.style.setProperty(name, value);
    }
  } catch (e) {
    //
  }
}

async function requestJson(url) {
  try {
    if (typeof uni !== 'undefined' && typeof uni.request === 'function') {
      return await new Promise((resolve, reject) => {
        uni.request({
          url,
          dataType: 'json',
          success(res) {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(res.data);
            } else {
              reject(res);
            }
          },
          fail(err) {
            reject(err);
          },
        });
      });
    }
  } catch (e) {
    //
  }

  let response = await fetch(url);

  if (!response.ok) {
    throw response;
  }

  return response.json();
}

export const locales = [
  { code: 'de-DE', flag: '🇩🇪', name: 'Deutsch' },
  { code: 'en-US', flag: '🇺🇸', name: 'English (US)' },
  { code: 'en-GB', flag: '🇬🇧', name: 'English (GB)' },
  { code: 'es-ES', flag: '🇪🇸', name: 'Español (ES)' },
  { code: 'es-MX', flag: '🇲🇽', name: 'Español (MX)' },
  { code: 'fr-FR', flag: '🇫🇷', name: 'Français (FR)' },
  { code: 'fr-CA', flag: '🇨🇦', name: 'Français (CA)' },
  { code: 'it-IT', flag: '🇮🇹', name: 'Italiano' },
  { code: 'ja-JP', flag: '🇯🇵', name: '日本語' },
  { code: 'ko-KR', flag: '🇰🇷', name: '한국어' },
  { code: 'nl-NL', flag: '🇳🇱', name: 'Nederlands' },
  { code: 'ru-RU', flag: '🇷🇺', name: 'Русский' },
  { code: 'zh-CN', flag: '🇨🇳', name: '中文(简体)' },
  { code: 'zh-TW', flag: '🇹🇼', name: '中文(台灣)' },
];

export const regionalLocales = {
  US: [
    locales.find(l => l.code === 'en-US'),
    locales.find(l => l.code === 'es-MX'),
    locales.find(l => l.code === 'fr-CA'),
  ],
  EU: [
    locales.find(l => l.code === 'en-GB'),
    locales.find(l => l.code === 'de-DE'),
    locales.find(l => l.code === 'es-ES'),
    locales.find(l => l.code === 'fr-FR'),
    locales.find(l => l.code === 'it-IT'),
    locales.find(l => l.code === 'nl-NL'),
    locales.find(l => l.code === 'ru-RU'),
  ],
  JP: [
    locales.find(l => l.code === 'ja-JP'),
  ],
  AP: [
    locales.find(l => l.code === 'en-US'),
    locales.find(l => l.code === 'ko-KR'),
    locales.find(l => l.code === 'zh-CN'),
    locales.find(l => l.code === 'zh-TW'),
  ],
};

export const defaultLocale = locales.find(l => l.code === 'en-US');

const datetimeFormats = {
  dateTimeShort: { month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit' },
  dateTimeShortWeekday: { month: 'numeric', weekday: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' },
  time: { hour: 'numeric', minute: '2-digit' },
};

let i18n = null;

export function initializeI18n() {
  if (!i18n) {
    i18n = createI18n({
      legacy: false,
      globalInjection: true,
      missingWarn: false,
      fallbackWarn: false,
      warnHtmlMessage: false,
      locale: currentLocale().code,
      fallbackLocale: 'en-US',
      messages: { ...languages },
      datetimeFormats: locales.reduce((result, locale) => ({ ...result, [locale.code]: datetimeFormats }), {}),
      pluralRules: {
        'ru-RU': ruPluralization,
      },
    });

    // Listen for local storage changes
    try {
      if (typeof window !== 'undefined' && window.addEventListener) {
        window.addEventListener('storage', reload);
      }
    } catch (e) {
      //
    }
    reload();
  }

  return i18n;
}

// Adapted from: https://vue-i18n.intlify.dev/guide/essentials/pluralization.html#custom-pluralization
function ruPluralization(choice, choicesLength, orgRule) {
  if (choice === 0) {
    return 0;
  }

  const teen = choice > 10 && choice < 20;
  const endsWithOne = choice % 10 === 1;
  if (!teen && endsWithOne) {
    return 1;
  }
  if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
    return 2;
  }

  return choicesLength < 4 ? 2 : 3;
}

function reload() {
  let code = currentLocale().code;

  if (i18n.global?.locale && typeof i18n.global.locale === 'object' && 'value' in i18n.global.locale) {
    i18n.global.locale.value = code;
  } else {
    i18n.global.locale = code;
  }
  loadLocale();

  switch (code) {
    case 'zh-CN':
      setCssVar('--font-family-s1', 'splatoon1, splatoon1chzh, sans-serif');
      setCssVar('--font-family-s2', 'splatoon2, splatoon2chzh, sans-serif');
      break;

    case 'zh-TW':
      setCssVar('--font-family-s1', 'splatoon1, splatoon1twzh, sans-serif');
      setCssVar('--font-family-s2', 'splatoon2, splatoon2twzh, sans-serif');
      break;

    default:
      setCssVar('--font-family-s1', 'splatoon1, splatoon1jpja, sans-serif');
      setCssVar('--font-family-s2', 'splatoon2, splatoon2jpja, sans-serif');
      break;
  }
}

async function loadLocale() {
  let locale = currentLocale().code;
  let json;

  const baseUrl = String(import.meta.env.VITE_DATA_FROM || '').replace(/\/$/, '');
  const candidates = [
    `${baseUrl}/data/${locale}.json`,
    `${baseUrl}/data/locale/${locale}.json`,
  ];

  let lastError;
  for (const url of candidates) {
    try {
      json = await requestJson(url);
      break;
    } catch (e) {
      lastError = e;
    }
  }

  if (!json) {
    console.error(lastError);
    return;
  }

  i18n.global.setLocaleMessage(locale, {
    ...i18n.global.getLocaleMessage(locale),
    splatnet: json,
  });
}

function currentLocale() {
  return preferredLocale() || detectLocale();
}

function preferredLocale() {
  let code = getStoredLanguageCode();

  return locales.find(l => l.code === code);
}

export function setPreferredLocale(value) {
  setStoredLanguageCode(value);
  reload();
}

function detectLocale() {
  let languages;

  try {
    if (typeof uni !== 'undefined' && typeof uni.getSystemInfoSync === 'function') {
      let lang = normalizeLanguageCode(uni.getSystemInfoSync().language);
      languages = lang ? [lang] : null;
    }
  } catch (e) {
    //
  }

  if (!languages) {
    try {
      if (typeof window !== 'undefined' && window.navigator) {
        languages = window.navigator.languages || [window.navigator.language];
      }
    } catch (e) {
      //
    }
  }

  languages = languages || [];

  // Try to find a matching language
  for (let language of languages) {
    language = normalizeLanguageCode(language);
    let locale = locales.find(l => l.code.startsWith(language))
       || locales.find(l => l.code.startsWith(language.substring(0, 2)));

    if (locale) {
      return locale;
    }
  }

  // Fall back to en-US
  return defaultLocale;
}
