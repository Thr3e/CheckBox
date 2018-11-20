const nor_view  = require('./normal-case-view')
const calender  = require('./calendar-view')
const forget_view = require('./forgotten-case-view')
const DateHandler = require('./date-handler')
const SQLHandler  = require('./sql-handler')
const Tools       = require('./tool')
var $consts       = JSON.parse($file.read("assets/constant.json").string)
new DateHandler
new SQLHandler
new Tools
var home_view = {
  props:{
    id:"home_view",
    navBarHidden:true,
    statusBarStyle:0,
    bgcolor:$color($consts.colorList.bgcolor)
  },
  layout:$layout.fill,
  views: [{
    type: "scroll",
    props:{
      showsVerticalIndicator:false
    },
    layout(make, view){
      make.width.equalTo($device.info.screen.width * 0.8)
      make.height.equalTo(view.super)
      make.center.equalTo(view.super)
    },
    views: [{
      type:"view",
      props:{
        clipsToBounds:true,
        id:"checkbox",
        borderWidth:2,
        borderColor:$color($consts.colorList.basic),
        radius:10,
      },
      layout:function(make, view){
        make.width.equalTo(view.super)
        make.top.inset(10)
        make.height.equalTo(80)
      },
      views:[nor_view]
    },{
      type:"view",
      props:{
        clipsToBounds:true,
        id:"calender",
      },
      layout:function(make, view){
        make.top.equalTo(view.prev.bottom).offset(30)
        make.width.equalTo(view.super)
        make.height.equalTo((calender.props.info.cellH * calender.props.info.lines + calender.props.info.titleH * 2 + calender.props.info.infoH))
      },
      views:[calender]
    },{
      type:"view",
      props:{
        clipsToBounds:true,
        id:"forget"
      },
      layout:function(make, view){
        make.top.equalTo(view.prev.bottom).offset(30)
        make.width.equalTo(view.super)
        make.height.equalTo(forget_view.props.info.lines * forget_view.props.info.lineH + 15)
      },
      views:[forget_view]
    },{
      type:"view",
      props:{
        id:"black_holder",
        bgcolor:$color("clear")
      },
      layout(make, view){
        make.width.equalTo(view.super)
        make.height.equalTo(1)
        make.top.equalTo(view.prev.bottom).offset(50)
      }
    }]
  }]
}

module.exports = home_view
