
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.ui.contextMenu.base = function()
{
  bamboo.runnable.call(this);

  this.items = [];
  this.target = null;

  this.container = null;
  this.built = false;
};

bamboo.extend(bamboo.ui.contextMenu.base, bamboo.runnable);

bamboo.ui.contextMenu.base.prototype.build = function()
{
  if(!this.built)
  {
    this.built = true;

    this.container = bamboo.doc.createElement('vbox');
    this.container.setAttribute('class', 'bamboo-context-menu');

    var itemCount = this.items.length;
    for(var i=0; i<itemCount; i++)
    {
      this.buildItem(this.items[i]);
    }
  }
};

bamboo.ui.contextMenu.base.prototype.buildItem = function(item)
{
  var contextMenu = this;

  var itemNode = bamboo.doc.createElement('hbox');
  itemNode.setAttribute('class', 'bamboo-context-menu-item');
  itemNode.addEventListener("click", function()
  {
    contextMenu.run('hide');
    item.handler();
  }, false);
  this.container.appendChild(itemNode);

  var label = bamboo.doc.createElement('label');
  label.setAttribute('class', 'bamboo-context-menu-label');
  label.setAttribute('value', item.label);
  itemNode.appendChild(label);
};

bamboo.ui.contextMenu.base.prototype.show = function(target, posX, posY)
{
  this.target = target;

  this.build();

  bamboo.ui.panel.selection.zoneMenuPopup.popup(posX, posY, this.container);
  bamboo.ui.panel.selection.zoneMenuPopup.move(posX, posY);
};

bamboo.ui.contextMenu.base.prototype.hide = function()
{
  bamboo.ui.panel.selection.zoneMenuPopup.hide();
};
