import { defineStore } from 'pinia';

function isClientSide() {
    return typeof window !== 'undefined';
}
function safeLocalStorageGetItem(key: string) {
    if (isClientSide()) {
        return localStorage.getItem(key);
    }
    return null;
}
function safeLocalStorageSetItem(key: string, value: string) {
    if (isClientSide()) {
        localStorage.setItem(key, value);
    }
}
function safeLocalStorageRemoveItem(key: string) {
    if (isClientSide()) {
        localStorage.removeItem(key);
    }
}
function safeLocalStorageClear(): void {
    try {
        localStorage.clear();
    } catch (e) {
        console.warn("Error accessing localStorage", e);
    }
}

export const useCookieStore = defineStore('cookie', {
    state: () => ({
        cookies: [
            { name: 'marketing', value: false, class: 'm' },
            { name: 'ip', value: false, class: 'i' },
            { name: 'country', value: false, class: 'c' },
            { name: 'timezone', value: false, class: 't' },
            { name: 'time', value: false, class: 'tt' },
            { name: 'spenttime', value: false, class: 'st' },
            { name: 'performance', value: false, class: 'p' },
            { name: 'themes', value: false, class: 'th' },
            { name: 'prefers', value: false, class: 'pr' },
            { name: 'langs', value: true, class: 'l' },
            { name: 'listeners', value: true, class: 'li' },
            { name: 'animations', value: true, class: 'a' },
            { name: 'transitions', value: true, class: 't' },
            { name: 'blur', value: true, class: 'b' },
        ],
        clicks: false,
        localStorageEnabled: true,
        localstorage: (() => {
            const rawValue = safeLocalStorageGetItem('localstorage');
            if (rawValue === null || rawValue === undefined) {
                return true;
            }
            const value = JSON.parse(rawValue);
            return value;
        })(),
    }),
    getters: {
        isCookieActive: (state) => (name: string) => {
            const cookieItem = state.cookies.find(c => c.name === name);
            return cookieItem ? cookieItem.value : false;
        },
        activeMarketingCookies: (state) => {
            return state.cookies.some(cookie =>
                ['marketing', 'ip', 'country', 'timezone', 'time', 'spenttime'].includes(cookie.name) && cookie.value
            );
        },
        activePerformanceCookies: (state) => {
            return state.cookies.some(cookie =>
                ['performance', '', 'prefers', 'langs', 'listeners', 'animations', 'transitions', 'blur'].includes(cookie.name) && cookie.value
            );
        },
    },
    actions: {
        initializeCookies() {
            const savedCookies = safeLocalStorageGetItem('cookies');
            if (savedCookies) {
                this.cookies = JSON.parse(savedCookies);
                this.updateDocumentClasses();
            }
        },
        toggleCookie(name: string) {
            const cookie = this.cookies.find(c => c.name === name);
            if (cookie) {
                cookie.value = !cookie.value;
                /* const page = usePagesStore(); */
                /* if (name === 'themes' && !cookie.value) {
                    const prefersCookie = this.cookies.find(c => c.name === 'prefers');
                    if (prefersCookie) {
                        prefersCookie.value = false;
                    }
                    page.setTheme('light');
                }

                if ((name === 'themes' && !cookie.value) || (name === 'prefers' && !cookie.value)) {
                    const page = usePagesStore();
                    const themesState = page.states.find(el => el.btn === 'themes');
                    if (themesState) {
                        themesState.activemenu = false;
                    }
                }

                if ((name === 'themes' && cookie.value) || (name === 'prefers' && cookie.value)) {
                    this.updateThemeBasedOnPrefers();
                } */
                this.updateDocumentClasses();
                safeLocalStorageSetItem('cookies', JSON.stringify(this.cookies));

                
            }
        },
        updateThemeBasedOnPrefers() {
            /* const page = usePagesStore();
            const prefersCookie = this.cookies.find(c => c.name === 'prefers');
            const themesCookie = this.cookies.find(c => c.name === 'themes');

            if ((themesCookie && !themesCookie.value) || (prefersCookie && !prefersCookie.value)) {
                page.setTheme('light');
            } else if (prefersCookie && prefersCookie.value) {
                const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
                page.setTheme(prefersDarkMode ? 'dark' : 'light');
            } else {
                page.setTheme('light');
            } */
        },
        acceptAllCookies() {
            this.cookies.forEach(cookie => cookie.value = true);
            this.updateDocumentClasses();
            this.updateThemeBasedOnPrefers();
            safeLocalStorageSetItem('cookies', JSON.stringify(this.cookies));
        },
        declineAllCookies() {
            this.cookies.forEach(cookie => cookie.value = false);
            this.updateThemeBasedOnPrefers();
            this.updateDocumentClasses();
            safeLocalStorageSetItem('cookies', JSON.stringify(this.cookies));
        },
        acceptAllMarketingCookies() {
            const marketingCookies = ['marketing', 'ip', 'country', 'timezone', 'time', 'spenttime'];
            this.cookies.forEach(cookie => {
                if (marketingCookies.includes(cookie.name)) {
                    cookie.value = true;
                }
            });
            this.updateDocumentClasses();
            safeLocalStorageSetItem('cookies', JSON.stringify(this.cookies));
        },
        declineAllMarketingCookies() {
            const marketingCookies = ['marketing', 'ip', 'country', 'timezone', 'time', 'spenttime'];
            this.cookies.forEach(cookie => {
                if (marketingCookies.includes(cookie.name)) {
                    cookie.value = false;
                }
            });
            this.updateThemeBasedOnPrefers();
            this.updateDocumentClasses();
            safeLocalStorageSetItem('cookies', JSON.stringify(this.cookies));
        },
        acceptAllPerformanceCookies() {
            const performanceCookies = ['performance', '', 'prefers', 'langs', 'listeners', 'animations', 'transitions', 'blur'];
            this.cookies.forEach(cookie => {
                if (performanceCookies.includes(cookie.name)) {
                    cookie.value = true;
                }
            });
            this.updateThemeBasedOnPrefers();
            this.updateDocumentClasses();
            safeLocalStorageSetItem('cookies', JSON.stringify(this.cookies));
        },
        declineAllPerformanceCookies() {
            const performanceCookies = ['performance', '', 'prefers', 'langs', 'listeners', 'animations', 'transitions', 'blur'];
            this.cookies.forEach(cookie => {
                if (performanceCookies.includes(cookie.name)) {
                    cookie.value = false;
                }
            });
            this.updateThemeBasedOnPrefers();
            this.updateDocumentClasses();
            safeLocalStorageSetItem('cookies', JSON.stringify(this.cookies));
        },
        updateDocumentClasses() {
            // Remove all previous cookie classes
            this.cookies.forEach(cookie => {
                document.documentElement.classList.remove(cookie.class);
            });

            // Add classes based on individual cookie values
            this.cookies.forEach(cookie => {
                if (cookie.value) {
                    document.documentElement.classList.add(cookie.class);
                }
            });

            // Add 'm' if all marketing cookies are active
            const marketingCookies = ['marketing', 'ip', 'country', 'timezone', 'time', 'spenttime'];
            const allMarketingCookiesActive = marketingCookies.every(name => this.isCookieActive(name));
            if (allMarketingCookiesActive) {
                marketingCookies.forEach(name => {
                    const cookie = this.cookies.find(c => c.name === name);
                    if (cookie) {
                        document.documentElement.classList.remove(cookie.class);
                    }
                });
                document.documentElement.classList.add('m');
            }

            // Add 'p' if all performance cookies are active
            const performanceCookies = ['performance', 'themes', 'prefers', 'langs', 'listeners', 'animations', 'transitions', 'blur'];
            const allPerformanceCookiesActive = performanceCookies.every(name => this.isCookieActive(name));
            if (allPerformanceCookiesActive) {
                performanceCookies.forEach(name => {
                    const cookie = this.cookies.find(c => c.name === name);
                    if (cookie) {
                        document.documentElement.classList.remove(cookie.class);
                    }
                });
                document.documentElement.classList.add('p');
            }
        },
        
        updateLangBasedOnPrefers() {
            const page = usePagesStore();
            const langCookie = this.cookies.find(c => c.name === 'lang');
            if (langCookie) {
                if (langCookie.value) {
                    // Implement language change logic here if needed
                } else {
                    // Implement language change logic here if needed
                }
            }
        },
        setLocalStorageEnabled(value: boolean) {
            this.localstorage = value;
            safeLocalStorageSetItem('localstorage', JSON.stringify(value));
        },
        autoLocalStorage() {
            if (this.localStorageEnabled) {
                this.setLocalStorageEnabled(true);
            } else {
                this.setLocalStorageEnabled(false);
                safeLocalStorageClear();
            }
        },
    },
    /* persist: true, */
});
