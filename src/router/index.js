import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let myrouter = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/admin'
    },
    {
      path: '/admin',
      name: 'home',
      component: () => import('@/views/Home/index.vue')
    },
    {
      path: '/401',
      name: '401',
      component: () => import('@/views/errorPage/401.vue')
    },
    { path: '*', redirect: '/404', hidden: true },
    {
      path: '/404',
      name: '404',
      component: () => import('@/views/errorPage/404.vue')
    },
    {
      path: '/spacePage',
      name: 'spacePage',
      component: () => import('@/views/errorPage/spacePage.vue')
    },
    {
      path: '/Leaflets',
      name: 'Leaflets',
      meta: { parent: '/Leaflets', title: '线索管理-待派单' },
      component: () => import('@/views/DistributeLeaflets/index.vue')
    },
    {
      path: '/yet',
      name: 'yet',
      meta: { parent: '/yet', title: '线索管理-已派单' },
      component: () => import('@/views/DistriButeYet/index.vue')
    },
    {
      path: '/DispatchOperation',
      name: 'DispatchOperation',
      component: () => import('@/views/DistributeLeaflets/children/DispatchOperation.vue')
    },
    {
      path: '/design-allot',
      name: 'design-allot',
      meta: { parent: '/design-allot', title: '设计资源-待派单' },
      component: () => import('@/views/Design/index.vue'),
      children: [{
        path: 'design-child',
        name: 'design-child',
        component: () => import('@/views/Design/children/design_Child.vue')
      }]
    },
    {
      path: '/allot-already',
      name: 'allot-already',
      meta: { parent: '/Leaflets', title: '设计资源-已派单' },
      component: () => import('@/views/Allot/index.vue')
    },
    {
      path: '/totalexpendamount',
      name: 'totalexpendamount',
      meta: { parent: '/Leaflets', title: '设计资源-已派单' },
      component: () => import('@/views/Totalexpendamount/index.vue')
    },
    {
      path: '/work-order',
      name: 'work-order',
      component: () => import('@/views/Workorder/index.vue')
    },
    {
      path: '/drawing',
      name: 'drawing',
      component: () => import('@/views/Drawing/index.vue')
    },
    {
      path: '/contract',
      name: 'contract',
      component: () => import('@/views/Contract/index.vue')
    },
    {
      path: '/alterationPage',
      name: 'alterationPage',
      component: () => import('@/views/AddDecrease/children/alterationPage.vue')
    },
    {
      path: '/alteraPrinter',
      name: 'alteraPrinter',
      component: () => import('@/views/AddDecrease/children/alteraPrinter.vue')
    },
    {
      path: '/materialPage',
      name: 'materialPage',
      component: () => import('@/views/AddDecrease/children/materialPage.vue')
    },
    {
      path: '/materPrinter',
      name: 'materPrinter',
      component: () => import('@/views/AddDecrease/children/materPrinter.vue')
    },
    {
      path: '/add-design',
      name: 'add-design',
      component: () => import('@/views/AddDesign/index.vue')
    },
    {
      path: '/followUp',
      name: 'followUp',
      component: () => import('@/views/FollowUp/index.vue')
    },
    {
      path: '/offer',
      name: 'offer',
      component: () => import('@/views/OfferManagement/index.vue'),
      children: [{
        path: 'offer_Child',
        name: 'offer_Child',
        component: () => import('@/views/OfferManagement/children/offer_Child.vue')
      }]
    },
    {
      path: '/packageDetailsPage',
      name: 'packageDetailsPage',
      component: () => import('@/views/OfferManagement/children/detailsPage/packageDetailsPage.vue')
    },
    {
      path: '/quote_details',
      name: 'quote_details',
      component: () => import('@/views/OfferManagement/children/detailsPage/quotedetails.vue')
    },
    {
      path: '/inventory_details',
      name: 'inventory_details',
      component: () => import('@/views/OfferManagement/children/detailsPage/inventoryDetails.vue')
    },
    {
      path: '/repertoireDetailsPage',
      name: 'repertoireDetailsPage',
      component: () => import('@/views/OfferManagement/children/detailsPage/repertoireDetailsPage.vue')
    },
    {
      path: '/customDetailsPage',
      name: 'customDetailsPage',
      component: () => import('@/views/OfferManagement/children/detailsPage/customDetailsPage.vue')
    },
    {
      path: '/fund',
      name: 'fund',
      component: () => import('@/views/Fund/index.vue')
    },
    // 自定义收款的页面暂时先注释掉，路由先注释
    // {
    //   path: '/CustomReceipt',
    //   name: 'CustomReceipt',
    //   component: () => import('@/views/CustomReceipt/index.vue')
    // },
    {
      path: '/principal',
      name: 'principal',
      component: () => import('@/views/Principal/index.vue')
    },
    {
      path: '/meal',
      name: 'meal',
      component: () => import('@/views/Meal/index.vue'),
      children: [{
        path: 'taiwanPage',
        name: 'taiwanPage',
        component: () => import('@/views/Meal/children/taiwanPage.vue')
      }, {
        path: 'inventoryPage',
        name: 'inventoryPage',
        component: () => import('@/views/Meal/children/inventoryPage.vue')
      }, {
        path: 'customPage',
        name: 'customPage',
        component: () => import('@/views/Meal/children/customPage.vue')
      }]
    },
    {
      path: '/productFamily',
      name: 'productFamily',
      component: () => import('@/views/productFamily/index.vue')
    },
    {
      path: '/productAddEditPage',
      name: 'productAddEditPage',
      component: () => import('@/views/productFamily/children/productAddEditPage.vue')
    },
    {
      path: '/technology',
      name: 'technology',
      component: () => import('@/views/Technology/index.vue')
    },
    {
      path: '/set-meal',
      name: 'set-meal',
      component: () => import('@/views/SetMeal/index.vue')
    },
    {
      path: '/addinventory',
      name: 'addinventory',
      component: () => import('@/views/AddInventory/index.vue')
    },
    {
      path: '/addcustomproduct',
      name: 'addcustomproduct',
      component: () => import('@/views/CustomProduct/index.vue')
    },
    {
      path: '/construction',
      name: 'construction',
      component: () => import('@/views/Construction/index.vue')
    },
    {
      path: '/construction-detail',
      name: 'construction-detail',
      component: () => import('@/views/ConstructionDetail/index.vue')
    },
    {
      path: '/settlement-site',
      name: 'settlement-site',
      component: () => import('@/views/SettlementSite/index.vue')
    },
    {
      path: '/billing-details',
      name: 'billing-details',
      component: () => import('@/views/BillingDetails/index.vue')
    },
    {
      path: '/advance',
      name: 'advance',
      component: () => import('@/views/Advance/index.vue')
    },
    {
      path: '/advance-approve',
      name: 'advance-approve',
      component: () => import('@/views/AdvanceApprove/index.vue')
    },
    {
      path: '/advance-finish',
      name: 'advance-finish',
      component: () => import('@/views/AdvanceApprove/finish.vue')
    },
    {
      path: '/settlement',
      name: 'settlement',
      component: () => import('@/views/Settlement/index.vue')
    },
    {
      path: '/settlement-finish',
      name: 'settlement-finish',
      component: () => import('@/views/Settlement/finish.vue')
    },
    {
      path: '/settlement-detail',
      name: 'settlement-detail',
      component: () => import('@/views/Settlement/detail.vue')
    },
    {
      path: '/client-refund',
      name: 'client-refund',
      component: () => import('@/views/ClientRefund/index.vue')
    },
    {
      path: '/client-finish',
      name: 'client-finish',
      component: () => import('@/views/ClientRefund/finish.vue')
    },
    {
      path: '/add-reduce',
      name: 'add-reduce',
      meta: { parent: ['/basic/agreement'], title: '添加合同工时' },
      component: () => import('@/views/AddReduce/index.vue')
    },
    {
      path: '/add-reduce-finish',
      name: 'add-finish',
      component: () => import('@/views/AddReduce/finish.vue')
    },
    {
      path: '/contract-approve',
      name: 'contract-approve',
      component: () => import('@/views/ContractApprove/index.vue')
    },
    {
      path: '/contract-finish',
      name: 'contract-finish',
      component: () => import('@/views/ContractApprove/finish.vue')
    },
    {
      path: '/workflow',
      name: 'workflow',
      component: () => import('@/views/Workflow/index.vue')
    },
    {
      path: '/setworkflow',
      name: 'setworkflow',
      component: () => import('@/views/SetWorkflow/index.vue')
    },
    {
      path: '/decrease',
      name: 'decrease',
      component: () => import('@/views/AddDecrease/index.vue')
    },
    {
      path: '/add-decrease',
      name: 'add-decrease',
      component: () => import('@/views/AddDecrease/add.vue')
    },
    {
      path: '/add-wind',
      name: 'add-wind',
      component: () => import('@/views/AddDecrease/addWindow.vue')
    },
    {
      path: '/capital',
      name: 'Capital',
      component: () => import('@/views/Capital/index.vue')
    },
    {
      path: '/sms',
      name: 'sms',
      component: () => import('@/views/Sms/index.vue')
    },
    {
      path: '/government',
      name: 'government',
      component: () => import('@/views/Government/index.vue')
    },
    {
      path: '/increase',
      name: 'increase',
      component: () => import('@/views/Increase/index.vue')
    },
    {
      path: '/siteManagement',
      name: 'siteManagement',
      component: () => import('@/views/siteManagement/index.vue')
    },
    {
      path: '/siteDiteal',
      name: 'siteDiteal',
      component: () => import('@/views/siteManagement/siteDiteal.vue')
    },
    {
      path: '/workOrderManage',
      name: 'workOrderManage',
      component: () => import('@/views/workOrderManage/index.vue')
    },
    {
      path: '/auditedPage',
      name: 'auditedPage',
      component: () => import('@/views/abnormalReceipt/auditedPage.vue')
    },
    {
      path: '/doneAuditedPage',
      name: 'doneAuditedPage',
      component: () => import('@/views/abnormalReceipt/doneAuditedPage.vue')
    },
    {
      path: '/ReportFormPage',
      name: 'ReportFormPage',
      component: () => import('@/views/ReportFormPage/index.vue')
    },
    {
      path: '/mainMaterials',
      name: 'mainMaterials',
      component: () => import('@/views/mainMaterials/index.vue')
    },
    {
      path: '/houseDecoration',
      name: 'houseDecoration',
      component: () => import('@/views/budgetManagement/houseDecoration.vue')
    },
    {
      path: '/installedMINI',
      name: 'installedMINI',
      component: () => import('@/views/budgetManagement/installedMINI.vue')
    },
    {
      path: '/installedPLUS',
      name: 'installedPLUS',
      component: () => import('@/views/budgetManagement/installedPLUS.vue')
    },
    {
      path: '/refresh',
      name: 'refresh',
      component: () => import('@/views/budgetManagement/refresh.vue')
    },
    {
      path: '/DismantledOrder',
      name: 'DismantledOrder',
      component: () => import('@/views/budgetSplit/DismantledOrder.vue')
    },
    {
      path: '/unDismantledOrder',
      name: 'unDismantledOrder',
      component: () => import('@/views/budgetSplit/unDismantledOrder.vue')
    },
    {
      path: '/budgetSplit_child',
      name: 'budgetSplit_child',
      component: () => import('@/views/budgetSplit/child/budgetSplit_child.vue')
    },
  ]
})

myrouter.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g
  const isChunkLoadFailed = error.message.match(pattern)
  const targetPath = myrouter.history.pending.fullPath
  if (isChunkLoadFailed) {
    myrouter.replace(targetPath)
  }
})

export default myrouter
