// pages/forms/colorectum/colorectum.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData: {
        cancerType:'',
        // 一、一级亲属有结直肠癌史
        firstDegreeRelative: '',       // 是/否/不确定
        relativeRelation: '',          // 亲属关系（当选择"是"时填写）
        
        // 二、本人有癌症史
        personalCancerHistory: '',     // 是/否/不确定
        cancerType: '',                // 癌症类型（当选择"是"时填写）
        
        // 三、本人有肠道息肉史
        intestinalPolyps: '',          // 是/否/不确定
        polypType: '',                 // 息肉类型（当选择"是"时填写）
        
        // 四、多项风险因素
        chronicConstipation: '',       // 慢性便秘
        chronicDiarrhea: '',           // 慢性腹泻
        mucusBloodStool: '',           // 黏液血便
        badLifeEvents: '',             // 不良生活事件史
        eventDescription: '',          // 事件说明（当选择"是"时填写）
        appendicitisHistory: '',       // 慢性阑尾炎或阑尾切除史
        appendectomyTime: '',          // 手术时间（当选择"是"时填写）
        biliaryDiseaseHistory: '',     // 慢性胆道疾病史或胆囊切除史
        biliaryDetails: ''             // 疾病类型/手术时间（当选择"是"时填写）
      },
      riskLevel: ''
  },

  /**
   * 处理单选框变化
   */
  handleRadioChange(e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    
    if (field && value !== undefined) {
      this.setData({
        [`formData.${field}`]: value
      });
    }
  },

  /**
   * 处理输入框变化
   */
  handleInput(e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    
    if (field) {
      this.setData({
        [`formData.${field}`]: value
      });
    }
  },

  /**
   * 提交表单
   */
  submitForm() {
    const formData = this.data.formData;
    formData.cancerType='colorectum';
    
    // 验证所有必选项是否已填写
    const requiredFields = [
      'firstDegreeRelative',
      'personalCancerHistory',
      'intestinalPolyps',
      'chronicConstipation',
      'chronicDiarrhea',
      'mucusBloodStool',
      'badLifeEvents',
      'appendicitisHistory',
      'biliaryDiseaseHistory'
    ];
    
    // 检查是否有未填写的必选项
    const emptyFields = requiredFields.filter(field => !formData[field]);
    if (emptyFields.length > 0) {
      wx.showToast({
        title: '请完成所有问题后提交',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    
    // 验证条件必填项
    if (formData.firstDegreeRelative === 'yes' && !formData.relativeRelation) {
      wx.showToast({
        title: '请填写亲属关系',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    
    if (formData.personalCancerHistory === 'yes' && !formData.cancerType) {
      wx.showToast({
        title: '请填写癌症类型',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    
    if (formData.intestinalPolyps === 'yes' && !formData.polypType) {
      wx.showToast({
        title: '请填写息肉类型',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    
    if (formData.badLifeEvents === 'yes' && !formData.eventDescription) {
      wx.showToast({
        title: '请简要说明事件',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    
    if (formData.appendicitisHistory === 'yes' && !formData.appendectomyTime) {
      wx.showToast({
        title: '请注明手术时间',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    
    if (formData.biliaryDiseaseHistory === 'yes' && !formData.biliaryDetails) {
      wx.showToast({
        title: '请注明疾病类型/手术时间',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    // 结直肠癌高风险人群判定逻辑
    let isHighRisk = false;

    // 风险因素1：一级亲属有结直肠癌史
    const hasFirstDegreeRelativeHistory = formData.firstDegreeRelative === 'yes';

    // 风险因素2：本人有癌症史（任何恶性肿瘤病史）
    const hasPersonalCancerHistory = formData.personalCancerHistory === 'yes';

    // 风险因素3：本人有肠道息肉史
    const hasIntestinalPolyps = formData.intestinalPolyps === 'yes';

    // 风险因素4：同时具有以下2项及以上者
    // 统计符合的项数
    let riskCount = 0;
    // 4.1 慢性便秘
    if (formData.chronicConstipation === 'yes') riskCount++;
    // 4.2 慢性腹泻
    if (formData.chronicDiarrhea === 'yes') riskCount++;
    // 4.3 黏液血便
    if (formData.mucusBloodStool === 'yes') riskCount++;
    // 4.4 不良生活事件史
    if (formData.badLifeEvents === 'yes') riskCount++;
    // 4.5 慢性阑尾炎或阑尾切除史
    if (formData.appendicitisHistory === 'yes') riskCount++;
    // 4.6 慢性胆道疾病史或胆囊切除史
    if (formData.biliaryDiseaseHistory === 'yes') riskCount++;
    // 判断是否满足2项及以上
    const hasMultipleRiskFactors = riskCount >= 2;

    // 符合任何1项或以上即列为高风险人群
    isHighRisk = hasFirstDegreeRelativeHistory || hasPersonalCancerHistory || hasIntestinalPolyps || hasMultipleRiskFactors;

    // 设置风险等级并保存数据
    const riskLevel = isHighRisk ? 'high' : 'low';

    this.setData({
        riskLevel: riskLevel,
    })

    const saveData = {
        formData:formData,
        riskLevel:riskLevel
    };

    wx.setStorageSync('colorectumData', saveData);
    console.log(saveData);
    try{
    wx.cloud.callFunction({
      name:"myCloudFunction",
      data:{
        type:"insertRecord",
        data:{
          riskLevel:riskLevel,
          screenTable:formData
        }
      }
    })
  } catch (e) {
    wx.showToast({ title: "存储失败", icon: "none" });
  } 

    // 显示提交成功提示
    wx.showToast({
      title: '提交成功',
      icon: 'success',
      duration: 3000,
      success: () =>{
          wx.redirectTo({
            url: '/pages/result/colorectumResult/colorectumResult',
          })
      }
    });
    

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