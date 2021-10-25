const Sequelize = require('sequelize');
const config = require('../config/config')

const sequelize = new Sequelize(config.MYSQL.database, config.MYSQL.user, config.MYSQL.password, {
  host: config.MYSQL.host,
  dialect: 'mysql',
  operatorsAliases: true,
  define: {
    underscored: false,
    freezeTableName: true, // 自定义表名
    charset: 'utf8',
    dialectOptions: {
      collate: 'utf8_general_ci'
    },
    timestamps: true
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
});

function Test() {
  sequelize
    .authenticate()
    .then(() => {
      // console.log('Connection has been established successfully.');
    })
    .catch(err => {
      // console.error('Unable to connect to the database:', err);
    });
}


const SYS_STATION = sequelize.define('SYS_Station', {
  STA_ID: Sequelize.STRING,
  STA_ORDER:Sequelize.INTEGER,
  STA_NAME:Sequelize.STRING,
  rootIp:Sequelize.STRING,
  zoom: Sequelize.STRING,
  points:Sequelize.TEXT,
  STA_LINEID:Sequelize.STRING,
  STA_LINENAME:Sequelize.STRING,
  STA_ATTRIB:Sequelize.STRING,
  IsImgDelete:Sequelize.INTEGER,
  ImgExtensionName:Sequelize.STRING,
  OUCode:Sequelize.STRING,
  OUName:Sequelize.STRING
})

const Dict = sequelize.define('Dict', {
  id: { type: Sequelize.INTEGER, primaryKey: true },
  type:Sequelize.STRING,
  // key:Sequelize.STRING,
  value:Sequelize.STRING,
  del_flag: Sequelize.INTEGER,
  sort: Sequelize.INTEGER,
  label:Sequelize.STRING,
  desc:Sequelize.STRING,
  create_time:Sequelize.STRING,
  update_time:Sequelize.STRING,
  create_user:Sequelize.STRING,
  update_user:Sequelize.STRING,
})


function Query(asyncSql) {
  return new Promise((resolve, reject) => {
    // sequelize.query(sql).then(myTableRows => {
    //   // console.log(myTableRows)
    //   // return myTableRows
    //   resolve(myTableRows)
    // }).catch(err=>{
    //     reject(err)
    // })
    // console.log(args)
    asyncSql.then(res => {
      // projects will be an array of Projects having the id 1, 2 or 3
      // this is actually doing an IN query
      resolve(res)
    }).catch(err=>{
      reject(err)
    })
  })
}

let query = function (sql, args) {

  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) {
        resolve(err)
      } else {
        connection.query(sql, args, (err, result) => {

          if (err) {
            reject(err)
          } else {
            resolve(result)
          }
          connection.release()

        })
      }
    })
  })

}

module.exports = {
  Query,
  SYS_STATION,
  Dict,
}
