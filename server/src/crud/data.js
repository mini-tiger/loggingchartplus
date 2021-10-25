const mysqlHelper = require('../db/mysql-helper');
const mongodbHelper = require('../db/mongodb-helper');
const redisHelper = require('../db/redis-helper');
const config = require('../config/config')
const pageSize = 100;
const db_name = config.MYSQL.database;
const db_init_template = 'insert into ' + db_name + '.crud_field (table_id,field_id,field_name,field_type) \
  select table_name,column_name,column_comment,data_type from information_schema.Columns \
  where  table_schema="' + db_name + '" and table_name= ? ';

const db_uninit_template = 'select table_name as label,table_name as value from information_schema.tables \
  where  table_schema="' + db_name + '" and table_name not in (select table_id from ' + db_name + '.crud_table)';

class MockController {
  //查询所有未初始化的数据表名称
  async unInitTable() {
    return await mysqlHelper.query(db_uninit_template)
  }

  //查询数据表是否存在
  async checkTable(crudParam) {

    let sql = 'select count(*) as recordCount from ' + crudParam.table_id
    //检查结果
    try {
      await mysqlHelper.query(sql);
      return true
    } catch (err) {
      return false
    }
  }

  //从数据库读取表结构，初始化到crud_field
  async initCrudConfig(crudParam) {
    //判断是否已完成初始化
    let checksql = 'select count(*) as recordCount from crud_table where table_id = "' + crudParam.table_id + '"';
    let result = await mysqlHelper.query(checksql);
    if (result[0].recordCount > 0) {
      return false;
    }

    let sql = 'insert into crud_table(table_id,table_name) values(?,?)';
    let param1 = [crudParam.table_id, crudParam.table_name];
    let param2 = [crudParam.table_id]

    try {
      //新建模块数据
      await mysqlHelper.query(sql, param1)
      //插入初始化字段数据
      await mysqlHelper.query(db_init_template, param2)
      //更新缓存
      let key = 'CRUD-BASE';
      await redisHelper.redis.del(key);
      let key1 = 'DICT-crud_table';
      await redisHelper.redis.del(key1);

      return true
    } catch (err) {
      return false
    }
  }

  async crudFilterConfig() {
    let objCRUD = [];
    //判断是否缓存数据
    let key = 'CRUD-BASE';
    let strRedisCrud = await redisHelper.redis.get(key, function (err, result) {
      return result;
    });

    if (strRedisCrud == null) {
      //无缓存，查询数据库
      let sql = 'SELECT table_name as label,table_id as value from crud_table where table_id<>? '
      let param = ['crud_field']
      objCRUD = await mysqlHelper.query(sql, param)
      //
      strRedisCrud = JSON.stringify(objCRUD);
      redisHelper.redis.set(key, strRedisCrud, function (err, res) {
        // todo..
        // console.log(err, res);
      });
    } else {
      objCRUD = JSON.parse(strRedisCrud);
    }
    //组织CRUD 查询条件
    return [
      {
        label: '模块',
        component: 'Select',
        componentProps: {
          placeholder: '请选择模块数据表',
          dataSource: objCRUD,
        },
        formBinderProps: {
          name: 'table_id',
          message: '请输入正确的模块数据表',
        },
      },
      {
        label: '添加模块数据表',
        component: 'EditDialog',
      }
    ];
  }

  async getDictDataByKey(dictType) {
    let objDict = [];
    //判断是否缓存数据
    let key = 'DICT-' + dictType;
    let strRedisDict = '';
    strRedisDict = await redisHelper.redis.get(key, function (err, result) {
      return result;
    });
    strRedisDict = null;

    if (strRedisDict == null) {
      //无缓存，查询数据库
      let sql = 'SELECT label,value from crud_dict where type=? '
      let param = [dictType]
      objDict = await mysqlHelper.query(sql, param)
      //
      strRedisDict = JSON.stringify(objDict);
      redisHelper.redis.set(key, strRedisDict, function (err, res) {
        // todo..
        // console.log(err, res);
      });
    } else {
      objDict = JSON.parse(strRedisDict);
    }
    return objDict
  }

  async getDictDataByTable(dictType) {
    let objDict = [];
    //判断是否缓存数据
    let key = 'DICT-' + dictType;
    let strRedisDict = '';
    strRedisDict = await redisHelper.redis.get(key, function (err, result) {
      return result;
    });

    if (strRedisDict == null) {
      //无缓存，查询数据库
      let sql = 'SELECT table_name as label,table_id as value from crud_table where table_id<>? '
      let param = ['crud_field']
      objDict = await mysqlHelper.query(sql, param)
      //
      strRedisDict = JSON.stringify(objDict);
      redisHelper.redis.set(key, strRedisDict, function (err, res) {
        // todo..
        // console.log(err, res);
      });
    } else {
      objDict = JSON.parse(strRedisDict);
    }
    return objDict
  }

