<i18n src="./i18n.json"></i18n>

<template>
  <div class="home-page">
    <!-- ページタイトル -->
    <h1 class="page-title">
      {{ $t('title') }}
    </h1>

    <!-- サンプル画像 -->
    <div class="sample-image-container">
      <img class="sample-image" src="../assets/img/rader_chart_sample.png" alt="Rader chart image">
    </div>

    <!-- 楽曲リストへのリンク -->
    <div class="main-action">
      <nuxt-link :to="localePath({ path: '/track/' })">
        <el-button type="primary" plain>
          {{ $t('track-list') }}
        </el-button>
      </nuxt-link>
    </div>

    <!-- サイト説明 -->
    <div class="page-description">
      <p class="text">
        {{ $t('text1-1') }}
        <el-link
          type="primary"
          :underline="false"
          href="https://p.eagate.573.jp/game/sdvx/v/p/top/"
          target="_blank"
          rel="noopener"
          style="padding:0 1px;"
        >
          SOUND VOLTEX
        </el-link>
        {{ $t('text1-2') }}
      </p>
      <p class="note">
        {{ $t('text2-1') }}
      </p>
      <p class="note">
        {{ $t('text3-1') }}
      </p>
      <p class="note">
        {{ $t('text4-1') }}
      </p>
    </div>

    <!-- 最終更新日 -->
    <div class="last-updated">
      <span>{{ $t('last-updated') }}:</span><span style="margin-left:8px;">{{ lastUpdated }}</span>
    </div>
  </div>
</template>

<script>
export default {
  head() {
    return {
      // Title
      title: this.$t('title'),
      // Description
      meta: [
        { hid: 'description', name: 'description', content: this.$t('description') },
      ],
    }
  },
  data() {
    return {
      // 最終更新日
      lastUpdated: '2021/2/27',
    }
  },
}
</script>

<style scoped>
.home-page {
  padding: 0 4% 28px 4%; /* be careful of footer */
  background:linear-gradient(135deg, rgba(22,8,128,0.01) 0%, rgba(222,81,128,0.01) 60%, rgba(222,81,128,0.1) 100%);
}
.page-title {
  padding: 32px 0;
  font-size: 32px;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
}
.sample-image-container {
  padding: 20px 10%;
  width: 80%;
  height: 400px;
}
.sample-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.main-action {
  display: block;
  text-align: center;
  margin: 32px;
}
.main-action >>> .el-button {
  width: 50%;
}
.main-action >>> .el-button--primary.is-plain {
  color: #1060ff;
}
.main-action >>> .el-button--primary.is-plain:hover {
  color: #fff;
  font-weight: bold;
}
.page-description {
  padding: 40px 0 0 20%;
  width: 60%;
}
.page-description .text {
  margin-top: 16px;
  font-size: 20px;
  color: #333;
  line-height: 20px;
}
.page-description .note {
  margin-top: 12px;
  font-size: 16px;
  color: #333;
  line-height: 16px;
}
.last-updated {
  padding: 20px 0 0 20%;
  font-size: 12px;
  color: #333;
}

@media screen and (max-width: 640px) {
  .page-title {
    font-size: 24px;
  }
  .sample-image-container {
    height: 200px;
  }
  .page-description {
    padding: 40px 2% 0 2%;
    width: auto;
  }
  .page-description .text {
    font-size: 16px;
  }
  .page-description .note {
    font-size: 12px;
  }
  .last-updated {
    padding: 20px 0 60px 2%;
  }
}
</style>
