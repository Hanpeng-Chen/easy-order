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
          <div v-for="menu in showSubMenus" :key="menu.id" class="content-item-wrap">
            <img :src="menu.imgUrl">
            <div class="content-item-desc">
              <span class="menu-name">{{menu.name}}</span>
              <div class="menu-price-count">
                <span class="price">￥{{fen2yuan(menu.price)}}</span>
                <div class="stepper-wrap">
                  <button :class="['stepper__button', 'stepper__minus', calcMenuItemSelectedCount(menu.id) > 0 ? '' : 'stepper__minus--disabled']" @click="clickMinus(menu)"></button>
                  <span class="stepper__value">{{calcMenuItemSelectedCount(menu.id)}}</span>
                  <button class="stepper__button stepper__plus" @click="clickPlus(menu)"></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <van-action-sheet v-model="showSelectedMenus">
          <div class="action-sheet-wrap">
            <div class="action-sheet-header-wrap">
              <div class="delete-icon-wrap" @click="clearSelectedMenus">
                <van-icon name="delete" size="14"></van-icon>
                <span>清空购物车</span>
              </div>
            </div>
            <div class="action-sheet-list-wrap">
              <div v-for="(item, index) in selectedMenus" :key="index" class="action-sheet-list-item-wrap">
                <img :src="item.imgUrl" />
                <div class="list-item-content-wrap">
                  <div class="list-item-content-top">
                    <div class="name">{{item.name}}{{item.name}}</div>
                    <div class="label-wrap">
                      <div v-for="(label, index) in calcLabels(item.specifications)"
                          :key="index">
                        <span class="label-value">
                          {{label}}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="menu-price-count">
                    <span class="price">￥{{fen2yuan(item.price)}}</span>
                    <div class="stepper-wrap">
                      <button :class="['stepper__button', 'stepper__minus', calcMenuItemSelectedCount(item.id) > 0 ? '' : 'stepper__minus--disabled']" @click="clickMinus(item)"></button>
                      <span class="stepper__value">{{calcMenuItemSelectedCount(item.id)}}</span>
                      <button class="stepper__button stepper__plus" @click="clickPlus(item)"></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </van-action-sheet>
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

    <van-dialog v-model="showSelectMenuDialog" :showConfirmButton="false">
      <div class="dialog-content">
        <van-icon class="close-icon"
                  name="close"
                  size="25"
                  color="#409EFF"
                  @click="closeDialog">
        </van-icon>
        <span class="dialog-title">{{dialogData.name}}</span>
        <div v-for="(item, index) in dialogData.specifications"
             :key="index"
             class="label-wrap">
          <div class="label-title">{{item.name}}</div>
          <div class="label-group" v-if="item.type === 'radio'">
            <div v-for="(option, index) in item.options"
                :key="option.name"
                @click="clickLabel(item, index)">
              <span :class="[option.count === 1 ? 'radio-label-item__active' : 'radio-label-item']">{{option.name}}</span>
            </div>
          </div>
          <div class="label-group" v-if="item.type === 'checkbox'">
            <div v-for="(option, index) in item.options"
                :key="option.name"
                @click="clickLabel(item, index)">
              <span :class="[option.count === 1 ? 'radio-label-item__active' : 'radio-label-item']">{{option.name}}</span>
            </div>
          </div>
          <div class="label-group" v-if="item.type === 'multipleCheckbox'">
            <div v-for="(option, index) in item.options"
                :key="option.name">
              <span :class="[option.count > 0 ? 'radio-label-item__active' : 'radio-label-item']"
                    @click="clickLabel(item, index)">
                {{option.name}}{{option.count > 0 ? ' x ' + option.count : ''}}
              </span>
              <van-icon v-if="option.count > 0" @click="resetMultiCheckBoxItem(option)" name="close" color="#409EFF" class="label-close" />
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <span class="dialog-footer__price">￥{{calcDialogSelectedPrice()}}</span>
          <van-button type="info" class="dialog-footer__button" round size="mini" @click="confirmSelect">选定</van-button>
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script>
// @ is an alias to /src
import utils from '@/common/utils'

