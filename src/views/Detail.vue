<template>
  <div class="page">
    <div class="content-wrapper">
      <van-image
        width="100%"
        height="250"
        fit="cover"
        :src="data.imgUrl"
      />

      <div class="menu-detail-wrapper">
        <span class="menu-name">{{data.name}}</span>

        <div class="menu-price-count">
          <span class="price">￥{{fen2yuan(data.price)}}</span>
          <stepper :value="calcMenuItemSelectedCount(data.id)"
                  :disableMinus="calcMenuItemSelectedCount(data.id) === 0"
                  @plus="clickPlus(data)"
                  @minus="clickMinus(data)">
          </stepper>
        </div>

        <span class="menu-remarks">{{data.remarks}}</span>
      </div>

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

    <div class="menu-extras-wrapper"></div>
  </div>
</template>

<script>
import utils from '../common/utils'
import Stepper from '../components/Stepper.vue'

export default {
  components: {
    Stepper
  },
  data () {
    return {
      showSelectedMenus: false,
      selectedMenus: [],
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
  computed: {
    calcTotalCount () {
      let count = 0
      for (let i = 0; i < this.selectedMenus.length; i++) {
        const item = this.selectedMenus[i]
        count += item.count || 0
      }
      return count === 0 ? '' : count
    },
    calcTotalAmount () {
      let amount = 0
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
      return amount
    }
  },

  mounted () {
    document.title = '详情'
  },
  methods: {
    fen2yuan: utils.fen2yuan,
    onSubmit () {
      this.$router.push({
        path: 'confirmOrder'
      })
    },
    calcMenuItemSelectedCount (id) {
      for (let i = 0; i < this.selectedMenus.length; i++) {
        const item = this.selectedMenus[i]
        if (id === item.id) {
          return item.count
        }
      }
      return 0
    },
    // 点击添加按钮
    clickPlus (menuItem) {
      if (menuItem.specifications && menuItem.specifications.length > 0) {
        this.dialogData = JSON.parse(JSON.stringify(menuItem))
        this.showSelectMenuDialog = true
      } else {
        // 没有其他附加选项
        let isIn = false
        for (let i = 0; i < this.selectedMenus.length; i++) {
          if (menuItem.id === this.selectedMenus[i].id) {
            this.selectedMenus[i].count++
            isIn = true
            break
          }
        }
        if (!isIn) {
          const item = JSON.parse(JSON.stringify(menuItem))
          item.count++
          this.selectedMenus.push(item)
        }
      }
    },
    // 点击减少按钮
    clickMinus (menu) {
      if (this.calcMenuItemSelectedCount(menu.id) === 0) {
        return
      }
      if (!menu.specifications || menu.specifications.length === 0) {
        for (let i = 0; i < this.selectedMenus.length; i++) {
          if (menu.id === this.selectedMenus[i].id) {
            this.selectedMenus[i].count--
            if (this.selectedMenus[i].count === 0) {
              this.selectedMenus.splice(i, 1)
            }
            break
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  height: 100vh;
  // position: relative;
  background-color: $pageGreyBackgroundColor;
  color: $regularTextColor;
  font-size: 15px;
}
.content-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  // position: relative;
}
.detail-image {
  width: 100%;
  height: 250px;
  object-fit: cover;
  border: 1px solid $secondLevelBorderColor;
}
.menu-detail-wrapper {
  background-color: #FFF;
  padding: 10px;
  display: flex;
  flex-direction: column;
  .menu-name {
    font-size: 16px;
    font-weight: bold;
    text-align: left;
  }
  .menu-remarks {
    text-align: left;
  }
}
.menu-price-count {
  display: inline-flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.price {
  color: red;
}
</style>
