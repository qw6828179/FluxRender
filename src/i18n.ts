import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// 检查是否在客户端环境
const isBrowser = typeof window !== 'undefined';

// 初始化i18next配置
const i18nConfig = {
  fallbackLng: 'zh-CN', // 默认语言
  debug: process.env.NODE_ENV === 'development',
  
  interpolation: {
    escapeValue: false, // 不转义HTML
  },
  
  // 语言检测选项
  detection: {
    order: ['navigator', 'querystring', 'cookie', 'localStorage', 'sessionStorage', 'htmlTag'],
    lookupQuerystring: 'lng',
    lookupCookie: 'i18next',
    lookupLocalStorage: 'i18nextLng',
    lookupSessionStorage: 'i18nextLng',
    caches: ['localStorage', 'cookie']
  },
  
  // 后端配置
  backend: {
    loadPath: '/locales/{{lng}}/{{ns}}.json',
  },
  
  // 禁用SSR
  react: {
    useSuspense: false,
    wait: false
  }
};

// 仅在客户端初始化i18n
if (isBrowser) {
  i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init(i18nConfig);
}

export default i18n; 