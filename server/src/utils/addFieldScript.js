const Model = require('../cmdb/data');

const res = {
  result: true,
  data: [{
    table_name: "直属区域",
    table_id: "hostinfo",
  },
    {
      table_id: "task",
      table_name: "任务管理",
    },
    {
      table_id: "script",
      table_name: "脚本管理",
    },
    {
      table_id: "IpNetToMedia",
      table_name: "IP管理",
    },
    {
      table_id: "IpNetToMediaBinding",
      table_name: "网卡绑定管理",
    }

  ]
};


const AttrRes = {
  result: true,
  data: [
    // hostinfo数据
    {
      table_id: "hostinfo",
      field_id: "Id",
      field_name: "ID",
      field_type: "int",
      input_type: "Input",
      required_display: 1,
      display: 1,
      required_input: 1,
    },
    {
      table_id: "hostinfo",
      field_id: "IP",
      field_name: "IP地址",
      field_type: "varchar",
      input_type: "Input",
      required_display: 1,
      display: 1,
      required_input: 1,
    },
    {
      table_id: "hostinfo",
      field_id: "User",
      field_name: "用户",
      field_type: "varchar",
      input_type: "Input",
      required_display: 1,
      display: 1,
      required_input: 1,
    },
    {
      table_id: "hostinfo",
      field_id: "Pwd",
      field_name: "密码",
      field_type: "varchar",
      input_type: "Input",
      required_display: 1,
      display: 1,
      required_input: 1,
    },
    {
      table_id: "hostinfo",
      field_id: "Port",
      field_name: "端口",
      field_type: "int",
      input_type: "Input",
      required_display: 1,
      display: 1,
      required_input: 1,
    },
    {
      table_id: "hostinfo",
      field_id: "Bizid",
      field_name: "区域",
      field_type: "int",
      input_type: "Select",
      relation_data: "ascription",
      required_display: 1,
      display: 1,
      required_input: 1,
    },
    {
      table_id: "hostinfo",
      field_id: "AgentType",
      field_name: "类型",
      field_type: "varchar",
      input_type: "Input",
      required_display: 1,
      display: 1,
      required_input: 1,
    },
    {
      table_id: "hostinfo",
      field_id: "FtpInstallPath",
      field_name: "FTP路径",
      field_type: "varchar",
      input_type: "Input",
      required_display: 1,
      display: 1,
      required_input: 1,
    },
    {
      table_id: "hostinfo",
      field_id: "Status",
      field_name: "状态",
      field_type: "int",
      input_type: "Select",
      relation_data: "task_status",
      required_display: 1,
      display: 1,
      required_input: 1,
    },
    {
      table_id: "hostinfo",
      field_id: "InstallPath",
      field_name: "安装路径",
      field_type: "varchar",
      input_type: "Input",
      required_display: 1,
      display: 1,
      required_input: 1,
    },
    {
      table_id: "hostinfo",
      field_id: "Version",
      field_name: "版本",
      field_type: "varchar",
      input_type: "Input",
      required_display: 1,
      display: 1,
      required_input: 1,
    },
    {
      table_id: "hostinfo",
      field_id: "CreateTime",
      field_name: "创建时间",
      field_type: "int",
      input_type: "DatePicker",
      required_display: 1,
      display: 1,
      required_input: 1,
    },
    // task数据
    {
      table_id: "task",
      field_id: "Id",
      field_name: "ID",
      field_type: "int",
      input_type: "Input",
      required_display: 1,
      display: 1,
      required_input: 1,
    },
    {
      table_id: "task",
      field_id: "Name",
      field_name: "任务名称",
      field_type: "varchar",
      input_type: "Input",
      required_display: 1,
      display: 1,
      required_input: 1,
    },
    {
      table_id: "task",
      field_id: "AppName",
      field_name: "应用名称",
      field_type: "varchar",
      input_type: "Input",
      required_display: 1,
      display: 1,
      required_input: 1,
    },
    {
      table_id: "task",
      field_id: "RunTime",
      field_name: "执行时间",
      field_type: "int",
      input_type: "DatePicker",
      required_display: 1,
      display: 1,
      required_input: 1,
    },
    {
      table_id: "task",
      field_id: "Interval",
      field_name: "间隔时间",
      field_type: "int",
      input_type: "Input",
      required_display: 1,
      display: 1,
      required_input: 1,
    },
    {
      table_id: "task",
      field_id: "Version",
      field_name: "版本",
      field_type: "varchar",
      input_type: "Input",
      required_display: 1,
      display: 1,
      required_input: 1,
    },
    {
      table_id: "task",
      field_id: "Bizid",
      field_name: "区域",
      field_type: "int",
      input_type: "Select",
      relation_data: "ascription",
      required_display: 1,
      display: 1,
      required_input: 1,
    },
    // script数据
    {
      table_id: "script",
      field_id: "Id",
      field_name: "ID",
      field_type: "int",
      input_type: "Input",
      required_display: 1,
      display: 1,
      required_input: 1,
    },
    {
      table_id: "script",
      field_id: "Name",
      field_name: "任务名称",
      field_type: "varchar",
      input_type: "Input",
      required_display: 1,
      display: 1,
      required_input: 1,
    },
    {
      table_id: "script",
      field_id: "AppName",
      field_name: "应用名称",
      field_type: "varchar",
      input_type: "Input",
      required_display: 1,
      display: 1,
      required_input: 1,
    },
    {
      table_id: "script",
      field_id: "RunTime",
      field_name: "执行时间",
      field_type: "int",
      input_type: "DatePicker",
      required_display: 1,
      display: 1,
      required_input: 1,
    },
    {
      table_id: "script",
      field_id: "Interval",
      field_name: "间隔时间",
      field_type: "int",
      input_type: "Input",
      required_display: 1,
      display: 1,
      required_input: 1,
    },
    {
      table_id: "script",
      field_id: "Version",
      field_name: "版本",
      field_type: "varchar",
      input_type: "Input",
      required_display: 1,
      display: 1,
      required_input: 1,
    },
    {
      table_id: "script",
      field_id: "Bizid",
      field_name: "区域",
      field_type: "int",
      input_type: "Select",
      relation_data: "ascription",
      required_display: 1,
      display: 1,
      required_input: 1,
    },
    // IpNetToMedia数据
    {
      table_id: "IpNetToMedia",
      field_id: "i_ip",
      field_name: "ID",
      field_type: "int",
      input_type: "Input",
      required_display: 1,
      display: 1,
      required_input: 1,
    },
    {
      table_id: "IpNetToMedia",
      field_id: "c_ip",
      field_name: "IP地址",
      field_type: "varchar",
      input_type: "Input",
      required_display: 1,
      display: 1,
      required_input: 1,
    },
    {
      table_id: "IpNetToMedia",
      field_id: "i_biz",
      field_name: "区域",
      field_type: "int",
      input_type: "Select",
      relation_data: "ascription",
      required_display: 1,
      display: 1,
      required_input: 1,
    },
    {
      table_id: "IpNetToMedia",
      field_id: "c_mac",
      field_name: "mac地址",
      field_type: "varchar",
      input_type: "Input",
      required_display: 1,
      display: 1,
      required_input: 1,
    },
    {
      table_id: "IpNetToMedia",
      field_id: "c_device",
      field_name: "设备",
      field_type: "varchar",
      input_type: "Input",
      required_display: 1,
      display: 1,
      required_input: 1,
    },
    {
      table_id: "IpNetToMedia",
      field_id: "c_ifIndex",
      field_name: "端口号",
      field_type: "int",
      input_type: "Input",
      required_display: 1,
      display: 1,
      required_input: 1,
    },
    {
      table_id: "IpNetToMedia",
      field_id: "c_ifName",
      field_name: "端口名称",
      field_type: "varchar",
      input_type: "Input",
      required_display: 1,
      display: 1,
      required_input: 1,
    },
    {
      table_id: "IpNetToMedia",
      field_id: "c_ifDescr",
      field_name: "端口描述",
      field_type: "varchar",
      input_type: "Input",
      required_display: 1,
      display: 1,
      required_input: 1,
    },
    {
      table_id: "IpNetToMedia",
      field_id: "c_ifAlias",
      field_name: "端口别名",
      field_type: "varchar",
      input_type: "Input",
      required_display: 1,
      display: 1,
      required_input: 1,
    },
    {
      table_id: "IpNetToMedia",
      field_id: "d_time",
      field_name: "时间",
      field_type: "int",
      input_type: "DatePicker",
      required_display: 1,
      display: 1,
      required_input: 1,
    },
    {
      table_id: "IpNetToMedia",
      field_id: "operation",
      field_name: "操作",
      field_type: "varchar",
      input_type: "Input",
      required_display: 1,
      display: 1,
      required_input: 1,
    },
    // IpNetToMediaBinding数据
    {
      table_id: "IpNetToMediaBinding",
      field_id: "i_ip",
      field_name: "ID",
      field_type: "int",
      input_type: "Input",
      required_display: 1,
      display: 1,
      required_input: 1,
    },
    {
      table_id: "IpNetToMediaBinding",
      field_id: "c_ip",
      field_name: "IP地址",
      field_type: "varchar",
      input_type: "Input",
      required_display: 1,
      display: 1,
      required_input: 1,
    },
    {
      table_id: "IpNetToMediaBinding",
      field_id: "i_biz",
      field_name: "区域",
      field_type: "int",
      input_type: "Select",
      relation_data: "ascription",
      required_display: 1,
      display: 1,
      required_input: 1,
    },
    {
      table_id: "IpNetToMediaBinding",
      field_id: "c_mac",
      field_name: "mac地址",
      field_type: "varchar",
      input_type: "Input",
      required_display: 1,
      display: 1,
      required_input: 1,
    },
    {
      table_id: "IpNetToMediaBinding",
      field_id: "c_descr",
      field_name: "描述",
      field_type: "varchar",
      input_type: "Input",
      required_display: 1,
      display: 1,
      required_input: 1,
    },
    {
      table_id: "IpNetToMediaBinding",
      field_id: "d_time",
      field_name: "时间",
      field_type: "int",
      input_type: "DatePicker",
      required_display: 1,
      display: 1,
      required_input: 1,
    },
    {
      table_id: "IpNetToMediaBinding",
      field_id: "c_used_mac",
      field_name: "使用MAC地址",
      field_type: "varchar",
      input_type: "Input",
      required_display: 1,
      display: 1,
      required_input: 1,
    },
    {
      table_id: "IpNetToMediaBinding",
      field_id: "c_used_time",
      field_name: "使用时间",
      field_type: "int",
      input_type: "DatePicker",
      required_display: 1,
      display: 1,
      required_input: 1,
    },

  ],
};

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
            table_id: item.table_id,
            table_name: item.table_name,
          };

          const count = Model.selectTable(insertData);
          count.then((count) => {
              if (count === 0) {
                const twoCount = Model.selectTableById(insertData);
                twoCount.then((item) => {
                  if (item === 0) {

                    Model.insertTable(insertData);

                  } else {
                    Model.updateTable(insertData);

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


function insertAttr(res) {
  let result = {
    status: false,
    statusText: "插入任数据失败",
    data: {}
  };
  if (res !== undefined) {
    if (res.result) {
      if (res.data.length > 0) {
        let data = res.data.map((item) => {
          // 注：Select 需要手动加入到crud_dict表里
          let insertData = {
            table_id: item.table_id,
            field_id: item.field_id,
            field_name: item.field_name,
            field_type: item.field_type,
            input_type: item.input_type,
            relation_data: item.relation_data?item.relation_data:null,
            required_display: 1,
            display: 1,
            required_input: 1,
            unique_index: 1,
          };
          if (item.relation_data===undefined){
            delete insertData.relation_data
          }

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
                    Model.updateCrud(insertData);

                  }
                })
              } else {

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


function Action() {
  insertTable(res);
  insertAttr(AttrRes);
}

Action();
