import { I18n } from "i18n-js";
import en from "../locales/en.json";
import vi from "../locales/vi.json";

const i18n = new I18n({
  en: en,
  vi: vi,
});

i18n.defaultLocale = "en";

i18n.locale = "en";

i18n.enableFallback = true; // Cho phép fallback về ngôn ngữ mặc định nếu key không tồn tại

export default i18n;
