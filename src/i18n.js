import i18next from "i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import { userController } from "./controllers/userController";
import { EncryptStorage } from "encrypt-storage";

const encryptStorage1 = new EncryptStorage("secret-key", {
  prefix: "@instance1",
});

let json = {};
const loadResources = async (locale) => {
  return userController
    .getTranslations({ lng: locale })

    .then((response) => {
      return response.data.translations;
    });
};

const backendOptions = {
  loadPath: "{{lng}}|{{ns}}",
  request: (options, url, payload, callback) => {
    try {
      json = {};
      const [lng] = url.split("|");
      loadResources(lng).then((response) => {
        let labels = null;
        if (response) {
          labels = Array.from(response);
        }
        if (Object.keys(json).length !== 0) {
          json = {};
        }
        if (labels) {
          for (let i = 0; i < labels.length; i++) {
            if (json[labels[i].translationKey] === undefined) {
              json[labels[i].translationKey] = labels[i].translationValue;
            }
          }
        }

        callback(null, {
          data: json,
          status: 200,
        });
      });
    } catch (e) {
      console.error("translation " + e);
      callback(null, {
        status: 500,
      });
    }
  },
};

i18next
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    backend: backendOptions,

    fallbackLng: encryptStorage1.getItem("meditouch_user")
      ? encryptStorage1.getItem("meditouch_user").userInfo.userLanguage
      : "en",
    useSuspense: false,
    debug: false,
    load: "languageOnly",
    ns: ["translations"],
    defaultNS: "translations",
    keySeparator: false,
    interpolation: {
      escapeValue: false,
      formatSeparator: ",",
    },
    react: {
      wait: true,
    },

    supportedLngs: ["en", "ar", "fr", "gr"],
  });
export default i18next;
