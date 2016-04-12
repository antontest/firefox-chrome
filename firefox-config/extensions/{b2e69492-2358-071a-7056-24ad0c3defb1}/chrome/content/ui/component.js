
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.ui.component = function(target)
{
  bamboo.runnable.call(this);

  this.container = target;
  this.childContainer = null;
  this.built = false;
};

bamboo.extend(bamboo.ui.component, bamboo.runnable);

bamboo.ui.component.prototype.show = function(index)
{
  if(!this.built)
  {
    this.childContainer = this.build(index);
    this.built = true;
  }

  return this.childContainer;
};

bamboo.ui.component.prototype.build = function() {};

bamboo.ui.component.prototype.addChild = function(childNode)
{
  this.childContainer.appendChild(childNode);
};
