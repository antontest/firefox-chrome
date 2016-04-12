
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.data.library = function()
{
  bamboo.data.feed.call(this, null, 'LIB', '', '', 0, true, 'false');
};

bamboo.extend(bamboo.data.library, bamboo.data.feed);

bamboo.data.library.prototype.hasItem = function(item)
{
  var curItem;
  for(var i=0; i<this.items.length; i++)
  {
    curItem = this.items[i];
    if(curItem.title == item.title && curItem.url == item.url && curItem.content == item.content)
    {
      return true;
    }
  }
  return false;
};

bamboo.data.library.prototype.addItem = function(item, loading)
{
  if(!this.hasItem(item))
  {
    var newItem = new bamboo.data.item(this, item.title, item.content, item.url, item.date, item.readed, item.itemID, item.author);
    if(loading)
    {
      newItem.feedURL = item.feedURL;
      newItem.feedName = item.feedName;
      newItem.isRTL = item.isRTL;
    }
    else
    {
      newItem.feedURL = item.getParent().url;
      newItem.feedName = item.getParent().name;
      newItem.isRTL = item.getParent().isRTL;
    }

    this.items.push(newItem);

    this.sortItems();

    if(!item.readed)
    {
      this.unreadItemCount++;
      this.updateView();
    }

    if(!loading)
    {
      bamboo.data.saveLib();
    }

    if(bamboo.selection == this)
    {
      bamboo.selectItem(this);
    }

    this.updateView();
  }
};

bamboo.data.library.prototype.removeItem = function(item, doNotSave)
{
  var curItem;
  for(var i=0; i<this.items.length; i++)
  {
    curItem = this.items[i];
    if(curItem.title == item.title && curItem.url == item.url && curItem.content == item.content)
    {
      var removed = this.items.splice(i, 1)[0];
      bamboo.data.page.hideItem(removed);
      this.onItemChanged(doNotSave);
      break;
    }
  }
};

bamboo.data.library.prototype.removeAll = function(doNotSave)
{
  while(this.items.length > 0)
  {
    this.removeItem(this.items[0], doNotSave);
  }
};

bamboo.data.library.prototype.onItemChanged = function(doNotSave)
{
  this.updateUnreadedCount();
  this.updateView();

  if(!doNotSave)
  {
    bamboo.data.saveLib();
  }
};

bamboo.data.library.prototype.getItems = function(filter)
{
  var items = [];
  var curItem;
  var now = new Date().getTime();
  for(var i=0; i<this.items.length; i++)
  {
    curItem = this.items[i];
    if(filter == 0 || (filter == 1 && !curItem.readed))
    {
      items.push(curItem);
    }
    else if(filter > 1 && curItem.date)
    {
      var offset = 24*60*60*1000;
      if(filter > 2)
      {
        offset *= 7;
      }
      if(curItem.date >= (now - offset))
      {
        items.push(curItem);
      }
    }
  }
  return items;
};
