<template>
  <div class="goods-item">
    <view class="goods-item-left">
      <image :src="goods.goods_small_logo || defaultPic" class="goods-pic" @error="test"></image>
    </view>
    <!-- 右侧盒子 -->
    <view class="goods-item-right">
      <view class="goods-name">{{goods.goods_name}}</view>
      <view class="goods-info-box">
        <view class="goods-price">${{goods.goods_price | toFixed}}</view>
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
      }
    },
    data() {
      return {
        defaultPic:'https://img2.baidu.com/it/u=3366114179,578815989&fm=253&fmt=auto&app=138&f=JPEG?w=750&h=500'
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
    display: flex;
    padding: 10px 5px;
    border-bottom: 1px solid #f0f0f0;
    .goods-item-left {
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
      .goods-name {
        font-size: 13px;
      }
      .goods-info-box {
        .goods-price {
          color: #c00000;
          font-size: 16px
        }
      }
    }
  }
</style>
