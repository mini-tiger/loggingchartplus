const mysqlHelper = require('../db/mysql-helper');
const mongodbHelper = require('../db/mongodb-helper');

const retCode = require('../utils/retcode')

class MockController {
  //获取某油田下井号
  async getJH(params){
    let sql="select DISTINCT jh  as label,jh as value from petrol_resource where yqtdm=?";

    let data = await mysqlHelper.query(sql,params);
    return data;
  }

  //获取某油田下井号的曲线列表
  async getwellflist(params){
    let sql="select DISTINCT qxwjm as label,qxwjm as value from petrol_resource where yqtdm=? and jh=?";
    let data = await mysqlHelper.query(sql,params);
    return data;
  }
  //获取某曲线下指标列表
  async getidxlist(params){
    let sql="select  ? from petrol_resource limit 1";

    let data=false
    try{
      let result =await mysqlHelper.query(sql,params);
      data = true
    }catch(e){}
    return data;
  }

  //获取mongo获取某油田下井号
  async getJHbyMongo(params){
    let data = await mongodbHelper.distinct("petrol_raw","JH",{});
    return data;
  }
  //获取mongo获取某井下的曲线文件名
  async getQxwjmbyMongo(params){
    let data = await mongodbHelper.distinct("petrol_raw","QXWJM",params);
    return data;
  }
    //获取mongo获取某井下的曲线文件名
    async getZbmcbyMongo(params){
      let data = await mongodbHelper.find("petrol_raw",params);
      return data;
    }
}

module.exports = new MockController();
