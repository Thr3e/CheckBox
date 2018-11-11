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
  // views:[{
  //   type:"scroll",
  //   layout(make,view){
  //     make.top.equalTo(0)
  //     make.size.equalTo($size(WID,1000))
  //   },
    props: {
      title: "Check Box dev",
      id: "app_main_view"
    },
    views: [{
      type:"view",
      props:{
        clipsToBounds:true,
        id:"checkbox"
        
      },
      layout:function(make){
        make.top.equalTo(0)
        make.left.right.inset(WID * 0.02)
        make.size.equalTo($size((WID), (100)))
      },
      views:[nor_view],
      events:{
        tapped(sender){
          console.log($cache.get("dayList"))
        }
      }
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
        make.left.right.inset((WID - wid) / 2)
        make.height.equalTo((calender.props.info.cellH * calender.props.info.lines + calender.props.info.titleH * 2 + calender.props.info.infoH))
      },
      views:[calender]
    // },{
    //   type:"view",
    //   props:{
    //     clipsToBounds:true,
    //     id:"calender_view_a",
    //     smoothRadius:10
    //   },
    //   layout:function(make){
    //     var wid = WID * 0.8
    //     make.top.equalTo(600)
    //     make.left.right.inset((WID - wid) / 2)
    //     make.height.equalTo((calender.props.info.cellH * calender.props.info.lines + calender.props.info.titleH * 2 + calender.props.info.infoH))
    //   },
    //   views:[calender]
    }]
  // }]
});