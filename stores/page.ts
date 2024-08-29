import { defineStore } from 'pinia';

type Theme = 'light' | 'dark';

function getDefaultLanguage(): string {
  if (import.meta.client) {
    if (typeof localStorage !== 'undefined') {
      const storedLanguage = localStorage.getItem('lang');
      if (storedLanguage) {
        return storedLanguage;
      }
    }
    const browserLanguage = navigator.language.split('-')[0];
    return ['sr', 'en', 'ru', 'de', 'tr', 'es', 'cn', 'fr', 'it'].includes(browserLanguage) ? browserLanguage : 'sr';
  }
  return 'sr';
}


export const usePagesStore = defineStore('pages', {
  state: () => ({
    isMobile: false,
    mobileDevices: [
      /android/i,
      /webos/i,
      /iphone/i,
      /ipad/i,
      /ipod/i,
      /blackberry/i,
      /iemobile/i,
      /opera mini/i,
      /windows phone/i,
      /symbian/i,
      /palm/i
    ],
    isSlider: false,
    currentLanguage: getDefaultLanguage(),
    currentTheme: 'light' as Theme,
    availableThemes: ['light', 'dark'] as Theme[],
    page: 1,
    sectionCount: 0,
    currentSection: 1,
    activeSection: 0,
    activeSectionsByPage: {} as Record<number, number[]>,
    sections: [] as any[], // Inicijalizovani kao prazan niz
    sectionHeights: {} as Record<string, number>,
    pagesToResetAllSections: [0],
    sectionNames: [] as string[],
    sectionIds: [] as string[],
    dynamicRootMarginsByPage: {} as Record<number, string[]>,

    lastScrollTop: 0,
    scrollDirection: '',
    currentScroll: 0,
    scrollProgress: 0,
    isScrolling: false,
    isScrollable: false,
    isScrolled: false,
    isScrollingTopBottom: true,

    heightofMain: 0,
    heightofNav: 0,
    widthofMain: 0,
    widthofHtml: 0,
    heightofHtml: 0,
    buttonsDisabled: false,

    activeAllSections: false,

    isLoader: false,
    isLoadingAnimation: true,
    isLoading: true,
    isLoaded: false,
    loadingTime: 300,
    waitTime: 1000,

    isLoaderPage: false,
    isLoadingAnimationPage: true,
    isLoadingPage: true,
    isLoadedPage: false,
    loadingTimePage: 300,
    waitTimePage: 1000,
    savedStates: [] as any[],
    states: [
      {
        id: 1,
        btn: 'cookie',
        menu: 'cookiediv',
        activebtn: true,
        activemenu: true,
        delayActive: 50,
        delayRemoveActive: 300,
        zIndex: 9800,
        keepZindex: true,
        resetable: false,
        localstorage: true,
      },
      {
        id: 2,
        btn: 'firstloader',
        menu: 'firstloaderdiv',
        activebtn: true,
        activemenu: true,
        delayActive: 50,
        delayRemoveActive: 300,
        zIndex: 9999,
        keepZindex: true,
        resetable: false,
        localstorage: false,
      },
      {
        id: 3,
        btn: 'page',
        menu: 'pagediv',
        activebtn: false,
        activemenu: false,
        delayActive: 50,
        delayRemoveActive: 300,
        zIndex: -1,
        keepZindex: false,
        resetable: true,
        localstorage: true,
      },
      {
        id: 4,
        btn: 'fetching',
        menu: 'fetchingdiv',
        activebtn: false,
        activemenu: false,
        delayActive: 50,
        delayRemoveActive: 300,
        zIndex: -1,
        keepZindex: false,
        resetable: true,
        localstorage: true,
      },
      {
        id: 5,
        btn: 'error',
        menu: 'errordiv',
        activebtn: false,
        activemenu: false,
        delayActive: 50,
        delayRemoveActive: 300,
        zIndex: -1,
        keepZindex: false,
        resetable: true,
        localstorage: true,
      },
      {
        id: 6,
        btn: 'settings',
        menu: 'settingsdiv',
        activebtn: false,
        activemenu: false,
        delayActive: 50,
        delayRemoveActive: 300,
        zIndex: -1,
        keepZindex: false,
        resetable: true,
        localstorage: true,
      },
      {
        id: 7,
        btn: 'themes',
        menu: 'themesdiv',
        activebtn: false,
        activemenu: false,
        delayActive: 50,
        delayRemoveActive: 300,
        zIndex: -1,
        keepZindex: false,
        resetable: true,
        localstorage: true,
      },
      {
        id: 8,
        btn: 'locales',
        menu: 'localesdiv',
        activebtn: false,
        activemenu: false,
        delayActive: 50,
        delayRemoveActive: 300,
        zIndex: -1,
        keepZindex: false,
        resetable: true,
        localstorage: true,
      },
      {
        id: 9,
        btn: 'burger',
        menu: 'burgerdiv',
        activebtn: false,
        activemenu: false,
        delayActive: 50,
        delayRemoveActive: 300,
        zIndex: -1,
        keepZindex: false,
        resetable: true,
        localstorage: true,
      },
      {
        id: 10,
        btn: 'linkmenu',
        menu: 'linkmenudiv',
        activebtn: false,
        activemenu: false,
        delayActive: 50,
        delayRemoveActive: 300,
        zIndex: -1,
        keepZindex: false,
        resetable: true,
        localstorage: true,
      },
      {
        id: 11,
        btn: 'infusions',
        menu: 'infusionsdiv',
        activebtn: false,
        activemenu: false,
        delayActive: 50,
        delayRemoveActive: 300,
        zIndex: -1,
        keepZindex: false,
        resetable: true,
        localstorage: true,
      },
      {
        id: 12,
        btn: 'surgery',
        menu: 'surgerydiv',
        activebtn: false,
        activemenu: false,
        delayActive: 50,
        delayRemoveActive: 300,
        zIndex: -1,
        keepZindex: false,
        resetable: true,
        localstorage: true,
      },
      {
        id: 13,
        btn: 'services',
        menu: 'servicesdiv',
        activebtn: false,
        activemenu: false,
        delayActive: 50,
        delayRemoveActive: 300,
        zIndex: -1,
        keepZindex: false,
        resetable: true,
        localstorage: true,
      },
      {
        id: 14,
        btn: 'slider',
        menu: 'sliderdiv',
        activebtn: false,
        activemenu: false,
        delayActive: 50,
        delayRemoveActive: 300,
        zIndex: -1,
        keepZindex: false,
        resetable: true,
        localstorage: true,
      },
      {
        id: 15,
        btn: 'syncslides',
        menu: 'syncslidesdiv',
        activebtn: false,
        activemenu: false,
        delayActive: 50,
        delayRemoveActive: 300,
        zIndex: -1,
        keepZindex: false,
        resetable: true,
        localstorage: true,
      },
      {
        id: 16,
        btn: 'closedslides',
        menu: 'closedslidesdiv',
        activebtn: false,
        activemenu: false,
        delayActive: 50,
        delayRemoveActive: 300,
        zIndex: -1,
        keepZindex: false,
        resetable: true,
        localstorage: true,
      },
      {
        id: 17,
        btn: 'closedcards',
        menu: 'closedcardsdiv',
        activebtn: false,
        activemenu: false,
        delayActive: 50,
        delayRemoveActive: 300,
        zIndex: -1,
        keepZindex: false,
        resetable: true,
        localstorage: true,
      },
    ] as any[],

    links: [

    ]
  }),

  actions: {
    isMobileDevice() {
      const slider = useSlidesStore();
      const userAgent = navigator.userAgent || navigator.vendor;
      const foundMobileDevice = this.mobileDevices.some(device => device.test(userAgent));
    
      if (foundMobileDevice) {
        this.isMobile = true;
        if(this.page === 1) {
          slider.isMobile = true;
        }
      } else {
        this.isMobile = false;
        if(this.page === 1) {
          slider.isMobile = false;
        }
        // Ako nije pronađen mobilni uređaj, oslanjamo se na širinu prozora
        /* this.isMobile = window.innerWidth < 1024;
        if(this.page === 1) {
          slider.isMobile = window.innerWidth < 1024;
        } */
      }
    
      if (this.isMobile) {
        console.log('Korisnik je na mobilnom uređaju');
      } else {
        console.log('Korisnik je na desktop uređaju');
      }
    },
    setFirstLoaderState(isActive: boolean) {
      const element = this.states.find(el => el.btn === 'firstloader');
      if (!element) return;

      if (isActive) {
        element.activemenu = false;
        setTimeout(() => {
          this.updateActiveElement('firstloader', false, true);
          setTimeout(() => {
            this.updateActiveElement('firstloaderdiv', false, false);
            if (!element.keepZindex) {
              element.zIndex = -1;
            }
          }, element.delayRemoveActive);
        }, 50);
      } else {
        element.activemenu = false;
        this.updateActiveElement('firstloader', true, false);
        setTimeout(() => {
          this.updateActiveElement('firstloaderdiv', true, true);
          setTimeout(() => {
            element.activemenu = true;
            if (!element.keepZindex) {
              element.zIndex = 8000;
            }
            this.updateZIndex();
            this.states.forEach(el => {
              if (el.menu !== 'firstloaderdiv' && el.activemenu && !el.keepZindex) {
                el.zIndex -= 1;
              }
            });
          }, 50);
        }, 50);
      }
    },

    initializeActiveElements() {
      const cookie = useCookieStore();
      if (cookie.localstorage) {
        const storedStatesJSON = localStorage.getItem('states');
        if (storedStatesJSON && storedStatesJSON !== '[]') {
          const storedStates = JSON.parse(storedStatesJSON);
          this.states.forEach(state => {
            const storedState = storedStates.find((st: any) => st.id === state.id);
            if (storedState && state.localstorage) {
              Object.assign(state, storedState);
            }
          });
        }
      } else {
        this.states = JSON.parse(JSON.stringify(this.states));
      }
      // Vraćanje zIndex vrednosti na inicijalne za one koji imaju keepZindex: true
      this.states.forEach(state => {
        if (state.keepZindex) {
          const originalState = this.states.find(el => el.id === state.id);
          if (originalState) {
            state.zIndex = originalState.zIndex;
          }
        }
      });
    },

    refreshFromLocalStorage() {
      const cookie = useCookieStore();
      if (cookie.localstorage) {
        const storedStatesJSON = localStorage.getItem('states');
        if (storedStatesJSON && storedStatesJSON !== '[]') {
          const storedStates = JSON.parse(storedStatesJSON);
          this.states.forEach(state => {
            const storedState = storedStates.find((st: any) => st.id === state.id);
            if (storedState && state.localstorage) {
              Object.assign(state, storedState);
            }
          });
          this.initializeActiveElements();
        }
      }
    },

    updateActiveElement(buttonClass: string, isActive: boolean, isMenu: boolean) {
      const cookie = useCookieStore();
      const element = this.states.find(el => el.btn === buttonClass || el.menu === buttonClass);
      if (element) {
        if (isMenu) {
          element.activemenu = isActive;
        } else {
          element.activebtn = isActive;
        }
        if (element.localstorage && cookie.localstorage) {
          setTimeout(() => {
            localStorage.setItem('states', JSON.stringify(this.states.filter(el => el.localstorage)));
          }, isActive ? element.delayActive : element.delayRemoveActive);
        }
      }
    },

    toggleElementVisibility(buttonClass: string) {
      const cookie = useCookieStore();
      const element = this.states.find(el => el.btn === buttonClass);
      if (!element) return;

      const relatedElementClass = element.menu;

      if (element.activemenu) {
        element.activemenu = false;
        setTimeout(() => {
          this.updateActiveElement(relatedElementClass, false, true);
          setTimeout(() => {
            this.updateActiveElement(buttonClass, false, false);
            if (!element.keepZindex) {
              element.zIndex = -1;
            }
            this.updateZIndex();
            if (element.localstorage && cookie.localstorage) {
              localStorage.setItem('states', JSON.stringify(this.states.filter(el => el.localstorage)));
            }
          }, element.delayRemoveActive);
        }, 50);
      } else {
        this.updateActiveElement(buttonClass, true, false);
        setTimeout(() => {
          this.updateActiveElement(relatedElementClass, true, true);
          setTimeout(() => {
            element.activemenu = true;
            if (!element.keepZindex) {
              element.zIndex = 8000;
            }
            this.updateZIndex();
            this.states.forEach(el => {
              if (el.menu !== relatedElementClass && el.activemenu && !el.keepZindex) {
                el.zIndex -= 1;
              }
            });
            if (element.localstorage && cookie.localstorage) {
              localStorage.setItem('states', JSON.stringify(this.states.filter(el => el.localstorage)));
            }
          }, 50);
        }, 50);
      }
    },
    /* updateZIndex() {
      const activeElements = this.states
        .filter(element => element.activemenu && !element.keepZindex)
        .sort((a, b) => b.zIndex - a.zIndex);
  
      activeElements.forEach((element, index) => {
        element.zIndex = 8000 - index;
      });
      localStorage.setItem('states', JSON.stringify(this.states.filter(el => el.localstorage)));
    }, */
    updateZIndex() {
      // Prvo sačuvaj trenutne zIndex vrednosti elemenata sa keepZindex: true
      const keepZindexElements = this.states
        .filter(element => element.keepZindex)
        .map(element => ({
          id: element.id,
          zIndex: element.zIndex
        }));
      keepZindexElements.forEach(({ id, zIndex }) => {
        const element = this.states.find(el => el.id === id);
        if (element) {
          element.zIndex = zIndex;
        }
      });
      // Ažuriraj zIndex vrednosti za elemente sa keepZindex: false
      /* const activeElements = this.states
        .filter(element => element.activemenu && !element.keepZindex)
        .sort((a, b) => b.zIndex - a.zIndex);
  
      activeElements.forEach((element, index) => {
        element.zIndex = 8000 - index;
      }); */

      // Vratite originalne zIndex vrednosti za elemente sa keepZindex: true


      localStorage.setItem('states', JSON.stringify(this.states.filter(el => el.localstorage)));
    },

    resetActiveElements() {
      this.states.forEach(element => {
        if (element.resetable) {
          element.activemenu = false;
          setTimeout(() => {
            element.activebtn = false;
            const cookie = useCookieStore();
            if (element.localstorage && cookie.localstorage) {
              localStorage.setItem('states', JSON.stringify(this.states.filter(el => el.localstorage)));
            }
          }, element.delayRemoveActive);
        }
      });
    },

    handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      let clickedInside = false;

      this.states.forEach(element => {
        const btnElement = document.querySelector(`.${element.btn}`);
        const menuElement = document.querySelector(`.${element.menu}`);

        if (btnElement && btnElement.contains(target)) {
          clickedInside = true;
        } else {
          this.resetActiveElements();
        }

        if (menuElement && menuElement.contains(target)) {
          clickedInside = true;
        } else {
          this.resetActiveElements();
        }
      });

      if (!clickedInside) {
        this.resetActiveElements();
      }
    },

    bringToFront(element: { zIndex: number; id: any; }) {
      const activeElements = this.states
        .filter(el => el.activemenu && !el.keepZindex)
        .sort((a, b) => b.zIndex - a.zIndex);

      element.zIndex = 8000;

      let currentZIndex = 7999;
      activeElements.forEach(el => {
        if (el.id !== element.id) {
          el.zIndex = currentZIndex;
          currentZIndex -= 1;
        }
      });

      localStorage.setItem('states', JSON.stringify(this.states.filter(el => el.localstorage)));
    },





    //& Change language
    changeLanguage(language: string) {
      this.currentLanguage = language;
      const cookie = useCookieStore();
      if (typeof localStorage !== 'undefined') {
        if (cookie.localstorage) {
          localStorage.setItem('lang', language);
        }
      }
    },
    initializeLanguage() {
      const cookie = useCookieStore();
      if (cookie.isCookieActive('langs')) {
        const storedCurrentLanguage = localStorage.getItem('lang');
        const i18n = useI18n();

        if (storedCurrentLanguage) {
          this.currentLanguage = getDefaultLanguage();
          i18n.locale.value = this.currentLanguage;
        } else {
          this.currentLanguage = 'sr'
        }
      }
    },


    //& Change theme
    setTheme(theme: Theme) {
      const cookie = useCookieStore();
      this.currentTheme = theme;
      //this.$patch({ currentTheme: theme });
      document.documentElement.setAttribute('class', theme);
      if (cookie.localstorage) {
        //safeLocalStorageSetItem('theme', theme);
        localStorage.setItem('theme', theme);
      }
    },
    initTheme() {
      const cookie = useCookieStore();
      if (cookie.isCookieActive('themes')) {
        //^console.log("INIT THEME");
        const savedTheme = localStorage.getItem('theme') as Theme | null;
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        //^console.log("Prefers Dark Mode:", prefersDarkMode);  // Dodato za debagovanje

        if (savedTheme && this.availableThemes.includes(savedTheme)) {
          this.currentTheme = savedTheme;
        } else {
          this.currentTheme = prefersDarkMode ? 'dark' : 'light';
        }
        document.documentElement.setAttribute('class', this.currentTheme);
        //^console.log("Current Theme:", this.currentTheme); // Dodato za debagovanje


        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        if (cookie.isCookieActive('listeners')) {
          mediaQuery.addEventListener('change', this.handlePrefersColorSchemeChange, { passive: true });
        }
        //^console.log("Added Event Listener for Media Query:", mediaQuery);
      }
    },
    handlePrefersColorSchemeChange(event: MediaQueryListEvent) {
      const cookie = useCookieStore();
      if (cookie.isCookieActive('prefers')) {
        //^console.log("Theme Change Event Triggered", event.matches);
        const prefersDarkMode = event.matches;
        const savedTheme = localStorage.getItem('theme') as Theme | null;

        if (!savedTheme || !this.availableThemes.includes(savedTheme)) {
          this.currentTheme = prefersDarkMode ? 'dark' : 'light';
          document.documentElement.setAttribute('class', this.currentTheme);
        } else {
          this.currentTheme = prefersDarkMode ? 'dark' : 'light';
          document.documentElement.setAttribute('class', this.currentTheme);
        }
        //^console.log("Updated Theme on System Change:", this.currentTheme);
      }
    },

    //& Loading and Timings
    setLoader(value: boolean) {
      this.isLoader = value;
    },
    setLoadingAnimation(value: boolean) {
      this.isLoadingAnimation = value;
    },
    setLoading(value: boolean) {
      this.isLoading = value;
    },
    setLoaded(value: boolean) {
      this.isLoaded = value;
    },

    setLoadingNow() {
      this.setLoaded(false);
      this.setLoading(true);
      this.setLoadingAnimation(true);
    },
    setUILoaded() {
      setTimeout(() => {
        this.isLoadingAnimation = true;
      }, 50);
      setTimeout(() => {
        this.isLoadingAnimation = false;
      }, this.loadingTime + 20);
      setTimeout(() => {
        this.isLoading = false;
      }, this.loadingTime + 280);
      setTimeout(() => {
        this.isLoaded = true;
      }, this.loadingTime + 300);
    },




    setLoaderPage(value: boolean) {
      this.isLoaderPage = value;
    },
    setLoadingAnimationPage(value: boolean) {
      this.isLoadingAnimationPage = value;
    },
    setLoadingPage(value: boolean) {
      this.isLoadingPage = value;
    },
    setLoadedPage(value: boolean) {
      this.isLoadedPage = value;
    },

    setLoadingPageNow() {
      this.setLoadedPage(false);
      this.setLoadingPage(true);
      this.setLoadingAnimationPage(true);
    },
    setUILoadedPage() {
      /* setTimeout(() => {
          this.isLoadingAnimationPage = true;
      }, 50); */
      setTimeout(() => {
        this.isLoadingAnimationPage = false;
      }, 20);

      setTimeout(() => {
        this.isLoadingPage = false;
      }, this.loadingTimePage + 280);

      setTimeout(() => {
        this.isLoadedPage = true;
      }, this.loadingTimePage + 300);
    },

    //& Change page
    changePage(newPage: number) {
      this.page = newPage;

      if (!this.activeSectionsByPage[newPage]) {
        this.activeSectionsByPage[newPage] = [];
      }
      if (!this.dynamicRootMarginsByPage[newPage]) {
        this.dynamicRootMarginsByPage[newPage] = [];
      }

      this.countSections();
    },

    //& Custom margin
    setCustomRootMargin(sectionId: number, rootMargin: string) {
      if (!this.dynamicRootMarginsByPage[this.page]) {
        this.dynamicRootMarginsByPage[this.page] = [];
      }
      this.dynamicRootMarginsByPage[this.page][sectionId] = rootMargin;
    },

    //& Sections Logic
    countSections() {
      if (this.isScrolling) return;

      //if (isClientSide()) {
      const sections = document.querySelectorAll('[data-section-id]');
      this.sectionCount = sections.length;
      let totalHeight = 0;
      const dynamicRootMargins: string[] = [];

      sections.forEach((section) => {
        const sectionId = section.getAttribute('data-section-id');
        if (sectionId) {
          const sectionHeight = section.clientHeight;
          this.sectionHeights[sectionId] = sectionHeight;
          dynamicRootMargins.push(`0px 0px ${-sectionHeight / 4}px 0px`);
          totalHeight += sectionHeight;
        }
      });

      // Sačuvaj trenutne margine za trenutnu stranicu
      this.dynamicRootMarginsByPage[this.page] = dynamicRootMargins;
      // }
    },
    setSectionNames(names: string[]) {
      this.sectionNames = names;
    },
    setSectionIds(id: string[]) {
      this.sectionIds = id;
    },
    
    
    changeSectionDelay(newSection: number) {
      setTimeout(() => {
        this.currentSection = newSection;
        this.toggleActiveSections();
      }, 100);

      setTimeout(() => {
        this.scrollToTargetSection(newSection.toString());
        setTimeout(() => {
          this.scrollToTargetSection(newSection.toString());
        }, 500);
      }, 1200);

     
    },
    
    changeSection(newSection: number) {
      this.currentSection = newSection;
      const activeAllSections = this.sectionCount === this.activeSectionsByPage[this.page].length;
      this.toggleActiveSections();
      this.activeAllSections = activeAllSections;

      if (this.activeAllSections) {
        this.scrollToTargetSection(newSection.toString());
      } else {
        setTimeout(() => {
          this.scrollToTargetSection(newSection.toString());
        }, 300);
      }
    },

    scrollToTargetSection(targetId: string) {
      if (this.isScrolling) return;

      this.isScrolling = true;
      const targetSection = document.querySelector(`[data-section-id="${targetId}"]`) as HTMLElement | null;

      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
        this.setActiveSection(parseInt(targetId));

        // Emitovanje događaja po završetku skrolovanja
        const event = new CustomEvent('scroll-target-section');
        window.dispatchEvent(event);
      }

      setTimeout(() => {
        this.isScrolling = false;
      }, 1500);
    },
    
    async scrollToTargetPrice(targetId: string) {
      if (this.isScrolling) return;
      const router = useRouter();
      let path = '';

      if (this.currentLanguage === 'sr') {
        path = "/cenovnik";
      } else if (this.currentLanguage === 'en') {
        path = "/en/pricemenu";
      } else if (this.currentLanguage === 'ru') {
        path = "/ru/pricemenu";
      } else if (this.currentLanguage === 'de') {
        path = "/de/pricemenu";
      }

      try {
        await router.push(path); // Čekanje na završetak navigacije

        setTimeout(() => {
          const targetSection = document.getElementById(targetId);
          this.isScrolling = true; // Postavljamo zastavicu da je skrolovanje u toku
          this.buttonsDisabled = true; // Onemogućavamo dugmad za vreme skrolovanja

          if (targetSection) {
            targetSection.scrollIntoView({ behavior: "smooth" });
          }
          /* setTimeout(()=> {
            if (targetSection) {
              targetSection.scrollIntoView({ behavior: "smooth" });
            }
          },500) */
          setTimeout(() => {
            this.isScrolling = false; // Resetujemo zastavicu po završetku skrolovanja
            this.buttonsDisabled = false; // Ponovo omogućavamo dugmad
          }, 1000); // Podesite ovo vreme prema trajanju skrolovanja
        }, 1700); // Podesite ovo vreme prema potrebnom vremenu učitavanja stranice
      } catch (error) {
        console.error('Navigation error:', error);
      }
    },

    resetActiveSections() {
      if (this.pagesToResetAllSections.includes(this.page)) {
        this.activeSectionsByPage[this.page] = [];
        this.activeAllSections = false;
        this.activeSection = 0;
        this.currentSection = 0;
      } else {
        this.activeSectionsByPage[this.page] = [1];
        this.activeAllSections = false;
        this.activeSection = 1;
        this.currentSection = 1;
      }
      this.buttonsDisabled = false;
    },
    setActiveSection(sectionId: number) {
      if (this.activeSection === sectionId) return;

      this.activeSection = sectionId;
      this.currentSection = sectionId;
    },
    addActiveSection(sectionId: number) {
      if (!this.activeSectionsByPage[this.page]) {
        this.activeSectionsByPage[this.page] = [];
      }
      if (!this.activeSectionsByPage[this.page].includes(sectionId)) {
        this.activeSectionsByPage[this.page].push(sectionId);
      }
    },
    toggleActiveSections() {
      const totalSections = this.sectionCount;
      for (let i = 1; i <= totalSections; i++) {
        if (!this.activeSectionsByPage[this.page].includes(i)) {
          this.addActiveSection(i);
        }
      }
    },


    updateScrollDirection() {
      const mainElement = document.querySelector(".main") as HTMLElement | null;

      if (mainElement) {
        const scrollTop = window.scrollY || mainElement.scrollTop;
        if (scrollTop > this.lastScrollTop) {
          this.scrollDirection = 'down';
        } else if (scrollTop < this.lastScrollTop) {
          this.scrollDirection = 'up';
        }
        this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
        //console.log(`Scroll direction: ${this.scrollDirection}`); // Dodato logovanje
      }
    },



    //& Progress and Scroll
    setCurrentScrollLive(height: number) {
      this.currentScroll = height;
    },
    setCurrentProgressScroll(live: number) {
      this.scrollProgress = live;
    },

    setScrollable(value: boolean) {
      this.isScrollable = value;
    },
    setScrolled(value: boolean) {
      this.isScrolled = value;
      /* setTimeout(() => {
        this.setHeightOfNav(this.heightofNav);
      }, 300); */
    },

    scrollTop() {
      //if (isClientSide()) {
      this.isScrollingTopBottom = false;

      const topElement = document.querySelector(".top") as HTMLElement | null;

      if (topElement) {
        topElement.scrollIntoView({ behavior: "smooth" });
        if (this.activeSection === 1) {
          setTimeout(() => {
            this.resetActiveSections();
          }, 500);
        }
      }

      setTimeout(() => {
        this.isScrollingTopBottom = true;
      }, 1000)
      //}
    },
    scrollBottom() {
      //if (isClientSide()) {
      const bottomElement = document.querySelector(".bottom") as HTMLElement | null;
      if (bottomElement) {
        bottomElement.scrollIntoView({ behavior: "smooth" });
      }
      //}
    },





    //& Set dimensions
    setHeightOfMain() {
      //if (isClientSide()) {
      const mainElement = document.querySelector(".main") as HTMLElement | null;
      if (mainElement) {
        const height = mainElement.clientHeight;
        this.heightofMain = height;
      }
      //}
    },
    setHeightOfNav() {
      //if (isClientSide()) {
      const nav = document.querySelector("header") as HTMLElement | null;
      if (nav) {
        const height = nav.clientHeight;
        this.heightofNav = height;
      }
      //}
    },
    setWidthOfHtml() {
      //if (isClientSide()) {
      const htmlElement = document.documentElement as HTMLElement | null;
      if (htmlElement) {
        const width = htmlElement.clientWidth;
        this.widthofHtml = width;
      }
      //}
    },
    setHeightOfHtml() {
      //if (isClientSide()) {
      const htmlElement = document.documentElement as HTMLElement | null;
      if (htmlElement) {
        const height = htmlElement.clientHeight;
        this.heightofHtml = height;
      }
      //}
    },
    setWidthOfMain() {
      //if (isClientSide()) {
      const mainElement = document.querySelector(".main") as HTMLElement | null;
      if (mainElement) {
        const width = mainElement.clientWidth;
        this.widthofMain = width;
      }
      //}
    },

    setWidthOfCardWrapper() {
      //if (isClientSide()) {
      const slider = useSlidesStore();
      const cardWrapper = document.querySelector(".sliding-wrapper-cards") as HTMLElement | null;
      if (cardWrapper) {
        const width = cardWrapper.clientWidth;
        slider.setWidthCardWrapper(width);
      }
      //}
    },
    setWidthOfSliderWrapper() {
      //if (isClientSide()) {
      const slider = useSlidesStore();
      const slideWrapper = document.querySelector(".sliding-wrapper") as HTMLElement | null;
      if (slideWrapper) {
        const width = slideWrapper.clientWidth;
        slider.setWidthSliderWrapper(width);
      }
      //}
    },
  },

  getters: {
    language: (state) => state.currentLanguage,
    getCurrentTheme: (state) => state.currentTheme,

    setScrollableState: (state) => state.isScrollable,
    setScrolledState: (state) => state.isScrolled,
    setCurrentScroll: (state) => state.currentScroll,
    setProgressScroll: (state) => state.scrollProgress,
    setMainHeightState: (state) => state.heightofMain,
    setNavHeightState: (state) => state.heightofNav,
    setHtmlWidthState: (state) => state.widthofHtml,
    setHtmlHeightState: (state) => state.heightofHtml,
    setMainWidthState: (state) => state.widthofMain,
    isButtonDisabled: (state) => {
      return (buttonId: number) => {
        return state.buttonsDisabled || state.activeSection === buttonId;
      };
    },


    setLoaderState: (state) => state.isLoader,
    setLoadingAnimationState: (state) => state.isLoadingAnimation,
    setLoadingState: (state) => state.isLoading,
    setLoadedState: (state) => state.isLoaded,

    setLoaderPageState: (state) => state.isLoaderPage,
    setLoadingAnimationPageState: (state) => state.isLoadingAnimationPage,
    setLoadingPageState: (state) => state.isLoadingPage,
    setLoadedPageState: (state) => state.isLoadedPage,
  },
  //persist: true
});
