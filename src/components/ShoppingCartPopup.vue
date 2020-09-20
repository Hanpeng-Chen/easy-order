<template>
  <div>
    <van-action-sheet v-model="show">
      <div class="action-sheet-wrap">
        <div class="action-sheet-header-wrap">
          <div class="delete-icon-wrap" @click="clearSelectedMenus">
            <van-icon name="delete" size="14"></van-icon>
            <span>清空购物车</span>
          </div>
        </div>
        <div class="action-sheet-list-wrap">
          <div v-for="(item, index) in data" :key="index" class="action-sheet-list-item-wrap">
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
                <stepper :value="calcMenuItemSelectedCount(item.id)"
                         :disableMinus="calcMenuItemSelectedCount(item.id) === 0"
                         @plus="clickPlus(item)"
                         @minus="clickMinus(item)">
                </stepper>
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
import Stepper from './Stepper.vue'
import utils from '../common/utils'

export default {
  name: 'ShoppingCartPopup',
  components: {
    Stepper
  },
  props: {
    show: Boolean,
    data: Array
  },
  methods: {
    fen2yuan: utils.fen2yuan,
    calcMenuItemSelectedCount (id) {
      for (let i = 0; i < this.data.length; i++) {
        const item = this.data[i]
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
        for (let i = 0; i < this.data.length; i++) {
          if (menuItem.id === this.data[i].id) {
            this.data[i].count++
            isIn = true
            break
          }
        }
        if (!isIn) {
          const item = JSON.parse(JSON.stringify(menuItem))
          item.count++
          this.data.push(item)
        }
      }
    },
    // 点击减少按钮
    clickMinus (menu) {
      if (this.calcMenuItemSelectedCount(menu.id) === 0) {
        return
      }
      if (!menu.specifications || menu.specifications.length === 0) {
        for (let i = 0; i < this.data.length; i++) {
          if (menu.id === this.data[i].id) {
            this.data[i].count--
            if (this.data[i].count === 0) {
              this.data.splice(i, 1)
            }
            break
          }
        }
      }
    },
    clearSelectedMenus () {
      this.data = []
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
