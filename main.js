$cache.clear()
if ($app.env == $env.today) require('scripts/widget.view')
else if ($app.env == $env.app) require('scripts/app.view')