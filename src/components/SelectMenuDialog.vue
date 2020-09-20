<template>
  <div>
    <van-dialog v-model="show" :showConfirmButton="false">
      <div class="dialog-content">
        <van-icon class="close-icon"
                  name="close"
                  size="25"
                  color="#409EFF"
                  @click="closeDialog">
        </van-icon>
        <span class="dialog-title">{{data.name}}</span>
        <div v-for="(item, index) in data.specifications"
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
import utils from '../common/utils'
export default {
  name: 'SelectMenuDialog',
  props: {
    show: Boolean,
    data: Object
  },
  methods: {
    calcDialogSelectedPrice () {
      let price = this.data.price || 0
      if (this.data.specifications) {
        this.data.specifications.forEach(item => {
          item.options.forEach(o => {
            price += o.extraPrice * (o.count || 0)
          })
        })
      }
      return utils.fen2yuan(price)
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
    confirmSelect () {
      this.data.count = 1
      const newSpecifications = []
      this.data.specifications.forEach(spec => {
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
      this.data.specifications = newSpecifications
      this.selectedMenus.push(this.data)
      this.showSelectMenuDialog = false
      this.data = {}
    },
    closeDialog () {
      this.show = false
    }
  }
}
</script>

<style lang="scss" scoped>
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
</style>
