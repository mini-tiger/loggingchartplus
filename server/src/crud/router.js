const crudController = require('./controls');
const config = require('../config/config')
module.exports = (router) => {
  router.prefix('/' + config.urlSuffix + '/crud');
  router.all("/:urlpath+",
    crudController.getCrudAPI
  )
};


