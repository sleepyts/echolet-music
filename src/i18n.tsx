import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import zh from '../public/locales/zh/translation.json';

export default i18n
    .use(LanguageDetector)  // 检测浏览器语言
    .use(initReactI18next)  // 初始化 React i18next
    .init({
        resources: {
            zh: {translation: zh}
        },
        fallbackLng: 'zh',  // 默认语言设置为中文
        ns: ['translation'],
        defaultNS: 'translation',
        interpolation: {
            escapeValue: false,  // 不需要转义
        },
    });


