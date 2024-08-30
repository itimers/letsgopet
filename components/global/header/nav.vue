<template>
  <header>
    <div class="header-wrapper">
      <div class="upnav">
        <div class="up-left">
          <LinksSocialsIg class="ig" />
        </div>
        <div class="up-mid"></div>
        <div class="up-right"></div>
      </div>
      <div class="nav-wrapper">
        <LinksClassicHomelogo class="logo" />
        <nav>
          <div>
            <LinksClassicHome />
            <LinksClassicAbout />
            <LinksClassicServices />
            <LinksClassicVip />
            <LinksClassicPettransport/>
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
<style lang="scss">
$header: (
  "light": (
    headerbg: #ffffffec,
    upnaviconsfill: #9f6049,
    upnaviconsfill600: #9f6049,
    upnaviconsfillscrolled: #9f6049,
    upnaviconsfillscrolled600: #9f6049,
    logofill: #c17255,
    logofill600: #c17255,
  ),

  "dark": (
    headerbg: #fff,
    upnaviconsfill: #9f6049,
    upnaviconsfill600: #fff,
    upnaviconsfillscrolled: #9f6049,
    upnaviconsfillscrolled600: #9f6049,
    logofill: #c17255,
    logofill600: #c17255,
  ),
);

$theme: (
  "light": (
    toolsfill: #9f6049,
    toolsfillactive: #dc9176,
    toolsfill600: #9f6049,
    toolsfill600active: #dc9176,
  ),

  "dark": (
    toolsfill: #9f6049,
    toolsfillactive: #dc9176,
    toolsfill600: #9f6049,
    toolsfill600active: #dc9176,
  ),
);
$tools: (
  "light": (
    toolsfill: #9f6049,
    toolsfillactive: #dc9176,
    toolsfill600: #9f6049,
    toolsfill600active: #fff,
  ),

  "dark": (
    toolsfill: #9f6049,
    toolsfillactive: #9f6049,
    toolsfill600: #9f6049,
    toolsfill600active: #fff,
  ),
);

$burger: (
  "light": (
    toolsfill: #9f6049,
    toolsfill600: #fff,
  ),

  "dark": (
    toolsfill: #9f6049,
    toolsfill600: #fff,
  ),
);

header {
  position: relative;
  z-index: 7000;
  top: 0;
  width: 100%;
  box-shadow: 0px 0px 0px 0px #7c512741;
  background: none;
  //background: clr(headerbg);
  transition: background ease 0.3s, box-shadow ease 0.1s;
  transition-delay: 0.1s, 0.1s;
  &.scrolled {
    position: sticky;
    background: clr(headerbgscrl);
    box-shadow: 0px 0px 30px 0px #7c512741;
    .upnav {
      grid-template-rows: 0fr;
      visibility: hidden;
      opacity: 0;
      height: 0;
    }
    .header-wrapper {
      .nav-wrapper {
        .logo {
          @include px(600) {
            color: clr(upnaviconsfillscrolled);
          }
        }
        .tools {
          .burger {
            .burger-btn {
              #top,
              #mid,
              #bottom {
                @include px(600) {
                  fill: clr(upnaviconsfillscrolled);
                }
              }
              
            }
          }
          .loacales {
          }
          .theme-btn-inside {
            button {
              svg {
                @include px(600) {
                  fill: clr(upnaviconsfillscrolled);
                }
              }
            }
          }
          .settings {
            svg {
              @include px(600) {
                fill: clr(upnaviconsfillscrolled);
              }
            }
          }
        }
      }
    }
  }
  @include setColors($header);
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
  width: 100%;
  min-width: 50%;
  height: $nav-height;
  @include flex-custom(space-between, center);
}
.logo {
  font-size: clamp(170%, 50% + 2.6vw, 210%);
  font-weight: 600;
  color: clr(logofill);
  font-family: "Passion One", sans-serif;
  transition: color ease .3s;
  @include px(600) {
    color: clr(logofill600);
  }
}
nav {
  position: relative;
  height: 100%;
  @include flex-custom(center, center);
  @include px(1024) {
    display: none;
  }
  //height: $nav-height;
  div {
    position: absolute;
    bottom: 0;
    height: 100%;
    @include flex-custom(center, center);
  }
}
nav a,
button {
  position: relative;
  bottom: 0;
  height: 70%;
  padding: 0px 15px;
  white-space: nowrap;
  color: clr(font);
  cursor: pointer;
  transition: all ease .3s;
  border-radius: 33px;
  @include flex-center();
  &.active {
    background: clr(primary);
    color: white;
  }
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
  gap: 5px;
  @include flex-custom(flex-start, center);
  a {
    &.fb,
    &.ig,
    &.yt {
      fill: clr(upnaviconsfill);
      @include px(600) {
        fill: clr(upnaviconsfill600);
      }
      & > * {
        width: calc(20px + $up-increment - $up-decrement);
        min-width: $up-minw;
        max-width: $up-maxw;
        @include flex-center();
      }
    }
  }
}

