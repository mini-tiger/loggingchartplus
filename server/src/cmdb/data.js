const mysqlHelper = require('../db/mysql-helper');
const redisHelper = require('../db/redis-helper');
const config = require('../config/config');
const db_name = config.MYSQL.database;


class Controller {
  async insertCrud(args) {
    let sql = "insert into crud_field ";
    let filed = "(";
    let value = "values ( ";
    for (let k in args) {
      filed += k + ",";
      value += '"' + args[k] + '"' + ',';
    }
    filed = (filed.substring(filed.length - 1) === ',') ? filed.substring(0, filed.length - 1) : filed;
    value = (value.substring(value.length - 1) === ',') ? value.substring(0, value.length - 1) : value;
    sql = sql + filed + " ) " + value + " )";
    let result = await mysqlHelper.query(sql);
    return result
  }

  async SelectCrud(args) {
    let sql = "select count(*) as count from crud_field where table_id = ? and field_id = ? and field_name = ?";
    let params = [args.table_id, args.field_id, args.field_name];
    let result = await mysqlHelper.query(sql, params);
    return new Promise((resolve, reject) => {
      resolve(result[0].count)
    });
  }

  async selectTypeByTableId(args) {
    let sql = "select count(*) as count from crud_field where table_id = ? and field_id = ?";
    let params = [args.table_id, args.field_id];
    // console.log("查询2者唯一")
    let result = await mysqlHelper.query(sql, params);
    return new Promise((resolve, reject) => {
      resolve(result[0].count)
    });
  }

  async updateCrud(args) {
    let sql = "update crud_field set field_name = ? where table_id = ? and field_id = ?";
    let params = [args.field_name, args.table_id, args.field_id];
    return await mysqlHelper.query(sql, params);
  }

  async insertDict(args) {
    let sql = "insert into crud_dict ";
    let filed = "(";
    let value = "values ( ";
    for (let k in args) {
      filed += k + ",";
      value += '"' + args[k] + '"' + ',';
    }
    filed = (filed.substring(filed.length - 1) === ',') ? filed.substring(0, filed.length - 1) : filed;
    value = (value.substring(value.length - 1) === ',') ? value.substring(0, value.length - 1) : value;
    sql = sql + filed + " ) " + value + " )";
    let result = await mysqlHelper.query(sql);
    // console.log("dict_sql------->", sql);
    return result
  }

  async selectDict(args) {
    let sql = "select count(*) as count from crud_dict where type = ? and label = ? and value = ?";
    let params = [args.type, args.label, args.value];
    let result = await mysqlHelper.query(sql, params);
    return new Promise((resolve, reject) => {
      resolve(result[0].count)
    });
  }

  async selectDicteByType(args) {
    let sql = "select count(*) as count from crud_dict where type = ? and value = ?";
    let params = [args.type, args.value];
    let result = await mysqlHelper.query(sql, params);
    return new Promise((resolve, reject) => {
      resolve(result[0].count)
    });
  }

  async updateDict(args) {
    let sql = "update crud_dict set label = ? where type = ? and value = ?";
    let params = [args.label, args.type, args.value];
    return await mysqlHelper.query(sql, params);
  }

  async selectTable(args) {
    let sql = "select count(*) as count from crud_table where table_id = ? and table_name = ?";
    let params = [args.table_id, args.table_name];
    let result = await mysqlHelper.query(sql, params);
    return new Promise((resolve, reject) => {
      resolve(result[0].count)
    });
  }

  async selectTableById(args) {
    let sql = "select count(*) as count from crud_table where table_id = ?";
    let params = [args.table_id];
    let result = await mysqlHelper.query(sql, params);
    return new Promise((resolve, reject) => {
      resolve(result[0].count)
    });
  }

  async updateTable(args) {
    let sql = "update crud_table set table_name = ? where table_id = ?";
    let params = [args.table_name, args.table_id];
    // console.log("updateTable----->", sql)
    return await mysqlHelper.query(sql, params);
  }

  async insertTable(args) {
    let sql = "insert into crud_table ";
    let filed = "(";
    let value = "values ( ";
    for (let k in args) {
      filed += k + ",";
      value += '"' + args[k] + '"' + ',';
    }
    filed = (filed.substring(filed.length - 1) === ',') ? filed.substring(0, filed.length - 1) : filed;
    value = (value.substring(value.length - 1) === ',') ? value.substring(0, value.length - 1) : value;
    sql = sql + filed + " ) " + value + " )";
    // console.log("insertTable------->", sql);
    return await mysqlHelper.query(sql);

  }

}

module.exports = new Controller();
