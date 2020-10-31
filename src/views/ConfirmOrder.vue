<template>
  <div class="page">
    <div class="main-content" id="mainContent">
      <div class="card-wrap">
        <span class="store-name">{{storeName}}</span>
        <div class="border-bottom-line"></div>
        <span class="table-no">{{tableNo}}号桌</span>
      </div>

      <div class="card-wrap">
        <span class="store-name">订单明细</span>
        <div class="border-bottom-line"></div>
        <div
          class="order-item-wrap"
          v-for="(item, menuIndex) in selectedMenus"
          :key="menuIndex">
          <div class="order-item-info-wrap">
            <div class="order-item-info-left">
              <span class="order-item-name">{{item.name}}</span>
              <span class="order-item-count">{{item.count}}份</span>
            </div>
            <div class="order-item-info-right">
              <span>￥{{calcItemPrice(item)}}</span>
            </div>
          </div>
          <div class="order-item-label-wrap" v-if="item.specifications && item.specifications.length > 0">
            <span class="order-item-label-value"
                  v-for="(label, index) in calcLabels(item.specifications)"
                  :key="index">
              {{label}}
            </span>
          </div>
        </div>
        <div class="border-bottom-line"></div>
        <div class="amount-wrap">
          合计：<span class="amount-value">￥{{calcTotalAmount}}</span>
        </div>
      </div>

      <div class="card-wrap remarks-wrap">
        <van-field
          v-model="remarks"
          rows="4"
          autosize
          type="textarea"
          placeholder="追加描述信息"
          @blur="temporaryRepair"
        />
      </div>
    </div>
    <div class="button-wrap" @click="go2Pay">支付 ￥{{calcTotalAmount}}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import utils from '../common/utils'
export default {
  data () {
    return {
      storeName: 'Easy Order',
      tableNo: '1',
      remarks: ''
    }
  },
  computed: {
    ...mapGetters([
      'selectedMenus'
    ]),
    calcTotalAmount () {
      let amount = 0
      if (!this.selectedMenus) {
        return amount
      }
      for (let i = 0; i < this.selectedMenus.length; i++) {
        const item = this.selectedMenus[i]
        if (item.specifications && item.specifications.length > 0) {
          let price = item.price
          item.specifications.forEach(spec => {
            if (spec.options && spec.options.length > 0) {
              spec.options.forEach(option => {
                price += option.extraPrice * option.count
              })
            }
          })
          amount += item.count * price
        } else {
          amount += item.price * item.count
        }
      }
      return utils.fen2yuan(amount)
    }
  },
  mounted () {
    document.title = '确认订单'
  },
  methods: {
    fen2yuan: utils.fen2yuan,
    calcLabels (data) {
      if (!data) {
        return []
      }
      const list = []
      data.forEach(item => {
        item.options.forEach(option => {
          if (item.type === 'multipleCheckbox') {
            list.push(`${option.name} x ${option.count}`)
          } else {
            list.push(option.name)
          }
        })
      })
      return list
    },
    calcItemPrice (item) {
      let price = item.price
      if (item.specifications) {
        for (const i in item.specifications) {
          const specItem = item.specifications[i]
          if (specItem.options) {
            for (const j in specItem.options) {
              price += specItem.options[j].count * specItem.options[j].extraPrice
            }
          }
        }
      }
      price = price * item.count
      return utils.fen2yuan(price)
    },
    // 解决微信端页面被顶起问题
    temporaryRepair () {
      const el = document.getElementById('mainContent')
      el.scrollTop = 0
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
    },
    go2Pay () {
      const ua = navigator.userAgent
      const isWeixin = /(micromessenger)/ig.test(ua)
      const isAliPay = /(alipayclient)/ig.test(ua)
      if (isWeixin) {
        alert('调起微信支付')
      } else if (isAliPay) {
        alert('在支付宝应用中，支付宝支付')
      } else {
        alert('外部浏览器,调用支付宝')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: $pageGreyBackgroundColor;
  color: $regularTextColor;
  font-size: 15px;
}
.main-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
}
.card-wrap {
  margin: 5px 10px 0 10px;
  padding: 10px;
  background-color: #FFF;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
.store-name, .table-no {
  text-align: left;
}

.remarks-wrap {
  margin-bottom: 70px;
  /deep/ .van-cell {
    padding: 0;
  }
}

.order-item-wrap {
  display: flex;
  flex-direction: column;
  margin: 5px 0;
  .order-item-info-wrap {
    display: flex;
    flex-direction: row;
    .order-item-info-left {
      flex: 2;
      display: flex;
      justify-content: space-between;
      .order-item-name {
        text-align: left;
      }
      .order-item-count {
        text-align: right;
        min-width: 50px;
      }
    }
    .order-item-info-right {
      flex: 1;
      justify-content: flex-end;
      text-align: right;
    }
  }

  .order-item-label-wrap {
    flex: 1;
    display: flex;
    flex-wrap: wrap;

    .order-item-label-value {
      color: $secondaryTextColor;
      line-height: 20px;
      border: 1px solid $placeholderTextColor;
      padding: 0 3px;
      margin-right: 5px;
      margin-bottom: 5px;
    }
  }
}

.amount-wrap {
  display: flex;
  justify-content: flex-end;
  text-align: right;
  .amount-value {
    color: red;
  }
}

.button-wrap {
  position: fixed;
  bottom: 20px;
  left: 20%;
  right: 20%;
  height: 40px;
  width: 60%;
  border-radius: 20px;
  background-color: $themeColor;

  font-size: 15px;
  line-height: 40px;
  color: #FFF
}
</style>
