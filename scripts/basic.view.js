const DateHandler = require('./date.handler')
const SqlHandler  = require('./sql.handler')
const Tools       = require('./tool.handler')
var dateHandler = new DateHandler
var sqlHandler  = new SqlHandler
var tools       = new Tools
var $consts = JSON.parse($file.read("assets/constant.json").string)

var message_view = {
  type:"view",
  props:{
    id:"message_view"
  },
  layout(make,view){
    make.centerY.equalTo(view.super)
    make.left.inset(0)
    make.right.equalTo(view.prev.left).inset(10)
    make.height.equalTo(50)
  },
  views:[{
    type:"label",
    props:{
      id:"total_count_view",
      text:"CountDown: " + Math.abs($cache.get("weekInfo").aveDay),
      font:$font($consts.font.bold,27),
      autoFontSize:true,
      textColor:$color($cache.get("weekInfo").aveDay >= 0 ?$consts.colorList.positive:$consts.colorList.negative)
    },
    layout(make){
      make.top.left.right.equalTo(0)
      make.height.equalTo(30)
    },
    events:{
      tapped(sender){
        var titles = ["CountDown", "WeekTotal", "MonthAbouv", "MonthTotal"]
        var times = [$cache.get("weekInfo").aveDay, $cache.get("weekInfo").total, $cache.get("wtInfo").total, $cache.get("wtInfo").monthTotal]
        var colors = [$consts.colorList.positive, $consts.colorList.negative]
        var showTitle = titles[0]
        var showTime = times[0]
        var titleColor = colors[0]
        titles.forEach((t,i) => {
          if(sender.text.indexOf(t) >= 0) {
            var idx = (i + 1) % titles.length
            showTitle = titles[idx]
            showTime = Math.abs(times[idx])
            titleColor = times[idx - idx % 2] < 0 ? colors[1] : colors [0]
            return
          }
        })
        sender.text = showTitle + ": " + showTime
        sender.textColor = $color(titleColor)
      }
    }
  },{
    type:"label",
    layout(make, view){
      make.left.right.equalTo(0)
      make.bottom.equalTo(view.super.bottom)
      make.top.equalTo(view.prev.bottom)
    },
    props:{
      id:"date_info_view",
      textColor:$color($consts.colorList.basic),
      text:tools.getDateString(dateHandler.currentTime, '-') + " " + tools.getWorkTimeText($cache.get("wtInfo")).shortWT,
      font:$font($consts.font.regular,16),
      autoFontSize:true
    }
  }]
}

var checkin_btn_view = {
  type: "button",
  props: {
    id: "checkin_btn",
    title: "Check",
    font:$font($consts.font.bold,18),
    bgcolor:$color($consts.colorList.basic)
  },
  layout(make, view) {
    make.centerY.equalTo(view.super)
    make.right.inset(0)
    make.width.equalTo(72)
    make.height.equalTo(42)
  },
  events: {
    tapped(){
      $device.taptic(2)
      var curDate = dateHandler.currentTime
      var isChecked = sqlHandler.verifyData(curDate.date)
      if(!isChecked) sqlHandler.createNewLine(curDate)
      sqlHandler.updateData(isChecked, curDate, curDate.date)
      if(isChecked) {
        var timeData = sqlHandler.getTimeData(curDate.date)
        var workTime = tools.calWorkTime(timeData.STARTDATA, timeData.ENDDATA)
        sqlHandler.setWorkTime(workTime.toFixed(2), curDate.date)
      }
      //刷新数据
      tools.updateCache(
          curDate,
          dateHandler.getDayList(curDate),
          Object.assign(sqlHandler.getWorkTime(curDate.date), sqlHandler.getTotalTime(curDate, 0)),
          sqlHandler.getWeekTime(dateHandler.getWeekDayList(curDate))
      )
      //刷新页面
      tools.reloadView("check")
    }
  }
}
var normal_case_view = {
  type:"view",
  layout(make, view){
    make.height.equalTo(view.super)
    make.left.right.inset(20)
  },
  props:{
    id:"normal_case_view",
  },
  views:[
    checkin_btn_view,
    message_view,
  ]
}

module.exports = normal_case_view
