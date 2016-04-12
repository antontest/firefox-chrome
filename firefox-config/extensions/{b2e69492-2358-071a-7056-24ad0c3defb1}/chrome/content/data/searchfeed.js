
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.data.searchfeed = function(parent, pName, pURL, pWebpage)
{
  bamboo.data.feed.call(this, parent, pName, pURL, pWebpage, 0, false, 'notset');
};

bamboo.extend(bamboo.data.searchfeed, bamboo.data.feed);

bamboo.data.searchfeed.prototype.updateUnreadedCount = function()
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

bamboo.data.searchfeed.prototype.onItemChanged = function()
{
  this.updateUnreadedCount();
  this.updateView();
  this.getParent().onChildUnreadCountChanged();
};

bamboo.data.searchfeed.prototype.onUpdateSuccess = function(xml)
{
  if(!this.getParent().containsFeed(this))
  {
    return;
  }
  this.error = null;
  var newItems = null;
  try
  {
    newItems = bamboo.utils.parser.parse(xml, this, false);
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

  this.setLoading(false);
  this.updateView();

  this.getParent().onChildUnreadCountChanged();

  if(bamboo.isSearchItemSelected(this))
  {
    this.showItemsViews();
  }
};

bamboo.data.searchfeed.prototype.setLoading = function(isLoading)
{
  if(isLoading != this.loading)
  {
    this.loading = isLoading;

    if(this.loading)
    {
      this.getParent().onChildLoading();
    }else{
      this.getParent().onChildLoaded();
    }
  }
};

bamboo.data.searchfeed.prototype.showItemsViews = function(doNotShowView)
{
  bamboo.data.searchPage.showFeedItems(this, doNotShowView);
};

bamboo.data.searchfeed.prototype.hideItemsViews = function()
{
  bamboo.data.searchPage.hideFeedItems(this);
};

bamboo.data.searchfeed.prototype.removeChildrenViews = function()
{
  bamboo.data.searchPage.removeFeedItems(this);
  return;

  if(bamboo.isSearchItemSelected(this))
  {
    bamboo.data.searchPage.removeFeedItems(this);
  }
  for(var i=0; i<this.items.length; i++)
  {
    this.items[i].removeView();
  }
};
