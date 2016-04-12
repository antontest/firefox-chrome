
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.utils.browser =
{
  run : bamboo.getRun(),
  tab : null,
  tabPath : 'chrome://bamboo/content/page.xul',
  tabName : 'about:bamboo',

  openLink : function(url, middleClick)
  {
    if(bamboo.isFirefox)
    {
      var newTab = middleClick == true || bamboo.option.get('force-new-tab') == 'true';
      bamboo.funcOpenLink(url, newTab ? 'tab' : 'current' );
    }
    else
    {
      if(bamboo.option.get('thunderbird-link-in-tab') == 'true')
      {
        this.openTab(url);
      }
      else
      {
        try
        {
          var messenger = Components.classes["@mozilla.org/messenger;1"].createInstance();
          messenger = messenger.QueryInterface(Components.interfaces.nsIMessenger);
          messenger.launchExternalURL(url);
        }
        catch(ex)
        {
        /*
          var msg = bamboo.utils.str('bamboo.message.error.url');

          if( ex.message != null )
          {
            msg += '\n(' + ex.message + ')';
          }

          bamboo.utils.error.log(msg + '\n\n' + url);
          */
        }
      }
    }
  },
  
  openTab : function(url)
  {
    var path = url ? url : this.tabName;
    var tab = url ? null : this.getTab();

    if(tab)
    {
      if(bamboo.isFirefox)
      {
        bamboo.browser.selectedTab = tab;
      }
      else
      {
        var index = this.getTabIndex(tab);
        if(index >= 0)
        {
          var tabmail = bamboo.doc.getElementById("tabmail");
          tabmail.selectTabByIndex(null, index);
        }
      }
    }
    else
    {
      if(bamboo.isFirefox)
      {
        this.openLink(this.tabName, true);
      }
      else
      {
        var tabmail = bamboo.doc.getElementById("tabmail");
        tabmail.openTab("contentTab", {contentPage: path});
      }
    }
  },
  
  closeTab : function()
  {
    if(bamboo.isFirefox)
    {
      var tab = this.getTab();
      while(tab)
      {
        if(bamboo.browser.tabContainer.childNodes.length == 1)
        {
          bamboo.browser.selectedTab = bamboo.browser.addTab('about:blank');
        }
        bamboo.browser.removeTab(tab);
        tab = this.getTab();
      }
    }
    else
    {
      var tabmail = bamboo.doc.getElementById("tabmail");
      var tab = this.getTab();

      tabmail.closeTab(tab, true);
    }
  },
  
  getTab : function()
  {
    var tabBrowser = bamboo.isFirefox ? bamboo.browser : bamboo.doc.getElementById("tabmail");

    if(tabBrowser && tabBrowser.tabContainer)
    {
      for(var i=0; i<tabBrowser.tabContainer.childNodes.length; i++)
      {
        var tab = tabBrowser.tabContainer.childNodes.item(i);

        var browser = this.getBrowserForTab(tabBrowser, tab, i);

        if(browser && browser.currentURI && (browser.currentURI.spec == this.tabPath || browser.currentURI.spec == this.tabName))
        {
          return tab;
        }
      }
    }

    return null;
  },
  
  openTabIfLast : function()
  {
    if(bamboo.isFirefox && bamboo.browser.tabContainer.childNodes.length == 1)
    {
      bamboo.browser.selectedTab = bamboo.browser.addTab('about:blank');
    }
  },
  
  getBrowserForTab : function(tabBrowser, tab, index)
  {
    if(bamboo.isFirefox)
    {
      return tabBrowser.getBrowserForTab(tab);
    }
    else
    {
      var tabInfo = tabBrowser.tabInfo[index];
      if(!tabInfo)
      {
        return null;
      }
      var browserFunc = tabInfo.mode.getBrowser || tabInfo.mode.tabType.getBrowser;
      if(!browserFunc)
      {
        return null;
      }
      return browserFunc.call(tabInfo.mode.tabType, tabInfo);
    }
  },
  
  getTabIndex : function(targetTab)
  {
    var tabBrowser = bamboo.isFirefox ? bamboo.browser : bamboo.doc.getElementById("tabmail");

    for(var i=0; i<tabBrowser.tabContainer.childNodes.length; i++)
    {
      var tab = tabBrowser.tabContainer.childNodes.item(i);
      if(tab == targetTab)
      {
        return i;
      }
    }
    return -1;
  },
  
  getPages : function()
  {
    var pages = [];
    var tabBrowser = bamboo.isFirefox ? bamboo.browser : bamboo.doc.getElementById("tabmail");

    for(var i=0; i<tabBrowser.tabContainer.childNodes.length; i++)
    {
      var tab = tabBrowser.tabContainer.childNodes.item(i);

      var browser = this.getBrowserForTab(tabBrowser, tab, i);
      if(browser)
      {
        var tabURL = browser.contentWindow.location.toString();
        
        if(tabURL.indexOf('http') == 0)
        {
          pages.push({ doc: browser.contentWindow.document, browser: browser,
                       url: tabURL, title: tab.getAttribute('label')});
        }
      }
    }

    return pages;
  },
  
  setAllTabTitle : function(title, news)
  {
    var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
    var browsers = wm.getEnumerator(bamboo.isFirefox ? "navigator:browser" : "mail:3pane");
    var target = browsers.getNext();
    while(target)
    {
      var tabBrowser = bamboo.isFirefox ? target.gBrowser : target.window.document.getElementById("tabmail");

      if(tabBrowser)
      {
        try
        {
          for(var i=0; i<tabBrowser.tabContainer.childNodes.length; i++)
          {
            var tab = tabBrowser.tabContainer.childNodes.item(i);

            var browser = this.getBrowserForTab(tabBrowser, tab, i);

            if(browser && browser.currentURI && (browser.currentURI.spec == this.tabPath || browser.currentURI.spec == this.tabName))
            {
              tab.setAttribute('label', title);
              tab.setAttribute('visibleLabel', title);
              tab.setAttribute('image', news ? 'chrome://bamboo/skin/img/feed-new.png' : 'chrome://bamboo/skin/img/feed.png');

              if(browser.contentDocument)
              {
                browser.contentDocument.title = title;
              }
            }
          }
        }
        catch(ex) { }
      }

      target = browsers.getNext();
    }
  }
};
