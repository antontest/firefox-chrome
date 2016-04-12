
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.ui.view.base = function(id, target)
{
  bamboo.ui.component.call(this, target);

  this.id = id;
};

bamboo.extend(bamboo.ui.view.base, bamboo.ui.component);

bamboo.ui.view.base.prototype.getData = function()
{
  return bamboo.factory.getData(this.id);
};

bamboo.ui.view.base.prototype.getParentData = function()
{
  return bamboo.factory.getParent(this.id);
};
