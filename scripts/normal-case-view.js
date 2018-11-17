const DateHandler = require('./date-handler')
const SqlHandler  = require('./sql-handler')
const Tools       = require('./tool')
var sqlHandler  = new SqlHandler
var dateHandler = new DateHandler
var tools       = new Tools
var $consts = JSON.parse($file.read("assets/constant.json").string)

var btnWid = 72
var padding = 20

var wtInfo = $cache.get("wtInfo")
var checkin_btn_view = {
  type: "button",
  props: {
    id: "checkin_btn",
    title: "Check",
    font:$font("ChalkboardSE-Bold",18),
    bgcolor:$color($consts.colorList["basic"])
  },
  layout: function(make, view) {
    make.centerY.equalTo(view.super)
    make.right.equalTo(-1 * padding)
    make.width.equalTo(btnWid)
    make.height.equalTo(42)
  },
  events: {
    tapped:function(){
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

var message_view = {
  type:"view",
  layout(make,view){
    make.centerY.equalTo(view.super)
    make.left.equalTo(padding)
    make.right.equalTo(-(btnWid + padding * 2))
    make.height.equalTo(70)
  },
  props:{
    id:"message_view"
  },
  views:[{
    type:"label",
    layout(make){
      make.top.left.right.equalTo(0)
      make.height.equalTo(40)
    },
    props:{
      id:"total_count_view",
      text:"TotalCount: " + Math.abs(wtInfo.total),
      font:$font("ChalkboardSE-Bold",27),
      autoFontSize:true,
      textColor:$color(wtInfo.total >= 0 ?$consts.colorList.positive:$consts.colorList.negative)
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
      make.height.equalTo(20)
      make.top.equalTo(view.prev.bottom)
    },
    props:{
      id:"date_info_view",
      textColor:$color($consts.colorList["basic"]),
      text:dateHandler.currentTime.dateStr + " " + tools.getWorkTimeText(wtInfo).shortWT,
      font:$font("ChalkboardSE-Regular",16),
      autoFontSize:true
    }
  }]
}

var normal_case_view = {
  type:"view",
  layout:$layout.fill,
  props:{
    id:"normal_case_view"
  },
  views:[
    message_view,
    checkin_btn_view
  ]
}

module.exports = normal_case_view
