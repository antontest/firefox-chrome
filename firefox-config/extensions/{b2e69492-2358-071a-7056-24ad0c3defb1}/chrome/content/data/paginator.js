
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.data.paginator = function(isSearch)
{
  bamboo.data.base.call(this, null);

  this.search = isSearch;
  this.items = null;
  this.filters = [new bamboo.data.filterNew(), new bamboo.data.filterFavorite(), new bamboo.data.filterSearch()];
  this.currentPage = 1;
  this.pageCount = 0;
  this.itemCount = 0;
};

bamboo.extend(bamboo.data.paginator, bamboo.data.base);

bamboo.data.paginator.prototype.init = function()
{
  this.items = [];
  this.currentPage = 1;
  this.pageCount = 0;
  this.itemCount = 0;

  this.updatePageItemCount();
};

bamboo.data.paginator.prototype.getSelection = function()
{
  return this.search ? bamboo.searchSelection : bamboo.selection;
};

bamboo.data.paginator.prototype.updatePageItemCount = function()
{
  this.pageItemCount = Number(bamboo.option.get('page-item-count'));
  if(this.pageItemCount < 10)
  {
    this.pageItemCount = 100;
  }
};

bamboo.data.paginator.prototype.onPageItemCountChanged = function()
{
  this.hideCurrentItems();
  this.updatePageItemCount();
  this.onSelectionChanged();
  var selection = this.getSelection();
  if(selection)
  {
    selection.showItemsViews();
  }
};

bamboo.data.paginator.prototype.onPageChanged = function()
{
  this.updateView();
  this.showCurrentItems();
  bamboo.ui.panel.selection.zoneViewData.scrollTop();
};

bamboo.data.paginator.prototype.onSelectionChanged = function()
{
  this.init();

  if(this.getSelection())
  {
    this.onItemsChanged();
  }

  this.updateView();
};

bamboo.data.paginator.prototype.onItemsChanged = function()
{
  this.itemCount = this.items.length;
  this.pageCount = this.itemCount > 0 ? Math.ceil(this.itemCount / this.pageItemCount) : 0;
  this.showView();
};

bamboo.data.paginator.prototype.isItemValid = function(item)
{
  var curFilterCount = this.filters.length;
  var filter;

  for(var filterIndex=0; filterIndex<curFilterCount; filterIndex++)
  {
    filter = this.filters[filterIndex];

    if(filter.active && !filter.matchFilters && filter.name == 'search')
    {
      return filter.isItemValid(item);
    }
  }

  for(var filterIndex=0; filterIndex<curFilterCount; filterIndex++)
  {
    filter = this.filters[filterIndex];

    if(filter.active)
    {
      if(!filter.isItemValid(item))
      {
        return false;
      }
    }
  }

  return true;
};

bamboo.data.paginator.prototype.hasFilter = function()
{
  var curFilterCount = this.filters.length;

  for(var filterIndex=0; filterIndex<curFilterCount; filterIndex++)
  {
    if(this.filters[filterIndex].active)
    {
      return true;
    }
  }
  return false;
};

bamboo.data.paginator.prototype.getFilterByName = function(name)
{
  var curFilterCount = this.filters.length;

  for(var filterIndex=0; filterIndex<curFilterCount; filterIndex++)
  {
    if(this.filters[filterIndex].name == name)
    {
      return this.filters[filterIndex];
    }
  }
  return null;
};

bamboo.data.paginator.prototype.activateFilter = function(name, active, force)
{
  var filter = this.getFilterByName(name);
  filter.activate(active, force, this.search);
  bamboo.ui.applyFilterOptions();
};

bamboo.data.paginator.prototype.showFeedItems = function(feed, doNotShowView)
{
  var olderFirst = bamboo.option.get('sort-older-first') == 'true';
  var totalCount = this.items.length;
  var feedCount = feed.items.length;
  var curIndex = 0;
  var found;
  var item;
  var notInsertedIndex = -1;
  var filter = this.hasFilter();

  for(var n=0; n<feedCount; n++)
  {
    found = false;
    item = feed.items[n];

    if(filter && !this.isItemValid(item))
    {
      continue;
    }

    for(var i=curIndex; i<totalCount; i++)
    {
      if(!this.items[i] || (!olderFirst && item.date >= this.items[i].date) || (olderFirst && item.date <= this.items[i].date))
      {
        found = true;
        this.insertItem(item, i, doNotShowView);
        curIndex = i+1;
        totalCount = this.items.length;
        break;
      }
    }

    if(!found)
    {
      notInsertedIndex = n;
      break;
    }
  }

  if(notInsertedIndex >= 0)
  {
    for(var index=notInsertedIndex; index<feedCount; index++)
    {
      item = feed.items[index];
      if(filter && !this.isItemValid(item))
      {
        continue;
      }
      this.insertItem(item, -1, doNotShowView);
    }
  }
  this.onItemsChanged();
  this.updateView();
};

