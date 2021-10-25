const UserModel = require('../model/User');

class UserService {
  async profile() {
    const data = await UserModel.findUserProfile();
    return { data };
  }

  /**
   * 增加一条数据
   * @param  {object} args  参数
   * @return {object}       结果
   */
  async add ( args ) {
    const data = await UserModel.add(args);
    return { data };
  }
    /**
   * 根据UserName得到一条数据
   * @param  {object} args  参数
   * @return {object}       结果
   */
  async getByUserName( args ){
    const data = await UserModel.getByUserName(args);
    return { data };
  }

  /**
   * 根据UserName得到数量
   * @param  {object} args  参数
   * @return {object}       结果
   */
  async getCountByUserName( args ){
    const data = await UserModel.getCountByUserName(args);
    return { data };
  }

  async getListByFilter( args ){
    return  await UserModel.getListByFilter(args);
  }
  async getCountByFilter( args ){
    return await UserModel.getCountByFilter(args);
  }

  async getYearListByFilter( args ){
    return  await UserModel.getYearListByFilter(args);
  }
  async getYearCountByFilter( args ){
    return await UserModel.getYearCountByFilter(args);
  }

}

module.exports = new UserService();
