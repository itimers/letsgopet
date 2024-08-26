<script setup lang="ts">
import { onMounted } from "vue";

const page = usePagesStore();
const cookie = useCookieStore();
const i18n = useI18n();

const getAriaLabel = (name: any) => {
  return computed(() => {
    switch (name) {
      case "btntimezone":
        return !cookie.isCookieActive("timezone")
          ? i18n.t("btntimezoneone")
          : i18n.t("btntimezonetwo");
      case "btntime":
        return !cookie.isCookieActive("time")
          ? i18n.t("btntimeone")
          : i18n.t("btntimetwo");
      case "btnspenttime":
        return !cookie.isCookieActive("spenttime")
          ? i18n.t("btnspenttimeone")
          : i18n.t("btnspenttimetwo");
      case "btnip":
        return !cookie.isCookieActive("ip")
          ? i18n.t("btnipone")
          : i18n.t("btniptwo");
      case "btncountry":
        return !cookie.isCookieActive("country")
          ? i18n.t("btncountryone")
          : i18n.t("btncountrytwo");
      /* case "btnthemes":
        return !cookie.isCookieActive("themes")
          ? i18n.t("btnthemesone")
          : i18n.t("btnthemestwo");
      case "btnprefers":
        return !cookie.isCookieActive("prefers")
          ? i18n.t("btnthemesdone")
          : i18n.t("btnthemesdtwo"); */
      case "btnlangs":
        return !cookie.isCookieActive("langs")
          ? i18n.t("btnlangsone")
          : i18n.t("btnlangstwo");
      case "btnlisteners":
        return !cookie.isCookieActive("listeners")
          ? i18n.t("btnlistenersone")
          : i18n.t("btnlistenerstwo");
      case "btnanimations":
        return !cookie.isCookieActive("animations")
          ? i18n.t("btnanimationsone")
          : i18n.t("btnanimationstwo");
      case "btntransitions":
        return !cookie.isCookieActive("transitions")
          ? i18n.t("btntransitionsone")
          : i18n.t("btntransitionstwo");
      case "btnblur":
        return !cookie.isCookieActive("blur")
          ? i18n.t("btnblurone")
          : i18n.t("btnblurtwo");
      default:
        return "";
    }
  });
};
/* const togglePrefers = () => {
  if (cookie.isCookieActive("themes")) {
    cookie.toggleCookie("prefers");
    cookie.updateThemeBasedOnPrefers();
  } else {
    console.log("Cannot toggle prefers while themes is false");
  }
}; */
const marketingAriaLabel = computed(() => {
  return !cookie.isCookieActive("ip") ||
    !cookie.isCookieActive("country") ||
    !cookie.isCookieActive("timezone") ||
    !cookie.isCookieActive("time") ||
    !cookie.isCookieActive("spenttime")
    ? i18n.t("btnmtwo")
    : i18n.t("btnmone");
});
const performanceAriaLabel = computed(() => {
  return !cookie.isCookieActive("prefers") ||
    !cookie.isCookieActive("langs") ||
    !cookie.isCookieActive("listeners") ||
    !cookie.isCookieActive("animations") ||
    !cookie.isCookieActive("transitions") ||
    !cookie.isCookieActive("blur") ? i18n.t("btnptwo")
    : i18n.t("btnpone");
    /* !cookie.isCookieActive("themes")  */
    
    
});

const marketingCookies = () => {
  if (
    !cookie.isCookieActive("ip") ||
    !cookie.isCookieActive("country") ||
    !cookie.isCookieActive("timezone") ||
    !cookie.isCookieActive("time") ||
    !cookie.isCookieActive("spenttime")
  ) {
    cookie.acceptAllMarketingCookies();
  } else if (
    cookie.isCookieActive("ip") ||
    cookie.isCookieActive("country") ||
    cookie.isCookieActive("timezone") ||
    cookie.isCookieActive("time") ||
    cookie.isCookieActive("spenttime")
  ) {
    cookie.declineAllMarketingCookies();
  } else {
    cookie.declineAllMarketingCookies();
  }
};

