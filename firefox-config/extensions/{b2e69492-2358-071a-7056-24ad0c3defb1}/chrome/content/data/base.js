
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.data.base = function(parent)
{
  bamboo.runnable.call(this);

  this.id = bamboo.factory.create(this, parent);
  this.selected = false;
};

bamboo.extend(bamboo.data.base, bamboo.runnable);

bamboo.data.base.prototype.getParent = function()
{
  return bamboo.factory.getParent(this.id);
};

bamboo.data.base.prototype.setParent = function(data)
{
  bamboo.factory.setParent(this.id, data);
};

bamboo.data.base.prototype.getView = function()
{
  return bamboo.factory.getView(this.id);
};

bamboo.data.base.prototype.showView = function(index)
{
  if(!bamboo.factory.hasView(this.id))
  {
    bamboo.factory.createView(this.id);
  }
  var view = this.getView();
  if(view)
  {
    view.show(index);
    this.showChildrenViews();
  }
};

bamboo.data.base.prototype.hideView = function()
{
  if(bamboo.factory.hasView(this.id))
  {
    this.getView().hide();
  }
};

bamboo.data.base.prototype.updateView = function()
{
  var view = this.getView();
  if(view)
  {
    view.update();
  }
};

bamboo.data.base.prototype.removeView = function()
{
  var view = this.getView();
  if(view)
  {
    view.remove();
    bamboo.factory.delView(this.id);
  }
  this.removeChildrenViews();
};

bamboo.data.base.prototype.deleteData = function()
{
  bamboo.factory.delItem(this.id);
};

bamboo.data.base.prototype.removeChild = function()
{
  throw {'message': 'removeChild: not implemented function'};
};

bamboo.data.base.prototype.showItemsViews = function()
{
  throw {'message': 'showItemsViews: not implemented function'};
};
bamboo.data.base.prototype.hideItemsViews = function()
{
  throw {'message': 'hideItemsViews: not implemented function'};
};

bamboo.data.base.prototype.showChildrenViews = function() {};
bamboo.data.base.prototype.removeChildrenViews = function() {};

