<template>
  <div
    class="burger"
    :class="{
      active: page.states.find(
        (el) => el.btn === 'burger' && el.activemenu
      ),
    }"
  >
    <svg
      @click.stop="page.toggleElementVisibility('burger')"
      class="burger-btn"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 35 35"
    >
      <path
        d="M34.2 5.6H.8c-.2 0-.4-.2-.4-.4V.8C.4.6.6.4.8.4h33.5c.2 0 .4.2.4.4v4.5c-.1.2-.2.3-.5.3zM34.2 20.1H.8c-.2 0-.4-.2-.4-.4v-4.5c0-.2.2-.4.4-.4h33.5c.2 0 .4.2.4.4v4.5c-.1.3-.2.4-.5.4zM34.2 34.6H.8c-.2 0-.4-.2-.4-.4v-4.5c0-.2.2-.4.4-.4h33.5c.2 0 .4.2.4.4v4.5c-.1.2-.2.4-.5.4z"
      />
    </svg>

    <div
      @click.stop="updateZindex"
      class="burger-cloud-modal"
      v-if="page.states.find((el) => el.btn === 'burger' && el.activebtn)"
      :style="[
        {
          zIndex: page.states.find((el) => el.menu === 'burgerdiv')
            ?.zIndex,
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
          <div class="mid-links">
            <LinksClassicHome />
            <LinksClassicAbout />
            <LinksClassicPricemenu/>            
            <LinksClassicContact />
          </div>
        </div>
        <div class="bottom-side">
          <LinksSocialsFb />
          <LinksSocialsIg />
          <LinksSocialsMail />
          <LinksSocialsPhone />
          <LinksSocialsWa />
          <LinksSocialsVib />
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
.burger {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-left: 10px;
}
.burger-btn {
  height: calc(#{$base-width} - #{$decrement});
  min-width: $min-width;
  max-width: $max-width;
  max-height: $max-width;
  min-height: $min-width;
  vertical-align: middle;
  background-repeat: no-repeat;
  background-position: center;
  display: none;
  transition: fill ease 0.3s;
  @include flex-center();
  @include px(1024) {
    display: block;
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
  background: red;
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
    @include flex-custom(flex-end, center);
    svg {
      height: calc(#{$base-width} - #{$decrement});
      min-width: $min-width;
      max-width: $max-width;
      max-height: $max-width;
      min-height: $min-width;
    }
  }
}
.mid-side {
  height: 100%;
}
.mid-links {
  @include flex-full(flex-start, flex-start, column);
}
.infusions-menu,
.surgery-menu,
.services-menu {
  display: grid;
  grid-template-rows: 0fr;
  overflow: hidden;
  transition: grid-template-rows ease 0.3s;
  & > div {
    overflow: hidden;
  }
  &.active {
    grid-template-rows: 1fr;
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
  }
}
</style>
