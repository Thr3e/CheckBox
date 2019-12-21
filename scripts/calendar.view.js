const DateHandler = require('./date.handler')
const SQLHandler  = require('./sql.handler')
const Tools       = require('./tool.handler')
var sqlHandler    = new SQLHandler
var dateHandler   = new DateHandler
var tools         = new Tools
var $consts       = JSON.parse($file.read("assets/constant.json").string)

var titleH = 40
var cellH  = 47
var infoH  = 70

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
                        weekDay:$consts.sortWeekObj[date[0]]
                    }
                    var id = tools.getDateId(selectDay)
                    //刷新数据
                    tools.updateCache(
                        selectDay,
                        dateHandler.getDayList(selectDay),
                        Object.assign(sqlHandler.getWorkTime(id), sqlHandler.getTotalTime(selectDay, 0)),
                        sqlHandler.getWeekTime(dateHandler.getWeekDayList(selectDay))
                    )
                    //刷新页面
                    tools.reloadView("check")
                }
            )
        },
        touchesBegan(sender, bLoc){
            $("scroll_view").scrollEnabled = false
            $cache.set("moveLoc", bLoc)
        },
        touchesEnded(sender, eLoc, callback){
            $("scroll_view").scrollEnabled = true
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
            //刷新页面
            tools.updateCache(
                selectDay,
                dateHandler.getDayList(selectDay),
                Object.assign(sqlHandler.getWorkTime(tools.getDateId(selectDay)), sqlHandler.getTotalTime(selectDay, 0)),
                sqlHandler.getWeekTime(dateHandler.getWeekDayList(selectDay))
            )
            tools.reloadView("check")
        },
        doubleTapped(sender){
            let selectDay = $cache.get("curDay");
            //刷新数据
            tools.updateCache(
                selectDay,
                dateHandler.getDayList(selectDay),
                Object.assign(sqlHandler.getWorkTime(tools.getDateId(selectDay)), sqlHandler.getTotalTime(selectDay, 0)),
                sqlHandler.getWeekTime(dateHandler.getWeekDayList(selectDay))
            )
            //刷新页面
            tools.reloadView("check")
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
        title:"calender_title",
        scrollEnabled:false,
        bgcolor:$color($consts.colorList.cur),
        itemHeight:45,
        columns: 7,
        spacing: 1,
        template: [{
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
            events:{
                longPressed:function(info){
                    let id = info.sender.info.id;
                    if(id != "" && sqlHandler.verifyData(id)){
                        tools.alertDeleteWarn(function(){
                            sqlHandler.cleanData(id);
                            sqlHandler.cacheInit();
                            dateHandler.cacheInit($cache.get("selectDay"));
                            tools.reloadView("check");
                        });
                    }
                }
            }
        },{
            type: "label",
            props: {
                id: "work_time",
                align: $align.center,
                font: $font($consts.font.regular,12)
            },
            layout(make, view){
                make.top.equalTo(view.prev.bottom)
                make.right.left.equalTo(0)
                make.height.equalTo(19)
            },
            events:{
                longPressed:function(info){
                    let id = info.sender.info.id;
                    if(id != "" && sqlHandler.verifyData(id)){
                        tools.alertDeleteWarn(function(){
                            sqlHandler.cleanData(id);
                            sqlHandler.cacheInit();
                            dateHandler.cacheInit();
                            tools.reloadView("check");
                        });
                    }
                }
            }
        }],
        data:tools.getDaySource(),
    },
    layout: function(make, view){
        make.left.right.equalTo(0)
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
                //刷新数据
                tools.updateCache(
                    selectDay,
                    dateHandler.getDayList(selectDay),
                    Object.assign(sqlHandler.getWorkTime(selectDay.date), sqlHandler.getTotalTime(selectDay, 0)),
                    sqlHandler.getWeekTime(dateHandler.getWeekDayList(selectDay))
                )
                tools.reloadView('check');
            }
            if(data.work_time.text){
                let workTypeObj = sqlHandler.queryWorkTime(data.work_time.info.id);
                if(workTypeObj.hasData){
                    $("overtime_btn").hidden = workTypeObj.type == 0 ? false : true
                    $("overtime_un_btn").hidden = workTypeObj.type == 1 ? false : true
                }
                if($("overtime_view").alpha == 0){
                    $ui.animate({
                        duration: 0.5,
                        animation: function() {
                            $("overtime_view").alpha = 0.7
                        },
                    });
                }
            }else if(!data.work_time.text && $("overtime_view").alpha != 0){
                $ui.animate({
                    duration: 0.5,
                    animation: function() {
                        $("overtime_view").alpha = 0.0
                    },
                });
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
        id:('calender_view'),
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