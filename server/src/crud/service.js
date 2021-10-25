const CrulModel = require('./model');

class CrulService {
  async profile() {
    const data = await CrulModel.findUserProfile();
    return { data };
  }
  async getCrudBase(args){
    return await CrulModel.getCrudBase(args);
  }
  async getApiFieldsByParams(args){
    return await CrulModel.getApiFieldsByParams(args);
  }
  async getExportData(args){
    const data=await CrulModel.getExportData(args);
    return {data}
  }
}

module.exports = new CrulService();
