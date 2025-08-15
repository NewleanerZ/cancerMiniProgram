// pages/forms/esophagus/esophahus.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData:{
        cancerType:'',
        //个人信息
        gender:'',      //male, female
        age:'',
        residence:'',         

        //家族病史
        familyCancerHistory:'',     //家族病史
        familyCancerDetails:'',     //家族病史细节

        //饮食习惯与生活方式，除特殊问题外，分为yes, occasionally, no
        hotDeit:'',     //热烫饮食的习惯
        highSaltDeit:'',    //高盐饮食
        preservedFood:'',   //食用腌制食品 often, occasionally, no
        preservedOften:'',  //每周食用腌制食品次数
        preservedOccasionally:'',    //每月食用腌制食品次数
        smoking:'',     //吸烟 分为yes, quit, no
        cigarettesPerDay:'',    //吸烟频率 
        smokingYears:'',    //烟龄 
        quitBefore:'',      //戒烟前每日吸烟频率 
        quitYears:'',       //戒烟的烟龄 
        quitDuration:'',     //戒烟年数 
        drinking:'',    //重度饮酒
        alcoholAmount:'',   //酒精量

        //既往病史 分为yes, no
        chronicEsophagitis: '',     //慢性食管炎
        esophagitisYears: '',       //慢性食管炎患病时长    
        esophagitisDesc: '',        //慢性食管炎病情描述
        barrettEsophagus: '',       //巴雷特食管
        barrettYears: '',           //巴雷特食管患病时长
        barrettDesc: '',            //巴雷特食管病情描述
        esophagealDiverticulum: '', //食管憩室
        diverticulumYears: '',      //食管憩室患病时长
        diverticulumDesc: '',       //食管憩室病情描述
        achalasia: '',              //贲门失弛缓症
        achalasiaYears: '',         //贲门失弛缓症患病时长
        achalasiaDesc: '',          //贲门失弛缓症病情描述
        refluxEsophagitis: '',      //反流性食管炎
        refluxYears: '',            //反流性食管炎患病时长
        refluxDesc: '',             //反流性食管炎病情描述
        benignStricture: '',        //食管良性狭窄
        strictureYears: '',         //食管良性狭窄患病时长
        strictureDesc: '',          //食管良性狭窄病情描述
        precancerousLesions: '',    //食管的癌前病变诊疗史
        precancerousDetails: ''     //食管的癌前病变诊疗史描述

    },
    riskLevel:'',            //用户风险等级
  },

  // 处理单选框变化
  handleRadioChange(e){
    const name = e.currentTarget.dataset.field
    const value = e.detail.value
      this.setData({
          [`formData.${name}`]:value
      })
  },

  handleInput(e) {
    const name = e.currentTarget.dataset.field
    const value = e.detail.value
    this.setData({
      [`formData.${name}`]: value
    })
  },

  submitForm(e){
    const formData = this.data.formData;
    formData.cancerType = 'esophagus';

      // 验证必填项
    const requiredFields = [
        'gender',
        'age',
        'residence',
        'familyCancerHistory',
        'hotDiet',
        'highSaltDiet',
        'preservedFood',
        'smoking',
        'drinking',
        'chronicEsophagitis',
        'barrettEsophagus',
        'esophagealDiverticulum',
        'achalasia',
        'refluxEsophagitis',
        'benignStricture',
        'precancerousLesions'
      ];

      // 检查是否有未填写的必填项
    const emptyFields = requiredFields.filter(field => !formData[field]);
    if (emptyFields.length > 0) {
        wx.showToast({
          title: '请完成所有问题',
          icon: 'none',
          duration: 2000
        })
        return;
    }

    // 检查条件必填项
    if (formData.familyCancerHistory === 'yes' && !formData.familyCancerDetails) {
        wx.showToast({
          title: '请填写家族病史详情',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      
      if (formData.preservedFood === 'often' && !formData.preservedOften) {
        wx.showToast({
          title: '请填写腌制食品食用次数',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      
      if (formData.preservedFood === 'occasionally' && !formData.preservedOccasionally) {
        wx.showToast({
          title: '请填写腌制食品食用次数',
          icon: 'none',
          duration: 2000
        })
        return;
      }

      if (formData.smoking === 'yes' && !formData.smokingYears){
        wx.showToast({
            title: '请填写烟龄',
            icon: 'none',
            duration: 2000
          })
          return;
      }

      if (formData.smoking === 'yes' && !formData.cigarettesPerDay){
        wx.showToast({
            title: '请填写每日吸烟数量',
            icon: 'none',
            duration: 2000
          })
          return;
      }

      if (formData.smoking === 'quit' && !formData.quitBefore){
        wx.showToast({
            title: '请填写戒烟前每日吸烟数量',
            icon: 'none',
            duration: 2000
          })
          return;
      }

      if (formData.smoking === 'quit' && !formData.quitYears){
        wx.showToast({
            title: '请填写戒烟前烟龄',
            icon: 'none',
            duration: 2000
          })
          return;
      }

      if (formData.smoking === 'quit' && !formData.quitDuration){
        wx.showToast({
            title: '请填写已戒烟年数',
            icon: 'none',
            duration: 2000
          })
          return;
      }

      if (formData.drinking === 'often' && !formData.alcoholAmount){
        wx.showToast({
            title: '请填写每日饮酒量',
            icon: 'none',
            duration: 2000
          })
          return;
      }

       

    let isHighRisk = false;
    const age = parseInt(formData.age);
    console.log(age);

    if(age >= 45){
        // 筛选标准：符合以下任意一项即为高风险
    const riskFactors = [
        // 家族病史
        formData.familyCancerHistory === 'yes',
        // 热烫饮食习惯
        formData.hotDiet === 'yes',
        // 高盐饮食习惯
        formData.highSaltDiet === 'yes',
        // 经常食用腌制食品
        formData.preservedFood === 'often',
        // 吸烟（当前吸烟）
        formData.smoking === 'yes',
        // 重度饮酒
        formData.drinking === 'yes',
        // 慢性食管炎
        formData.chronicEsophagitis === 'yes',
        // 巴雷特食管
        formData.barrettEsophagus === 'yes',
        // 食管憩室
        formData.esophagealDiverticulum === 'yes',
        // 贲门失弛缓症
        formData.achalasia === 'yes',
        // 反流性食管炎
        formData.refluxEsophagitis === 'yes',
        // 食管良性狭窄
        formData.benignStricture === 'yes',
        // 食管的癌前病变诊疗史
        formData.precancerousLesions === 'yes'
      ];
  
      // 检查是否有任意一项风险因素为真
      isHighRisk = riskFactors.some(factor => factor);
    }
    
    const riskLevel = isHighRisk ? 'high' : 'low';
    this.setData({
        riskLevel:riskLevel
    });

    const saveData = {
        formData:formData,
        riskLevel:riskLevel
    };

    // 保存数据到本地存储
    wx.setStorageSync( 'esophahusData', saveData);
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
      duration: 2000,
      success: () => {
          wx.redirectTo({
            url: '/pages/result/esophagusResult/esophagusResult',
          })
      }
    });
    
    console.log('筛查结果:', riskLevel, '表单数据:', saveData);
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