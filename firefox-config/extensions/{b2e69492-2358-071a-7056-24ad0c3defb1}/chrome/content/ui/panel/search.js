
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.ui.panel.search = function()
{
  bamboo.ui.panel.base.call(this, 'search', bamboo.utils.str('bamboo.menu.search.label'), false);

  this.zoneMenuPopup = null;
  this.zoneTree = null;
  this.zoneView = null;
  this.zoneViewMenu = null;
  this.zoneViewData = null;
};

bamboo.extend(bamboo.ui.panel.search, bamboo.ui.panel.base);

bamboo.ui.panel.search.prototype.build = function()
{
  this.zoneTree = new bamboo.ui.zone.tree(this.container, true);
  this.zoneView = new bamboo.ui.zone.view(this.container);
  this.zoneTree.show();
  var childContainer = this.zoneView.show();

  this.zoneViewMenu = new bamboo.ui.zone.menu.search(childContainer);
  this.zoneViewData = new bamboo.ui.zone.view.data(childContainer);
  this.zoneViewMenu.show();
  this.zoneViewData.show();

  this.zoneMenuPopup = new bamboo.ui.zone.menu.popup(this.container);
  this.zoneMenuPopup.show();

  bamboo.data.found.run('showView');
  bamboo.selectSearchItem(bamboo.data.found);
};
