// const mysqlHelper = require('./../db/mysql-helper.js')
//
// /* eslint no-return-await:0 */
// class UserModel {
//   async findUserProfile() {
//     // Similar: return await query('select * from user where uid = ?', uid);
//     return await {
//       name: '淘小宝1',
//       department: '技术部',
//       // avatar:
//       //   'https://img.alicdn.com/tfs/TB1L6tBXQyWBuNjy0FpXXassXXa-80-80.png',
//       userid: 10001,
//     };
//   }
//     /**
//    * 增加一条数据
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async add ( args ) {
//     let sql = 'INSERT INTO userinfo(UserName, UserPass) VALUES(?, ?)'
//     let params = [args.username, args.userpass]
//     let result = await mysqlHelper.query(sql, params)
//     return result
//   }
//
//   /**
//    * 根据UserName得到一条数据
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async getByUserName( args ){
//     let sql = 'SELECT * FROM crud_user WHERE login_user = ?'
//     let params = [args.username]
//     // console.log(sql,params)
//     let result = await mysqlHelper.query(sql, params)
//     return result
//   }
//
//    /**
//    * 根据UserName得到数量
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async getCountByUserName( args ){
//     let sql = 'SELECT COUNT(1) AS UserNum FROM userinfo WHERE UserName = ?'
//     let params = [args.username]
//     let result = await mysqlHelper.query(sql, params)
//     return result
//   }
//
//
//   async getListByFilter( args ){
//     let sql = "SELECT Id, UserName, UserPass FROM userinfo WHERE UserName like ? limit ? ,? "
//     let whereParam
//     if(args.where.username != null){
//       whereParam = "%" + args.where.username + "%"
//     }
//     let params = [whereParam , args.offset , args.limit]
//     let result = await mysqlHelper.query(sql, params)
//     return result
//   }
//   async getCountByFilter( args ){
//     let sql = "SELECT COUNT(1) AS total FROM userinfo WHERE UserName like ?  "
//     let whereParam
//     if(args.username != null){
//       whereParam = "%" + args.username + "%"
//     }
//     let params = [whereParam]
//     let result = await mysqlHelper.query(sql, params)
//     return result
//   }
//
//   async getYearListByFilter( args ){
//     let sql = "SELECT * FROM Total_StaDev_Year  WHERE  1=1 "
//     if(args.ymonth != undefined){
//       sql  = sql +" and YMonth = " + args.ymonth
//     }
//
//     if(args.devicetype != undefined){
//       sql  = sql +" and DeviceType = " + args.devicetype
//     }
//     sql  = sql +" limit "+args.offset+" , "+args.limit
//
//     let result = await mysqlHelper.query(sql)
//     return result
//   }
//   async getYearCountByFilter( args ){
//     let sql = "SELECT COUNT(1) AS total FROM Total_StaDev_Year  WHERE  1=1 "
//     if(args.ymonth != undefined){
//       sql  = sql +" and YMonth = " + args.ymonth
//     }
//
//     if(args.devicetype != undefined){
//       sql  = sql +" and DeviceType = " + args.devicetype
//     }
//     let result = await mysqlHelper.query(sql)
//     return result
//   }
// }
//
// module.exports = new UserModel();
// const UserModel = require('../model/User');
//
// class UserService {
//   async profile() {
//     const data = await UserModel.findUserProfile();
//     return { data };
//   }
//
//   /**
//    * 增加一条数据
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async add ( args ) {
//     const data = await UserModel.add(args);
//     return { data };
//   }
//     /**
//    * 根据UserName得到一条数据
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async getByUserName( args ){
//     const data = await UserModel.getByUserName(args);
//     return { data };
//   }
//
//   /**
//    * 根据UserName得到数量
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async getCountByUserName( args ){
//     const data = await UserModel.getCountByUserName(args);
//     return { data };
//   }
//
//   async getListByFilter( args ){
//     return  await UserModel.getListByFilter(args);
//   }
//   async getCountByFilter( args ){
//     return await UserModel.getCountByFilter(args);
//   }
//
//   async getYearListByFilter( args ){
//     return  await UserModel.getYearListByFilter(args);
//   }
//   async getYearCountByFilter( args ){
//     return await UserModel.getYearCountByFilter(args);
//   }
//
// }
//
// module.exports = new UserService();
// const UserModel = require('../model/User');
//
// class UserService {
//   async profile() {
//     const data = await UserModel.findUserProfile();
//     return { data };
//   }
//
//   /**
//    * 增加一条数据
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async add ( args ) {
//     const data = await UserModel.add(args);
//     return { data };
//   }
//     /**
//    * 根据UserName得到一条数据
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async getByUserName( args ){
//     const data = await UserModel.getByUserName(args);
//     return { data };
//   }
//
//   /**
//    * 根据UserName得到数量
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async getCountByUserName( args ){
//     const data = await UserModel.getCountByUserName(args);
//     return { data };
//   }
//
//   async getListByFilter( args ){
//     return  await UserModel.getListByFilter(args);
//   }
//   async getCountByFilter( args ){
//     return await UserModel.getCountByFilter(args);
//   }
//
//   async getYearListByFilter( args ){
//     return  await UserModel.getYearListByFilter(args);
//   }
//   async getYearCountByFilter( args ){
//     return await UserModel.getYearCountByFilter(args);
//   }
//
// }
//
// module.exports = new UserService();
// const UserModel = require('../model/User');
//
// class UserService {
//   async profile() {
//     const data = await UserModel.findUserProfile();
//     return { data };
//   }
//
//   /**
//    * 增加一条数据
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async add ( args ) {
//     const data = await UserModel.add(args);
//     return { data };
//   }
//     /**
//    * 根据UserName得到一条数据
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async getByUserName( args ){
//     const data = await UserModel.getByUserName(args);
//     return { data };
//   }
//
//   /**
//    * 根据UserName得到数量
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async getCountByUserName( args ){
//     const data = await UserModel.getCountByUserName(args);
//     return { data };
//   }
//
//   async getListByFilter( args ){
//     return  await UserModel.getListByFilter(args);
//   }
//   async getCountByFilter( args ){
//     return await UserModel.getCountByFilter(args);
//   }
//
//   async getYearListByFilter( args ){
//     return  await UserModel.getYearListByFilter(args);
//   }
//   async getYearCountByFilter( args ){
//     return await UserModel.getYearCountByFilter(args);
//   }
//
// }
//
// module.exports = new UserService();
// const UserModel = require('../model/User');
//
// class UserService {
//   async profile() {
//     const data = await UserModel.findUserProfile();
//     return { data };
//   }
//
//   /**
//    * 增加一条数据
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async add ( args ) {
//     const data = await UserModel.add(args);
//     return { data };
//   }
//     /**
//    * 根据UserName得到一条数据
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async getByUserName( args ){
//     const data = await UserModel.getByUserName(args);
//     return { data };
//   }
//
//   /**
//    * 根据UserName得到数量
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async getCountByUserName( args ){
//     const data = await UserModel.getCountByUserName(args);
//     return { data };
//   }
//
//   async getListByFilter( args ){
//     return  await UserModel.getListByFilter(args);
//   }
//   async getCountByFilter( args ){
//     return await UserModel.getCountByFilter(args);
//   }
//
//   async getYearListByFilter( args ){
//     return  await UserModel.getYearListByFilter(args);
//   }
//   async getYearCountByFilter( args ){
//     return await UserModel.getYearCountByFilter(args);
//   }
//
// }
//
// module.exports = new UserService();
// const UserModel = require('../model/User');
//
// class UserService {
//   async profile() {
//     const data = await UserModel.findUserProfile();
//     return { data };
//   }
//
//   /**
//    * 增加一条数据
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async add ( args ) {
//     const data = await UserModel.add(args);
//     return { data };
//   }
//     /**
//    * 根据UserName得到一条数据
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async getByUserName( args ){
//     const data = await UserModel.getByUserName(args);
//     return { data };
//   }
//
//   /**
//    * 根据UserName得到数量
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async getCountByUserName( args ){
//     const data = await UserModel.getCountByUserName(args);
//     return { data };
//   }
//
//   async getListByFilter( args ){
//     return  await UserModel.getListByFilter(args);
//   }
//   async getCountByFilter( args ){
//     return await UserModel.getCountByFilter(args);
//   }
//
//   async getYearListByFilter( args ){
//     return  await UserModel.getYearListByFilter(args);
//   }
//   async getYearCountByFilter( args ){
//     return await UserModel.getYearCountByFilter(args);
//   }
//
// }
//
// module.exports = new UserService();
// const UserModel = require('../model/User');
//
// class UserService {
//   async profile() {
//     const data = await UserModel.findUserProfile();
//     return { data };
//   }
//
//   /**
//    * 增加一条数据
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async add ( args ) {
//     const data = await UserModel.add(args);
//     return { data };
//   }
//     /**
//    * 根据UserName得到一条数据
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async getByUserName( args ){
//     const data = await UserModel.getByUserName(args);
//     return { data };
//   }
//
//   /**
//    * 根据UserName得到数量
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async getCountByUserName( args ){
//     const data = await UserModel.getCountByUserName(args);
//     return { data };
//   }
//
//   async getListByFilter( args ){
//     return  await UserModel.getListByFilter(args);
//   }
//   async getCountByFilter( args ){
//     return await UserModel.getCountByFilter(args);
//   }
//
//   async getYearListByFilter( args ){
//     return  await UserModel.getYearListByFilter(args);
//   }
//   async getYearCountByFilter( args ){
//     return await UserModel.getYearCountByFilter(args);
//   }
//
// }
//
// module.exports = new UserService();
// const UserModel = require('../model/User');
//
// class UserService {
//   async profile() {
//     const data = await UserModel.findUserProfile();
//     return { data };
//   }
//
//   /**
//    * 增加一条数据
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async add ( args ) {
//     const data = await UserModel.add(args);
//     return { data };
//   }
//     /**
//    * 根据UserName得到一条数据
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async getByUserName( args ){
//     const data = await UserModel.getByUserName(args);
//     return { data };
//   }
//
//   /**
//    * 根据UserName得到数量
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async getCountByUserName( args ){
//     const data = await UserModel.getCountByUserName(args);
//     return { data };
//   }
//
//   async getListByFilter( args ){
//     return  await UserModel.getListByFilter(args);
//   }
//   async getCountByFilter( args ){
//     return await UserModel.getCountByFilter(args);
//   }
//
//   async getYearListByFilter( args ){
//     return  await UserModel.getYearListByFilter(args);
//   }
//   async getYearCountByFilter( args ){
//     return await UserModel.getYearCountByFilter(args);
//   }
//
// }
//
// module.exports = new UserService();
// const UserModel = require('../model/User');
//
// class UserService {
//   async profile() {
//     const data = await UserModel.findUserProfile();
//     return { data };
//   }
//
//   /**
//    * 增加一条数据
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async add ( args ) {
//     const data = await UserModel.add(args);
//     return { data };
//   }
//     /**
//    * 根据UserName得到一条数据
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async getByUserName( args ){
//     const data = await UserModel.getByUserName(args);
//     return { data };
//   }
//
//   /**
//    * 根据UserName得到数量
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async getCountByUserName( args ){
//     const data = await UserModel.getCountByUserName(args);
//     return { data };
//   }
//
//   async getListByFilter( args ){
//     return  await UserModel.getListByFilter(args);
//   }
//   async getCountByFilter( args ){
//     return await UserModel.getCountByFilter(args);
//   }
//
//   async getYearListByFilter( args ){
//     return  await UserModel.getYearListByFilter(args);
//   }
//   async getYearCountByFilter( args ){
//     return await UserModel.getYearCountByFilter(args);
//   }
//
// }
//
// module.exports = new UserService();
// const UserModel = require('../model/User');
//
// class UserService {
//   async profile() {
//     const data = await UserModel.findUserProfile();
//     return { data };
//   }
//
//   /**
//    * 增加一条数据
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async add ( args ) {
//     const data = await UserModel.add(args);
//     return { data };
//   }
//     /**
//    * 根据UserName得到一条数据
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async getByUserName( args ){
//     const data = await UserModel.getByUserName(args);
//     return { data };
//   }
//
//   /**
//    * 根据UserName得到数量
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async getCountByUserName( args ){
//     const data = await UserModel.getCountByUserName(args);
//     return { data };
//   }
//
//   async getListByFilter( args ){
//     return  await UserModel.getListByFilter(args);
//   }
//   async getCountByFilter( args ){
//     return await UserModel.getCountByFilter(args);
//   }
//
//   async getYearListByFilter( args ){
//     return  await UserModel.getYearListByFilter(args);
//   }
//   async getYearCountByFilter( args ){
//     return await UserModel.getYearCountByFilter(args);
//   }
//
// }
//
// module.exports = new UserService();
// const UserModel = require('../model/User');
//
// class UserService {
//   async profile() {
//     const data = await UserModel.findUserProfile();
//     return { data };
//   }
//
//   /**
//    * 增加一条数据
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async add ( args ) {
//     const data = await UserModel.add(args);
//     return { data };
//   }
//     /**
//    * 根据UserName得到一条数据
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async getByUserName( args ){
//     const data = await UserModel.getByUserName(args);
//     return { data };
//   }
//
//   /**
//    * 根据UserName得到数量
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async getCountByUserName( args ){
//     const data = await UserModel.getCountByUserName(args);
//     return { data };
//   }
//
//   async getListByFilter( args ){
//     return  await UserModel.getListByFilter(args);
//   }
//   async getCountByFilter( args ){
//     return await UserModel.getCountByFilter(args);
//   }
//
//   async getYearListByFilter( args ){
//     return  await UserModel.getYearListByFilter(args);
//   }
//   async getYearCountByFilter( args ){
//     return await UserModel.getYearCountByFilter(args);
//   }
//
// }
//
// module.exports = new UserService();
// const UserModel = require('../model/User');
//
// class UserService {
//   async profile() {
//     const data = await UserModel.findUserProfile();
//     return { data };
//   }
//
//   /**
//    * 增加一条数据
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async add ( args ) {
//     const data = await UserModel.add(args);
//     return { data };
//   }
//     /**
//    * 根据UserName得到一条数据
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async getByUserName( args ){
//     const data = await UserModel.getByUserName(args);
//     return { data };
//   }
//
//   /**
//    * 根据UserName得到数量
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async getCountByUserName( args ){
//     const data = await UserModel.getCountByUserName(args);
//     return { data };
//   }
//
//   async getListByFilter( args ){
//     return  await UserModel.getListByFilter(args);
//   }
//   async getCountByFilter( args ){
//     return await UserModel.getCountByFilter(args);
//   }
//
//   async getYearListByFilter( args ){
//     return  await UserModel.getYearListByFilter(args);
//   }
//   async getYearCountByFilter( args ){
//     return await UserModel.getYearCountByFilter(args);
//   }
//
// }
//
// module.exports = new UserService();
// const UserModel = require('../model/User');
//
// class UserService {
//   async profile() {
//     const data = await UserModel.findUserProfile();
//     return { data };
//   }
//
//   /**
//    * 增加一条数据
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async add ( args ) {
//     const data = await UserModel.add(args);
//     return { data };
//   }
//     /**
//    * 根据UserName得到一条数据
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async getByUserName( args ){
//     const data = await UserModel.getByUserName(args);
//     return { data };
//   }
//
//   /**
//    * 根据UserName得到数量
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async getCountByUserName( args ){
//     const data = await UserModel.getCountByUserName(args);
//     return { data };
//   }
//
//   async getListByFilter( args ){
//     return  await UserModel.getListByFilter(args);
//   }
//   async getCountByFilter( args ){
//     return await UserModel.getCountByFilter(args);
//   }
//
//   async getYearListByFilter( args ){
//     return  await UserModel.getYearListByFilter(args);
//   }
//   async getYearCountByFilter( args ){
//     return await UserModel.getYearCountByFilter(args);
//   }
//
// }
//
// module.exports = new UserService();
// const UserModel = require('../model/User');
//
// class UserService {
//   async profile() {
//     const data = await UserModel.findUserProfile();
//     return { data };
//   }
//
//   /**
//    * 增加一条数据
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async add ( args ) {
//     const data = await UserModel.add(args);
//     return { data };
//   }
//     /**
//    * 根据UserName得到一条数据
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async getByUserName( args ){
//     const data = await UserModel.getByUserName(args);
//     return { data };
//   }
//
//   /**
//    * 根据UserName得到数量
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async getCountByUserName( args ){
//     const data = await UserModel.getCountByUserName(args);
//     return { data };
//   }
//
//   async getListByFilter( args ){
//     return  await UserModel.getListByFilter(args);
//   }
//   async getCountByFilter( args ){
//     return await UserModel.getCountByFilter(args);
//   }
//
//   async getYearListByFilter( args ){
//     return  await UserModel.getYearListByFilter(args);
//   }
//   async getYearCountByFilter( args ){
//     return await UserModel.getYearCountByFilter(args);
//   }
//
// }
//
// module.exports = new UserService();
// const UserModel = require('../model/User');
//
// class UserService {
//   async profile() {
//     const data = await UserModel.findUserProfile();
//     return { data };
//   }
//
//   /**
//    * 增加一条数据
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async add ( args ) {
//     const data = await UserModel.add(args);
//     return { data };
//   }
//     /**
//    * 根据UserName得到一条数据
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async getByUserName( args ){
//     const data = await UserModel.getByUserName(args);
//     return { data };
//   }
//
//   /**
//    * 根据UserName得到数量
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async getCountByUserName( args ){
//     const data = await UserModel.getCountByUserName(args);
//     return { data };
//   }
//
//   async getListByFilter( args ){
//     return  await UserModel.getListByFilter(args);
//   }
//   async getCountByFilter( args ){
//     return await UserModel.getCountByFilter(args);
//   }
//
//   async getYearListByFilter( args ){
//     return  await UserModel.getYearListByFilter(args);
//   }
//   async getYearCountByFilter( args ){
//     return await UserModel.getYearCountByFilter(args);
//   }
//
// }
//
// module.exports = new UserService();
// const UserModel = require('../model/User');
//
// class UserService {
//   async profile() {
//     const data = await UserModel.findUserProfile();
//     return { data };
//   }
//
//   /**
//    * 增加一条数据
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async add ( args ) {
//     const data = await UserModel.add(args);
//     return { data };
//   }
//     /**
//    * 根据UserName得到一条数据
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async getByUserName( args ){
//     const data = await UserModel.getByUserName(args);
//     return { data };
//   }
//
//   /**
//    * 根据UserName得到数量
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async getCountByUserName( args ){
//     const data = await UserModel.getCountByUserName(args);
//     return { data };
//   }
//
//   async getListByFilter( args ){
//     return  await UserModel.getListByFilter(args);
//   }
//   async getCountByFilter( args ){
//     return await UserModel.getCountByFilter(args);
//   }
//
//   async getYearListByFilter( args ){
//     return  await UserModel.getYearListByFilter(args);
//   }
//   async getYearCountByFilter( args ){
//     return await UserModel.getYearCountByFilter(args);
//   }
//
// }
//
// module.exports = new UserService();
// const UserModel = require('../model/User');
//
// class UserService {
//   async profile() {
//     const data = await UserModel.findUserProfile();
//     return { data };
//   }
//
//   /**
//    * 增加一条数据
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async add ( args ) {
//     const data = await UserModel.add(args);
//     return { data };
//   }
//     /**
//    * 根据UserName得到一条数据
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async getByUserName( args ){
//     const data = await UserModel.getByUserName(args);
//     return { data };
//   }
//
//   /**
//    * 根据UserName得到数量
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async getCountByUserName( args ){
//     const data = await UserModel.getCountByUserName(args);
//     return { data };
//   }
//
//   async getListByFilter( args ){
//     return  await UserModel.getListByFilter(args);
//   }
//   async getCountByFilter( args ){
//     return await UserModel.getCountByFilter(args);
//   }
//
//   async getYearListByFilter( args ){
//     return  await UserModel.getYearListByFilter(args);
//   }
//   async getYearCountByFilter( args ){
//     return await UserModel.getYearCountByFilter(args);
//   }
//
// }
//
// module.exports = new UserService();
// const UserModel = require('../model/User');
//
// class UserService {
//   async profile() {
//     const data = await UserModel.findUserProfile();
//     return { data };
//   }
//
//   /**
//    * 增加一条数据
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async add ( args ) {
//     const data = await UserModel.add(args);
//     return { data };
//   }
//     /**
//    * 根据UserName得到一条数据
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async getByUserName( args ){
//     const data = await UserModel.getByUserName(args);
//     return { data };
//   }
//
//   /**
//    * 根据UserName得到数量
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async getCountByUserName( args ){
//     const data = await UserModel.getCountByUserName(args);
//     return { data };
//   }
//
//   async getListByFilter( args ){
//     return  await UserModel.getListByFilter(args);
//   }
//   async getCountByFilter( args ){
//     return await UserModel.getCountByFilter(args);
//   }
//
//   async getYearListByFilter( args ){
//     return  await UserModel.getYearListByFilter(args);
//   }
//   async getYearCountByFilter( args ){
//     return await UserModel.getYearCountByFilter(args);
//   }
//
// }
//
// module.exports = new UserService();
// const UserModel = require('../model/User');
//
// class UserService {
//   async profile() {
//     const data = await UserModel.findUserProfile();
//     return { data };
//   }
//
//   /**
//    * 增加一条数据
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async add ( args ) {
//     const data = await UserModel.add(args);
//     return { data };
//   }
//     /**
//    * 根据UserName得到一条数据
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async getByUserName( args ){
//     const data = await UserModel.getByUserName(args);
//     return { data };
//   }
//
//   /**
//    * 根据UserName得到数量
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async getCountByUserName( args ){
//     const data = await UserModel.getCountByUserName(args);
//     return { data };
//   }
//
//   async getListByFilter( args ){
//     return  await UserModel.getListByFilter(args);
//   }
//   async getCountByFilter( args ){
//     return await UserModel.getCountByFilter(args);
//   }
//
//   async getYearListByFilter( args ){
//     return  await UserModel.getYearListByFilter(args);
//   }
//   async getYearCountByFilter( args ){
//     return await UserModel.getYearCountByFilter(args);
//   }
//
// }
//
// module.exports = new UserService();
// const UserModel = require('../model/User');
//
// class UserService {
//   async profile() {
//     const data = await UserModel.findUserProfile();
//     return { data };
//   }
//
//   /**
//    * 增加一条数据
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async add ( args ) {
//     const data = await UserModel.add(args);
//     return { data };
//   }
//     /**
//    * 根据UserName得到一条数据
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async getByUserName( args ){
//     const data = await UserModel.getByUserName(args);
//     return { data };
//   }
//
//   /**
//    * 根据UserName得到数量
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async getCountByUserName( args ){
//     const data = await UserModel.getCountByUserName(args);
//     return { data };
//   }
//
//   async getListByFilter( args ){
//     return  await UserModel.getListByFilter(args);
//   }
//   async getCountByFilter( args ){
//     return await UserModel.getCountByFilter(args);
//   }
//
//   async getYearListByFilter( args ){
//     return  await UserModel.getYearListByFilter(args);
//   }
//   async getYearCountByFilter( args ){
//     return await UserModel.getYearCountByFilter(args);
//   }
//
// }
//
// module.exports = new UserService();
// const UserModel = require('../model/User');
//
// class UserService {
//   async profile() {
//     const data = await UserModel.findUserProfile();
//     return { data };
//   }
//
//   /**
//    * 增加一条数据
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async add ( args ) {
//     const data = await UserModel.add(args);
//     return { data };
//   }
//     /**
//    * 根据UserName得到一条数据
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async getByUserName( args ){
//     const data = await UserModel.getByUserName(args);
//     return { data };
//   }
//
//   /**
//    * 根据UserName得到数量
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async getCountByUserName( args ){
//     const data = await UserModel.getCountByUserName(args);
//     return { data };
//   }
//
//   async getListByFilter( args ){
//     return  await UserModel.getListByFilter(args);
//   }
//   async getCountByFilter( args ){
//     return await UserModel.getCountByFilter(args);
//   }
//
//   async getYearListByFilter( args ){
//     return  await UserModel.getYearListByFilter(args);
//   }
//   async getYearCountByFilter( args ){
//     return await UserModel.getYearCountByFilter(args);
//   }
//
// }
//
// module.exports = new UserService();
// const UserModel = require('../model/User');
//
// class UserService {
//   async profile() {
//     const data = await UserModel.findUserProfile();
//     return { data };
//   }
//
//   /**
//    * 增加一条数据
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async add ( args ) {
//     const data = await UserModel.add(args);
//     return { data };
//   }
//     /**
//    * 根据UserName得到一条数据
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async getByUserName( args ){
//     const data = await UserModel.getByUserName(args);
//     return { data };
//   }
//
//   /**
//    * 根据UserName得到数量
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async getCountByUserName( args ){
//     const data = await UserModel.getCountByUserName(args);
//     return { data };
//   }
//
//   async getListByFilter( args ){
//     return  await UserModel.getListByFilter(args);
//   }
//   async getCountByFilter( args ){
//     return await UserModel.getCountByFilter(args);
//   }
//
//   async getYearListByFilter( args ){
//     return  await UserModel.getYearListByFilter(args);
//   }
//   async getYearCountByFilter( args ){
//     return await UserModel.getYearCountByFilter(args);
//   }
//
// }
//
// module.exports = new UserService();
// const UserModel = require('../model/User');
//
// class UserService {
//   async profile() {
//     const data = await UserModel.findUserProfile();
//     return { data };
//   }
//
//   /**
//    * 增加一条数据
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async add ( args ) {
//     const data = await UserModel.add(args);
//     return { data };
//   }
//     /**
//    * 根据UserName得到一条数据
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async getByUserName( args ){
//     const data = await UserModel.getByUserName(args);
//     return { data };
//   }
//
//   /**
//    * 根据UserName得到数量
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async getCountByUserName( args ){
//     const data = await UserModel.getCountByUserName(args);
//     return { data };
//   }
//
//   async getListByFilter( args ){
//     return  await UserModel.getListByFilter(args);
//   }
//   async getCountByFilter( args ){
//     return await UserModel.getCountByFilter(args);
//   }
//
//   async getYearListByFilter( args ){
//     return  await UserModel.getYearListByFilter(args);
//   }
//   async getYearCountByFilter( args ){
//     return await UserModel.getYearCountByFilter(args);
//   }
//
// }
//
// module.exports = new UserService();
// const UserModel = require('../model/User');
//
// class UserService {
//   async profile() {
//     const data = await UserModel.findUserProfile();
//     return { data };
//   }
//
//   /**
//    * 增加一条数据
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async add ( args ) {
//     const data = await UserModel.add(args);
//     return { data };
//   }
//     /**
//    * 根据UserName得到一条数据
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async getByUserName( args ){
//     const data = await UserModel.getByUserName(args);
//     return { data };
//   }
//
//   /**
//    * 根据UserName得到数量
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async getCountByUserName( args ){
//     const data = await UserModel.getCountByUserName(args);
//     return { data };
//   }
//
//   async getListByFilter( args ){
//     return  await UserModel.getListByFilter(args);
//   }
//   async getCountByFilter( args ){
//     return await UserModel.getCountByFilter(args);
//   }
//
//   async getYearListByFilter( args ){
//     return  await UserModel.getYearListByFilter(args);
//   }
//   async getYearCountByFilter( args ){
//     return await UserModel.getYearCountByFilter(args);
//   }
//
// }
//
// module.exports = new UserService();
// const UserModel = require('../model/User');
//
// class UserService {
//   async profile() {
//     const data = await UserModel.findUserProfile();
//     return { data };
//   }
//
//   /**
//    * 增加一条数据
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async add ( args ) {
//     const data = await UserModel.add(args);
//     return { data };
//   }
//     /**
//    * 根据UserName得到一条数据
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async getByUserName( args ){
//     const data = await UserModel.getByUserName(args);
//     return { data };
//   }
//
//   /**
//    * 根据UserName得到数量
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async getCountByUserName( args ){
//     const data = await UserModel.getCountByUserName(args);
//     return { data };
//   }
//
//   async getListByFilter( args ){
//     return  await UserModel.getListByFilter(args);
//   }
//   async getCountByFilter( args ){
//     return await UserModel.getCountByFilter(args);
//   }
//
//   async getYearListByFilter( args ){
//     return  await UserModel.getYearListByFilter(args);
//   }
//   async getYearCountByFilter( args ){
//     return await UserModel.getYearCountByFilter(args);
//   }
//
// }
//
// module.exports = new UserService();
// const UserModel = require('../model/User');
//
// class UserService {
//   async profile() {
//     const data = await UserModel.findUserProfile();
//     return { data };
//   }
//
//   /**
//    * 增加一条数据
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async add ( args ) {
//     const data = await UserModel.add(args);
//     return { data };
//   }
//     /**
//    * 根据UserName得到一条数据
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async getByUserName( args ){
//     const data = await UserModel.getByUserName(args);
//     return { data };
//   }
//
//   /**
//    * 根据UserName得到数量
//    * @param  {object} args  参数
//    * @return {object}       结果
//    */
//   async getCountByUserName( args ){
//     const data = await UserModel.getCountByUserName(args);
//     return { data };
//   }
//
//   async getListByFilter( args ){
//     return  await UserModel.getListByFilter(args);
//   }
//   async getCountByFilter( args ){
//     return await UserModel.getCountByFilter(args);
//   }
//
//   async getYearListByFilter( args ){
//     return  await UserModel.getYearListByFilter(args);
//   }
//   async getYearCountByFilter( args ){
//     return await UserModel.getYearCountByFilter(args);
//   }
//
// }
//
// module.exports = new UserService();
