// const { Env } = require("XrFrame/components")

// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    if(!wx.cloud){
        console.log("无云开发")
    }else{
        wx.cloud.init({
            env: 'cloudbase-6g6xlef713223bbc'
        })
    }

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    // 用户信息
    userinfo:{},
    // 用户ID
    openid:""
  }
})
