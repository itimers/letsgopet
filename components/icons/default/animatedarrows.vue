<template>
  <div class="slideup-con">
    <div class="slideup"></div>
    <div class="slideup"></div>
    <div class="slideup"></div>
  </div>
</template>
<style scoped lang="scss">
$base: 0.35rem;

.slideup-con {
  position: absolute;
  z-index: 2;
  bottom: 20px;
  transform: rotate(180deg);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 1vh;
  transition: opacity ease .4s, visibility ease .4s, bottom ease .3s;
}

.slideup {
  position: absolute;
  width: $base * 3.5;
  height: $base * 0.8;
  opacity: 0;
  transform: scale(0.3);
  animation: move-slideup 3s ease-out infinite;
}

.slideup:first-child {
  animation: move-slideup 3s ease-out 1s infinite;
}

.slideup:nth-child(2) {
  animation: move-slideup 3s ease-out 2s infinite;
}

.slideup:before,
.slideup:after {
  content: "";
  position: absolute;
  top: 0;
  height: 100%;
  width: 50%;
  background: #fff;
}

.slideup:before {
  left: 0;
  transform: skewY(30deg);
}

.slideup:after {
  right: 0;
  width: 50%;
  transform: skewY(-30deg);
}

@keyframes move-slideup {
  25% {
    opacity: 1;
  }
  33.3% {
    opacity: 1;
    transform: translateY($base * 3.8);
  }
  66.6% {
    opacity: 1;
    transform: translateY($base * 5.2);
  }
  100% {
    opacity: 0;
    transform: translateY($base * 8) scale(0.5);
  }
}
</style>
