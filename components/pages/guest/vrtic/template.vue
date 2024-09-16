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
    slotName: "section7",
    idtag: i18n.t("vrtic"),
  },
  {
    id: 2,
    sectionName: i18n.t("Usluge vrtica"),
    slotName: "section8",
    idtag: i18n.t("usluge-vrtica"),
  },
  {
    id: 3,
    sectionName: i18n.t("Vip"),
    slotName: "section9",
    idtag: i18n.t("vip"),
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
            <h2>{{ $t("Let's Go Pet") }}</h2>
            <figure>
              <h3>{{ $t("Od vas, do nas, vaš ljubimac!") }}</h3>
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
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.sections {
  max-width: 2160px;
  gap: 0px;
  @include sections(
    /* Width */ 100%,
    /* Padding */ 0px,
    /* Margin */ 0px 0px 0px 0px
    );
    @include flex-full(flex-start, flex-start, column);
}
section {
  color: clr(font);
  padding: 0px calc((10px + 4vw) - 20px) 0px calc((10px + 4vw) - 20px);
  @include allSections();
}
$section-1-height: 700px;
$section-1-height-sm: 900px;
$section-1-height-smm: 800px;
$section-1-height-img: 800px;
$section-1-height-boxs: 500px;
.section-1 {
  position: relative;
  //width: calc(80% + 5vw);
  //width: 1024px;
  height: 100%;
  min-height: 700px;
  //padding: 180px 10px 50px 10px;
  margin-inline: auto;
  padding: 0 0px 0px 0px 0px;
  gap: 20px;
  @include flex-full(space-between, center, row);
  @include px(1024) {
    padding: 0px 10px;
    min-height: 850px;
    @include flex-full(flex-start, center, column);
  }
  @include px(600) {
    min-height: 100%;
    @include flex-full(center, center, column-reverse);
  }
  .box-shadow-header {
    position: absolute;
    z-index: 3;
    top: 0;
    left: 50%;
    transform: translate(-50%, 0%);
    width: 100%;
    box-shadow: 0px 0px 200px 150px rgba($color: #ffffff, $alpha: 1);
    transition: box-shadow ease 0.3s;
    transition-delay: 0.1s;
    @include px(1024) {
      box-shadow: 0px 0px 0px 0px rgba($color: #ffffff, $alpha: 1);
    }
    @include px(600) {
      box-shadow: 0px 0px 80px 105px rgba($color: #ffffff, $alpha: 1);
    }
    &.scrolled {
      box-shadow: 0px 0px 0px 0px rgba($color: #ffffff, $alpha: 1);
    }
  }
  .organic {
    position: absolute;
    z-index: 2;
    bottom: 40px;
    right: 40px;
    width: 100px;
    height: 100px;
    fill: white;
  }
  article {
    position: relative;
    z-index: 3;
    text-align: left;
    width: calc(47% + 400px);
    height: 100%;
    margin-inline: auto;
    @include flex-full(center, flex-start, column);
    @include px(1024) {
      width: 100%;
      text-align: center;
      padding: $nav-height + $upnav-height + 50px 0 0 0;
      @include flex-full(flex-start, center, column);
    }
    @include px(600) {
      padding-top: 50px;
    }
    @include px(420) {
      padding-top: 10px;
    }
    h2 {
      width: 100%;
      font-size: clamp(80%, 150% + 3.1vw, 700%);
      font-weight: 600;
      color: clr(font-primary);
      font-family: "Passion One", sans-serif;
      text-shadow: 3px 3px 4px #68482146;
    }
    figure {
      h3 {
        width: 100%;
        font-size: clamp(70%, 70% + 2.1vw, 250%);
        font-weight: 500;
        background: linear-gradient(215deg, #6ca14f, #4ac1dc);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        background-size: 150% 150%;
        text-shadow: 2px 2px 3px #7ce5ad5c;
      }
      figcaption {
        p {
          width: 100%;
          font-size: clamp(60%, 40% + 2.1vw, 160%);
          color: clr(font-primary-light);
          text-shadow: 2px 2px 3px #68482123;
        }
      }
    }
    .link-box {
      @include social-btn();
    }
  }

  .boxshadow {
    position: absolute;
    z-index: 2;
    top: unset;
    left: 0;
    box-shadow: 0px 0px 500px 600px rgba($color: #fff, $alpha: 1);
    @include px(1024) {
      top: 0;
      left: unset;
      box-shadow: 0px -1200px 500px 1200px rgba($color: #fff, $alpha: 1);
      height: $section-1-height-boxs;
    }
    @include px(600) {
      display: none;
    }
  }


  $img-height: 500px;
  aside {
    position: absolute;
    z-index: 1;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    transition: all ease 0.1s;
    @include flex-full(flex-start, flex-start, row);
    @include px(600) {
      //height: $section-1-height-smm;
      position: relative;
      z-index: 2;
      top: unset;
      left: unset;
      transform: translate(0%, 0%);
      width: 600px;
      height: 509px;
      min-width: 700px;
      border-bottom-right-radius: 50%;
      border-bottom-left-radius: 50%;
      overflow: hidden;
      margin-top: -$nav-height - $upnav-height - 50px;
    }
    .img-dog {
      width: 100%;
      top: 0;
      right: 0;
      width: 100%;
      height: 100%;
      max-height: 100%;
      background-attachment: fixed;
      background-position: right 0;
      background-repeat: no-repeat;
      background-size: auto 80%;
      background-position: right 0px;
      background-image: url("/assets/img/dogs/4-ps.jpg");

      @include px(1450) {
        background-image: url("/assets/img/dogs/4-ps.jpg");
        background-position: 82% 0;
        background-size: auto 100%;
        background-attachment: unset;
      }
      @include px(1024) {
        background-image: url("/assets/img/dogs/4-wite.jpg");
        background-size: auto;
        background-position: calc(-1450px + 15vw * 5) 200px;
        background-attachment: unset;
        max-height: 850px;
      }

      @include px(600) {
        background-image: url("/assets/img/dogs/4-short.png");
        background-size: auto;
        background-position: 50px 100px;
        background-attachment: unset;
      }
      @include px(360) {
        background-image: url("/assets/img/dogs/4-short.png");
        background-size: auto;
        background-position: 35px 100px;
        background-attachment: unset;
      }
    }
  }
}
.section-2 {
  position: relative;
  z-index: 2;
  width: calc(70% + 150px);
  margin-inline: auto;
  padding: 200px 0px 100px 0px;
  @include px(1024) {
    width: 98%;
    padding: 150px 10px 150px 40px;
  }
  @include px(600) {
    width: 98%;
    padding: 100px 10px 50px 10px;
  }
  article {
    h2 {
      font-size: clamp(90%, 110% + 1.5vw, 300%);
      margin-bottom: 30px;
      font-family: "Passion One", sans-serif;
      @include px(600) {
        text-align: center;
      }
    }

    .box-pic {
      position: relative;
      width: 100%;
      gap: 15px;
      @include flex-full(space-between, center, row);
      @include px(600) {
        @include flex-full(space-between, center, column-reverse);
      }
      .box-text {
        width: 65%;
        @include px(600) {
          width: 85%;
        }
        p {
          width: 100%;
          font-size: clamp(90%, 50% + 1.1vw, 130%);
        }
      }
      .pic-box {
        width: calc(100px + 15vw);
        height: calc(100px + 15vw);
        min-height: 200px;
        min-width: 200px;
        max-width: 400px;
        max-height: 400px;
        border-radius: 50%;
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        background-image: url("/assets/img/dogs/1.jpg");
      }
    }

    aside {
      .link-box {
        @include flex-full(flex-start, center, row);
        @include social-btn();
      }
    }
  }
}
.section-3 {
  position: relative;
  z-index: 2;
  width: calc(70% + 150px);
  margin-inline: auto;
  padding: 50px 0px;
  @include px(1450) {
    width: 98%;
    padding: 50px 10px 100px 40px;
  }
  @include px(1024) {
    width: 98%;
    padding: 50px 10px 50px 10px;
  }
  article {
    .box-pic {
      position: relative;
      width: 100%;
      @include flex-full(space-between, center, row);
      @include px(1450) {
        @include flex-full(space-between, center, column);
      }
      .box-text {
        width: 70%;
        @include px(1450) {
          width: 85%;
        }
        p {
          width: 100%;
          font-size: clamp(90%, 50% + 1.1vw, 140%);
        }

        h2 {
          font-size: clamp(90%, 110% + 1.5vw, 300%);
          margin-bottom: 0px;
          font-family: "Passion One", sans-serif;
          @include px(600) {
            text-align: center;
          }
        }
        h3 {
          font-size: clamp(90%, 90% + 1.5vw, 200%);
          margin-bottom: 0px;
          font-family: "Passion One", sans-serif;
          background: linear-gradient(215deg, #6ca14f, #4ac1dc);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          background-size: 150% 150%;
          text-shadow: 2px 2px 3px #7ce5ad5c;
          @include px(600) {
            text-align: center;
          }
        }
        li {
          font-size: clamp(90%, 50% + 1.5vw, 110%);
        }
        .ul-1 {
          margin-top: 20px;
          margin-left: 20px;
        }
        .solo-1 {
          margin-top: 20px;
        }
        .ul-2 {
          margin-top: 10px;
          margin-left: 20px;
        }
        .solo-2 {
          margin-top: 20px;
          font-size: clamp(90%, 50% + 1.5vw, 110%);
        }
      }
      .pic-box {
        width: calc(100px + 15vw);
        height: calc(100px + 15vw);
        min-height: 200px;
        min-width: 200px;
        max-width: 300px;
        max-height: 300px;
        background-position: center;
        background-size: contain;
        background-repeat: no-repeat;
        margin-right: 40px;
        background-image: url("/assets/img/vip.png");
      }
    }

    aside {
      margin-top: 20px;
      width: 70%;
      float: right;
      @include px(1024) {
        width: 100%;
      }
      .link-box {
        @include flex-full(flex-start, center, row);
        @include social-btn();
      }
    }
  }
}
</style>
