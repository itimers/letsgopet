<script lang="ts" setup>
const page = usePagesStore();
const i18n = useI18n();

const section1Ref = ref<HTMLElement | null>(null);
const image2UrlRef = ref<HTMLElement | null>(null);
const image3UrlRef = ref<HTMLElement | null>(null);
const image4UrlRef = ref<HTMLElement | null>(null);
const image5UrlRef = ref<HTMLElement | null>(null);
const image6UrlRef = ref<HTMLElement | null>(null);
const image7UrlRef = ref<HTMLElement | null>(null);

const imageRefs = [
  section1Ref,
  image2UrlRef,
  image3UrlRef,
  image4UrlRef,
  image5UrlRef,
  image6UrlRef,
  image7UrlRef,
];
const image1Url = "/img/zaki.webp";
const image2Url = "/img/milasite.webp";
const image3Url = "/img/vip.webp";
const image4Url = "/img/pettransport.webp";
const image5Url = "/img/8.webp";
const image6Url = "/img/ig.webp";
const image7Url = "/img/mapa.webp";
const imageUrls = [
  image1Url,
  image2Url,
  image3Url,
  image4Url,
  image5Url,
  image6Url,
  image7Url,
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
    sectionName: i18n.t("Uvod"),
    slotName: "section1",
    idtag: i18n.t("uvod"),
  },
  {
    id: 2,
    sectionName: i18n.t("Usluge"),
    slotName: "section2",
    idtag: i18n.t("usluge"),
  },
  {
    id: 3,
    sectionName: i18n.t("Odrzavanje"),
    slotName: "section3",
    idtag: i18n.t("odrzavanje"),
  },
  {
    id: 4,
    sectionName: i18n.t("Cenovnik"),
    slotName: "section4",
    idtag: i18n.t("cenovnik"),
  },
  {
    id: 5,
    sectionName: i18n.t("Pet transport"),
    slotName: "section5",
    idtag: i18n.t("pet-transport"),
  },
  {
    id: 6,
    sectionName: i18n.t("O nama"),
    slotName: "section6",
    idtag: i18n.t("o-nama"),
  },
  {
    id: 7,
    sectionName: i18n.t("Kontakt"),
    slotName: "section7",
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

  const preloadImages = [1]; // Na primer, odmah učitaj slike 1, 3 i 5

  page.changePage(1);

  const sectionNames = sections.map((section) => section.sectionName);
  const sectionIds = sections.map((section) => section.idtag);
  page.setSectionNames(sectionNames);
  page.setSectionIds(sectionIds);

  sections.forEach((section, index) => {
    const sectionElement = document.querySelector(
      `#${section.idtag}`
    ) as HTMLElement | null;
    if (sectionElement) {
      sectionRefs[index].value = sectionElement;
    }
  });

  // Provera trenutnog hasha
  const hash = window.location.hash.substring(1);
  const sectionIndex = sections.findIndex((section) => section.idtag === hash);
  if (hash && sectionRefs[sectionIndex]?.value) {
    if (sectionIndex !== -1) {
      page.changeSection(sectionIndex + 1);
    }
  }

  const updateUrlWithSectionId = debounce(
    (sectionId: string, sectionRef: any) => {
      if (
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
        page.dynamicRootMarginsByPage[page.currentSection]?.[sectionId] ||
        "0px";

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
                //console.error("Greška pri učitavanju slike:", error);
              }
            }

            if (page.isScrollingTopBottom) {
              updateUrlWithSectionId(
                page.sectionIds[sectionId - 1],
                sectionRef
              );
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
  window.addEventListener("resize", resizeListener);
  stopWatchers.push(() => window.removeEventListener("resize", resizeListener));

  const hashWatcher = watch(
    () => window.location.hash,
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

  const sectionWatcher = watch(
    () => page.currentSection,
    (currentSection) => {
      if (currentSection === 3) {
        // Logika za kada je sekcija 3 aktivna
      } else if (currentSection === 1) {
        // Logika za kada je sekcija 1 aktivna
      }
    },
    { deep: true }
  );
  stopWatchers.push(sectionWatcher);

  await new Promise((resolve) => setTimeout(resolve, 100));
});

onBeforeUnmount(() => {
  observers.forEach((observer) => observer.disconnect());
  stopWatchers.forEach((stopWatch) => stopWatch());
});
</script>

<template>
  <div class="page page-home">
    <div class="page-size">
      <div class="sections home" ref="setSectionRef" id="target1">
        <section
          ref="section1Ref"
          :data-section-id="1"
          :class="[
            'section section-1',
            {
              active: page.activeSectionsByPage[page.page]
                ? page.activeSectionsByPage[page.page].includes(1)
                : false,
            },
          ]"
          :slot="sections[0].slotName"
          :id="`${sections[0].idtag}`"
        >
          <div
            class="box-shadow-header"
            :class="{ scrolled: page.isScrolled }"
          ></div>

          <IconsDefaultOrganic class="organic" />
          <article>
            <h1>{{ $t("Let's Go Pet") }}</h1>
            <figure>
              <h2>{{ $t("Od vas, do nas, vaš ljubimac!") }}</h2>
              <figcaption>
                <p>{{ $t("Gde god da se nalazite, mi dolazimo do vas.") }}</p>
                <p>{{ $t("Transport i održavanje vašeg psa!") }}</p>
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
          <div class="boxshadow"></div>
          <aside :class="{ scroll: page.isScrolled }" class="dog">
            <div class="img-dog">
              <!--  <img src="/public/img/4-short.webp" v-if="page.widthofHtml >= 600" alt="white-dog" fetchpriority="high" width="1000" height="600" placeholder="blur" placeholderSrc="/img/4-blur.png"/>
                <img src="/public/img/4.webp"  alt="white-dog" v-else-if="page.widthofHtml < 600" fetchpriority="high" width="650" height="600" placeholder="blur" placeholderSrc="/img/4-short-blur.png"/>
                <img src="/public/img/4.webp"  alt="white-dog" v-else-if="page.widthofHtml <= 450" fetchpriority="high" width="400" height="350" placeholder="blur" placeholderSrc="/img/4-short-blur.png"/> -->
            </div>
          </aside>
        </section>

        <section
          ref="section2Ref"
          :data-section-id="2"
          :class="[
            'section section-2',
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
              <div class="box-text">
                <h2>{{ $t("Usluge") }}</h2>
                <p>
                  {{ $t("Usluge tekst") }}
                </p>
              </div>
              <div class="pic-box" ref="image2UrlRef"></div>
            </div>

            <aside>
              <div class="link-box">
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
            <div class="box-pic">
              <div class="pic-box" ref="image3UrlRef"></div>
              <div class="box-text">
                <h2>{{ $t("Vip3") }}</h2>
                <ul class="ul-2">
                  <li>{{ $t("Vip4") }}</li>
                  <li>{{ $t("Vip5") }}</li>
                  <li>{{ $t("Vip6") }}</li>
                  <li>{{ $t("Vip7") }}</li>
                </ul>
                <p class="solo-2">{{ $t("Vip8") }}</p>
              </div>
            </div>

            <aside>
              <div class="link-box">
                <div class="link-btn">
                  <LinksTosocialIg2 class="link-to" />
                  <p class="book">
                    {{ $t("Zakazite odmah") }}
                  </p>
                </div>
              </div>
            </aside>
          </article>
          <!-- <div
            class="bg-img"
            :style="{
              width: page.widthofMain + 'px',
              height: page.sectionHeights[3] + 'px',
            }"
          >
            <div
              class="bg-paralax"
              :style="{
                width: page.widthofMain + 100 + 'px',
                height: page.sectionHeights[3] + 100 + 'px',
              }"
            >
              <div class="bg"></div>
            </div>
          </div> -->
        </section>

        <section
          ref="section4Ref"
          :data-section-id="4"
          :class="[
            'section section-4',
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
            <h2>{{ $t("Cenovnik") }}</h2>
            <figure>
              <figcaption>
                <div class="box-1 style">
                  <div class="box-header">
                    <p>{{ $t("KUPANJE") }}</p>
                  </div>
                  <ul>
                    <li>{{ $t("Kupanje") }}</li>
                    <li>{{ $t("Sušenje") }}</li>
                  </ul>

                  <div class="prices">
                    <div class="discount-img">
                      <IconsDefaultPaw2 />
                      <p v-if="page.currentLanguage === 'sr'">3000 RSD</p>
                      <p v-else>27 €</p>
                    </div>
                    <div class="discount-img2">
                      <IconsDefaultCar />
                      <p v-if="page.currentLanguage === 'sr'">1000 RSD</p>
                      <p v-else>8 €</p>
                    </div>
                  </div>
                </div>
                <div class="box-2 style">
                  <div class="box-header">
                    <p>{{ $t("KUPANJE I SISANJE") }}</p>
                  </div>
                  <ul>
                    <li>{{ $t("Kupanje i sušenje") }}</li>
                    <li>{{ $t("Sisanje") }}</li>
                    <li>{{ $t("Skraćivanje noktića") }}</li>
                    <li>
                      {{ $t("Higijena ušiju Light Trimming") }}
                    </li>
                    <li>{{ $t("Oblikovanje dlake") }}</li>
                  </ul>

                  <div class="prices">
                    <div class="discount-img">
                      <IconsDefaultPaw2 />
                      <p v-if="page.currentLanguage === 'sr'">5000 RSD</p>
                      <p v-else>45 €</p>
                    </div>
                    <div class="discount-img2">
                      <IconsDefaultCar />
                      <p v-if="page.currentLanguage === 'sr'">1000 RSD</p>
                      <p v-else>8 €</p>
                    </div>
                  </div>
                </div>
                <div class="box-3 style">
                  <div class="box-header">
                    <p>{{ $t("Hranjivo pakovanje dlake") }}</p>
                  </div>
                  <ul>
                    <li>{{ $t("Nahranite dlaku vašem ljubimcu organskim pakovanjem dlake") }}</li>
                    
                  </ul>

                  <div class="prices center">
                    <div class="discount-img">
                      <IconsDefaultPaw2 />
                      <p v-if="page.currentLanguage === 'sr'">1000 RSD</p>
                      <p v-else>8 €</p>
                    </div>
                    
                  </div>
                </div>
                <div class="box-4 style">
                  <div class="box-header">
                    <p>{{ $t("Specijalni") }}</p>
                    <span>{{ $t("MEDICAL SPA TREATMENT") }}</span>
                  </div>
                  <ul>
                    <li>
                      {{ $t("Tretman protiv seboreje") }}
                    </li>
                    <li>
                      {{ $t("Tretman protiv suve kože") }}
                    </li>
                    <li>
                      {{ $t("Tretman protiv masne kože") }}
                    </li>
                    <li>
                      {{ $t("Tretman protiv peruti") }}
                    </li>
                  </ul>

                  <div class="prices center">
                    <div class="discount-img">
                      <IconsDefaultPaw2 />
                      <p v-if="page.currentLanguage === 'sr'">2000 RSD</p>
                      <p v-else>18 €</p>
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
          <!-- <div
            class="bg-img"
            :style="{
              width: page.widthofMain + 'px',
              height: page.sectionHeights[3] + 'px',
            }"
          >
            <div
              class="bg-paralax"
              :style="{
                width: page.widthofMain + 100 + 'px',
                height: page.sectionHeights[3] + 100 + 'px',
              }"
            >
              <div class="bg"></div>
            </div>
          </div> -->
        </section>

        <section
          ref="section5Ref"
          :data-section-id="5"
          :class="[
            'section section-5',
            {
              active: page.activeSectionsByPage[page.page]
                ? page.activeSectionsByPage[page.page].includes(5)
                : false,
            },
          ]"
          :slot="sections[4].slotName"
          :id="`${sections[4].idtag}`"
        >
          <article>
            <div class="box-pic">
              <div class="box-text">
                <h2>{{ $t("Pet transport") }}</h2>
                <p>
                  {{ $t("Pet transport tekst") }}
                </p>
              </div>
              <div class="pic-box" ref="image4UrlRef"></div>
            </div>

            <aside>
              <div class="link-box">
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
          ref="section6Ref"
          :data-section-id="6"
          :class="[
            'section section-6',
            {
              active: page.activeSectionsByPage[page.page]
                ? page.activeSectionsByPage[page.page].includes(6)
                : false,
            },
          ]"
          :slot="sections[5].slotName"
          :id="`${sections[5].idtag}`"
        >
          <article>
            <div class="box-pic">
              <div class="pic-box" ref="image5UrlRef"></div>

              <div class="box-text">
                <h2>{{ $t("O nama") }}</h2>
                <p>
                  {{ $t("O nama tekst") }}
                </p>
              </div>
            </div>

            <aside>
              <div class="link-box">
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
          ref="section7Ref"
          :data-section-id="7"
          :class="[
            'section section-7',
            {
              active: page.activeSectionsByPage[page.page]
                ? page.activeSectionsByPage[page.page].includes(7)
                : false,
            },
          ]"
          :slot="sections[6].slotName"
          :id="`${sections[6].idtag}`"
        >
          <article>
            <h2>{{ $t("Kontakt") }}</h2>

            <figure>
              <figcaption>
                <div class="igpic" ref="image6UrlRef">
                  <div class="overlay">
                    <NuxtLink
                      :to="page.igLink"
                      target="_blank"
                    ></NuxtLink>
                    <p>{{ $t("Klikni da odes na Instagram profil") }}</p>
                  </div>
                </div>
                <div class="mappic" ref="image7UrlRef">
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
