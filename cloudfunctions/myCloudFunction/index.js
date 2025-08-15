// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database();
// 获取openid
const getOpenId = async () => {
  // 获取基础信息
  const wxContext = cloud.getWXContext();
  return {
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  };
};

// 新增数据
//_id自动创建
const insertRecord = async (event) => {
  try {
    const insertRecord = event.data;
    const { OPENID } = cloud.getWXContext();
    // 插入数据
    await db.collection("riskRecord").add({
      data: {
        riskLevel:insertRecord.riskLevel,
        screenTable:insertRecord.screenTable,
        openid:OPENID,
      },
    });
    return {
      success: true,
      data: event.data,
    };
  } catch (e) {
    return {
      success: false,
      errMsg: e,
    };
  }
};

// 查询数据
const selectRecord = async (event) => {
  const { OPENID } = cloud.getWXContext();
  // 返回数据库查询结果
  return await db.collection("riskRecord").where({
    openid:db.command.eq(OPENID)
  }).get();
};


// 更新数据
/*
更新的时候通过_id查询数据条目！！！
*/ 
const updateRecord = async (event) => {
  try {
    // 遍历修改数据库信息
    for (let i = 0; i < event.data.length; i++) {
      await db
        .collection("riskRecord")
        .where({
          _id: event.data[i]._id,
        })
        .update({
          data: {
            riskLevel:event.data[i].riskLevel,
            screenTable:event.data[i].screenTable,
          },
        });
    }
    return {
      success: true,
      data: event.data,
    };
  } catch (e) {
    return {
      success: false,
      errMsg: e,
    };
  }
};

// 云函数入口函数
exports.main = async (event, context) => {
  switch(event.type){
    case "getOpenId":
      return await getOpenId();
    case "insertRecord":
      return await insertRecord(event);
    case "selectRecord":
      return await selectRecord(event);
    case "updateRecord":
      return await updateRecord(event);
  }
}