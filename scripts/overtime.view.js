const DateHandler = require('./date.handler')
const SQLHandler  = require('./sql.handler')
const Tools       = require('./tool.handler')
var sqlHandler    = new SQLHandler
var dateHandler   = new DateHandler
var tools         = new Tools
var $consts       = JSON.parse($file.read("assets/constant.json").string)

var overtime_btn = {
    type:"button",
    props:{
        title:"Extra",
        id:"overtime_btn",
        font: $font($consts.font.bold,18),
        bgcolor:$color($consts.colorList.overtime),
        hidden:true
    },
    layout:$layout.fill,
    events:{
        tapped(sender){
            let sDay = $cache.get("selectDay")
            let obj = sqlHandler.queryWorkTime(sDay.date);
            if(obj.hasData){
                sqlHandler.updateWorkType(sDay.date, 1)
                sender.hidden = true
                $("overtime_un_btn").hidden = false
                sqlHandler.cacheInit();
                dateHandler.cacheInit(sDay);
                tools.reloadView("check");
            }
            
        },
        ready(sender){
            sender.hidden = sqlHandler.queryWorkTime($cache.get("selectDay").date).type == 1
        }
    }
}

var overtime_un_btn = {
    type:"button",
    props:{
        title:"UnExtra",
        id:"overtime_un_btn",
        font: $font($consts.font.bold,18),
        bgcolor:$color($consts.colorList.worktime),
    },
    layout:$layout.fill,
    events:{
        tapped(){
            let sDay = $cache.get("selectDay")
            let obj = sqlHandler.queryWorkTime(sDay.date);
            if(obj.hasData){
                sqlHandler.updateWorkType(sDay.date, 0)
                $("overtime_un_btn").hidden = true
                $("overtime_btn").hidden = false
                sqlHandler.cacheInit();
                dateHandler.cacheInit(sDay);
                tools.reloadView("check");
            }
        },
        ready(sender){
            sender.hidden = sqlHandler.queryWorkTime($cache.get("selectDay").date).type == 0;
        }
    }
}

var overtime_view = {
    type:"view",
    props:{
        id:'overtime_view',
        radius:'19%',
        alpha:0
    },
    views:[
        overtime_btn,
        overtime_un_btn
    ],
    layout(make){
      make.right.inset(-15)
      make.bottom.inset(150)
      make.size.equalTo($size(100,40))
    },
    events:{
        ready(sender){
            sender.alpha = sqlHandler.queryWorkTime($cache.get("selectDay").date).hasData ? 0.7 : 0
        }
    }
}

module.exports = overtime_view
