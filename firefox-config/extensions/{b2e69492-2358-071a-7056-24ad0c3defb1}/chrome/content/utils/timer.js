
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.utils.timer =
{
  run: bamboo.getRun(),
  timer : null,
  
  getTimer : function()
  {
    if(this.timer == null)
    {
      this.timer = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);
    }
    return this.timer;
  },
  
  init : function(firstRun)
  {
    var timer = this.getTimer();
    timer.cancel();

    var enabled = bamboo.option.get('auto-update') == 'true';
    if(enabled)
    {
      var delay = Number(bamboo.option.get('auto-update-delay'));
      if(delay < 1)
      {
        delay = 20;
      }

      timer.initWithCallback(this, delay*60000, Components.interfaces.nsITimer.TYPE_REPEATING_SLACK);
    
      if(firstRun && bamboo.option.get('init-update') == 'true')
      {
        var timer = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);
        timer.initWithCallback({notify: function()
        {
          bamboo.utils.timer.run('notify');
        }
        }, 5000, Components.interfaces.nsITimer.TYPE_ONE_SHOT);
      }
    }
  },
  
  notify : function()
  {
    bamboo.ui.notification.isAutoUpdate = true;

    var updateAll = bamboo.option.get('update-only-favorite') == 'false';
    bamboo.data.all.update(!updateAll);
  }
};
