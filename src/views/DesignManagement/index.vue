<template>
  <div>
    <common-header :value='infoValue'></common-header>
    <common-double :doubleDate="doubleDate" textMapTitle="客户信息" />
    <common-double :doubleDate="informationDate" textMapTitle="拓展信息(来自物业主数据)" />
  </div>
</template>
<script>
import CommonHeader from '@/components/CommonHeader/index.vue'
import CommonDouble from '@/components/CommonDouble'
export default {
  data () {
    return {
      infoValue: {
        workNumber: 20156899,
        name: '刘德华',
        fitment: '卧室/墙壁',
        index: 0
      },
      doubleDate: [
        { key: 'name', leftData: '客户名称', rightData: `刘德华` },
        { key: 'phone', leftData: '手机号码', rightData: `13686885544` },
        { key: 'address', leftData: '省市区', rightData: `广东省深圳市` },
        { key: 'area', leftData: '小区', rightData: `碧海花园` },
        { key: 'loudong', leftData: '楼栋', rightData: `9栋` },
        { key: 'fanghao', leftData: '房号', rightData: `201` },
        { key: 'origin', leftData: '来源', rightData: `助英台` },
        { key: 'perphon', leftData: '报单人', rightData: `老王` },
        { key: 'zhixinag', leftData: '装修意向', rightData: `厨房装修/卫生间装修` }
      ],
      informationDate: [
        { key: 'car', leftData: '车辆', rightData: `1` },
        { key: 'paer', leftData: '宠物', rightData: `1` },
        { key: 'jiating', leftData: '家庭情况', rightData: `2` },
        { key: 'xingqu', leftData: '个人兴趣', rightData: `2` },
        { key: 'shnegfen', leftData: '特殊身份', rightData: `3` }
      ]
    }
  },
  components: {
    CommonHeader,
    CommonDouble
  }
}
</script>
