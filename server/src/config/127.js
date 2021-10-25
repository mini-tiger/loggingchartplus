/**
 * 配置文件
 */
//发布配置
const process = require('process');
const path = require('path');
const production = {

  //服务器端口
  SERVER_PORT: 3000,

  //REDIS配置
  REDIS: {
    host: 'db.itma.com.cn',
    port: 6379,
    password: "Root1q2w",
    maxAge: 3600000
  },

  //MYSQL数据库配置
  MYSQL: {
    host: "192.168.40.111",
    user: "root",
    password: "W3b5Ev!c3",
    port: "3306",
    database: "petrol_data",
    supportBigNumbers: true,
    multipleStatements: true,
    timezone: 'utc'
  },
  // CMDB配置
  CMDB: {
    host: "192.168.43.202",
    port: 8083
  },
  MONGODB: {
    host: "192.168.43.202",
    user: "cc",
    password: "cc",
    port: 27017,
    db:"cmdb",
  }

};

//开发配置
const development = {

  //服务器端口
  SERVER_PORT: 3000,

  //REDIS配置
  REDIS: {
    host: '192.168.40.111',
    port: 6379,
    password: "Root1q2w",
    maxAge: 3600000,
    db: 8, // 不同项目 修改为不同库 编号，防止 key冲突,very good
  },

  //MYSQL数据库配置
  MYSQL: {
    host: "192.168.40.111",
    user: "root",
    password: "W3b5Ev!c3",
    port: "3306",
    database: "petrol_data",
    supportBigNumbers: true,
    multipleStatements: true,
    timezone: 'utc'
  },

  // CMDB配置
  CMDB: {
    host: "auto.itma.com.cn",
    port: 8083
  },
  // CMDB区域配置字典
  BIZID: {
    jiankongpingtai: "2",
    funing: "3",
    zhangjiagang: "4",
    peixian: "5",
    jurong: "6",
    jinzhai: "7"
  },
  MONGODB: {
    address: "wx.itma.com.cn",
    username: "cc",
    password: "cc",
    port: "27017",
    database:"petrol_data",
  },
  TempDir:path.join(process.cwd(), "tmpzip")
};

const config = development;

module.exports = config;
