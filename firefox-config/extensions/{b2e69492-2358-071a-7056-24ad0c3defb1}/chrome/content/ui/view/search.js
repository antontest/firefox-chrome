
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.ui.view.search = function(id)
{
  bamboo.ui.view.base.call(this, id, bamboo.ui.panel.get('search').zoneTree.childContainer);

  this.box = null;
  this.label = null;
};

bamboo.extend(bamboo.ui.view.search, bamboo.ui.view.base);

bamboo.ui.view.search.prototype.build = function()
{
  var view = this;

  var handlerSelect = function(event, fromKey)
  {
    bamboo.run('selectSearchItem', [bamboo.data.found]);

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
      handlerSelect(null, true);
    }
  }, false);
  bamboo.ui.panel.get('search').zoneTree.header.appendChild(this.box);

  this.label = bamboo.doc.createElement('html:div');
  this.label.setAttribute('class', 'bamboo-view-group-label');
  this.label.setAttribute('type', 'content');
  this.label.setAttribute('flex', '1');
  this.label.textContent = bamboo.utils.str('bamboo.button.searchresult');
  this.box.appendChild(this.label);

  var handlerMarkAsRead = function()
  {
    view.run('markAsRead');
  };

  this.labelCount = bamboo.doc.createElement('label');
  this.labelCount.setAttribute('class', 'bamboo-view-group-label bamboo-view-group-label-count bamboo-font-light');
  this.labelCount.setAttribute('tooltiptext', bamboo.utils.str('bamboo.button.mark'));
  this.labelCount.addEventListener("click", handlerMarkAsRead, false);
  this.box.appendChild(this.labelCount);

  var imgBox = bamboo.doc.createElement('vbox');
  imgBox.setAttribute('class', 'bamboo-button-loading-box');
  this.box.appendChild(imgBox);

  var img = bamboo.doc.createElement('image');
  img.setAttribute('class', 'bamboo-button-loading');
  imgBox.appendChild(img);

  var childrenBox1 = bamboo.doc.createElement('vbox');
  childrenBox1.setAttribute('class', 'bamboo-view-group-children');
  childrenBox1.setAttribute('open', 'true');
  this.container.appendChild(childrenBox1);

  var childrenBox2 = bamboo.doc.createElement('vbox');
  childrenBox2.setAttribute('class', 'bamboo-view-group-children');
  childrenBox2.setAttribute('open', 'true');
  this.container.appendChild(childrenBox2);

  this.update();

  return [childrenBox1, childrenBox2];
};

bamboo.ui.view.search.prototype.focus = function()
{
  this.box.focus();
};

bamboo.ui.view.search.prototype.markAsRead = function()
{
  var group = this.getData();

  group.run('markAsReaded');
  bamboo.ui.panel.get('search').zoneViewMenu.update();
};

bamboo.ui.view.search.prototype.update = function()
{
  var data = this.getData();
  var news = data.unreadItemCount > 0;
  var count = news ? data.unreadItemCount : '';

  this.labelCount.setAttribute('value', count);
  this.box.setAttribute('selected', data.selected);
  this.box.setAttribute('loading', data.loading);
  this.box.setAttribute('open', data.open);
  this.box.setAttribute('news', news);
};
