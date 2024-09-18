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
  "m/kupa",
  "nje",
  "pa",
  "sa",
];
const mapLink = ref(`${mapLinkParts.join("")}`);
const igLink = ref(`${igLinkParts.join("")}`);
const isClient = ref(false);

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
    sectionName: i18n.t("Kontakt"),
    slotName: "section5",
    idtag: i18n.t("kontakt"),
  }
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
  page.changePage(2);
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
            <div class="img-dog"></div>
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
              <div class="pic-box vrtic"></div>
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
            <div class="box-pic">
              <div class="pic-box"></div>
              <div class="box-text">
                <h2>{{ $t("Nisi VIP") }}</h2>
                <h3>{{ $t("Nudimo 50% na sve usluge!") }}</h3>
                <ul class="ul-1">
                  <li>{{ $t("Vip12") }}</li>
                </ul>
                <p class="solo-1">{{ $t("Kako to") }}</p>
                <p class="solo-1 two">{{ $t("Vip3") }}</p>
              </div>
            </div>

            <aside>
              <div class="link-box vrtic">
                <div class="link-btn">
                  <LinksTosocialVip class="link-to"/>
                  <p class="book">
                    {{ $t("Pročitaj više kako postati VIP") }}
                  </p>
                </div>
              </div>
            </aside>
          </article>
          
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

                  <div class="prices">
                    <div class="discount-img">
                      <IconsDefaultPaw2 />
                      <p>300 €</p>
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
                    <li class="vrtic">{{ $t("Preuzimamo i vracamo ljubimca") }}</li>
                    <li>{{ $t("Transport svakog dana") }}</li>
                    
                    <li>{{ $t("Dogovoreni transport") }}</li>
                  </ul>

                  <div class="prices">
                    <div class="discount-img">
                      <IconsDefaultPaw2 />
                      <p>45 €</p>
                    </div>
                    <!-- <div class="discount-img2">
                      <IconsDefaultCrown />
                      <p>50 €</p>
                    </div> -->
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
          ref="section5Ref"
          :data-section-id="5"
          :class="[
            'section section-5 section-vrtic',
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
            <h2>{{ $t("Kontakt") }}</h2>

            <figure>
              <figcaption>
                <div class="igpic">
                  <div class="overlay">
                    <NuxtLink
                      :to="mapLink"
                      v-if="isClient"
                      target="_blank"
                    ></NuxtLink>
                    <p>{{ $t("Klikni da odes na Instagram profil") }}</p>
                  </div>
                </div>
                <div class="mappic">
                  <div class="overlay">
                    <NuxtLink
                      :to="igLink"
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