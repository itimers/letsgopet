<script lang="ts" setup>
const page = usePagesStore();
const i18n = useI18n();

const image8UrlRef = ref<HTMLElement | null>(null);
const image9UrlRef = ref<HTMLElement | null>(null);
const image10UrlRef = ref<HTMLElement | null>(null);
const image11UrlRef = ref<HTMLElement | null>(null);
const image12UrlRef = ref<HTMLElement | null>(null);

const imageRefs = [
  image8UrlRef,
  image9UrlRef,
  image10UrlRef,
  image11UrlRef,
  image12UrlRef,
];
const image8Url = "/img/house.webp";
const image9Url = "/img/welove.webp";
const image10Url = "/img/vip.webp";
const image11Url = "/img/ig.webp";
const image12Url = "/img/mapa.webp";
const imageUrls = [
  image8Url,
  image9Url,
  image10Url,
  image11Url,
  image12Url,
];

const preloadImage = (src: string): Promise<void> => {
  if (!import.meta.client) return Promise.resolve(); // Skip on server
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;

    img.onload = () => {
      resolve();
    };

    img.onerror = (error) => {
      reject(new Error(`Neuspešno učitavanje slike sa: ${src}`));
    };
  });
};

const sections = [
  {
    id: 1,
    sectionName: i18n.t("Vrtic"),
    slotName: "section1",
    idtag: i18n.t("vrtic"),
  },
  {
    id: 2,
    sectionName: i18n.t("Usluge vrtica"),
    slotName: "section2",
    idtag: i18n.t("usluge-vrtica"),
  },
  {
    id: 3,
    sectionName: i18n.t("Cenovnik"),
    slotName: "section3",
    idtag: i18n.t("cenovnik"),
  },
  {
    id: 4,
    sectionName: i18n.t("Kontakt"),
    slotName: "section4",
    idtag: i18n.t("kontakt"),
  },
];

const sectionRefs = sections.map(() => ref<HTMLElement | null>(null));

const observeOnScroll = computed(
  () => page.isScrolled && page.currentScroll >= 250
);

