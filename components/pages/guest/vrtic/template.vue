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
            <h2>{{ $t("Vrtic za pse") }}</h2>
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

<style lang="scss">



$section-1-height: 700px;
$section-1-height-sm: 900px;
$section-1-height-smm: 800px;
$section-1-height-img: 800px;
$section-1-height-boxs: 500px;


.section-1 {
  position: relative;
  &.vrtic {
    width: calc(50% + 350px);
    height: 100%;
    margin-inline: auto;
    padding: 250px 0px 100px 0px;
    gap: 20px;

    @include px(1024) {
      width: 100%;
      padding: 0px 10px;
      min-height: auto;
      @include flex-full(flex-start, center, column);
    }
    @include px(600) {
      min-height: auto;
      @include flex-full(flex-start, center, column-reverse);
    }
  }
  
  article {
    &.vrtic {
      width: 100%;
      height: 100%;
      @include px(1024) {
        padding: $nav-height + $upnav-height + 50px 0 10px 0;
        @include flex-full(flex-start, center, column);
      }
      @include px(600) {
        padding: 10px 0 10px 0;
      }
      @include px(420) {
        padding: 10px 0 10px 0;
      }
    }
  }

  


  aside {
    &.house {
      position: relative;
      z-index: 1;
      top: 0;
      transition: all ease 0.1s;
      @include flex-full(flex-end, center, row);
      @include px(600) {
        //height: $section-1-height-smm;
        position: relative;
        z-index: 2;
        top: unset;
        left: unset;
        transform: translate(0%, 0%);
        overflow: hidden;
        padding: $nav-height + $upnav-height + 50px 0 10px 0;
      }
      .img-dog {
        top: 0;
        right: 0;
        width: calc(80px + 20vw);
        height: calc(80px + 20vw);
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: right 0px;
        background-image: url("/assets/img/dogs/house.png");
      }
    }
  }
}
.section-2 {
  position: relative;
  z-index: 2;
  padding: 200px 0px 100px 0px;
  @include px(1024) {
    width: 98%;
    padding: 150px 10px 150px 40px;
  }
  @include px(600) {
    width: 98%;
    padding: 100px 10px 50px 10px;
  }

  &.vrtic {
    width: calc(80% + 150px);
    margin: 0;
    margin-inline: auto 0;
    @include px(600) {
      width: 100%;
    }
  }
  article {

    .box-pic {
      @include flex-full(space-between, center, row);
      @include px(600) {
        @include flex-full(space-between, center, column-reverse);
      }
      .box-text {
        width: 65%;
        @include px(600) {
          width: 85%;
        }
        &.vrtic {
          :nth-child(2) {
            margin-bottom: 20px;
          }
        }
      }
      .pic-box {
        
        &.vrtic {
          margin-top: -50px;
          margin-right: -50px;
          width: calc(150px + 25vw);
          height: calc(150px + 25vw);
          min-height: 200px;
          min-width: 200px;
          max-width: 500px;
          max-height: 500px;
          border-radius: 50%;
          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;
          background-image: url("/assets/img/dogs/welove2.png");
          @include px(600) {
            margin-top: 0;
            margin-right: 0;
          }
          
        }
      }
    }

    aside {
      .link-box {
        &.vrtic {
          margin-top: 50px;
        }
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

        
        
        li {
          font-size: clamp(90%, 50% + 1.5vw, 110%);
          list-style-type: none;
        }
        .ul-1 {
          margin-top: 20px;
          margin-left: 20px;
        }
        .solo-1 {
          margin-top: 20px;
          &.two {
            margin-top: 0px;
          }
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
      width: 100%;
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

.section-4 {
  
  @include px(1450) {
    width: 100%;
    padding: 50px 0px;
  }

  article {
    figure {
      margin-top: 20px;
      figcaption {
        &.vrtic {
          grid-template-columns: 0.25fr 0.25fr;
          @include px(600) {
            grid-template-columns: 0.7fr;
          }
          .style {
            @include flex-full(space-between, space-between, column);
            @include px(600) {
              border-radius: 15px;
            }
            .prices {
              @include flex-full(center, center, row);
              .discount-img {
                @include flex-full(center, center, column);
              }
            }
            
            ul {
              li {
                &.vrtic {
                  text-align: center;
                  font-weight: 800;
                  margin-bottom: 10px;
                  color: #fff;
                  border-radius: 33px;
                  background: #ffc774;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
