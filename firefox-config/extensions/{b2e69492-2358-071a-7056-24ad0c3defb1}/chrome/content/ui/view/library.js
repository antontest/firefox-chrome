
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.ui.view.library = function(id)
{
  bamboo.ui.view.base.call(this, id, null);

  this.box = null;
  this.label = null;
  this.labelCount = null;
};

bamboo.extend(bamboo.ui.view.library, bamboo.ui.view.base);

bamboo.ui.view.library.prototype.build = function()
{
  var view = this;

  var handlerSelect = function(event, fromKey)
  {
    if(event.button == 2)
    {
      event.stopPropagation();
      event.preventDefault();

      bamboo.ui.contextMenu.run('showLibraryContextMenu', [view, event.clientX, event.clientY]);
      return;
    }

    bamboo.run('selectItem', [bamboo.data.lib]);

    if(fromKey)
    {
      view.box.focus();
    }
    else
    {
      bamboo.ui.rootNode.focus();
    }
  };

  this.box = bamboo.doc.createElement('hbox');
  this.box.setAttribute('class', 'bamboo-focusable bamboo-view-group bamboo-view-group-category');
  this.box.addEventListener("click", handlerSelect, false);
  this.box.addEventListener("keypress", function(event)
  {
    if(event.charCode == 32)
    {
      handlerSelect(event, true);
    }
  }, false);
  bamboo.ui.panel.get('reader').zoneTree.header.appendChild(this.box);

  var imgBox = bamboo.doc.createElement('vbox');
  this.box.appendChild(imgBox);

  var icon = bamboo.doc.createElement('image');
  icon.setAttribute('class', 'bamboo-icon-lib');
  imgBox.appendChild(icon);

  this.label = bamboo.doc.createElement('html:div');
  this.label.setAttribute('class', 'bamboo-view-group-label');
  this.label.setAttribute('type', 'content');
  this.label.setAttribute('flex', '1');
  this.label.textContent = bamboo.utils.str('bamboo.library');
  this.box.appendChild(this.label);

  var handlerMarkAsRead = function(event)
  {
    event.stopPropagation();

    view.run('confirmMarkAsRead');
  };

  this.labelCount = bamboo.doc.createElement('label');
  this.labelCount.setAttribute('class', 'bamboo-view-group-label bamboo-view-group-label-count bamboo-font-light');
  this.labelCount.setAttribute('tooltiptext', bamboo.utils.str('bamboo.button.mark'));
  this.labelCount.addEventListener("click", handlerMarkAsRead, false);
  this.box.appendChild(this.labelCount);

  this.update();

  return this.container;
};

bamboo.ui.view.library.prototype.update = function()
{
  var data = this.getData();

  var news = data.unreadItemCount > 0;
  var count = data.items.length > 0 ? data.unreadItemCount + ' / ' + data.items.length : '';
  this.labelCount.setAttribute('value', count);
  this.box.setAttribute('selected', data.selected);
  this.box.setAttribute('news', news);
};

bamboo.ui.view.library.prototype.remove = function()
{
  if(this.built)
  {
    bamboo.ui.panel.get('reader').zoneTree.header.removeChild(this.box);

    this.built = false;
  }
};

bamboo.ui.view.library.prototype.confirmMarkAsRead = function()
{
  if(bamboo.option.get('confirm-mark-as-read-from-tree') == 'true')
  {
    var view = this;
    var message = bamboo.utils.str('bamboo.message.confirmmarkasread');
    var action = bamboo.utils.str('bamboo.button.mark');
    var choices = { ask: { type: 'check', checked: false, value: bamboo.utils.str('bamboo.message.donotaskagain')}};

    bamboo.ui.showConfirmDialog(message, action, choices,
    { onValidation: function(result)
    {
      if(result['ask'])
      {
        bamboo.option.set('confirm-mark-as-read-from-tree', 'false');
      }
      view.run('markAsRead');
    }});
  }
  else
  {
    this.markAsRead();
  }
};

bamboo.ui.view.library.prototype.markAsRead = function()
{
  var lib = this.getData();

  lib.run('markAsReaded');
  bamboo.ui.panel.get('reader').zoneViewMenu.update();

  if(bamboo.isItemSelected(lib) && bamboo.data.page.getFilterByName('new').active)
  {
    bamboo.selectItem(bamboo.selection);
  }
};
