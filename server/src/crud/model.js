/* eslint no-return-await:0 */
const mysqlHelper = require('../db/mysql-helper');

class CrulModel {
  rnd(n, m) {
    var random = Math.floor(Math.random() * (m - n + 1) + n);
    return random;
  };

  getData() {
    return Array.from({length: 10}).map((item, index) => {
      return {
        id: index + 1,
        orderID: this.rnd(1, 100),
        name: '这是后台数据',
        title: `huangshangdi${index}`,
        date: `2018-06-${index + 1}`,
        endDate: `2018-06-${index + 1}`,
        validData: `2018-06-${index + 1}`,
        category: '皮肤科',
        state: '已审核',
        approver: '刘建明',
        approvalData: `2018-06-${index + 1}`,
      };
    });
  };

  async findUserProfile() {
    return await {
      name: '淘小宝',
      department: '技术部',
      avatar:'',
      userid: 10001,
      data: this.getData()
    };
  };

  async getCrudBase(args) {
    let sql1 = 'SELECT * FROM crud_table where table_id =?';
    // let sql2 = 'SELECT * FROM crud_field where table_id =? order by display_sort';
    let sql2='SELECT * FROM crud_field where table_id =? order by case when display_sort is null then 2 else 1 end,display_sort'
    let params = [args];
    let base = await mysqlHelper.query(sql1, params);
    if (base.length == 0) {
      return {
        result: false,
      }
    } else {
      let fields = await mysqlHelper.query(sql2, params);
      return {
        result: true,
        base: base[0],
        fields: fields,
      }
    }
  }

  async getApiFieldsByParams(args) {
    let sql = 'SELECT * FROM crud_field where 1=1 ';
    return await mysqlHelper.query(sql);
  }

  async getExportData(args) {
    // console.log(args.table)
    let sql = "SELECT * FROM " + args.table + " limit 0,?";
    let params = [args.max];
    // console.log(sql, params)
    let data = await mysqlHelper.query(sql, params);
    return data
  }

  async getfullCols(table) {
    // console.log(table)
    let sql = "Show full columns FROM " + table
    // console.log(sql)
    let data = await mysqlHelper.query(sql);
    return data
  }
  async insertData(args) {
    // console.log(args.table)
    // console.log(args)
    let sql = "INSERT into " + args.table + " ("
    args.fields.map(function (v, i) {
      sql = sql + v + ","
    });
    sql = sql.slice(0, sql.length - 1);
    sql = sql + ") values("
    args.value.map(function (v, i) {
      sql = sql + "'" + v + "'" + ","
    });
    sql = sql.slice(0, sql.length - 1);
    sql = sql + ")"
    // let params = [args.fields.join(','),args.value.join(',')];
    // console.log(sql)
    let data = await mysqlHelper.queryResult(sql);
    return data
  }
}

module.exports = new CrulModel();
