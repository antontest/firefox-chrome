
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.ui.panel.reader = function()
{
  bamboo.ui.panel.base.call(this, 'reader', bamboo.utils.str('bamboo.menu.reader.label'), false);

  this.zoneMenuPopup = null;
  this.zoneTree = null;
  this.zoneView = null;
  this.zoneViewPlayer = null;
  this.zoneViewMenu = null;
  this.zoneViewData = null;
};

bamboo.extend(bamboo.ui.panel.reader, bamboo.ui.panel.base);

bamboo.ui.panel.reader.prototype.build = function()
{
  this.zoneTree = new bamboo.ui.zone.tree(this.container, false);
  this.zoneView = new bamboo.ui.zone.view(this.container);
  this.zoneTree.show();
  var childContainer = this.zoneView.show();

  this.zoneViewPlayer = new bamboo.ui.zone.menu.player(childContainer);
  this.zoneViewMenu = new bamboo.ui.zone.menu.reader(childContainer);
  this.zoneViewData = new bamboo.ui.zone.view.data(childContainer);
  this.zoneViewPlayer.show();
  this.zoneViewMenu.show();
  this.zoneViewData.show();

  this.zoneMenuPopup = new bamboo.ui.zone.menu.popup(this.container);
  this.zoneMenuPopup.show();
};