.tools {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
}
.tools {
  @include setColors($tools);
}
.locales {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  &.sr .locale-btn {
    background-image: url("@/assets/img/lang/sr.svg");
  }
  &.ru .locale-btn {
    background-image: url("@/assets/img/lang/ru.svg");
  }
  &.en .locale-btn {
    background-image: url("@/assets/img/lang/en.svg");
  }
  &.de .locale-btn {
    background-image: url("@/assets/img/lang/de.svg");
  }
  &.it .locale-btn {
    background-image: url("@/assets/img/lang/it.svg");
  }
  &.tr .locale-btn {
    background-image: url("@/assets/img/lang/tr.svg");
  }
  &.fr .locale-btn {
    background-image: url("@/assets/img/lang/fr.svg");
  }
  &.cn .locale-btn {
    background-image: url("@/assets/img/lang/cn.svg");
  }
  &.es .locale-btn {
    background-image: url("@/assets/img/lang/es.svg");
  }
}
.locale-btn {
  background-repeat: no-repeat;
  background-position: center;
  color: white;
}
.locales-cloud-modal {
  @include cloud-modal(150px);
  background: clr(primary);
  padding: 10px;
  button {
    color: white;
    border-radius: 33px;
    transition: all ease .3s;
    &.active {
      background: white;
      color: clr(primary);
    }
  }
}
.locales.active .locales-cloud-modal {
  @include active-cloud-modal($nav-height + 3px);
}