bamboo.data.paginator.prototype.insertItem = function(item, index, doNotShowView)
{
  var newIndex = index;
  var itemCount = this.items.length;

  if(index >= 0)
  {
    this.items.splice(index, 0, item);
  }
  else
  {
    newIndex = itemCount;
    this.items.push(item);
  }
  itemCount = this.items.length;

  if(this.isIndexVisible(newIndex))
  {
    var firstIndex = (this.currentPage-1) * this.pageItemCount;
    if(!doNotShowView)
    {
      item.showView(newIndex - firstIndex);
    }

    var lastIndex = this.currentPage * this.pageItemCount;
    if(itemCount > lastIndex)
    {
      this.items[lastIndex].removeView();
    }
  }
  else
  {
    var firstIndex = (this.currentPage-1) * this.pageItemCount;
    if(newIndex < firstIndex)
    {
      if(!doNotShowView && this.items[firstIndex])
      {
        this.items[firstIndex].showView(0);
      }

      var lastIndex = this.currentPage * this.pageItemCount;
      if(itemCount > lastIndex)
      {
        this.items[lastIndex].removeView();
      }
    }
  }
};

bamboo.data.paginator.prototype.removeFeedItems = function(feed)
{
  var feedCount = feed.items.length;
  var index;

  for(var n=0; n<feedCount; n++)
  {
    feed.items[n].removeView();

    index = this.items.indexOf(feed.items[n]);
    if(index >= 0)
    {
      this.items.splice(index, 1);
    }
  }
};

bamboo.data.paginator.prototype.hideFeedItems = function(feed)
{
  var feedCount = feed.items.length;

  for(var n=0; n<feedCount; n++)
  {
    feed.items[n].removeView();
  }
};

bamboo.data.paginator.prototype.showCurrentItems = function()
{
  var currentItems = this.getCurrentItems();
  for(var i=0; i<currentItems.length; i++)
  {
    currentItems[i].showView(i);
  }
};

bamboo.data.paginator.prototype.hideCurrentItems = function()
{
  var currentItems = this.getCurrentItems();
  for(var i=0; i<currentItems.length; i++)
  {
    currentItems[i].removeView();
  }
};

bamboo.data.paginator.prototype.hideAllItems = function()
{
  var count = this.items.length;
  for(var i=0; i<count; i++)
  {
    this.items[i].removeView();
  }
};

bamboo.data.paginator.prototype.hideItem = function(item)
{
   item.removeView();
   var index = this.items.indexOf(item);
   if(index >= 0)
   {
     this.items.splice(index, 1);

     if(this.currentPage < this.pageCount)
     {
        var toShow = this.items[this.currentPage*this.pageItemCount-1];
        if(toShow)
        {
           toShow.showView();
        }
     }

     this.onItemsChanged();

     if(this.currentPage > 1 && this.currentPage > this.pageCount)
     {
       this.currentPage--;
       this.onPageChanged();
     }
     else
     {
       this.updateView();
     }
   }
 };

bamboo.data.paginator.prototype.hasCurrentUnreadItems = function()
{
  var currentItems = this.getCurrentItems();
  var count = currentItems.length;

  for(var i=0; i<count; i++)
  {
    if(!currentItems[i].readed)
    {
      return true;
    }
  }

  return false;
};

bamboo.data.paginator.prototype.markCurrentItemsAsReaded = function()
{
  var changed = false;
  var currentItems = this.getCurrentItems();
  var count = currentItems.length;

  for(var i=0; i<count; i++)
  {
    if(!currentItems[i].readed)
    {
      changed = true;
      currentItems[i].markAsReaded(true);
    }
  }
  if(changed)
  {
    bamboo.data.save();
  }
};

bamboo.data.paginator.prototype.markFirstAsRead = function()
{
  var item = this.getFirstUnreadItem();

  if(item)
  {
    var remove = this.getFilterByName('new').active && (!this.getFilterByName('search').active || this.getFilterByName('search').matchFilters);

    item.run('toggleReaded');

    if(remove)
    {
      this.hideItem(item);
      item.getParent().updateVisibleItemsCount(true);
    }
    else
    {
      this.updateView();
    }

    bamboo.ui.panel.get('reader').zoneViewMenu.update();
    bamboo.data.run('save');
  }
};

