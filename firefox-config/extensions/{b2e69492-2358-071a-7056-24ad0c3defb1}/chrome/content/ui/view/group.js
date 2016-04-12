
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.ui.view.group = function(id, target)
{
  bamboo.ui.view.base.call(this, id, target);

  this.global = null;
  this.ctn = null;
  this.box = null;
  this.label = null;
  this.labelCount = null;
  this.textbox = null;
};

bamboo.extend(bamboo.ui.view.group, bamboo.ui.view.base);

bamboo.ui.view.group.prototype.build = function(index)
{
  var data = this.getData();
  var view = this;

  this.global = bamboo.doc.createElement('vbox');
  this.global.setAttribute('class', 'bamboo-view-group-global');

  if(index === undefined || index < 0 || index >= this.container.childNodes.length)
  {
    this.container.appendChild(this.global);
  }else{
    var child = this.container.childNodes[index];
    this.container.insertBefore(this.global, child);
  }

  var handlerSelect = function(event, fromKey)
  {
    if(event.button == 2)
    {
      event.stopPropagation();
      event.preventDefault();

      bamboo.ui.contextMenu.run('showGroupContextMenu', [view, event.clientX, event.clientY]);
      return;
    }

    var edit = bamboo.selection == data;
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
      bamboo.run('selectItem', [data]);

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

  this.ctn = bamboo.doc.createElement('vbox');
  this.ctn.setAttribute('class', 'bamboo-view-group-container');
  this.ctn.addEventListener("mousedown", function(event)
  {
    if(event.button == 2)
    {
      event.stopPropagation();
      event.preventDefault();
    }
  }, false);
  this.ctn.addEventListener("click", handlerSelect, false);
  this.global.appendChild(this.ctn);

  var level = 0;
  var group = data.getParent();
  while((group = group.getParent()) && level < 4)
  {
    level++;
  };

  this.box = bamboo.doc.createElement('vbox');
  this.box.setAttribute('class', 'bamboo-focusable bamboo-view-group bamboo-view-level-' + level);
  this.box.addEventListener("keypress", function(event)
  {
    if(event.charCode == 32)
    {
      handlerSelect(event, true);
    }
  }, false);
  this.ctn.appendChild(this.box);

  bamboo.ui.dd.register(this.id, this.box);

  var ddBox = bamboo.doc.createElement('hbox');
  ddBox.setAttribute('class', 'bamboo-view-group-dd');
  this.box.appendChild(ddBox);

  var handlerExpand = function(event)
  {
    if(Number(bamboo.option.get('tree-width')) < 100 && bamboo.selection != data)
    {
      bamboo.run('selectItem', [data]);
    }
    else
    {
      data.run('toggleOpen');
    }
    event.stopPropagation();
  };
  var handlerCollapse = function(event)
  {
    if(Number(bamboo.option.get('tree-width')) < 100 && bamboo.selection != data)
    {
      bamboo.run('selectItem', [data]);
    }
    else
    {
      data.run('toggleOpen');
    }
    event.stopPropagation();
  };

  var imgBox = bamboo.doc.createElement('vbox');
  imgBox.setAttribute('class', 'bamboo-button-expand-box');
  ddBox.appendChild(imgBox);
  this.iconExpand = bamboo.doc.createElement('image');
  this.iconExpand.setAttribute('class', 'bamboo-button-folder bamboo-button-expand');
  this.iconExpand.addEventListener("click", handlerExpand, false);
  imgBox.appendChild(this.iconExpand);

  imgBox = bamboo.doc.createElement('vbox');
  imgBox.setAttribute('class', 'bamboo-button-collapse-box');
  ddBox.appendChild(imgBox);
  this.iconCollapse = bamboo.doc.createElement('image');
  this.iconCollapse.setAttribute('class', 'bamboo-button-folder bamboo-button-collapse');
  this.iconCollapse.addEventListener("click", handlerCollapse, false);
  imgBox.appendChild(this.iconCollapse);

  this.label = bamboo.doc.createElement('html:div');
  this.label.setAttribute('class', 'bamboo-view-group-label');
  this.label.setAttribute('type', 'content');
  this.label.setAttribute('flex', '1');
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

  var handlerMarkAsRead = function(event)
  {
    event.stopPropagation();

    view.run('confirmMarkAsRead');
  };

  this.labelCount = bamboo.doc.createElement('label');
  this.labelCount.setAttribute('class', 'bamboo-view-group-label bamboo-view-group-label-count bamboo-font-light');
  this.labelCount.setAttribute('tooltiptext', bamboo.utils.str('bamboo.button.mark'));
  this.labelCount.addEventListener("click", handlerMarkAsRead, false);
  buttonBox.appendChild(this.labelCount);

  var childrenBox1 = bamboo.doc.createElement('vbox');
  childrenBox1.setAttribute('class', 'bamboo-view-group-children');
  this.global.appendChild(childrenBox1);

  var childrenBox2 = bamboo.doc.createElement('vbox');
  childrenBox2.setAttribute('class', 'bamboo-view-group-children');
  this.global.appendChild(childrenBox2);

  this.childContainer = [childrenBox1, childrenBox2];

  this.update(true);

  return [childrenBox1, childrenBox2];
};

bamboo.ui.view.group.prototype.update = function(onBuild)
{
  if(this.built || onBuild)
  {
    var data = this.getData();

    var news = data.unreadItemCount > 0;
    var count = data.unreadItemCount;

    this.label.textContent = data.name;
    this.labelCount.setAttribute('value', count);
    this.global.setAttribute('hasVisibleItem', data.visibleItemCount > 0);

    this.box.setAttribute('waiting', data.waiting);
    this.box.setAttribute('loading', data.loading);
    this.box.setAttribute('selected', data.selected);
    this.box.setAttribute('warning', !data.loading && data.errorFeeds.length ? 'true' : 'false');
    this.box.setAttribute('tooltiptext', data.getErrorFeedsDescription());
    this.box.setAttribute('open', data.open);
    this.box.setAttribute('news', news);
    this.iconExpand.setAttribute('tooltiptext', data.name);
    this.iconCollapse.setAttribute('tooltiptext', data.name);

    this.childContainer[0].setAttribute('open', data.open);
    this.childContainer[1].setAttribute('open', data.open);
  }
};

bamboo.ui.view.group.prototype.remove = function()
{
  if(this.built)
  {
    this.container.removeChild(this.global);

    this.built = false;
  }
};

bamboo.ui.view.group.prototype.setAction = function(action)
{
  this.ctn.setAttribute('action', action);
};

bamboo.ui.view.group.prototype.updateGroup = function()
{
  var group = this.getData();
  group.update();
};

bamboo.ui.view.group.prototype.confirmMarkAsRead = function()
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

bamboo.ui.view.group.prototype.markAsRead = function()
{
  var group = this.getData();

  group.run('markAsReaded');
  bamboo.ui.panel.get('reader').zoneViewMenu.update();
  bamboo.data.run('save');

  if(bamboo.data.page.getFilterByName('new').active && (bamboo.isItemSelected(group) || bamboo.option.get('apply-filter-tree') == 'true'))
  {
    bamboo.selectItem(bamboo.selection);
  }
  else
  {
    bamboo.data.page.updateView();
  }
};
