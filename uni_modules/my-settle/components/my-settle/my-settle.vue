<template>
  <view class="my-settle-container">
    <label class="radio" @click="changeAllState">
      <radio color="#c00000" :checked="isFullCheck" /><text>全选</text>
    </label>

    <view class="amount-box">
      合计:<text class="amount">${{checkedGoodsAmount}}</text>
    </view>

    <view class="btn-settle">结算{{checkedCount}}</view>
  </view>
</template>
<script>
  import {mapState,mapMutations,mapGetters} from 'vuex'
  export default {
    data() {
      return {

      }
    },
    computed:{
      ...mapGetters('m_cart',['checkedCount','total','checkedGoodsAmount']),
      //是否是全选的一个状态
      isFullCheck() {
        return this.total === this.checkedCount
      }
    },
    methods: {
      ...mapMutations('m_cart',['updateAllGoodsState']),
      changeAllState() {
        this.updateAllGoodsState(!this.isFullCheck)
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
