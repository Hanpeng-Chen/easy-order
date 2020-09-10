import {Toast} from 'vant'

export default {
  open () {
    return Toast.loading({
      forbidClick: true,
      loadingType: 'spinner',
      duration: 0
    })
  },
  close () {
    Toast.clear()
  }
}
