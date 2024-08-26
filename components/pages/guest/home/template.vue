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
              <div class="link-btn">
                <LinksTosocialIg />
                <p>{{ $t("Zakazivanje isključivo preko DM poruke") }}</p>
              </div>
              <div class="touch-container">
                <IconsDefaultTouch class="touch" />
              </div>
            </div>
            <p class="press-here">{{ $t("Klikni ovde") }}</p>
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
            <h2>{{ $t("Usluge") }}</h2>
            <p>
              {{ $t("Usluge tekst") }}
            </p>
          </article>
          <aside>
            <p>{{ $t("Zakazite uvek") }}</p>
          </aside>
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
            <h2>{{ $t("Postani VIP član") }}</h2>

            <figure>
              <figcaption>
                <p>{{ $t("Vip tekst") }}</p> 
              </figcaption>
            </figure>
            

            <aside>
              <!-- <p>
                {{ $t("Zakazite") }}
              </p> -->
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
                    <p>Jednostavan paket</p>

                    <div class="discount-img">
                      <img src="/assets/img/paw.png" />
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
                      <img src="/assets/img/paw.png" />
                      <p>100 €</p>
                    </div>
                  </div>
                  <span>Za štence do 6 meseci Bath & Dry - kupanje i sušenje</span>
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
                      <img src="/assets/img/paw.png" />
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
                      <img src="/assets/img/paw.png" />
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
            <h2>{{ $t("Pet transport") }}</h2>
            <p></p>
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
            <h2>{{ $t("O nama") }}</h2>
            <p>
              {{ $t("O nama tekst") }}
            </p>
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
  gap: 0px;
  @include flex-full(flex-start, flex-start, column);
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
$section-1-height-sm: 900px;
$section-1-height-smm: 700px;
$section-1-height-img: 800px;
$section-1-height-boxs: 500px;
.section-1 {
  position: relative;
  width: 100%;
  height: $section-1-height;
  overflow: hidden;
  @include flex-full(center, center, column);
  @include px(1024) {
    height: $section-1-height-sm;
    @include flex-full(flex-start, center, column);
  }
  @include px(600) {
    height: $section-1-height-smm;
  }
  article {
    position: relative;
    z-index: 2;
    width: 75%;
    height: 100%;
    text-align: left;
    @include flex-full(center, flex-start, column);
    @include px(1024) {
      width: 90%;
      text-align: center;
      padding-top: 50px;
      @include flex-full(flex-start, center, column);
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
        color: clr(font-primary-green);
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
      position: relative;
      margin-top: 20px;
      margin-left: 15px;
      color: clr(font-primary-light);
      @include flex-center();
      @include px(1024) {
        flex-direction: column-reverse;
        justify-content: center;
        align-items: center;
        margin-top: 15px;
        margin-left: 0;
        margin-inline: auto;
        gap: 3px;
      }
      .link-btn {
        gap: 15px;
        @include flex-center();
        a {
          padding: 5px 15px;
          background: clr(primary-green);
          font-size: clamp(70%, 50% + 1.1vw, 110%);
          border-radius: 33px;
          color: white;
          margin-left: 10px;
          p {
            color: white;
            font-size: clamp(70%, 50% + 1.1vw, 110%);
          }
        }
        p {
          color: clr(font-primary);
        }
      }
    }
    .press-here {
      margin-left: 79px;
      font-size: 70%;
      color: clr(primary-green);
    }


    /*$touch-top: 20px;
    $touch-margin-top: 20px;
    $touch-right: 25px;
    $right0ffset: 10px;
    $touch-width: 150px;
    $touch-height: 150px;
    $touch-min-width: 90px;
    $touch-min-height: 90px;
    $touch-zindex: 16;
    $touch-fill: $primary;
    $moveright: 70%;
    $moveup: -80%;
    $touch-transform: translate($moveright, $moveup) rotate(0deg);
    $touch-animation: touch 2s infinite;*/
    @mixin touchStay() {
      $moveright: 80%;
      $moveup: -50%;
      $right0ffset: 70px;
      $touch-transform: translate($moveright, $moveup) rotate(0deg);
      $touch-animation: touch2 2s infinite;

      right: 45px;
      width: 60px;
      height: 60px;
      min-width: 30px;
      min-height: 30px;
      transform: $touch-transform;
      animation: $touch-animation;

      @keyframes touch2 {
        0% {
          top: 0px;
          right: $right0ffset + 35px;
          margin-top: 30px;
          transform: translate($moveright, $moveup) scale(0.9) rotate(-20deg);
        }

        50% {
          top: 0px;
          right: $right0ffset + 15px;
          transform: translate($moveright, $moveup) scale(1.07) rotate(0deg);
          margin-top: 20px;
        }

        80% {
          top: 25px;
          right: $right0ffset + 30px;
          transform: translate($moveright, $moveup) scale(1.25) rotate(0deg);
          margin-top: 15px;
        }

        100% {
          top: 0px;
          right: $right0ffset + 35px;
          transform: translate($moveright, $moveup) scale(0.9) rotate(-20deg);
          margin-top: 30px;
        }
      }
    }
    .touch-container {
      position: absolute;
      bottom: 50%;
      left: 0%;
      transform: translate(-160%, 100%);
    }
    .touch {
      fill: clr(primary);
      @include touchStay();
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
      height: $section-1-height-boxs;
    }
    @include px(600) {
      height: $section-1-height-boxs + 100;
      box-shadow: 0px -1400px 400px 1100px rgba($color: #fff, $alpha: 1);
    }
  }
  $img-height: 500px;
  aside {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: $section-1-height-sm;
    transition: all ease 0.1s;
    @include flex-full(flex-end, flex-end, row);
    @include px(1024) {
      height: $section-1-height-sm;
    }
    @include px(600) {
      height: $section-1-height-smm;
    }
    .img-dog {
      width: 100%;
      height: 100%;
      top: 0;
      right: 0;
      width: 100%;
      height: 100%;
      max-width: 1920px;
      max-height: 1024px;
      background-attachment: fixed;
      background-position: calc(-2700px + 12.5vw * 7) 0px;
      background-repeat: no-repeat;
      background-size: auto $section-1-height-img + 0px;
      background-image: url("/assets/img/dogs/4-ps.jpg");
      @include px(1024) {
        background-image: url("/assets/img/dogs/4-ps.jpg");
        background-size: auto $section-1-height-img + 200px;
        background-position: calc(-0px + 12.5vw * 7) 0px;
      }
      @include px(600) {
        background-image: url("/assets/img/dogs/4-ps.jpg");
        background-size: auto $section-1-height-img + 100px;
        background-position: calc(-3000px + 12.5vw * 7) 0px;
      }
      @include px(360) {
        background-image: url("/assets/img/dogs/4-ps.jpg");
        background-size: auto $section-1-height-img + 0px;
        background-position: calc(-0px + 12.5vw * 7) 0px;
      }
    }
  }
}
.section-2 {
  width: calc(70% + 150px);
  margin-inline: auto;
  padding: 100px 0px;
  @include px(1024) {
    width: 98%;
    padding: 100px 10px;
  }
  article {
    h2 {
      font-size: clamp(90%, 110% + 1.5vw, 300%);
    }
    p {
      font-size: clamp(90%, 50% + 1.1vw, 140%);
    }
  }
}
.section-3 {
  position: relative;
  width: calc(70% + 150px);
  margin-inline: auto;
  padding: 100px 0px;
  article {
    position: relative;
    width: 100%;
    h2 {
      text-align: center;
      font-size: clamp(90%, 110% + 1.5vw, 300%);
      margin-bottom: 20px;
    }
    p {
      font-size: clamp(90%, 50% + 1.1vw, 140%);
    }
  }
}
.section-4 {
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
          box-shadow: 0px 0px 20px 0px rgba($color: #646464, $alpha: 0.2);
          .box-header {
            position: relative;
            padding: 12px 10px;
            border-bottom: 1px solid #c1725546;
            //background: clr(font-primary-light);
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
                transform: translate(-50%, -50%) rotate(-10deg);
                width: calc(60px + 2.5vw);
                height: calc(60px + 2.5vw);
                min-width: 80px;
                min-height: 80px;
                transition: all ease 0.3s;
              }
              p {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-40%, 0%) rotate(10deg);
                color: white;
                white-space: nowrap;
                font-size: clamp(100%, 40% + 1.2vw, 150%);
                font-family: "Lilita One", sans-serif;
              }
            }
          }
          span {
            font-family: "Passion One", sans-serif;
            padding: 5px 20px;
            font-weight: 500;
            color: clr(font-primary-light);
            font-size: clamp(100%, 30% + 1.1vw, 120%);
            @include flex-center();
          }
          ul {
            padding: 20px;
            list-style-type: none;
            li {
              font-size: clamp(80%, 30% + 1.1vw, 120%);
            }
          }
        }
        /*.box1 {
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
        }*/
      }
    }
  }
}
.section-5 {
  padding: 100px 100px;
}
.section-6 {
  padding: 100px 100px;
}
.section-7 {
  padding: 100px 100px;
}
.section-8 {
  padding: 100px 100px;
}
</style>
