const redisHelper = require('../db/redis-helper');
const mongodbHelper = require('../db/mongodb-helper');
let mongoose = require('mongoose');
const pageSize = 10;

class mongooseAPI {

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
      let params = {
        type: dictType
      }
      objDict = await mongodbHelper.find("crud_dict", params);
      strRedisDict = JSON.stringify(objDict);
      redisHelper.redis.set(key, strRedisDict, function (err, res) {
        // todo..
      });
    } else {
      objDict = JSON.parse(strRedisDict);
    }
    return objDict
  }

  //检查crud api 是否存在
  async getCrudBase(table_id) {
    let params = {
      table_id: table_id
    }
    let base = await mongodbHelper.find("crud_table", params);
    if (base.length == 0) {
      return {
        result: false,
      }
    } else {
      let fields = await mongodbHelper.find("crud_field", params);
      return {
        result: true,
        base: base[0],
        fields: fields,
      }
    }
  }

  //初始化配置
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

  //查询数据
  async read(crudParam, config) {
    let params = [];
    let filter = {};
    //判断查询条件
    config.forEach((item, index) => {
      //准备配置查询条件
      if (item.required_filter == '1') {
        //判断查询字段是否存在
        // const keys = Object.keys(crudParam.params);
        let condition = crudParam.params[item.field_id];
        if (crudParam.params.hasOwnProperty(item.field_id) && crudParam.params[item.field_id] !== undefined && condition !== undefined && condition != "") {
          try {
            // 成功说明是对象
            // 时间类型
            if (condition.key == 'between') {
              params.push(condition.value.st);
              params.push(condition.value.et);
            }
            // 模糊查询
            else if (condition.key == 'like') {
              params.push(condition.value);
              // filter[item.field_id] = "/" + condition.value + "/";
              filter[item.field_id] = new RegExp(condition.value,"i")
            } else if (condition.key == '!=') {
              params.push(condition.value);
              filter[item.field_id] = {
                $ne: condition.value
              }
            } else if (condition.key == '=') {
              params.push(condition.value);
              filter[item.field_id] = condition.value;
            } else if (condition.key == 'in') {
              condition.value.map((obj, index) => {
                params.push(obj);
              });
            } else {
              params.push(condition);
              filter[item.field_id] = condition;
            }
          } catch (error) {
            // 说明是字符串
            params.push(condition);
            filter[item.field_id] = condition.value;
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
    let total = await mongodbHelper.count(crudParam.table_name, filter);
    // console.log("total",total);

    //#判断分页和排序
    let offset = 0
    let page = crudParam.params.page;
    let ps = crudParam.params.hasOwnProperty("pageSize") ? crudParam.params.pageSize : pageSize
    if (crudParam.params.pagesize != undefined) {
      ps = crudParam.params.pagesize
    }
    if (page != undefined) {
      offset = (parseInt(crudParam.params.page) - 1) * ps
    } else {
      page = 1;
      offset = 0;
    }

    console.log(filter)
    let reslutList = await mongodbHelper.findbylimit(crudParam.table_name, filter, offset, ps);
    console.log(reslutList)
    return {
      page: page,
      pageSize: ps,
      total: total,
      dataList: reslutList
    }
  };

  //更新数据
  async update(crudParam, config) {
    let filter = {}
    let params = {}
    //判断查询条件
    config.forEach((item) => {
      //准备配置输入项
      //if (item.required_input == '1') {
      //判断字段是否存在
      if (crudParam.params.hasOwnProperty(item.field_id) && crudParam.params[item.field_id] !== undefined) {
        //判断字段是否唯一索引
        if (item.required_inputunique_index == '1') {
          if (item.field_id == "_id") {
            filter[item.field_id] = mongoose.Types.ObjectId(crudParam.params[item.field_id])
          } else {
            filter[item.field_id] = crudParam.params[item.field_id]
          }
        } else {
          params[item.field_id] = crudParam.params[item.field_id]
        }
      }
      //}
    });

    let result = await mongodbHelper.update(crudParam.table_name, filter, params);
    // console.log("update",result)
    return result;
  };

  //新增记录
  async create(crudParam, config) {
    let params = {}
    config.forEach((item) => {
      //准备配置输入项
      //if (item.required_input == '1') {
      //判断字段是否存在
      const keys = Object.keys(crudParam.params);
      if (keys.includes(item.field_id) && crudParam.params[item.field_id] != undefined) {
        let value = crudParam.params[item.field_id];
        if (item.input_format == "url") {
          value = decodeURI(value);
        }
        params[item.field_id] = value;
      }
      //}
    });
    let result = await mongodbHelper.add(crudParam.table_name, params);
    // console.log("create",result)
    return result;
  };

}

module.exports = new mongooseAPI();
