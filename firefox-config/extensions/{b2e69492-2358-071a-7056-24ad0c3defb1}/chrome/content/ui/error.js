
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.ui.error =
{
  run: bamboo.getRun(),

  button : null,
  
  getButton : function()
  {
    if(this.button == null)
    {
      this.button = bamboo.doc.getElementById('bamboo-toolbar-button-error');

      if(this.button != null)
      {
        this.button.addEventListener("click", function ()
        {
          bamboo.ui.error.showDialog();
        }, false);
      }
    }
    return this.button;
  },

  showButton : function(hide)
  {
    var btn = this.getButton();
    if(btn)
    {
      btn.setAttribute('hidden', hide ? 'true' : 'false');
    }
  },

  showDialog : function()
  {
    var error = bamboo.utils.error.getFullText();
    var params = {'error': error, 'caller': bamboo.utils.error};
    var features = "chrome,titlebar,centerscreen,modal,resizable,width=700,height=400";
    bamboo.win.openDialog('chrome://bamboo/content/windowError.xul', "", features, params);
  },

  showPanel : function()
  {
    var panel = bamboo.ui.panel.get('error');
    if(panel)
    {
      panel.setVisible(true);
      panel.show();
      panel.updateErrorMessage();
    }
    else
    {
      this.showButton(false);
    }
  }
};

