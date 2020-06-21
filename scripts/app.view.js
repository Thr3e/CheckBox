const nor_view      = require('./basic.view')
const calender_view = require('./calendar.view')
const forget_view   = require('./forgotten.view')
const $consts       = JSON.parse($file.read("assets/constant.json").string)
const viewWidth     = 300
const paddingX      = ($device.info.screen.width - viewWidth) / 2

const checkbox = {
  type:"view",
  props:{
    clipsToBounds:true,
    id:"checkbox",
    borderWidth:2,
    borderColor:$color($consts.colorList.basic),
    radius:10
  },
  layout(make, view){
    make.top.equalTo(view.super).inset(60)
    make.right.inset(paddingX)
    make.width.equalTo(viewWidth)
    make.height.equalTo(80)
  },
  views:[nor_view]
}

const calender = {
  type:"view",
  props:{
    clipsToBounds:true,
    id:"calender",
  },
  layout(make, view){
    make.centerY.equalTo(view.super).offset(-32)
    make.left.inset(paddingX)
    make.width.equalTo(viewWidth)
    make.height.equalTo((calender_view.props.info.cellH * calender_view.props.info.lines + calender_view.props.info.titleH * 2 + calender_view.props.info.infoH))
  },
  views:[calender_view]
}

const forget = {
  type:"view",
  props:{
    clipsToBounds:true,
    id:"forget"
  },
  layout(make, view){
    make.bottom.equalTo(view.super).inset(30)
    make.right.inset(paddingX)
    make.width.equalTo(viewWidth)
    make.height.equalTo(forget_view.props.info.lines * forget_view.props.info.lineH + 15)
  },
  views:[forget_view]
}

$ui.render({
  props:{
    id:"main_view",
    navBarHidden:true,
    statusBarStyle:0,
    bgcolor:$color($consts.colorList.bgcolor)
  },
  views: [checkbox, calender, forget]
})
