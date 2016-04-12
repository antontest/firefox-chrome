
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.ui.toolbar =
{
  run: bamboo.getRun(),

  buttonID : 'bamboo-toolbar-button-feed',
  menuID : 'bamboo-toolbar',
  
  getButton : function(targetWindow)
  {
    var target = targetWindow ? targetWindow.document : bamboo.doc;
    var button = target.getElementById(this.buttonID);
    if(!button)
    {
      button = this.run('getPaletteButton');
    }
    return button;
  },

  isButtonAdded : function()
  {
    return bamboo.doc.getElementById(this.buttonID) != null;
  },

  isButtonInPopup : function()
  {
    var btn = this.getButton();

    return btn && btn.parentNode && btn.parentNode.parentNode.getAttribute('id') == 'PanelUI-contents';
  },

  getPaletteButton : function()
  {
    if(bamboo.toolbox && bamboo.toolbox.palette)
    {
      var palette = bamboo.toolbox.palette;
      var paletteItem;

      for(var i=0; i<palette.childNodes.length; ++i)
      {
        if( palette.childNodes[i].id == this.menuID)
        {
          paletteItem = palette.childNodes[i];

          for(var n=0; n<paletteItem.childNodes.length; n++)
          {
            if( paletteItem.childNodes[n].id == this.buttonID)
            {
              return paletteItem.childNodes[n];
            }
          }
        }
      }
    }
    return null;
  },

  setAllButtonText : function(text)
  {
    var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
    var browsers = wm.getEnumerator(bamboo.isFirefox ? "navigator:browser" : "mail:3pane");
    var target = browsers.getNext();
    while(target)
    {
      if(target.bamboo)
      {
        target.bamboo.ui.toolbar.run('setButtonText', [text, target.window]);
      }
      target = browsers.getNext();
    }
  },

  setAllButtonState : function(state)
  {
    var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
    var browsers = wm.getEnumerator(bamboo.isFirefox ? "navigator:browser" : "mail:3pane");
    var target = browsers.getNext();
    while(target)
    {
      if(target.bamboo)
      {
        target.bamboo.ui.toolbar.run('setButtonState', [state, target.window]);
      }
      target = browsers.getNext();
    }
  },

  setButtonText : function(text, win)
  {
    var btn = this.getButton(win);
    if(btn)
    {
      btn.setAttribute('label', text);
    }
  },

  setButtonState : function(state, win)
  {
    var btn = this.getButton(win);
    if(btn)
    {
      btn.setAttribute('state', state);
    }
  },

  addButton : function()
  {
    if (!bamboo.doc.getElementById(this.menuID))
    {
      var refId = "urlbar-container";
      var navBar  = bamboo.doc.getElementById("nav-bar");
      if(!navBar)
      {
        navBar  = bamboo.doc.getElementById("mail-bar3");
      }
      
	  /*
      var curSet  = navBar.currentSet.split(",");

      var index = curSet.indexOf(refId);
      var pos = index < 0 ? 0 : index;
      var newSet = curSet.slice(0, pos).concat(this.menuID).concat(curSet.slice(pos));
      newSet = newSet.join(",");
	  */

	  var newSet  = this.menuID + ',' + navBar.currentSet;
	  
      navBar.setAttribute("currentset", newSet);
      navBar.currentSet = newSet;
      bamboo.doc.persist(navBar.id, "currentset");
      try
      {
        BrowserToolboxCustomizeDone(true);
      }
      catch (e) {}
    }
    
    if(this.isButtonAdded())
    {
      bamboo.option.set('toolbar-button-added', 'true');
    }
  }
};

