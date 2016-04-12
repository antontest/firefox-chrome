
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.ui.contextMenu.root = function()
{
  bamboo.ui.contextMenu.base.call(this);

  this.init();
};

bamboo.extend(bamboo.ui.contextMenu.root, bamboo.ui.contextMenu.base);

bamboo.ui.contextMenu.root.prototype.init = function()
{
  var menu = this;

  this.items.push({label: bamboo.utils.str('bamboo.button.newgroup'), handler: function()
  {
    menu.run('handlerNewGroup');
  }});

  this.items.push({label: bamboo.utils.str('bamboo.button.updatefavorites'), handler: function()
  {
    menu.run('handlerUpdateFavorites');
  }});

  this.items.push({label: bamboo.utils.str('bamboo.button.edit'), handler: function()
  {
    menu.run('handlerEdit');
  }});

  this.items.push({label: bamboo.utils.str('bamboo.button.delete'), handler: function()
  {
    menu.run('handlerDelete');
  }});
};

bamboo.ui.contextMenu.root.prototype.handlerNewGroup = function()
{
  bamboo.ui.newGroup(bamboo.data.all.id);
};

bamboo.ui.contextMenu.root.prototype.handlerUpdateFavorites = function()
{
  this.target.getData().update(true);
};

bamboo.ui.contextMenu.root.prototype.handlerUpdateFavorites = function()
{
  this.target.getData().update(true);
};

bamboo.ui.contextMenu.root.prototype.handlerEdit = function()
{
  bamboo.ui.editRoot();
};

bamboo.ui.contextMenu.root.prototype.handlerDelete = function()
{
  bamboo.ui.deleteRoot();
};