export default {
  name: 'Home',
  components: {
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

.stepper-wrap {
  display: inline-flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  .stepper__button {
    width: 18px;
    height: 18px;
    border-radius: 100%;
    position: relative;
    box-sizing: border-box;
    cursor: pointer;
  }
  .stepper__minus {
    color: $themeColor;
    border: 1px solid $themeColor;
    background-color: #FFF;
  }
  .stepper__minus--disabled {
    opacity: .3;
  }
  .stepper__plus {
    color: #FFF;
    background-color: $themeColor;
    border: 0;
  }
  .stepper__minus::before, .stepper__plus::after {
    position: absolute;
    top: 50%;
    left: 50%;
    background-color: currentColor;
    -webkit-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);
    content: '';
    width: 50%;
    height: 1px;
  }
  .stepper__plus::before {
    position: absolute;
    top: 50%;
    left: 50%;
    background-color: currentColor;
    -webkit-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);
    content: '';
    height: 50%;
    width: 1px;
  }
  .stepper__value {
    font-size: 14px;
    width: 32px;
    margin: 0 2px;
    border: none;
    text-align: center;
  }
}

.dialog-content {
  padding: 15px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  .close-icon {
    position: absolute;
    top: 10px;
    right: 10px;
  }
  .dialog-title {
    font-weight: bold;
    line-height: 30px;
  }

  .dialog-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    width: 100%;
    .dialog-footer__price {
      color: red;
    }
    .dialog-footer__button {
      padding-left: 10px;
      padding-right: 10px;
      font-size: 13px;
    }
  }
  .label-wrap {
    margin-top: 10px;
    .label-title {
      font-weight: 500;
      text-align: left;
    }
    .label-group {
      margin: 5px 0;
      display: flex;
      flex-direction: row;
      justify-self: start;
      align-items: center;
      flex-wrap: wrap;
      line-height: 30px;
      .radio-label-item {
        border: 1px solid $themeColor;
        color: $themeColor;
        padding: 2px 5px;
        margin-top: 2px;
        margin-right: 5px;
      }
      .radio-label-item__active {
        border: none;
        color: #FFF;
        background-color: $themeColor;
        padding: 2px 5px;
        margin-top: 2px;
        margin-right: 5px;
      }
      .label-close {
        margin-right: 8px;
        padding-top: 2px;
      }
    }
  }
}

.action-sheet-wrap {
  max-height: 350px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.action-sheet-header-wrap {
  margin-top: 5px;
  display: flex;
  justify-content: flex-end;
  border-bottom: 1px solid $secondLevelBorderColor;
}
.delete-icon-wrap {
  height: 30px;
  display: flex;
  align-items: center;
  margin-right: 15px;
  span {
    font-size: 14px;
    margin-left: 5px;
    line-height: 30px;
  }
}
.action-sheet-list-wrap {
  flex: 1;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
.action-sheet-list-item-wrap {
  margin: 10px;
  display: flex;
  align-items: center;

  img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 5px;
    margin-right: 10px;
  }
  .list-item-content-wrap {
    flex: 1;
    min-height: 90px;
    padding: 5px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-bottom: 1px solid $secondLevelBorderColor;

    .list-item-content-top {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      margin-bottom: 10px;

      .name {
        font-size: 16px;
        font-weight: 500;
        text-align: left;
      }
      .label-wrap {
        margin-top: 5px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        .label-value {
          color: $secondaryTextColor;
          font-size: 15px;
          line-height: 20px;
          border: 1px solid $placeholderTextColor;
          padding: 0 3px;
          margin-right: 5px;
          margin-bottom: 5px;
        }
      }
    }
  }
}
</style>
