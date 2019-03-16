class DateHandler{
    constructor(){
        this.date      = new Date()
        this.dayData   = this.date.toLocaleDateString().split('/')
        this.year      = parseInt(this.dayData[0])
        this.month     = parseInt(this.dayData[1])
        this.day       = parseInt(this.dayData[2])
        this.hour      = this.date.getHours()
        this.min       = this.date.getMinutes()
        this.id        = this.year * 10000 + this.month * 100 + this.day * 1
        this.time      = this.date.toTimeString().slice(0,5)
        this.timeData  = parseFloat((this.hour * 1.0 + this.min/ 60).toFixed(2))
        this.cacheInit()
    }

    cacheInit(sDay){
        let obj = sDay ? sDay : this.currentTime
        $cache.set("curDay", this.currentTime)
        $cache.set("selectDay", obj)
        $cache.set("dayList", this.getDayList(obj))
    }
    
    get currentTime(){
        return {
            year     : this.year,
            month    : this.month,
            day      : this.day,
            date     : this.id,
            time     : this.time,
            timeData : this.timeData,
            dateStr  : this.dayData.join('-')
        }
    }

    getDayList(val){
        var month = val.month || this.month
        var year  = val.year  || this.year 
        var lastDate  = new Date(year, month, 0)
        var firstDate = new Date(year, month - 1, 1)
        var lastDay  = lastDate.getDate()
        var lastDate = lastDate.getDay()
        var firstDay = firstDate.getDay()
        var list = [];
        for (var i = 0; i < firstDay; i++){
            list.push({text:"",id:""})
        }
        for (var j = 1; j <= lastDay; j++){
            list.push({
                text:"" + j,
                id:`${year}${month < 10 ? "0" + month.toString() : month}${j < 10 ? "0" + j.toString() : j}`})
        }
        for (var k = 6; k > lastDate; k--){
            list.push({text:"",id:""})
        }
        return list
    }
}

module.exports = DateHandler