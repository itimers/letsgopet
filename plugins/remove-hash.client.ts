import { useRouter } from 'vue-router';

export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.client) {
    const router = useRouter();
    /* function removeHashFromUrl() {
      history.replaceState(history.state, '', window.location.pathname + window.location.search);
    }
    removeHashFromUrl(); */
    //console.log("BRISEM");
    /* router.afterEach((to, from) => {
      if (to.hash) {
        const url = to.fullPath.split('#')[0];
        history.replaceState(null, '', url);
      }
    }); */
  }
});
