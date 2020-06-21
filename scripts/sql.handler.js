class SQLHandler {
    constructor(){
        this.createNewTable();
        this.cacheInit();
    }

    _dbQuery(callback){
        var dbObj = callback($sqlite.open("baseDB.db"))
        $sqlite.close(dbObj.data_base)
        dbObj.data_base = null;
        delete(dbObj['data_base'])
        if (dbObj) return dbObj
    }

    //增加表字段
    updateTableWithNewColum(){
        this._dbQuery(db => {
            db.update("ALTER TABLE CheckLog ADD COLUMN CHANGEPO INTEGER DEFAULT 0")
            return {data_base:db}
        })
    }

    //新建表
    createNewTable(){
        this._dbQuery(function(db){
            var rs = db.query('SELECT * FROM CheckLog')
            if (rs.error){
                db.update("CREATE TABLE CheckLog (ID INTEGER PRIMARY KEY, YEAR INTEGER, MONTH INTEGER, DAY INTEGER, STARTTIME TEXT, ENDTIME TEXT, STARTDATA REAL, ENDDATA REAL, WORKTIME REAL, TYPE INTEGER DEFAULT 0, CHANGEPO INTEGER DEFAULT 0)")
            }
            return {data_base:db}
        })
    }
    
    verifyData(id){
        if(!id) {
            return false;
        }
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
    
    queryWorkTime(id){
        return this._dbQuery(function(db){
            var hasData = false;
            var wt = 0;
            var type = 0;
            if(this.verifyData(id)){
                var rs = db.query({
                    sql:"SELECT WORKTIME,TYPE FROM CheckLog WHERE ID = ?",
                    args:[id]
                }).result
                while(rs.next()){
                    hasData = true;
                    wt = rs.values.WORKTIME;
                    type = rs.values.TYPE;
                }
            }
            return {
                data_base : db,
                hasData   : hasData,
                worktime  : wt,
                type      : type
            }
        }.bind(this))
    }

    queryPOType(id){
        return this._dbQuery(function(db){
            var poType = 0;
            if(this.verifyData(id)){
                var rs = db.query({
                    sql:"SELECT CHANGEPO FROM CheckLog WHERE ID = ?",
                    args:[id]
                }).result
                while(rs.next()){
                    poType = rs.values.CHANGEPO;
                }
            }
            return {
                data_base : db,
                poType    : poType
            }
        }.bind(this)).poType
    }
      
    
    createNewLine(dateObj){
        var args = [dateObj.date, dateObj.year, dateObj.month, dateObj.day, null, null, null, null, null, 0, 0]
        this._dbQuery((db) => {
            db.update({
                sql:"INSERT INTO CheckLog values (?,?,?,?,?,?,?,?,?,?,?)",
                args: args
            })
            return {data_base: db}
        })
    }
    
    updateData(checkType, timeObj, id){
        var args = [timeObj.time, (timeObj.timeData).toFixed(2), id]
        //checkType == true : 上班打卡; false : 下班打卡
        this._dbQuery(db => {
            if(checkType){
                db.update({
                    sql:"UPDATE CheckLog SET ENDTIME = ?, ENDDATA = ? WHERE ID = ?",
                    args: args
                })
            }else{
                db.update({
                    sql:"UPDATE CheckLog SET STARTTIME = ?, STARTDATA = ? WHERE ID = ?",
                    args: args
                })
            }
            $ui.toast("打卡成功")
            return {data_base: db}
        })
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
                sql:"SELECT STARTTIME,ENDTIME,WORKTIME,TYPE FROM CheckLog WHERE ID = ?",
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

    getTotalTime(val, type){
        return this._dbQuery((db) => {
            var total = 0
            var list = {}
            var dayCount = 0
            var continueAdd = true;
            var rs = db.query({
              sql:"SELECT WORKTIME,DAY,TYPE,CHANGEPO FROM CheckLog WHERE YEAR = ? AND MONTH = ?",
              args:[val.year, val.month]
            }).result
            while(rs.next()){
                list[rs.values.DAY] = rs.values.WORKTIME
                if(rs.values.TYPE === type){
                    if (rs.values.WORKTIME || rs.values.WORKTIME === 0){
                        if(rs.values.CHANGEPO){
                            if(rs.values.DAY <= val.day) {
                                dayCount = 0;
                                total = 0
                            } else {
                                continueAdd = false;
                            }
                        }
                        if(continueAdd){
                            dayCount++
                            total += rs.values.WORKTIME
                        }
                    }
                }
            }
            return {
                data_base:db,
                total:(total - dayCount * 8).toFixed(2),
                monthTotal:total.toFixed(2),
                wtList:list,
                aveDay : (total / dayCount).toFixed(2),
                dayCount: dayCount
            }
        })
    }

    getWeekTime(weekList) {
        return this._dbQuery((db) => {
            var total = 0
            var list = {}
            var dayCount = 0
            weekList.forEach(val => {
                var rs = db.query({
                  sql:"SELECT WORKTIME,DAY,TYPE FROM CheckLog WHERE YEAR = ? AND MONTH = ? AND DAY = ?",
                  args:[val.year, val.month, val.day]
                }).result
                while(rs.next()){
                    list[rs.values.DAY] = rs.values.WORKTIME
                    if(rs.values.TYPE === 0){
                        if (rs.values.WORKTIME || rs.values.WORKTIME === 0){
                            dayCount++
                            total += rs.values.WORKTIME
                        }
                    }
                }
            })
            return {
                data_base:db,
                total:total.toFixed(2),
                aveDay:(total - dayCount * 8).toFixed(2)
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
            wtInfo = Object.assign(this.getWorkTime(id), this.getTotalTime(sDay, 0))
        }
        $cache.set("wtInfo", wtInfo)
        var weekInfo = {
            total:0,
            aveDay:0
        }
        if($cache.get("weekList")){
            weekInfo = this.getWeekTime($cache.get("weekList"))
        }
        $cache.set("weekInfo",weekInfo)
    }

    updateWorkType(id, type){
        this._dbQuery(db => {
            db.update({
                sql:"UPDATE CheckLog SET TYPE = ? WHERE ID = ?",
                args:[type, id]
            })
            return {data_base:db}
        })
    }

    updatePOType(id, type){
        this._dbQuery(db => {
            db.update({
                sql:"UPDATE CheckLog SET CHANGEPO = ? WHERE ID = ?",
                args:[type, id]
            })
            return {data_base:db}
        })
    }

    fackData(){
        this._dbQuery((db) => {
            var arr = [
                [20181103, 2018, 11, 3, "08:36", "18:12", 8.60, 18.20, 7.90, 0],
                [20181106, 2018, 11, 6, "08:54", "18:18", 8.90, 18.20, 7.70, 0]
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
