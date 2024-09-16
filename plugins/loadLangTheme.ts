import { defineNuxtPlugin } from 'nuxt/app';
import { useRouter } from 'vue-router';
type Theme = "light" | "dark";

export default defineNuxtPlugin(() => {
  const router = useRouter();
  const page = usePagesStore();


  router.beforeEach((to, from, next) => {
    const supportedLanguages = ['sr', 'en', 'ru', 'de','tr','es','cn','fr','it'];
    const language = to.path.split('/')[1];

    if (supportedLanguages.includes(language)) {
      if (import.meta.client) {
        localStorage.setItem('language', language);
      }
      if(page.isLanguageValid(language)) {
        page.changeLanguage(language);
      }
    }
    if(import.meta.client && typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem("theme") as Theme | null;
      if (savedTheme && page.availableThemes.includes(savedTheme)) {
        document.documentElement.classList.add(savedTheme);
      }
    }
    
    next();
  });
});