bamboo.data.paginator.prototype.openFirstUnread = function(pOpenInBack)
{
  var item = this.getFirstUnreadItem();

  if(item)
  {
    var view = item.getView();
    if(view)
    {
      view.run('openLink', [item.url, pOpenInBack]);

      this.markFirstAsRead();
    }
  }
};

bamboo.data.paginator.prototype.openUnread = function()
{
  bamboo.ui.hidePopup();

  var count = 0;
  var len = this.items.length;
  var itemsToHide = [];
  var limit = Number(bamboo.option.get('max-tab-open-count'));
  if(!limit)
  {
    limit = 10;
  }
  if(limit < 5)
  {
    limit = 5;
  }

  for(var i=0; (i<len && count<limit); i++)
  {
    if(!this.items[i].readed)
    {
      bamboo.utils.browser.openLink(this.items[i].url, true);
      this.items[i].toggleReaded();
      if(this.getFilterByName('new').active)
      {
        itemsToHide.push(this.items[i]);
      }
      count++;
    }
  }
  for(var i=0; i<itemsToHide.length; i++)
  {
    this.hideItem(itemsToHide[i]);
    var parent = itemsToHide[i].getParent();
    if(parent)
    {
      parent.updateVisibleItemsCount(true);
    }
  }
  if(!this.search)
  {
    bamboo.ui.panel.get('reader').zoneViewMenu.update();
    bamboo.data.run('save');
  }

  bamboo.ui.show();
};

bamboo.data.paginator.prototype.getFirstUnreadItem = function()
{
  var all = this.getCurrentItems();
  var count = all.length;
  var current = null;

  for(var i=0; i<count; i++)
  {
    current = all[i];

    if(!current.readed)
    {
      return current;
    }
  }
  return null;
};

bamboo.data.paginator.prototype.getCurrentItems = function()
{
  var currentItems = [];
  var count = this.items.length;
  if(count > 0)
  {
    var firstIndex = (this.currentPage-1) * this.pageItemCount;
    var lastIndex = this.currentPage * this.pageItemCount;

    for(var i=firstIndex; i<lastIndex && i<count; i++)
    {
      currentItems.push(this.items[i]);
    }
  }

  return currentItems;
};

bamboo.data.paginator.prototype.isIndexVisible = function(index)
{
  var firstIndex = (this.currentPage-1) * this.pageItemCount;
  var lastIndex = this.currentPage * this.pageItemCount;

  return index >= firstIndex && index < lastIndex;
};

bamboo.data.paginator.prototype.hasData = function()
{
  return this.pageCount > 0;
};

bamboo.data.paginator.prototype.isFirstPage = function()
{
  return this.currentPage == 1;
};

bamboo.data.paginator.prototype.isSecondPage = function()
{
  return this.currentPage == 2;
};

bamboo.data.paginator.prototype.isPenultimatePage = function()
{
  return this.currentPage == (this.pageCount-1);
};

bamboo.data.paginator.prototype.isLastPage = function()
{
  return this.currentPage == this.pageCount;
};

bamboo.data.paginator.prototype.pageDown = function()
{
  if(this.currentPage > 1)
  {
    if(bamboo.option.get('readed-on-next-page') == 'true')
    {
      this.markCurrentItemsAsReaded();
    }
    this.hideCurrentItems();
    this.currentPage--;
    this.onPageChanged();
  }
};

bamboo.data.paginator.prototype.pageUp = function()
{
  if(this.currentPage < this.pageCount)
  {
    if(bamboo.option.get('mark-as-read-on-next-page') == 'true')
    {
      this.markCurrentItemsAsReaded();
    }
    this.hideCurrentItems();
    this.currentPage++;
    this.onPageChanged();
  }
};

bamboo.data.paginator.prototype.pageFirst = function()
{
  if(bamboo.option.get('readed-on-next-page') == 'true')
  {
    this.markCurrentItemsAsReaded();
  }
  this.hideCurrentItems();
  this.currentPage = 1;
  this.onPageChanged();
};

bamboo.data.paginator.prototype.pageLast = function()
{
  if(this.currentPage < this.pageCount)
  {
    if(bamboo.option.get('readed-on-next-page') == 'true')
    {
      this.markCurrentItemsAsReaded();
    }
    this.hideCurrentItems();
    this.currentPage = this.pageCount;
    this.onPageChanged();
  }
};

bamboo.data.paginator.prototype.str = function()
{
  var firstIndex = (this.currentPage-1) * this.pageItemCount + 1;
  var lastIndex = this.currentPage * this.pageItemCount;
  if(lastIndex > this.itemCount)
  {
    lastIndex = this.itemCount;
  }

  return firstIndex + ' - ' + lastIndex + ' / ' + this.itemCount;
};
