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
                  <button :class="['stepper__button', 'stepper__minus', menu.count > 0 ? '' : 'stepper__minus--disabled']" @click="clickMinus(menu)"></button>
                  <input disabled class="stepper__value" :value="menu.count" />
                  <button class="stepper__button stepper__plus" @click="clickPlus(menu)"></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <van-action-sheet v-model="showSelectedMenus">
          <div>1111111</div>
        </van-action-sheet>
      </div>

      <van-submit-bar style="z-index: 2100;"
                      :price="30500"
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
                  @click="showSelectMenuDialog = false">
        </van-icon>
        <span class="dialog-title">{{dialogData.name}}</span>
        <div v-for="(item, index) in dialogData.specifications"
             :key="index"
             class="label-wrap">
          <div class="label-title">{{item.name}}</div>
          <div class="label-group">
            <div v-for="option in item.options"
                :key="option.name">
              <span class="label-item">{{option.name}}</span>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <span class="dialog-footer__price">￥{{111}}</span>
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
                  multi: false,
                  name: '规格',
                  options: [
                    {
                      name: '小份',
                      extraPrice: 0
                    },
                    {
                      name: '大份',
                      extraPrice: 100
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
                  multi: false,
                  name: '面料',
                  options: [
                    {
                      name: '手工面',
                      extraPrice: 0
                    },
                    {
                      name: '刀削面',
                      extraPrice: 100
                    }
                  ]
                },
                {
                  multi: true,
                  name: '加料',
                  options: [
                    {
                      name: '青菜',
                      extraPrice: 100
                    },
                    {
                      name: '牛肚',
                      extraPrice: 200
                    },
                    {
                      name: '鱼丸',
                      extraPrice: 150
                    },
                    {
                      name: '金针菇',
                      extraPrice: 50
                    },
                    {
                      name: '青菜',
                      extraPrice: 100
                    },
                    {
                      name: '牛肚',
                      extraPrice: 200
                    },
                    {
                      name: '鱼丸',
                      extraPrice: 150
                    },
                    {
                      name: '金针菇',
                      extraPrice: 50
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
      for (let i = 0; i < this.menus.length; i++) {
        const item = this.menus[i]
        for (let j = 0; j < item.subMenus.length; j++) {
          count += item.subMenus[j].count || 0
        }
      }
      return count === 0 ? '' : count
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
      let count = 0
      for (let i = 0; i < subMenus.length; i++) {
        count += subMenus[i].count || 0
      }
      return count === 0 ? '' : count
    },
    sideBarChange (index) {
      this.showSubMenus = this.menus[index].subMenus
    },
    onSubmit () {
      this.$router.push({
        path: 'confirmOrder'
      })
    },
    // 点击添加按钮
    clickPlus (menu) {
      if (menu.specifications && menu.specifications.length > 0) {
        this.dialogData = menu
        this.showSelectMenuDialog = true
      } else {
        menu.count++
      }
    },
    // 点击减少按钮
    clickMinus (menu) {
      if (menu.count > 0) {
        menu.count--
      }
      console.error(menu)
    },
    confirmSelect () {
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
    .menu-price-count {
      display: inline-flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
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
      /deep/ .van-stepper--round .van-stepper__plus {
        background-color: $themeColor;
      }

      /deep/ .van-stepper--round .van-stepper__minus {
        color: $themeColor;
        border-color: $themeColor;
      }
    }
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
      .label-item {
        border: 1px solid $themeColor;
        color: $themeColor;
        padding: 2px 5px;
        margin-top: 2px;
        margin-right: 5px;
      }
    }
  }
}
</style>
