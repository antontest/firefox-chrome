
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.ui.contextMenu =
{
  run: bamboo.getRun(),

  feedMenu : null,
  groupMenu : null,
  rootMenu : null,
  libMenu : null,

  showFeedContextMenu : function(view, posX, posY)
  {
    if(!this.feedMenu)
    {
      this.feedMenu = new this.feed();
    }

    this.feedMenu.show(view, posX, posY);
  },

  showGroupContextMenu : function(view, posX, posY)
  {
    if(!this.groupMenu)
    {
      this.groupMenu = new this.group();
    }

    this.groupMenu.show(view, posX, posY);
  },

  showRootContextMenu : function(view, posX, posY)
  {
    if(!this.rootMenu)
    {
      this.rootMenu = new this.root();
    }

    this.rootMenu.show(view, posX, posY);
  },

  showLibraryContextMenu : function(view, posX, posY)
  {
    if(!this.libMenu)
    {
      this.libMenu = new this.library();
    }

    this.libMenu.show(view, posX, posY);
  }
};
