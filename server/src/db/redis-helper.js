const config = require('../config/config')
const Redis = require('ioredis');

var redis = new Redis({
  port: config.REDIS.port,          // Redis port
  host: config.REDIS.host,   // Redis host
  family: 4,           // 4 (IPv4) or 6 (IPv6)
  password: config.REDIS.password,
  db: config.REDIS.db
})


var RedisDB = new Redis({
  port: config.REDIS.port,          // Redis port
  host: config.REDIS.host,   // Redis host
  family: 4,           // 4 (IPv4) or 6 (IPv6)
  password: config.REDIS.password,
  db: config.REDIS.db
  // keyPrefix: 'station_filter_'
})


module.exports = {
  redis,
  RedisDB
}