  async getDictValueByKey(dictType, dictLabel) {
    let sql = 'SELECT value from Dict where type=?  and label=?'
    let param = [dictType, dictLabel]
    let result = await mysqlHelper.query(sql, param)
    return result
  }

  async unique(crudParam, config) {
    let sql = 'select count(*) as recordCount from  ' + crudParam.table_name + ' where 1=1 ';
    let values = [];
    //判断查询条件
    config.forEach((item) => {
      //准备唯一索引
      if (item.unique_index === 1) {
        //判断字段是否存在
        const keys = Object.keys(crudParam.params);
        if (keys.includes(item.field_id) && crudParam.params[item.field_id] !== undefined && crudParam.params[item.field_id] !== '') {
          sql = sql + ' and ' + item.field_id + '= ?'
          values.push(crudParam.params[item.field_id]);
        }
      }
    });
    let result = await mysqlHelper.query(sql, values);
    return result[0].recordCount;
  };

  async create(crudParam, config) {
    let sql = 'REPLACE into ' + crudParam.table_name;
    let values = [];
    let fields = [];
    let fieldsStr = '';
    let valuesStr = '';
    //判断查询条件
    config.forEach((item) => {
      //准备配置输入项
      if (item.required_input == '1') {
        //判断字段是否存在
        const keys = Object.keys(crudParam.params);
        if (keys.includes(item.field_id) && crudParam.params[item.field_id] != undefined) {
          let value=crudParam.params[item.field_id];
          if(item.input_format=="url"){
            values.push(decodeURI(value));
          }else{
            values.push(value);
          }


          fieldsStr = fieldsStr + ',' + item.field_id
          valuesStr = valuesStr + ',?'
        }
      }
    });
    fieldsStr = fieldsStr.substring(1);
    valuesStr = valuesStr.substring(1);
    sql = sql + '(' + fieldsStr + ') values (' + valuesStr + ')';
    // console.log(">>>>", sql)
    return await mysqlHelper.query(sql, values);
  };

  async update(crudParam, config) {
    let sql = 'update ' + crudParam.table_name + ' set ';
    let values = [];
    let fieldsStr = '';
    let wherevalues = [];
    let whereStr = '';
    //判断查询条件
    config.forEach((item) => {
      //准备配置输入项
      //if (item.required_input == '1') {
        //判断字段是否存在
        if (crudParam.params.hasOwnProperty(item.field_id) && crudParam.params[item.field_id] !== undefined) {
          //判断字段是否唯一索引
          if (item.unique_index == '1') {
            wherevalues.push(crudParam.params[item.field_id]);
            whereStr = whereStr + ' and ' + item.field_id + '=? '
          } else {
            values.push(crudParam.params[item.field_id]);
            fieldsStr = fieldsStr + ',' + item.field_id + '=? '
          }
        }
      //}
    });
    fieldsStr = fieldsStr.substring(1);
    sql = sql + fieldsStr + ' where 1=1 ' + whereStr;
    let params = values.concat(wherevalues);
    // console.log('update sql',sql);
    let result = await mysqlHelper.query(sql, params);
    return result;
  };

