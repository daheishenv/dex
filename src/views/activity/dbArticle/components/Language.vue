<template>
  <!-- 父级元素要设置position:relative -->
  <div class="language">
    <select id="lang" v-model="language" class="langSelect" ref="lang">
      <option v-for="(item, $index) in solts" :key="$index" :value="item.key">
        {{
        item.name
        }}
      </option>
    </select>
    <img src="~@/assets/img/activity/twoAnniversary/lang.png" class="lang" />
  </div>
</template>

<script>
export default {
  name: "language",
  components: {},
  data() {
    return {
      solts: [
        {
          key: "en",
          name: "English",
        },
        {
          key: "zh-CN",
          name: "简体中文",
        },
        {
          key: "zh-TW",
          name: "繁體中文",
        },
        {
          key: "ko",
          name: "한국어",
        },
      ],
      language: "",
    };
  },
  watch: {
    language(newVal) {
      this.handleCheckLang(newVal);
    },
  },
  methods: {
    handleCheckLang(lang) {
      this.language = lang;
      this.$i18n.locale = lang;
      this.$store.dispatch("setLanguage", lang);
    },
  },
};
</script>


<style lang="scss" scoped>
.language {
  position: absolute;
  width: 0.5rem;
  height: 0.5rem;
  right: 0.2rem;
  top: 0.3rem;
  .langSelect {
    z-index: 8;
    opacity: 0;
    position: absolute;
  }
  .lang {
    width: 100%;
    z-index: 4;
    pointer-events: none;
    position: absolute;
  }
}
</style>