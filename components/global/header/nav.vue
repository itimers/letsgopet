<template>
  <header>
    <div class="header-wrapper">
      <div class="upnav">
        <div class="up-left">
          <LinksSocialsFb class="fb" />
          <LinksSocialsIg class="ig" />
          <LinksSocialsYt class="yt" />
        </div>
        <div class="up-mid"></div>
        <div class="up-right"></div>
      </div>
      <div class="nav-wrapper">
        <LinksClassicHomelogo class="logo"/>
        <nav>
          <div>
            <LinksClassicHome />
            <LinksClassicAbout />
            <LinksClassicServices />
            <LinksClassicPricemenu />
            <LinksClassicContact />
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
<style lang="scss" scoped>
$header: (
  "light": (
    headerbg: #ffffffef,
    linkclr: $svg-primary,
    upsvg: $svg-primary,
  ),

  "dark": (
    headerbg: $secondary,
    linkclr: $primary,
    upsvg: $primary,
  ),
);

header {
  @include setColors($header);
  position: relative;
  z-index: 7000;
  //background: clr(headerbg);
  top: 0;
  width: 100%;
  transition: all ease .3s;
  &.scrolled {
    position: sticky;
    background: clr(headerbg);
    .upnav {
      grid-template-rows: 0fr;
      visibility: hidden;
      opacity: 0;
      height: 0;
    }
    
  }
}
.header-wrapper {
  max-width: calc(90% + 50px);
  margin-inline: auto;
  //na 14
  @include px(1024) {
    width: 100%;
    padding: 0px 20px;
  }
}
.nav-wrapper {
  position: relative;
  @include flex-custom(space-between, center);
  width: 100%;
  min-width: 50%;
  height: $nav-height;
}
.logo {
  font-size: clamp(170%, 50% + 2.6vw, 210%);
  font-weight: 600;
  color: clr(font);
  font-family: "Passion One", sans-serif;
}
nav {
  position: relative;
  height: 100%;
  @include flex-custom(center, stretch);
  @include px(1024) {
    display: none;
  }
  //height: $nav-height;
  div {
    position: absolute;
    bottom: 0;
    height: 100%;
    @include flex-custom(center, stretch);
  }
}
nav a,
button {
  position: relative;
  bottom: 0;
  height: 100%;
  padding: 0px 10px;
  white-space: nowrap;
  color: clr(font);
  @include flex-center();
}

.upnav {
  display: grid;
  grid-template-rows: 1fr;
  overflow: hidden;
  opacity: 1;
  visibility: visible;
  transition: grid-template-rows ease 0.3s, height ease 0.3s, opacity ease 0.3s,
    visibility ease 0.3s;
  height: $upnav-height;
  & > div {
    overflow: hidden;
  }
}
.up-left {
  @include flex-custom(flex-start, center);
  gap: 5px;
  a {
    &.fb,
    &.ig,
    &.yt {
      fill: clr(upsvg);
      &> * {
        @include flex-center();
        width: calc(20px + $up-increment - $up-decrement);
        min-width: $up-minw;
        max-width: $up-maxw;
      }
    }
  }
}

.page-indicator-progress {
  position: absolute;
  z-index: 3;
  bottom: -3px;
  left: 0;
  width: 100%;
  height: 3px;
  opacity: 1;
  transition: opacity 0.3s;
}

.scroll-progress {
  position: relative;
  z-index: 20;
  width: 0;
  height: 3px;
  background: clr(primary);
  transition: width 0.2s linear;
}
</style>
