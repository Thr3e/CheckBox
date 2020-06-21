const DateHandler = require('./date.handler')
const SQLHandler  = require('./sql.handler')
const Tools       = require('./tool.handler')
const sqlHandler  = new SQLHandler
const dateHandler = new DateHandler
const tools       = new Tools
const $consts     = JSON.parse($file.read("assets/constant.json").string)
const day_options_view = require('./dayOptions.view')

const titleH = 40
const cellH  = 47
const infoH  = 70

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
            font:$font($consts.font.bold,20),
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
            font:$font($consts.font.regular,10),
            align:$align.center,
            textColor:$color($consts.colorList.light)
        },
        layout(make, view){
            make.top.equalTo(view.prev.bottom)
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
            tools.datePicker(1, "", 
                function(date){
                    var selectDay = {
                        year:date[3] * 1,
                        month:$consts.sortMonthObj[date[1]] * 1,
                        day:date[2],
                        weekDay:$consts.sortWeekObj[date[0]],
                    }
                    selectDay.date = tools.getDateId(selectDay)
                    updateSelectDay(selectDay)
                }
            )
        },
        touchesBegan(sender, bLoc){
            $cache.set("moveLoc", bLoc)
        },
        touchesEnded(sender, eLoc, callback){
            var bLoc = $cache.get("moveLoc");
            var dX = eLoc.x - bLoc.x;
            if(Math.abs(dX) < 5) return;
            var direction = dX < 0 ? "next" : "prev";
            $cache.remove("moveLoc");
            var selectDay = $cache.get("selectDay")
            let mon = selectDay.month;
            let year = selectDay.year;
            mon = direction == 'prev' ? mon - 1 : mon + 1;
            if(mon <= 0){
                year -= 1;
                mon += 12;
            }else if(mon >= 13){
                year += 1;
                mon -= 12;
            }
            let day = $cache.get("curDay").month == mon ? $cache.get("curDay").day : 1;
            selectDay.year = year;
            selectDay.month = mon;
            selectDay.day = day;
            selectDay.date = tools.getDateId(selectDay)
            selectDay.dateStr = tools.getDateString(selectDay, '-')
            selectDay.weekDay = tools.getWeekDay({year:year, month:mon, day:day})
            updateSelectDay(selectDay)
        },
        doubleTapped(sender){
            updateSelectDay($cache.get("curDay"));
        }
    }
}
var calender_title_view = {
    type: "matrix",
    props: {
        id:"calender_title_view",
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
                font:$font($consts.font.bold,18),
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
    layout: function(make, view){
        make.left.right.equalTo(0)
        make.top.equalTo(view.prev.bottom)
        make.height.equalTo(titleH)
    }
}

var calender_body_view = {
    type: "matrix",
    props: {
        id:"calender_body_view",
        scrollEnabled:false,
        bgcolor:$color($consts.colorList.cur),
        itemHeight:45,
        columns: 7,
        spacing: 1,
        template: [{
            type: "view",
            props: {
                id:"day_box"
            },
            layout: (make, view) => {
                make.center.equalTo(view.super);
                make.top.left.bottom.inset(0.5);
                make.right.equalTo(0)
            },
            views:[{
                type: "label",
                props: {
                    id: "day_title",
                    align: $align.center,
                    font: $font($consts.font.regular,20)
                },
                layout(make){
                    make.top.left.right.equalTo(0)
                    make.height.equalTo(25)
                },
            },{
                type: "label",
                props: {
                    id: "work_time",
                    align: $align.center,
                    font: $font($consts.font.regular,12)
                },
                layout(make, view){
                    make.top.equalTo(view.prev.bottom)
                    make.bottom.equalTo(view.super)
                    make.right.left.equalTo(0)
                },
            }],
            events:{
                longPressed:function(info){
                    var selectDay = info.sender.info;
                    if(sqlHandler.verifyData(selectDay.date)){
                        updateSelectDay(selectDay);
                        day_options_view.props.info = selectDay
                        $('main_view').add(day_options_view)
                    }
                }
            }
        }],
        data:tools.getDaySource(),
    },
    layout: function(make, view){
        make.left.equalTo(0).inset(0.5)
        make.right.equalTo(0).inset(1)
        make.top.equalTo(view.prev.bottom)
        make.height.equalTo(46 * dateHandler.getDayList($cache.get("selectDay")).length / 7)
    },
    events:{
        didSelect:function(sender, indexPath, data){
            if(data.day_title.text) { 
                var selectDay = $cache.get("selectDay")
                selectDay.day = parseInt(data.day_title.text)
                selectDay.date = tools.getDateId(selectDay)
                selectDay.weekDay = tools.getWeekDay(selectDay)
                updateSelectDay(selectDay);
            }
        }
    }
}

var calender_info_view = {
    type:"label",
    props:{
        id:"calender_info_view",
        text:tools.getWorkTimeText($cache.get("wtInfo")).labelText + tools.getWorkTimeText($cache.get("wtInfo")).monthTotalStr,
        font:$font($consts.font.bold,16),
        textColor:$color($consts.colorList.light),
        align:$align.left,
        lines:3
    },
    layout(make, view){
        make.top.equalTo(view.prev.bottom)
        make.left.right.equalTo(0)
        make.height.equalTo(infoH)
    }
}

var calender_view = {
    type:"view",
    props:{
        id:'calender_view',
        bgcolor:$color($consts.colorList.dark),
        smoothRadius:10,
        info:{
            cellH : cellH,
            titleH : titleH,
            infoH : infoH,
            lines : dateHandler.getDayList($cache.get("selectDay")).length / 7
        }
    },
    layout:$layout.fill,
    views:[
        calender_time_view,
        calender_title_view,
        calender_body_view,
        calender_info_view
    ],
}

module.exports = calender_view

function updateSelectDay(selectDay) {
    //刷新数据
    tools.updateCache(
        selectDay,
        dateHandler.getDayList(selectDay),
        Object.assign(sqlHandler.getWorkTime(selectDay.date), sqlHandler.getTotalTime(selectDay, 0)),
        sqlHandler.getWeekTime(dateHandler.getWeekDayList(selectDay))
    )
}