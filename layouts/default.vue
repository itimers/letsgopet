<script lang="ts" setup>

//& CLEAN
type Theme = "dark" | "light";
const cookie = useCookieStore();
const page = usePagesStore();
const router = useRouter();
const scrollProgress = ref(0);
let scrollTimeout: string | number | NodeJS.Timeout | null | undefined = null;
let mutationObserver: MutationObserver;
const isScrollable = ref<HTMLElement | null>(null);
const currentTheme = computed(() => page.currentTheme);
const is1024 = computed(() => page.widthofHtml >= 1024);
const slider = useSlidesStore();
/* watch(is1024, (newVal) => {
  if (newVal) {
    page.updateActiveElement("sidemenu", false);
  }
}); */
const updateUrlWithSectionId = (sectionId: any) => {
  history.pushState(null, "", `#${sectionId}`);
};
function removeHashFromUrl() {
  history.replaceState(
    history.state,
    "",
    window.location.pathname + window.location.search
  );
}
function isPageScrollable() {
  if (isScrollable.value) {
    if (isScrollable.value.scrollHeight > isScrollable.value.clientHeight) {
      page.setScrollable(true);
      /* console.log("Da li je stranica skrolabilna: " + page.isScrollable); */
    } else {
      page.setScrollable(false);
      /* console.log("Da li je stranica skrolabilna: " + page.isScrollable); */
    }
  }
}
function handleScroll() {
  const mainElement = isScrollable.value;
  if (mainElement && mainElement.scrollTop !== undefined) {
    page.setScrolled(mainElement.scrollTop === 0);
    const scrollHeight = mainElement.scrollHeight || mainElement.scrollHeight;
    const clientHeight = mainElement.clientHeight || window.innerHeight;
    const scrollTop = mainElement.scrollTop || window.scrollY;
    let progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
    progress = parseFloat(progress.toFixed(2));

    scrollProgress.value = progress;
    page.setCurrentProgressScroll(progress);
    page.setScrolled(mainElement.scrollTop > 0);
    page.setCurrentScrollLive(mainElement.scrollTop);
    page.updateScrollDirection();
    /* console.log('Live scroll :' + mainElement.scrollTop); */

    if (!page.buttonsDisabled) {
      page.isScrolling = true;
    }

    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }

    scrollTimeout = setTimeout(() => {
      /* console.log("Skrolovano :" + mainElement.scrollTop); */
      page.isScrolling = false;
      scrollTimeout = null;
    }, 150);

    if (mainElement.scrollTop === 0) {
      page.resetActiveSections();
    }
    
    if (mainElement.scrollTop > 250) {
      document.querySelector(".back-to-top")?.classList.add("active");
      if(!slider.isPaused && page.page === 1) {
        slider.pauseSlide();
      }
      
    } else {
      document.querySelector(".back-to-top")?.classList.remove("active");
      removeHashFromUrl();
      if(slider.isPaused && page.page === 1) {
        slider.isPaused = false;
        slider.firstProgress();
      }
    }
    /* page.updateMainHeight(); */
    /* page.setHeightOfNav(); */
    /* page.updateMainWidth(); */
  } else {
    console.warn(
      "Element za skrolovanje nije definisan ili nema svojstvo scrollTop"
    );
  }
}
const handleResize = () => {
  page.setHeightOfMain();
  page.setHeightOfNav();
  page.setWidthOfMain();
  page.setWidthOfHtml();
  page.setHeightOfHtml();
  page.isMobileDevice();
  if(page.page === 1) {
    page.setWidthOfCardWrapper();
    page.setWidthOfSliderWrapper();

    nextTick(()=> {
      slider.calculateWidthsCards();
    })
  }
};
const handleDOMContentLoaded = () => {
  setTimeout(() => {
    if (page.states.find((el) => el.btn === "firstloader" && el.activebtn))
      page.toggleElementVisibility("firstloader");
  }, 100);
};
onMounted(() => {
  /* removeHashFromUrl(); */
  removeHashFromUrl();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", handleDOMContentLoaded, {
      passive: true,
    });
  } else {
    handleDOMContentLoaded();
  }

  page.initTheme();
  page.initializeLanguage();
  page.initializeActiveElements();
  page.refreshFromLocalStorage();
  cookie.initializeCookies();
  handleResize();
  

  if (cookie.isCookieActive("listeners")) {
    document.addEventListener("click", page.handleClickOutside, {
      passive: true,
    });
    window.addEventListener("resize", handleResize, { passive: true });
  }
  setTimeout(async () => {
    const mainElement = document.querySelector("#main");
    if (mainElement) {
      const isScrollable = mainElement.scrollHeight > mainElement.clientHeight;
      page.setScrollable(isScrollable);
    }
    
  }, page.loadingTime + 120);
  page.setUILoaded();

});
onUnmounted(() => {
  if (mutationObserver) {
    mutationObserver.disconnect();
  }
  if (cookie.isCookieActive("listeners")) {
    window.removeEventListener("resize", handleResize);
    document.removeEventListener("click", page.handleClickOutside);
  }
});


router.afterEach(() => {
  setTimeout(() => {
    isPageScrollable();
  }, 500);
});

