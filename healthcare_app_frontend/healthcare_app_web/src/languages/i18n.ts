import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import vietnamese from "./vietnamese.json";
import english from "./english.json";

i18n.use(initReactI18next).init({
  resources: {
    vi: {
      translation: vietnamese,
    },
    en: {
      translation: english,
    },
  },
  lng: "vi", // default language
  fallbackLng: "vi",
  // debug: process.env.NODE_ENV === 'development',
  interpolation: {
    // escape chuyển kí tự thành dạng an toàn để hiển thị
    escapeValue: false, // not needed for react as it escapes by defaulte
  },
});

export default i18n;
