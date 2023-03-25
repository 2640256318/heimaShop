<template>
  <view>
    <view class="search-box">
      			<uni-search-bar :radius="18" cancelButton="none" bgColor="#ffffff" @input="input" focus="true">
      			</uni-search-bar>
    </view>
    
    <!-- 搜索建议列表 -->
    <view class="sugg-list" v-if="searchResults.length !== 0">
      <view class="sugg-item" v-for="(item,index) in searchResults" :key="index" @click="gotoDetail(item)">
        <view class="goods-name">{{item.goods_name}}</view>
        <uni-icons type="arrowright" size="16"></uni-icons>
      </view>
    </view>
    
    <!-- 历史记录 -->
    <view class="history-box" v-else>
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="16" @click="deleteHistory"></uni-icons v-if="this.searchResults">
      </view>
      <!-- 列表区域 -->
      <view class="history-list">
        <uni-tag :text="item" v-for="(item,index) in histories" :key="index" @click="gotoGoodsList(item)"></uni-tag>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        timer:null,
        kw:'',
        //搜索的结果列表
        searchResults:[],
        //搜索历史的
        historyList:[]
      }
    },
    onLoad(){
      this.historyList = JSON.parse(uni.getStorageSync('kw') || [])
    },
    methods:{
      input(e) {
        if(this.timer) {
          clearTimeout(this.timer)
        } 
        this.timer = setTimeout(() => {
          this.kw = e
          console.log(this.kw)
          this.saveSearchHistory()
          this.getSearchList()
          this.timer = null
        },500)
      },
      async getSearchList() {
        if(this.kw.length === 0) {
          this.searchResults = []
          return
        }
        
        const {data:res} =  await uni.$http.get('/api/public/v1/goods/qsearch',{query:this.kw})
        if(res.meta.status !== 200) return uni.$showMsg()
        this.searchResults = res.message
      },
      gotoDetail(item) {
        uni.navigateTo({
          url:"/subpkg/goods_list/goods_list?goods_id="+item.goods_id
        })
      },
      saveSearchHistory() {
        this.historyList.push(this.kw)
        //对搜索历史数据进行持久性存储
        uni.setStorageSync('kw',JSON.stringify(this.histories))
      },
      deleteHistory() {
        this.historyList = []
        uni.setStorageSync('kw',[])
      },
      gotoGoodsList(item) {
        uni.navigateTo({
          url:'/subpkg/goods_list/goods_list?query='+ item
        })
      }
    },
    computed:{
      histories() {
        var demo = (([...this.historyList].reverse()).filter(Boolean))
        var result = new Set([...demo])
        return Array.from(new Set((([...this.historyList].reverse()).filter(Boolean))))
      }
    }
  }
</script>

<style lang="scss" scoped>
.search-box {
  position: sticky;
  z-index: 3;
  /deep/ .uni-searchbar {
    background-color: #C00000;
  }
}
.sugg-list {
  padding: 0 5px;
  .sugg-item{
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    padding: 13px 0;
    border-bottom: 1px solid #efefef;
    .goods-name {
      overflow: hidden;
      white-space: nowrap;
      //超出部分用省略号
      text-overflow: ellipsis;
    }
  }
}
.history-box {
  padding: 0 5px;
  .history-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    font-size: 13px;
    border-bottom: 1px solid #efefef;
  }
  .history-list {
    display: flex;
    /deep/ .uni-tag {
      margin-top: 5px;
      margin-right: 5px;
      background-color: #ccc;
      border-color: #ccc;
    }
  }
}
</style>