function debounce<T extends any[]>(func: (...args: T) => void, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return function (...args: T) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

function addHashToLocation(sectionId: string) {
  if (import.meta.client && window.location.hash !== `#${sectionId}`) {
    history.pushState(
      {},
      "",
      `${window.location.pathname}#${encodeURIComponent(sectionId)}`
    );
  }
}

const observers: IntersectionObserver[] = [];
const stopWatchers: (() => void)[] = [];

onMounted(async () => {
  if (!import.meta.client) return; // Skip on server

  const preloadImages = [1];
  page.changePage(2);

  const sectionNames = sections.map((section) => section.sectionName);
  const sectionIds = sections.map((section) => section.idtag);
  page.setSectionNames(sectionNames);
  page.setSectionIds(sectionIds);

  sections.forEach((section, index) => {
    if (import.meta.client) {
      const sectionElement = document.querySelector(
        `#${section.idtag}`
      ) as HTMLElement | null;
      if (sectionElement) {
        sectionRefs[index].value = sectionElement;
      }
    }
  });

  const hash = import.meta.client ? window.location.hash.substring(1) : '';
  const sectionIndex = sections.findIndex((section) => section.idtag === hash);
  if (hash && sectionRefs[sectionIndex]?.value) {
    if (sectionIndex !== -1) {
      page.changeSection(sectionIndex + 1);
    }
  }

  const updateUrlWithSectionId = debounce(
    (sectionId: string, sectionRef: any) => {
      if (
        import.meta.client &&
        window.location.hash !== `#${sectionId}` &&
        sectionRef.value &&
        observeOnScroll.value
      ) {
        addHashToLocation(sectionId);
      }
    },
    400
  );

  const observeSection = (
    sectionRef: globalThis.Ref<HTMLElement | null>,
    sectionId: number,
    imageRef: globalThis.Ref<HTMLElement | null>,
    imageUrl: string
  ) => {
    if (sectionRef.value) {
      const debouncedAddActiveSection = debounce((id: number) => {
        page.addActiveSection(id);
      }, 400);

      const debouncedSetActiveSection = debounce((id: number) => {
        page.setActiveSection(id);
      }, 400);

      const rootMargin =
        page.dynamicRootMarginsByPage[page.currentSection]?.[sectionId] || "0px";

      const observerCallback = (entries: IntersectionObserverEntry[]) => {
        entries.forEach(async (entry) => {
          if (entry.isIntersecting) {
            debouncedAddActiveSection(sectionId);
            debouncedSetActiveSection(sectionId);

            // Provera i učitavanje slike kada sekcija postane vidljiva
            if (
              imageRef.value &&
              !imageRef.value.style.backgroundImage &&
              import.meta.client
            ) {
              try {
                await preloadImage(imageUrl);
                imageRef.value.style.backgroundImage = `url('${imageUrl}')`;
              } catch (error) {
                console.error("Greška pri učitavanju slike:", error);
              }
            }

            if (page.isScrollingTopBottom) {
              updateUrlWithSectionId(page.sectionIds[sectionId - 1], sectionRef);
            }
          }
        });
      };

      const observerDown = new IntersectionObserver(observerCallback, {
        threshold: [0.1],
        rootMargin,
      });

      const observerUp = new IntersectionObserver(observerCallback, {
        threshold: [0.9],
        rootMargin,
      });

      observers.push(observerDown, observerUp);

      const observe = () => {
        if (sectionRef.value) {
          if (page.scrollDirection === "up") {
            observerDown.disconnect();
            observerUp.observe(sectionRef.value);
          } else if (page.scrollDirection === "down") {
            observerUp.disconnect();
            observerDown.observe(sectionRef.value);
          }
        }
      };

      observe();

      const stopWatch = watch(
        () => page.scrollDirection,
        (newDirection, oldDirection) => {
          if (newDirection !== oldDirection) {
            observe();
          }
        }
      );

      stopWatchers.push(stopWatch);
    }
  };

  // Preload slika koje su unapred odabrane
  preloadImages.forEach(async (index) => {
    const imageRef = imageRefs[index - 1]; // Pošto je index 1-based, a niz 0-based
    const imageUrl = imageUrls[index - 1];

    if (imageRef?.value) {
      try {
        await preloadImage(imageUrl); // Učitavanje slike unapred
        imageRef.value.style.backgroundImage = `url('${imageUrl}')`;
      } catch (error) {
        //console.error("Greška pri preload-u slike:", error);
      }
    }
  });

  // Posmatraj svaku sekciju i njenu sliku (samo za one koje nisu preloadaovane)
  sectionRefs.forEach((sectionRef, index) => {
    const imageRef = imageRefs[index];
    const imageUrl = imageUrls[index];

    if (!preloadImages.includes(index + 1)) {
      observeSection(sectionRef, index + 1, imageRef, imageUrl);
    }
  });

  const resizeListener = () => page.countSections();
  if (import.meta.client) {
    window.addEventListener("resize", resizeListener);
  }
  stopWatchers.push(() => {
    if (import.meta.client) {
      window.removeEventListener("resize", resizeListener);
    }
  });

  const hashWatcher = watch(
    () => (import.meta.client ? window.location.hash : ''),
    (newHash) => {
      const sectionId = newHash.substring(1);
      if (sectionId) {
        const sectionIndex =
          sections.findIndex((section) => section.idtag === sectionId) + 1;
        if (sectionIndex) {
          page.changeSection(sectionIndex);
        }
      }
    }
  );
  stopWatchers.push(hashWatcher);

  await new Promise((resolve) => setTimeout(resolve, 100));
});

onBeforeUnmount(() => {
  observers.forEach((observer) => observer.disconnect());
  stopWatchers.forEach((stopWatch) => stopWatch());
});
</script>

<template>
  <div class="page page-vrtic">
    <div class="page-size">
      <div class="sections vrtic" ref="setSectionRef" id="target1">
        <section
          ref="section1Ref"
          :data-section-id="1"
          :class="[
            'section section-1 vrtic',
            {
              active: page.activeSectionsByPage[page.page]
                ? page.activeSectionsByPage[page.page].includes(1)
                : false,
            },
          ]"
          :slot="sections[0].slotName"
          :id="`${sections[0].idtag}`"
        >
          <article class="vrtic">
            <h1>{{ $t("Vrtic za pse") }}</h1>
            <figure>
              <h3>{{ $t("Mi ih") }}</h3>
              <figcaption>
                <p>{{ $t("Svaki dan je dan zabave!") }}</p>
                <p>{{ $t("Transport, čuvanje i održavanje vašeg psa!") }}</p>
              </figcaption>
            </figure>
            <div class="link-box">
              <div class="link-btn">
                <LinksTosocialIg class="link-to" />
                <p class="book">
                  {{ $t("Zakazivanje isključivo preko DM poruke") }}
                </p>
              </div>
            </div>
          </article>
          <aside :class="{ scroll: page.isScrolled }" class="house">
            <div class="img-dog" ref="image8UrlRef"></div>
            <!-- <img src="/assets/img/dogs/4-ps.jpg" /> -->
          </aside>
        </section>

        <section
          ref="section2Ref"
          :data-section-id="2"
          :class="[
            'section section-2 vrtic',
            {
              active: page.activeSectionsByPage[page.page]
                ? page.activeSectionsByPage[page.page].includes(2)
                : false,
            },
          ]"
          :slot="sections[1].slotName"
          :id="`${sections[1].idtag}`"
        >
          <article>
            <div class="box-pic">
              <div class="box-text vrtic">
                <h2>{{ $t("Vrtic za pse") }}</h2>
                <p>
                  {{ $t("Vrtic tekst") }}
                </p>
                <p>
                  {{ $t("Vrtic tekst2") }}
                </p>
              </div>
              <div class="pic-box vrtic" ref="image9UrlRef"></div>
            </div>

            <aside>
              <div class="link-box vrtic">
                <div class="link-btn">
                  <LinksTosocialIg class="link-to" />
                  <p class="book">
                    {{ $t("Zakazite uvek") }}
                  </p>
                </div>
              </div>
            </aside>
          </article>
        </section>

        

        <section
          ref="section3Ref"
          :data-section-id="3"
          :class="[
            'section section-3',
            {
              active: page.activeSectionsByPage[page.page]
                ? page.activeSectionsByPage[page.page].includes(3)
                : false,
            },
          ]"
          :slot="sections[2].slotName"
          :id="`${sections[2].idtag}`"
        >
          <article>
            <h2>{{ $t("Cenovnik") }}</h2>
            <h3 style="text-align: center">{{ $t("Placanje iskljucivo karticama") }}</h3>
            <figure>
              <figcaption class="vrtic">
                <div class="box-1 style">
                  <div class="box-header">
                    <p>{{ $t("VRTIĆ ZA MALE PSE") }}</p>
                    <span>{{ $t("MESEČNA NAKNADA") }}</span>
                  </div>
                  <ul>
                    <li class="vrtic">{{ $t("Gratis jednom") }}</li>
                    <li>{{ $t("Šišanje") }}</li>
                    <li>{{ $t("Kupanje") }}</li>
                    <li>{{ $t("Sušenje") }}</li>
                  </ul>

                  <div class="prices center">
                    <div class="discount-img">
                      <IconsDefaultPaw2 />
                      <p v-if="page.currentLanguage === 'sr'">36 000 RSD</p>
                      <p v-else>300 €</p>
                    </div>
                    <!-- <div class="discount-img2">
                      <IconsDefaultCrown />
                      <p>43 €</p>
                    </div> -->
                  </div>
                </div>
                <div class="box-2 style">
                  <div class="box-header">
                    <p>{{ $t("TRANSPORT") }}</p>
                    <span>{{ $t("Dodatna naknada uz vrtić") }}</span>
                  </div>
                  <ul>
                    <li class="vrtic">
                      {{ $t("Preuzimamo i vracamo ljubimca") }}
                    </li>
                    <li>{{ $t("Transport svakog dana") }}</li>

                    <li>{{ $t("Dogovoreni transport") }}</li>
                  </ul>

                  <div class="prices center">
                    <div class="discount-img">
                      <IconsDefaultPaw2 />
                      <p v-if="page.currentLanguage === 'sr'">5000 RSD</p>
                      <p v-else>45 €</p>
                    </div>
                    <!-- <div class="discount-img2">
                      <IconsDefaultCrown />
                      <p>50 €</p>
                    </div> -->
                  </div>
                </div>
                <div class="box-3 style">
                  <div class="box-header">
                    <p>{{ $t("PANSION 24h") }}</p>
                  </div>
                  <ul>
                    <li>{{ $t("Boravak psa") }}</li>
                  </ul>
                  <div class="prices">
                    <div class="discount-img">
                      <IconsDefaultPaw2 />
                      <p v-if="page.currentLanguage === 'sr'">2000 RSD</p>
                      <p v-else>18 €</p>
                    </div>
                    <div class="discount-img2">
                      <IconsDefaultCar />
                      <p v-if="page.currentLanguage === 'sr'">1000 RSD</p>
                      <p v-else>8 €</p>
                    </div>
                  </div>
                </div>
              </figcaption>
            </figure>

            <aside>
              <div class="important">
                <p class="first">
                  {{ $t("Napomena") }}
                </p>
                <p class="second">
                  {{ $t("Svi tretmani") }}
                </p>
              </div>

              <div class="link-box">
                <div class="link-btn">
                  <LinksTosocialIg class="link-to" />
                </div>
                <p class="first">
                  {{ $t("Zakazite") }}
                </p>
              </div>
            </aside>
          </article>
        </section>

        <section
          ref="section4Ref"
          :data-section-id="4"
          :class="[
            'section section-4 section-vrtic',
            {
              active: page.activeSectionsByPage[page.page]
                ? page.activeSectionsByPage[page.page].includes(4)
                : false,
            },
          ]"
          :slot="sections[3].slotName"
          :id="`${sections[3].idtag}`"
        >
        <article>
          <h2>{{ $t("Kontakt") }}</h2>

          <figure>
            <figcaption>
              <div class="igpic" ref="image11UrlRef">
                <div class="overlay">
                  <NuxtLink
                    :to="page.igLink"
                    target="_blank"
                  ></NuxtLink>
                  <p>{{ $t("Klikni da odes na Instagram profil") }}</p>
                </div>
              </div>
              <div class="mappic" ref="image12UrlRef">
                <div class="overlay">
                  <NuxtLink
                    :to="page.mapLink"
                    target="_blank"
                    :aria-label="$t('igprofile')"
                  ></NuxtLink>
                  <p>{{ $t("Klikni da odes na Google Mape") }}</p>
                </div>
              </div>
            </figcaption>
          </figure>
          <aside>
            <div class="link-box">
              <div class="link-btn">
                <LinksTosocialIg2 class="link-to" />
              </div>
            </div>
            <div class="link-box link2">
              <div class="link-btn">
                <LinksTosocialMap class="link-to" />
              </div>
            </div>
          </aside>
        </article>
        </section>
      </div>
    </div>
  </div>
</template>
