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
        text:"Supplement Check",
        textColor:$color($consts.colorList.basic),
        font:$font($consts.font.bold,18)
    },
    layout(make, view){
        make.width.equalTo(view.super)
        make.top.equalTo(0)
        make.left.inset(10)
        make.height.equalTo(lineH)
    }
}

var date_input_view = {
    type:"view",
    props:{
        id:"date-input-view"
    },
    views:[{
        type:"button",
        props:{
            id:"date-icon",
            icon:$icon("125",$color($consts.colorList.basic), $size(20, 20)),
            bgcolor:$color("clear")
        },
        layout(make){
            make.size.equalTo($size(lineH, lineH))
            make.left.equalTo(0)
        }
    },{
        type:"label",
        props:{
            id:"forgotten-date-select-view",
            text:"Select the Day",
            textColor:$color($consts.colorList.basic),
            font:$font($consts.font.regular,18)
        },
        layout(make, view){
            make.height.equalTo(view.super)
            make.right.equalTo(0)
            make.left.equalTo($('date-icon').right)
        }
    },{
        type:"view",
        props:{
            id:"cut-off-lin",
            bgcolor:$color($consts.colorList.basic),
            radius:1,
        },
        layout(make, view){
            make.height.equalTo(2)
            make.bottom.equalTo(view.super.bottom)
            make.left.inset(10)
            make.right.inset(33)
        }
    }],
    layout(make, view){
        make.width.equalTo(view.super)
        make.top.equalTo(view.prev.bottom)
        make.left.inset(10)
        make.height.equalTo(lineH)
    },
    events:{
        tapped: function(sender){
            tools.datePicker(1, "",
            function(date){
                var selectDay = {
                    year:parseInt(date[3]),
                    month:parseInt($consts.sortMonthObj[date[1]]),
                    day:parseInt(date[2])
                }
                tools.updateCache(
                    selectDay,
                    dateHandler.getDayList(selectDay),
                    Object.assign(sqlHandler.getWorkTime(tools.getDateId(selectDay)), sqlHandler.getTotalTime(selectDay))
                )
                tools.reloadView("month")
                }
            )
        }
    }
}

var time_input_view = {
    type:"view",
    props:{
        id:"time-input-view"
    },
    views:[{
        type:"button",
        props:{
            id:"time-icon",
            icon:$icon("099",$color($consts.colorList.basic), $size(20, 20)),
            bgcolor:$color("clear")
        },
        layout(make){
            make.size.equalTo($size(lineH, lineH))
            make.left.equalTo(0)
        }
    },{
        type:"label",
        props:{
            id:"forgotten-time-select-view",
            text:"Select the Time",
            textColor:$color($consts.colorList.basic),
            font:$font($consts.font.regular,18)
        },
        layout(make, view){
            make.height.equalTo(view.super)
            make.right.equalTo(0)
            make.left.equalTo($('time-icon').right)
        }
    },{
        type:"view",
        props:{
            id:"cut-off-lin",
            bgcolor:$color($consts.colorList.basic),
            radius:1,
        },
        layout(make, view){
            make.height.equalTo(2)
            make.bottom.equalTo(view.super.bottom)
            make.left.inset(10)
            make.right.inset(33)
        }
    }],
    layout(make, view){
        make.width.equalTo(view.super)
        make.top.equalTo(view.prev.bottom)
        make.left.inset(10)
        make.height.equalTo(lineH)
    },
    events:{
        tapped: function(sender){
            tools.datePicker(0, "",
                function(date){
                    $("forgotten-time-select-view").text = date[4].slice(0,5)
                }
            )
        }
    }
}

