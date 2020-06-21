const Tools       = require('./tool.handler')
const OptionBtns  = require('./optionBtns.view')
const tools       = new Tools
const $consts     = JSON.parse($file.read("assets/constant.json").string)

var option_btn_view = {
  type: 'view',
  props: {
    id: 'option_btn_view',
  },
  layout: (make, view) => {
    make.top.equalTo(view.prev.bottom),
    make.bottom.equalTo(view.super)
    make.width.equalTo(view.super);
  },
  views:[{
    type: 'view',
    props: {
      id: 'overtime_btn_view',
    },
    layout: (make, view) => {
      make.top.equalTo(view.super),
      make.width.equalTo(view.super);
      make.height.equalTo(80)
      view.scale(0.7)
    },
    views:[OptionBtns.overtime_view]
  }, {
    type: 'view',
    props: {
      id: 'changepo_btn_view',
    },
    layout: (make, view) => {
      make.top.equalTo(view.prev.bottom),
      make.width.equalTo(view.super);
      make.height.equalTo(80)
      view.scale(0.7)
    },
    views:[OptionBtns.changePO_view]
  }, {
    type: 'view',
    props: {
      id: 'delete_btn_view',
    },
    layout: (make, view) => {
      make.top.equalTo(view.prev.bottom),
      make.width.equalTo(view.super);
      make.height.equalTo(80)
      view.scale(0.7)
    },
    views:[OptionBtns.deleteDay_view]
  }],
  events: {}
}

var option_box_view = {
	type:"view",
	props:{
		id:"option_box_view",
		font: $font($consts.font.bold,18),
    bgcolor: $color($consts.colorList.light),
    cornerRadius: 10,
    smoothCorner: true,
    alpha: 0
	},
	layout: (make, view) => {
    make.center.equalTo(view.super)
    make.height.equalTo(view.super).multipliedBy(0.4)
    make.width.equalTo(view.super).multipliedBy(0.6)
    view.scale(0)
  },
  views:[{
    type: "label",
    props: {
      id:"option_title",
      font:$font($consts.font.bold,20),
      textColor:$color($consts.colorList.dark),
      align: $align.center
    },
    layout: function(make, view) {
      make.centerX.equalTo(view.super)
      make.top.equalTo(view.super)
      make.height.equalTo(50)
    },
    events: {
      ready(sender){
        sender.text = tools.getDateString($cache.get("selectDay"), "-")
      }
    }
  }]
}

var back_cover_view = {
	type:"view",
	props:{
		id:"back_cover_view",
    bgcolor:$color($consts.colorList.dark),
    alpha: 0
	},
	layout:$layout.fill,
	events:{
    tapped(){
      $('day_options_view').remove()
    }
	}
}

var day_options_view = {
	type:"view",
	props:{
    id:'day_options_view',
    info:{}
	},
	views:[
    back_cover_view,
    // 视图越靠后，越浮在顶层
    option_box_view
	],
	layout: (make, view) => {
    make.size.equalTo(view.super)
    make.top.left.equalTo(0)
  },
  events: {
    ready: (sender) => {
      OptionBtns.setCurDay(sender.info);
      $("option_box_view").add(option_btn_view)
      sender.moveToFront();
      var optionView = $("option_box_view")
      optionView.moveToFront();
      $ui.animate({
        duration: 0.4,
        animation: function() {
          $("back_cover_view").alpha = 0.4;
          optionView.alpha = 1;
          optionView.scale(1)
        }
      });
    }
  }
}

module.exports = day_options_view
