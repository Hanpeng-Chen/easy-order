<template>
  <div class="home">
    <van-loading type="spinner" class="loading-wrap" size="60px" color="#1989fa" v-if="showLoading" />
    <div v-else class="home-main-wrap">
      <div class="nav-wrap">
        <img src="../assets/logo.png">
        <div class="info-wrap">
          <span class="store-name">{{storeName}}</span>
          <span class="table-no">{{tableNo}}号桌</span>
        </div>
      </div>

      <div class="content-wrap">
        <van-sidebar v-model="activeKey" @change="sideBarChange">
          <van-sidebar-item
            v-for="(item, index) in menus"
            :key="index"
            :title="item.categoryName"
            :badge="calcSideBarBadge(item.subMenus)" />
        </van-sidebar>

        <div class="content-list-wrap">
          <div v-for="menu in showSubMenus" :key="menu.id" class="content-item-wrap" @click="go2Detail(menu.id)">
            <img :src="menu.imgUrl">
            <div class="content-item-desc">
              <span class="menu-name">{{menu.name}}</span>
              <div class="menu-price-count">
                <span class="price">￥{{fen2yuan(menu.price)}}</span>
                <stepper :value="calcMenuItemSelectedCount(menu.id)"
                         :disableMinus="calcMenuItemSelectedCount(menu.id) === 0"
                         @plus="clickPlus(menu)"
                         @minus="clickMinus(menu)">
                </stepper>
              </div>
            </div>
          </div>
        </div>

        <shopping-cart-popup :show="showSelectedMenus"
                             :data="selectedMenus">
        </shopping-cart-popup>
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

    <select-menu-dialog :show="showSelectMenuDialog"
                        :data="dialogData">
    </select-menu-dialog>
  </div>
</template>

<script>
// @ is an alias to /src
import utils from '@/common/utils'
import Stepper from '../components/Stepper.vue'
import SelectMenuDialog from '../components/SelectMenuDialog.vue'
import ShoppingCartPopup from '../components/ShoppingCartPopup.vue'