  async read(crudParam, config) {
    let sql = 'SELECT * FROM \`' + crudParam.table_name + '\` where 1=1 ';
    let sqlTotal = 'SELECT count(*) as totalRecord FROM \`' + crudParam.table_name + '\` where 1=1 ';
    let params = [];
    let filter = {};
    //判断查询条件
    config.forEach((item, index) => {
      //准备配置查询条件
      if (item.required_filter == '1') {
        //判断查询字段是否存在
        // const keys = Object.keys(crudParam.params);
        let condition = crudParam.params[item.field_id];
        if (crudParam.params.hasOwnProperty(item.field_id) && crudParam.params[item.field_id] !== undefined && condition!== undefined && condition != "") {
          try {
            // 成功说明是对象
            // 时间类型
            if (condition.key == 'between') {
              sql = sql + ' and ' + item.field_id + ' between ? and ? '
              sqlTotal = sqlTotal + ' and ' + item.field_id + ' between ? and ? '
              params.push(condition.value.st);
              params.push(condition.value.et);
            }
            // 模糊查询
            else if (condition.key == 'like') {
              sql = sql + ' and ' + item.field_id + ' like concat("%",?,"%") '
              sqlTotal = sqlTotal + ' and ' + item.field_id + ' like concat("%",?,"%") '
              params.push(condition.value);
              filter[item.field_id]="/"+condition.value+"/";
            } else if (condition.key == '!=') {
              sql = sql + ' and ' + item.field_id + ' != ? ';
              sqlTotal = sqlTotal + ' and ' + item.field_id + ' != ?';
              params.push(condition.value);
              filter[item.field_id]={
                $ne:condition.value
              }
            } else if (condition.key == '=') {
              sql = sql + ' and ' + item.field_id + ' = ? ';
              sqlTotal = sqlTotal + ' and ' + item.field_id + ' = ?';
              params.push(condition.value);
              filter[item.field_id]=condition.value;
            } else if (condition.key == 'in') {
              sql = sql + ' and ' + item.field_id + ' in ( ';
              sqlTotal = sqlTotal + ' and ' + item.field_id + ' in (';
              condition.value.map((obj, index) => {
                sql += '?';
                sqlTotal += '?';
                if (index != condition.value.length - 1) {
                  sql += ',';
                  sqlTotal += ',';
                }
                params.push(obj);
              });
              sql += ')';
              sqlTotal += ')'


            } else {
              sql = sql + ' and ' + item.field_id + '= ?';
              sqlTotal = sqlTotal + ' and ' + item.field_id + '= ?';
              params.push(condition);
              filter[item.field_id]=condition;
            }
          } catch (error) {
            // 说明是字符串
            sql = sql + ' and ' + item.field_id + '= ?';
            sqlTotal = sqlTotal + ' and ' + item.field_id + '= ?';
            params.push(condition);
            filter[item.field_id]=condition.value;
          }
        }
      }
    });
    if (crudParam.hasOwnProperty('params') && Object.keys(crudParam.params).length > 0 && params.length === 0) {
      if (!crudParam.params.hasOwnProperty('page')) {
        return {
          page: 1,
          pageSize: 10,
          total: 0,
          dataList: []
        }
      }

    }
    //查询总记录数
    let reslutTotal = await mysqlHelper.query(sqlTotal, params);
    let total = reslutTotal[0].totalRecord;
    // console.log(filter);
    let mongodata =await mongodbHelper.count(crudParam.table_name,filter);
    // console.log(mongodata);
    //#判断分页和排序
    let offset = 0
    let page = crudParam.params.page;
    let ps = pageSize
    if (crudParam.params.pagesize != undefined) {
      ps = crudParam.params.pagesize
    }
    if (page != undefined) {
      offset = (parseInt(crudParam.params.page) - 1) * ps
    } else {
      page = 1;
      offset = 0;
    }
    sql = sql + ' limit ' + offset + ',' + ps;
    let reslutList = await mysqlHelper.query(sql, params);

    return {
      page: page,
      pageSize: ps,
      total: total,
      dataList: reslutList
    }
  };

  async delete(crudParam, id) {
    let sql = 'delete from ' + crudParam.table_name + ' where ' + id + '=' + crudParam.params[id];
    return await mysqlHelper.query(sql);
  }

  async readFields(crudParam, config) {
    let sql = 'SELECT * FROM ' + crudParam.table_name + ' where 1=1 ';
    let sqlTotal = 'SELECT count(*) as totalRecord FROM ' + crudParam.table_name + ' where 1=1 ';
    let params = [];
    //判断查询条件
    config.forEach((item, index) => {
      //准备配置查询条件
      if (item.required_filter === 1) {
        //判断查询字段是否存在
        const keys = Object.keys(crudParam.params);
        if (keys.includes(item.field_id) && crudParam.params[item.field_id] !== undefined && crudParam.params[item.field_id] !== '') {
          let condition = crudParam.params[item.field_id];

          try {
            // 成功说明是对象
            // 时间类型
            if (condition.key === 'between') {
              sql = sql + ' and ' + item.field_id + ' between ? and ? ';
              sqlTotal = sqlTotal + ' and ' + item.field_id + ' between ? and ? ';
              params.push(condition.value.st);
              params.push(condition.value.et);
            }
            // 模糊查询
            else if (condition.key === 'like') {
              sql = sql + ' and ' + item.field_id + ' like concat("%",?,"%") ';
              sqlTotal = sqlTotal + ' and ' + item.field_id + ' like concat("%",?,"%") ';
              params.push(condition.value);
            } else {
              sql = sql + ' and ' + item.field_id + '= ?';
              sqlTotal = sqlTotal + ' and ' + item.field_id + '= ?';
              params.push(condition);
            }
          } catch (error) {
            // 说明是字符串
            sql = sql + ' and ' + item.field_id + '= ?';
            sqlTotal = sqlTotal + ' and ' + item.field_id + '= ?';
            params.push(condition);
          }
        }
      }
    });
    //查询总记录数
    let reslutTotal = await mysqlHelper.query(sqlTotal, params);
    let total = reslutTotal[0].totalRecord;

    //#判断分页和排序
    let offset = 0;
    let page = crudParam.params.page;
    let ps = pageSize;
    if (crudParam.params.pagesize !== undefined) {
      ps = crudParam.params.pagesize
    }
    if (page !== undefined) {
      offset = (parseInt(crudParam.params.page) - 1) * ps
    } else {
      page = 1;
      offset = 0;
    }
    sql = sql + ' order by display_sort' + ' limit ' + offset + ',' + ps;
    let resultList = await mysqlHelper.query(sql, params);
    resultList = resultList.filter(obj => {
      return obj.field_id !== "operation"
    });

    return {
      page: page,
      pageSize: ps,
      total: total,
      dataList: resultList
    }
  };