router.beforeEach((to, from, next) => {
  const supportedLanguages = ["sr", "en", "ru", "de", "cn", "fr", "tr", "it"];
  let lang = to.params.lang;
  if (Array.isArray(lang)) {
    lang = lang[0];
  }
  if (supportedLanguages.includes(lang)) {
    page.changeLanguage(lang);
  }
  setTimeout(() => {
    page.scrollTop();
  }, 500);
  /* if (window.location.hash) {
    removeHashFromUrl();
  } */
  next();
});
</script>
<template>
  <ClientOnly>
    <div class="app" :class="currentTheme">
      <LoadersFirstloader />
      <div
        class="app-viewport"
        :class="{
          active: page.states.find(
            (el) => el.btn === 'firstloader' && el.activemenu
          ),
        }"
      >
        <ModalsCookie
          v-if="page.states.find((el) => el.btn === 'cookie' && el.activebtn)"
        />
        <div>
          <div class="section-pagination" v-if="page.isScrolling">
            <span class="to-top" @click.stop="page.scrollTop">
              <!-- <IconsControlsArrow/> -->
            </span>
            <NuxtLink
              v-for="(name, index) in page.sectionNames"
              :key="index"
              @click="
                updateUrlWithSectionId(page.sectionIds[index]),
                  page.changeSection(index + 1)
              "
              :class="{ active: page.activeSection === index + 1 }"
              :disabled="page.isButtonDisabled(index + 1)"
              class="hover-link"
              :aria-label="name"
            >
              <div class="active-pag">{{ name }}</div>
            </NuxtLink>
            <span class="to-bottom" @click.stop="page.scrollBottom">
              <!-- <IconsControlsArrow/> -->
            </span>
          </div>
          <div class="section-pagination" v-else>
            <span class="to-top" @click.stop="page.scrollTop">
              <!-- <IconsControlsArrow/> -->
            </span>
            <NuxtLink
              v-for="(name, index) in page.sectionNames"
              :key="index"
              @click="
                updateUrlWithSectionId(page.sectionIds[index]),
                  page.changeSection(index + 1)
              "
              :class="{ active: page.currentSection === index + 1 }"
              :disabled="page.isButtonDisabled(index + 1)"
              :aria-label="name"
              class="hover-link"
            >
              <div class="active-pag">{{ name }}</div>
            </NuxtLink>
            <span class="to-bottom" @click.stop="page.scrollBottom">
              <!-- <IconsControlsArrow/> -->
            </span>
          </div>
        </div>
        <IconsControlsTotop @click.stop="page.scrollTop" />
        <IconsDefaultCallus />
        <HeaderNav :class="{ scrolled: page.isScrolled }" />
        <main
          ref="isScrollable"
          class="main"
          :class="{
            scroll: page.isScrollable,
            scrolled: page.isScrolled,
          }"
          @scroll="handleScroll"
        >
          <div class="top"></div>

          <!-- :style="{
          paddingTop: page.heightofNav + 'px',
        }" -->

          <div class="viewport">
            <NuxtPage />
            <Footer />
          </div>
          <div class="bottom"></div>
        </main>
      </div>
    </div>
  </ClientOnly>
</template>

<style lang="scss">
.top {
  position: relative;
  height: 0;
  width: 100%;
  /*height: $upnav-height + $nav-height + 10;*/
}
.app {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.app-viewport {
  position: fixed;
  z-index: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: clr(app);
  opacity: 1;
  transition: opacity ease 0.1s;
  transition-delay: 0.1s;
  @include flex-full(flex-start, flex-start, column);
  &.active {
    opacity: 0;
  }
}

main {
  position: relative;
  z-index: 6998;
  width: 100%;
  height: 100%;
  overflow: hidden auto;
  scrollbar-gutter: stable;
  margin-top: -$nav-height - $upnav-height;
  transition: margin-top ease .3s;
  transition-delay: .1s;
  &.scrolled {
    margin-top: 0;
  }
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: clr(primary);
  }
  &::-webkit-scrollbar-thumb:hover {
    opacity: .3;
  }
}

.section-pagination {
  position: fixed;
  z-index: 9000;
  left: 20px;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;

  @include px(550) {
    left: 13px;
  }

  @include px(420) {
    display: none;
    opacity: 0;
    visibility: hidden;
  }

  span {
    position: relative;
    width: 12px;
    height: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: rotate(0deg);

    svg {
      fill: getColor(sectionpagarrows);
    }
  }

  .to-bottom {
    cursor: pointer;
    transform: rotate(180deg);

    span {
      svg {
        fill: getColor(sectionpagarrows);
      }
    }

  }

  .to-top {
    position: relative;
    z-index: 9000;
    cursor: pointer;

    span {
      svg {
        fill: getColor(sectionpagarrows);
      }
    }
  }

  button,
  a {
    position: relative;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background: clr(font-primary-light);
    transition: all ease 0.3s;

    @include px(1024) {
      .active-pag {
        opacity: 0;
        visibility: hidden;
        left: 25px;
      }
    }

    &:hover {
      background: clr(primary);

      .active-pag {
        opacity: 1;
        visibility: visible;
        left: 25px;
        //transform: translate(120%, -50%);
      }
    }

    .active-pag {
      position: absolute;
      //transform: translate(120%, -50%);
      opacity: 0;
      left: 50px;
      white-space: nowrap;
      font-weight: 500;
      visibility: hidden;
      color: clr(primary);
      transition: all ease 0.3s;
    }
  }

  button:hover,
  a:hover {
    &.active {
      .active-pag {
        @include px(1024) {
          left: 25px;
          opacity: 1;
          visibility: visible;
        }
      }
    }
  }

  button.active,
  a.active {
    background: clr(primary);

    .active-pag {
      opacity: 1;
      visibility: visible;
      left: 25px;

      @include px(1024) {
        opacity: 0;
        visibility: hidden;
        left: 50px;
      }

      //transform: translate(120%, -50%);
    }
  }
}
.viewport {
  position: relative;
  width: 100%;
  margin-inline: auto;
}
</style>
