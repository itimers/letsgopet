<template>
  <div
    class="locales"
    :class="
    currentLanguage,
    (
      {
        active: page.states.find(
          (el) => el.btn === 'locales' && el.activemenu
        ),
      })
    "
  >
    <div class="circle"></div>
    <div
      class="locale-btn"
      @click.stop="toggleLocale"
    ></div>

    <div
     @click.stop="updateZindex"
      class="locales-cloud-modal"
      v-if="page.states.find((el) => el.btn === 'locales' && el.activebtn)"
      :style="{
        zIndex: page.states.find((el) => el.menu === 'localesdiv')?.zIndex,
      }"
      :class="{
        active: page.states.find(
          (el) => el.menu === 'localesdiv' && el.activemenu
        ),
      }"
    >
      <button @click.stop="updateZindex"
        @click="changeLanguage('sr'), toggleLocale()"
        :class="{
          active:
            currentLanguage === 'sr' &&
            !['en', 'ru', 'de','tr','it'].includes(currentLanguage),
        }"
      >
        Srpski
      </button>
      <button @click.stop="updateZindex"
        @click="changeLanguage('en'), toggleLocale()"
        :class="{
          active:
            currentLanguage === 'en' &&
            !['sr', 'ru', 'de','tr','it'].includes(currentLanguage),
        }"
      >
        English
      </button>
      <button @click.stop="updateZindex"
        @click="changeLanguage('ru'), toggleLocale()"
        :class="{
          active:
            currentLanguage === 'ru' &&
            !['sr', 'en', 'de','tr','it'].includes(currentLanguage),
        }"
      >
        Русский
      </button>
      <button @click.stop="updateZindex"
        @click="changeLanguage('de'), toggleLocale()"
        :class="{
          active:
            currentLanguage === 'de' &&
            !['sr', 'en', 'ru','tr','it'].includes(currentLanguage),
        }"
      >
        Deutsch
      </button>
      <button @click.stop="updateZindex"
        @click="changeLanguage('tr'), toggleLocale()"
        :class="{
          active:
            currentLanguage === 'tr' &&
            !['sr', 'en', 'ru', 'de','it'].includes(currentLanguage),
        }"
      >
        Türkçe
      </button>
      
      <button @click.stop="updateZindex"
        @click="changeLanguage('it'), toggleLocale()"
        :class="{
          active:
            currentLanguage === 'it' &&
            !['sr', 'en', 'ru', 'de','tr'].includes(currentLanguage),
        }"
      >
        Italiano
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
const router = useRouter();
const i18n = useI18n();

const page = usePagesStore();
const currentLanguage = computed(() => page.language);
const updateZindex = () => {
    page.bringToFront(page.states.find(el => el.menu === 'localesdiv'))
}
const toggleLocale = () => {
  page.toggleElementVisibility('locales');
  setTimeout(()=> {
    if(page.states.find((el) => el.btn === 'locales' && el.activemenu)) {
      document.addEventListener("click", page.handleClickOutside, {
        passive: true,
      });
    } 
  },100)
}
const changeLanguage = (language: string) => {
  if(page.isLanguageValid(language)) {
    page.changeLanguage(language);
  }

  if(page.page === 1) {
    if (language === "sr") {
      router.push("/");
    } else {
      const newPath = `/${language}`;
      router.push(newPath);
    }
  } else if(page.page === 2) {
    if (language === "sr") {
      router.push("/vrtic-za-pse");
    } else {
      const newPath = `/${language}/pet-kindergarten`;
      router.push(newPath);
    }
  } 

  i18n.locale.value = language;
};
</script>
