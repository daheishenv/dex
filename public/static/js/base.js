var host = window.location.host;
var hostName = window.location.hostname;
localStorage.setItem('channelRef', 'dapp'); // 本地切换h5 | dapp版本
const dappArr = [
  'dapp.newdex.io',
  'dapp.newdex.vip',
  'newdex.340wan.com',
  'tron.340wan.com',
  'dapp.eos.newdex.io',
  'dapp.tron.newdex.io',
];
const h5Arr = [
  'm.newdex.io',
  'm.newdex.vip',
  'm.eos.newdex.io',
  'm.eos.newdex.vip',
  'm.tron.newdex.io',
  'm.tron.newdex.vip',
];
if (dappArr.findIndex((item) => item === host) !== -1) {
  localStorage.setItem('channelRef', 'dapp');
} else if (h5Arr.findIndex((item) => item === host) !== -1) {
  localStorage.setItem('channelRef', 'h5');
}

function resize() {
  let width = screen.width > 750 ? '50px' : screen.width / 750 * 100 + 'px';
  const params = getUrlParams(window.location.href);
  if (params.source === 'web') {
    width = '80px';
  }
  document.getElementsByTagName('html')[0].style.fontSize = width;
}
window.onresize = resize;
resize();

function getUrlParams(url) {
  const params = {};
  url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (str, key, value) {
    params[key] = value;
  });
  return params;
}