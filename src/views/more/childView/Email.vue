<template>
  <div class="emailOutDiv">
    <email-bind />
  </div>
</template>

<script>
import EmailBind from '../components/EmailBind';

export default {
  data() {
    return {
    }
  },
  components: {
    EmailBind, // 邮箱绑定
  }
}
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

.emailOutDiv{
  height: calc(100vh - 2rem);
  background: #FFF;
  padding: .44rem;
  padding-bottom: 0px;
}
</style>
