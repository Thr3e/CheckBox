const DateHandler = require('./date-handler')
const SQLHandler  = require('./sql-handler')
const Tools       = require('./tool')
var sqlHandler    = new SQLHandler
var dateHandler   = new DateHandler
var tools         = new Tools
var $consts       = JSON.parse($file.read("assets/constant.json").string)

var lineH = 40

var title_view = {
    type:"label",
    props:{
        id:"forgotten-title-view",
        text:"补打卡",
        textColor:$color("#404969"),
    },
    layout(make, view){
        make.width.equalTo(view.super)
        make.top.left.inset(0)
        make.height.equalTo(lineH)
    }
}

var date_input_view = {
    type:"label",
    props:{
        id:"forgotten-date-select-view",
        text:"请选择日期",
        textColor:$color("#404969"),
    },
    layout(make, view){
        make.width.equalTo(view.super)
        make.top.equalTo($("forgotten-title-view").bottom)
        make.left.inset(0)
        make.height.equalTo(lineH)
    },
    events:{
        tapped: function(sender){
            tools.datePicker(1, "",
                function(date){
                    sender.text = date[3] + "/" + $consts.sortMonthObj[date[1]] + '/' + date[2]
                }
            )
        }
    }
}

var time_input_view = {
    type:"label",
    props:{
        id:"forgotten-time-select-view",
        text:"请选择时间",
        textColor:$color("#404969"),
    },
    layout(make, view){
        make.width.equalTo(view.super)
        make.top.equalTo($("forgotten-date-select-view").bottom)
        make.left.inset(0)
        make.height.equalTo(lineH)
    },
    events:{
        tapped: function(sender){
            tools.datePicker(0, "",
                function(date){
                    sender.text = date[4].slice(0,5)
                }
            )
        }
    }
}

var check_view = {
    type:"view",
    props:{
        id:"forgotten-check-view",
    },
    views:[{
        type:"tab",
        props:{
            id:"forgotten-check-type-tab",
            items:['check-in', 'check-out'],
            index:0,
            tintColor:$color("#404969"),
        },
        layout(make, view){
            make.size.equalTo($size(150, lineH * 0.8))
            make.left.offset(10)
            make.centerY.equalTo(view.super)
        }
    },{
        type: "button",
        props: {
            id: "forgotten-checkin-btn",
            title: "Check",
            font: $font("ChalkboardSE-Bold",18),
            textColor: $color('#404969')
        },
        layout: function(make, view) {
            make.centerY.equalTo(view.super)
            make.right.equalTo(-10)
            make.size.equalTo($size(80, lineH * 0.8))
        },
        events:{
            tapped(sender){
                if($('forgotten-date-select-view').text.indexOf("请选择") !== -1 || $('forgotten-time-select-view').text.indexOf("请选择") !== -1){
                    $ui.alert("请输入打卡日期或时间")
                    return
                }
                var checkInfo = {}
                var dateInfo = $('forgotten-date-select-view').text.split('/')
                var timeInfo = $('forgotten-time-select-view').text.split(':')
                var type = $('forgotten-check-type-tab').index
                checkInfo.year = dateInfo[0]
                checkInfo.month = dateInfo[1]
                checkInfo.day = dateInfo[2]
                checkInfo.date = dateInfo.join('') * 1
                checkInfo.time = timeInfo.join(':')
                checkInfo.timeInfo = parseInt(timeInfo[0]) + parseFloat((timeInfo[1] / 60).toFixed(2))
                checkInfo.type = type
                sqlHandler.updateCheckTime(checkInfo.date, checkInfo)
                var timeData = sqlHandler.getTimeData(checkInfo.date)
                var workTime = tools.calWorkTime(timeData.STARTDATA, timeData.ENDDATA)
                sqlHandler.setWorkTime(workTime.toFixed(2), checkInfo.date)
                tools.updateCache(
                    checkInfo, 
                    dateHandler.getDayList(checkInfo), 
                    Object.assign(sqlHandler.getWorkTime(checkInfo.date), sqlHandler.getTotalTime(checkInfo))
                )
                var type = $cache.get("curDay").date === checkInfo.date ? "check" : Math.abs(parseInt($cache.get("curDay").date / 100) - parseInt(checkInfo.date / 100)) < 1 ? "curCheck" : "reCheck"
                tools.reloadView(type)
            }
        }
    }],
    layout(make, view){
        make.width.equalTo(view.super)
        make.top.equalTo($("forgotten-time-select-view").bottom)
        make.left.inset(0)
        make.height.equalTo(lineH)
    }
}

var forgotten_view = {
    type:"view",
    props:{
        id:'forgotten_view',
        borderWidth:1,
        radius:10,
        info:{
            lines:4,
            lineH:lineH
        }
    },
    layout:$layout.fill,
    views:[
        title_view,
        date_input_view,
        time_input_view,
        check_view
    ],
}

module.exports = forgotten_view