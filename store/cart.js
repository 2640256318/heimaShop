export default {
  //开启命名空间
  namespaced : true,
  
  state: () => ({
    cart: JSON.parse(uni.getStorageSync('cart') ||'[]')
  }),
  
  mutations: {
    addToCart(state,goods) {
      const findResult = state.cart.find(item => item.goods_id === goods.goods_id)
      
      if(!findResult) {
        state.cart.push(goods)
      }else {
        findResult.goods_count++
      }
      this.commit('m_cart/saveToStorage')
    },
    saveToStorage(state) {
      uni.setStorageSync('cart',JSON.stringify(state.cart))
    },
    updateGoodsState(state,goods) {
      const findResult = state.cart.find(item => item.goods_id === goods.goods_id)
      if(!findResult) {
        
      }else {
        findResult.goods_state = goods.goods_state
        this.commit('m_cart/saveToStorage')
      }
    },
    updateGoodsCount(state,goods) {
      const findResult = state.cart.find(item => item.goods_id === goods.goods_id)
      if(findResult) {
        findResult.goods_count = goods.goods_count
        this.commit('m_cart/saveToStorage')
      }
    },
    removeGoodsById(state,goods_id) {
      state.cart = state.cart.filter(item => item.goods_id !== goods_id)
      this.commit('m_cart/saveToStorage')
    },
    updateAllGoodsState(state,newState) {
      state.cart.forEach(item => item.goods_state = newState)
      this.commit('m_cart/saveToStorage')
    }
  },
  
  getters: {
    //统计购物车总数量
    total(state) {
      // let c = 0
      // state.cart.forEach(item => c+=item.goods_count)
      // return c
      
      return state.cart.reduce((total,item) => total += item.goods_count,0)
    },
    //已勾选总数量
    checkedCount(state) {
      return state.cart.filter(item => item.goods_state).reduce((total,item) => total += item.goods_count,0)
    },
    checkedGoodsAmount(state) {
      return state.cart.filter(item => item.goods_state).reduce((total,item) => total += (item.goods_count * item.goods_price),0).toFixed(2)
    }
  }
}