import Vue from 'vue';
import { Toast } from 'mint-ui';
import moment from 'moment';
import VueClipboard from 'vue-clipboard2';
import 'mint-ui/lib/style.css'
import https from '@/utils/axios';
import appName from '@/utils/environments';
import { dealHost, GetUrlPara } from '@/utils/public';
import router from './router';
import './assets/css/public.scss';
import pdf from './components/pdf';
import store from './store';
import i18n from './utils/lang';
import App from './App';

Vue.use(VueClipboard);
Vue.use(pdf)

// 国际化 - 语言
Vue.use(i18n);

Vue.prototype.$appName = appName;
Vue.prototype.$toast = Toast;
Vue.config.productionTip = false;
Vue.prototype.$http = https;

// 测试环境判断
Vue.prototype.$evn = dealHost();
Vue.prototype.$embed = false;
if (GetUrlPara().embed) {
  Vue.prototype.$embed = true;
  Vue.prototype.$fchannel = GetUrlPara().fchannel || 'scatter';
}

Vue.directive('Int', {
  bind(el) {
    const input = el.getElementsByTagName('input')[0];
    if (!input) return;
    input.onkeyup = (() => {
      if (input.value.length === 1) {
        input.value = input.value.replace(/[^1-9]/g, '')
      } else {
        input.value = input.value.replace(/[^\d]/g, '')
      }
      const e = document.createEvent('HTMLEvents')
      e.initEvent('input', true, true)
      input.dispatchEvent(e)
    })
    input.onblur = (() => {
      if (input.value.length === 1) {
        input.value = input.value.replace(/[^1-9]/g, '')
      } else {
        input.value = input.value.replace(/[^\d]/g, '')
      }
      const e = document.createEvent('HTMLEvents')
      e.initEvent('input', true, true)
      input.dispatchEvent(e)
    })
  }
});


// unix 时间戳、 utc Data类型
Vue.filter('dateFormat', value => moment.utc(value).format('YYYY-MM-DD'));
Vue.filter('dateFormatAll', value => moment.utc(value).format('YYYY-MM-DD HH:mm:ss'));
Vue.filter('dateFormatBIH', value => moment(value).format('YYYY-MM-DD HH:mm:ss'));
Vue.filter('dateFormatYMDF', value => moment(value).format('YYYY-MM-DD HH:mm'));

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App),
});
