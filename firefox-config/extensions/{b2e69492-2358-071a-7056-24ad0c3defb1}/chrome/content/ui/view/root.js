
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.ui.view.root = function(id)
{
  bamboo.ui.view.base.call(this, id, bamboo.ui.panel.get('reader').zoneTree.childContainer);

  this.box = null;
  this.label = null;
  this.labelCount = null;
  this.childrenBox1 = null;
  this.childrenBox2 = null;
};

bamboo.extend(bamboo.ui.view.root, bamboo.ui.view.base);

bamboo.ui.view.root.prototype.build = function()
{
  var view = this;

  var handlerSelect = function(event, fromKey)
  {
    if(event.button == 2)
    {
      event.stopPropagation();
      event.preventDefault();

      bamboo.ui.contextMenu.run('showRootContextMenu', [view, event.clientX, event.clientY]);
      return;
    }

    var edit = bamboo.selection == bamboo.data.all;
    if(edit)
    {
      var last = view.box.getAttribute('select-time');
      edit = last && Number(last) > (new Date().getTime() - 500);
    }
    if(edit)
    {
      bamboo.ui.run('editSelection');
    }else{
      view.box.setAttribute('select-time', new Date().getTime().toString());
      bamboo.run('selectItem', [bamboo.data.all]);

      if(fromKey)
      {
        view.box.focus();
      }
      else
      {
        bamboo.ui.rootNode.focus();
      }
    }
  };

  this.box = bamboo.doc.createElement('hbox');
  this.box.setAttribute('class', 'bamboo-focusable bamboo-view-group bamboo-view-group-category bamboo-view-group-container');
  this.box.addEventListener("click", handlerSelect, false);
  this.box.addEventListener("keypress", function(event)
  {
    if(event.charCode == 32)
    {
      handlerSelect(event, true);
    }
  }, false);
  bamboo.ui.panel.get('reader').zoneTree.header.appendChild(this.box);

  bamboo.ui.dd.register(this.id, this.box);

  var ddBox = bamboo.doc.createElement('hbox');
  ddBox.setAttribute('class', 'bamboo-view-group-dd');
  ddBox.setAttribute('flex', '1');
  this.box.appendChild(ddBox);

  var imgBox = bamboo.doc.createElement('vbox');
  ddBox.appendChild(imgBox);

  var icon = bamboo.doc.createElement('image');
  icon.setAttribute('class', 'bamboo-icon-root');
  imgBox.appendChild(icon);

  this.label = bamboo.doc.createElement('html:div');
  this.label.setAttribute('class', 'bamboo-view-group-label');
  this.label.setAttribute('type', 'content');
  this.label.setAttribute('flex', '1');
  this.label.textContent = bamboo.utils.str('bamboo.all');
  ddBox.appendChild(this.label);

  var buttonBox = bamboo.doc.createElement('hbox');
  ddBox.appendChild(buttonBox);

  var handlerUpdate = function(event)
  {
    event.stopPropagation();

    view.run('updateGroup');
  };

  var updateBox = bamboo.doc.createElement('vbox');
  updateBox.setAttribute('tooltiptext', bamboo.utils.str('bamboo.button.update'));
  updateBox.setAttribute('pack', 'center');
  updateBox.addEventListener("click", handlerUpdate, false);
  buttonBox.appendChild(updateBox);

  var updateImg = bamboo.doc.createElement('image');
  updateImg.setAttribute('class', 'bamboo-view-icon-update');
  updateBox.appendChild(updateImg);

  imgBox = bamboo.doc.createElement('vbox');
  imgBox.setAttribute('class', 'bamboo-button-loading-box');
  buttonBox.appendChild(imgBox);

  var img = bamboo.doc.createElement('image');
  img.setAttribute('class', 'bamboo-button-loading');
  imgBox.appendChild(img);

  imgBox = bamboo.doc.createElement('vbox');
  imgBox.setAttribute('class', 'bamboo-button-warning-box');
  buttonBox.appendChild(imgBox);

  img = bamboo.doc.createElement('image');
  img.setAttribute('class', 'bamboo-button-warning');
  imgBox.appendChild(img);

  var handlerMarkAsRead = function()
  {
    view.run('confirmMarkAsRead');
  };

  this.labelCount = bamboo.doc.createElement('label');
  this.labelCount.setAttribute('class', 'bamboo-view-group-label bamboo-view-group-label-count bamboo-font-light');
  this.labelCount.setAttribute('tooltiptext', bamboo.utils.str('bamboo.button.mark'));
  this.labelCount.addEventListener("click", handlerMarkAsRead, false);
  buttonBox.appendChild(this.labelCount);

  this.childrenBox1 = bamboo.doc.createElement('vbox');
  this.childrenBox1.setAttribute('class', 'bamboo-view-group-children');
  this.childrenBox1.setAttribute('open', 'true');
  this.container.appendChild(this.childrenBox1);

  this.childrenBox2 = bamboo.doc.createElement('vbox');
  this.childrenBox2.setAttribute('class', 'bamboo-view-group-children');
  this.childrenBox2.setAttribute('open', 'true');
  this.container.appendChild(this.childrenBox2);

  this.update();

  return [this.childrenBox1, this.childrenBox2];
};

bamboo.ui.view.root.prototype.update = function()
{
  var data = this.getData();
  var news = data.unreadItemCount > 0;

  var count = news ? data.unreadItemCount : '';
  this.labelCount.setAttribute('value', count);
  this.box.setAttribute('selected', data.selected);
  this.box.setAttribute('open', data.open);
  this.box.setAttribute('news', news);
  this.box.setAttribute('loading', data.loading);
  this.box.setAttribute('warning', !data.loading && data.errorFeeds.length ? 'true' : 'false');
  this.box.setAttribute('tooltiptext', data.getErrorFeedsDescription());

  bamboo.ui.run('updateButtons');
  bamboo.ui.run('updateTab');
};

bamboo.ui.view.root.prototype.remove = function()
{
  if(this.built)
  {
    bamboo.ui.panel.get('reader').zoneTree.header.removeChild(this.box);

    this.container.removeChild(this.childrenBox1);
    this.container.removeChild(this.childrenBox2);

    this.built = false;
  }
};

bamboo.ui.view.root.prototype.focus = function()
{
  this.box.focus();
};

bamboo.ui.view.root.prototype.setAction = function(action)
{
  this.box.setAttribute('action', action);
};

bamboo.ui.view.root.prototype.updateGroup = function()
{
  var group = this.getData();
  group.update();
};

bamboo.ui.view.root.prototype.confirmMarkAsRead = function()
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

bamboo.ui.view.root.prototype.markAsRead = function()
{
  var group = this.getData();

  group.run('markAsReaded');
  bamboo.ui.panel.get('reader').zoneViewMenu.update();
  bamboo.data.run('save');

  if(bamboo.data.page.getFilterByName('new').active)
  {
    bamboo.selectItem(bamboo.selection);
  }
};
