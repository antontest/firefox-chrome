
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.data.feed = function(parent, pName, pURL, pWebPage, pUnreadCount, pFavorite, pIsRTL)
{
  bamboo.data.base.call(this, parent);

  this.name = pName;
  this.url = pURL;
  this.webpage = pWebPage;
  this.unreadItemCount = pUnreadCount;
  this.visibleItemCount = 0;

  this.loading = false;
  this.waiting = false;
  this.favorite = pFavorite;
  this.isRTL = pIsRTL;

  this.error = null;

  this.items = [];
};

bamboo.extend(bamboo.data.feed, bamboo.data.base);

bamboo.data.feed.prototype.addItem = function(pTitle, pContent, URL, pDate, pRead, pItemID, pAuthor)
{
  var item = new bamboo.data.item(this, pTitle, pContent, URL, pDate, pRead, pItemID, pAuthor);
  this.items.push(item);
  return item;
};

bamboo.data.feed.prototype.updateVisibleItemsCount = function(bubble)
{
  var oldVisibleItemCount = this.visibleItemCount;
  this.visibleItemCount = 0;

  for(var i=0; i<this.items.length; i++)
  {
    if(bamboo.data.page.isItemValid(this.items[i]))
    {
      this.visibleItemCount++;
    }
  }

  if(oldVisibleItemCount != this.visibleItemCount && (oldVisibleItemCount == 0 || this.visibleItemCount == 0))
  {
    this.updateView();
  }

  if(bubble)
  {
    var group = this.getParent();
    if(group)
    {
      group.updateVisibleItemsCount(true);
    }
  }
};

bamboo.data.feed.prototype.markAsReaded = function()
{
  for(var i=0; i<this.items.length; i++)
  {
    this.items[i].markAsReaded(true);
  }
};

bamboo.data.feed.prototype.markFirstAsReaded = function()
{
  var count = 0;
  for(var i=0; i<this.items.length; i++)
  {
    if(!this.items[i].readed)
    {
      this.items[i].markAsReaded(true);
      count++;
      if(count >= 10)
      {
        break;
      }
    }
  }
};

bamboo.data.feed.prototype.updateUnreadedCount = function()
{
  this.unreadItemCount = 0;
  for(var i=0; i<this.items.length; i++)
  {
    if(!this.items[i].readed)
    {
      this.unreadItemCount++;
    }
  }
};

bamboo.data.feed.prototype.openUnreadItems = function()
{
  var count = 0;
  for(var i=0; i<this.items.length; i++)
  {
    if(!this.items[i].readed)
    {
      this.items[i].openLink();
      count++;
      if(count >= 10)
      {
        break;
      }
    }
  }
};

bamboo.data.feed.prototype.onItemChanged = function()
{
  this.updateUnreadedCount();
  this.updateView();
  this.getParent().onChildUnreadCountChanged();
};

bamboo.data.feed.prototype.update = function()
{
  this.error = null;
  this.waiting = true;
  this.updateView();
  this.getParent().onChildWaiting();

  bamboo.utils.updater.update(this);
};

bamboo.data.feed.prototype.onUpdateStart = function()
{
  this.waiting = false;
  this.setLoading(true);
  this.updateView();
};

bamboo.data.feed.prototype.onUpdateSuccess = function(xml)
{
  var newItems = null;
  try
  {
    newItems = bamboo.utils.parser.parse(xml, this, false);
  }
  catch(ex)
  {
    this.error = bamboo.utils.str('bamboo.message.error.read') + ' ' + ex.message;
  }

  var scrollPos = bamboo.ui.panel.get('reader').zoneViewData.childContainer.scrollTop;

  if(newItems)
  {
    this.setNewItems(newItems);
    this.updateUnreadedCount();
  }

  this.updateVisibleItemsCount(true);

  this.getParent().onChildUnreadCountChanged();

  this.setLoading(false);
  this.updateView();

  if(bamboo.isItemSelected(this))
  {
    this.showItemsViews();
    if(scrollPos > 0)
    {
      bamboo.ui.panel.get('reader').zoneViewData.childContainer.scrollTop = scrollPos;
    }
    bamboo.ui.panel.get('reader').zoneViewMenu.update();
  }
};

bamboo.data.feed.prototype.setNewItems = function(newItems)
{
  this.removeChildrenViews();
  this.setReadItems(newItems);
  this.deleteItems();
  this.items = newItems.sort(this.compareItems);
};

bamboo.data.feed.prototype.sortItems = function()
{
  this.items = this.items.sort(this.compareItems);
};

bamboo.data.feed.prototype.compareItems = function(item1, item2)
{
  if(bamboo.option.get('sort-older-first') == 'true')
  {
    return item1.date > item2.date;
  }
  return item1.date < item2.date;
};

bamboo.data.feed.prototype.deleteItems = function()
{
  for(var i=0; i<this.items.length; i++)
  {
    this.items[i].deleteData();
    delete this.items[i];
  }
};

