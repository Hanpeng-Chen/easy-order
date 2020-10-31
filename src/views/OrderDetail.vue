<template>
  <div class="page">
    <div class="card-wrap">
      <span>取单编号</span>
      <span class="order-no">{{data.orderNo}}</span>
    </div>

    <div class="card-wrap">
      <span class="store-name">消费明细</span>
      <div class="border-bottom-line"></div>
      <div
        class="order-item-wrap"
        v-for="(item, menuIndex) in data.details"
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
        <span>下单时间：{{data.date}}</span>
        <span>合计：<span class="amount-value">￥{{calcTotalAmount}}</span></span>
      </div>
    </div>

    <div class="card-wrap remarks-wrap">
      <span>描述信息</span>
      <div class="border-bottom-line"></div>
      <span>{{data.remarks}}</span>
    </div>
  </div>
</template>

<script>
import utils from '../common/utils/index'
export default {
  data () {
    return {
      data: {
        orderNo: '0002',
        date: '2020-10-16 21:00:00',
        tableNo: 8,
        amount: 10,
        details: [
          {
            id: 10001,
            name: '芝士蒜香虾芝士蒜香虾',
            price: 1,
            count: 2
          },
          {
            id: 30001,
            name: '牛肉面',
            price: 500,
            count: 1,
            specifications: [
              {
                type: 'radio',
                name: '面料',
                options: [
                  {
                    name: '手工面',
                    extraPrice: 0,
                    count: 1
                  }
                ]
              },
              {
                type: 'multipleCheckbox',
                name: '加料',
                options: [
                  {
                    name: '青菜',
                    extraPrice: 100,
                    count: 1
                  },
                  {
                    name: '牛肚',
                    extraPrice: 200,
                    count: 1
                  }
                ]
              }
            ]
          }
        ],
        remarks: '描述信息测试数据'
      }
    }
  },
  computed: {
    calcTotalAmount () {
      let amount = 0
      if (!this.data.details) {
        return amount
      }
      for (let i = 0; i < this.data.details.length; i++) {
        const item = this.data.details[i]
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
    document.title = '订单详情'
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
.order-no {
  font-size: 24px;
  color: red;
}
.remarks-wrap {
  align-items: flex-start;
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
  justify-content: space-between;
  align-items: center;
  .amount-value {
    color: red;
  }
}

.store-name {
  text-align: left;
}
</style>
