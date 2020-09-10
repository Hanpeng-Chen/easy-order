/**
 * Created by AI on 2017/4/21.
 */
import axios from 'axios'
import config from './common/config'
import constants from './common/constants'
import { Toast } from 'vant'
import indicator from './common/utils/indicator'

axios.defaults.baseURL = config.BASE_URL
axios.defaults.timeout = 10000
axios.interceptors.request.use(function (c) {
  indicator.open()
  return c
}, function (error) {
  return Promise.reject(error)
})

axios.interceptors.response.use(
  response => {
    indicator.close()
    let data = response.data
    if (data.code !== constants.SUCCESS_CODE) {
      if (response.config.hideToast === true) {
        console.log('')
      } else {
        Toast(data.errMsg)
      }
      return Promise.reject(data)
    }
    return data
  },
  error => {
    indicator.close()
    return Promise.reject(error.response.data)
  }
)

export default axios