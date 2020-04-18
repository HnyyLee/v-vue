<template>
  <div class="home">
    <div>朴韵装修管理系统首页</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {}
  },
  computed: {
    ...mapState({
      token: state => state.user.token
    })
  },
  methods: {
    
  }
}
</script>
