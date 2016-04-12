
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.data.search = function(unreadCount)
{
  bamboo.data.group.call(this, null, "SEARCH", true, unreadCount);
};

bamboo.extend(bamboo.data.search, bamboo.data.group);

bamboo.data.search.prototype.addFeed = function(name, pURL, pWebpage)
{
  var feed = new bamboo.data.searchfeed(this, name, pURL, pWebpage);
  this.feeds.push(feed);
  return feed;
};

bamboo.data.search.prototype.setLoading = function(isLoading)
{
  this.loading = isLoading;
  this.updateView();
};

bamboo.data.search.prototype.onChildLoaded = function()
{
  var isLoading = this.loading;
  this.refreshLoading();

  if(this.loading != isLoading)
  {
    this.updateView();
    bamboo.ui.panel.get('search').zoneViewMenu.update();
  }
};

bamboo.data.search.prototype.showItemsViews = function(doNotShowView)
{
  for(var i=0; i<this.groups.length; i++)
  {
    this.groups[i].showItemsViews(true);
  }
  for(var i=0; i<this.feeds.length; i++)
  {
    this.feeds[i].showItemsViews(true);
  }
  if(!doNotShowView)
  {
    bamboo.data.searchPage.showCurrentItems();
  }
};

bamboo.data.search.prototype.containsFeed = function(feed)
{
  for(var i=0; i<this.feeds.length; i++)
  {
    if(this.feeds[i] == feed)
    {
      return true;
    }
  }
  return false;
};