bamboo.data.feed.prototype.setReadItems = function(newItems)
{
  var trustLinks = !this.hasSameProperty(newItems, 'url') && !this.hasSameProperty(this.items, 'url');
  var trustIDs = !this.hasSameProperty(newItems, 'itemID') && !this.hasSameProperty(this.items, 'itemID');
  var trustTitles = !this.hasSameProperty(newItems, 'title') && !this.hasSameProperty(this.items, 'title');

  for(var n=0; n<newItems.length; n++)
  {
    var newItem = newItems[n];

    for(var i=0; i<this.items.length; i++)
    {
      var oldItem = this.items[i];

      if(trustLinks && newItem.url == oldItem.url)
      {
        newItem.readed = oldItem.readed;
        break;
      }
      if(trustIDs && oldItem.itemID && newItem.itemID == oldItem.itemID)
      {
        newItem.readed = oldItem.readed;
        break;
      }
      if(trustTitles && oldItem.title && newItem.title == oldItem.title && ((!newItem.date && !oldItem.date) || newItem.date == oldItem.date))
      {
        newItem.readed = oldItem.readed;
        break;
      }
      if(oldItem.content && oldItem.title && newItem.content == oldItem.content && newItem.title == oldItem.title && ((!newItem.date && !oldItem.date) || newItem.date == oldItem.date))
      {
        newItem.readed = oldItem.readed;
        break;
      }
    }
  }
};

bamboo.data.feed.prototype.hasSameProperty = function(items, propertyName)
{
  var count = items.length;
  if(count > 1)
  {
    var property1 = null;
    var property2 = null;

    for(var i=0; i<count; i++)
    {
      property1 = items[i][propertyName];

      for(var n=0; n<count; n++)
      {
        property2 = items[n][propertyName];

        if(n != i && property1 == property2)
        {
          return true;
        }
      }
    }
  }
  return false;
};

bamboo.data.feed.prototype.onUpdateError = function(ex)
{
  this.error = bamboo.utils.str('bamboo.message.error.loading');
  if(ex)
  {
    this.error += ': ' + bamboo.utils.error.exToStr(ex);
  }

  this.setLoading(false);
  this.updateView();
};

bamboo.data.feed.prototype.setLoading = function(isLoading)
{
  if(isLoading != this.loading)
  {
    this.loading = isLoading;

    if(this.loading)
    {
      this.getParent().onChildLoading();
    }
    else
    {
      this.getParent().onChildLoaded();
    }
  }
};

bamboo.data.feed.prototype.showItemsViews = function(doNotShowView)
{
  bamboo.data.page.showFeedItems(this, doNotShowView);
};

bamboo.data.feed.prototype.hideItemsViews = function()
{
  bamboo.data.page.hideFeedItems(this);
};

bamboo.data.feed.prototype.removeChildrenViews = function()
{
  bamboo.data.page.removeFeedItems(this);
  return;

  if(bamboo.isItemSelected(this))
  {
    bamboo.data.page.removeFeedItems(this);
  }
  for(var i=0; i<this.items.length; i++)
  {
    this.items[i].removeView();
  }
};

bamboo.data.feed.prototype.getItemCount = function()
{
  return this.items.length;
};

bamboo.data.feed.prototype.toggleFavorite = function()
{
  this.favorite = !this.favorite;

  if(bamboo.isItemSelected(this) && bamboo.data.page.getFilterByName('favorite').active)
  {
    bamboo.selectItem(bamboo.selection);
  }
};

bamboo.data.feed.prototype.testUpdate = function(resultHandler)
{
  this.error = null;
  var feed = this;
  try
  {
    bamboo.utils.ajax.load(this.url,
    {
      onSuccess: function(xml)
      {
        if(xml)
        {
          feed.run('testUpdateFromDocument', [xml, resultHandler]);
        }
        else
        {
          var msg = bamboo.utils.str('bamboo.message.error.format');
          feed.run('onTestUpdateError', [{message: msg}, resultHandler]);
        }
      },

      onError: function(ex)
      {
        feed.run('onTestUpdateError', [ex, resultHandler]);
      }
    });
  }
  catch(ex)
  {
    this.error = bamboo.utils.str('bamboo.message.error.loading') + ': ' + ex.message;
    resultHandler.onTestResult(this);
  }
};

bamboo.data.feed.prototype.testUpdateFromDocument = function(doc, resultHandler)
{
  var newItems = null;
  try
  {
    newItems = bamboo.utils.parser.parse(doc, this, true);
  }
  catch(ex)
  {
    this.error = bamboo.utils.str('bamboo.message.error.read') + ': ' + ex.message;
  }

  if(newItems)
  {
    this.setNewItems(newItems);
    this.updateUnreadedCount();
  }

  resultHandler.onTestResult(this);
};

bamboo.data.feed.prototype.onTestUpdateError = function(ex, resultHandler)
{
  this.error = bamboo.utils.str('bamboo.message.error.loading');
  if(ex)
  {
    this.error += ': ' + bamboo.utils.error.exToStr(ex);
  }

  resultHandler.onTestResult(this);
};

bamboo.data.feed.prototype.buildXml = function(xml, parentNode)
{
  var node = xml.createElement('outline');
  node.setAttribute('title', this.name);
  node.setAttribute('text', this.name);
  node.setAttribute('htmlUrl', this.webpage);
  node.setAttribute('type', 'rss');
  node.setAttribute('xmlUrl', this.url);
  node.setAttribute('bamboo-favorite', this.favorite);
  parentNode.appendChild(node);
};

bamboo.data.feed.prototype.str = function(recursive)
{
  var desc = 'Feed (' + this.id + ') "' + this.name + '"';
  if(recursive)
  {
    desc += '\n';
    for(var i=0; i<this.items.length; i++)
    {
      desc += '> ' + this.items[i].str(recursive);
    }
  }
  return desc;
};
