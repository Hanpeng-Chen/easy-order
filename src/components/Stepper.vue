<template>
  <div class="stepper-wrap" @click.stop>
    <div class="stepper-wrap">
      <button :class="['stepper__button', 'stepper__minus', disableMinus ? 'stepper__minus--disabled' : '']" @click="clickMinus"></button>
      <span class="stepper__value">{{value}}</span>
      <button :class="['stepper__button stepper__plus', disablePlus ? 'stepper__minus--disabled' : '']" @click="clickPlus"></button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Stepper',
  props: {
    value: {
      type: Number,
      default: 0
    },
    disablePlus: {
      type: Boolean,
      default: false
    },
    disableMinus: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    clickMinus () {
      if (this.disableMinus) return
      this.$emit('minus')
    },
    clickPlus () {
      if (this.disablePlus) return
      this.$emit('plus')
    }
  }
}
</script>

<style lang="scss" scoped>
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
</style>
