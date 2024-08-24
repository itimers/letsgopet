<script lang="ts" setup>
const page = usePagesStore();
const i18n = useI18n();

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
    sectionName: i18n.t("Cenovnik"),
    slotName: "section3",
    idtag: i18n.t("cenovnik"),
  },
  {
    id: 4,
    sectionName: i18n.t("Pet transport"),
    slotName: "section4",
    idtag: i18n.t("pet-transport"),
  },
  {
    id: 5,
    sectionName: i18n.t("O nama"),
    slotName: "section5",
    idtag: i18n.t("o-nama"),
  },
  {
    id: 6,
    sectionName: i18n.t("Kontakt"),
    slotName: "section6",
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

function removeHashFromUrl() {
  history.replaceState(
    history.state,
    "",
    window.location.pathname + window.location.search
  );
}

const observers: IntersectionObserver[] = [];
const stopWatchers: (() => void)[] = [];

onMounted(async () => {
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
          <article>
            <h2>{{ $t("Let's Go Pet") }}</h2>
            <figure>
              <h3>{{ $t("Od vas, do nas, vaš ljubimac!") }}</h3>
              <figcaption>
                <p>{{ $t("Gde god da se nalazite, mi dolazimo do vas.") }}</p>
                <p>{{ $t("Transport i održavanje vašeg psa!") }}</p>
              </figcaption>
            </figure>
            <div class="link-box">
              <LinksClassicContact />
              <p>{{ $t("Pozovite nas, vaš ljubimac je naša briga") }}</p>
            </div>
          </article>
          <div class="boxshadow"></div>
          <aside :class="{ scroll: page.isScrolled }">
            <div class="img-dog"></div>
            <!-- <img src="/assets/img/dogs/4-ps.jpg" /> -->
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
            <h2>Usluge</h2>
            <p>
              {{ $t("Usluge tekst") }}
            </p>
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

            <figure>
              <figcaption>
                <div class="box-1 style">
                  <div class="box-header">
                    <p>Jednostavan paket</p>

                    <div class="discount-img">
                      <img src="/assets/img/2.png" />
                      <p>85 €</p>
                    </div>
                  </div>
                  <span>Za sve uzraste</span>
                  <ul>
                    <li>Samo kupanje i sušenje</li>
                  </ul>
                </div>
                <div class="box-2 style">
                  <div class="box-header">
                    <p>Osnovni higijenski paket</p>
                    <div class="discount-img">
                      <img src="/assets/img/2.png" />
                      <p>100 €</p>
                    </div>
                  </div>
                  <span
                    >Za štence do 6 meseci Bath & Dry - kupanje i sušenje</span
                  >
                  <ul>
                    <li>Nail Trim - skraćivanje noktića</li>
                    <li>Ear Cleaning - Higijena ušiju Light Trimming</li>
                    <li>Oblikovanje dlake</li>
                  </ul>
                </div>
                <div class="box-3 style">
                  <div class="box-header">
                    <p>Paket za male pse do 10 kg</p>
                    <div class="discount-img">
                      <img src="/assets/img/2.png" />
                      <p>100 €</p>
                    </div>
                  </div>
                  <ul>
                    <li>Bath & Dry - Kupanje i sušenje</li>
                    <li>Full Body Haircut - šišanje</li>
                    <li>Nail Trim - skraćivanje noktića</li>
                    <li>Ear Cleaning - higijena ušiju</li>
                    <li>Teeth Brushing - pranje zubića</li>
                  </ul>
                </div>
                <div class="box-4 style">
                  <div class="box-header">
                    <p>Specijalni tretmani</p>
                    <div class="discount-img">
                      <img src="/assets/img/2.png" />
                      <p>25 €</p>
                    </div>
                  </div>
                  <ul>
                    <li>
                      Spa medical treatment: seboreja, suva koža, masna koža,
                      perut
                    </li>
                  </ul>
                </div>
              </figcaption>
            </figure>
            <p>
              {{ $t("Napomena") }}
            </p>

            <aside>
              <p>
                {{ $t("Zakazite") }}
              </p>
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
            <h2>{{ $t("Pet transport") }}</h2>
            <p></p>
          </article>
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
            <h2>{{ $t("O nama") }}</h2>
            <p>
              {{ $t("O nama tekst") }}
            </p>
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
            <h2>Kontakt</h2>
            <p></p>
          </article>
        </section>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.sections {
  max-width: 2160px;
  @include flex-full(flex-start, flex-start, column);
  gap: 0px;
  @include sections(
    /* Width */ 100%,
    /* Padding */ 0px,
    /* Margin */ 0px 0px 0px 0px
  );
  /*@include sections(
    /~ Width ~/ 100%,
    /~ Padding ~/ 0px calc((10px + 4vw) - 20px) 0px calc((10px + 4vw) - 20px),
    /~ Margin ~/ 0px 0px 0px 0px
  );*/
  @include px(1024) {
    /*width: 95%;*/
  }
}
section {
  @include allSections();
  color: clr(font);
  padding: 0px calc((10px + 4vw) - 20px) 0px calc((10px + 4vw) - 20px);
}
$section-1-height: 700px;
$section-1-height-sm: 500px;
$section-1-height-smm: 300px;
.section-1 {
  position: relative;
  width: 100%;
  min-height: $section-1-height;
  overflow: hidden;
  @include flex-full(center, center, column);
  @include px(1024) {
    min-height: $section-1-height-sm;
    @include flex-full(flex-start, center, column);
    padding-top: 50px;
  }
  @include px(600) {
    min-height: $section-1-height-smm + 60px;
  }
  article {
    position: relative;
    z-index: 2;
    width: 75%;
    @include flex-full(flex-start, flex-start, column);
    text-align: left;
    @include px(1024) {
      width: 90%;
      text-align: center;
      justify-content: center;
      align-items: center;
    }
    h2 {
      width: 100%;
      font-size: clamp(80%, 150% + 3.1vw, 700%);
      font-weight: 600;
      color: clr(font-primary);
      font-family: "Concert One", sans-serif;
      font-family: "Lilita One", sans-serif;
      font-family: "Passion One", sans-serif;
    }
    figure {
      h3 {
        width: 100%;
        font-size: clamp(70%, 70% + 2.1vw, 250%);
        font-weight: 500;
        color: clr(font-primary-light);
      }
      figcaption {
        p {
          width: 100%;
          font-size: clamp(60%, 40% + 2.1vw, 160%);
          color: clr(font-primary-light);
        }
      }
    }
    .link-box {
      @include px(1024) {
        flex-direction: column-reverse;
        justify-content: center;
        align-items: center;
        margin-top: 15px;
        margin-left: 0;
        margin-inline: auto;
        gap: 3px;
      }
      @include flex-center();
      margin-top: 20px;
      margin-left: 15px;
      gap: 20px;
      color: clr(font-primary-light);
      a {
        padding: 5px 15px;
        background: clr(primary);
        font-size: clamp(70%, 50% + 1.1vw, 110%);
        border-radius: 33px;
        color: white;
        margin-left: 10px;
      }
      p {
        font-size: clamp(70%, 50% + 1.1vw, 110%);
      }
    }
  }
  .boxshadow {
    position: absolute;
    z-index: 1;
    top: unset;
    left: 0;
    box-shadow: 0px 0px 500px 600px rgba($color: #fff, $alpha: 1);
    @include px(1024) {
      top: 0;
      left: unset;
      box-shadow: 0px -1400px 500px 1200px rgba($color: #fff, $alpha: 1);
      height: $section-1-height-sm;
    }
  }
  $img-height: 500px;
  aside {
    transition: all ease 0.1s;
    @include px(1024) {
      max-height: $section-1-height-sm;
    }
    .img-dog {
      position: absolute;
      width: 100%;
      height: 100%;
      right: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-attachment: fixed;
      background-position: calc(-2700px + 12.5vw * 7) 0px;
      background-repeat: no-repeat;
      background-size: cover;
      background-image: url("/assets/img/dogs/4-ps.jpg");
      @include px(1024) {
        max-height: $section-1-height-sm;
        background-image: url("/assets/img/dogs/4-ps-sh.jpg");
        background-size: auto $section-1-height-sm + 200px;
        background-position: calc(-1850px + 12.5vw * 7) 0px;
      }
      @include px(600) {
        max-height: $section-1-height-sm;
        background-image: url("/assets/img/dogs/4-ps-sh.jpg");
        background-size: auto $section-1-height-sm + 0px;
        background-position: calc(-1250px + 12.5vw * 7) 0px;
      }
      @include px(360) {
        max-height: $section-1-height-sm;
        background-image: url("/assets/img/dogs/4-ps-sh.jpg");
        background-size: auto $section-1-height-sm + 0px;
        background-position: calc(-1250px + 12.5vw * 7) 0px;
      }
    }
  }
}
.section-2 {
  padding: 100px 100px;
}
.section-3 {
  padding: 100px 100px;

  article {
    h2 {
      text-align: center;
    }
    figure {
      margin-top: 80px;
      figcaption {
        display: grid;
        grid-template-columns: 0.25fr 0.25fr;
        justify-content: center;
        gap: 50px;
        @include px(600) {
          grid-template-columns: 1fr;
        }
        .style {
          min-width: calc(200px + 4.5vw);
          border-radius: 9px;
          box-shadow: 0px 0px 20px 0px rgba($color: #000000, $alpha: 0.2);
          .box-header {
            position: relative;
            padding: 8px 10px;
            border-bottom: 1px solid #c1725546;
            background: clr(font-primary-light);
            border-top-left-radius: 9px;
            border-top-right-radius: 9px;
            p {
              font-family: "Concert One", sans-serif;
              font-family: "Lilita One", sans-serif;
              font-family: "Passion One", sans-serif;
              font-weight: 500;
              text-align: center;
              color: clr(font);
              font-size: clamp(120%, 40% + 1.5vw, 160%);
            }

            .discount-img {
              position: absolute;
              top: -35px;
              right: -35px;
              width: calc(50px + 2.5vw);
              height: calc(50px + 2.5vw);
              min-width: 70px;
              min-height: 70px;
              transition: all ease 0.3s;
              img {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: calc(50px + 2.5vw);
                height: calc(50px + 2.5vw);
                min-width: 70px;
                min-height: 70px;
                transition: all ease 0.3s;
              }
              p {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) rotate(10deg);
                color: white;
                white-space: nowrap;
                font-family: "Lilita One", sans-serif;
              }
            }
          }
          span {
            font-family: "Passion One", sans-serif;
            @include flex-center();
            padding: 5px 20px;
            font-weight: 500;
            color: clr(font-primary-light);
            font-size: clamp(100%, 30% + 1.1vw, 120%);
          }
          ul {
            padding: 20px;
            list-style-type: none;
            li {
              font-size: clamp(80%, 30% + 1.1vw, 120%);
            }
          }
        }
        .box1 {
          .box-1 {
          }
          .box-2 {
          }
        }
        .box2 {
          .box-3 {
          }
          .box-4 {
          }
        }
      }
    }
  }
}
.section-4 {
  padding: 100px 100px;
}
.section-5 {
  padding: 100px 100px;
}
.section-6 {
  padding: 100px 100px;
}
</style>
