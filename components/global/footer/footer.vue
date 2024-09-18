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
<style lang="scss">
$footer: (
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
.footer {
  background: clr(upnaviconsfill);
  @include setColors($footer);
}
.footer {
 @include flex-full(space-between, center, column);
}
.copyright {
  width: 100%;
  text-align: center;
  padding: 10px;
  background: rgba($color: #000000, $alpha: 0.1);
  color: white;
}
.footer-wrapper {
  width: calc(85% + 50px);
  margin-inline: auto;
  padding: 50px 0px;
  @include flex-full(space-between, flex-start, row);
  @include px(1024) {
    width: 95%;
    flex-direction: column;
    padding-left: 50px;
  }

  .footer-mid {
    @include px(1024) {
      padding: 20px 0px !important;
    }
    ul {
      list-style-type: none;
      li {
        margin: 5px 0px;
        a {
          color: white;
          padding: 5px 10px;
          font-size: clamp(90%, 50% + 1.5vw, 110%);
          border-radius: 33px;
          transition: all ease .2s;
          cursor: pointer;
          &:hover {
            background: white;
            color: clr(font);
          }
        }
      }
    }
  }
  .footer-left {
    .logo {
      font-size: clamp(170%, 50% + 2.6vw, 310%);
      font-weight: 600;
      color: clr(headerbg);
      font-family: "Passion One", sans-serif;
      transition: color ease 0.3s;
    }
  }
  .footer-right {
    margin-top: 0px;
    gap: 0px;
    @include flex-full(center,center,column);
    @include px(1024) {
      @include flex-full(flex-start,flex-start,column);
    }
    @include px(800) {
      gap: 0px;
    }
    @include px(600) {
      gap: 10px;
      flex-direction: column;
    }

    .link-box {
      margin: 0 !important; 
      margin-top: 10px !important;
      @include flex-full(flex-start, flex-start, row);
      @include social-btn();
      @include px(1024) {
        margin-top: 10px !important;
      }
      .link-btn {
        .link-to {
            animation: none;
        }
        .press-here {
            background: none !important;
            color: white !important;
            display: none !important;
        }
        svg {
            fill: clr(primary) !important;
        }
        a {
          background: white !important;
            .dm-icon {
                display: none !important;
            }
            p {
                color: clr(primary) !important;
            }
            .touch-container {
                display: none;
                .touch-arrow-click {
                    svg {
                        fill: white !important;
                    }
                }
            }
        }
      }
    }
    .link2 {
      .touch {
        @include px(600) {
          display: none;
        }
      }
    }
  }
}
</style>