const performanceCookies = () => {
  if (
    /* !cookie.isCookieActive("themes") || */
    !cookie.isCookieActive("prefers") ||
    !cookie.isCookieActive("langs") ||
    !cookie.isCookieActive("listeners") ||
    !cookie.isCookieActive("animations") ||
    !cookie.isCookieActive("transitions") ||
    !cookie.isCookieActive("blur")
  ) {
    cookie.acceptAllPerformanceCookies();
  } else if (
    /* cookie.isCookieActive("themes") || */
    cookie.isCookieActive("prefers") ||
    cookie.isCookieActive("langs") ||
    cookie.isCookieActive("listeners") ||
    cookie.isCookieActive("animations") ||
    cookie.isCookieActive("transitions") ||
    cookie.isCookieActive("blur")
  ) {
    cookie.declineAllPerformanceCookies();
  } else {
    cookie.declineAllPerformanceCookies();
  }
};
const toggleCookie = () => {
  setTimeout(()=> {
    page.toggleElementVisibility('cookie')
  },500)
}
onMounted(() => {
  cookie.initializeCookies();
});
</script>

<template>
  <div
    class="cookie"
    :style="{
      zIndex: page.states.find((el) => el.menu === 'cookiediv')?.zIndex,
    }"
    :class="{
      active: page.states.find(
        (el) => el.menu === 'cookiediv' && el.activemenu
      ),
    }"
  >
    <div class="cookie-wrapper">
      <div class="marketing-cookies">
        <span class="m-head">{{ $t("mk") }}</span>
        <article>
          <div class="marketing-btns">
            <button
              :aria-label="getAriaLabel('timezone').value"
              @click="cookie.toggleCookie('timezone')"
              class="toggle-btn rel right"
              :class="{ active: cookie.isCookieActive('timezone') }"
            >
              <div class="span">
                <span></span>
              </div>
              <div class="p-one-two">
                <p class="one">{{ $t("timezoneone") }}</p>
                <p class="two">{{ $t("timezonetwo") }}</p>
              </div>
            </button>
            <button
              :aria-label="getAriaLabel('time').value"
              @click="cookie.toggleCookie('time')"
              class="toggle-btn rel right"
              :class="{ active: cookie.isCookieActive('time') }"
            >
              <div class="span">
                <span></span>
              </div>
              <div class="p-one-two">
                <p class="one">{{ $t("timeone") }}</p>
                <p class="two">{{ $t("timetwo") }}</p>
              </div>
            </button>
            <button
              :aria-label="getAriaLabel('spenttime').value"
              @click="cookie.toggleCookie('spenttime')"
              class="toggle-btn rel right"
              :class="{ active: cookie.isCookieActive('spenttime') }"
            >
              <div class="span">
                <span></span>
              </div>
              <div class="p-one-two">
                <p class="one">{{ $t("spenttimeone") }}</p>
                <p class="two">{{ $t("spenttimetwo") }}</p>
              </div>
            </button>
            <button
              :aria-label="getAriaLabel('ip').value"
              @click="cookie.toggleCookie('ip')"
              class="toggle-btn rel right"
              :class="{ active: cookie.isCookieActive('ip') }"
            >
              <div class="span">
                <span></span>
              </div>
              <div class="p-one-two">
                <p class="one">{{ $t("ipone") }}</p>
                <p class="two">{{ $t("iptwo") }}</p>
              </div>
            </button>
            <button
              :aria-label="getAriaLabel('country').value"
              @click="cookie.toggleCookie('country')"
              class="toggle-btn rel right"
              :class="{ active: cookie.isCookieActive('country') }"
            >
              <div class="span">
                <span></span>
              </div>
              <div class="p-one-two">
                <p class="one">{{ $t("countryone") }}</p>
                <p class="two">{{ $t("countrytwo") }}</p>
              </div>
            </button>
          </div>
          <div class="accept-decline">
            <button
              :aria-label="marketingAriaLabel"
              @click="marketingCookies"
              class="toggle-btn rel right"
              :class="{
                active:
                  !cookie.isCookieActive('ip') ||
                  !cookie.isCookieActive('country') ||
                  !cookie.isCookieActive('timezone') ||
                  !cookie.isCookieActive('time') ||
                  !cookie.isCookieActive('spenttime'),
              }"
            >
              <div class="span">
                <span></span>
              </div>
              <div class="p-one-two">
                <p class="one">{{ $t("mone") }}</p>
                <p class="two">{{ $t("mtwo") }}</p>
              </div>
            </button>
          </div>
        </article>
      </div>

      <div class="performance-cookies">
        <span class="m-head">{{ $t("Performance") }}</span>
        <article>
          <div class="performance-btns">
            <!-- <button
              :aria-label="getAriaLabel('themes').value"
              @click="cookie.toggleCookie('themes')"
              class="toggle-btn rel right"
              :class="{ active: cookie.isCookieActive('themes') }"
            >
              <div class="span">
                <span></span>
              </div>
              <div class="p-one-two">
                <p class="one">{{ $t("themesone") }}</p>
                <p class="two">{{ $t("themestwo") }}</p>
              </div>
            </button> -->
            <!-- <button
              :aria-label="getAriaLabel('prefers').value"
              @click="togglePrefers"
              class="toggle-btn rel right"
              :class="{ active: cookie.isCookieActive('prefers') }"
            >
              <div class="span">
                <span></span>
              </div>
              <div class="p-one-two">
                <p class="one">{{ $t("themesdone") }}</p>
                <p class="two">{{ $t("themesdtwo") }}</p>
              </div>
            </button> -->

            <button
              :aria-label="getAriaLabel('langs').value"
              @click="cookie.toggleCookie('langs')"
              class="toggle-btn rel right"
              :class="{ active: cookie.isCookieActive('langs') }"
            >
              <div class="span">
                <span></span>
              </div>
              <div class="p-one-two">
                <p class="one">{{ $t("langsone") }}</p>
                <p class="two">{{ $t("langstwo") }}</p>
              </div>
            </button>
            <button
              :aria-label="getAriaLabel('listeners').value"
              @click="cookie.toggleCookie('listeners')"
              class="toggle-btn rel right"
              :class="{ active: cookie.isCookieActive('listeners') }"
            >
              <div class="span">
                <span></span>
              </div>
              <div class="p-one-two">
                <p class="one">{{ $t("listenersone") }}</p>
                <p class="two">{{ $t("listenerstwo") }}</p>
              </div>
            </button>
            <button
              :aria-label="getAriaLabel('animations').value"
              @click="cookie.toggleCookie('animations')"
              class="toggle-btn rel right"
              :class="{ active: cookie.isCookieActive('animations') }"
            >
              <div class="span">
                <span></span>
              </div>
              <div class="p-one-two">
                <p class="one">{{ $t("animationsone") }}</p>
                <p class="two">{{ $t("animationstwo") }}</p>
              </div>
            </button>
            <button
              :aria-label="getAriaLabel('transitions').value"
              @click="cookie.toggleCookie('transitions')"
              class="toggle-btn rel right"
              :class="{ active: cookie.isCookieActive('transitions') }"
            >
              <div class="span">
                <span></span>
              </div>
              <div class="p-one-two">
                <p class="one">{{ $t("transitionsone") }}</p>
                <p class="two">{{ $t("transitionstwo") }}</p>
              </div>
            </button>
            <button
              :aria-label="getAriaLabel('blur').value"
              @click="cookie.toggleCookie('blur')"
              class="toggle-btn rel right"
              :class="{ active: cookie.isCookieActive('blur') }"
            >
              <div class="span">
                <span></span>
              </div>
              <div class="p-one-two">
                <p class="one">{{ $t("blurone") }}</p>
                <p class="two">{{ $t("blurtwo") }}</p>
              </div>
            </button>
          </div>
          <div class="accept-decline">
            <button
              :aria-label="performanceAriaLabel"
              @click="performanceCookies()"
              class="toggle-btn rel right"
              :class="{
                active:
                  !cookie.isCookieActive('themes') ||
                  !cookie.isCookieActive('prefers') ||
                  !cookie.isCookieActive('langs') ||
                  !cookie.isCookieActive('listeners') ||
                  !cookie.isCookieActive('animations') ||
                  !cookie.isCookieActive('transitions') ||
                  !cookie.isCookieActive('blur'),
              }"
            >
              <div class="span">
                <span></span>
              </div>
              <div class="p-one-two">
                <p class="one">{{ $t("pone") }}</p>
                <p class="two">{{ $t("ptwo") }}</p>
              </div>
            </button>
          </div>
        </article>
      </div>
      <div class="all-cookies">
        <span class="m-head"></span>



        <article>
          <div class="accept-decline">

            
            <button
              :aria-label="$t('nonebtn')"
              @click="cookie.declineAllCookies(), toggleCookie()"
              class="toggle-btn rel right"
              :class="{
                active:
                !cookie.isCookieActive('ip') ||
                !cookie.isCookieActive('country') ||
                !cookie.isCookieActive('timezone') ||
                !cookie.isCookieActive('time') ||
                !cookie.isCookieActive('spenttime') || 
                !cookie.isCookieActive('themes') ||
                !cookie.isCookieActive('prefers') ||
                !cookie.isCookieActive('langs') ||
                !cookie.isCookieActive('listeners') ||
                !cookie.isCookieActive('animations') ||
                !cookie.isCookieActive('transitions') ||
                !cookie.isCookieActive('blur'),
              }"
            >
              <div class="span">
                <span></span>
              </div>
              <div class="p-one-two">
                <p class="one">{{ $t("none") }}</p>
                <p class="two">{{ $t("none") }}</p>
              </div>
            </button>


            <button
              :aria-label="$t('allbtn')"
              @click="cookie.acceptAllCookies(), toggleCookie()"
              class="toggle-btn rel right"
              :class="{
                active:
                cookie.isCookieActive('ip') ||
                cookie.isCookieActive('country') ||
                cookie.isCookieActive('timezone') ||
                cookie.isCookieActive('time') ||
                cookie.isCookieActive('spenttime') || 
                cookie.isCookieActive('themes') ||
                cookie.isCookieActive('prefers') ||
                cookie.isCookieActive('langs') ||
                cookie.isCookieActive('listeners') ||
                cookie.isCookieActive('animations') ||
                cookie.isCookieActive('transitions') ||
                cookie.isCookieActive('blur'),
              }"
            >
              <div class="span">
                <span></span>
              </div>
              <div class="p-one-two">
                <p class="one">{{ $t("all") }}</p>
                <p class="two">{{ $t("all")}}</p>
              </div>
            </button>
          </div>






          <!-- <button
            @click="
              cookie.declineAllCookies(), page.toggleElementVisibility('cookie')
            "
          >
            {{ $t("all")
            }}<span
              v-if="
              !cookie.isCookieActive('performance') &&
              !cookie.isCookieActive('marketing')
              "
              >X</span
            >
          </button>
          <button
            @click="
              cookie.declineAllCookies(), page.toggleElementVisibility('cookie')
            "
          >
            {{ $t("none")
            }}<span
              v-if="
                !cookie.isCookieActive('performance') &&
                !cookie.isCookieActive('marketing')
              "
              >X</span
            >
          </button> -->
        </article>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
