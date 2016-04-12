
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.ui.contextMenu.group = function()
{
  bamboo.ui.contextMenu.base.call(this);

  this.init();
};

bamboo.extend(bamboo.ui.contextMenu.group, bamboo.ui.contextMenu.base);

bamboo.ui.contextMenu.group.prototype.init = function()
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

bamboo.ui.contextMenu.group.prototype.handlerNewGroup = function()
{
  bamboo.ui.newGroup(this.target.id);
};

bamboo.ui.contextMenu.group.prototype.handlerUpdateFavorites = function()
{
  this.target.getData().update(true);
};

bamboo.ui.contextMenu.group.prototype.handlerEdit = function()
{
  bamboo.ui.editGroup(this.target.getData());
};

bamboo.ui.contextMenu.group.prototype.handlerDelete = function()
{
  bamboo.ui.deleteGroup(this.target.getData());
};
