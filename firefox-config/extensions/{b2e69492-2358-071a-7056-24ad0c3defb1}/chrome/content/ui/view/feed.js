
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.ui.view.feed = function(id, target)
{
  bamboo.ui.view.base.call(this, id, target);

  this.box = null;
  this.tag = null;
  this.label = null;
  this.labelCount = null;
};

bamboo.extend(bamboo.ui.view.feed, bamboo.ui.view.base);

bamboo.ui.view.feed.prototype.build = function(index)
{
  var data = this.getData();
  var view = this;

  var handlerSelect = function(event, fromKey)
  {
    if(event.button == 2)
    {
      event.stopPropagation();
      event.preventDefault();

      bamboo.ui.contextMenu.run('showFeedContextMenu', [view, event.clientX, event.clientY]);
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

  var level = 0;
  var group = data.getParent();
  while((group = group.getParent()) && level < 4)
  {
    level++;
  }

  this.box = bamboo.doc.createElement('vbox');
  this.box.setAttribute('class', 'bamboo-focusable bamboo-view-feed bamboo-view-level-' + level);
  this.box.addEventListener("click", handlerSelect, false);
  this.box.addEventListener("keypress", function(event)
  {
    if(event.charCode == 32)
    {
      handlerSelect(event, true);
    }
  }, false);

  if(index === undefined || index < 0 || index >= this.container.childNodes.length)
  {
    this.container.appendChild(this.box);
  }else{
    var child = this.container.childNodes[index];
    this.container.insertBefore(this.box, child);
  }

  bamboo.ui.dd.register(this.id, this.box);

  var ddBox = bamboo.doc.createElement('hbox');
  ddBox.setAttribute('class', 'bamboo-view-feed-dd');
  ddBox.setAttribute('align', 'center');
  this.box.appendChild(ddBox);

  var imgBox = bamboo.doc.createElement('vbox');
  ddBox.appendChild(imgBox);

  this.tag = bamboo.doc.createElement('image');
  this.tag.setAttribute('class', 'bamboo-view-feed-icon');
  this.tag.setAttribute('tooltiptext', data.name);
  this.tag.setAttribute('src', '');
  imgBox.appendChild(this.tag);

  var targetURLs = [];
  if(data.webpage)
  {
    targetURLs.push(data.webpage);
  }
  if(data.items.length > 0)
  {
    targetURLs.push(data.items[0].url);
  }
  targetURLs.push(data.url);

  bamboo.utils.getIconFromUrl(targetURLs, function(source)
  {
    try
    {
      if(source)
      {
        view.tag.setAttribute('src', source);
      }
      else if(bamboo.option.get('recover-icons') == 'true')
      {
        var url = data.url;
        if(data.items.length > 0)
        {
          url = data.items[0].url;
        }
        else if(data.webpage)
        {
          url = data.webpage;
        }
        view.tag.setAttribute('src', 'http://www.google.com/s2/favicons?domain_url=' + url);
      }
    }
    catch(ex) {}
  });

  this.label = bamboo.doc.createElement('html:div');
  this.label.setAttribute('class', 'bamboo-view-feed-label');
  this.label.setAttribute('type', 'content');
  this.label.setAttribute('flex', '1');

  ddBox.appendChild(this.label);

  var buttonBox = bamboo.doc.createElement('hbox');
  ddBox.appendChild(buttonBox);

  var handlerUpdate = function(event)
  {
    event.stopPropagation();

    view.run('updateFeed');
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

  this.labelCount = bamboo.doc.createElement('description');
  this.labelCount.setAttribute('class', 'bamboo-view-feed-label bamboo-view-feed-label-count bamboo-font-light');
  this.labelCount.setAttribute('tooltiptext', bamboo.utils.str('bamboo.button.mark'));
  this.labelCount.addEventListener("click", handlerMarkAsRead, false);
  buttonBox.appendChild(this.labelCount);

  this.update(true);
};

bamboo.ui.view.feed.prototype.update = function(onBuild)
{
  if(this.built || onBuild)
  {
    var data = this.getData();

    var news = data.unreadItemCount > 0;
    var count = data.unreadItemCount;

    this.label.textContent = data.name;
    this.labelCount.textContent = count;

    this.box.setAttribute('hasVisibleItem', data.visibleItemCount > 0);
    this.box.setAttribute('waiting', data.waiting);
    this.box.setAttribute('loading', data.loading);
    this.box.setAttribute('warning', !data.loading && data.error ? 'true' : 'false');
    this.box.setAttribute('tooltiptext', data.error ? data.error : '');
    this.box.setAttribute('selected', data.selected);
    this.box.setAttribute('news', news);
    this.tag.setAttribute('tooltiptext', data.name);
  }
};

bamboo.ui.view.feed.prototype.remove = function()
{
  if(this.built)
  {
    this.container.removeChild(this.box);

    this.built = false;
  }
};

bamboo.ui.view.feed.prototype.setAction = function(action)
{
  this.box.setAttribute('action', action);
};

bamboo.ui.view.feed.prototype.confirmMarkAsRead = function()
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

bamboo.ui.view.feed.prototype.markAsRead = function()
{
  var feed = this.getData();

  feed.run('markAsReaded');
  bamboo.ui.panel.get('reader').zoneViewMenu.update();
  bamboo.data.run('save');

  if(bamboo.data.page.getFilterByName('new').active && (bamboo.isItemSelected(feed) || bamboo.option.get('apply-filter-tree') == 'true'))
  {
    bamboo.selectItem(bamboo.selection);
  }
  else
  {
    bamboo.data.page.updateView();
  }
};

bamboo.ui.view.feed.prototype.updateFeed = function()
{
  var feed = this.getData();
  feed.update();
};