  async initConfig(config) {
    let filterConfig = [];
    let formConfig = [];
    let colunmConfig = [];
    let dictConfig = {};
    for (let item of config) {
      let datasource = [];
      if (item.input_type == 'Select' || item.input_type == 'RadioGroup' || item.input_type == 'Checkbox') {
        if (item.relation_data != 'crud_table') {
          datasource = await this.getDictDataByKey(item.relation_data);
        } else {
          datasource = await this.getDictDataByTable(item.relation_data);
        }

        dictConfig[item.relation_data] = datasource;
      }
      //准备配置查询条件
      if (item.required_filter == '1') {
        //判断输入类型
        if (item.input_type == 'Select') {
          filterConfig.push({
            label: item.field_name,
            component: item.input_type,
            componentProps: {
              placeholder: '请输入' + item.field_name,
              dataSource: datasource,
            },
            formBinderProps: {
              name: item.field_id,
              message: '请输入正确的' + item.field_name,
            },
          });
        } else if (item.input_type == 'TreeSelect') {

        } else if (item.input_type == 'DatePicker') {
          filterConfig.push({
            label: item.field_name,
            component: 'RangePicker',
            componentProps: {
              placeholder: '请输入' + item.field_name,
              size: 'large',
              defaultValue: [],
            },
            formBinderProps: {
              name: item.field_id,
              message: '请输入正确的' + item.field_name,
            },
          });
        } else {
          filterConfig.push({
            label: item.field_name,
            component: item.input_type,
            componentProps: {
              placeholder: '请输入' + item.field_name,
            },
            formBinderProps: {
              name: item.field_id,
              message: '请输入正确的' + item.field_name,
            },
          });
        }

      }
      //准备配置form input
      if (item.required_input == '1') {

        if (item.input_type == 'Select') {
          formConfig.push({
            label: item.field_name,
            component: item.input_type,
            componentProps: {
              placeholder: '请输入' + item.field_name,
              dataSource: datasource,
            },
            formBinderProps: {
              name: item.field_id,
              message: '请输入正确的' + item.field_name,
            },
          });
        } else if (item.input_type == 'TreeSelect') {

        } else if (item.input_type == 'DatePicker') {
          formConfig.push({
            label: item.field_name,
            component: 'DatePicker',
            componentProps: {
              placeholder: '请输入' + item.field_name,
              size: 'large',
              defaultValue: [],
            },
            formBinderProps: {
              name: item.field_id,
              message: '请输入正确的' + item.field_name,
            },
          });//<RadioGroup dataSource={list} value={this.state.value} onChange={this.onChange} />
        } else if (item.input_type == 'RadioGroup') {
          formConfig.push({
            label: item.field_name,
            component: 'RadioGroup',
            componentProps: {
              placeholder: '请输入' + item.field_name,
              dataSource: datasource,
            },
            formBinderProps: {
              name: item.field_id,
              message: '请输入正确的' + item.field_name,
            },
          });
        } else {
          formConfig.push({
            label: item.field_name,
            component: item.input_type,
            componentProps: {
              placeholder: '请输入' + item.field_name,
            },
            formBinderProps: {
              name: item.field_id,
              message: '请输入正确的' + item.field_name,
            },
          });
        }

      }
      //准备配置table cloumn　
      if (item.required_display == '1') {
        colunmConfig.push({
          title: item.field_name,
          dataIndex: item.field_id,
          key: item.field_id,
          input_type: item.input_type,
          relation_data: item.relation_data,
        });
      }
    }
    ;
    return {
      filterConfig: filterConfig,
      formConfig: formConfig,
      colunmConfig: colunmConfig,
      dictConfig: dictConfig,
    }

  };

  async selectTypeByTableId(param) {
    let sql = 'SELECT * FROM crud_table' + ' where table_id = ?';
    let params = [param.table_name];
    let resultList = await mysqlHelper.query(sql, params);
    return resultList
  }

}

module.exports = new MockController();
