const userController = require('./controller/user');
const FuncController = require('./controller/func');
const MongoController = require('./controller/mongo');
const config = require('./config/config')

module.exports = (router) => {
  router.prefix('/' + config.urlSuffix + '/api');
  router
    .post('/getZbmcbyMongo', MongoController.getZbmcbyMongo)
    .post('/getQxwjmbyMongo', MongoController.getQxwjmbyMongo)
    .post('/getJHbyMongo', MongoController.getJHbyMongo)
    .post('/findQxByTask', FuncController.findQxByTask)
    .post('/findByTaskDepth', FuncController.findByTaskDepth)
    .post('/findByTaskDepthList', FuncController.findByTaskDepthList)
    .post('/getJH', FuncController.getJH)
    .post('/getwellflist', FuncController.getwellflist)
    .post('/getwellQXList', FuncController.getwellqxlist)
    .post('/getidxlist', FuncController.getidxlist)
    .post('/findModel', FuncController.findModel)
    .post('/findModelGroup', FuncController.findModelGroup)
    .post('/findTask', FuncController.findTask)
    .post('/findTemplate', FuncController.findTemplate)
    .post('/delTemplate', FuncController.delTemplate)
    .post('/uploadJar', FuncController.uploadJar)
    .post('/countTemplate', FuncController.countTemplate)
    .post('/saveTemplate', FuncController.saveTemplate)
    .post('/saveTemplatecallback', FuncController.saveTemplateCallback)
    .post('/saveTask', FuncController.saveTask)
    .post('/saveTable', FuncController.saveTable)
    .post('/delData', FuncController.delData)
    .post('/delCollect', FuncController.delCollect)
    .get('/profile', userController.profile)
    .post('/login', userController.login)
    .post('/register', userController.register)
    .post('/logout', userController.logout)
    .post('/getdownloadzip', FuncController.getdownloadzip)
    .post('/getFieldCount', FuncController.getFieldCount) //通用
    .post('/getDownloadFile', FuncController.getDownloadFile)
    .post('/getTableCount', FuncController.getTableCount)
    .post('/getIndexCount1', FuncController.getIndexCount1)
    .post('/getIndexCount2', FuncController.getIndexCount2)
    .post('/getModelCSV', FuncController.getModelCSV)
    .post('/getModelCSVzip', FuncController.getModelCSVzip) //未完成，内存溢出
    .post('/getdistinct', FuncController.getdistinct) //通用
    .post('/getcount', FuncController.getcount) //通用
    .post('/syncwelldata', FuncController.syncwelldata) //通用
};
