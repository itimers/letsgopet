import { usepage } from "@/stores/lang";

export async function useApiFetch<T>(path: string, options: any = {}) {
  const lang = usePagesStore();
  try {
    let headers: Record<string, string> = {
      "Accept": "application/json",
      "Content-Type": "application/json",
    };

    const token = useCookie('XSRF-TOKEN');
    if (token.value) {
      headers['X-XSRF-TOKEN'] = token.value;
    }

    if (process.server) {
      const requestHeaders = useRequestHeaders(["referer", "cookie"]);
      headers = { ...headers, ...requestHeaders };
    }

    const response = await $fetch<T>("http://localhost:8000" + path, {
      credentials: "include",
      watch: false,
      immediate: false,
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });
    /* if (response && auth.isLoggedIn) {
     //console.log("Response...");
      
    } else if(!response && !auth.isLoggedIn) {
      //console.log("No response...");
      auth.logoutUser();
      navigateTo('/uloguj-se');
      //auth.moveToLoginPage();
      //language.toLogin();
    } else if(!response && auth.isLoggedIn) {
      
    } else if(response && !auth.isLoggedIn) {
      auth.logoutUser();
      navigateTo('/uloguj-se');
      //auth.moveToLoginPage();
      //language.toLogin();
    } */
    return response;
  } catch (error: any) {

    if (error?.response?.status === 401) {
      console.error("Unauthorized access. Redirecting to login page...");
      navigateTo('/login');
      /* auth.moveToLoginPage(); */
    } 
    //console.error("useApiFetch error:", error);
    console.error("useApiFetch error:");
    throw error;
  }
}
