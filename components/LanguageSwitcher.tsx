import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiGlobe, FiChevronDown } from 'react-icons/fi';

const languages = [
  { code: 'zh-CN', name: '中文' },
  { code: 'en', name: 'English' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' }
];

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 组件挂载后设置状态，避免SSR问题
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  // 获取当前语言
  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  // 如果组件未挂载，返回null避免水合错误
  if (!mounted) return null;

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
        aria-label={t('language.select')}
      >
        <FiGlobe className="mr-1" />
        <span className="hidden sm:inline">{currentLanguage.name}</span>
        <FiChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50">
          <ul className="py-1">
            {languages.map((language) => (
              <li key={language.code}>
                <button
                  onClick={() => changeLanguage(language.code)}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-800 transition-colors ${
                    i18n.language === language.code ? 'text-primary-400 font-medium' : 'text-gray-300'
                  }`}
                >
                  {language.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher; 