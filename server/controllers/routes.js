'use strict'
const fs = require('fs')

function addMapping(router, mapping) {
    for (let url in mapping) {
        if (url.startsWith('GET ')) {
            var path = url.substring(4);
            router.get(path, mapping[url]);
            console.log(`  GET注册: ${path}`);
        } else if (url.startsWith('POST ')) {
            var path = url.substring(5);
            router.post(path, mapping[url]);
            console.log(`  POST注册: ${path}`);
        } else {
            console.log(`  无效路由: ${url}`);
        }
    }
}

function addControllers(router,dir) {
    let files = fs.readdirSync(__dirname +  dir);
    let jsFiles = files.filter((f) => {
        return f.endsWith('.js'); // 只扫描js文件
    });

    for (let f of jsFiles) {
        console.log(`扫描路由配置文件: ${f}...`);
        let mapping = require(__dirname + dir +'/' + f);
        addMapping(router, mapping);
    }
}

module.exports = function(dir) {
    let controllersDir = dir || './../routes' // 默认路由文件夹
    let router = require('koa-router')() // 引入路由
    addControllers(router,controllersDir)
    return router.routes()
}