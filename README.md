# godbmw的个人公众号

## 公众号使用说明

| 发送 | 回复 |
|-|-|
|语音消息和普通文字消息 |自动开启 **智能聊天模式** |
|微信客户端中的位置按钮 | 卫星定位结果和实时天气情况|
|`0` | 开发技术栈和鸣谢 |
|`1` | 最新的技术文章 |

## 框架使用说明
1. 下载仓库：`git clone git@github.com:godbmw/wechat.git wechat`
2. 进入仓库：`cd ./wechat`
3. 安装依赖：`cnpm install --save`
4. 配置公众号：配置`config/`中的`wechat.js`(微信公众号)和`weather.js`(和风天气账号)信息
5. 启动：`node app.js`
6. **注意：请根据实际需求，修改`config/wechat.js`的端口号`port`**

## 技术栈和鸣谢
#### 技术栈
- [Vue](https://cn.vuejs.org/)：渐进式JavaScript 框架
- [Node + Koa2](https://koa.bootcss.com/)：下一代 web 开发框架
- [MongoDB](https://baike.baidu.com/item/mongodb/60411?fr=aladdin)：No-Sql，数据库的未来非关系型
- **MySQL**：然并卵，现在还是要用sql

#### 鸣谢
- [和风天气](https://www.heweather.com/)：有良心的天气数据平台
- [青云客](http://www.qingyunke.com/)：啥都有，欢迎戳
