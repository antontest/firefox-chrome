
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.ui.notification =
{
  run: bamboo.getRun(),

  isAutoUpdate : false,

  show : function()
  {
    var showNotifications = bamboo.option.get('show-notifications-') == 'true';

    showNotifications = showNotifications && (this.isAutoUpdate || bamboo.option.get('show-notifications-only-auto') == 'false');

    if(showNotifications)
    {
      var message = bamboo.option.get('notifications-text');
      if(message == '')
      {
        message = bamboo.utils.str('bamboo.option.label.notificationdefaulttext');
      }

      message = bamboo.utils.replaceItems(message, [{target: '%U', content: bamboo.data.all.unreadItemCount},
                                                    {target: '%F', content: bamboo.data.all.favoriteUnreadItemCount}]);

      try
      {
        var alertsService = Components.classes['@mozilla.org/alerts-service;1'].getService(Components.interfaces.nsIAlertsService);
        alertsService.showAlertNotification('chrome://bamboo/skin/img/feed-32.png', 'Bamboo', message, true, null, this.onNotificationClick);
      }
      catch(e)
      {
        try
        {
          var n = new b.notification('Bamboo', {icon: 'chrome://bamboo/skin/img/feed-32.png', body: message});
        }
        catch(e) {}
      }
    }

    this.isAutoUpdate = false;
  },

  onNotificationClick : function(subject, topic, data)
  {
    if(topic == 'alertclickcallback')
    {
      var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
      var browsers = wm.getEnumerator(bamboo.isFirefox ? "navigator:browser" : "mail:3pane");
      var target = browsers.getNext();
      if(target)
      {
        target.focus();
      }

      bamboo.ui.run('show');
    }
  }
};

