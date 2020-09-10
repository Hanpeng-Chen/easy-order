const DEV_URL = location.protocol + '//' + location.host
const PRO_URL = location.protocol + '//' + location.host + '/'

let baseUrl = process.env.NODE_ENV === 'production' ? PRO_URL : DEV_URL

module.exports = {
  BASE_URL: baseUrl // 接口url前缀
}
