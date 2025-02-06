import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n.use(HttpBackend)
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		fallbackLng: "en",
		ns: ["translation"],
		defaultNS: "translation",
		load: "languageOnly",

		detection: {
			order: ["querystring", "cookie", "localStorage", "navigator"],
			lookupQuerystring: "lng",
			lookupCookie: "i18next",
			lookupLocalStorage: "i18nextLng",

			convertLanguageCodes: true,
			cleanCode: true,

			// Chỉ sử dụng mã ngôn ngữ ngắn
			checkWhitelist: true,
			whitelist: ["en", "vi"], // Danh sách ngôn ngữ được hỗ trợ
		},

		backend: {
			loadPath: `${process.env.VITE_API_URL}/locales/{{lng}}/translation.json`,
		},

		// debug: true,
		interpolation: {
			escapeValue: false,
		},
	});

export default i18n;
