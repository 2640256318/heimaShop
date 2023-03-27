<template>
  <div class="goods-item">
    <view class="goods-item-left">
        <radio value="" :checked="goods.goods_state" color="#c00000" v-if="showRadio" @click="sendToCart"/>
      <image :src="goods.goods_small_logo || defaultPic" class="goods-pic" @error="test"></image>
    </view>
    <!-- 右侧盒子 -->
    <view class="goods-item-right">
      <view class="goods-name">{{goods.goods_name}}</view>
      <view class="goods-info-box">
        <view class="goods-price">${{goods.goods_price | toFixed}}</view>
        <uni-number-box :min="1" :value="goods.goods_count" v-if="showNum" @change="numChange"></uni-number-box>
      </view>
    </view>
  </div>
</template>
<script>
  export default {
    props:{
      goods:{
        type:Object,
        default:{}
      },
      showRadio: {
        type: Boolean,
        default: false
      },
      showNum: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        defaultPic:'https://img2.baidu.com/it/u=3366114179,578815989&fm=253&fmt=auto&app=138&f=JPEG?w=750&h=500'
      }
    },
    methods: {
      sendToCart(e) {
        this.$emit('radio-change', {
          goods_state : !this.goods.goods_state,
          goods_id : this.goods.goods_id
        })
      },
      numChange(val) {
        this.$emit('num-change',{
          goods_id:this.goods.goods_id,
          goods_count: +val
        })
      }
    },
    filters:{
      toFixed(num) {
        return Number(num).toFixed(2)
      }
    }
  }
</script>
<style lang="scss">
  .goods-item {
    width: 750rpx;
    box-sizing: border-box;
    display: flex;
    padding: 10px 5px;
    border-bottom: 1px solid #f0f0f0;
    .goods-item-left {
      justify-content: space-between;
      align-items: center;
      display: flex;
      margin-right: 5px;
      .goods-pic {
        width: 100px;
        height: 100px;
        display: block;
      }
    }
    .goods-item-right {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
      .goods-name {
        font-size: 13px;
      }
      .goods-info-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .goods-price {
          color: #c00000;
          font-size: 16px
        }
      }
    }
  }
</style>
