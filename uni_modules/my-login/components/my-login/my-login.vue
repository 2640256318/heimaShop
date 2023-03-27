<template>
  <view class="login-container">
    <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
    <button type="primary" class="btn-login" @click="getUserProfile">一键登录</button>
    <text class="tips-text">登录后尽享更多权益</text>
  </view>
</template>
<script>
  import {
    mapMutations,
    mapGetters,
    mapState
  } from 'vuex'
  export default {
    data() {
      return {

      }
    },
    computed: {
      ...mapState('m_user',['redirectInfo']),
    },
    methods: {
      ...mapMutations('m_user', ['updateUserInfo','updateToken','updateRedirectInfo']),
      getUserProfile(e) {
        uni.getUserProfile({
          desc: '用于完善用户资料',
          success: (e) => {
            this.updateUserInfo(e.userInfo)
            console.log(e)
            this.getToken(e)
          },
          fail: (e) => {
            return uni.$showMsg('您取消了授权')
          }
        })
      },
      async getToken(e) {
        //获取code
        const [err, res] = await uni.login().catch(err => err)
        if (err || res.errMsg !== 'login:ok') return uni.$showMsg('登录失败')
        const loginRequest = {
          "message": {
            "user_id": 12,
            "user_emai1_code": null,
            "is_active": null, 
            "user_sex": "男",
            "user_qq": "",
            "user_tel": "",
            "user_xueli": "本科",
            "user_hobby": "",
            "user_introduce": null,
            "create_time": 1525402223,
            "update_time": 1525402223,
            "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo"
          },
          "meta": {
            "msg": "登录成功",
            "status": 200
          }
      }
        //接口没有权限直接写死
        //   const {
        //   data: loginRequest
        // } = await uni.$http.post('/api/public/v1/users/wxlogin', query)
        if (loginRequest.meta.status !== 200) return uni.$showMsg('登陆失败')
        uni.$showMsg('登陆成功')
        this.updateToken(loginRequest.message.token)
        
        this.navigatorBack()
      },
      navigatorBack() {
        if(this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
          uni.switchTab({
            url:this.redirectInfo.from,
            complete:() => {
              this.updateRedirectInfo(null)
            }
          })
        }
      }
    }
  }
</script>
<style lang="scss">
  .login-container {
    background-color: #F8F8F8;
    height: 750rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;

    &::after {
      content: '';
      display: block;
      width: 100%;
      height: 40px;
      background-color: white;
      position: absolute;
      bottom: 0;
      left: 0;
      border-radius: 100%;
      transform: translateY(50%);
    }

    .concat-filled {}

    .btn-login {
      width: 90%;
      border-radius: 100px;
      margin: 15px 0;
      background-color: #c00000;
    }

    .tips-text {
      font-size: 12px;
      color: gray;
    }
  }
</style>
