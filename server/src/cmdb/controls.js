const API = require('./api');
const retCode = require('../utils/retcode');
const config = require('../config/config');
const Model = require('./data');

class ApiController {
  async POST(ctx) {
    let params = ctx.request.body;
    let url = "";
    let body = {};
    if (params.type === "objects") {
      url = "http://" + config.CMDB.host + ":" + config.CMDB.port + "/cjxzs/api/v3/object/classification/0/objects";
      body = {bk_classification_id: params.table_name};
      let bodyJson = JSON.stringify(body);
      let res = await API.Post(url, bodyJson);
      if (res === undefined || res === null) {
        return {
          status: retCode.Fail,
          statusText: "请求超时",
          data: {}
        }
      }
      res = JSON.parse(res);
      return formatTab(res)
    } else if (params.type === "data") {
      if (params.table_name === "host") {
        url = "http://" + config.CMDB.host + ":" + config.CMDB.port + "/cjxzs/api/v3/hosts/search";
        let page = 1;
        let start = 0;
        if (params.page !== undefined && params.page !== 0 && params.page !== null && params.page !== 1) {
          page = params.page;
          start = (page - 1) * 10;
        }
        let bizid = 0;
        if (params.bizName !== undefined || params.bizName !== "ALL") {
          let id = config.BIZID[params.bizName];
          if (id !== undefined) {
            bizid = parseInt(id)
          }
        }
        const filter = await formatFilter(params);
        body = {
          page: {start: start, limit: 10, sort: "-bk_host_id"},
          bk_biz_id: bizid,
          condition: [
            {
              bk_obj_id: "host",
              condition: filter["host"]
            }
          ]
        };
        let bodyJson = JSON.stringify(body);
        let res = await API.Post(url, bodyJson);
        if (res === undefined || res === null) {
          return {
            status: retCode.Fail,
            statusText: "请求超时",
            data: {}
          }
        }
        res = JSON.parse(res);
        return formatHostData(res, page)


      } else {
        url = "http://" + config.CMDB.host + ":" + config.CMDB.port + "/cjxzs/api/v3/inst/association/search/owner/0/object/" + params.table_name;
        let page = 1;
        let start = 0;
        if (params.page !== undefined && params.page !== 0 && params.page !== null && params.page !== 1) {
          page = params.page;
          start = (page - 1) * 10;
        }
        const filter = await formatFilter(params);
        body = {
          page: {start: start, limit: 10, sort: "-bk_inst_id"},
          condition: filter
        };
        let bodyJson = JSON.stringify(body);
        let res = await API.Post(url, bodyJson);
        if (res === undefined || res === null) {
          return {
            status: retCode.Fail,
            statusText: "请求超时",
            data: {}
          }
        }
        res = JSON.parse(res);
        return formatObjectsData(res, page)
      }
    } else if (params.type === "crud") {
      url = "http://" + config.CMDB.host + ":" + config.CMDB.port + "/cjxzs/api/v3/object/attr/search";
      body = {
        bk_obj_id: params.table_name,
        bk_supplier_account: "0"
      };
      let tableUrl = "http://" + config.CMDB.host + ":" + config.CMDB.port + "/cjxzs/api/v3/objects";
      let bodyJson = JSON.stringify(body);
      let tableRes = await API.Post(tableUrl, bodyJson);
      if (tableRes === undefined || tableRes === null) {
        return {
          status: retCode.Fail,
          statusText: "请求超时",
          data: {}
        }
      }
      tableRes = JSON.parse(tableRes);
      let result =await insertTable(tableRes);
      if (!result.status){
        return result
      }
      // console.log("++++++",result)
      let res = await API.Post(url, bodyJson);
      if (res === undefined || res === null) {
        return {
          status: retCode.Fail,
          statusText: "请求超时",
          data: {}
        }
      }
      res = JSON.parse(res);
      return await insertAttr(res)
    } else if (params.type ==="crud_table"){
      //
      url = "http://" + config.CMDB.host + ":" + config.CMDB.port + "/cjxzs/api/v3/object/classification/0/objects";
      body = {bk_classification_id: params.table_name};
      let bodyJson = JSON.stringify(body);
      let res = await API.Post(url, bodyJson);
      if (res === undefined || res === null) {
        return {
          status: retCode.Fail,
          statusText: "请求超时",
          data: {}
        }
      }
      res = JSON.parse(res);
      // Todo 更新所以二级菜单内模型
      let tabResult = await formatTab(res);
      if (tabResult.status !==400){

        url = "http://" + config.CMDB.host + ":" + config.CMDB.port + "/cjxzs/api/v3/object/attr/search";
        let tableUrl = "http://" + config.CMDB.host + ":" + config.CMDB.port + "/cjxzs/api/v3/objects";

        let Result=tabResult.data.tab.map(async item=>{

          body = {
            bk_obj_id: item.key,
            bk_supplier_account: "0"
          };
          let bodyJson = JSON.stringify(body);
          let tableRes =  await API.Post(tableUrl, bodyJson);
          if (tableRes === undefined || tableRes === null) {
            return {
              status: retCode.Fail,
              statusText: "请求超时",
              data: {}
            }
          }
          tableRes = JSON.parse(tableRes);
          let result = insertTable(tableRes);
          if (!result.status){
            return result
          }
          let res =  await API.Post(url, bodyJson);
          if (res === undefined || res === null) {
            return {
              status: retCode.Fail,
              statusText: "请求超时",
              data: {}
            }
          }
          res = JSON.parse(res);
          return  insertAttr(res)
        });
        return tabResult
      }else {
        return tabResult
      }


    }
  }
}

