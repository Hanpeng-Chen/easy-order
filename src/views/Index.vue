<template>
  <div class="main-page">
    <div class="icon_container">
      <div class="button-box" @click="go2Order('0')">
        <img src="../assets/waimai.png" />
        <span>打包外带</span>
      </div>
      <div class="button-box" @click="go2Order('1')">
        <img src="../assets/tangshi.png" />
        <span>现场点单</span>
      </div>
    </div>
    <span class="order-list" @click="go2OrderList">历史订单</span>
  </div>
</template>

<script>
import config from '../common/config'
export default {
  data () {
    return {}
  },
  mounted () {
    const state = this.$route.query.state
    if (state) {
      const aliPayAuthCode = this.$route.query.auth_code
      const wxCode = this.$route.query.code
      if (state === 'alipay' && aliPayAuthCode) {
        // 支付宝授权成功回调，获取到auth_code
        // 调用后端接口，利用auth_code获取用户userId
      }
      if (state === 'wx' && wxCode) {
        // 调用后端接口获取微信用户openid
      }
    } else {
      const ua = navigator.userAgent
      const isWeixin = /(micromessenger)/ig.test(ua)
      const isAliPay = /(alipayclient)/ig.test(ua)
      if (isWeixin) {
        // 微信公众号APPID
        const encodeRedireCtUrl = encodeURIComponent('http://192.168.0.114:8080/#/') // 授权回调地址
        const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${config.WX_APP_ID}&redirect_uri=${encodeRedireCtUrl}&response_type=code&scope=snsapi_base&state=wx#wechat_redirect`
        window.location.replace(url)
      } else if (isAliPay) {
        // 支付宝授权跳转，需支付宝开放平台创建应用
        const encodeRedireCtUrl = encodeURIComponent('http://192.168.0.114:8080/#/') // 授权回调地址
        const url = `https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=${config.ALIPAY_APP_ID}&scope=auth_base&redirect_uri=${encodeRedireCtUrl}&state=alipay`
        window.locationl.replace(url)
      }
    }
  },
  methods: {
    go2Order (type) {
      this.$router.push({
        path: '/home',
        query: {
          type: type
        }
      })
    },
    go2OrderList () {
      this.$router.push('/orderList')
    }
  }
}
</script>

<style lang="scss" scoped>
.main-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.icon_container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.button-box {
  height: 100px;
  width: 100px;
  border: 2px solid #409EFF;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgb(121, 187, 255);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  margin: 0 20px;

  img {
    width: 40px;
  }
}
.order-list {
  margin-top: 20px;
}
</style>
