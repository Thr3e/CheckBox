const DateHandler = require('./date.handler')
const SQLHandler  = require('./sql.handler')
const Tools       = require('./tool.handler')
const sqlHandler  = new SQLHandler
const dateHandler = new DateHandler
const tools       = new Tools
const $consts     = JSON.parse($file.read("assets/constant.json").string)

const curDay = {}

function reloadData(){
    sqlHandler.cacheInit();
    dateHandler.cacheInit(curDay);
    tools.reloadView("check");
    $('day_options_view').remove()
}

// 设置选中日期为加班
var overtime_btn = {
    type:"button",
    props:{
        title:"Extra",
        id:"overtime_btn",
        font: $font($consts.font.bold,18),
        bgcolor:$color($consts.colorList.overtime),
    },
    layout:$layout.fill,
    events:{
        tapped(sender){
            if(sqlHandler.queryWorkTime(curDay.date).hasData){
                sender.remove();
                $('overtime_view').add(overtime_un_btn)
                sqlHandler.updateWorkType(curDay.date, 1)
                reloadData()
            }
            
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
        tapped(sender){
            if(sqlHandler.queryWorkTime(curDay.date).hasData){
                sender.remove();
                $('overtime_view').add(overtime_btn)
                sqlHandler.updateWorkType(curDay.date, 0)
                reloadData();
            }
        }
    }
}

var overtime_view = {
    type:"view",
    props:{
        id:'overtime_view',
        // radius:'19%',
    },
    views:[],
    layout: $layout.fill,
    events:{
        ready(sender){
            let workTypeObj = sqlHandler.queryWorkTime(curDay.date);
            if(workTypeObj.hasData){
                if(workTypeObj.type) {
                    sender.add(overtime_un_btn)
                }else {
                    sender.add(overtime_btn);
                }
            }
        }
    }
}

// 切PO
var changepo_btn = {
    type:"button",
    props:{
        title:"Change PO",
        id:"changepo_btn",
        font: $font($consts.font.bold,18),
        bgcolor:$color($consts.colorList.dark)
    },
    layout:$layout.fill,
    events:{
        tapped(sender){
            if(sqlHandler.queryWorkTime(curDay.date).hasData){
                sender.remove();
                $('changePO_view').add(samepo_btn)
                sqlHandler.updatePOType(curDay.date, 1)
                reloadData()
            }
            
        }
    }
}

var samepo_btn = {
    type:"button",
    props:{
        title:"Same PO",
        id:"samepo_btn",
        font: $font($consts.font.bold,18),
        bgcolor:$color($consts.colorList.dark)
    },
    layout:$layout.fill,
    events:{
        tapped(sender){
            if(sqlHandler.queryWorkTime(curDay.date).hasData){
                sender.remove();
                $('overtime_view').add(changepo_btn)
                sqlHandler.updatePOType(curDay.date, 0)
                reloadData();
            }
        }
    }
}
var changePO_view = {
    type:"view",
    props:{
        id:'changePO_view',
        // radius:'19%',
    },
    views:[],
    layout: $layout.fill,
    events:{
        ready(sender){
            let POType = sqlHandler.queryPOType(curDay.date);
            if(POType){
                sender.add(samepo_btn);
            }else {
                sender.add(changepo_btn);
            }
        }
    }
}

// 删除选中日期的记录
var deleteDay_view = {
    type:"view",
    props:{
        id:'deleteDay_view',
        // radius:'19%',
    },
    layout: $layout.fill,
    views:[{
        type:"button",
        props:{
            title:"Delete",
            id:"delete_btn",
            font: $font($consts.font.bold,18),
            bgcolor:$color($consts.colorList.cur)
        },
        layout:$layout.fill,
        events:{
            tapped(sender){
                if(sqlHandler.verifyData(curDay.date)){
                    tools.alertDeleteWarn(function(){
                        sqlHandler.cleanData(curDay.date);
                        reloadData()
                    });
                }
            }
        }
    }]
}

function setCurDay(day) {
    for (const key in day) {
        if (day.hasOwnProperty(key)) {
            curDay[key] = day[key];
        }
    }
}

module.exports = {setCurDay, deleteDay_view, overtime_view, changePO_view}