/* BTC地址的校验规则
  1、3开头的比特币地址，长度为34位。
  2、1开头的比特币地址，长度为26位到34位否转换成功
*/
export function validateBTC(str) {
  // eslint-disable-next-line no-useless-escape
  const reg = /^(1[a-z1-9]{25,33}|3[a-z1-9]{33})$/i;
  return reg.test(str)
}
/* ETH地址的校验规则
  1、判断地址非空和是否0x开头
  2、把16进制字符串转成10进制数，看是否能否转换成功
  3、判断是否长度是40位（去掉0x）
*/
export function validateETH(str) {
  const reg = /^0x[a-f0-9]{40}$/i;
  return reg.test(str)
}
/* TRON地址的校验规则
*/
export function validateTRON(str) {
  // eslint-disable-next-line no-useless-escape
  const reg = /^T[a-z0-9]{33}$/i;
  return reg.test(str)
}