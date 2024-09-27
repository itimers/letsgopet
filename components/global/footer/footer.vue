<template>
  <div class="footer">
    <div class="footer-wrapper">
      <div class="footer-left">
        <LinksClassicHomelogo class="logo" />
      </div>
      <div class="footer-mid">
        <ul>
          <li><LinksClassicHome /></li>
          <li><LinksClassicAbout /></li>
          <li><LinksClassicServices /></li>
          <li><LinksClassicVip /></li>
          <li><LinksClassicPettransport /></li>
          <li><LinksClassicPricemenu /></li>
          <li><LinksClassicContact /></li>
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