// 格式化二级菜单数据
function formatTab(res) {
  let result = {
    status: retCode.Success,
    statusText: '查询成功',
    data: {}
  };
  if (res !== undefined) {
    if (res.result) {
      if (res.data.length > 0) {
        let tabs = res.data[0].bk_objects.map(item => {
          return {
            tab: item.bk_obj_name,
            key: item.bk_obj_id
          }
        });
        result.data.tab = tabs;
        return result
      } else {
        return result
      }
    } else {
      result.status = retCode.Fail;
      result.statusText = "查询失败";
      return result
    }
  } else {
    result.status = retCode.Fail;
    result.statusText = "查询失败";
    return result
  }
}

// 格式数据列表
function formatObjectsData(res, page) {
  let result = {
    status: retCode.Success,
    statusText: '查询成功',
    data: {}
  };
  if (res !== undefined) {
    if (res.result) {
      if (res.data.info !== undefined && res.data.info.length > 0) {
        result.data.page = page;
        result.data.pageSize = 10;
        result.data.total = res.data.count;
        result.data.dataList = res.data.info;
        return result
      } else {
        result.data.page = page;
        result.data.pageSize = 10;
        result.data.total = res.data.count;
        result.data.dataList = [];
        return result
      }
    } else {
      result.status = retCode.Fail;
      result.statusText = "查询失败";
      return result
    }
  } else {
    result.status = retCode.Fail;
    result.statusText = "查询失败";
    return result
  }
}

// 格式化主机数据列表
function formatHostData(res, page) {
  let result = {
    status: retCode.Success,
    statusText: '查询成功',
    data: {}
  };
  if (res !== undefined) {
    if (res.result) {
      if (res.data.info !== undefined && res.data.info.length > 0) {
        result.data.page = page;
        result.data.pageSize = 10;
        result.data.total = res.data.count;
        result.data.dataList = res.data.info.map(o => {
          return o.host
        });
        return result
      } else {
        result.data.page = page;
        result.data.pageSize = 10;
        result.data.total = res.data.count;
        result.data.dataList = [];
        return result
      }
    } else {
      result.status = retCode.Fail;
      result.statusText = "查询失败";
      return result
    }
  } else {
    result.status = retCode.Fail;
    result.statusText = "查询失败";
    return result
  }
}

// 处理筛选数据
function formatFilter(params) {
  if (params.table_name !== null) {
    let filter = {};
    let keys = Object.keys(params);
    let values = Object.values(params);
    let fieldList = [];
    for (let k of keys) {
      if (k !== "table_name" && k !== "page" && k !== "type" && params[k] !== "ALL") {
        let field = {
          "field": k,
          "operator": "$regex",
          "value": params[k]
        };
        if (k === "bizName") {
          field.field = "ascription";
          field.operator = "$eq";
          field.value = config.BIZID[params[k]];
        }
        fieldList.push(field);
      }
    }
    if (values.indexOf("host") > 0) {
      fieldList = fieldList.filter(o => {
        return o.field !== "ascription"
      });
    }
    filter[params.table_name] = fieldList;
    return filter
  } else {
    return null
  }
}

