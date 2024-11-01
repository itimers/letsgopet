<template>
  <div class="footer">
    <div class="footer-wrapper">
      <div class="footer-left">
        <LinksClassicHomelogo class="logo" />
      </div>
      <div class="footer-mid">
        <ul v-if="page.page === 1">
          <li><LinksClassicHome @click="page.changeSection(1)"/></li>
          <li><LinksClassicAbout @click="page.changeSection(6)"/></li>
          <li><LinksClassicServices @click="page.changeSection(2)"/></li>
          <li><LinksClassicPettransport @click="page.changeSection(5)"/></li>
          <li><LinksClassicPetvrtic class="vrtic"/></li>
          <li><LinksClassicPricemenu @click="page.changeSection(4)"/></li>
          <li><LinksClassicContact @click="page.changeSection(7)"/></li>
        </ul>
        <ul v-else>
          <li><LinksClassicHome @click="page.changeSectionDelay(1)"/></li>
          <li><LinksClassicAbout @click="page.changeSectionDelay(6)"/></li>
          <li><LinksClassicServices @click="page.changeSectionDelay(2)"/></li>
          <li><LinksClassicPettransport @click="page.changeSectionDelay(5)"/></li>
          <li><LinksClassicPetvrtic @click="page.changeSection(1)" class="vrtic"/></li>
          <li><LinksClassicPricemenu @click="page.changeSection(3)"/></li>
          <li><LinksClassicContact @click="page.changeSection(4)"/></li>
        </ul>
      </div>
      <aside class="footer-right">
        <div class="link-box">
          <div class="link-btn">
            <LinksTosocialIg2 class="link-to" />
          </div>
        </div>
        <div class="link-box">
          <div class="link-btn">
            <LinksTosocialFb class="link-to" />
          </div>
        </div>
        <div class="link-box">
          <div class="link-btn">
            <LinksTosocialTiktok class="link-to" />
          </div>
        </div>
        <div class="link-box link2">
          <div class="link-btn">
            <LinksTosocialMap class="link-to" />
          </div>
        </div>
      <div class="link-box link2">
          <div class="link-btn">
            <LinksTosocialPhone class="link-to" />
          </div>
        </div>
      </aside>
    </div>
    <div class="copyright">
      <p>{{ $t("© 2024, Let's Go Pet All rights reserved.") }}</p>
    </div>
  </div>
</template>
<script lang="ts" setup>
const page = usePagesStore();
</script>