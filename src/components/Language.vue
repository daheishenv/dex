<template>
  <div class="lang">
    <div class="btnDiv" @click="popupVisible = !popupVisible">
      <span class="iconfont icon-huaban24 languageIcon fl"></span>
      <!-- <span class="language fl" v-if="$route.name === 'down'">{{ handleLangName() }}</span> -->
      <!-- <span class="down fl"></span> -->
      <select id="lang" v-model="language" class="langSelect" ref="lang">
        <option v-for="(item, $index) in solts" :key="$index" :value="item.key">{{ item.name }}</option>
      </select>
    </div>
    <!-- <mt-popup
      class="popup"
      v-model="popupVisible"
      pop-transition="popup-fade"
      position="bottom">
      <div class="sureDiv">
        <span class="frBtn" @click="handleSureChangeLang">{{ $t('public.sure') }}</span>
      </div>
      <mt-picker class="picker" :slots="lang.list" valueKey="name" @change="onValuesChange" defaultIndex="1" v-if="popupVisible">
      </mt-picker>
    </mt-popup> -->
  </div>
</template>

<script>
// 按需引入部分组件


export default {
  data() {
    return {
      popupVisible: false,
      language: 'en',
      lang: {
        active: 'en',
        list: [
          {
            values: [
              {
                key: 'en',
                name: 'English'
              },
              {
                key: 'zh-CN',
                name: '简体',
              },
              {
                key: 'zh-TW',
                name: '繁體'
              },
              {
                key: 'ko',
                name: '한국어'
              }
            ],
            defaultIndex: 1,
            textAlign: 'center'
          }
        ]
      },
      solts: [
        {
          key: 'en',
          name: 'English'
        },
        {
          key: 'zh-CN',
          name: '简体中文',
        },
        {
          key: 'zh-TW',
          name: '繁體中文'
        },
        {
          key: 'ko',
          name: '한국어'
        }
      ],
      pickerItem: {
        picker: null,
        values: null,
      }
    };
  },
  watch: {
    language(newVal) {
      this.handleCheckLang(newVal);
    },
  },
  components: {
  },
  created() {
    this.language = this.$store.state.app.language;
    this.handleCheckLang(this.language);
  },
  mounted() {
  },
  methods: {
    // 确定选择语言
    handleSureChangeLang() {
      this.handleCheckLang(this.language);
      this.popupVisible = false;
    },
    // 语言切换
    onValuesChange(picker, values) {
      this.pickerItem.picker = picker;
      this.pickerItem.values = values;
      this.handleValuesSure();
    },
    handleValuesSure() {
      if (this.pickerItem.picker) {
        this.language = this.pickerItem.values[0].key;
      }
    },

    /*
    * 语言切换
    * 返回 lang
    */
    handleCheckLang(lang) {
      this.lang.active = lang;
      this.$i18n.locale = lang;
      this.$store.dispatch('setLanguage', lang);
    },

    /*
    * 返回 语言名称
    */
    handleLangName() {
      const langs = this.lang.list[0].values;
      const value = this.lang.active;
      return langs.find(v => v.key === value).name;
    },
  }
}
</script>

<style scoped lang="scss">
@import "../assets/css/public.scss";

.langSelect{
  width: 100%;
  font-size: .3rem;
  position: absolute;
  height: 100%;
  background: transparent;
  top: 0;
  left: 0px;
  opacity: 0;
  // border: 1px solid black;
}

.btnDiv{
  font-size: .21rem;
  // border: 1px solid #fafafa;
  height: .45rem;
  line-height: .45rem;
  border-radius: .12rem;
  font-weight: 300;
  overflow: hidden;
  z-index: 888;
  position: relative;

  .languageIcon{
    font-size: .4rem;
    color: #fff;
    margin-left: .10rem;
  }

  .down{
    display: inline-block;
    border: .07rem solid transparent;
    margin-top: .18rem;
    margin-left: .05rem;
    margin-right: .10rem;
    // border-top: .07rem solid #fff;
    border-top: .07rem solid #fff;
  }
}

.popup{
  max-width: 750px;
  width: 100%;
  color: $color-333;

  .sureDiv{
    height: .7rem;
  }

  .frBtn{
    height: .56rem;
    line-height: .56rem;
    position: absolute;
    right: .24rem;
    top: .24rem;
    font-size: .24rem;
    width: 1.28rem;
    color: $color-this;
    border: 1px solid $color-this;
    border-radius: .12rem;
    font-weight: 300;
    z-index: 8;
    text-align: center;
  }

  .frBtn:active{
    background: $color-this;
    color: white;
  }
}
</style>
