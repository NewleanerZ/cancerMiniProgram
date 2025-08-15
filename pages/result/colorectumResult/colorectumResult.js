// pages/result/colorectumResult/colorectumResult.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: 'low'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const data = wx.getStorageSync('colorectumData');
    if(data && data.riskLevel){
        this.setData({
            result:data.riskLevel
        })
    }
    if(options.riskLevel){
      this.setData({
        riskLevel:options.riskLevel
      })
    }
  },

  navigateToHome(){
      wx.switchTab({
        url: '/pages/screening/screening',
      })
  },

  navigateToGuidance(){
      wx.redirectTo({
        url: '/pages/healthGuide/colorectumGuide/colorectumGuide',
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