html {
  &.notransitions {
    transition: unset !important;
  }
}

$cookie: (
  "light": (
    cookie: #ffffff,
    cookiebg: #001aff,
  ),

  "dark": (
    cookie: #111111,
    cookiebg: #262626,
  ),
);

.cookie {
  position: fixed;
  z-index: 9999;
  width: 100%;
  overflow: hidden;
  visibility: hidden;
  opacity: 0;
  bottom: -500px;
  background: clr(cookie);
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.2);
  transition: bottom ease 0.2s, opacity ease 0.2s, visibility ease 0.2s;
  @include setColors($cookie);
}

.cookie-wrapper {
  position: relative;
  width: calc(80% + 30px);
  min-width: 80%;
  padding: 20px calc(10% - 8vw); // Postavite početni padding
  margin-inline: auto;
  @include flex-full(flex-start, flex-start, row);
  justify-items: center;
  gap: 30px;
  transition: padding ease 0.2s; // Dodajte prijelaz na padding
}
.toggle-btn {
  @include toggleButton();
}
.marketing-cookies {
}
.marketing-cookies,
.performance-cookies, .all-cookies {
  position: relative;
  width: 100%;
  height: 100%;
  white-space: nowrap;
}
.m-head {
  font-size: $f-size1;
  color: clr(font);
}
/*.performance-cookies article {
  position: absolute;
  right: 0;
  top: 0;
}*/
.marketing-cookies article,
.performance-cookies article, .all-cookies article {
  height: 100%;
  white-space: nowrap;
  @include flex-full(flex-start, flex-start, column);
}
.marketing-btns,
.performance-btns,
.accept-decline {
  position: relative;
  width: 100%;
  @include flex-full(flex-start, flex-start, column);
  padding: 10px 0px 20px 0px;
  gap: 10px;
}
.cookie.active {
  bottom: 0;
  overflow: 1;
  visibility: visible;
  opacity: 1;
}
@include px(500) {
  .cookie-wrapper {
    width: 100%;
    padding: 5px 5px;
  }
}
</style>
