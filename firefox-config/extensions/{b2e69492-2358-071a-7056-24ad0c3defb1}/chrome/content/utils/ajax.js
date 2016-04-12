
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.utils.ajax =
{
  run : bamboo.getRun(),

  load : function(url, resultHandler)
  {
    var req = new bamboo.xhr();
    req.open('GET', url, true);
    req.channel.loadFlags |= Components.interfaces.nsIRequest.LOAD_BYPASS_CACHE;

    var timeout = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);

    req.onreadystatechange = function(event)
    {
      bamboo.utils.ajax.run('loadStateChange', [req, event, resultHandler, timeout]);
    };
    req.send(null);

    var time = Number(bamboo.option.get('loading-timeout'));

    timeout.initWithCallback({notify: function()
    {
      req.abort();
    }
    }, time*1000, Components.interfaces.nsITimer.TYPE_ONE_SHOT);
  },
  
  loadStateChange : function(req, event, resultHandler, timeout)
  {
    if (req.readyState == 4)
    {
      if(req.status == 200)
      {
        timeout.cancel();

        if(req.responseXML)
        {
          resultHandler.onSuccess(req.responseXML, req.responseText);
        }else{
          if(req.responseText)
          {
            var targetXML = null;
            try
            {
              targetXML = bamboo.utils.parser.parseXMLString(req.responseText);
            }
            catch(ex) {}

            resultHandler.onSuccess(targetXML, req.responseText);
          }else{
            resultHandler.onError();
          }
        }
      }else{
        resultHandler.onError();
      }
    }
  }
};
