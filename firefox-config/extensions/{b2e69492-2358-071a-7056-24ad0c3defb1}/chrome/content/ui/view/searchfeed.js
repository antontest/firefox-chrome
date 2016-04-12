
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.ui.view.searchfeed = function(id, target)
{
  bamboo.ui.view.base.call(this, id, target);

  this.box = null;
  this.label = null;
  this.labelCount = null;
  this.icon = null;
};

bamboo.extend(bamboo.ui.view.searchfeed, bamboo.ui.view.base);

bamboo.ui.view.searchfeed.prototype.build = function(index)
{
  var data = this.getData();
  var view = this;

  var handlerSelect = function(event, fromKey)
  {
    if(bamboo.selection != data)
    {
      bamboo.run('selectSearchItem', [data]);

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
  while((group = group.getParent()))
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
      handlerSelect(null, true);
    }
  }, false);

  if(index === undefined || index < 0 || index >= this.container.childNodes.length)
  {
    this.container.appendChild(this.box);
  }else{
    var child = this.container.childNodes[index];
    this.container.insertBefore(this.box, child);
  }

  var ddBox = bamboo.doc.createElement('hbox');
  ddBox.setAttribute('class', 'bamboo-view-feed-dd');
  ddBox.setAttribute('align', 'center');
  this.box.appendChild(ddBox);

  var imgBox = bamboo.doc.createElement('vbox');
  ddBox.appendChild(imgBox);

  this.icon = bamboo.doc.createElement('image');
  this.icon.setAttribute('class', 'bamboo-view-feed-icon');
  this.icon.setAttribute('tooltiptext', data.name);
  this.icon.setAttribute('src', '');
  imgBox.appendChild(this.icon);

  var targetURLs = [data.webpage, data.url];

  bamboo.utils.getIconFromUrl(targetURLs, function(source)
  {
    try
    {
      if(source)
      {
        view.icon.setAttribute('src', source);
      }
      else if(bamboo.option.get('recover-icons') == 'true')
      {
        view.icon.setAttribute('src', 'http://www.google.com/s2/favicons?domain_url=' + encodeURIComponent(data.webpage));
      }
    }
    catch(ex) {}
  });

  this.label = bamboo.doc.createElement('html:div');
  this.label.setAttribute('class', 'bamboo-view-feed-label');
  this.label.setAttribute('type', 'content');
  this.label.setAttribute('flex', '1');
  ddBox.appendChild(this.label);

  imgBox = bamboo.doc.createElement('vbox');
  imgBox.setAttribute('class', 'bamboo-button-loading-box');
  ddBox.appendChild(imgBox);

  var img = bamboo.doc.createElement('image');
  img.setAttribute('class', 'bamboo-button-loading');
  imgBox.appendChild(img);

  imgBox = bamboo.doc.createElement('vbox');
  imgBox.setAttribute('class', 'bamboo-button-warning-box');
  ddBox.appendChild(imgBox);

  img = bamboo.doc.createElement('image');
  img.setAttribute('class', 'bamboo-button-warning');
  imgBox.appendChild(img);

  var handlerMarkAsRead = function(event)
  {
    event.stopPropagation();

    view.run('markAsRead');
  };

  this.labelCount = bamboo.doc.createElement('description');
  this.labelCount.setAttribute('class', 'bamboo-view-feed-label bamboo-view-feed-label-count bamboo-font-light');
  this.labelCount.setAttribute('tooltiptext', bamboo.utils.str('bamboo.button.mark'));
  this.labelCount.addEventListener("click", handlerMarkAsRead, false);
  ddBox.appendChild(this.labelCount);

  this.update(true);
};

bamboo.ui.view.searchfeed.prototype.markAsRead = function()
{
  var feed = this.getData();

  feed.run('markAsReaded');
  bamboo.ui.panel.get('search').zoneViewMenu.update();
  bamboo.data.page.updateView();
  bamboo.data.run('save');
};

bamboo.ui.view.searchfeed.prototype.update = function(onBuild)
{
  if(this.built || onBuild)
  {
    var data = this.getData();

    var news = data.unreadItemCount > 0;
    var count = data.unreadItemCount;
    var name = bamboo.utils.clearString(data.name);

    this.label.textContent = name;
    this.labelCount.textContent = count;
    this.box.setAttribute('loading', data.loading);
    this.box.setAttribute('warning', !data.loading && data.error ? true : false);
    this.box.setAttribute('tooltiptext', data.error ? data.error : '');
    this.box.setAttribute('selected', data.selected);
    this.box.setAttribute('news', news);
    this.icon.setAttribute('tooltiptext', name);
  }
};

bamboo.ui.view.searchfeed.prototype.remove = function()
{
  if(this.built)
  {
    this.container.removeChild(this.box);

    this.built = false;
  }
};
