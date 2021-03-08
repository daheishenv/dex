<template>
  <div class="articleApply flex-column">
    <img
      src="~@/assets/img/activity/dbArticle/left-1.png"
      style="width:2.48rem;height:1.4rem;position:absolute;left:0;top:0"
      alt
    />
    <img
      src="~@/assets/img/activity/dbArticle/right-1.png"
      style="width:1.37rem;height:1.4rem;position:absolute;right:0;top:0"
      alt
    />
    <img src="~@/assets/img/activity/dbArticle/top-border.png" class="top-border" alt />
    <div class="content">
      <!-- 标题 申请表单 -->
      <p class="title">— {{$t('dbArticle.BOX38')}} —</p>
      <!-- 作者名称 -->
      <div class="form-item">
        <div class="label">{{$t('dbArticle.BOX39')}}*</div>
        <input style="width:5.93rem" @blur="handBlur" v-model="form.author"  :placeholder="$t('dbArticle.BOX40')" />
      </div>
      <!-- 文章标题 -->
      <div class="form-item">
        <div class="label">{{$t('dbArticle.BOX41')}}*</div>
        <input style="width:5.93rem" @blur="handBlur" v-model="form.title" :placeholder="$t('dbArticle.BOX42')" />
      </div>
      <!-- 文章链接 -->
      <div class="form-item">
        <div class="label">
          {{$t('dbArticle.BOX43')}}*
          <span class="tips">（{{$t('dbArticle.BOX44')}}）</span>
        </div>
        <input
          :key="index"
          v-for="(item,index) in form.linkUrls"
          style="width:5.93rem"
          v-model="form.linkUrls[index]"
          :placeholder="$t('dbArticle.BOX45')"
          @blur="handBlur"
        />
        <div class="action">
          <span @click="add">{{$t('dbArticle.BOX46')}}</span>
          <span v-if="form.linkUrls.length>1">&nbsp;|&nbsp;</span>
          <span @click="remove" v-if="form.linkUrls.length>1">{{$t('dbArticle.BOX47')}}</span>
        </div>
      </div>
      <!-- EOS账户 -->
      <div class="form-item">
        <div class="label">{{$t('dbArticle.BOX48')}}*</div>
        <input @blur="handBlur" style="width:5.93rem" v-model="form.eosAccount" :placeholder="$t('dbArticle.BOX49')" />
      </div>
      <!-- 联系方式 -->
      <div class="form-item">
        <div class="label">
          {{$t('dbArticle.BOX50')}}*
          <span class="tips">{{$t('dbArticle.BOX55')}}</span>
        </div>
        <input @blur="handBlur" style="width:5.93rem" v-model="form.contact" :placeholder="$t('dbArticle.BOX51')" />
      </div>
      <!-- 提交按钮 -->
      <div v-if="canApply" class="submit" @click="submit">{{$t('dbArticle.BOX53')}}</div>
      <div v-else class="no-submit">{{$t('dbArticle.BOX53')}}</div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "articleApply",
  data() {
    return {
      form: {
        author: "", //作者名称
        title: "", //文章标题
        linkUrls: ["", ""], //文章链接
        eosAccount: "", //EOS账户
        contact: "", //联系方式
      },
    };
  },
  computed: {
    canApply() {
      // return true;
      const { author, title, linkUrls, eosAccount, contact } = this.form;
      if (author === "") {
        return false;
      } else if (title === "") {
        return false;
      } else if (linkUrls[0] === "") {
        return false;
      } else if (eosAccount === "") {
        return false;
      } else if (contact === "") {
        return false;
      }
      return true;
    },
  },
  methods: {
    handBlur(){
      this.form.author = this.form.author.trim()
         this.form.title=this.form.title.trim()
        this.form.linkUrls=this.form.linkUrls.map((item)=>{
          return item.trim()
        })
         this.form.eosAccount=this.form.eosAccount.trim()
         this.form.contact=this.form.contact.trim()
    },
    async handleGetAccount(eosAccount) {
      const chain = this.$store.state.app.trad.baseChain || 'eos';
      const net = this.$store.state.sys.nodeList[`${chain}Node`].httpEndpoint;
      const params = {
        account_name: eosAccount,
      };

      let result = "";
      try {
        result = await axios.post(
          `${net}/v1/chain/get_account`,
          JSON.stringify(params)
        );
      } catch (e) {
        result = e;
      }
      return result;
    },
    async submit() {
      const { author, title, linkUrls, eosAccount, contact } = this.form;
      // 判断文章URL是不是都填了
      const reg = /^[a-z1-5]{1,12}$/;
      if (author === "") {
        this.$toast({
          message: this.$t("dbArticle.BOX40"),
          position: "center",
          duration: 2000,
        });
        return;
      } else if (title === "") {
        this.$toast({
          message: this.$t("dbArticle.BOX42"),
          position: "center",
          duration: 2000,
        });
        return;
      } else if (linkUrls[0] === "") {
        this.$toast({
          message: this.$t("dbArticle.BOX45"),
          position: "center",
          duration: 2000,
        });
        return;
      } else if (eosAccount === "") {
        this.$toast({
          message: this.$t("dbArticle.BOX49"),
          position: "center",
          duration: 2000,
        });
        return;
      } else if (reg.test(eosAccount) === false) {
        this.$toast({
          message: this.$t("dbArticle.BOX63"),
          position: "center",
          duration: 2000,
        });
        return;
      } else if (contact === "") {
        this.$toast({
          message: this.$t("dbArticle.BOX51"),
          position: "center",
          duration: 2000,
        });
        return;
      }
      const result = await this.handleGetAccount(eosAccount);
      if (result.data) {
        let params = { ...this.form, linkUrls: this.form.linkUrls.join(",") };
        this.$http.post("/articleContest/submit", params).then((res) => {
          if (res.code === 0) {
            this.$toast({
              message: this.$t("dbArticle.BOX56"),
              position: "center",
              duration: 2000,
            });
            this.form = {
              author: "", //作者名称
              title: "", //文章标题
              linkUrls: new Array(this.form.linkUrls.length).fill(""), //文章链接
              eosAccount: "", //EOS账户
              contact: "", //联系方式
            };
          } else {
            this.$toast({
              message: this.$t("dbArticle.BOX57"),
              position: "center",
              duration: 2000,
            });
          }
        });
      } else {
        this.$toast({
          message: this.$t("dbArticle.BOX63"),
          position: "center",
          duration: 2000,
        });
      }
    },
    add() {
      this.form.linkUrls.push("");
    },
    remove() {
      const length = this.form.linkUrls.length;
      if (length === 1) {
        return;
      }
      this.form.linkUrls.splice(length - 1, 1);
    },
  },
};
</script>

