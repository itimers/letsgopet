<template>
  <div
    class="burger"
    :class="{
      active: page.states.find((el) => el.btn === 'burger' && el.activemenu),
    }"
  >
    <svg class="burger-btn"
      @click.stop="page.toggleElementVisibility('burger')"
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 44 41.56"
    >
      <rect
        class="cls-1"
        id="mid"
        x="1.04"
        y="18.5"
        width="41.96"
        height="5"
        rx="2.5"
        ry="2.5"
      />
      <rect
        class="cls-1"
        id="top"
        x="1.02"
        y=".78"
        width="41.96"
        height="4.35"
        rx="2.17"
        ry="2.17"
      />
      <rect
      id="bottom"
        class="cls-1"
        x="1.02"
        y="36.43"
        width="41.96"
        height="4.35"
        rx="2.17"
        ry="2.17"
      />
    </svg>

    <div
      @click.stop="updateZindex"
      class="burger-cloud-modal"
      v-if="page.states.find((el) => el.btn === 'burger' && el.activebtn)"
      :style="[
        {
          zIndex: page.states.find((el) => el.menu === 'burgerdiv')?.zIndex,
        },
      ]"
      :class="{
        active: page.states.find(
          (el) => el.menu === 'burgerdiv' && el.activemenu
        ),
      }"
    >
      <div
        class="overlay"
        @click.stop="page.toggleElementVisibility('burger')"
      ></div>
      <div class="sidemenu">
        <div class="up-side">
          <button
            @click.stop="page.toggleElementVisibility('burger')"
            :aria-label="$t('closesidemenu')"
          >
            <p>{{ $t("closemenu") }}</p>
            <IconsControlsClose />
          </button>
        </div>
        <div class="mid-side">
          <div v-if="page.page === 1" class="mid-links">
            <LinksClassicHome @click="page.toggleElementVisibility('burger'), page.changeSection(1)"/>
            <LinksClassicAbout @click="page.toggleElementVisibility('burger'), page.changeSection(6)"/>
            <LinksClassicServices @click="page.toggleElementVisibility('burger'), page.changeSection(2)"/>
            <LinksClassicVip @click="page.toggleElementVisibility('burger'), page.changeSection(3)"/>
            <LinksClassicPettransport @click="page.toggleElementVisibility('burger'), page.changeSection(5)"/>
            <LinksClassicPetvrtic class="vrtic" @click="page.toggleElementVisibility('burger')"/>
            <LinksClassicPricemenu @click="page.toggleElementVisibility('burger'), page.changeSection(4)"/>
            <LinksClassicContact @click="page.toggleElementVisibility('burger'), page.changeSection(7)"/>
          </div>
          <div v-else class="mid-links">
            <LinksClassicHome @click="page.toggleElementVisibility('burger'), page.changeSectionDelay(1)"/>
            <LinksClassicAbout @click="page.toggleElementVisibility('burger'), page.changeSectionDelay(6)"/>
            <LinksClassicServices @click="page.toggleElementVisibility('burger'), page.changeSectionDelay(2)"/>
            <LinksClassicVip @click="page.toggleElementVisibility('burger'), page.changeSectionDelay(3)"/>
            <LinksClassicPettransport @click="page.toggleElementVisibility('burger'), page.changeSectionDelay(5)"/>
            <LinksClassicPetvrtic class="vrtic" @click="page.toggleElementVisibility('burger')"/>
            <LinksClassicPricemenu @click="page.toggleElementVisibility('burger'), page.changeSectionDelay(4)"/>
            <LinksClassicContact @click="page.toggleElementVisibility('burger'), page.changeSectionDelay(7)"/>
          </div>
        </div>
        <div class="bottom-side">
          <LinksSocialsIg />
          <LinksSocialsFb />
          <LinksSocialsTikt />
          <LinksSocialsMap />
          <LinksSocialsPhone />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const page = usePagesStore();
const updateZindex = () => {
  page.bringToFront(page.states.find((el) => el.menu === "burgerdiv"));
};
</script>
<style lang="scss">

</style>
