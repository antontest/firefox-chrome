
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.ui.contextMenu.library = function()
{
  bamboo.ui.contextMenu.base.call(this);

  this.init();
};

bamboo.extend(bamboo.ui.contextMenu.library, bamboo.ui.contextMenu.base);

bamboo.ui.contextMenu.library.prototype.init = function()
{
  var menu = this;

  this.items.push({label: bamboo.utils.str('bamboo.button.delete'), handler: function()
  {
    menu.run('handlerDelete');
  }});
};

bamboo.ui.contextMenu.library.prototype.handlerDelete = function()
{
  bamboo.ui.deleteLibrary();
};
