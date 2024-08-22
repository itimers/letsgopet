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
    sectionName: i18n.t("O nama"),
    slotName: "section3",
    idtag: i18n.t("o-nama"),
  },
  {
    id: 4,
    sectionName: i18n.t("Pet Transport"),
    slotName: "section4",
    idtag: i18n.t("pet-transport"),
  },
  {
    id: 5,
    sectionName: i18n.t("Kontakt"),
    slotName: "section5",
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
          <aside>
            <img src="/assets/img/dogs/4-ps.jpg" />
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
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Neque
              debitis nesciunt consequuntur voluptatum provident? Laborum quam
              perspiciatis ducimus? Repellat voluptatem mollitia adipisci
              suscipit autem, earum dignissimos, tempora optio blanditiis
              voluptatibus libero eligendi omnis nobis non et totam quam quidem,
              ullam ipsam officiis sed reprehenderit aut ducimus. Maiores
              mollitia pariatur fugit rem velit. Aperiam ullam temporibus
              voluptate natus hic et vero nihil explicabo repudiandae aliquid
              totam, mollitia libero placeat voluptatibus quae nemo eveniet
              minima dicta error quia. Et ut sint non a necessitatibus libero
              quasi cupiditate, hic deleniti, iure blanditiis! Dignissimos quos
              non omnis reiciendis repellendus sunt, earum at. Similique, omnis
              nulla sint nobis inventore blanditiis deserunt quod ea sit dolore
              repellat numquam aliquam minima eos, impedit aperiam quasi tempora
              beatae incidunt soluta repudiandae. Officia placeat ipsam modi
              sequi, quisquam excepturi nostrum harum esse assumenda numquam
              ipsa quas temporibus sapiente, voluptatum nemo ad quae fuga amet
              cumque. Consequatur velit perspiciatis consequuntur recusandae
              temporibus impedit aut laboriosam vero, nemo, rem, culpa hic quae
              nulla itaque aliquam corrupti placeat iusto ducimus? Voluptates
              exercitationem et, quod saepe, vel molestiae totam, fuga maxime
              obcaecati sed ipsa! At delectus dicta numquam, suscipit aliquam
              nesciunt ad harum quo unde in labore doloribus sequi dolores
              dignissimos, nostrum commodi inventore laboriosam. Blanditiis ad
              assumenda similique eius. Fugiat illum quibusdam repudiandae
              aliquam laudantium accusantium, aliquid repellat placeat magni,
              repellendus sunt a incidunt amet velit dicta. Temporibus excepturi
              iusto, illo optio totam inventore officiis molestiae reiciendis
              amet voluptatem, corrupti ipsa blanditiis, dolore sint molestias
              mollitia voluptates distinctio reprehenderit quod. Ducimus
              veritatis veniam facilis? Consectetur maxime vel quisquam dolor
              perferendis minus neque repudiandae deleniti, ab nobis. Debitis
              perferendis veritatis dignissimos amet ad tenetur inventore nisi
              quasi eum, ipsum, aspernatur, sapiente officia corrupti possimus
              adipisci. Quasi officiis et id ullam modi eaque quia facilis
              maxime rerum, perferendis praesentium, architecto, sint soluta
              voluptas quam?
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
            <h2>O nama</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Neque
              debitis nesciunt consequuntur voluptatum provident? Laborum quam
              perspiciatis ducimus? Repellat voluptatem mollitia adipisci
              suscipit autem, earum dignissimos, tempora optio blanditiis
              voluptatibus libero eligendi omnis nobis non et totam quam quidem,
              ullam ipsam officiis sed reprehenderit aut ducimus. Maiores
              mollitia pariatur fugit rem velit. Aperiam ullam temporibus
              voluptate natus hic et vero nihil explicabo repudiandae aliquid
              totam, mollitia libero placeat voluptatibus quae nemo eveniet
              minima dicta error quia. Et ut sint non a necessitatibus libero
              quasi cupiditate, hic deleniti, iure blanditiis! Dignissimos quos
              non omnis reiciendis repellendus sunt, earum at. Similique, omnis
              nulla sint nobis inventore blanditiis deserunt quod ea sit dolore
              repellat numquam aliquam minima eos, impedit aperiam quasi tempora
              beatae incidunt soluta repudiandae. Officia placeat ipsam modi
              sequi, quisquam excepturi nostrum harum esse assumenda numquam
              ipsa quas temporibus sapiente, voluptatum nemo ad quae fuga amet
              cumque. Consequatur velit perspiciatis consequuntur recusandae
              temporibus impedit aut laboriosam vero, nemo, rem, culpa hic quae
              nulla itaque aliquam corrupti placeat iusto ducimus? Voluptates
              exercitationem et, quod saepe, vel molestiae totam, fuga maxime
              obcaecati sed ipsa! At delectus dicta numquam, suscipit aliquam
              nesciunt ad harum quo unde in labore doloribus sequi dolores
              dignissimos, nostrum commodi inventore laboriosam. Blanditiis ad
              assumenda similique eius. Fugiat illum quibusdam repudiandae
              aliquam laudantium accusantium, aliquid repellat placeat magni,
              repellendus sunt a incidunt amet velit dicta. Temporibus excepturi
              iusto, illo optio totam inventore officiis molestiae reiciendis
              amet voluptatem, corrupti ipsa blanditiis, dolore sint molestias
              mollitia voluptates distinctio reprehenderit quod. Ducimus
              veritatis veniam facilis? Consectetur maxime vel quisquam dolor
              perferendis minus neque repudiandae deleniti, ab nobis. Debitis
              perferendis veritatis dignissimos amet ad tenetur inventore nisi
              quasi eum, ipsum, aspernatur, sapiente officia corrupti possimus
              adipisci. Quasi officiis et id ullam modi eaque quia facilis
              maxime rerum, perferendis praesentium, architecto, sint soluta
              voluptas quam?
            </p>
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
            <h2>Pet Transport</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Neque
              debitis nesciunt consequuntur voluptatum provident? Laborum quam
              perspiciatis ducimus? Repellat voluptatem mollitia adipisci
              suscipit autem, earum dignissimos, tempora optio blanditiis
              voluptatibus libero eligendi omnis nobis non et totam quam quidem,
              ullam ipsam officiis sed reprehenderit aut ducimus. Maiores
              mollitia pariatur fugit rem velit. Aperiam ullam temporibus
              voluptate natus hic et vero nihil explicabo repudiandae aliquid
              totam, mollitia libero placeat voluptatibus quae nemo eveniet
              minima dicta error quia. Et ut sint non a necessitatibus libero
              quasi cupiditate, hic deleniti, iure blanditiis! Dignissimos quos
              non omnis reiciendis repellendus sunt, earum at. Similique, omnis
              nulla sint nobis inventore blanditiis deserunt quod ea sit dolore
              repellat numquam aliquam minima eos, impedit aperiam quasi tempora
              beatae incidunt soluta repudiandae. Officia placeat ipsam modi
              sequi, quisquam excepturi nostrum harum esse assumenda numquam
              ipsa quas temporibus sapiente, voluptatum nemo ad quae fuga amet
              cumque. Consequatur velit perspiciatis consequuntur recusandae
              temporibus impedit aut laboriosam vero, nemo, rem, culpa hic quae
              nulla itaque aliquam corrupti placeat iusto ducimus? Voluptates
              exercitationem et, quod saepe, vel molestiae totam, fuga maxime
              obcaecati sed ipsa! At delectus dicta numquam, suscipit aliquam
              nesciunt ad harum quo unde in labore doloribus sequi dolores
              dignissimos, nostrum commodi inventore laboriosam. Blanditiis ad
              assumenda similique eius. Fugiat illum quibusdam repudiandae
              aliquam laudantium accusantium, aliquid repellat placeat magni,
              repellendus sunt a incidunt amet velit dicta. Temporibus excepturi
              iusto, illo optio totam inventore officiis molestiae reiciendis
              amet voluptatem, corrupti ipsa blanditiis, dolore sint molestias
              mollitia voluptates distinctio reprehenderit quod. Ducimus
              veritatis veniam facilis? Consectetur maxime vel quisquam dolor
              perferendis minus neque repudiandae deleniti, ab nobis. Debitis
              perferendis veritatis dignissimos amet ad tenetur inventore nisi
              quasi eum, ipsum, aspernatur, sapiente officia corrupti possimus
              adipisci. Quasi officiis et id ullam modi eaque quia facilis
              maxime rerum, perferendis praesentium, architecto, sint soluta
              voluptas quam?
            </p>
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
            <h2>Kontakt</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Neque
              debitis nesciunt consequuntur voluptatum provident? Laborum quam
              perspiciatis ducimus? Repellat voluptatem mollitia adipisci
              suscipit autem, earum dignissimos, tempora optio blanditiis
              voluptatibus libero eligendi omnis nobis non et totam quam quidem,
              ullam ipsam officiis sed reprehenderit aut ducimus. Maiores
              mollitia pariatur fugit rem velit. Aperiam ullam temporibus
              voluptate natus hic et vero nihil explicabo repudiandae aliquid
              totam, mollitia libero placeat voluptatibus quae nemo eveniet
              minima dicta error quia. Et ut sint non a necessitatibus libero
              quasi cupiditate, hic deleniti, iure blanditiis! Dignissimos quos
              non omnis reiciendis repellendus sunt, earum at. Similique, omnis
              nulla sint nobis inventore blanditiis deserunt quod ea sit dolore
              repellat numquam aliquam minima eos, impedit aperiam quasi tempora
              beatae incidunt soluta repudiandae. Officia placeat ipsam modi
              sequi, quisquam excepturi nostrum harum esse assumenda numquam
              ipsa quas temporibus sapiente, voluptatum nemo ad quae fuga amet
              cumque. Consequatur velit perspiciatis consequuntur recusandae
              temporibus impedit aut laboriosam vero, nemo, rem, culpa hic quae
              nulla itaque aliquam corrupti placeat iusto ducimus? Voluptates
              exercitationem et, quod saepe, vel molestiae totam, fuga maxime
              obcaecati sed ipsa! At delectus dicta numquam, suscipit aliquam
              nesciunt ad harum quo unde in labore doloribus sequi dolores
              dignissimos, nostrum commodi inventore laboriosam. Blanditiis ad
              assumenda similique eius. Fugiat illum quibusdam repudiandae
              aliquam laudantium accusantium, aliquid repellat placeat magni,
              repellendus sunt a incidunt amet velit dicta. Temporibus excepturi
              iusto, illo optio totam inventore officiis molestiae reiciendis
              amet voluptatem, corrupti ipsa blanditiis, dolore sint molestias
              mollitia voluptates distinctio reprehenderit quod. Ducimus
              veritatis veniam facilis? Consectetur maxime vel quisquam dolor
              perferendis minus neque repudiandae deleniti, ab nobis. Debitis
              perferendis veritatis dignissimos amet ad tenetur inventore nisi
              quasi eum, ipsum, aspernatur, sapiente officia corrupti possimus
              adipisci. Quasi officiis et id ullam modi eaque quia facilis
              maxime rerum, perferendis praesentium, architecto, sint soluta
              voluptas quam?
            </p>
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
.section-1 {
  position: relative;
  width: 100%;
  min-height: $section-1-height;
  overflow: hidden;
  @include flex-full(center, center, column);
  @include px(1024) {
    min-height: calc($section-1-height - 0px);
  @include flex-full(flex-start, center, column);
    padding-top: 50px;

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
      box-shadow: 0px -900px 500px 500px rgba($color: #fff, $alpha: 0.95);
      height: calc($section-1-height - 0px);
    }
  }
  $img-height: 500px;
  aside {
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
    height: 100%;
    min-height: 100%;
    object-fit: cover;
    img {
      float: right;
      object-fit: cover;
      @include px(1024) {
        min-height: calc($section-1-height - 0px);
        height: calc($section-1-height - 0px);
      }
      @include px(720) {
        object-fit: cover;
        min-height: calc($section-1-height - 0px);
      }
    }
    /*position: relative;
    width: 60%;
    height: $img-height;
    overflow: hidden;
    margin-right: -100px;
    margin-left: calc(40% - 15vw);
    border-top-left-radius: calc($img-height / 2 + 20px);
    border-bottom-left-radius: calc($img-height / 2 + 20px);
    box-shadow: 0px 0px 20px 0px rgba($color: #000000, $alpha: .2);
    @include flex-custom(center, flex-start);
    img {
      width: 100%;
      height: calc($img-height + 150px);
      object-fit: cover;
    }*/
  }
}
.section-2 {
  padding: 100px 100px;
}
.section-3 {
  padding: 100px 100px;
}
.section-4 {
  padding: 100px 100px;
}
.section-5 {
  padding: 100px 100px;
}
</style>
