<template>
  <view class="my-settle-container">
    <label class="radio" @click="changeAllState">
      <radio color="#c00000" :checked="isFullCheck" /><text>全选</text>
    </label>

    <view class="amount-box">
      合计:<text class="amount">${{checkedGoodsAmount}}</text>
    </view>

    <view class="btn-settle" @click="settlement">结算{{checkedCount}}</view>
  </view>
</template>
<script>
  import {mapState,mapMutations,mapGetters} from 'vuex'
  export default {
    data() {
      return {
        //倒计时的秒数
        second:3,
        timer : null
      }
    },
    computed:{
      ...mapGetters('m_cart',['checkedCount','total','checkedGoodsAmount']),
      ...mapGetters('m_user',['addstr']),
      ...mapState('m_user',['token']),
      ...mapState('m_cart',['cart']),
      //是否是全选的一个状态
      isFullCheck() {
        return this.total === this.checkedCount
      }
    },
    methods: {
      ...mapMutations('m_cart',['updateAllGoodsState','updateRedirectInfo']),
      ...mapMutations('m_user',['updateRedirectInfo']),
      changeAllState() {
        this.updateAllGoodsState(!this.isFullCheck)
      },
      //用户点击结算按钮
      settlement() {
        if(!this.checkedCount) return uni.$showMsg('请选择要结算的商品')
        if(!this.addstr) return uni.$showMsg('请选择收货地址')
        if(!this.token) return this.delayNavigator()
        this.payOrder()
      },
      //倒计时
      showTips(n) {
        uni.showToast({
          icon:'none',
          title:'请登录后再结算!'+n+'秒后自动跳转到登录页',
          mask:true,
          duration:1500
        })
      },
      //延迟导航到my页面
      delayNavigator() {
        this.second = 3
        this.showTips(this.second)
        this.timer = setInterval(() => {
          this.second--
          if(this.second <= 0) {
            clearInterval(this.timer)
            
            uni.switchTab({
              url:'/pages/my/my',
              success:() => {
                this.updateRedirectInfo({
                  openType:'switchTab',
                  from: '/pages/cart/cart'
                })
              }
            })
            return 
          }
          this.showTips(this.second)
        },1000)
      },
      async payOrder() {
        //1.创建订单
        const orderInfo = {
            // 开发期间，注释掉真实的订单价格，
            // order_price: this.checkedGoodsAmount,
            // 写死订单总价为 1 分钱
            order_price: 0.01,
            consignee_addr: this.addstr,
            goods: this.cart.filter(x => x.goods_state).map(x => ({ goods_id: x.goods_id, goods_number: x.goods_count, goods_price: x.goods_price }))
          }
        //1.1组织订单对象
        //1.2发起请求创建订单
        const { data: res } = await uni.$http.post('/api/public/v1/my/orders/create', orderInfo)
        if (res.meta.status !== 200) return uni.$showMsg('创建订单失败！')
        // 1.3 得到服务器响应的“订单编号”
         const orderNumber = res.message.order_number
         
          // 2. 订单预支付
           // 2.1 发起请求获取订单的支付信息
           const { data: res2 } = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', { order_number: orderNumber })
           // 2.2 预付订单生成失败
           if (res2.meta.status !== 200) return uni.$showError('预付订单生成失败！')
           // 2.3 得到订单支付相关的必要参数
           const payInfo = res2.message.pay
         
            // 3. 发起微信支付
               // 3.1 调用 uni.requestPayment() 发起微信支付
               const [err, succ] = await uni.requestPayment(payInfo)
               // 3.2 未完成支付
               if (err) return uni.$showMsg('订单未支付！')
               // 3.3 完成了支付，进一步查询支付的结果
               const { data: res3 } = await uni.$http.post('/api/public/v1/my/orders/chkOrder', { order_number: orderNumber })
               // 3.4 检测到订单未支付
               if (res3.meta.status !== 200) return uni.$showMsg('订单未支付！')
               // 3.5 检测到订单支付完成
               uni.showToast({
                 title: '支付完成！',
                 icon: 'success'
               })
      }
    }
  }
</script>
<style lang="scss">
  .my-settle-container {
    z-index: 40;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    background-color: white;
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    padding-left: 5px;
    align-items: center;

    .radio {
      display: flex;
      align-items: center;
    }

    .amount-box {
      .amount {
        color: #c00000;
        font-weight: bold;
      }
    }

    .btn-settle {
      background-color: #c00000;
      height: 50px;
      color: white;
      line-height: 50px;
      padding: 0 10px;
      min-width: 100px;
      text-align: center;
    }
  }
</style>
