#first, checks if it isn't implemented yet
if !String.prototype.format
  String.prototype.format = () ->
    args = arguments
    replace = (match, number)-> 
      if typeof args[number] != 'undefined'
        args[number]
      else
        match
    this.replace /{(\d+)}/g, replace

App = {}
requirejs.config
  baseUrl: "/js"
  paths:
    "jquery": "libs/jquery-1.9.1.min"
    "jquery-ui": "libs/jquery-ui-1.10.0.custom.min"
    "bootstrap": "libs/bootstrap.min"
    "msg-growl": "plugins/msgGrowl/js/msgGrowl"
    "app-global": "app/app-global"
    "app-signin": "app/app-signin"
    "app-feed": "app/app-feed"
    "app-setting": "app/app-setting"
    "app-admin": "app/app-admin"
  shim:
    "jquery-ui": ["jquery"]
    "msg-growl": ["jquery","jquery-ui"]
    "bootstrap": ["jquery","jquery-ui"]
    "app-global": ["msg-growl","app-signin","app-feed","app-setting","app-admin","bootstrap"]
    "app-signin": ["jquery"]
    "app-feed": ["jquery"]
    "app-setting": ["jquery"]
    "app-admin": ["jquery"]
    
# Load the main app module to start the app
requirejs ["app-global"]