var check_view = {
    type:"view",
    props:{
        id:"forgotten-check-view"
    },
    views:[{
        type:"view",
        props:{
            id:"forgotten-check-type-tab",
            borderWidth:1,
            borderColor:$color($consts.colorList.basic),
            radius:5,
        },
        layout(make, view){
            make.size.equalTo($size(150, lineH * 0.8))
            make.left.offset(20)
            make.centerY.equalTo(view.super)
        },
        views:[{
            type:"label",
            props:{
                text:"check-in",
                align:$align.center,
                font: $font($consts.font.regular,15),
                bgcolor:$color($consts.colorList.basic),
                textColor:$color($consts.colorList.bgcolor),
            },
            layout(make, view){
                make.height.equalTo(view.super)
                make.width.equalTo(75)
                make.left.inset(0)
            },
            events:{
                tapped(){
                    var lightC = $color($consts.colorList.bgcolor)
                    var darkC  = $color($consts.colorList.basic)
                    $("forgotten-check-type-tab").views[0].bgcolor = darkC
                    $("forgotten-check-type-tab").views[0].textColor = lightC
                    $("forgotten-check-type-tab").views[1].bgcolor = lightC
                    $("forgotten-check-type-tab").views[1].textColor = darkC
                }
            }
        },{
            type:"label",
            props:{
                text:"check-out",
                align:$align.center,
                font: $font($consts.font.regular,15),
                textColor:$color($consts.colorList.basic),
                bgcolor:$color($consts.colorList.bgcolor),
            },
            layout(make, view){
                make.height.equalTo(view.super)
                make.width.equalTo(75)
                make.right.inset(0)
            },
            events:{
                tapped(){
                    var lightC = $color($consts.colorList.bgcolor)
                    var darkC  = $color($consts.colorList.basic)
                    $("forgotten-check-type-tab").views[1].bgcolor = darkC
                    $("forgotten-check-type-tab").views[1].textColor = lightC
                    $("forgotten-check-type-tab").views[0].bgcolor = lightC
                    $("forgotten-check-type-tab").views[0].textColor = darkC
                }
            }
        }]
    },{
        type: "button",
        props: {
            id: "forgotten-checkin-btn",
            title: "Check",
            font: $font($consts.font.bold,18),
            textColor: $color($consts.colorList.basic),
            bgcolor:$color($consts.colorList.basic)
        },
        layout: function(make, view) {
            make.centerY.equalTo(view.super)
            make.right.inset(20)
            make.size.equalTo($size(80, lineH * 0.8))
        },
        events:{
            tapped(sender){
                if($('forgotten-date-select-view').text.indexOf("Select") !== -1 || $('forgotten-time-select-view').text.indexOf("Select") !== -1){
                    $ui.alert("请先选择日期和时间!")
                    return
                }
                var checkInfo = {}
                var dateInfo = $('forgotten-date-select-view').text.split('/')
                var timeInfo = $('forgotten-time-select-view').text.split(':')
                var type = 
                $("forgotten-check-type-tab").views[0].bgcolor.hexCode === $consts.colorList.basic ? 0 : 1
                checkInfo.year = parseInt(dateInfo[0])
                checkInfo.month = parseInt(dateInfo[1])
                checkInfo.day = parseInt(dateInfo[2])
                checkInfo.date = dateInfo.join('') * 1
                checkInfo.time = timeInfo.join(':')
                checkInfo.timeData = parseInt(timeInfo[0]) + parseFloat((timeInfo[1] / 60).toFixed(2))
                if (!sqlHandler.verifyData(checkInfo.date)) {
                    sqlHandler.createNewLine(checkInfo)
                }
                sqlHandler.updateData(type, checkInfo, checkInfo.date)
                var timeData = sqlHandler.getTimeData(checkInfo.date)
                var workTime = tools.calWorkTime(timeData.STARTDATA, timeData.ENDDATA)
                sqlHandler.setWorkTime(workTime ? workTime.toFixed(2) : workTime, checkInfo.date)
                tools.updateCache(
                    checkInfo, 
                    dateHandler.getDayList(checkInfo), 
                    Object.assign(sqlHandler.getWorkTime(checkInfo.date), sqlHandler.getTotalTime(checkInfo))
                )
                var reloadType = $cache.get("curDay").date === checkInfo.date ? "check" : Math.abs(parseInt($cache.get("curDay").date / 100) - parseInt(checkInfo.date / 100)) < 1 ? "curCheck" : "reCheck"
                tools.reloadView(reloadType)
            }
        }
    }],
    layout(make, view){
        make.width.equalTo(view.super)
        make.top.equalTo(view.prev.bottom).offset(5)
        make.left.inset(0)
        make.height.equalTo(lineH)
    }
}

var forgotten_view = {
    type:"view",
    props:{
        id:'forgotten_view',
        borderWidth:2,
        borderColor:$color($consts.colorList.basic),
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
