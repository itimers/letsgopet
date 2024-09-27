<script setup lang="ts">
const page = usePagesStore();
const isPageThree = ref(false);
const currentLanguage = computed(() => page.language);
onMounted(() => {
  page.page = 3;
});
</script>
<template>
  <div class="page page-qr">
    <div class="page-size">
      <div class="qr-page">
        <div class="page-header">
          <LinksClassicHomelogo class="logo-qr" />
          <p>{{ $t("Ko neguje vašeg ljubimca") }}</p>
        </div>

        <div class="qr-wrapper">
          <div class="up">
            <div class="qr-header">
              <h2>{{ $t("Društvene mreže") }}</h2>
              <ModalsCloudLocales class="locales" :class="currentLanguage" />
            </div>
            <ul>
              <li class="ig">
                <NuxtLink
                  :to="page.igLink"
                  target="_blank"
                  :aria-label="$t('igprofile')"
                >
                  <IconsSocialsInstagram />
                  <p>{{ $t("Zaprati nas na Instagram-u") }}</p>
                </NuxtLink>
              </li>
              <li class="fb">
                <NuxtLink
                  :to="page.fbLink"
                  target="_blank"
                  :aria-label="$t('fbprofile')"
                >
                  <IconsSocialsFacebook />
                  <p>{{ $t("Zaprati nas na Facebook-u") }}</p>
                </NuxtLink>
              </li>
              <li class="tt">
                <NuxtLink
                  :to="page.tiktokLink"
                  target="_blank"
                  :aria-label="$t('tiktok')"
                >
                  <IconsSocialsTikt />
                  <p>{{ $t("Zaprati nas na TikTok-u") }}</p>
                </NuxtLink>
              </li>
            </ul>
          </div>
          <div class="down">
            <div class="qr-header">
              <h2>{{ $t("Kontakt informacije") }}</h2>
            </div>
            <ul>
              <li class="phone">
                <NuxtLink
                  :to="page.phone"
                  target="_blank"
                  :aria-label="$t('phone')"
                >
                  <IconsSocialsPhone />
                  <p>{{ $t("Pozovi nas preko telefona") }}</p>
                </NuxtLink>
              </li>
              <li class="vib">
                <NuxtLink
                  :to="page.linkVib"
                  target="_blank"
                  :aria-label="$t('phone')"
                >
                  <IconsSocialsViber />
                  <p>{{ $t("Pozovi nas preko Viber-a") }}</p>
                </NuxtLink>
              </li>
              <li class="wa">
                <NuxtLink
                  :to="page.waLink"
                  target="_blank"
                  :aria-label="$t('phone')"
                >
                  <IconsSocialsWa />
                  <p>{{ $t("Pozovi nas preko WhatsApp-a") }}</p>
                </NuxtLink>
              </li>
              <li class="loc">
                <NuxtLink
                  :to="page.phone"
                  target="_blank"
                  :aria-label="$t('phone')"
                >
                  <IconsDefaultMaps />
                  <p>{{ $t("Upali Google navigaciju") }}</p>
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>
        <div class="thanks">
          {{ $t("Hvala što ste skenirali QR kod") }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">

</style>
