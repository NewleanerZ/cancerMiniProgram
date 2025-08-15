// pages/userCenter/userCenter.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 用户信息
    userinfo:{},
    login: {
      show: false,
      avatar: '../../images/noPic.png',
    },
    // 用户ID
    openid:"",
    historyRecord:[],
  },
  chooseAvatar(e) {
    this.setData({
      login: {
        show: true,
        avatar: e.detail.avatarUrl,
      }
    })
  },
  getUserInfo(){
    this.setData({
      openid:app.globalData.openid,
      userinfo:app.globalData.userinfo
    })
  },
  getHistoryRecord(){
    try{
      wx.cloud.callFunction({
        name:"myCloudFunction",
        data:{
          type:"selectRecord"
        }
      }).then((resp)=>{
        this.setData({
          historyRecord:resp.result.data
        })
      })
    } catch (e) {
      wx.showToast({ title: "查询失败", icon: "none" });
    } 
  },
  gotoResult(e){
    const { item } = e.currentTarget.dataset;
    const cancerType = item.screenTable.cancerType;
    console.log(cancerType);
    console.log(item.riskLevel);
    // 根据癌种动态跳转（示例路径，需替换为实际页面）
    wx.navigateTo({
      url: `/pages/result/${cancerType}Result/${cancerType}Result?riskLevel=${item.riskLevel}`
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getUserInfo();
    
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
    this.getHistoryRecord();
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