<template>
  <header>
    <div class="header-wrapper">
      <div class="upnav">
        <div class="up-left">
          <LinksSocialsFb class="fb" />
          <LinksSocialsIg class="ig" />
          <LinksSocialsTikt class="tiktok" />
          <LinksSocialsPhone class="phone" />
          <LinksSocialsMap class="map" />
        </div>
        <div class="up-mid"></div>
        <div class="up-right"></div>
      </div>
      <div class="nav-wrapper">
        <LinksClassicHomelogo class="logo nav" />
        <nav>
        
          <div v-if="page.page === 1">
            <LinksClassicHome @click="page.changeSection(1)"/>
            <LinksClassicAbout @click="page.changeSection(6)"/>
            <LinksClassicServices @click="page.changeSection(2)"/>
            <LinksClassicPettransport @click="page.changeSection(5)"/>
            <LinksClassicPetvrtic class="vrtic"/>
            <LinksClassicPricemenu @click="page.changeSection(4)"/>
            <LinksClassicContact @click="page.changeSection(7)"/>
          </div>
          <div v-else>
            <LinksClassicHome @click="page.changeSectionDelay(1)"/>
            <LinksClassicAbout @click="page.changeSectionDelay(6)"/>
            <LinksClassicServices @click="page.changeSectionDelay(2)"/>
            <LinksClassicPettransport @click="page.changeSectionDelay(5)"/>
            <LinksClassicPetvrtic @click="page.changeSection(1)" class="vrtic"/>
            <LinksClassicPricemenu @click="page.changeSection(3)"/>
            <LinksClassicContact @click="page.changeSection(4)"/>
          </div>
        </nav>
        <HeaderTools />
      </div>
    </div>
    <div class="page-indicator-progress" v-if="page.scrollProgress > 0">
      <div
        class="scroll-progress"
        :style="{ width: `${page.scrollProgress.toFixed(0)}%` }"
      ></div>
    </div>
  </header>
</template>
<script lang="ts" setup>
const page = usePagesStore();
</script>
<style lang="scss">

</style>
