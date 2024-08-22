<template>
  <NuxtLink class="calluswrap" to="tel:+381612966499" :aria-label="$t('Pozovite nas')">
    <span class="sr-only">{{ $t("Pozovite nas") }}</span>
    <!-- <svg
      version="1.1"
      id="callus"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 30 30"
      style="enable-background: new 0 0 30 30"
      xml:space="preserve"
    >
      <circle id="circle" class="st0" cx="15" cy="15" r="14.8" />
     
      <path
        id="phone"
        class="st1"
        d="M9.9,9.5c0.2,0.1,0.4,0.1,0.5,0.2c0.3,0.2,0.5,0.5,0.5,0.9c0,0.7,0.1,1.3,0.2,1.9
   c0.1,0.3,0.1,0.5,0.2,0.8c0.1,0.4,0,0.7-0.2,1.1c-0.4,0.5-0.8,1.1-1.2,1.6c0,0,0,0.1,0,0.1c0.8,1.6,2,2.8,3.5,3.7
   c0.1,0.1,0.3,0.2,0.4,0.2c0,0,0.1,0,0.1,0c0.5-0.4,1.1-0.8,1.6-1.2c0.3-0.2,0.7-0.3,1-0.2c0.4,0.1,0.8,0.2,1.2,0.3
   c0.5,0.1,1,0.1,1.5,0.1c0.6,0,1,0.3,1.2,0.9c0,0.1,0,0.2,0,0.4c0,0.9,0,1.7,0,2.6c0,0.7-0.5,1.2-1.2,1.2c-2.7,0-5.2-0.8-7.4-2.3
   C9.7,20.4,8,18.5,7,16.1c-0.5-1.2-0.9-2.4-1-3.7c0-0.4-0.1-0.7-0.1-1.1c0-0.2,0-0.5,0-0.7C5.9,10.4,6,10.2,6.1,10
   c0.2-0.3,0.5-0.4,0.8-0.5C7.9,9.5,8.9,9.5,9.9,9.5z"
      />
    </svg> -->
  </NuxtLink>
</template>
<style lang="scss" scoped>
.calluswrap {
  position: fixed;
  z-index: 900;
  right: 20px;
  bottom: 25px;
  width: 100px;
  height: 100px;
  background: getColor(callus);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  box-shadow: 0px 0px 20px 0px rgba($color: #000000, $alpha: 0.3);
  p {
    opacity: 0;
    visibility: hidden;
    height: 0;
    width: 0;
  }
  &:hover {
    transform: scale(1.1) !important;
  }
  svg {
    width: 100%;
    height: 100px;
    
  }
  /*#radius {
    transform-origin: 50% 50%;
    @include pulse4(10s, ease, none, .8, 1.3);
  }*/
  /*#clock {
    transform-origin: 50% 50%;
    @include pulse3(10s, ease-in, none, 1, 1.1);
    /~opacity: 0 !important;~/
  }*/
  #phone {
    transform-origin: 50% 50%;
    transform: scale(1) translate(0%,0%) rotate(0deg);
    
  }
  .st0 {
    fill: getColor(callus);
  }
  .st1 {
    fill: #ffffff;
  }

  @include px(550) {
    right: 10px;
    bottom: 15px;
    width: 80px;
    height: 80px;
    &:hover {
      transform: scale(.9) !important;
    }
  }
}
</style>
