// pages/result/stomachResult/stomachResult.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
      result: 'low'  // 默认非高风险，实际使用时从本地存储获取
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      // 从本地存储获取胃癌筛查结果
      const stomachData = wx.getStorageSync('stomachData');
      if (stomachData && stomachData.riskLevel) {
        this.setData({
          result: stomachData.riskLevel
        });
      }
      if(options.riskLevel){
        this.setData({
          riskLevel:options.riskLevel
        })
      }
    },
  
    /**
     * 跳转到主页
     */
    navigateToHome() {
        wx.switchTab({
            url: '/pages/screening/screening',
          })
    },
  
    /**
     * 跳转到健康指导页面
     */
    navigateToGuidance() {
      wx.navigateTo({
        url: '/pages/healthGuide/stomachGuide/stomachGuide'
      });
    }
  })
  