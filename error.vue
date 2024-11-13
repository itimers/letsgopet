<template>
  <div class="error">
    <div class="center">
      <template v-if="error && error.statusCode === 404">
        <h1>404!</h1>
        <p>{{ $t("Izvini") }}</p>
        <p>
          {{ $t("Preusmeravanje za") }} {{ formattedCountdown }}
          {{ $t("sekundi...") }}
        </p>
        <p>{{ $t("Vrati se na pocetnu") }}</p>
        <LinksClassicHome />
      </template>
      <template v-else>
        <h1>Oooh</h1>
        <p>
          <strong>{{ error && error.message }}</strong>
        </p>
        <p>{{ $t("Nesto nije uredu") }}</p>
        <p>{{ $t("Izvini zbog toga") }}</p>
        <p>{{ $t("Idi na pocetnu") }}</p>
        <LinksClassicHome />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { usePagesStore } from "@/stores/page";

const error = useError();
const lang = usePagesStore();
const countdown = ref(10000); // 10 sekundi u milisekundama
const formattedCountdown = ref("");

const handleError = () => {
  if (error.value && error.value.statusCode === 404) {
    // Proveravamo da li je error.value definisan
    const startTime = Date.now();
    const countdownInterval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      countdown.value = 10000 - elapsedTime;

      if (countdown.value <= 0) {
        clearInterval(countdownInterval);

        if (lang.currentLanguage === "sr") {
          navigateTo("/");
        } else if (lang.currentLanguage === "en") {
          navigateTo("/en/");
        } else if (lang.currentLanguage === "ru") {
          navigateTo("/ru/");
        } else if (lang.currentLanguage === "de") {
          navigateTo("/de/");
        } else {
          navigateTo("/");
        }
      }
    }, 100); // Proveravamo svakih 100ms radi tačnijeg odbrojavanja

    // Formatiranje odbrojavanja za prikaz u template-u
    setInterval(() => {
      formattedCountdown.value = (countdown.value / 1000).toFixed(1);
    }, 100);
  } else {
    clearError({ redirect: "/" });
  }
};

onMounted(() => {
  handleError();
});



useHead({
  title: "Oops, Error",
meta: [
    {
      name: 'robots',
      content: 'noindex, nofollow',
    },
  ],
});
</script>

<style scoped lang="scss">
.error {
  font-family: "Poppins";
  position: absolute;
  background: #ffffea !important;
  height: 100%;
  width: 100%;
  .center {
    height: 100%;
    display: grid;
    place-items: center;
    place-content: center;
  }
  h1 {
    color: #dc9176 !important;
    margin-bottom: 10px;
  }
  p {
    color: #dc9176;
  }
  a {
    color: #ffffff;
    padding: 2px 10px;
    background: #7aaa5f;
    border-radius: 33px;
    transform: scale(1);
    margin-top: 20px;
    transition: all ease 0.3s;
    &:hover {
      transform: scale(1.1);
    }
  }
}
</style>
