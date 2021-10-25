const MockController = require('./mock');
const retCode = require('../utils/retcode')

class MongoController {
  //获取某油田下井号
  async getJHbyMongo(ctx){
    let params=ctx.request.body;
    let list = await MockController.getJHbyMongo(params);
    ctx.body = {
      status: 200,
      statusText: 'search data from getJHbyMongo mongodb ok',
      data: list,
    }
  }
  //获取某油田下井号的曲线列表
  async getQxwjmbyMongo(ctx){
    let params=ctx.request.body;
    let list = await MockController.getQxwjmbyMongo(params);
    ctx.body = {
      status: 200,
      statusText: 'search data from getQxwjmbyMongo mongodb ok',
      data: list,
    }
  }
  //获取某曲线下指标列表
  async getZbmcbyMongo(ctx){
    let params=ctx.request.body;
    let data = await MockController.getZbmcbyMongo(params);
    ctx.body = {
      status: 200,
      statusText: 'search data from getZbmcbyMongo mongodb ok',
      data: data,
    }
  }

}

module.exports = new MongoController();
