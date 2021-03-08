// dev / prod
const env = process.env.NODE_ENV;
let environments = 'eosNewdex';
const host = window.location.host;
switch (env) {
  case 'tron':
    environments = 'tronNewdex';
    break;
  case 'test':
  case 'development':
    environments = 'eosNewdex';
    break;
  default:
    environments = 'eosNewdex';
    if (host.indexOf('tron.') !== -1) {
      environments = 'tronNewdex';
    }
    break;
}
const envi = environments;

export default envi;