export default {
  name: 'Home',
  components: {
    Stepper,
    SelectMenuDialog,
    ShoppingCartPopup
  },
  data () {
    return {
      storeName: 'Easy Order',
      tableNo: '',
      showLoading: true,
      activeKey: 0,
      showSelectMenuDialog: false,
      dialogData: {},
      showSubMenus: [],
      selectedMenus: [],
      menus: [
        {
          categoryId: 1,
          categoryName: '热销菜',
          subMenus: [
            {
              id: 10001,
              name: '芝士蒜香虾芝士蒜香虾',
              price: 1,
              count: 0,
              imgUrl: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2709063983,4018642136&fm=26&gp=0.jpg'
            },
            {
              id: 10002,
              name: '上汤皇帝菜',
              price: 2,
              count: 0,
              imgUrl: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1776780749,3818322236&fm=26&gp=0.jpg'
            }
          ]
        },
        {
          categoryId: 2,
          categoryName: '汤品',
          subMenus: [
            {
              id: 20001,
              name: '紫菜蛋花汤',
              price: 100,
              count: 0,
              imgUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1599393686884&di=68be869a0b1012f559559c195dee192f&imgtype=0&src=http%3A%2F%2Fwww.537tuan.com%2Fwebedit_ok%2Fuploadfile%2F20141204150227512.jpg',
              specifications: [
                {
                  type: 'radio',
                  name: '规格',
                  options: [
                    {
                      name: '小份',
                      extraPrice: 0,
                      count: 0
                    },
                    {
                      name: '大份',
                      extraPrice: 100,
                      count: 0
                    }
                  ]
                }
              ] // 规格
            },
            {
              id: 20002,
              name: '玉米排骨汤',
              price: 200,
              count: 0,
              imgUrl: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1771940567,1747975133&fm=26&gp=0.jpg',
              specifications: []
            }
          ]
        },
        {
          categoryId: 3,
          categoryName: '面食',
          subMenus: [
            {
              id: 30001,
              name: '牛肉面',
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
          ]
        }
      ],
      showSelectedMenus: false
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
    document.title = '开始下单'
    this.tableNo = this.$route.query.tableNo || '1'
    setTimeout(() => {
      this.showSubMenus = this.menus[0].subMenus
      this.showLoading = false
    }, 500)
  },
  methods: {
    fen2yuan: utils.fen2yuan,
    calcSideBarBadge (subMenus) {
      const ids = []
      subMenus.forEach(item => {
        ids.push(item.id)
      })
      let count = 0
      for (let i = 0; i < this.selectedMenus.length; i++) {
        if (ids.indexOf(this.selectedMenus[i].id) > -1) {
          count += this.selectedMenus[i].count || 0
        }
      }
      return count === 0 ? '' : count
    },
    calcDialogSelectedPrice () {
      let price = this.dialogData.price
      if (this.dialogData.specifications) {
        this.dialogData.specifications.forEach(item => {
          item.options.forEach(o => {
            price += o.extraPrice * (o.count || 0)
          })
        })
      }
      return utils.fen2yuan(price)
    },
    sideBarChange (index) {
      this.showSubMenus = this.menus[index].subMenus
    },
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
    },
    closeDialog () {
      this.showSelectMenuDialog = false
      this.dialogData = {}
    },
    confirmSelect () {
      this.dialogData.count = 1
      const newSpecifications = []
      this.dialogData.specifications.forEach(spec => {
        const newOptions = []
        spec.options.forEach(item => {
          if (item.count > 0) {
            newOptions.push(item)
          }
        })
        if (newOptions.length > 0) {
          spec.options = newOptions
          newSpecifications.push(spec)
        }
      })
      this.dialogData.specifications = newSpecifications
      this.selectedMenus.push(this.dialogData)
      this.showSelectMenuDialog = false
      this.dialogData = {}
    },
    // 点击单选label
    clickLabel (specification, index) {
      if (specification.type === 'radio') {
        for (let i = 0; i < specification.options.length; i++) {
          if (i === index) {
            specification.options[i].count = 1
          } else {
            specification.options[i].count = 0
          }
        }
      }
      if (specification.type === 'checkbox') {
        if (specification.options[index].count === 0) {
          specification.options[index].count = 1
        } else {
          specification.options[index].count = 0
        }
      }
      if (specification.type === 'multipleCheckbox') {
        specification.options[index].count++
      }
    },
    resetMultiCheckBoxItem (item) {
      item.count = 0
    },
    clearSelectedMenus () {
      this.selectedMenus = []
      this.showSelectedMenus = false
    },
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
    go2Detail (id) {
      this.$router.push({
        path: '/detail',
        query: {
          id: id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  height: 100vh;
  position: relative;
}
.loading-wrap {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -30px;
  margin-left: -30px;
}
.home-main-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  position: relative;
}
.nav-wrap {
  height: 60px;
  background: $themeColor;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 15px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;

  img {
    width: 40px;
    height: 40px;
    object-fit: cover;
  }

  .info-wrap {
    display: flex;
    flex-direction: column;
    margin-left: 15px;
    .store-name {
      font-size: 15px;
      font-weight: 500;
      color: #FFF;
      text-align: left;
    }
    .table-no {
      font-size: 16px;
      font-weight: 700;
      color: #FFF;
      text-decoration: underline;
      margin-top: 5px;
      text-align: left;
    }
  }
}
.content-wrap {
  background: #FFF;
  display: flex;
  flex-direction: row;
  position: absolute;
  top: 60px;
  bottom: 50px;
  left: 0;
  right: 0;

  /deep/ .van-sidebar-item--select::before {
    background-color: $themeColor;
  }

  /deep/ .van-popup--bottom {
    bottom: 50px;
  }
}
.content-list-wrap {
  flex: 1;
  padding: 10px;
}
.content-item-wrap {
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
  img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 5px;
  }

  .content-item-desc {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 5px;

    .menu-name {
      font-size: 16px;
      font-weight: bold;
      text-align: left;
    }
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
