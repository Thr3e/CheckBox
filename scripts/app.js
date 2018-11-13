const nor_view  = require('./normal-case-view')
const calender  = require('./calendar-component')
const DateHandler = require('./date-handler')
const SQLHandler  = require('./sql-handler')
const Tools       = require('./tool')
const WID       = $device.info.screen.width
new DateHandler
new SQLHandler
new Tools
$ui.render({
  props:{
    id:"main_view",
    navBarHidden:true,
    statusBarStyle:0,
  },
  views: [{
    type: "scroll",
    layout: $layout.fill,
    views: [{
      type:"view",
      props:{
        clipsToBounds:true,
        id:"checkbox"
      },
      layout:function(make, view){
        make.width.equalTo(view.super)
        make.top.offset(50)
        make.left.inset(0)
        make.height.equalTo(100)
      },
      views:[nor_view]
    },{
      type:"view",
      props:{
        clipsToBounds:true,
        id:"calender",
        smoothRadius:10
      },
      layout:function(make){
        var wid = WID * 0.8
        make.top.equalTo($('checkbox').bottom).offset(30)
        make.left.inset((WID - wid) / 2)
        make.width.equalTo(wid)
        make.height.equalTo((calender.props.info.cellH * calender.props.info.lines + calender.props.info.titleH * 2 + calender.props.info.infoH))
      },
      views:[calender]
    }]
  }]
})
