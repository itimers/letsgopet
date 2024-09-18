<script setup lang="ts">
const page = usePagesStore();

onMounted(()=> {
    page.page = 3
})
</script>
<template>
  <div class="page page-home">
    <div class="page-size">
        <div class="qr-page">
            <div class="qr-wrapper">
                <div class="">
                    <h2>Kontakt informacije</h2>
                </div>
                <div class="">
                    <h2>Društvene mreze</h2>
                </div>
                <div class=""></div>
            </div>
        </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
