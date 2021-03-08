
import Swap from './swap';
import Nb from './nb';
import Ds from './ds';
import Address from './address';
import Vote from './vote';
import Lab from './lab';
import ZN from './zn';
import dbArticle from './dbArticle';
import ArticleVote from './articleVote';
import Trading from './trading';
import DefiBox from './defiBox';
import NdxHome from './ndxHome';


// const req = require.context('./', false, /\.js$/);
// const requireAll = requireContext => requireContext.keys()
// requireAll(req)
// const re = /\.\/(.*)\.js/
// const names = requireAll(req).map(i => {
//   return i.match(re)[1]
// })

const lang = {
  'zh-CN': {
    ...Swap.zhCN,
    ...Nb.zhCN,
    ...Address.zhCN,
    ...Ds.zhCN,
    ...Vote.zhCN,
    ...Lab.zhCN,
    ...ZN.zhCN,
    ...dbArticle.zhCN,
    ...ArticleVote.zhCN,
    ...Trading.zhCN,
    ...DefiBox.zhCN,
    ...NdxHome.zhCN,
  },
  'zh-TW': {
    ...Swap.zhTW,
    ...Nb.zhTW,
    ...Address.zhTW,
    ...Ds.zhTW,
    ...Vote.zhTW,
    ...Lab.zhTW,
    ...ZN.zhTW,
    ...dbArticle.zhTW,
    ...ArticleVote.zhTW,
    ...Trading.zhTW,
    ...DefiBox.zhTW,
    ...NdxHome.zhTW,
  },
  en: {
    ...Swap.en,
    ...Nb.en,
    ...Address.en,
    ...Ds.en,
    ...Vote.en,
    ...Lab.en,
    ...ZN.en,
    ...dbArticle.en,
    ...ArticleVote.en,
    ...Trading.en,
    ...DefiBox.en,
    ...NdxHome.en,
  },
  ko: {
    ...Swap.ko,
    ...Nb.ko,
    ...Address.ko,
    ...Ds.ko,
    ...Vote.ko,
    ...Lab.ko,
    ...ZN.ko,
    ...dbArticle.ko,
    ...ArticleVote.ko,
    ...Trading.ko,
    ...DefiBox.ko,
    ...NdxHome.ko,
  }
};

export default {
  en: lang.en,
  zhCN: lang['zh-CN'],
  zhTW: lang['zh-TW'],
  ko: lang.ko
}
