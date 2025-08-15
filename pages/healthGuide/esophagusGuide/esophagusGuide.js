// pages/healthGuide/esophagusGuide/esophagusGuide.js
// pages/healthGuide/esophagusGuide/esophagusGuide.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
      showMenu: false,
      showBackTop: false,
      currentSection: 'intro'
    },
  
    /**
     * 切换菜单显示/隐藏
     */
    toggleMenu() {
      this.setData({
        showMenu: !this.data.showMenu
      })
    },
  
    /**
     * 滚动到指定章节
     */
    scrollToSection(e) {
      const sectionId = e.currentTarget.dataset.section
      this.setData({
        showMenu: false,
        currentSection: sectionId
      })
      
      wx.createSelectorQuery().select(`#${sectionId}`).boundingClientRect(rect => {
        wx.createSelectorQuery().select('#mainScroll').scrollOffset(offset => {
          // 计算滚动目标位置
          const scrollTop = offset.scrollTop + rect.top - 20
          this.setData({
            scrollTop: scrollTop
          })
          // 执行滚动
          wx.createSelectorQuery().select('#mainScroll').scrollIntoView({
            selector: `#${sectionId}`,
            offsetTop: 120,
            animated: true
          })
        }).exec()
      }).exec()
    },
  
    /**
     * 监听滚动事件
     */
    onScroll(e) {
      // 显示/隐藏返回顶部按钮
      this.setData({
        showBackTop: e.detail.scrollTop > 500
      })
  
      // 检测当前可见的章节
      const scrollTop = e.detail.scrollTop + 150
      const sections = ['intro', 'risk-factors', 'protective-factors', 'early-symptoms', 'references']
      
      wx.createSelectorQuery().selectAll('.section').boundingClientRect(rects => {
        rects.forEach((rect, index) => {
          if (rect.top <= scrollTop && rect.bottom >= scrollTop) {
            this.setData({
              currentSection: sections[index]
            })
          }
        })
      }).exec()
    },
  
    /**
     * 滚动到顶部
     */
    scrollToTop() {
      wx.createSelectorQuery().select('#mainScroll').scrollIntoView({
        selector: '#intro',
        offsetTop: 120,
        animated: true
      })
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
  
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