var $consts = JSON.parse($file.read("assets/constant.json").string)
var home_view = require("./home-view")
var web_view = require("./web-view")
$ui.render({
    props: {
        id:"main_view",
        navBarHidden:true,
        statusBarStyle:0,
        clipsToBounds:true,
        bgcolor:$color($consts.colorList.bgcolor),
        homeIndicatorHidden:true
    },
    views: [{
        type: "view",
        props: {
            id: "content_view"
        },
        layout: $layout.fill,
        views:[web_view]
    },{
        type:"menu",
        props:{
            id:"menu",
            borderWidth:0.5,
            borderColor:$color("black")
        },
        layout(make, view){
            make.left.right.equalTo(0)
            make.bottom.equalTo(view.super.bottom).offset(2)
            make.height.equalTo(80)
        },
        views:[{
            type:"button",
            props:{
                title:"home",
                radius:0,
                bgcolor:$color("clear"),
                borderWidth:0.5,
                borderColor:$color("red"),
                titleColor:$color("black")
            },
            layout(make, view){
                make.top.bottom.left.equalTo(0)
                make.width.equalTo($device.info.screen.width / 2)
            }
        },{
            type:"button",
            props:{
                title:"web",
                radius:0,
                bgcolor:$color("clear"),
                borderWidth:0.5,
                borderColor:$color("red"),
                titleColor:$color("black")
            },
            layout(make, view){
                make.top.bottom.equalTo(0)
                make.left.equalTo(view.prev.right)
                make.width.equalTo($device.info.screen.width / 2)
            }
        }]
    }]
});