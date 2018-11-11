var SQLHandler = require('scripts/sql-handler')
var sqlH = new SQLHandler
sqlH.createNewTable()
if ($app.env == $env.today) require('scripts/widget')
else if ($app.env == $env.app) require('scripts/app')