// pages/forms/stomach/stomach.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
      formData: {
        cancerType:'',
        // 一、基础信息
        ageGroup: '',         // 年龄组 <45岁或≥45岁
        gender: '',           // 性别
        residence: '',        // 长期居住地
  
        // 二、健康与疾病史
        basicDiseases: [],    // 基础疾病
        otherBasicDisease: '',// 其他基础疾病
        stomachDiseases: [],  // 胃部疾病史
        familyCancerHistory: '', // 家族肿瘤史 yes, no, uncertain
        familyRelation: '',   // 亲属关系
        hpInfection: '',      // 幽门螺杆菌感染史 positive, neverTested, negative
        hpTestMethod: '',     // 幽门螺杆菌检测方式 brethTest, serumAntibody, fecalAntigen
        recentMedication: [], // 近期用药
  
        // 三、生活习惯
        smoking: '',          // 吸烟史 never, current, quit
        smokingYears: '',     // 吸烟年数
        cigarettesPerDay: '', // 每日吸烟量
        quitSmokingBefore: '',// 戒烟前每日吸烟量
        quitSmokingYears: '', // 戒烟年数
        drinking: '',         // 饮酒史 never, current, quit
        alcoholType: [],      // 饮酒类型
        alcoholFrequency: '', // 饮酒频率
        alcoholAmount: '',    // 每次饮酒量
        drinkingYears: '',    // 饮酒年数
        quitDrinkingYears: '',// 戒酒前饮酒年数
        saltIntake: '',       // 盐摄入量
        preservedFood: '',    // 腌制食品摄入
        freshFood: ''         // 新鲜蔬果摄入
      },
      riskLevel:''
    },
  
    // 处理单选框变化
    handleRadioChange(e) {
      const name = e.currentTarget.dataset.field
      const value = e.detail.value
      this.setData({
        [`formData.${name}`]: value
      })
    },
  
    // 处理复选框变化
    handleCheckboxChange(e) {
      const name = e.currentTarget.dataset.field
      const value = e.detail.value
      this.setData({
        [`formData.${name}`]: value
      })
    },
  
    // 处理输入框变化
    handleInput(e) {
      const name = e.currentTarget.dataset.field
      const value = e.detail.value
      this.setData({
        [`formData.${name}`]: value
      })
    },
  
    // 提交表单
    submitForm(e) {
      const formData = this.data.formData;
      formData.cancerType = 'stomach';
      // 验证必填项
      const requiredFields = [
        'ageGroup', 'gender', 'residence',
        'familyCancerHistory', 'hpInfection',
        'smoking', 'drinking', 'saltIntake',
        'preservedFood', 'freshFood'
      ];
  
      // 检查是否有未填写的必填项
      const emptyFields = requiredFields.filter(field => !formData[field]);
      if (formData.ageGroup === '>=45' && emptyFields.length > 0) {
        wx.showToast({
          title: '请完成所有必填问题',
          icon: 'none',
          duration: 2000
        })
        return;
      }
  
      // 条件验证
      if (formData.familyCancerHistory === 'yes' && !formData.familyRelation) {
        wx.showToast({
          title: '请填写亲属关系',
          icon: 'none',
          duration: 2000
        })
        return;
      }
  
      if (formData.hpInfection === 'positive' && !formData.hpTestMethod) {
        wx.showToast({
          title: '请选择检测方式',
          icon: 'none',
          duration: 2000
        })
        return;
      }
  
      if (formData.smoking === 'current' && (!formData.smokingYears || !formData.cigarettesPerDay)) {
        wx.showToast({
          title: '请填写吸烟信息',
          icon: 'none',
          duration: 2000
        })
        return;
      }
  
      if (formData.smoking === 'quit' && (!formData.quitSmokingBefore || !formData.quitSmokingYears)) {
        wx.showToast({
          title: '请填写戒烟信息',
          icon: 'none',
          duration: 2000
        })
        return;
      }
  
      if (formData.drinking === 'current' && (!formData.alcoholFrequency || !formData.alcoholAmount || formData.alcoholType.length === 0)) {
        wx.showToast({
          title: '请填写饮酒信息',
          icon: 'none',
          duration: 2000
        })
        return;
      }
  
      if (formData.drinking === 'quit' && !formData.quitDrinkingYears) {
        wx.showToast({
          title: '请填写戒酒前饮酒年数',
          icon: 'none',
          duration: 2000
        })
        return;
      }

      // 胃癌高发地区列表
    const highIncidenceAreas = [
        // 主要高发地区
        '武威', '张掖', '酒泉',       // 甘肃河西走廊
        '西宁', '海东', '海南藏族自治州', // 青海东部及环青海湖
        '临朐', '广饶', '淄博',       // 山东半岛及鲁中
        '庄河', '凤城', '岫岩',       // 辽宁辽东半岛
        '盐城', '淮安', '连云港',     // 江苏苏北
        // 其他高发区域
        '长乐', '漳州', '泉州',       // 福建沿海
        '喀什', '和田', '阿克苏',     // 新疆南疆
        '延安', '榆林', '吕梁',       // 陕西陕北及山西中南部
        '海北', '黄南藏族自治州'      // 青海环湖牧区
    ];

    let isHighRisk = false;

    if(formData.ageGroup === '>=45'){
        // 风险因素1：居住于胃癌高发县区
        const isHighIncidenceArea = highIncidenceAreas.includes(formData.residence);
        
        // 风险因素2：一级亲属有胃癌/食管癌史
        const hasFamilyHistory = formData.familyCancerHistory === 'yes';
        
        // 风险因素3：Hp检测阳性
        const hpPositive = formData.hpTestResult === 'positive';
        
        // 风险因素4：有癌前疾病（慢性萎缩性胃炎/胃溃疡/胃息肉等）
        const hasPrecancerousDiseases = formData.stomachDiseases && 
        formData.stomachDiseases.some(disease => 
            ['chronicAtrophicGastritis', 'gastricUlcer', 'gastricPolyps', 'postoperativeStomach', 'perniciousAnemia', 'hypertrophicGastritis'].includes(disease)
        );
        
        // 风险因素5：吸烟/重度饮酒/高盐饮食/常吃腌制食品
        // 吸烟（当前或累计>20包年：包年=每日包数×年数，1包=20支）
        const smokingRisk = formData.smoking === 'yes' && 
        (formData.smokingYears * (formData.smokingAmount / 20) > 20);
        // 重度饮酒（>40g酒精/日）
        const heavyDrinking = formData.drinking === 'yes' && formData.alcoholAmount > 40;
        // 高盐饮食（>10g盐/日）
        const highSaltDiet = formData.saltIntake > 10;
        // 常吃腌制食品（≥3次/周）
        const oftenPreservedFood = formData.preservedFoodFrequency >= 3;
        
        const hasLifeRisk = smokingRisk || heavyDrinking || highSaltDiet || oftenPreservedFood;

        // 满足任一项即判定为高风险
        isHighRisk = isHighIncidenceArea || hasFamilyHistory || hpPositive || hasPrecancerousDiseases || hasLifeRisk;
    }

    const riskLevel = isHighRisk ? 'high' : 'low';
    this.setData({
        riskLevel : riskLevel
    })

    const saveData = { formData, riskLevel};

    wx.setStorageSync('stomachData', saveData)

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

    wx.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 2000,
        success: () => {
            wx.redirectTo({
              url: '/pages/result/stomachResult/stomachResult',
            })
        }
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