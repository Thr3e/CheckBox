# 开发日志

## 版本日志

### 11.6更新计划

>version 0.0.1

- 点击“check”按钮之后页面刷新
- 优化通知中心配色
- 开启补打卡页面工作
- 找到同步dev版本的方式

### 11.7

- 已完善多出点击后更新效果
- dev同步方式可以为拷贝scripts文件夹

遗留问题

- 补打卡页面
- 通知中心配色
- 日历选择月份功能
  
### 11.8

- 代码重构，调整大量代码，使app更符合mvc模式，逻辑更简洁，调用更简单，耦合更低
- 完成日历选月份功能
- 日历中新增年份显示信息
- 更新功能日均工时计算
- 更新功能一键切换总计工时为以分钟为单位
- 修复bug：在选择其他月份后，点击打卡按钮，日历中详情信息显示目前实际月份打卡信息的问题

### 11.9

今日计划

- 发现系统提供日历/提醒事项的SDK，可以在后面版本实现
- 创建独立文件来保存某些常量
- 学习缓存机制保存某些常用变量

### 11.11

>version 0.1.0

- 常用常量已单独保存至assets/constant.json文件中，便于灵活调用
- 利用缓存机制保存多页面调用的变量，从而实现了一个函数即可刷新页面的功能，(降低耦合度?)
- 暂定目前版本为0.1.0版本，托管至Git

### 11.13

>version 0.1.1

- 完成主页scroll视图展示
- 隐藏主页topBar及title
- 修复bug:checkView中总工时统计，若发生正负工时变化，会导致字体颜色显示错误，
- 修复bug:checkView中总工时点击事件，数据来源有误

### 11.18

>version 0.2.0

- 完成补打卡功能、页面
- 调整页面字体风格及部分样式
- 修改Button视图背景颜色

### 11.20

>version 0.2.1

- 增加forgotten模块日期选择器与calender模块的相互影响(类似于双向绑定效果)
- 重写forgotten模块内“上/下班”打卡选择器实现方式，修改为自定义type，便于符合app整体UI风格
- 优化app页布局方式
- 优化normal模块布局方式
- 将字体、页面背景色加入常量库便于统一管理  

### 11.21

> *由于网页问题取消该开发计划*
>
> ~~计划开发tab页直接访问打卡页面，目前问题出在网址访问过去会自动调到手机版web，并且没有查看打卡信息的地方~~

### 2019

### 3.12

>version 0.2.2

- 了解view的ready()事件
- 补打卡框，在创建完成后制动补全当时时间信息
- 长按日历中日期框可以删除当日打卡数据
- 左右滑动年月标题栏可以切换月份，双击回到当前月份

## 开发计划

| 紧急程度 | 开发内容 | 完成情况 |
| :------ | :------ | :------ |
| 优化 | 通知中心配色 | <font color=Crimson>未开启</font> |
| 需求 | 增加补打卡功能 | <font color=Lime>已完成</font> |
| 需求 | 增加请假功能 | <font color=Crimson>未开启</font> |
| BUG | 选择其他月份之后再选择本月，无法自动将本日高亮 | <font color=Lime>已完成</font> |
| 需求 | 发现系统提供日历/提醒事项的SDK，可以在后面版本实现 | <font color=Crimson>未开启</font> |
| 需求 |增加顶部title栏即设置Button| <font color=Crimson>未开启</font> |
| 需求 |增加设置相关功能便于自定义主题、导出表格等| <font color=Crimson>未开启</font> |
| <font color=DimGray>~~取消~~</font> |<font color=DimGray>~~增加底部导航栏~~</font>| <font color=DimGray>~~已取消~~</font> |
| 需求 |增加加班记录功能| <font color=Crimson>未开启</font> |
| 需求 |增加节假日信息| <font color=Crimson>未开启</font> |
| 需求 |增加左右滑动日历可以换月份的功能| <font color=Lime>已完成</font> |
| 计划 |考虑是否根据上班日记算工作时间，而不是按打卡记录计算。该计划涉及到：请假功能、节假日/工作日信息、请假功能、记录加班/请假日期功能、计算年休假功能。内容较多，是否有必要实现待考虑| <font color=Crimson>未开启</font> |