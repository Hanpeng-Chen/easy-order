<template>
  <div class="main-page">
    <div class="button-box" @click="go2Order('0')">
      <img src="../assets/waimai.png" />
      <span>打包外带</span>
    </div>
    <div class="button-box" @click="go2Order('1')">
      <img src="../assets/tangshi.png" />
      <span>现场点单</span>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {
    go2Order (type) {
      this.$router.push({
        path: '/home',
        query: {
          type: type
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.main-page {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.button-box {
  height: 100px;
  width: 100px;
  border: 2px solid #409EFF;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgb(121, 187, 255);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  margin: 0 20px;

  img {
    width: 40px;
  }
}
</style>
