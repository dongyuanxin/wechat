'use strict'

const wechat = {
    base:require('./config/wechat/base'),
    reply:require('./config/wechat/reply')
}

const plugins = {
    weather:require('./config/plugins/weather'),
}

const database = {
    mysql:require('./config/database/mysql')
}

exports = module.exports = {
    wechat,
    database,
    plugins
}