<style lang="scss" scoped>
.articleApply {
  width: 100%;
  background: rgb(31, 32, 146);
  flex: 1;
  //   padding: 0.5rem;
  overflow-x: hidden;
  font-size: 0.24rem;
  overflow-y: auto;
  position: relative;
  height: 100vh;
  .content {
    z-index: 3;
    width: 6.8rem;
    background: #fff;
    border-radius: 0 0 0.15rem 0.15rem;
    margin-bottom: 0.8rem;
    .title {
      // font-weight: bold;
      line-height: 0.78rem;
      text-align: center;
      width: 5.96rem;
      height: 0.78rem;
      color: #6236ff;
      font-size: 0.32rem;
      background: rgb(242, 242, 255);
      margin: 0 auto;
      margin-top: 0.3rem;
      border-radius: 0.1rem;
    }
    .submit,
    .no-submit {
      width: 5.93rem;
      height: 0.82rem;
      background: #ff8800;
      margin: 0 auto;
      font-size: 0.28rem;
      line-height: 0.82rem;
      text-align: center;
      color: #fff;
      border-radius: 0.5rem;
      margin-top: 0.63rem;
      margin-bottom: 0.6rem;
    }
    .no-submit {
      background: #babcc6;
    }
  }
  .action {
    color: #6236ff;
    // line-height: .7rem;
    margin-top: 0.2rem;
    font-size: 0.28rem;
  }
  .top-border {
    width: 6.8rem;
    height: 0.54rem;
    z-index: 2;
    margin-top: 0.3rem;
  }
  .material {
    width: 100%;
  }
  .form-item {
    width: 100%;
    padding-left: 0.42rem;
    margin-top: 0.3rem;
    overflow: hidden;
    .label {
      color: #333333;
      font-size: 0.28rem;
      flex: 1;
      .tips {
        font-size: 0.24rem;
        color: #999999;
      }
    }
    input {
      color: #333;
      flex: 1;
      height: 0.73rem;
      font-size: 0.28rem;
      min-width: 0;
      border-bottom: 1px solid #babcc6;
    }
    input::-webkit-input-placeholder {
      color: #999999 !important;
      font-size: 0.28rem;
    }
    input::-moz-placeholder {
      color: #999999 !important;
      font-size: 0.28rem;
    }
    input:-ms-input-placeholder {
      color: #999999 !important;
      font-size: 0.28rem;
    }
  }
}
</style>
