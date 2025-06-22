import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

import zh from '../public/locales/zh/translation.json';
import tw from '../public/locales/tw/translation.json';
import en from '../public/locales/en/translation.json';

const language = JSON.parse(localStorage.getItem("settings-store") as string)?.state.language;
export default i18n
    .use(initReactI18next)  // 初始化 React i18next
    .init({
        resources: {
            "zh-CN": {translation: zh},
            "zh-TW": {translation: tw},
            "en-US": {translation: en},
        },
        lng: language || 'zh-CN',
        ns: ['translation'],
        fallbackLng: 'zh-CN',
        defaultNS: 'translation',
        interpolation: {
            escapeValue: false,
        },
    });