// 插入数据到crud_field
function insertAttr(res) {
  let result = {
    status: retCode.Fail,
    statusText: "插入任数据失败",
    data: {}
  };
  if (res !== undefined) {
    if (res.result) {
      if (res.data.length > 0) {
        let data = res.data.map((item) => {
          let type = "varchar";
          let input_type = "Input";
          let relation_data = null;
          if (item.bk_property_type === "singlechar" || item.bk_property_type === "longchar") {
            type = "varchar"
          } else if (item.bk_property_type === "enum") {
            type = "int";
            input_type = "Select";

            relation_data = item.bk_property_id;
            formatDict(item.option, item.bk_property_id, item.bk_property_name)
          } else if (item.bk_property_type === "int") {
            type = "int"
          } else if (item.bk_property_type === "multiasst") {
            // Todo 多关联
            type = "varchar"

          } else if (item.bk_property_type === "singleasst") {
            //  Todo 单关联
            type = "varchar"
          } else {
            type = "varchar"
          }
          let insertData = {
            table_id: item.bk_obj_id,
            field_id: item.bk_property_id,
            field_name: item.bk_property_name,
            field_type: type,
            input_type: input_type,
            relation_data: relation_data,
            // default_value: "",
            required_filter: 0,
            required_display: 1,
            display_sort: item.id,
            required_input: 0,
            unique_index: 1,
            // input_format: "",
          };
          if(insertData.relation_data===null){
            delete insertData.relation_data
          }
          // 判断crud_field库里table_id 和field_id和field_name 三个字段是否同时存在，存在不操作，
          // 不存在，判断crud_field库里table_id 和field_id两个字段是否同时存在，
          // 存在更新，不存在新建；
          // cmdb创建模型字段后，只能修改field_name字段，更新时候只更新此字段
          const count = Model.SelectCrud(insertData);
          count.then((count) => {
              if (count === 0) {
                const twoCount = Model.selectTypeByTableId(insertData);
                twoCount.then((item) => {
                  if (item === 0) {
                    // 新建
                    Model.insertCrud(insertData);
                  } else {
                    //更新
                    Model.updateCrud(insertData)
                  }
                })
              } else {
                // console.log(insertData.table_id, "字段已经存在", insertData.field_name);
              }
            }
          );
          return insertData
        });
        return data
      } else {
        return result
      }
    } else {
      return result
    }
  } else {
    return result
  }
}

// 插入数据到crud_table
function insertTable(res) {
  let result = {
    status: false,
    statusText: "插入任数据失败",
    data: {}
  };
  if (res !== undefined) {
    if (res.result) {
      if (res.data.length > 0) {
        let data = res.data.map((item) => {
          let insertData = {
            table_id: item.bk_obj_id,
            table_name: item.bk_obj_name,
            type: "cmdb"
          };
          // 判断crud_field库里table_id 和field_id和field_name 三个字段是否同时存在，存在不操作，
          // 不存在，判断crud_field库里table_id 和field_id两个字段是否同时存在，
          // 存在更新，不存在新建；
          // cmdb创建模型字段后，只能修改field_name字段，更新时候只更新此字段
          const count = Model.selectTable(insertData);
          count.then((count) => {
              if (count === 0) {
                const twoCount = Model.selectTableById(insertData);
                twoCount.then((item) => {
                  if (item === 0) {
                    // 新建
                    Model.insertTable(insertData);
                  } else {
                    //更新
                    Model.updateTable(insertData)
                  }
                })
              } else {
              }
            }
          );
          return insertData
        });
        result.status = true;
        result.statusText = "插入crud_table成功";
        result.data = data;
        return result
      } else {
        return result
      }
    } else {
      return result
    }
  } else {
    return result
  }

}

//  处理字典数据
function formatDict(options, type, remarks) {
  if (typeof options === "Array" || options.length > 0) {
    let args = options.map(o => {
      return {
        type: type,
        label: o.name,
        value: o.id,
        sort: null,
        remarks: remarks
      }
    });
    for (let arg of args) {
      const count = Model.selectDict(arg);
      count.then((count) => {
        if (count === 0) {
          const twoCount = Model.selectDicteByType(arg);
          twoCount.then((item) => {
            if (item === 0) {
              // 新建
              Model.insertDict(arg);
            } else {
              //更新
              Model.updateDict(arg)
            }
          })
        } else {
        }
      })
    }
  }
}

module.exports = new ApiController();
