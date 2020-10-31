<template>
  <div class="page">
    <div class="main-content">
      <div class="card-wrap">
        <span>订单列表</span>
        <div class="border-bottom-line"></div>
        <div class="list-item-container" v-for="item in orderList" :key="item.id">
          <div class="list-item-body">
            <img :src="item.storeImg" alt="" class="store-img" />
            <div class="item-body-container">
              <div class="item-body-top-container">
                <div class="item-body-top-container__left">
                  <span class="store-name">{{item.storeName}}</span>
                  <span class="order-date">{{item.date}}</span>
                </div>
                <span class="order-status">{{item.status}}</span>
              </div>
            </div>
          </div>
          <div class="item-body-bottom-container">
            <span>共{{item.count}}件商品，实付<span class="price">￥{{item.amount}}</span></span>
          </div>
          <div class="border-bottom-line"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      orderList: [
        {
          id: 1,
          date: '2020-10-16 21:28:26',
          storeName: '分店1',
          storeImg: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3242545343,2771882576&fm=26&gp=0.jpg',
          status: '订单已完成',
          amount: 1,
          count: 1
        }
      ]
    }
  },
  mounted () {
    document.title = '历史订单'
  },
  methods: {}
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

.list-item-container {
  display: flex;
  flex-direction: column;
}
.list-item-body {
  display: flex;
}
.store-img {
  width: 50px;
}
.item-body-container {
  display: flex;
  flex-direction: columns;
  box-sizing: border-box;
  flex: 1;
  margin-left: 10px;
}
.item-body-top-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex: 1;
  .item-body-top-container__left {
    display: flex;
    flex-direction: column;
    .store-name {
      font-size: 16px;
      font-weight: bold;
      text-align: left;
    }
    .order-date {
      font-size: 14px;
      text-align: left;
      margin-top: 10px;
    }
  }
  .order-status {
    text-align: right;
  }
}
.item-body-bottom-container {
  display: flex;
  justify-content: flex-end;
  .price {
    color: red;
  }
}
</style>
