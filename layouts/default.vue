<script lang="ts" setup>
//& CLEAN
type Theme = "dark" | "light";
const page = usePagesStore();
const router = useRouter();
const scrollProgress = ref(0);
let scrollTimeout: string | number | NodeJS.Timeout | null | undefined = null;
let mutationObserver: MutationObserver | undefined;
const isScrollable = ref<HTMLElement | null>(null);
const currentTheme = computed(() => page.currentTheme);
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
    } else {
      document.querySelector(".back-to-top")?.classList.remove("active");
      removeHashFromUrl();
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
  page.setSizes();
};
const handleDOMContentLoaded = () => {
  setTimeout(() => {
    if (page.states.find((el) => el.btn === "firstloader" && el.activebtn))
      page.toggleElementVisibility("firstloader");
  }, 20);
};
onMounted(() => {
  removeHashFromUrl();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", handleDOMContentLoaded, {
      passive: true,
    });
  } else {
    handleDOMContentLoaded();
  }
  //page.initTheme();
  page.initializeLanguage();
  page.initializeActiveElements();
  page.refreshFromLocalStorage();
  page.setSizes();

  document.addEventListener("click", page.handleClickOutside, {
    passive: true,
  });
  window.addEventListener("resize", handleResize, { passive: true });
  setTimeout(async () => {
    const mainElement = document.querySelector("#main");
    if (mainElement) {
      const isScrollable = mainElement.scrollHeight > mainElement.clientHeight;
      page.setScrollable(isScrollable);
    }
  }, page.loadingTime + 120);
  //page.setUILoaded();
});
onUnmounted(() => {
  if (mutationObserver) {
    mutationObserver.disconnect();
  }
  window.removeEventListener("resize", handleResize);
  document.removeEventListener("click", page.handleClickOutside);
  window.removeEventListener("scroll-target-section", handleScroll);
});
router.afterEach(() => {
  setTimeout(() => {
    isPageScrollable();
  }, 500);
});
router.beforeEach((to, from, next) => {
  const supportedLanguages = ["sr", "en", "ru", "de", "tr", "it"];
  let lang = to.params.lang;
  if (Array.isArray(lang)) {
    lang = lang[0];
  }
  if (supportedLanguages.includes(lang) && page.isLanguageValid(lang)) {
    page.changeLanguage(lang);
  }
  setTimeout(() => {
    page.scrollTop();
  }, 500);
  next();
});
</script>
<template>
  <ClientOnly>
    <div class="app" :class="currentTheme">
      <div
        class="app-viewport"
        :class="{
          active: page.states.find(
            (el) => el.btn === 'firstloader' && el.activemenu
          ),
        }"
      >
        <LoadersFirstloader />
        <div v-if="page.page !== 3">
          <div class="section-pagination" v-if="page.isScrolling">
            <span class="to-top" @click.stop="page.scrollTop">
              <IconsControlsArrow />
            </span>
            <button
              v-for="(name, index) in page.sectionNames"
              :key="index"
              @click="
                updateUrlWithSectionId(page.sectionIds[index]),
                  page.changeSection(index + 1)
              "
              :class="{ active: page.activeSection === index + 1 }"
              :disabled="page.isButtonDisabled(index + 1)"
              :aria-label="name"
              class="hover-link"
            >
              <div class="active-pag">{{ name }}</div>
            </button>
            <span class="to-bottom" @click.stop="page.scrollBottom">
              <IconsControlsArrow />
            </span>
          </div>
          <div class="section-pagination" v-else>
            <span class="to-top" @click.stop="page.scrollTop">
              <IconsControlsArrow />
            </span>
            <button
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
            </button>
            <span class="to-bottom" @click.stop="page.scrollBottom">
              <IconsControlsArrow />
            </span>
          </div>
        </div>

        <IconsControlsTotop
          @click.stop="page.scrollTop"
          v-if="page.page !== 3"
          class="show"
        />
        <IconsDefaultCallus v-if="page.page !== 3" class="show" />
        <HeaderNav
          :class="{ scrolled: page.isScrolled }"
          v-if="page.page !== 3"
        />
        <main
          ref="isScrollable"
          class="main"
          :class="{
            scroll: page.isScrollable,
            scrolled: page.isScrolled,
            qr: page.page === 3,
          }"
          @scroll="handleScroll"
        >
          <div class="top"></div>

          <!-- :style="{
          paddingTop: page.heightofNav + 'px',
        }" -->

          <div class="viewport">
            <NuxtPage />
            <Footer v-if="page.page !== 3" />
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
  z-index: 9998;
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
    main {
      opacity: 0;
    }
    .section-pagination {
      opacity: 0;
    }
    .show {
      opacity: 0;
    }
  }
}
.show,
main,
.section-pagination {
  opacity: 1;
  transition: all ease 0.2s;
}
main {
  position: relative;
  z-index: 6998;
  width: 100%;
  height: 100%;
  overflow: hidden auto;
  scrollbar-gutter: stable;
  margin-top: -$nav-height - $upnav-height;
  transition: all ease 0.12s;
  &.qr {
    margin-top: 0px;
  }
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
    opacity: 0.3;
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
      fill: clr(font);
    }
  }

  .to-bottom {
    cursor: pointer;
    transform: rotate(180deg);

    span {
      svg {
        fill: clr(font);
      }
    }
  }

  .to-top {
    position: relative;
    z-index: 9000;
    cursor: pointer;

    span {
      svg {
        fill: clr(font);
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
.page {
  position: relative;
  width: 100%;
}

$header: (
  "light": (
    headerbg: #ffffffec,
    upnaviconsfill: #9f6049,
    upnaviconsfill600: #9f6049,
    upnaviconsfillscrolled: #9f6049,
    upnaviconsfillscrolled600: #9f6049,
    logofill: #c17255,
    logofill600: #c17255,
  ),

  "dark": (
    headerbg: #fff,
    upnaviconsfill: #9f6049,
    upnaviconsfill600: #fff,
    upnaviconsfillscrolled: #9f6049,
    upnaviconsfillscrolled600: #9f6049,
    logofill: #c17255,
    logofill600: #c17255,
  ),
);

$theme: (
  "light": (
    toolsfill: #9f6049,
    toolsfillactive: #dc9176,
    toolsfill600: #9f6049,
    toolsfill600active: #dc9176,
  ),

  "dark": (
    toolsfill: #9f6049,
    toolsfillactive: #dc9176,
    toolsfill600: #9f6049,
    toolsfill600active: #dc9176,
  ),
);
$tools: (
  "light": (
    toolsfill: #9f6049,
    toolsfillactive: #dc9176,
    toolsfill600: #9f6049,
    toolsfill600active: #fff,
  ),

  "dark": (
    toolsfill: #9f6049,
    toolsfillactive: #9f6049,
    toolsfill600: #9f6049,
    toolsfill600active: #fff,
  ),
);

$burger: (
  "light": (
    toolsfill: #9f6049,
    toolsfill600: #fff,
  ),

  "dark": (
    toolsfill: #9f6049,
    toolsfill600: #fff,
  ),
);

header {
  position: relative;
  z-index: 7000;
  top: 0;
  width: 100%;
  box-shadow: 0px 0px 0px 0px #7c512741;
  background: none;
  //background: clr(headerbg);
  transition: background ease 0.3s, box-shadow ease 0.1s, opacity ease .12s;
  &.scrolled {
    position: sticky;
    background: clr(headerbgscrl);
    box-shadow: 0px 0px 30px 0px #7c512741;
    .upnav {
      grid-template-rows: 0fr;
      visibility: hidden;
      opacity: 0;
      height: 0;
    }
    .header-wrapper {
      .nav-wrapper {
        .logo {
          @include px(600) {
            color: clr(upnaviconsfillscrolled);
          }
        }
        .tools {
          .burger {
            .burger-btn {
              #top,
              #mid,
              #bottom {
                @include px(600) {
                  fill: clr(upnaviconsfillscrolled);
                }
              }
            }
          }
          /*.loacales {
          }*/
          .theme-btn-inside {
            button {
              svg {
                @include px(600) {
                  fill: clr(upnaviconsfillscrolled);
                }
              }
            }
          }
          .settings {
            svg {
              @include px(600) {
                fill: clr(upnaviconsfillscrolled);
              }
            }
          }
        }
      }
    }
  }
  @include setColors($header);
}

.header-wrapper {
  max-width: calc(90% + 50px);
  margin-inline: auto;
  //na 14
  @include px(1024) {
    width: 100%;
    padding: 0px 20px;
  }
}
.nav-wrapper {
  position: relative;
  width: 100%;
  min-width: 50%;
  height: $nav-height;
  @include flex-custom(space-between, center);
}
.logo {
  font-size: clamp(170%, 50% + 2.6vw, 210%);
  font-weight: 600;
  color: clr(logofill);
  font-family: "Passion One", sans-serif;
  transition: color ease 0.3s;
  @include px(600) {
    color: clr(logofill600);
  }
}
nav {
  position: relative;
  height: 100%;
  @include flex-custom(center, center);
  @include px(1024) {
    display: none;
  }
  //height: $nav-height;
  div {
    position: absolute;
    bottom: 0;
    height: 100%;
    @include flex-custom(center, center);
  }
}
nav a,
nav button {
  position: relative;
  bottom: 0;
  height: 70%;
  padding: 0px 15px;
  white-space: nowrap;
  color: clr(font);
  cursor: pointer;
  transition: all ease 0.3s;
  border-radius: 33px;
  @include flex-center();
  &.active {
    background: clr(primary);
    color: white;
  }
  &.vrtic {
    &.router-link-active {
      background: clr(primary);
      color: white;
    }
  }
}

.upnav {
  display: grid;
  grid-template-rows: 1fr;
  overflow: hidden;
  opacity: 1;
  visibility: visible;
  transition: grid-template-rows ease 0.3s, height ease 0.3s, opacity ease 0.3s,
    visibility ease 0.3s;
  height: $upnav-height;
  & > div {
    overflow: hidden;
  }
}
.up-left {
  gap: 5px;
  @include flex-custom(flex-start, center);
  a {
    &.fb,
    &.ig,
    &.yt,
    &.phone {
      fill: clr(upnaviconsfill);
      @include px(600) {
        fill: clr(upnaviconsfill600);
      }
      & > * {
        width: calc(20px + $up-increment - $up-decrement);
        min-width: $up-minw;
        max-width: $up-maxw;
        @include flex-center();
      }
    }
  }
}

.tools {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
}
.tools {
  @include setColors($tools);
}
@include locale();

.themes {
  position: relative;
  width: 100%;
  height: calc(#{$base-width} - #{$decrement});
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.themes-cloud-modal {
  @include cloud-modal(150px);
  background: clr(primary);
  padding: 10px;
}

.themes.active .themes-cloud-modal {
  @include active-cloud-modal($nav-height + 3px);
}

.settings {
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.settings-cloud-modal {
  @include cloud-modal(150px);
  padding: 10px;
}
.settings.active .settings-cloud-modal {
  @include active-cloud-modal($nav-height + 3px);
}

.settings svg,
.locale-btn,
.themes svg {
  width: calc(20px + $tools-increment - $tools-decrement);
  height: calc(20px + $tools-increment - $tools-decrement);
  min-width: $tools-minw;
  max-width: $tools-maxw;
  min-height: $tools-minw;
  max-height: $tools-maxw;
  transition: all ease 0.3s;
}
.settings svg,
.themes svg {
  fill: clr(toolsfill);
  @include px(600) {
    fill: clr(toolsfill600);
  }
}
.settings.active svg,
.themes.active svg {
  fill: clr(toolsfillactive);
  @include px(600) {
    fill: clr(toolsfill600active);
  }
}

@mixin thememenu-btn {
  .theme-btn-inside {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    @include setColors($theme);
    &.maxtheme {
      margin-right: 0;
      button {
        svg {
          fill: clr(toolsfill);
          @include px(600) {
            fill: clr(toolsfill600active);
          }
        }
      }
    }
    &.light {
      button {
        transform: translate(-50%, -50%) scale(1);

        &.light {
          transform: translate(-50%, -20%) scale(0.7);
          opacity: 0;
          visibility: hidden;
        }

        &.dark {
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
          visibility: visible;

          svg {
            height: 21px;
            width: 21px;
          }
        }
      }
    }

    &.dark {
      button {
        transform: translate(-50%, -50%) scale(1);

        &.dark {
          opacity: 0;
          visibility: hidden;
          transform: translate(-50%, -20%) scale(0.7);
        }

        &.light {
          opacity: 1;
          visibility: visible;
          transform: translate(-50%, -50%) scale(1);
        }
      }
    }

    button {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.6);
      opacity: 0;
      visibility: hidden;
      transition: all ease 0.2s;
      p {
        opacity: 0;
        width: 0;
        height: 0;
        visibility: hidden;
      }
      svg {
        display: flex;
        align-items: center;
        justify-content: center;
        fill: clr(toolsfillactive);
        width: 25px;
        height: 25px;
        transition: fill ease 0.3s;

        @include px(600) {
          fill: clr(toolsfill600active);
        }
      }
    }
  }
}
@include thememenu-btn();

.burger {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-left: 0px;
  display: none;
  @include px(1024) {
    display: block;
  }
}

.burger-btn {
  height: calc(#{$base-width} - #{$decrement});
  min-width: $min-width;
  max-width: $max-width;
  max-height: $max-width;
  min-height: $min-width;
  display: none;
  transform: rotate(180deg);
  transition: fill ease 0.3s;
  @include flex-full(space-between, flex-start, column);
  @include px(1024) {
    display: block;
  }
  #top,
  #mid,
  #bottom {
    fill: clr(toolsfill);
    transition: all ease 0.3s;
    @include flex-custom(flex-start, flex-start);
    @include px(600) {
      fill: clr(toolsfill600);
    }
  }
  #top {
    width: 70%;
    transform: rotate(-180);
  }
  #mid {
    width: 50%;
  }
  #bottom {
    width: 80%;
  }
  &:hover {
    #top,
    #mid,
    #bottom {
      width: 100%;
    }
  }
}
.burger-cloud-modal {
  position: fixed;
  z-index: 9998;
  width: 100%;
  height: 100%;
  top: 0;
  right: 0;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  background: #ffffffa2;
  opacity: 0;
  visibility: hidden;
  transition: all ease 0.3s;
}
.burger.active .burger-cloud-modal {
  opacity: 1;
  visibility: visible;
}
.burger-cloud-modal .overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  background: #ffffffa2;
  opacity: 0;
  visibility: hidden;
  transition: all ease 0.3s;
}
.burger.active .overlay {
  opacity: 1;
  visibility: visible;
}
.burger-cloud-modal .sidemenu {
  background: clr(primary);
  width: 300px;
  transform: translateX(100%);
  height: 100%;
  transition: all ease 0.3s;
}

