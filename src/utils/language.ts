import { createI18n } from "vue-i18n";

// The following is the scenario of setting language package separately. When setting language package separately, it needs to be introduced separately
// {{$t('toolbar.supply')}}

const messages = {
  en: require("../assets/locales/en.json"),
  "zh-cn": require("../assets/locales/zh-CN.json"),
  "zh-tw": require("../assets/locales/zh-tw.json"),
  ar: require("../assets/locales/ar.json"),
  es: require("../assets/locales/es.json"),
  ja: require("../assets/locales/ja.json"),
  ko: require("../assets/locales/ko.json"),
  th: require("../assets/locales/th.json"),
};

let lang = navigator.language; //|| navigator.userLanguage  General browser language and IE browser

lang = lang.substring(0, 2);

const locale_lang = localStorage.getItem("p_lang_locale") || "en";

const i18n = createI18n({
  locale: locale_lang, // set locale  The default is English
  messages: messages,
  silentTranslationWarn: true,
  legacy: false,
});
export default i18n;
