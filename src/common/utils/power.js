
export var myPower = {
  data () {
    return {
      FinalObject: '',
      RouterNameFlag: {
        [this.$route.name]: true // 默认为true，表示页面上所有按钮默认全部显示,false表示这个页面只会显示children里面有的按钮
      }
    }
  },
  created: function () {
    if (sessionStorage.getItem('firstPower')) {
      this.FinalObject = JSON.parse(sessionStorage.getItem('firstPower'))
      this.powerAllThink()
    }
  },
  computed: {
    pagePower () {
      return this.$store.state.app.myRouterPower
    }
  },
  watch: {
    pagePower: {
      handler (newVal, val) {
        this.FinalObject = newVal
        this.powerAllThink()
      },
      deep: true
    }
  },
  methods: {
    powerAllThink () {
      if (this.FinalObject.children.length == 0) {
        this.RouterNameFlag[this.$route.name] = true
      } else {
        this.RouterNameFlag[this.$route.name] = false
        this.FinalObject.children.forEach(item => {
          if (item.svr_type == 'svrTypeButton' || item.svr_type == 'svrTypeMenu' || item.svr_type == 'svrTypeOther') {
            this.RouterNameFlag[item.router] = item.show
          }
        })
      }
    }
  }
}