.burger.active .burger-cloud-modal .sidemenu {
  opacity: 1;
  transform: translateX(0);
  visibility: visible;
}

.sidemenu {
  position: relative;
  @include flex-full(flex-start, stretch, column);
}
.up-side {
  @include flex-custom(flex-end, center);
  button {
    padding: 35px 25px 35px 20px;
    height: calc(#{$base-width} - #{$decrement});
    max-height: $max-width;
    min-height: $min-width;
    gap: 15px;
    color: white;
    @include flex-custom(flex-end, center);

    svg {
      height: calc(#{$base-width} - #{$decrement});
      min-width: $min-width;
      max-width: $max-width;
      max-height: $max-width;
      min-height: $min-width;
      fill: white;
    }
  }
}
.mid-side {
  height: 100%;
}
.mid-links {
  padding: 20px 20px;
  @include flex-full(flex-start, flex-start, column);
  a,
  button {
    padding: 5px 15px;
    color: white;
    border-radius: 33px;
    transition: all ease 0.3s;
    cursor: pointer;
    &:hover {
      background: white;
      color: clr(font);
    }
    &.active {
      background: white;
      margin-left: 10px;
      color: clr(font);
    }
  }
}

.bottom-side {
  padding: 10px 10px;
  gap: 15px;
  background: rgba($color: #000000, $alpha: 0.2);
  @include flex-center;
  a {
    min-width: $min-width;
    max-width: $max-width;
    max-height: $max-width;
    min-height: $min-width;
    @include flex-center;
    svg {
      fill: white;
    }
  }
}

.page-indicator-progress {
  position: absolute;
  z-index: 7000;
  bottom: -3px;
  left: 0;
  width: 100%;
  height: 3px;
  opacity: 1;
  transition: opacity 0.3s;
}
.scroll-progress {
  position: relative;
  z-index: 1;
  width: 0;
  height: 3px;
  background: clr(primary);
  transition: width 0.2s linear;
}

.sections {
  max-width: 2160px;
  gap: 0px;
  @include sections(
    /* Width */ 100%,
    /* Padding */ 0px,
    /* Margin */ 0px 0px 0px 0px
  );
  @include flex-full(flex-start, flex-start, column);
}
section {
  color: clr(font);
  padding: 0px calc((10px + 4vw) - 20px) 0px calc((10px + 4vw) - 20px);
  @include allSections();
}
$section-1-height: 700px;
$section-1-height-sm: 900px;
$section-1-height-smm: 800px;
$section-1-height-img: 800px;
$section-1-height-boxs: 500px;
.section-1 {
  position: relative;
  //width: calc(80% + 5vw);
  //width: 1024px;
  height: 100%;
  min-height: 700px;
  //padding: 180px 10px 50px 10px;
  margin-inline: auto;
  padding: 0 0px 0px 0px 0px;
  gap: 20px;
  //background-image: url("/public/img/zaki.webp");
  background-repeat: no-repeat;
  background-position: 100% 0;
  background-size: auto 700px;
  overflow: hidden;
  @include flex-full(center, center, row);
  @include px(1450) {
    background-position: calc(60% + 20vw) 0px;
  }
  @include px(1024) {
    padding: 0px 10px;
    min-height: 800px;
    background-size: auto 700px;
    background-position: 100% 200px;
    @include flex-full(flex-start, center, column);
  }
  @include px(750) {
    background-position: 50% 200px;
  }
  @include px(600) {
    min-height: 690px;
    background-size: auto 400px;
    background-position: 100% 0px;
    @include flex-full(flex-start, center, column-reverse);
  }
  @include px(450) {
    background-position: 55% 0px;
    min-height: 550px;
    background-size: auto 300px;
    @include flex-full(center, flex-end, row);
  }
  .box-shadow-header {
    position: absolute;
    z-index: 3;
    top: 0;
    left: 50%;
    transform: translate(-50%, 0%);
    width: 100%;
    box-shadow: 0px 0px 200px 150px rgba($color: #ffffff, $alpha: 1);
    transition: box-shadow ease 0.3s;
    transition-delay: 0.1s;
    @include px(1024) {
      box-shadow: 0px 0px 0px 0px rgba($color: #ffffff, $alpha: 1);
    }
    @include px(600) {
      box-shadow: 0px 0px 80px 105px rgba($color: #ffffff, $alpha: 1);
    }
    &.scrolled {
      box-shadow: 0px 0px 0px 0px rgba($color: #ffffff, $alpha: 1);
    }
  }
  .organic {
    position: absolute;
    z-index: 2;
    bottom: 40px;
    right: 40px;
    width: 100px;
    height: 100px;
    fill: white;
  }
  article {
    position: relative;
    z-index: 3;
    text-align: left;
    width: calc(47% + 400px);
    height: 100%;
    margin-inline: auto;
    @include flex-full(center, flex-start, column);
    @include px(1024) {
      width: 100%;
      text-align: center;
      padding: $nav-height + $upnav-height + 50px 0 0 0;
      @include flex-full(flex-start, center, column);
    }
    @include px(600) {
      padding-top: 10px;
    }
    @include px(420) {
      padding-top: 10px;
    }
    h2,
    h1 {
      width: 100%;
      font-size: clamp(80%, 150% + 3.1vw, 700%);
      font-weight: 600;
      color: clr(font-primary);
      font-family: "Passion One", sans-serif;
      text-shadow: 3px 3px 4px #68482146;
    }
    figure {
      h2 {
        width: 100%;
        font-size: clamp(70%, 70% + 2.1vw, 250%);
        font-weight: 500;
        background: linear-gradient(215deg, #6ca14f, #4ac1dc);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        background-size: 150% 150%;
        text-shadow: 2px 2px 3px #7ce5ad5c;
      }
      figcaption {
        p {
          width: 100%;
          font-size: clamp(60%, 40% + 2.1vw, 160%);
          color: clr(font-primary-light);
          text-shadow: 2px 2px 3px #68482123;
        }
      }
    }
    .link-box {
      @include social-btn();
    }
  }

  .boxshadow {
    position: absolute;
    z-index: 2;
    top: unset;
    left: 0;
    box-shadow: 0px 0px 1200px calc(950px + 12vw) rgba($color: #fff, $alpha: 1);
    @include px(1920) {
      box-shadow: 0px 0px 900px calc(450px + 32vw) rgba($color: #fff, $alpha: 1);
    }

    @include px(1650) {
      box-shadow: 0px 0px 900px calc(350px + 32vw) rgba($color: #fff, $alpha: 1);
    }
    @include px(1024) {
      top: 0;
      left: unset;
      box-shadow: 0px -1200px 500px 1200px rgba($color: #fff, $alpha: 1);
      height: $section-1-height-boxs;
    }
    @include px(600) {
      display: none;
    }
  }

  $img-height: 500px;
  aside {
    &.dog {
      position: absolute;
      z-index: 1;
      top: 0;
      right: 0;
      width: 100%;
      height: 100%;
      transition: all ease 0.1s;
      @include flex-full(flex-start, flex-start, row);
      /*@include px(600) {
        //height: $section-1-height-smm;
        position: relative;
        z-index: 2;
        top: unset;
        left: unset;
        transform: translate(0%, 0%);
        width: 600px;
        height: 509px;
        min-width: 700px;
        border-bottom-right-radius: 50%;
        border-bottom-left-radius: 50%;
        overflow: hidden;
        margin-top: -$nav-height - $upnav-height - 50px;
      }*/
      .img-dog {
        position: relative;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
        max-height: 100%;

        /*img {
          position: absolute;
          right: 0;
          height: 700px;
          @include px(1366) {
            right: -200px;
          } 

          @include px(1024) {
            top: 200px;
            right: 0px;
          }
          @include px(750) {
            right: -120px;
          }
          @include px(600) {
            top: 110px;
            left: 0px;
            height: 450px;
          }
        }*/

        /*@include px(1450) {
          background-image: url("/assets/img/dogs/4-ps.webp");
          background-position: 82% 0;
          background-size: auto 100%;
          background-attachment: unset;
        }
        @include px(1024) {
          background-size: auto;
          background-position: calc(-2850px + 15vw * 5) 200px;
          background-attachment: unset;
          max-height: 850px;
          background-size: cover;
        }

        @include px(600) {
          background-image: url("/assets/img/dogs/4-short.webp");
          background-size: auto;
          background-position: 0px 100px;
          background-attachment: unset;
          background-size: cover;
        }
        @include px(360) {
          background-image: url("/assets/img/dogs/4-short.webp");
          background-size: auto;
          background-position: -50px 100px;
          background-size: cover;
        }*/
      }
    }
  }
}
.section-2 {
  position: relative;
  z-index: 2;
  width: calc(70% + 150px);
  margin-inline: auto;
  padding: 200px 0px 100px 0px;
  @include px(1024) {
    width: 98%;
    padding: 150px 10px 150px 40px;
  }
  @include px(600) {
    width: 98%;
    padding: 100px 10px 50px 10px;
  }
  article {
    h2 {
      font-size: clamp(90%, 110% + 1.5vw, 300%);
      margin-bottom: 30px;
      font-family: "Passion One", sans-serif;
      @include px(600) {
        text-align: center;
      }
    }

    .box-pic {
      position: relative;
      width: 100%;
      gap: 15px;
      @include flex-full(space-between, center, row);
      @include px(600) {
        @include flex-full(space-between, center, column-reverse);
      }
      .box-text {
        width: 65%;
        @include px(600) {
          width: 85%;
        }
        p {
          width: 100%;
          font-size: clamp(90%, 50% + 1.1vw, 130%);
        }
      }
      .pic-box {
        width: calc(100px + 15vw);
        height: calc(100px + 15vw);
        min-height: 200px;
        min-width: 200px;
        max-width: 400px;
        max-height: 400px;
        border-radius: 50%;
        background-position: center;
        background-size: contain;
        background-repeat: no-repeat;
        //background-image: url("/assets/img/dogs/milasite.webp");
      }
    }

    aside {
      .link-box {
        @include flex-full(flex-start, center, row);
        @include social-btn();
      }
    }
  }
}
.section-3 {
  position: relative;
  z-index: 2;
  width: calc(70% + 150px);
  margin-inline: auto;
  padding: 50px 0px;
  @include px(1450) {
    width: 98%;
    padding: 50px 10px 100px 40px;
  }
  @include px(1024) {
    width: 98%;
    padding: 50px 10px 50px 10px;
  }
  article {
    .box-pic {
      position: relative;
      width: 100%;
      @include flex-full(space-between, center, row);
      @include px(1450) {
        @include flex-full(space-between, center, column);
      }
      .box-text {
        width: 70%;
        @include px(1450) {
          width: 85%;
        }
        p {
          width: 100%;
          font-size: clamp(90%, 50% + 1.1vw, 140%);
        }

        h2 {
          font-size: clamp(90%, 110% + 1.5vw, 300%);
          margin-bottom: 0px;
          font-family: "Passion One", sans-serif;
          @include px(600) {
            text-align: center;
          }
        }
        h3 {
          font-size: clamp(90%, 90% + 1.5vw, 200%);
          margin-bottom: 0px;
          font-family: "Passion One", sans-serif;
          background: linear-gradient(215deg, #6ca14f, #4ac1dc);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          background-size: 150% 150%;
          text-shadow: 2px 2px 3px #7ce5ad5c;
          @include px(600) {
            text-align: center;
          }
        }
        li {
          font-size: clamp(90%, 50% + 1.5vw, 110%);
        }
        .ul-1 {
          margin-top: 20px;
          margin-left: 20px;
        }
        .solo-1 {
          margin-top: 20px;
        }
        .ul-2 {
          margin-top: 10px;
          margin-left: 20px;
        }
        .solo-2 {
          margin-top: 20px;
          font-size: clamp(90%, 50% + 1.5vw, 110%);
        }
      }
      .pic-box {
        width: calc(100px + 15vw);
        height: calc(100px + 15vw);
        min-height: 200px;
        min-width: 200px;
        max-width: 300px;
        max-height: 300px;
        background-position: center;
        background-size: contain;
        background-repeat: no-repeat;
        margin-right: 40px;
        //background-image: url("/assets/img/vip.webp");
      }
    }

    aside {
      margin-top: 20px;
      width: 100%;
      float: right;
      @include px(1024) {
        width: 100%;
      }
      .link-box {
        @include flex-full(flex-start, center, row);
        @include social-btn();
      }
    }
  }
}
.section-4 {
  padding: 100px 0px;
  width: calc(90% + 50px);
  margin-inline: auto;
  @include px(1450) {
    width: 100%;
    padding: 50px 0px;
  }

  article {
    h2 {
      font-size: clamp(90%, 150% + 2.5vw, 300%);
      margin-bottom: 0px;
      font-family: "Passion One", sans-serif;
      background: linear-gradient(215deg, #6ca14f, #4ac1dc);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      background-size: 150% 150%;
      text-shadow: 2px 2px 3px #7ce5ad5c;
      text-align: center;
    }
    figure {
      margin-top: 20px;
      figcaption {
        display: grid;
        grid-template-columns: 0.25fr 0.25fr 0.25fr 0.25fr;
        justify-content: center;
        gap: 50px;
        @include px(1600) {
          gap: 20px;
        }
        @include px(1450) {
          grid-template-columns: 0.33fr 0.33fr;
        }
        @include px(1024) {
          grid-template-columns: 0.4fr 0.4fr;
        }
        @include px(600) {
          grid-template-columns: 0.7fr;
        }
        @include px(500) {
          grid-template-columns: 0.8fr;
        }
        @include px(400) {
          grid-template-columns: 0.9fr;
        }
        @include px(360) {
          grid-template-columns: 0.95fr;
        }
        .style {
          position: relative;
          min-width: calc(200px + 4.5vw);
          border-radius: 33px;
          overflow: hidden;
          box-shadow: 0px 0px 20px 0px rgba($color: #94a69e, $alpha: 0.25);
          @include flex-full(space-between, space-between, column);
          @include px(600) {
            border-radius: 15px;
          }
          .prices {
            @include flex-full(space-between, center, row);
            .discount-img {
              padding: 10px 20px;
              transition: all ease 0.3s;
              @include flex-full(center, center, column);
              svg {
                position: relative;
                z-index: -1;
                width: calc(10px + 1.5vw);
                height: calc(10px + 1.5vw);
                min-width: 20px;
                min-height: 20px;
                transition: all ease 0.3s;
                fill: #4adcbf;
                opacity: 0.8;
              }
              p {
                position: relative;
                z-index: 3;
                color: #4adcbf;
                white-space: nowrap;
                font-size: clamp(100%, 40% + 1.2vw, 150%);
                font-family: "Lilita One", sans-serif;
              }
            }
            .discount-img2 {
              padding: 10px 20px;
              transition: all ease 0.3s;
              @include flex-full(center, center, column);
              svg {
                position: relative;
                z-index: -1;
                width: calc(10px + 1.5vw);
                height: calc(10px + 1.5vw);
                min-width: 20px;
                min-height: 20px;
                transition: all ease 0.3s;
                fill: #ffc774;
                opacity: 0.8;
              }
              p {
                position: relative;
                z-index: 3;
                color: #ffc774;
                white-space: nowrap;
                font-size: clamp(100%, 40% + 1.2vw, 150%);
                font-family: "Lilita One", sans-serif;
              }
            }
          }
          .box-header {
            position: relative;
            padding: 25px 10px 12px 10px;
            //border-bottom: 1px solid #4adc9154;
            //background: clr(font-primary-light);
            border-top-left-radius: 9px;
            border-top-right-radius: 9px;
            p {
              font-family: "Passion One", sans-serif;
              font-weight: 500;
              text-align: center;
              color: clr(font);
              font-size: clamp(120%, 40% + 1.5vw, 190%);
            }
            span {
              font-family: "Passion One", sans-serif;
              padding: 5px 10px;
              font-weight: 500;
              background: linear-gradient(215deg, #6ca14f, #4ac1dc);
              -webkit-background-clip: text;
              background-clip: text;
              -webkit-text-fill-color: transparent;
              background-size: 100% 100%;
              text-shadow: 1px 1px 2px #7ce5ad5c;
              font-size: clamp(90%, 40% + 1.1vw, 150%);
              @include flex-center();
            }
          }
          ul {
            list-style-type: none;
            background: #ffffffb2;
            padding: 5px 20px;
            li {
              font-size: clamp(80%, 30% + 1.1vw, 120%);
              color: clr(font-primary-light2);
            }
          }
        }
      }
    }
    .important {
      margin-top: 50px;
      text-align: center;
      margin-bottom: 30px;
      .first {
        font-family: "Passion One", sans-serif;
        font-size: clamp(100%, 70% + 3vw, 210%);
        padding: 0px 40px;
      }
      .second {
        padding: 0px 150px;
        font-size: clamp(90%, 50% + 1.5vw, 110%);
        @include px(800) {
          padding: 0px 50px;
        }
        @include px(600) {
          padding: 0px 40px;
        }
        @include px(500) {
          padding: 0px 20px;
        }
      }
    }
    aside {
      margin-top: 50px;
      width: 100%;
      .link-box {
        @include flex-full(center, center, column);
        @include social-btn();
        .first {
          margin-top: 30px;
          margin-bottom: 20px;
          text-align: center;
          padding: 0px 150px;
          @include px(800) {
            padding: 0px 50px;
          }
          @include px(600) {
            padding: 0px 40px;
          }
          @include px(500) {
            padding: 0px 20px;
          }
        }
      }
    }
  }
}
.section-5 {
  position: relative;
  z-index: 2;
  width: calc(70% + 150px);
  margin-inline: auto;
  padding: 50px 0px 100px 0px;
  @include px(1024) {
    width: 98%;
    padding: 50px 10px 50px 40px;
  }
  @include px(600) {
    width: 98%;
    padding: 100px 10px 50px 10px;
  }
  article {
    h2 {
      font-size: clamp(90%, 110% + 1.5vw, 300%);
      margin-bottom: 30px;
      font-family: "Passion One", sans-serif;
      @include px(600) {
        text-align: center;
      }
    }

    .box-pic {
      position: relative;
      width: 100%;
      gap: 15px;
      @include flex-full(space-between, center, row);
      @include px(600) {
        @include flex-full(space-between, center, column-reverse);
      }
      .box-text {
        width: 65%;
        @include px(600) {
          width: 85%;
        }
        p {
          width: 100%;
          font-size: clamp(90%, 50% + 1.1vw, 130%);
        }
      }
      .pic-box {
        width: calc(100px + 15vw);
        height: calc(100px + 15vw);
        min-height: 200px;
        min-width: 200px;
        max-width: 400px;
        max-height: 400px;
        border-radius: 50%;
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        //background-image: url("/assets/img/dogs/pettransport.webp");
      }
    }

    aside {
      margin-top: -50px;
      @include px(1450) {
        margin-top: -20px;
      }
      @include px(1024) {
        margin-top: 0px;
      }
      .link-box {
        @include flex-full(flex-start, center, row);
        @include social-btn();
      }
    }
  }
}
.section-6 {
  position: relative;
  z-index: 2;
  width: calc(70% + 150px);
  margin-inline: auto;
  padding: 50px 0px;
  @include px(1450) {
    width: 98%;
    padding: 50px 10px 100px 40px;
  }
  @include px(1024) {
    width: 98%;
    padding: 50px 10px 50px 10px;
  }
  article {
    .box-pic {
      position: relative;
      width: 100%;
      @include flex-full(space-between, center, row);
      @include px(1450) {
        @include flex-full(space-between, center, column);
      }
      .box-text {
        width: 70%;
        @include px(1450) {
          width: 85%;
        }
        p {
          width: 100%;
          font-size: clamp(90%, 50% + 1.1vw, 140%);
        }

        h2 {
          font-size: clamp(90%, 110% + 1.5vw, 300%);
          margin-bottom: 0px;
          font-family: "Passion One", sans-serif;
          margin-bottom: 20px;
          margin-top: 10px;
          @include px(600) {
            text-align: center;
          }
        }
        h3 {
          font-size: clamp(90%, 90% + 1.5vw, 200%);
          margin-bottom: 0px;
          font-family: "Passion One", sans-serif;
          background: linear-gradient(215deg, #6ca14f, #4ac1dc);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          background-size: 150% 150%;
          text-shadow: 2px 2px 3px #7ce5ad5c;
          @include px(600) {
            text-align: center;
          }
        }
        li {
          font-size: clamp(90%, 50% + 1.5vw, 110%);
        }
        .ul-1 {
          margin-top: 20px;
          margin-left: 20px;
        }
        .solo-1 {
          margin-top: 20px;
        }
        .ul-2 {
          margin-top: 10px;
          margin-left: 20px;
        }
        .solo-2 {
          margin-top: 20px;
          font-size: clamp(90%, 50% + 1.5vw, 110%);
        }
      }
      .pic-box {
        width: calc(150px + 15vw);
        height: calc(150px + 15vw);
        min-height: 200px;
        min-width: 200px;
        max-width: 390px;
        max-height: 390px;
        background-position: center;
        background-size: contain;
        background-repeat: no-repeat;
        margin-right: 40px;
        //background-image: url("/assets/img/dogs/8.webp");
        @include px(1450) {
          margin-right: 0;
        }
      }
    }

    aside {
      margin-top: 20px;
      width: 100%;
      float: right;
      @include px(1024) {
        width: 100%;
      }
      .link-box {
        @include flex-full(flex-start, center, row);
        @include social-btn();
      }
    }
  }
}
.section-7,
.section-vrtic {
  position: relative;
  padding: 100px 0px;

  article {
    h2 {
      font-size: clamp(90%, 110% + 1.5vw, 300%);
      margin-bottom: 30px;
      font-family: "Passion One", sans-serif;
      text-align: center;
    }
    figure {
      width: calc(85% + 50px);
      margin-inline: auto;
      border-radius: 33px;
      box-shadow: 0px 0px 150px 0px rgba(62, 62, 62, 0.2);
      overflow: hidden;
      @include px(1024) {
        width: 96%;
      }
      figcaption {
        position: relative;
        overflow: hidden;
        max-height: 600px;
        @include flex-full(space-between, flex-start, row);
        @include px(1024) {
          max-height: unset;
          @include flex-full(space-between, flex-start, column);
        }
        .overlay {
          position: absolute;
          z-index: 1;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba($color: #ffffff, $alpha: 0.5);
          backdrop-filter: blur(10px);
          opacity: 0;
          visibility: hidden;
          transition: all ease 0.3s;
          p {
            height: 100%;
            @include flex-center;
          }
        }
        .igpic {
          position: relative;
          //background: url("/assets/img/ig.webp");
          width: 100%;
          height: 100%;
          min-height: 600px;
          min-width: 500px;
          background-position: center;
          background-size: auto 100%;
          background-repeat: no-repeat;
          cursor: pointer;
          @include px(1450) {
            min-height: 600px;
            background-size: cover;
          }
          @include px(1024) {
            background-size: auto 100%;
          }
          a {
            position: absolute;
            width: 100%;
            height: 100%;
          }

          &:hover {
            .overlay {
              opacity: 1;
              visibility: visible;
            }
          }
        }
        .mappic {
          position: relative;
          //background: url("/assets/img/mapa.webp");
          width: 100%;
          height: 100%;
          max-height: 600px;
          min-height: 600px;
          background-position: center;
          background-size: cover;
          cursor: pointer;
          a {
            position: absolute;
            width: 100%;
            height: 100%;
          }
          &:hover {
            .overlay {
              opacity: 1;
              visibility: visible;
            }
          }
        }
      }
    }
    aside {
      margin-top: 20px;
      width: 100%;
      gap: 100px;
      @include flex-center;
      @include px(800) {
        gap: 50px;
      }
      @include px(600) {
        gap: 10px;
        flex-direction: column;
      }
      .link-box {
        @include flex-full(flex-start, center, row);
        @include social-btn();
      }
      .link2 {
        .touch {
          @include px(600) {
            display: none;
          }
        }
      }
    }
  }
}

.section-1 {
  position: relative;
  &.vrtic {
    width: calc(50% + 350px);
    height: 100%;
    margin-inline: auto;
    padding: 250px 0px 100px 0px;
    gap: 20px;

    @include px(1024) {
      width: 100%;
      padding: 0px 10px;
      min-height: auto;
      @include flex-full(flex-start, center, column);
    }
    @include px(600) {
      min-height: auto;
      @include flex-full(flex-start, center, column-reverse);
    }
  }

  article {
    &.vrtic {
      width: 100%;
      height: 100%;
      @include px(1024) {
        padding: $nav-height + $upnav-height + 50px 0 10px 0;
        @include flex-full(flex-start, center, column);
      }
      @include px(600) {
        padding: 10px 0 10px 0;
      }
      @include px(420) {
        padding: 10px 0 10px 0;
      }
    }
  }

  aside {
    &.house {
      position: relative;
      z-index: 1;
      top: 0;
      transition: all ease 0.1s;
      @include flex-full(flex-end, center, row);
      @include px(600) {
        //height: $section-1-height-smm;
        position: relative;
        z-index: 2;
        top: unset;
        left: unset;
        transform: translate(0%, 0%);
        overflow: hidden;
        padding: $nav-height + $upnav-height + 50px 0 10px 0;
      }
      .img-dog {
        top: 0;
        right: 0;
        width: calc(80px + 20vw);
        height: calc(80px + 20vw);
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: right 0px;
        //background-image: url("/assets/img/dogs/house.webp");
      }
    }
  }
}
.section-2 {
  position: relative;
  z-index: 2;
  padding: 200px 0px 100px 0px;
  @include px(1024) {
    width: 98%;
    padding: 150px 10px 150px 40px;
  }
  @include px(600) {
    width: 98%;
    padding: 100px 10px 50px 10px;
  }

  &.vrtic {
    width: calc(80% + 150px);
    margin: 0;
    margin-inline: auto 0;
    @include px(600) {
      width: 100%;
    }
  }
  article {
    .box-pic {
      @include flex-full(space-between, center, row);
      @include px(600) {
        @include flex-full(space-between, center, column-reverse);
      }
      .box-text {
        width: 65%;
        @include px(600) {
          width: 85%;
        }
        &.vrtic {
          :nth-child(2) {
            margin-bottom: 20px;
          }
        }
      }
      .pic-box {
        &.vrtic {
          margin-top: -50px;
          margin-right: -50px;
          width: calc(150px + 25vw);
          height: calc(150px + 25vw);
          min-height: 200px;
          min-width: 200px;
          max-width: 500px;
          max-height: 500px;
          border-radius: 50%;
          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;
          //background-image: url("/assets/img/dogs/welove.webp");
          @include px(600) {
            margin-top: 0;
            margin-right: 0;
          }
        }
      }
    }

    aside {
      .link-box {
        &.vrtic {
          margin-top: 50px;
        }
      }
    }
  }
}
.section-3 {
  position: relative;
  z-index: 2;
  width: calc(70% + 150px);
  margin-inline: auto;
  padding: 50px 0px;
  @include px(1450) {
    width: 98%;
    padding: 50px 10px 100px 40px;
  }
  @include px(1024) {
    width: 98%;
    padding: 50px 10px 50px 10px;
  }
  article {
    .box-pic {
      position: relative;
      width: 100%;
      @include flex-full(space-between, center, row);
      @include px(1450) {
        @include flex-full(space-between, center, column);
      }
      .box-text {
        width: 70%;
        @include px(1450) {
          width: 85%;
        }
        p {
          width: 100%;
          font-size: clamp(90%, 50% + 1.1vw, 140%);
        }

        li {
          font-size: clamp(90%, 50% + 1.5vw, 110%);
          list-style-type: none;
        }
        .ul-1 {
          margin-top: 20px;
          margin-left: 20px;
        }
        .solo-1 {
          margin-top: 20px;
          &.two {
            margin-top: 0px;
          }
        }
        .ul-2 {
          margin-top: 10px;
          margin-left: 20px;
        }
        .solo-2 {
          margin-top: 20px;
          font-size: clamp(90%, 50% + 1.5vw, 110%);
        }
      }
      .pic-box {
        width: calc(100px + 15vw);
        height: calc(100px + 15vw);
        min-height: 200px;
        min-width: 200px;
        max-width: 300px;
        max-height: 300px;
        background-position: center;
        background-size: contain;
        background-repeat: no-repeat;
        margin-right: 40px;
        //background-image: url("/assets/img/vip.webp");
      }
    }

    aside {
      margin-top: 20px;
      width: 100%;
      float: right;
      @include px(1024) {
        width: 100%;
      }
      .link-box {
        @include flex-full(flex-start, center, row);
        @include social-btn();
      }
    }
  }
}

.section-4 {
  @include px(1450) {
    width: 100%;
    padding: 50px 0px;
  }

  article {
    figure {
      margin-top: 20px;
      figcaption {
        &.vrtic {
          grid-template-columns: 0.25fr 0.25fr;
          @include px(600) {
            grid-template-columns: 0.7fr;
          }
          .style {
            @include flex-full(space-between, space-between, column);
            @include px(600) {
              border-radius: 15px;
            }
            .prices {
              @include flex-full(center, center, row);
              .discount-img {
                @include flex-full(center, center, column);
              }
            }

            ul {
              li {
                &.vrtic {
                  text-align: center;
                  font-weight: 800;
                  margin-bottom: 10px;
                  color: #fff;
                  border-radius: 33px;
                  color: #ffc774;
                }
              }
            }
          }
        }
      }
    }
  }
}
$footer: (
  "light": (
    headerbg: #ffffffec,
    upnaviconsfill: #9f6049,
    upnaviconsfill600: #9f6049,
    upnaviconsfillscrolled: #9f6049,
    upnaviconsfillscrolled600: #9f6049,
    logofill: #c17255,
    logofill600: #c17255,
  ),

  "dark": (
    headerbg: #fff,
    upnaviconsfill: #9f6049,
    upnaviconsfill600: #fff,
    upnaviconsfillscrolled: #9f6049,
    upnaviconsfillscrolled600: #9f6049,
    logofill: #c17255,
    logofill600: #c17255,
  ),
);
.footer {
  background: clr(upnaviconsfill);
  @include setColors($footer);
}
.footer {
 @include flex-full(space-between, center, column);
}
.copyright {
  width: 100%;
  text-align: center;
  padding: 10px;
  background: rgba($color: #000000, $alpha: 0.1);
  color: white;
}
.footer-wrapper {
  width: calc(85% + 50px);
  margin-inline: auto;
  padding: 50px 0px;
  @include flex-full(space-between, flex-start, row);
  @include px(1024) {
    width: 95%;
    flex-direction: column;
    padding-left: 50px;
  }

  .footer-mid {
    @include px(1024) {
      padding: 20px 0px !important;
    }
    ul {
      list-style-type: none;
      li {
        margin: 5px 0px;
        a,button {
          color: white;
          padding: 5px 10px;
          font-size: clamp(90%, 50% + 1.5vw, 110%);
          border-radius: 33px;
          transition: all ease .2s;
          cursor: pointer;
          &:hover {
            background: white;
            color: clr(font);
          }
        }
      }
    }
  }
  .footer-left {
    .logo {
      font-size: clamp(170%, 50% + 2.6vw, 310%);
      font-weight: 600;
      color: clr(headerbg);
      font-family: "Passion One", sans-serif;
      transition: color ease 0.3s;
    }
  }
  .footer-right {
    margin-top: 0px;
    gap: 0px;
    @include flex-full(center,center,column);
    @include px(1024) {
      @include flex-full(flex-start,flex-start,column);
    }
    @include px(800) {
      gap: 0px;
    }
    @include px(600) {
      gap: 10px;
      flex-direction: column;
    }

    .link-box {
      margin: 0 !important; 
      margin-top: 10px !important;
      @include flex-full(flex-start, flex-start, row);
      @include social-btn();
      @include px(1024) {
        margin-top: 10px !important;
      }
      .link-btn {
        .link-to {
            animation: none;
        }
        .press-here {
            background: none !important;
            color: white !important;
            display: none !important;
        }
        svg {
            fill: clr(primary) !important;
        }
        a {
          background: white !important;
            .dm-icon {
                display: none !important;
            }
            p {
                color: clr(primary) !important;
            }
            .touch-container {
                display: none;
                .touch-arrow-click {
                    svg {
                        fill: white !important;
                    }
                }
            }
        }
      }
    }
    .link2 {
      .touch {
        @include px(600) {
          display: none;
        }
      }
    }
  }
}
</style>