.themes {
  position: relative;
  width: 100%;
  height: calc(#{$base-width} - #{$decrement});
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.themes-cloud-modal {
  @include cloud-modal(150px);
  background: clr(primary);
  padding: 10px;
}

.themes.active .themes-cloud-modal {
  @include active-cloud-modal($nav-height + 3px);
}

.settings {
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.settings-cloud-modal {
  @include cloud-modal(150px);
  padding: 10px;
}
.settings.active .settings-cloud-modal {
  @include active-cloud-modal($nav-height + 3px);
}

.settings svg,
.locale-btn,
.themes svg {
  width: calc(20px + $tools-increment - $tools-decrement);
  height: calc(20px + $tools-increment - $tools-decrement);
  min-width: $tools-minw;
  max-width: $tools-maxw;
  min-height: $tools-minw;
  max-height: $tools-maxw;
  transition: all ease 0.3s;
}
.settings svg,
.themes svg {
  fill: clr(toolsfill);
  @include px(600) {
    fill: clr(toolsfill600);
  }
}
.settings.active svg,
.themes.active svg {
  fill: clr(toolsfillactive);
  @include px(600) {
    fill: clr(toolsfill600active);
  }
}

@mixin thememenu-btn {
  .theme-btn-inside {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    @include setColors($theme);
    &.maxtheme {
      margin-right: 0;
      button {
        svg {
          fill: clr(toolsfill);
          @include px(600) {
            fill: clr(toolsfill600active);
          }
        }
      }
    }
    &.light {
      button {
        transform: translate(-50%, -50%) scale(1);

        &.light {
          transform: translate(-50%, -20%) scale(0.7);
          opacity: 0;
          visibility: hidden;
        }

        &.dark {
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
          visibility: visible;

          svg {
            height: 21px;
            width: 21px;
          }
        }
      }
    }

    &.dark {
      button {
        transform: translate(-50%, -50%) scale(1);

        &.dark {
          opacity: 0;
          visibility: hidden;
          transform: translate(-50%, -20%) scale(0.7);
        }

        &.light {
          opacity: 1;
          visibility: visible;
          transform: translate(-50%, -50%) scale(1);
        }
      }
    }

    button {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.6);
      opacity: 0;
      visibility: hidden;
      transition: all ease 0.2s;
      p {
        opacity: 0;
        width: 0;
        height: 0;
        visibility: hidden;
      }
      svg {
        display: flex;
        align-items: center;
        justify-content: center;
        fill: clr(toolsfillactive);
        width: 25px;
        height: 25px;
        transition: fill ease .3s;

        @include px(600) {
          fill: clr(toolsfill600active);
        }
      }
    }
  }
}
@include thememenu-btn();

.burger {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-left: 0px;
  display: none;
  @include px(1024) {
    display: block
  }
}

.burger-btn {
  height: calc(#{$base-width} - #{$decrement});
  min-width: $min-width;
  max-width: $max-width;
  max-height: $max-width;
  min-height: $min-width;
  display: none;
  transform: rotate(180deg);
  transition: fill ease 0.3s;
  @include flex-full(space-between, flex-start, column);
  @include px(1024) {
    display: block;
  }
  #top,
  #mid,
  #bottom {
    fill: clr(toolsfill);
    transition: all ease 0.3s;
    @include flex-custom(flex-start, flex-start);
    @include px(600) {
      fill: clr(toolsfill600);
    }
  }
  #top {
    width: 70%;
    transform: rotate(-180);
  }
  #mid {
    width: 50%;
  }
  #bottom {
    width: 80%;
  }
  &:hover {
    #top,
    #mid,
    #bottom {
      width: 100%;
    }
  }
}
.burger-cloud-modal {
  position: fixed;
  z-index: 9998;
  width: 100%;
  height: 100%;
  top: 0;
  right: 0;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  background: #ffffffa2;
  opacity: 0;
  visibility: hidden;
  transition: all ease 0.3s;
}
.burger.active .burger-cloud-modal {
  opacity: 1;
  visibility: visible;
}
.burger-cloud-modal .overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  background: #ffffffa2;
  opacity: 0;
  visibility: hidden;
  transition: all ease 0.3s;
}
.burger.active .overlay {
  opacity: 1;
  visibility: visible;
}
.burger-cloud-modal .sidemenu {
  background: clr(primary);
  width: 300px;
  transform: translateX(100%);
  height: 100%;
  transition: all ease 0.3s;
}

.burger.active .burger-cloud-modal .sidemenu {
  opacity: 1;
  transform: translateX(0);
  visibility: visible;
}

.sidemenu {
  position: relative;
  @include flex-full(flex-start, stretch, column);
}
.up-side {
  @include flex-custom(flex-end, center);
  button {
    padding: 35px 25px 35px 20px;
    height: calc(#{$base-width} - #{$decrement});
    max-height: $max-width;
    min-height: $min-width;
    gap: 15px;
    color: white;
    @include flex-custom(flex-end, center);

    
    svg {
      height: calc(#{$base-width} - #{$decrement});
      min-width: $min-width;
      max-width: $max-width;
      max-height: $max-width;
      min-height: $min-width;
      fill: white;
    }
  }
}
.mid-side {
  height: 100%;
}
.mid-links {
  padding: 20px 20px;
  @include flex-full(flex-start, flex-start, column);
  a {
    padding: 5px 15px;
    color: white;
    border-radius: 33px;
    transition: all ease .3s;
    cursor: pointer;
    &:hover {
      background: white;
      color: clr(font);
    }
    &.active {
      background: white;
      margin-left: 10px;
      color: clr(font);
    }
  }

}

.bottom-side {
  padding: 10px 10px;
  gap: 15px;
  background: rgba($color: #000000, $alpha: 0.2);
  @include flex-center;
  a {
    min-width: $min-width;
    max-width: $max-width;
    max-height: $max-width;
    min-height: $min-width;
    @include flex-center;
    svg {
      fill: white;
    }
  }
}

.page-indicator-progress {
  position: absolute;
  z-index: 7000;
  bottom: -3px;
  left: 0;
  width: 100%;
  height: 3px;
  opacity: 1;
  transition: opacity 0.3s;
}
.scroll-progress {
  position: relative;
  z-index: 1;
  width: 0;
  height: 3px;
  background: clr(primary);
  transition: width 0.2s linear;
}
</style>
