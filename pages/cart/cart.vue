<template>
  <view class="cart-container" v-if="cart.length !== 0">
    <!-- 收货地址组件 -->
    <my-address></my-address>
    
    <view class="cart-title">
      <!-- 左侧的图标 -->
      <uni-icons type="shop" size="18"></uni-icons>
      <!-- 描述的文本 -->
      <text class="car-title-text">购物车</text>
    </view>
    
    <!-- 商品信息 -->
    <uni-swipe-action>
      <block v-for="(item,index) in cart" :key="index">
        <uni-swipe-action-item :right-options="options" @click="swipeItemClickHandler(item)">
          <my-goods :goods="item" :showRadio="true" :checked="goods_state" @radio-change="handlerRadioCheck" :show-num="true" @num-change="handlerNumChange"></my-goods>
        </uni-swipe-action-item>
        </block>
    </uni-swipe-action>
    
    <my-settle></my-settle>
  </view>
  
  <!-- 空白购物车 -->
  <view class="empty-cart" v-else>
    <image src="../../static/cart_empty@2x.png" mode="" class="empty-image"></image>
    <text class="empty-text">空空如也~</text>
  </view>
</template>

<script>
  import badgeMix from '../../mixins/tabar-badge.js'
  import {mapState,mapMutations} from 'vuex'
  export default {
    mixins:[badgeMix],
    data() {
      return {
        options:[{
          text: '删除',
          style: {
            backgroundColor:'#c00000'
          }
        }]
      }
    },
    methods:{
      ...mapMutations('m_cart',['updateGoodsState','updateGoodsCount','removeGoodsById',]),
      handlerRadioCheck(e) {
        this.updateGoodsState(e)
      },
      handlerNumChange(e) {
        this.updateGoodsCount(e)
      },
      swipeItemClickHandler(e) {
        this.removeGoodsById(e.goods_id)
      }
    },
    watch: {
      
    },
    computed:{
      ...mapState('m_cart',['cart'])
    }
  }
</script>

<style lang="scss">
  .cart-container {
    padding-bottom: 50px;
  }
.cart-title {
  height: 40px;
  display: flex;
  padding-left: 5px;
  border-bottom: 1px solid #efefef;
  align-items: center;
  .car-title-text{
    font-size: 14px;
    margin-left: 10px;
  }
}
.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 150px;
  .empty-image {
    width: 90px;
    height: 90px;
  }
  .empty-text {
    font-size: 12px;
    color: gray;
    margin-top: 15px;
  }
}
</style>
