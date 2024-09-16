<template>
    <PagesGuestVrticTemplate/>
</template>
<script setup lang="ts">
import { useI18n } from "vue-i18n";

const i18n = useI18n();


useHead({
  title:  i18n.t("PocetnaSEO"),
  htmlAttrs: {
        lang: i18n.locale
  },
meta: [
    {
      name: 'date',
      content: i18n.t("Datum"),
    },
    {
      name: 'description',
      content: i18n.t("PocetnaDescription"),
    },
    {
      name: 'keywords',
      content: i18n.t("PocetnaKeywords"),
    },
    {
      name: 'language',
      content: i18n.t("language"),
    },
    {
      property: 'og:title',
      content: i18n.t("PocetnaSEO"),
    },
    {
      property: 'og:description',
      content: i18n.t("PocetnaDescription"),
    },
    /* {
      property: 'og:image',
      content: 'https://letsgopet.rs/og/home',
    }, */
    
    {
      property: 'og:url',
      content: 'https://www.letsgopet.rs',
    },
    {
      property: 'og:locale',
      content: i18n.t("language"),
    },
    {
      property: 'og:site_name',
      content: i18n.t("Let's Go Pet"),
    },
    {
      name: 'geo.placename',
      content: i18n.t("Beograd"),
    },
    {
      'http-equiv': 'content-language',
      content: i18n.t("language"),
    },
  ],
});
</script>