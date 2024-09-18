<script lang="ts" setup>
const page = usePagesStore();
const i18n = useI18n();
const mapLinkParts = [
  "htt",
  "ps://",
  "maps.",
  "app.goo",
  ".gl/mqJz",
  "CEvyc4Z",
  "Yez5f9?g_",
  "st=ac",
];

const igLinkParts = [
  "htt",
  "ps://ww",
  "w.insta",
  "gram.co",
  "m/let",
  "sgo",
  "pe",
  "t.rs",
];
const mapLink = ref(`${mapLinkParts.join("")}`);
const igLink = ref(`${igLinkParts.join("")}`);
const isClient = ref(false);

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
    sectionName: i18n.t("Vip"),
    slotName: "section3",
    idtag: i18n.t("vip"),
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
  if (window.location.hash !== `#${sectionId}`) {
    history.pushState(
      {},
      "",
      `${window.location.pathname}#${encodeURIComponent(sectionId)}`
    );
    //^console.log(`URL updated to section: ${sectionId}`);
  }
}


const observers: IntersectionObserver[] = [];
const stopWatchers: (() => void)[] = [];

onMounted(async () => {
  page.changePage(1);
  const sectionNames = sections.map((section) => section.sectionName);
  const sectionIds = sections.map((section) => section.idtag);
  page.setSectionNames(sectionNames);
  page.setSectionIds(sectionIds);
  isClient.value = true;
  sections.forEach((section, index) => {
    const sectionElement = document.querySelector(
      `#${section.idtag}`
    ) as HTMLElement | null;
    if (sectionElement) {
      sectionRefs[index].value = sectionElement;
    }
  });

  const hash = window.location.hash.substring(1);
  const sectionIndex = sections.findIndex((section) => section.idtag === hash);
  if (hash && sectionRefs[sectionIndex].value) {
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
    sectionId: number
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
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            debouncedAddActiveSection(sectionId);
            debouncedSetActiveSection(sectionId);
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
        threshold: [0.85],
        rootMargin,
      });

      const observerUp = new IntersectionObserver(observerCallback, {
        threshold: [0.25],
        rootMargin,
      });

      observers.push(observerDown, observerUp);

      const observe = () => {
        if (sectionRef.value) {
          if (page.scrollDirection === "up") {
            observerUp.disconnect();
            observerDown.observe(sectionRef.value);
          } else if (page.scrollDirection === "down") {
            observerDown.disconnect();
            observerUp.observe(sectionRef.value);
          }
        }
      };

      observe();

      const stopWatch = watch(
        () => page.scrollDirection,
        (newDirection, oldDirection) => {
          observe();
        }
      );

      stopWatchers.push(stopWatch);
    }
  };

  watch(observeOnScroll, (newValue) => {
    if (newValue) {
      sections.forEach((section, index) => {
        observeSection(sectionRefs[index], section.id);
      });
      //^console.log("DESAVA SE");
    } else {
      //^console.log("NE DESAVA SE");
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
        // Specific actions for section 3
      } else if (currentSection === 1) {
        // Specific actions for section 1
      }
    },
    { deep: true }
  );
  stopWatchers.push(sectionWatcher);

  await new Promise((resolve) => setTimeout(resolve, 100)); // Kašnjenje od 100ms
});

onBeforeUnmount(() => {
  observers.forEach((observer) => observer.disconnect());
  stopWatchers.forEach((stopWatch) => stopWatch());
  //^console.log('All observers and watchers have been stopped.');
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
              <img src="/assets/img/dogs/4-short.webp" v-if="page.widthofHtml <= 600" alt="white-dog"/>
              <img src="/assets/img/dogs/4.webp" alt="white-dog" v-else/>
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
              <div class="pic-box"></div>
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
              <div class="pic-box"></div>
              <div class="box-text">
                <h2>{{ $t("Postani VIP") }}</h2>
                <h3>{{ $t("Uštedi 50% na sve usluge!") }}</h3>
                <ul class="ul-1">
                  <li>{{ $t("Vip1") }}</li>
                  <li>{{ $t("Vip2") }}</li>
                </ul>
                <p class="solo-1">{{ $t("Vip3") }}</p>
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
                    {{ $t("Postani VIP, javi se u DM") }}
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
                    <p>{{ $t("Jednostavan") }}</p>
                    <span>{{ $t("Za sve uzraste") }}</span>
                  </div>
                  <ul>
                    <li>{{ $t("Transport") }}</li>
                    <li>{{ $t("Šišanje") }}</li>
                    <li>{{ $t("Kupanje") }}</li>
                    <li>{{ $t("Sušenje") }}</li>
                  </ul>

                  <div class="prices">
                    <div class="discount-img">
                      <IconsDefaultPaw2 />
                      <p>85 €</p>
                    </div>
                    <div class="discount-img2">
                      <IconsDefaultCrown />
                      <p>43 €</p>
                    </div>
                  </div>
                </div>
                <div class="box-2 style">
                  <div class="box-header">
                    <p>{{ $t("Osnovni") }}</p>
                    <span>{{ $t("Za štence do 6 meseci") }}</span>
                  </div>
                  <ul>
                    <li>{{ $t("Transport") }}</li>
                    <li>{{ $t("Kupanje i sušenje") }}</li>
                    <li>{{ $t("Skraćivanje noktića") }}</li>
                    <li>
                      {{ $t("Higijena ušiju Light Trimming") }}
                    </li>
                    <li>{{ $t("Oblikovanje dlake") }}</li>
                  </ul>

                  <div class="prices">
                    <div class="discount-img">
                      <IconsDefaultPaw2 />
                      <p>100 €</p>
                    </div>
                    <div class="discount-img2">
                      <IconsDefaultCrown />
                      <p>50 €</p>
                    </div>
                  </div>
                </div>
                <div class="box-3 style">
                  <div class="box-header">
                    <p>{{ $t("Paket") }}</p>
                    <span>{{ $t("Za pse do 10kg") }}</span>
                  </div>
                  <ul>
                    <li>{{ $t("Transport") }}</li>
                    <li>{{ $t("Kupanje i sušenje") }}</li>
                    <li>{{ $t("Šišanje") }}</li>
                    <li>{{ $t("Skraćivanje noktića") }}</li>
                    <li>{{ $t("Higijena ušiju") }}</li>
                    <li>{{ $t("Pranje zubića") }}</li>
                  </ul>

                  <div class="prices">
                    <div class="discount-img">
                      <IconsDefaultPaw2 />
                      <p>100 €</p>
                    </div>
                    <div class="discount-img2">
                      <IconsDefaultCrown />
                      <p>50 €</p>
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

                  <div class="prices">
                    <div class="discount-img">
                      <IconsDefaultPaw2 />
                      <p>25 €</p>
                    </div>
                    <div class="discount-img2">
                      <IconsDefaultCrown />
                      <p>13 €</p>
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
              <div class="pic-box"></div>
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
              <div class="pic-box"></div>

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
                <div class="igpic">
                  <div class="overlay">
                    <NuxtLink
                      v-if="isClient"
                      :to="igLink"
                      
                      target="_blank"
                    ></NuxtLink>
                    <p>{{ $t("Klikni da odes na Instagram profil") }}</p>
                  </div>
                </div>
                <div class="mappic">
                  <div class="overlay">
                    <NuxtLink
                      :to="mapLink"
                      v-if="isClient"
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
