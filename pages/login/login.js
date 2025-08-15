// pages/login/login.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    tipMessage: '',
    // 用户信息
    userinfo:{},
    // 用户ID
    openid:""
  },
  onGoUserInfo:function (e) {
    
    this.setData({
      // 返回事件中用户信息
      userinfo: e.detail.userInfo
    })

    // 云函数中 this 范围仅在云函数内 
    // 因此在外面赋值 常量 that 代入云函数
    const that = this
    // 使用云函数方法
    wx.cloud.callFunction({
      // 云函数名
      name:"myCloudFunction",
      data:{
        type:"getOpenId",
      },
      // 云函数成功发出请求
      success:res=>{
        console.log("云函数调用成功")
        that.setData({
          // 返回云函数用户ID openid  res:自定义 代表云事件
          openid:res.result.openid,
          // 返回本地事件用户信息 userInfo e:自定义 代表本地事件
          userinfo:e.detail.userInfo,
        })
        // 将openid 信息保存的 userinfo 内，这样后面保存到内存只需保存一个字典字段
        // data 是页面第一次渲染使用的初始数据。去掉会报错 暂时不是完全清楚概念
        that.data.userinfo.openid = that.data.openid
        app.globalData.openid = that.data.openid
        app.globalData.userinfo = that.data.userinfo
        // 将 userinfo 保存到内存，包含openid
        wx.setStorageSync('userinfo', that.data.userinfo)
      },
      // 云函数失败发出请求
      fail:res=>{
        console.log("云函数调用失败")
      }
    })
   
  },

  handleLogin: function(){
    const that = this;

    //显示加载状态
    that.setData({
        loading: true,
        tipMessage: ''
    });

    
    
    //获取微信登录凭证code
    wx.login({
      success: (res) => {
        if(res.code){
            //调用后端接口，获取openid
            console.log(res.errMsg)
            that.requestOpenid(res.code);
        }else{
            //获取失败
            that.setData({
                loading: false,
                tipMessage: '登录失败' + res.errMsg
            });
            console.log('登录失败!'+ res.errMsg);
            console.log(res.code)
        }
        fail: (res) => {
            // 登录接口调用失败
        that.setData({
            loading: false,
            tipMessage: '登录失败：' + err.errMsg
          });
          console.error('登录接口调用失败！' + err.errMsg);
        }
      },
    })

  },

  requestOpenid: function(codeid){
      const that = this;


        wx.cloud.callFunction({
            name: 'myCloudFunction',
            data:{
                type:"getOpenId",
                code:codeid
            },
        }).then((resp) =>{
            //隐藏加载状态
            that.setData({
                loading: false
            });
                    //保存openid到本地存储
            wx.setStorageSync('openid', resp.result.openid)
            console.log(resp.result.openid)

                    //登录成功，跳转到用户须知界面
             wx.redirectTo({
                url: '/pages/disclaimer/disclaimer',
            })
        })

        /*
      //发送POST请求
      wx.request({
        url: apiUrl ,
        method: 'POST',
        data: {
            code: codeid
        },
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res){
            //隐藏加载状态
            that.setData({
                loading: false
            });

            //检查后端返回状态
            if(res.statusCode === 200 && res.data){
                if(res.data.data.openid && res.data.data){
                    //保存openid到本地存储
                    wx.setStorageSync('openid', res.data.data.openid)

                    //登录成功，跳转到用户须知界面
                    wx.redirectTo({
                      url: '/pages/disclaimer/disclaimer.wxml',
                    })
                }else{
                    //后端返回错误信息
                    that.setData({
                        tipMessage: res.data.message || '登录失败，请重试'
                    });
                }
            }else{
                that.setData({
                    tipMessage: '服务器异常，请稍后重试'
                });
                console.log('接口请求失败：', res);
            }
        },
        fail: function(err){
            //请求失败
            that.setData({
                loading: false,
                tipMessage: '网络异常，请检查网络后重试'
            });
            console.log('请求发送失败：', err);
        }
      });*/
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //检查是否已经登录，若登录，直接跳转到首页
    const openid = wx.getStorageSync('openid');
    if(openid){
        wx.redirectTo({
          url: '/pages/disclaimer/disclaimer.wxml',
        })
    }
    // 获取缓存信息
    const ui = wx.getAccountInfoSync("userinfo")
    this.setData({
      userinfo:ui,
      openid:ui.openid
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})