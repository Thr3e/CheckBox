class SQLHandler {
    constructor(){
        this.cacheInit()
    }

    _dbQuery(callback){
        var dbObj = callback($sqlite.open("baseDB.db"))
        $sqlite.close(dbObj.data_base)
        delete(dbObj['data_base'])
        if (dbObj) return dbObj
    }

    createNewTable(){
        this._dbQuery(function(db){
            var rs = db.query('SELECT * FROM CheckLog')
            if (rs.error){
                db.update("CREATE TABLE CheckLog (ID INTEGER PRIMARY KEY, YEAR INTEGER, MONTH INTEGER, DAY INTEGER, STARTTIME TEXT, ENDTIME TEXT, STARTDATA REAL, ENDDATA REAL, WORKTIME REAL)")
            }
            return {data_base:db}
        })
    }
    
    verifyData(id){
         return this._dbQuery(function(db){
            var rs = db.query({
                sql:"SELECT * FROM CheckLog WHERE ID = ?",
                args:[id]
            }).result
            var hasData = rs.next()
            return {
                data_base : db,
                hasData   : hasData
            }
        }).hasData
    }
      
    
    createNewLine(dateObj){
        var args = [dateObj.date, dateObj.year, dateObj.month, dateObj.day, null, null, null, null, null]
        this._dbQuery((db) => {
            db.update({
                sql:"INSERT INTO CheckLog values(?,?,?,?,?,?,?,?,?)",
                args: args
            })
            return {data_base: db}
        })
    }
    
    updateData(checkType, timeObj, id){
        var args = [timeObj.time, (timeObj.timeData).toFixed(2), id]
        var db   = $sqlite.open("baseDB.db")
        //checkType == true : 上班打卡; false : 下班打卡
        if(checkType){
        db.update({
            sql:"UPDATE CheckLog SET STARTTIME = ?, STARTDATA = ? WHERE ID = ?",
            args: args
        })
        }else{
        db.update({
            sql:"UPDATE CheckLog SET ENDTIME = ?, ENDDATA = ? WHERE ID = ?",
            args: args
        })
        }
        db.close()
        $ui.toast("打卡成功")
    }
    
    cleanData(id){
        this._dbQuery(function(db){
            db.update({
                sql:"DELETE FROM CheckLog WHERE ID = ?",
                args:[id]
            })
            return {data_base:db}
        })
    }
    
    getTimeData(id){
        return this._dbQuery((db) => {
            var val
            var rs = db.query({
                sql:"SELECT STARTDATA,ENDDATA FROM CheckLog WHERE ID = ?",
                args:[id]
            }).result
            while (rs.next()){ val = rs.values }
            return {
                data_base : db,
                val       : val
            }
        }).val
    }
    
    setWorkTime(wt, id){
        this._dbQuery((db) => {
            db.update({
                sql:"UPDATE CheckLog SET WORKTIME = ? WHERE ID = ?",
                args:[wt, id]
            })
            return {data_base:db}
        })
    }

    getWorkTime(id){
        return this._dbQuery((db) => {
            var wt, st, et
            var rs = db.query({
                sql:"SELECT STARTTIME,ENDTIME,WORKTIME FROM CheckLog WHERE ID = ?",
                args:[id]
            }).result
            while(rs.next()) {
                wt = rs.values.WORKTIME
                st = rs.values.STARTTIME
                et = rs.values.ENDTIME
            }
            return {
                data_base: db,
                worktime : wt,
                starttime: st,
                endtime  : et
            }
        })
    }

    getTotalTime(val){
        return this._dbQuery((db) => {
            var total = 0
            var list = {}
            var dayCount = 0
            var rs = db.query({
              sql:"SELECT WORKTIME,DAY FROM CheckLog WHERE YEAR = ? AND MONTH = ?",
              args:[val.year, val.month]}).result
            while(rs.next()){
                list[rs.values.DAY] = rs.values.WORKTIME
                if (rs.values.WORKTIME){
                    dayCount++
                    total += rs.values.WORKTIME
                }
            }
            return {
                data_base:db,
                total:(total - dayCount * 8).toFixed(2),
                wtList:list,
                aveDay : (total / dayCount).toFixed(2),
                dayCount: dayCount
            }
        })
    }

    updateCheckTime(id, obj){
        var args = [obj.time, obj.timeInfo, id]
        this._dbQuery((db) => {
            if(!obj.type){
                db.update({
                    sql:"UPDATE CheckLog SET STARTTIME = ? , STARTDATA = ? WHERE ID = ?",
                    args:args
                })
            }else {
                db.update({
                    sql:"UPDATE CheckLog SET ENDTIME = ? , ENDDATA = ? WHERE ID = ?",
                    args:args
                })
            }
            return {
                data_base:db,
            }
        })
    }

    cacheInit(){
        var wtInfo ={
            worktime : 0,
            starttime: "",
            endtime  : "",
            total    : 0,
            wtList   : [],
            aveDay   : 0
        }
        if($cache.get("selectDay")){
            var sDay = $cache.get("selectDay")
            var id = sDay.date || sDay.year * 10000 + sDay.month * 100 + sDay.day * 1
            wtInfo = Object.assign(this.getWorkTime(id), this.getTotalTime(sDay))
        }
        $cache.set("wtInfo", wtInfo)
    }

    fackData(){
        this._dbQuery((db) => {
            var arr = [
                [20181103, 2018, 11, 3, "08:36", "18:12", 8.60, 18.20, 7.90],
                [20181106, 2018, 11, 6, "08:54", "18:18", 8.90, 18.20, 7.70]
            ]
            for (let idx in arr){
                var args = arr[idx]
                db.update({
                    sql:"INSERT INTO CheckLog values(?,?,?,?,?,?,?,?,?)",
                    args: args
                })
            }
            return {data_base: db}
        })
    }
}



module.exports = SQLHandler
