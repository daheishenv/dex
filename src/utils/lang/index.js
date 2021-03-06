import Vue from 'vue';
import VueI18n from 'vue-i18n';
import store from '../../store';
import enLocale from './en';
import zhLocale from './zh-CN';
import zhtwLocale from './zh-TW';
import ko from './ko';
import baseLocale from './base/index';

Vue.use(VueI18n);

const messages = {
  'zh-CN': { // 中文简体包
    ...zhLocale,
    ...baseLocale.zhCN
  },
  'zh-TW': { // 中文繁体包
    ...zhtwLocale,
    ...baseLocale.zhTW
  },
  en: { // 英文包
    ...enLocale,
    ...baseLocale.en
  },
  ko: {
    ...ko,
    ...baseLocale.ko
  }
};
const i18n = new VueI18n({
  locale: store.state.app.language, // set locale
  messages // locale messages
});

export default i18n;
