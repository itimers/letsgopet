import { defineStore } from 'pinia';
export type Language = 'sr' | 'en' | 'ru' | 'de' | 'tr' | 'it';
type Theme = 'light' | 'dark';
const getDefaultLanguage = (): string => {
  if (import.meta.client && typeof localStorage !== 'undefined') {
    const storedLanguage = localStorage.getItem('lang') || navigator.language.split('-')[0];
    return ['sr', 'en', 'ru', 'de', 'tr', 'it'].includes(storedLanguage) ? storedLanguage : 'sr';
  }
  return 'sr';
};
export const usePagesStore = defineStore('pages', {
  state: () => ({
    currentLanguage: getDefaultLanguage() as Language,
    currentTheme: 'light' as Theme,
    availableThemes: ['light', 'dark'] as Theme[],
    sectionCount: 0,
    currentSection: 1,
    activeSection: 0,
    activeSectionsByPage: {} as Record<number, number[]>,
    sections: [] as any[],
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
    loadingTime: 50,
    savedStates: [] as any[],
    states: [
      { id: 1, btn: 'firstloader', menu: 'firstloaderdiv', activebtn: true, activemenu: true, delayActive: 50, delayRemoveActive: 300, zIndex: 9999, keepZindex: true, resetable: false, localstorage: false },
      { id: 8, btn: 'locales', menu: 'localesdiv', activebtn: false, activemenu: false, delayActive: 50, delayRemoveActive: 300, zIndex: -1, keepZindex: false, resetable: true, localstorage: true },
      { id: 9, btn: 'burger', menu: 'burgerdiv', activebtn: false, activemenu: false, delayActive: 50, delayRemoveActive: 300, zIndex: -1, keepZindex: false, resetable: true, localstorage: true },
    ] as any[],
    page: 1,
  }),
  actions: {
    setFirstLoaderState(isActive: boolean) {
      const element = this.states.find(el => el.btn === 'firstloader');
      if (!element) return;
      const updateState = (active: boolean, menu: boolean, delay: number) => setTimeout(() => this.updateActiveElement(menu ? 'firstloaderdiv' : 'firstloader', active, menu), delay);
      if (isActive) {
        element.activemenu = false;
        updateState(false, true, 50);
        updateState(false, false, element.delayRemoveActive);
        if (!element.keepZindex) element.zIndex = -1;
      } else {
        element.activemenu = false;
        updateState(true, false, 50);
        updateState(true, true, 50);
        setTimeout(() => {
          element.activemenu = true;
          if (!element.keepZindex) element.zIndex = 8000;
          this.states.forEach(el => el.menu !== 'firstloaderdiv' && el.activemenu && !el.keepZindex && (el.zIndex -= 1));
        }, 50);
      }
    },
    initializeActiveElements() {
      const storedStatesJSON = localStorage.getItem('states');
      if (storedStatesJSON && storedStatesJSON !== '[]') {
        const storedStates = JSON.parse(storedStatesJSON);
        this.states.forEach(state => {
          const storedState = storedStates.find((st: any) => st.id === state.id);
          if (storedState && state.localstorage) Object.assign(state, storedState);
        });
      } else {
        this.states = JSON.parse(JSON.stringify(this.states));
      }
      this.states.forEach(state => state.keepZindex && (state.zIndex = this.states.find(el => el.id === state.id)?.zIndex || state.zIndex));
    },
    refreshFromLocalStorage() {
      const storedStatesJSON = localStorage.getItem('states');
      if (storedStatesJSON && storedStatesJSON !== '[]') {
        const storedStates = JSON.parse(storedStatesJSON);
        this.states.forEach(state => {
          const storedState = storedStates.find((st: any) => st.id === state.id);
          if (storedState && state.localstorage) Object.assign(state, storedState);
        });
        this.initializeActiveElements();
      }
    },
    updateActiveElement(buttonClass: string, isActive: boolean, isMenu: boolean) {
      const element = this.states.find(el => el.btn === buttonClass || el.menu === buttonClass);
      if (element) {
        element[isMenu ? 'activemenu' : 'activebtn'] = isActive;
        if (element.localstorage) {
          setTimeout(() => {
            localStorage.setItem('states', JSON.stringify(this.states.filter(el => el.localstorage)));
          }, isActive ? element.delayActive : element.delayRemoveActive);
        }
      }
    },
    toggleElementVisibility(buttonClass: string) {
      const element = this.states.find(el => el.btn === buttonClass);
      if (!element) return;

      const relatedElementClass = element.menu;
      if (element.activemenu) {
        element.activemenu = false;
        setTimeout(() => {
          this.updateActiveElement(relatedElementClass, false, true);
          setTimeout(() => {
            this.updateActiveElement(buttonClass, false, false);
            if (!element.keepZindex) element.zIndex = -1;
            if (element.localstorage) localStorage.setItem('states', JSON.stringify(this.states.filter(el => el.localstorage)));
          }, element.delayRemoveActive);
        }, 50);
      } else {
        this.updateActiveElement(buttonClass, true, false);
        setTimeout(() => {
          this.updateActiveElement(relatedElementClass, true, true);
          setTimeout(() => {
            element.activemenu = true;
            if (!element.keepZindex) element.zIndex = 8000;
             
            this.states.forEach(el => {
              if (el.menu !== relatedElementClass && el.activemenu && !el.keepZindex) {
                el.zIndex -= 1;
              }
            });
            if (element.localstorage) localStorage.setItem('states', JSON.stringify(this.states.filter(el => el.localstorage)));
          }, 50);
        }, 50);
      }
    },
    resetActiveElements() {
      this.states.forEach(element => {
        if (element.resetable) {
          element.activemenu = false;
          setTimeout(() => {
            element.activebtn = false;
            if (element.localstorage) {
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
    changeLanguage(language: Language) {
      this.currentLanguage = language;
      localStorage.setItem('lang', language);
    },
    initializeLanguage() {
      const storedCurrentLanguage = localStorage.getItem('lang');
      const i18n = useI18n();
      if (storedCurrentLanguage && this.isLanguageValid(storedCurrentLanguage)) {
        this.currentLanguage = storedCurrentLanguage as Language;
        i18n.locale.value = this.currentLanguage;
      } else {
        this.currentLanguage = 'sr';
      }
    },
    isLanguageValid(language: string): language is Language {
      return ['sr', 'en', 'ru', 'de', 'tr', 'it'].includes(language);
    },
    setTheme(theme: Theme) {
      this.currentTheme = theme;
      document.documentElement.setAttribute('class', theme);
      localStorage.setItem('theme', theme);
    },
    initTheme() {
      const savedTheme = localStorage.getItem('theme') as Theme | null;
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.currentTheme = savedTheme && this.availableThemes.includes(savedTheme) ? savedTheme : prefersDarkMode ? 'dark' : 'light';
      document.documentElement.setAttribute('class', this.currentTheme);
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', this.handlePrefersColorSchemeChange, { passive: true });
    },
    handlePrefersColorSchemeChange(event: MediaQueryListEvent) {
      const prefersDarkMode = event.matches;
      const savedTheme = localStorage.getItem('theme') as Theme | null;
      if (!savedTheme || !this.availableThemes.includes(savedTheme)) {
        this.currentTheme = prefersDarkMode ? 'dark' : 'light';
        document.documentElement.setAttribute('class', this.currentTheme);
      }
    },
    changePage(newPage: number) {
      this.page = newPage;
      if (!this.activeSectionsByPage[newPage]) this.activeSectionsByPage[newPage] = [];
      if (!this.dynamicRootMarginsByPage[newPage]) this.dynamicRootMarginsByPage[newPage] = [];
      this.countSections();
    },
    setCustomRootMargin(sectionId: number, rootMargin: string) {
      if (!this.dynamicRootMarginsByPage[this.page]) this.dynamicRootMarginsByPage[this.page] = [];
      this.dynamicRootMarginsByPage[this.page][sectionId] = rootMargin;
    },
    countSections() {
      if (this.isScrolling) return;
      const sections = document.querySelectorAll('[data-section-id]');
      this.sectionCount = sections.length;
      const dynamicRootMargins: string[] = [];
      sections.forEach((section) => {
        const sectionId = section.getAttribute('data-section-id');
        if (sectionId) {
          const sectionHeight = section.clientHeight;
          this.sectionHeights[sectionId] = sectionHeight;
          dynamicRootMargins.push(`0px 0px ${-sectionHeight / 4}px 0px`);
        }
      });
      this.dynamicRootMarginsByPage[this.page] = dynamicRootMargins;
    },
    setSectionNames(names: string[]) {
      this.sectionNames = names;
    },
    setSectionIds(id: string[]) {
      this.sectionIds = id;
    },
    changeSectionDelay(newSection: number) {
      this.currentSection = newSection;
      const activeAllSections = this.sectionCount === this.activeSectionsByPage[this.page].length;
      this.activeAllSections = activeAllSections;
      setTimeout(() => {
        this.toggleActiveSections();
      }, 100);
      setTimeout(() => {
        if (this.activeAllSections) {
          this.scrollToTargetSection(newSection.toString());
        } else {
          setTimeout(() => {
            this.scrollToTargetSection(newSection.toString());
          }, 300);
        }
      }, 1200)
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
        const event = new CustomEvent('scroll-target-section');
        window.dispatchEvent(event);
      }
      setTimeout(() => {
        this.isScrolling = false;
      }, 1500);
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
      if (this.activeSection !== sectionId) {
        this.activeSection = sectionId;
        this.currentSection = sectionId;
      }
    },
    addActiveSection(sectionId: number) {
      if (!this.activeSectionsByPage[this.page]) this.activeSectionsByPage[this.page] = [];
      if (!this.activeSectionsByPage[this.page].includes(sectionId)) this.activeSectionsByPage[this.page].push(sectionId);
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
        this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        //console.log(`Scroll direction: ${this.scrollDirection}`);
      }
    },
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
    },
    scrollTop() {
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
    },
    scrollBottom() {
      const bottomElement = document.querySelector(".bottom") as HTMLElement | null;
      if (bottomElement) {
        bottomElement.scrollIntoView({ behavior: "smooth" });
      }
    },
    setSizes() {
      this.setDimensions(".main", "height", "heightofMain");
      this.setDimensions("header", "height", "heightofNav");
      this.setDimensions("html", "width", "widthofHtml");
      this.setDimensions("html", "height", "heightofHtml");
      this.setDimensions(".main", "width", "widthofMain");
    },
    setDimensions(elementSelector: string, dimensionType: "height" | "width", targetProperty: "heightofMain" | "heightofNav" | "heightofHtml" | "widthofMain" | "widthofHtml") {
      const element = document.querySelector(elementSelector) as HTMLElement | null;
      if (element) {
        this[targetProperty] = dimensionType === "height" ? element.clientHeight : element.clientWidth;
      }
    },
  },
  getters: {
    language: (state) => state.currentLanguage,
    isButtonDisabled: state => (buttonId: number) => state.buttonsDisabled || state.activeSection === buttonId,
  },
});
