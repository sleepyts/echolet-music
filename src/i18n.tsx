import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

import zh from '../public/locales/zh/translation.json';
import tw from '../public/locales/tw/translation.json';

export default i18n
    .use(initReactI18next)  // 初始化 React i18next
    .init({
        resources: {
            zh: {translation: zh},
            tw: {translation: tw}
        },
        fallbackLng: 'zh',
        ns: ['translation'],
        defaultNS: 'translation',
        interpolation: {
            escapeValue: false,  // 不需要转义
        },
    });


