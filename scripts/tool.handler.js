class Tools {
    constructor(){}
    //计算工时
    calWorkTime(sData, eData){
        if(!sData || !eData){
            return null
        }
        var wt = 0.0
        sData = this._fixTimeData(sData)
        eData = this._fixTimeData(eData)
        //正常打卡 && 加班
        if (sData <= 12 && eData >12) wt = eData - sData - 1.5
        //请假等异常
        else wt = eData - sData
        return wt
    }
    
    _fixTimeData(data){
        data = data < 8.5 ? 8.5 : data
        data = data > 12.0 && data < 13.5 ? 12.0 : data
        data = data > 18.0 && data < 18.5 ? 18.0 : data
        data = data > 18.5 ? data - 0.5 : data
        return data
    }

    getWorkTimeText(wtObj){
        var tab = "  "
        return {
            workTime:wtObj.worktime,
            labelText:tab + "check time : " + (wtObj.starttime?wtObj.starttime:"Uncheck") + " - " + (wtObj.endtime?wtObj.endtime:"Uncheck") + '\n' + tab + "work time : " + (wtObj.worktime || wtObj.worktime === 0?(wtObj.worktime).toFixed(2):"Haven't finish check"),
            shortWT:"check: " + (wtObj.starttime?wtObj.starttime:"Null") + " - " + (wtObj.endtime?wtObj.endtime:"Null"),
            timeStr: parseInt(Math.abs(wtObj.total * 60)) + "min",
            aveDayStr:'\n' + tab + "month avg time : " + (wtObj.aveDay && wtObj.aveDay !== "NaN"?wtObj.aveDay:"0"),
            monthTotalStr:'\n' + tab + "month total time : " + (wtObj.monthTotal && wtObj.monthTotal !== "NaN"?wtObj.monthTotal:"0")
        }
    }

    datePicker(type, item, callback){
        //日期、时间选择器
        if (type === 0 || type === 1){
            $picker.date({
                props:{
                    mode:type
                },
                handler: function(date) {
                    callback(date.toString().split(' '))
                }
            });
        }
        //通用选择器
        else {
            $picker.data({
                props:{
                    items: item
                },
                handler: function(date) {
                    callback(date)
                }
            });
        }
    }

    getDaySource(){
        var colorList = JSON.parse($file.read("assets/constant.json").string).colorList
        var selectDate = $cache.get("selectDay")
        var workTimeList = $cache.get("wtInfo").wtList
        return $cache.get("dayList").map((item, idx) => {
            var bgColor = parseInt(item.text) === parseInt(selectDate.day) ? colorList.cur : colorList.light
            var textColor = idx % 7 === 0 || idx % 7 === 6 ? colorList.week : colorList.dark
            return {
                day_title:{
                    text:item.text,
                    bgcolor:  $color(bgColor),
                    textColor: $color(textColor),
                    info:{id:item.id}
                },
                work_time:{
                    text:`${workTimeList[item.text] || workTimeList[item.text] === 0? workTimeList[item.text].toFixed(2) : ''}`,
                    bgcolor:  $color(bgColor),
                    textColor: $color(textColor),
                    info:{id:item.id}
                }
            }
        })
    }

    getDateId(val){
        return val.year * 10000 + val.month * 100 + val.day * 1
    }

    getDateString(val, breaker){
        return val.year + breaker + this.getStandardizedNumStr(val.month) + breaker + this.getStandardizedNumStr(val.day)
    }

    getStandardizedNumStr(num){
        return num < 10 ? "0" + num : "" + num
    }

    updateSubCache(key, subKey, val){
        var cacheObj = $cache.get(key)
        cacheObj[subKey] = val
        $cache.set(key, cacheObj)
    }

    reloadView(type){
        var wtInfo = $cache.get("wtInfo")
        var weekInfo = $cache.get("weekInfo")
        var selectDay = $cache.get("selectDay")
        var $consts = JSON.parse($file.read("assets/constant.json").string)
        switch(type){
            case "check" : {
                $('date_info_view').text = this.getDateString($cache.get("selectDay"), '-') + " " + this.getWorkTimeText(wtInfo).shortWT
            };
            case "curCheck" :{
                $('total_count_view').text = "MonthAbouv: " + Math.abs(wtInfo.total)
                $('total_count_view').textColor = $color(wtInfo.total >= 0 ?$consts.colorList.positive:$consts.colorList.negative)       
            };
            case "reCheck" : {
                $('forgotten-time-select-view').text = "Select the Time"
                $("forgotten-check-type-tab").views[0].bgcolor = $color($consts.colorList.basic)
                $("forgotten-check-type-tab").views[0].textColor = $color($consts.colorList.bgcolor)
                $("forgotten-check-type-tab").views[1].bgcolor = $color($consts.colorList.bgcolor)
                $("forgotten-check-type-tab").views[1].textColor = $color($consts.colorList.basic)
            };
            case "month" : {
                $('calender_month_view').text = JSON.parse($file.read("assets/constant.json").string).monthList[selectDay.month - 1]
                $('calender_year_view').text = selectDay.year + ""
            };
            default : {
                $("overtime_view").remove();
                $("main_view").add(require('./overtime.view'));
                $('forgotten-date-select-view').text = selectDay.year ? this.getDateString(selectDay, "-") : "Select the Day"
                $("calender_body_view").data = this.getDaySource()
                $("calender_body_view").updateLayout((make) => {
                    make.height.equalTo(parseInt(this.getDaySource().length / 7) * ($("calender_view").info.cellH - 1))
                })
                $("calender").updateLayout((make) => {
                    make.height.equalTo(parseInt(this.getDaySource().length / 7) * $("calender_view").info.cellH + $("calender_view").info.titleH * 2 + $("calender_view").info.infoH)
                })
                $('calender_info_view').text = this.getWorkTimeText(wtInfo).labelText + this.getWorkTimeText(wtInfo).monthTotalStr
            }
        }
    }

    updateCache(sDay,dayList,wtInfo,weekInfo){
        if (sDay) $cache.set("selectDay", sDay)
        if (dayList) $cache.set("dayList", dayList)
        if (wtInfo) $cache.set("wtInfo", wtInfo)
        if (weekInfo) $cache.set("weekInfo", weekInfo)
    }

    getWeekDay(dayObj){
        if(dayObj.year && dayObj.month && dayObj.day){
            return new Date(dayObj.year, dayObj.month - 1, dayObj.day).getDay()
        }
        return 0
    }

    alertDeleteWarn(callback){
        $ui.alert({
            title: "Warning",
            message: "Sure to delete this day's data?",
            actions:[
                {
                    title:"Cancel",
                    handler:function(){}
                },
                {
                    title:"OK",
                    handler:callback
                }
            ]
        });
    }

}

module.exports = Tools
