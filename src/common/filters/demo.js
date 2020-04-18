export default {
  // 全局过滤器
  install (Vue) {
    Vue.filter('demoFilter', function (val) {
      if (Object.prototype.toString.call(val) === '[object Number]') {
        return 'this is a Number type.'
      } else {
        return val + '-非数值'
      }
    })
  } // close install
}
