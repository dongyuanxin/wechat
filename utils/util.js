'use strict'
/* 工具箱 */
function formatJson(result) { 
    /*
    {
        name:['123']
    } => 
    {
        name:'123'
    }
    */ 
    let message = {}
    let keys = Object.keys(result)
    for(let i=0;i<keys.length;++i) {
        let key = keys[i]
        let item = result[key]
        if(!(item instanceof Array) || item.length===0){ // null,function,number,string
            message[key] = item
            continue
        }
        if(item.length===1) {
            let val = item[0]
            if (typeof val === 'object') {
                message[key] = formatMessage(val)
            } else {
                message[key] = typeof val==='number'?val:(val || '').trim()
            }
        } else {
            message[key] = []
            for (let j=0,k=item.length;j<k;++j) {
                message[key].push(formatMessage(item[j]))
            }
        }
    }
    return message
}

let tplNews = function(content) {
    let news = `<ArticleCount>${content.length}</ArticleCount><Articles>`,
        plus = ''
    content.forEach((item)=>{
        plus = `
        <item>
        <Title><![CDATA[${item.title}]]></Title>
        <Description><![CDATA[${item.description}]]></Description>
        <PicUrl><![CDATA[${item.picurl}]]></PicUrl>
        <Url><![CDATA[${item.url}]]></Url>
        </item>
        `
        news = news + plus
    })
    news = news + `</Articles>`
    return news
}

function json2Xml(data){
    /*
    json => 微信的json格式
    */
    let now = new Date().getTime()
    let xml = `
    <xml> 
        <ToUserName><![CDATA[${data.toUserName}]]></ToUserName> 
        <FromUserName><![CDATA[${data.fromUserName}]]></FromUserName> 
        <CreateTime>${data.now}</CreateTime> 
        <MsgType><![CDATA[${data.msgType}]]></MsgType>`
    let plus = null
    switch(data.msgType) {
        case 'text':
            plus = `<Content>
            <![CDATA[${data.content}]]>
            </Content>`
            break
        case 'image':
            plus = `<Image>
            <MediaId><![CDATA[${data.media_id}]]></MediaId>
            </Image>`
            break
        case 'voice':
            plus = `<Voice>
            <MediaId><![CDATA[${data.media_id}]]></MediaId>
            </Voice>`
            break
        case 'video':
            plus = `<Video>
            <MediaId><![CDATA[${data.media_id}]]></MediaId>
            <Title><![CDATA[${data.title}]]></Title>
            <Description><![CDATA[${data.description}]]></Description>
            </Video>`
            break
        case 'music':
            plus = `<Music>
            <Title><![CDATA[${data.TITLE}]]></Title>
            <Description><![CDATA[${data.DESCRIPTION}]]></Description>
            <MusicUrl><![CDATA[${data.MUSIC_Url}]]></MusicUrl>
            <HQMusicUrl><![CDATA[${data.HQ_MUSIC_Url}]]></HQMusicUrl>
            <ThumbMediaId><![CDATA[${data.media_id}]]></ThumbMediaId>
            </Music>`
            break
        case 'news': 
            plus = tplNews(data.content)
            break
    }
    xml = xml + plus + '</xml>'
    return xml
}

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout( ()=> resolve('enough sleep') , ms)
    })
}

module.exports = {
    formatJson,
    json2Xml,
    sleep
}