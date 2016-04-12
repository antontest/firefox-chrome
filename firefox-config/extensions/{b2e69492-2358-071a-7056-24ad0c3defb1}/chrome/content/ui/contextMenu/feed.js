
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.ui.contextMenu.feed = function()
{
  bamboo.ui.contextMenu.base.call(this);

  this.init();
};

bamboo.extend(bamboo.ui.contextMenu.feed, bamboo.ui.contextMenu.base);

bamboo.ui.contextMenu.feed.prototype.init = function()
{
  var menu = this;

  this.items.push({label: bamboo.utils.str('bamboo.button.edit'), handler: function()
  {
    menu.run('handlerEdit');
  }});

  this.items.push({label: bamboo.utils.str('bamboo.button.delete'), handler: function()
  {
    menu.run('handlerDelete');
  }});
};

bamboo.ui.contextMenu.feed.prototype.handlerEdit = function()
{
  bamboo.ui.editFeed(this.target.getData());
};

bamboo.ui.contextMenu.feed.prototype.handlerDelete = function()
{
  bamboo.ui.deleteFeed(this.target.getData());
};
