var normal_view = require('./basic.view')
$ui.render({
    type:"view",
    views: [
        normal_view
    ],
    layout(make){
        make.top.left.right.equalTO(0)
        make.height.equalTo(220)
    }
});