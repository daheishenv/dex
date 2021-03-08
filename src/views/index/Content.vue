<template>
  <div class="content">
    <!-- 流通情况 -->
    <Circulation v-if="tron"/>
    <!-- 会员权益 -->
    <Member />
    <!-- Newdex seed基金 -->
    <Fund></Fund>
    <!-- 发展历程 -->
    <Evolution></Evolution>
    <!-- 我们的优势 -->
    <AdvantagePage></AdvantagePage>
  </div>
</template>

<script>
import Fund from '@/views/index/components/Fund';
import AdvantagePage from '@/views/index/components/AdvantagePage';
import Evolution from '@/views/index/components/Evolution';
import Member from '@/views/index/components/Member';
import Circulation from '@/views/index/components/Circulation';
import appName from '@/utils/environments';

export default {
  name: 'content', // 首页
  data() {
    return {
      tron: true
    }
  },
  components: {
    Fund,
    AdvantagePage,
    Evolution,
    Member,
    Circulation,
  },
  props: ['loadedPage'],
  watch: {},
  computed: {},
  created() {
    if (appName === 'tronNewdex') {
       this.tron = false
    }
  },
  mounted() {},
  beforeDestroy() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.content {
  padding-top: 0 !important;
  margin-top: .15rem;
  background: #f3f3f3 !important;
}
</style>
