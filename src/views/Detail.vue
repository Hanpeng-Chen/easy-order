<template>
  <div class="page">
    <!-- <img :src="data.imgUrl" class="detail-image" /> -->
    <van-image
      width="100%"
      height="250"
      fit="cover"
      :src="data.imgUrl"
    />

    <div class="menu-detail-wrapper">
      <span class="menu-name">{{data.name}}</span>

      <div class="menu-price-count">
        <span class="price">￥{{fen2yuan(menu.price)}}</span>
        <div class="stepper-wrap">
          <button :class="['stepper__button', 'stepper__minus', calcMenuItemSelectedCount(menu.id) > 0 ? '' : 'stepper__minus--disabled']" @click="clickMinus(menu)"></button>
          <span class="stepper__value">{{calcMenuItemSelectedCount(menu.id)}}</span>
          <button class="stepper__button stepper__plus" @click="clickPlus(menu)"></button>
        </div>
      </div>

      <span class="menu-remarks">{{data.remarks}}</span>
    </div>

    <div class="menu-extras-wrapper"></div>

    <van-submit-bar style="z-index: 2100;"
                    :price="calcTotalAmount"
                    button-text="下单"
                    @submit="onSubmit"
                    button-color="#409EFF">
      <van-icon
        name="shopping-cart"
        size="30"
        color="#409EFF"
        @click="showSelectedMenus = !showSelectedMenus"
        :badge="calcTotalCount"
        />
    </van-submit-bar>
  </div>
</template>

<script>
export default {
  data () {
    return {
      data: {
        id: 30001,
        name: '牛肉面',
        remarks: '每份都加葱和香菜',
        price: 500,
        count: 0,
        imgUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1599393686884&di=68be869a0b1012f559559c195dee192f&imgtype=0&src=http%3A%2F%2Fwww.537tuan.com%2Fwebedit_ok%2Fuploadfile%2F20141204150227512.jpg',
        specifications: [
          {
            type: 'radio',
            name: '面料',
            options: [
              {
                name: '手工面',
                extraPrice: 0,
                count: 0
              },
              {
                name: '刀削面',
                extraPrice: 100,
                count: 0
              }
            ]
          },
          {
            type: 'checkbox',
            name: '加料',
            options: [
              {
                name: '葱花',
                extraPrice: 1,
                count: 0
              },
              {
                name: '香菜',
                extraPrice: 1,
                count: 0
              },
              {
                name: '辣椒',
                extraPrice: 1,
                count: 0
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
                count: 0
              },
              {
                name: '牛肚',
                extraPrice: 200,
                count: 0
              },
              {
                name: '鱼丸',
                extraPrice: 150,
                count: 0
              },
              {
                name: '金针菇',
                extraPrice: 50,
                count: 0
              }
            ]
          }
        ]
      }
    }
  },

  mounted () {
    document.title = '详情'
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
.detail-image {
  width: 100%;
  height: 250px;
  object-fit: cover;
  border: 1px solid $secondLevelBorderColor;
}
.menu-detail-wrapper {
  background-color: #FFF;
  width: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
}
</style>
