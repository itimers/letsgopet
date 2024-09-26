<script setup lang="ts">
const page = usePagesStore();
const currentLanguage = computed(() => page.language);
const phoneNumberParts = ["381", "64", "960", "6474"];
const phone = ref(`tel:${phoneNumberParts.join("")}`);
const igLinkParts = [
  "htt",
  "ps://ww",
  "w.insta",
  "gram.co",
  "m/lets",
  "go",
  "pe",
  "t.rs",
];
const igLink = ref(`${igLinkParts.join("")}`);
const fbLinkParts = [
  "htt",
  "ps://ww",
  "w.face",
  "book.co",
  "m/let",
  "s",
  "go",
  "pet.rs",
];
const fbLink = ref(`${fbLinkParts.join("")}`);
onMounted(() => {
  page.page = 3;
});
</script>
<template>
  <div class="page page-qr" v-if="page.page === 3">
    <div class="page-size">
      <div class="qr-page">
        <div class="page-header">
            <LinksClassicHomelogo class="logo-qr"/>
            <p>{{ $t("Ko neguje vašeg ljubimca") }}</p>
        </div>
        
        <div class="qr-wrapper">
          <div class="up">
            <div class="qr-header">
                <h2>{{ $t("Društvene mreže") }}</h2>
                <ModalsCloudLocales class="locales" :class="currentLanguage"/>
            </div>
            <ul>
              <li class="ig">
                <NuxtLink :to="igLink" target="_blank" :aria-label="$t('igprofile')">
                  <IconsSocialsInstagram />
                  <p>{{ $t("Zaprati nas na Instagram-u") }}</p>
                </NuxtLink>
              </li>
              <li class="fb">
                <NuxtLink :to="fbLink" target="_blank" :aria-label="$t('fbprofile')">
                  <IconsSocialsFacebook />
                  <p>{{ $t("Zaprati nas na Facebook-u") }}</p>
                </NuxtLink>
              </li>
              <li class="tt">
                <NuxtLink :to="phone" target="_blank" :aria-label="$t('phone')">
                  <IconsSocialsFacebook />
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
                <NuxtLink :to="phone" target="_blank" :aria-label="$t('phone')">
                  <IconsSocialsPhone />
                  <p>{{ $t("Pozovi nas preko telefona") }}</p>
                </NuxtLink>
              </li>
              <li class="vib">
                <NuxtLink :to="phone" target="_blank" :aria-label="$t('phone')">
                  <IconsSocialsPhone />
                  <p>{{ $t("Pozovi nas preko Viber-a") }}</p>
                </NuxtLink>
              </li>
              <li class="wa">
                <NuxtLink :to="phone" target="_blank" :aria-label="$t('phone')">
                  <IconsSocialsPhone />
                  <p>{{ $t("Pozovi nas preko WhatsApp-a") }}</p>
                </NuxtLink>
              </li>
              <li class="loc">
                <NuxtLink :to="phone" target="_blank" :aria-label="$t('phone')">
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

<style lang="scss" scoped>

@include locale();
.down {
    margin-top: 20px;
}
.page-header {
    p {
        width: 100%;
        font-size: clamp(70%, 70% + 2.1vw, 200%);
        font-weight: 500;
        font-family: "Passion One", sans-serif;
        background: linear-gradient(215deg, #6ca14f, #4ac1dc);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        background-size: 150% 150%;
        text-shadow: 2px 2px 3px #7ce5ad5c;
        margin-bottom: 10px;
    }
    .logo-qr {
          font-size: clamp(80%, 120% + 2.5vw, 600%);
          font-weight: 600;
          text-align: center;
          color: clr(font-primary);
          font-family: "Passion One", sans-serif;
          text-shadow: 3px 3px 4px #68482146;
    }
}
.qr-header {
    @include flex-custom(space-between, center);
    h2  {
        white-space: nowrap;
        color: #8a7d6c;
        font-weight: 600;
        font-size: clamp(70%, 70% + 1.5vw, 120%);
    }
}
.thanks {
    text-align: center;
    margin-top: 10px;
    font-weight: 500;
    color: #595959;
    font-weight: 600;
}
.page-qr {
  position: relative;
  height: 100%;
  width: 100%;
}
.page-size {
  position: relative;
  width: 100%;
  height: 100%;
}
.qr-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 15px 25px 5px 25px;
  box-shadow: 0px 10px 40px 0px rgba($color: #888888, $alpha: .3);
  border-radius: 13px;
}
.qr-page {
  position: absolute;
  top: 50%;
  left: 50%;
  text-align: center;
  transform: translate(-50%, 20px);
}
ul {
  position: relative;
  list-style-type: none;
  padding: 20px 0px;
  li {
    margin-bottom: 15px;
    &:last-child {
        margin-bottom: 0px;
    }
    a {
      @include flex-custom(flex-start, center);
      background: green;
      border-radius: 33px;
      padding: 10px 15px;
      p {
        padding: 0px 15px;
        font-weight: 500;
        color: white;
        white-space: nowrap;
      }
    }
    &.phone,
    &.wa,
    &.vib,
    &.loc,
    &.ig,
    &.fb,
    &.tt {
      svg {
        width: 30px;
        height: 30px;
        fill: white;
      }
    }
    &.ig {
        a {
            background: rgb(249,206,52);
            background: linear-gradient(90deg, rgba(249,206,52,1) 0%, rgba(238,42,123,1) 48%, rgba(98,40,215,1) 100%);
        }
    }
    &.fb {
        a {
            background: #1778F2;
        }
    }
    &.tt {
        a {
            background: rgba(254,40,88,1);
        }
    }
    &.phone {
        a {
            background: linear-gradient(215deg, #4fa17c, #4ac1dc);
        }
    }
    &.vib {
        a {
            background: #7360f2;
        }
    }
    &.wa {
        a {
            background: #25d366;
        }
    }
    &.loc {
        a {
            background: #1A73E8;
        }
    }
  }
}
</style>
