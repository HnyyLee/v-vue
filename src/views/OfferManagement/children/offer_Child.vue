<!---->
<template>
  <div class="offer_Child">
    <div class="top_TabDom" @click="tabDomThink" v-if="this.$route.query.aFlag == 1">
      <p :class="{ 's_btn': true }" v-if="this.$route.query.offerState == 1" :data-num="1">套餐式报价——新增</p>
      <p :class="{ 's_btn': true }" v-if="this.$route.query.offerState == 2" :data-num="2">清单式报价——新增</p>
      <p :class="{ 's_btn': true }" v-if="this.$route.query.offerState == 3" :data-num="3">自定义报价——新增</p>
    </div>
    <div class="top_TabSpliceDom" v-if="this.$route.query.aFlag == 2">
      <p class="s_btn">{{spliceName}}</p>
    </div>
    <div class="content_Dom">
      <a-spin :spinning="spinning" v-if="this.$route.query.offerState == 1">
        <div class="spin-content">
          <packageList />
        </div>
      </a-spin>
      <a-spin :spinning="spinning" v-if="this.$route.query.offerState == 2">
        <div class="spin-content">
          <repertoireList />
        </div>
      </a-spin>
      <a-spin :spinning="spinning" v-if="this.$route.query.offerState == 3">
        <div class="spin-content">
          <customList />
        </div>
      </a-spin>
      <!-- Loading state：<a-switch v-model="spinning"></a-switch> -->
    </div>
  </div>
</template>

<script>
import packageList from './package_list'
import repertoireList from './repertoire_list'
import customList from './custom_list'
export default {
  data () {
    return {
      spinning: false
    }
  },
  props: {
  },
  components: {
    packageList,
    repertoireList,
    customList
  },
  created () {
  },
  computed: {
    spliceName () {
      let str = ''
      if (this.$route.query.offerState == 1) {
        str = '套餐式报价——编辑'
      } else if (this.$route.query.offerState == 2) {
        str = '清单式报价——编辑'
      } else if (this.$route.query.offerState == 3) {
        str = '自定义报价——编辑'
      }
      return str
    }
  },
  mounted () {
  },
  methods: {
    changeSpinning () {
      this.spinning = !this.spinning
    },
    tabDomThink (ev) {
      document.querySelectorAll('.top_TabDom .s_btn').forEach(dom => {
        dom.classList.remove('splice')
      })
      ev.target.classList.add('splice')
      var anum = ev.target.dataset.num
      if (anum == 1) {
        this.$router.push({ path: '/offer/offer_Child', query: { offerState: 1, aFlag: 1 } })
      } else if (anum == 2) {
        this.$router.push({ path: '/offer/offer_Child', query: { offerState: 2, aFlag: 1 } })
      } else if (anum == 3) {
        this.$router.push({ path: '/offer/offer_Child', query: { offerState: 3, aFlag: 1 } })
      }
    }
  },
  watch: {
    $route (to, from) {
      // if (to.name == 'offer') {
      //   this.showFlag = true
      // } else if (to.name == 'offer_Child') {
      //   this.showFlag = false
      // }
    }
  }
}
</script>

<style lang="scss">
  .offer_Child {
    padding: 20px 0px;
    .top_TabDom{
      width: 200px;
      display: flex;
      text-align: center;
      justify-content: center;
      align-items: center;
      .s_btn{
        line-height: 45px;
        color: #fff;
        margin: 0px 15px 0px 0px;
        flex: 1;
        background: #6FA7E5;
        cursor: pointer;
      }
      .s_btn:hover{
        // background: #1590FF;
      }
      .s_btn.splice{
        background: #FFA031;
      }
    }
    .top_TabSpliceDom{
      width: 200px;
      text-align: center;
      .s_btn{
        line-height: 45px;
        color: #fff;
        margin: 0px 15px 0px 0px;
        flex: 1;
        background: #6FA7E5;
        cursor: pointer;
      }
    }
    .content_Dom{
      margin-top: 0px;
      .spin-content{
        border: 1px solid #91d5ff;
        padding: 30px 20px 20px 20px;
      }
    }
  }
</style>
