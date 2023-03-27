<template>
  <view>
    <!-- 搜索组件 -->
    <view class="search-box">
      <my-search @myClick="gotoSearch"></my-search>
    </view>
    <!-- 轮播区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" circular="true">
      <swiper-item v-for="(item,index) in swiperList" :key="index">
        <navigator class="swiper-item" :url="`/subpkg/goods_detail/goods_detail?goods_id=${item.goods_id}`">
          <image :src="item.image_src" mode=""></image>
        </navigator>
      </swiper-item>
    </swiper>
    <!-- 分类区域 -->
    <view class="nav-list">
      <view class="nav-item" v-for="(item,index) in navList" :key="index" @click="navClickHandle(item)">
        <image class="nav-img" :src="item.image_src"></image>
      </view>
    </view>
    <!-- 楼层 -->
    <view class="floor">
      <view class="floor-item" v-for="(item,index) in floorList" :key="index">
        <!-- 楼层标题 -->
        <image :src="item.floor_title.image_src" class="floor-image"></image>
        <!-- 楼层图片 -->
        <view class="floor-image-box">
          <!-- 左侧大图片 -->
          <navigator class="left-image-box" :url="item.product_list[0].url">
            <image :src="item.product_list[0].image_src" :style="{width:item.product_list[0].image_width + 'rpx'}" mode="widthFix"></image>
          </navigator>
          <!-- 右侧四个小图片 -->
          <view class="right-img-box">
            <navigator class="right-image-item" v-for="(item2,index2) in item.product_list" :key="index2" v-if="index2 !== 0" :url="item2.url">
              <image :src="item2.image_src" :style="{width:item2.image_width + 'rpx'}" mode="widthFix"></image>
            </navigator>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import badgeMix from '../../mixins/tabar-badge.js'
  export default {
    mixins:[badgeMix],
    data() {
      return {
        //存储轮播图的数据源
        swiperList:[],
        //分类导航数据
        navList:[],
        //楼层数据
        floorList:[]
      };
    },
    onLoad() {
      //获取轮播图数据
      this.getSwiperList()
      //获取轮播图下面的导航栏数据
      this.getNavList(),
      //获取楼层数据
      this.getFloorList()
    },
    methods:{
      //获取轮播图的swiperList
      async getSwiperList() {
        const {data:res} = await uni.$http.get('/api/public/v1/home/swiperdata')
        //请求失败
        if(res.meta.status !== 200) return uni.$showMsg()
        this.swiperList = res.message
        uni.$showMsg('数据请求成功!')
      },
      //获取分类的navList
      async getNavList() {
        const {data:res} = await uni.$http.get('/api/public/v1/home/catitems')
        //请求失败
        if(res.meta.status !== 200) return uni.$showMsg()
        this.navList = res.message
        uni.$showMsg('数据请求成功!')
      },
      //分类栏点击跳转到分类页面
      navClickHandle(item) {
        if(item.name === "分类") {
          uni.switchTab({
            url:"/pages/cate/cate"
          })
        }
      },
      //获取楼层数据
      async getFloorList() {
        const {data:res} = await uni.$http.get('/api/public/v1/home/floordata')
        //请求失败
        if(res.meta.status !== 200) return uni.$showMsg()
        //多加一个自定义路径
        res.message.forEach(item => {
          item.product_list.forEach(prod => {
            var param = prod.navigator_url.split('?')[1]
            prod.url = '/subpkg/goods_list/goods_list?' + param
          })
        })
        this.floorList = res.message
        uni.$showMsg('数据请求成功!')
      },
      gotoSearch() {
        uni.navigateTo({
          url:"/subpkg/search/search"
        })
      },
    }
  }
</script>

<style lang="scss">
swiper {
  height: 330rpx;
  .swiper-item,
  image {
    width: 100%;
    height: 100%;
  }
}
.nav-list {
  display: flex;
  justify-content: space-around;
  margin: 15px 0;
  .nav-img {
    height: 128rpx;
    width: 140rpx;
  }
}
.floor {
  .floor-image {
    height: 60rpx;
    width: 100%;
  }
  .floor-image-box {
    display: flex;
    padding: 10rpx;
    .right-img-box {
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
    }
  }
}
.search-box {
  position: sticky;
  top: 0;
  z-index: 9;
}
</style>
