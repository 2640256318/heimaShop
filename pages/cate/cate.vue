<template>
  <view>
    <view class="scroll-view-container">
      <!-- 左侧的滑动区 -->
      <scroll-view scroll-y="true" :style="{height: wh + 'px'}" class="left-scroll-view">
        <block v-for="(item,index) in cateList" :key="index" >
          <view :class="['left-scroll-view-item',index === active ? 'active' : '']" @click="activeChange(index)">{{item.cat_name}}</view>
        </block>
      </scroll-view>
      <!-- 右侧的滑动区 -->
      <scroll-view scroll-y="true" :style="{height: wh + 'px'}" :scroll-top="scrollTop">
          <view :class="cate-lv2" v-for="(item2,index2) in cateLevel2" :key="index2">
            <view class="cate-lv2-title">/{{item2.cat_name}}/</view>
            <view class="cate-lv3-list">
              <view class="cate-lv3-item" v-for="(item3,index3) in item2.children" :key="index3" @click = gotoGoodsList(item3)>
                <image :src="item3.cat_icon.replace('dev','web')" mode=""></image>
                <text>{{item3.cat_name}}</text>
              </view>
            </view>
          </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        wh: 200,
        cateList:[],
        active:0,
        cateLevel2:[],
        scrollTop:0
      }
    },
    onLoad() {
      const test = uni.getSystemInfoSync()
      this.wh = test.windowHeight
      this.getCateList()
    },
    methods: {
      //获取分类列表数据
      async getCateList() {
        const {data:res} =  await uni.$http.get('/api/public/v1/categories')
        if(res.meta.status !== 200) return uni.$showMsg()
        this.cateLevel2 = res.message[0].children
        this.cateList = res.message
      },
      //改变active
      activeChange(i) {
        this.active = i
        //切换二级分类的值
        this.cateLevel2 = this.cateList[i].children
        this.scrollTop = this.scrollTop === 0 ? 1 : 0
      },
      gotoGoodsList(item3) {
        uni.navigateTo({
          url:"/subpkg/goods_list/goods_list?cid="+item3.cat_id
        })
      }
    }
  }
</script>

<style lang="scss">
  .scroll-view-container {
    display: flex;

    .left-scroll-view {
      width: 120px;

      .left-scroll-view-item {
        background-color: #F7F7F7;
        line-height: 60px;
        text-align: center;
        font-size: 12px;
        
        &.active {
          background-color: #FFFFFF;
          position: relative;
        &::before {
          content: ' ';
          display: block;
          width: 3px;
          height: 30px;
          background-color: #c00000;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
        }
      }
    }
  .cate-lv2-title {
    font-style: 12px;
    font-weight: bold;
    text-align: center;
    padding: 15px 0;
  }
  .cate-lv3-list {
    display: flex;
    flex-wrap: wrap;
    .cate-lv3-item {
      margin-bottom: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 33.33%;
      image {
        width: 60px;
        height: 60px;
      }
      text {
        font-size: 12px;
      }
    }
  }
  }
</style>
