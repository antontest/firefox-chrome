
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.ui.panel =
{
  run: bamboo.getRun(),

  panels : [],
  history : ['reader', 'add', 'import', 'search', 'option', 'help'],
  selection : null,
  
  init : function()
  {
    this.panels.push(new bamboo.ui.panel.reader());
    this.panels.push(new bamboo.ui.panel.add());
    this.panels.push(new bamboo.ui.panel.import());
    this.panels.push(new bamboo.ui.panel.search());
    this.panels.push(new bamboo.ui.panel.option());
    this.panels.push(new bamboo.ui.panel.help());
    this.panels.push(new bamboo.ui.panel.error());

    for(var i=0; i<this.panels.length; i++)
    {
      this.panels[i].updateTab(this.panels[i].tab);
    }

    this.select('reader');
  },
  
  get : function(panelName)
  {
    for(var i=0; i<this.panels.length; i++)
    {
      if(this.panels[i].name == panelName)
      {
        return this.panels[i];
      }
    }
    return null;
  },
  
  select : function(panelName, doNotUpdateHistory)
  {
    if(this.selection != null && this.selection.name == panelName)
    {
      return;
    }

    for(var i=0; i<this.panels.length; i++)
    {
      if(this.panels[i].name == panelName)
      {
        if(this.selection != null)
        {
          this.selection.setSelected(false);
        }
        this.panels[i].setSelected(true);
        this.selection = this.panels[i];
        break;
      }
    }

    if(!doNotUpdateHistory)
    {
      this.updateHistory();
    }
  },

  updateHistory : function()
  {
    if(this.selection)
    {
      var index = this.history.indexOf(this.selection.name);
      if(index > 0)
      {
        this.history.splice(index, 1);
        this.history.splice(0, 0, this.selection.name);
      }
    }
  }
};
