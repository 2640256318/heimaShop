<template>
  <view>
    <view class="goods-list">
      <view v-for="(goods,i) in goodsList" :key="i" @click="gotoDetail(goods)">
        <!-- 左侧盒子 -->
        <my-goods :goods="goods"></my-goods>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        queryObj : {
          query:'',
          cid:'',
          pagenum:1,
          pagesize:10
        },
        goodsList:[],
        total:0,
        isLoading:false
      };
    },
    onReachBottom() {
      if(this.isLoading) return
      //让页码值自增加一
      this.queryObj.pagenum++
      this.getGoodsList()
      if(this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('到底啦~')
    },
    onPullDownRefresh() {
      //重置关键数据
      this.queryObj.pagenum = 1
      this.queryObj.total = 0
      this.isLoading = false
      this.goodsList = []
      //重新发送数据请求
      this.getGoodsList(() => {
        uni.stopPullDownRefresh()
      })
    },
    onLoad(options) {
      this.queryObj.query = options.query || ''
      this.queryObj.cid = options.cid || ''
      this.getGoodsList()
    },
    methods:{
      async getGoodsList(cb) {
        //打开节流阀
        this.isLoading = true
        const {data:res} =  await uni.$http.get('/api/public/v1/goods/search',this.queryObj)
        //关闭节流阀
        this.isLoading = false
        if(res.meta.status !== 200) return uni.$showMsg()
        this.goodsList = [...this.goodsList,...res.message.goods]
        this.total = res.message.total
        //回调函数
        cb && cb()
      },
      gotoDetail(goods) {
        uni.navigateTo({
          url:"/subpkg/goods_detail/goods_detail?goods_id=" + goods.goods_id
        })
      }
    }
  }
</script>

<style lang="scss">

</style>
