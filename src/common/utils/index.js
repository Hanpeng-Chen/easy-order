function isNumber (value) {
  var patrn = /^(-)?\d+(\.\d+)?$/
  if (patrn.exec(value) === null || value === '') {
    return false
  } else {
    return true
  }
}

export default {
  /**
   * 分转元
   * @param {数字} a
   */
  fen2yuan (a, fixed) {
    if (fixed === undefined) fixed = 2
    if (!isNumber(a)) {
      return (0).toFixed(fixed)
    }
    return (a / 100.0).toFixed(fixed)
  }
}
