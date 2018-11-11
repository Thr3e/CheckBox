const DateHandler = require('./date-handler')
const SQLHandler  = require('./sql-handler')
const Tools       = require('./tool')
var sqlHandler    = new SQLHandler
var dateHandler   = new DateHandler
var tools         = new Tools
var $consts       = JSON.parse($file.read("assets/constant.json").string)
var wtInfo = $cache.get("wtInfo")

var titleH = 40
var cellH  = 47
var infoH  = 70
var selectCell = {
    year:dateHandler.currentTime.year,
    month:dateHandler.currentTime.month,
    day:dateHandler.currentTime.day
}
var Param = {
    dayList:dateHandler.dayList,
    workTimeList:sqlHandler.getTotalTime(selectCell).wtList,
    selectDate:selectCell
}

var calender_time_view = {
    type:"view",
    props:{
        id:"calender_time_view"
    },
    views:[{
        type:"label",
        props:{
            id:"calender_month_view",
            text:$consts.monthList[$cache.get("selectDay").month - 1],
            font:$font(20),
            align:$align.center,
            textColor:$color($consts.colorList.light)
        },
        layout(make){
            make.top.left.right.equalTo(0)
            make.height.equalTo(titleH - 12)
        }
    },{
        type:"label",
        props:{
            id:"calender_year_view",
            text:`${$cache.get("selectDay").year}`,
            font:$font(10),
            align:$align.center,
            textColor:$color($consts.colorList.light)
        },
        layout(make){
            make.top.equalTo($("calender_month_view").bottom)
            make.left.right.equalTo(0)
            make.height.equalTo(12)
        }
    }],
    layout(make){
        make.top.right.left.equalTo(0)
        make.height.equalTo(titleH)
    },
    events:{
        tapped: function(sender){
            tools.datePicker(2, 
                Array(2).fill(Array.from(Array(10).keys(), x => x + 2016 + "年")).fill(Array.from(Array(12).keys(), x => x + 1 + "月"), 1),
                function(date){
                    var selectDay = {
                        year:date[0].slice(0, 4) * 1,
                        month:date[1].slice(0, date[1].indexOf('月')) * 1,
                        day:0
                    }
                    var id = tools.getDateId(selectDay)
                    //刷新数据
                    tools.updateCache(
                        selectDay,
                        dateHandler.getDayList(selectDay),
                        Object.assign(sqlHandler.getWorkTime(id), sqlHandler.getTotalTime(selectDay))
                    )
                    //刷新页面
                    tools.reloadView("month")
                }
            )
        }
    }
}
var calender_title_view = {
    type: "matrix",
    props: {
        id:"calender_title_view",
        title:"calender_title",
        scrollEnabled:false,
        columns: 7,
        itemHeight: titleH,
        bgcolor:$color("clear"),
        spacing: 1,
        selectable:false,
        template: [{
            type: "label",
            props: {
                id: "tile",
                align: $align.center,
                font: $font(18)
            },
            layout: $layout.fill
        }],
        data:$consts.weekList.map(function(item, idx){
            return {
                tile:{
                    text:item,
                    bgcolor: $color($consts.colorList.dark),
                    textColor: $color(idx === 0 || idx === 6 ? $consts.colorList.week : $consts.colorList.light),
                }
            }
        }),
    },
    layout: function(make){
        make.left.right.equalTo(0)
        make.top.equalTo($('calender_time_view').bottom)
        make.height.equalTo(titleH)
    }
}

var calender_body_view = {
    type: "matrix",
    props: {
        id:"calender_body_view",
        title:"calender_title",
        scrollEnabled:false,
        bgcolor:$color($consts.colorList.cur),
        itemHeight:45,
        columns: 7,
        spacing: 1,
        template: [{
            type: "label",
            props: {
                id: "cell",
                align: $align.center,
                font: $font(20)
            },
            layout(make){
                make.top.left.right.equalTo(0)
                make.height.equalTo(25)
            }
        },{
            type: "label",
            props: {
                id: "work_time",
                align: $align.center,
                font: $font(12)
            },
            layout(make){
                make.top.equalTo($('cell').bottom)
                make.right.left.equalTo(0)
                make.height.equalTo(19)
            }
        }],
        data:tools.getDaySource(),
    },
    layout: function(make){
        make.left.right.equalTo(0)
        make.top.equalTo($("calender_title_view").bottom)
        make.height.equalTo(46 * dateHandler.getDayList($cache.get("selectDay")).length / 7)
    },
    events:{
        didSelect:function(sender, indexPath, data){
            if(data.cell.text) { 
                var selectDay = $cache.get("selectDay")
                selectDay.day = parseInt(data.cell.text)
                var id = tools.getDateId(selectDay)
                //刷新数据
                tools.updateCache(
                    selectDay,
                    dateHandler.getDayList(selectDay),
                    Object.assign(sqlHandler.getWorkTime(id), sqlHandler.getTotalTime(selectDay))
                )
            }
            tools.reloadView();
        }
    }
}

var calender_info_view = {
    type:"label",
    props:{
        id:"calender_info_view",
        text:tools.getWorkTimeText(wtInfo).labelText + tools.getWorkTimeText(wtInfo).aveDayStr,
        font:$font(16),
        textColor:$color($consts.colorList.light),
        align:$align.left,
        lines:3
    },
    layout(make){
        make.top.equalTo($('calender_body_view').bottom)
        make.left.right.equalTo(0)
        make.height.equalTo(infoH)
    }
}

var calender_view = {
    type:"view",
    props:{
        id:('calender_view'),
        bgcolor:$color($consts.colorList.dark),
        info:{
            cellH : cellH,
            titleH : titleH,
            infoH : infoH,
            lines : dateHandler.getDayList($cache.get("selectDay")).length / 7
        }
    },
    layout:function(make, view){
        make.center.equalTo(view.super)
        make.size.equalTo(view.super)
    },
    views:[
        calender_time_view,
        calender_title_view,
        calender_body_view,
        calender_info_view
    ],
}

module.exports = calender_view