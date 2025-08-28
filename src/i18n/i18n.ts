import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationEN from "./en.json";
import translationUA from "./ua.json";


import sidebar_en from "./en/sidebar.json";
import sidebar_ua from "./ua/sidebar.json";
import feed_en from "./en/feed.json";
import feed_ua from "./ua/feed.json";
import support_en from "./en/support.json";
import support_ua from "./ua/support.json";
import adminEn from "./en/admin.json";
import adminUa from "./ua/admin.json";
import comments_en from "./en/comments.json";
import comments_ua from "./ua/comments.json";
import home_en from "./en/home.json";
import home_ua from "./ua/home.json";
import auth_en from "./en/auth.json";
import auth_ua from "./ua/auth.json";
import subscriptions_en from "./en/subscriptions.json";
import subscriptions_ua from "./ua/subscriptions.json";
import payment_en from "./en/payments.json";
import payment_ua from "./ua/payments.json";
import success_en from "./en/success.json";
import success_ua from "./ua/success.json";
const resources = {
  en: {
    translation: translationEN,
    sidebar: sidebar_en,
    feed: feed_en,
    support:support_en,
    admin:adminEn,
    comment:comments_en,
    home:home_en,
    auth:auth_en,
    subscriptions: subscriptions_en,
    payments:payment_en,
    success:success_en,
  },
  ua: {
    translation: translationUA,
    sidebar: sidebar_ua,
    feed: feed_ua,
    support: support_ua,
    admin:adminUa,
    comments:comments_ua,
    home:home_ua,
    auth:auth_ua,
    subscriptions: subscriptions_ua,
    payments:payment_ua,
    success:success_ua,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("language") || "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  debug: false, 
  ns: ["translation", "sidebar", "feed", "support", "admin", "comment", "home", "auth","subscriptions"],
});

export default i18n;
