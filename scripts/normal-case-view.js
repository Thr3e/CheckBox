const DateHandler = require('./date-handler')
const SqlHandler  = require('./sql-handler')
const Tools       = require('./tool')
var dateHandler = new DateHandler
var sqlHandler  = new SqlHandler
var tools       = new Tools
var $consts = JSON.parse($file.read("assets/constant.json").string)
var wtInfo = $cache.get("wtInfo")

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
      text:"TotalCount: " + Math.abs(wtInfo.total),
      font:$font($consts.font.bold,27),
      autoFontSize:true,
      textColor:$color(wtInfo.total >= 0 ?$consts.colorList.positive:$consts.colorList.negative)
    },
    layout(make){
      make.top.left.right.equalTo(0)
      make.height.equalTo(30)
    },
    events:{
      tapped(sender){
        var wtInfo = $cache.get("wtInfo")
        sender.text = sender.text.indexOf("min") === -1 ?"TotalCount: " + tools.getWorkTimeText(wtInfo).timeStr : "TotalCount: " + Math.abs(wtInfo.total)
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
      text:dateHandler.currentTime.dateStr + " " + tools.getWorkTimeText(wtInfo).shortWT,
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
          Object.assign(sqlHandler.getWorkTime(curDate.date), sqlHandler.getTotalTime(curDate))
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
