
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.utils.error =
{  
  run: bamboo.getRun(),

  errorList : [],
  
  log : function(message, hide)
  {
    this.errorList.push(message);

    this.run('logInConsole', [message]);

    if(!hide)
    {
      try
      {
        bamboo.ui.error.showPanel();
      }
      catch (e)
      {
        this.errorList.push('Exception: ' + this.exToStr(e));

        bamboo.ui.error.showButton(false);
      }
    }
  },

  logInConsole : function(msg)
  {
    var aConsoleService = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
    aConsoleService.logStringMessage(msg);
  },

  clear : function()
  {
    this.errorList = [];
    bamboo.ui.error.showButton(true);
  },
  
  report : function()
  {
    var url = 'mailto:bamboo.feedreader@gmail.com?subject=';
    url += encodeURIComponent('[Error report]');
    url += '&body=' + encodeURIComponent(this.getFullText());
    bamboo.utils.browser.openLink(url, true);
  },
  
  getFullText : function()
  {
    var info = 'Configuration: Bamboo V2.2.8 ';
    try
    {
      var appInfo = Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULAppInfo);

      info += '- ' + appInfo.name + ' V' + appInfo.version + ' ';
    }
    catch(ex) { }
    try
    {
      var xulRuntime = Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULRuntime);

      info += '- OS ' + xulRuntime.OS + ' ';
    }
    catch(ex) { }

    return info + '\n\n' + this.errorList.join('\n');
  },
  
  logEx : function(ex, functionName)
  {
    var error = '\nException:\n';
    if(functionName)
    {
      error = '\nException in "' + functionName + '":\n';
    }
    error += this.exToStr(ex);
    this.log( error );
 },

  exToStr : function(ex)
  {
    var error = '';

    if( ex.message != null )
    {
      error += ex.message + '\n';
    }

    if( ex.fileName != null )
    {
      error += 'File: "' + ex.fileName + '" Line: ' + ex.lineNumber + '\n';
    }

    if(ex.stack)
    {
      error += 'Trace:\n' + ex.stack;
    }

    return error;
  }
};
