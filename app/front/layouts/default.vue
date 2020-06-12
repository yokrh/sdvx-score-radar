<template>
  <div>
    <!-- メインコンテンツ -->
    <nuxt id="main-content" />

    <!-- フッター -->
    <div id="footer">
      <!-- 言語設定 -->
      <div id="languages">
        <nuxt-link :to="switchLocalePath('ja')">日本語</nuxt-link>
        <nuxt-link :to="switchLocalePath('en')">English</nuxt-link>
        <nuxt-link :to="switchLocalePath('zh')">中文</nuxt-link>
      </div>
      <!-- コピーライト -->
      <div id="copyright">&copy; {{ year }} {{ creater }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 作者
      creater: 'yokrh',
    }
  },
  computed: {
    // 現在の年
    year() {
      return new Date().getFullYear()
    },
  },
}
</script>

<style scoped>
#main-content {
  min-height: 100vh;
}
#footer {
  margin: -28px 8px 0 8px;
  display: flex;
  justify-content: space-between;
}
#languages {
  height: 0;
}
#languages a {
  margin-left: 12px;
  line-height: 20px;
  font-size: 16px;
  color: #555;
}
#copyright {
  text-align: right;
  height: 0;
  line-height: 20px;
  font-size: 16px;
  color: #888;
}
</style>
<style>
div#__nuxt, #__layout, #__layout>div, #app { min-height: 100vh; }
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

/* http://meyerweb.com/eric/tools/css/reset/
   v2.0 | 20110126
   License: none (public domain)
*/
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, menu, nav, section {
  display: block;
}
body {
  line-height: 1;
}
ol, ul {
  list-style: none;
}
blockquote, q {
  quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
  content: '';
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}

dl, ul, ol {
  font-size: 0;
}
</style>
