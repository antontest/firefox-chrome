
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.data.group = function(parent, pName, pOpen, pUnreadCount)
{
  bamboo.data.base.call(this, parent);

  this.name = pName;
  this.loading = false;
  this.waiting = false;
  this.errorFeeds = [];
  this.open = pOpen;
  this.unreadItemCount = pUnreadCount;
  this.visibleItemCount = 0;

  this.groups = [];
  this.feeds = [];
};

bamboo.extend(bamboo.data.group, bamboo.data.base);

bamboo.data.group.prototype.updateVisibleItemsCount = function(fromChild)
{
  var oldVisibleItemCount = this.visibleItemCount;
  this.visibleItemCount = 0;

  for(var i=0; i<this.groups.length; i++)
  {
    if(!fromChild)
    {
      this.groups[i].updateVisibleItemsCount();
    }
    this.visibleItemCount += this.groups[i].visibleItemCount;
  }
  for(var i=0; i<this.feeds.length; i++)
  {
    if(!fromChild)
    {
      this.feeds[i].updateVisibleItemsCount();
    }
    this.visibleItemCount += this.feeds[i].visibleItemCount;
  }

  if(oldVisibleItemCount != this.visibleItemCount && (oldVisibleItemCount == 0 || this.visibleItemCount == 0))
  {
    this.updateView();
  }

  var parent = this.getParent();
  if(fromChild && parent)
  {
    parent.updateVisibleItemsCount(true);
  }
};

bamboo.data.group.prototype.hasChild = function()
{
  return this.groups.length > 0 || this.feeds.length > 0;
};

bamboo.data.group.prototype.hasCollapsedGroup = function()
{
  for(var i=0; i<this.groups.length; i++)
  {
    if(!this.groups[i].open)
    {
      return true;
    }
  }
  return false;
};

bamboo.data.group.prototype.getErrorFeeds = function()
{
  var errorFeeds = [];

  for(var i=0; i<this.feeds.length; i++)
  {
    if(this.feeds[i].error)
    {
      errorFeeds.push(this.feeds[i].name + ': ' + this.feeds[i].error);
    }
  }

  for(var i=0; i<this.groups.length; i++)
  {
    var subErrorFeeds = this.groups[i].getErrorFeeds();
    var subErrorFeedCount = subErrorFeeds.length;

    for(var n=0; n<subErrorFeedCount; n++)
    {
      errorFeeds.push(subErrorFeeds[n]);
    }
  }

  return errorFeeds;
};

bamboo.data.group.prototype.getErrorFeedsDescription = function()
{
  if(this.errorFeeds.length)
  {
    var desc = bamboo.utils.str('bamboo.message.grouperror');
    desc += '\n\n- ';
    return desc + this.errorFeeds.join('\n- ');
  }
  return '';
};

bamboo.data.group.prototype.setOpen = function(open)
{
  for(var i=0; i<this.groups.length; i++)
  {
    var group = this.groups[i];
    if(group.open != open)
    {
      group.open = open;
      group.updateView();
      if(open)
      {
        group.showChildrenViews();
      }
    }
    group.setOpen(open);
  }
};

bamboo.data.group.prototype.hasFavoriteFeeds = function()
{
  for(var i=0; i<this.feeds.length; i++)
  {
    if(this.feeds[i].favorite)
    {
      return true;
    }
  }
  for(i=0; i<this.groups.length; i++)
  {
    if(this.groups[i].hasFavoriteFeeds())
    {
      return true;
    }
  }
  return false;
};

bamboo.data.group.prototype.hasAllFavoriteFeeds = function()
{
  for(var i=0; i<this.feeds.length; i++)
  {
    if(!this.feeds[i].favorite)
    {
      return false;
    }
  }
  for(i=0; i<this.groups.length; i++)
  {
    if(!this.groups[i].hasAllFavoriteFeeds())
    {
      return false;
    }
  }
  return true;
};

bamboo.data.group.prototype.markAllFeedsAsFavorite = function()
{
  for(var i=0; i<this.feeds.length; i++)
  {
    if(!this.feeds[i].favorite)
    {
      this.feeds[i].toggleFavorite();
    }
  }
  for(i=0; i<this.groups.length; i++)
  {
    this.groups[i].markAllFeedsAsFavorite();
  }
};

bamboo.data.group.prototype.markNoneFeedsAsFavorite = function()
{
  for(var i=0; i<this.feeds.length; i++)
  {
    if(this.feeds[i].favorite)
    {
      this.feeds[i].toggleFavorite();
    }
  }
  for(i=0; i<this.groups.length; i++)
  {
    this.groups[i].markNoneFeedsAsFavorite();
  }
};

bamboo.data.group.prototype.isChildGroup = function(target)
{
  for(var i=0; i<this.groups.length; i++)
  {
    if(target.id == this.groups[i].id)
    {
      return true;
    }
  }
  for(i=0; i<this.groups.length; i++)
  {
    if(this.groups[i].isChildGroup(target))
    {
      return true;
    }
  }
  return false;
};

bamboo.data.group.prototype.removeEmptyGroups = function()
{
  var emptyGroupIndexes = [];

  for(var i=0; i<this.groups.length; i++)
  {
    if(this.groups[i].getFeedCount() == 0)
    {
      emptyGroupIndexes.push(i);
    }
    else
    {
      this.groups[i].removeEmptyGroups();
    }
  }

  for(i=(emptyGroupIndexes.length-1); i>=0; i--)
  {
    this.groups.splice(emptyGroupIndexes[i], 1);
  }
};

// ADD

bamboo.data.group.prototype.addGroup = function(name, open, unreadCount)
{
  var group = new bamboo.data.group(this, name, open, unreadCount);
  this.groups.push(group);
  return group;
};

bamboo.data.group.prototype.addFeed = function(name, pURL, pWebpage, unreadCount, pFavorite, pIsRTL)
{
  var feed = new bamboo.data.feed(this, name, pURL, pWebpage, unreadCount, pFavorite, pIsRTL);
  this.feeds.push(feed);
  return feed;
};

bamboo.data.group.prototype.addGroups = function(groupsToAdd)
{
  var count = groupsToAdd.length;
  for(var i=0; i<count; i++)
  {
    bamboo.ui.dd.moveGroup(groupsToAdd[0], this, 'in', true);
  }
};

bamboo.data.group.prototype.addFeeds = function(feedsToAdd)
{
  var count = feedsToAdd.length;
  for(var i=0; i<count; i++)
  {
    bamboo.ui.dd.moveFeedToGroup(feedsToAdd[0].id, this, true);
  }
};

// MOVE

bamboo.data.group.prototype.moveGroup = function(group, targetGroup, before)
{
  var index = this.groups.indexOf(group);
  var targetIndex = this.groups.indexOf(targetGroup);

  if(index >= 0 && targetIndex >= 0)
  {
    this.removeGroup(group);

    var newIndex = targetIndex;
    if(index < targetIndex)
    {
      newIndex--;
    }
    if(!before)
    {
      newIndex++;
    }
    this.insertGroup(group, newIndex);
  }
};

bamboo.data.group.prototype.moveFeed = function(feed, targetFeed, before)
{
  var index = this.feeds.indexOf(feed);
  var targetIndex = this.feeds.indexOf(targetFeed);

  if(index >= 0 && targetIndex >= 0)
  {
    this.removeFeed(feed);

    var newIndex = targetIndex;
    if(index < targetIndex)
    {
      newIndex--;
    }
    if(!before)
    {
      newIndex++;
    }
    this.insertFeed(feed, newIndex);
  }
};

// REMOVE

bamboo.data.group.prototype.removeAll = function()
{
  for(var i=0; i<this.groups.length; i++)
  {
    this.groups[i].removeView();
  }
  for(i=0; i<this.feeds.length; i++)
  {
    this.feeds[i].removeView();
  }
  this.groups = [];
  this.feeds = [];
  this.errorFeeds = [];
  this.onChildUnreadCountChanged();
};

bamboo.data.group.prototype.removeChild = function(child)
{
  if(child instanceof bamboo.data.feed)
  {
    this.removeFeed(child);
  }else{
    this.removeGroup(child);
  }
};

bamboo.data.group.prototype.removeGroup = function(group)
{
  var index = this.groups.indexOf(group);

  if(index >= 0)
  {
    group.removeView();
    this.groups.splice(index, 1);
    this.refreshError();
    this.onChildUnreadCountChanged();
  }
};

bamboo.data.group.prototype.removeFeed = function(feed)
{
  var index = this.feeds.indexOf(feed);

  if(index >= 0)
  {
    feed.removeView();
    this.feeds.splice(index, 1);
    this.refreshError();
    this.onChildUnreadCountChanged();
  }
};

// INSERT

bamboo.data.group.prototype.insertGroup = function(group, index)
{
  var newIndex = index < 0 ? this.groups.length : index;
  this.groups.splice(newIndex, 0, group);
  group.setParent(this);
  this.refreshError();
  this.onChildUnreadCountChanged();
  if(this.open)
  {
    group.showView(newIndex);
  }
};

bamboo.data.group.prototype.insertGroupBefore = function(group, targetGroup, before)
{
  var targetIndex = this.groups.indexOf(targetGroup);
  if(targetIndex >= 0)
  {
    if(!before)
    {
      targetIndex++;
    }
    this.insertGroup(group, targetIndex);
  }
};

bamboo.data.group.prototype.insertFeed = function(feed, index)
{
  var newIndex = index < 0 ? this.feeds.length : index;
  this.feeds.splice(newIndex, 0, feed);
  feed.setParent(this);
  this.refreshError();
  this.onChildUnreadCountChanged();
  if(this.open)
  {
    feed.showView(newIndex);
  }
};

bamboo.data.group.prototype.insertFeedBefore = function(feed, targetFeed, before)
{
  var targetIndex = this.feeds.indexOf(targetFeed);
  if(targetIndex >= 0)
  {
    if(!before)
    {
      targetIndex++;
    }
    this.insertFeed(feed, targetIndex);
  }
};

bamboo.data.group.prototype.markAsReaded = function()
{
  for(var i=0; i<this.groups.length; i++)
  {
    this.groups[i].markAsReaded();
  }
  for(var i=0; i<this.feeds.length; i++)
  {
    this.feeds[i].markAsReaded();
  }
};

bamboo.data.group.prototype.showChildrenViews = function()
{
  if(this.open)
  {
    for(var i=0; i<this.groups.length; i++)
    {
      this.groups[i].showView();
    }
    for(var i=0; i<this.feeds.length; i++)
    {
      this.feeds[i].showView();
    }
  }
};

bamboo.data.group.prototype.removeChildrenViews = function()
{
  for(var i=0; i<this.groups.length; i++)
  {
    this.groups[i].removeView();
  }
  for(var i=0; i<this.feeds.length; i++)
  {
    this.feeds[i].removeView();
  }
};

bamboo.data.group.prototype.showItemsViews = function(doNotShowView)
{
  for(var i=0; i< this.groups.length; i++)
  {
    this.groups[i].showItemsViews(true);
  }
  for(var i=0; i<this.feeds.length; i++)
  {
    this.feeds[i].showItemsViews(true);
  }
  if(!doNotShowView)
  {
    bamboo.data.page.showCurrentItems();
  }
};

bamboo.data.group.prototype.hideItemsViews = function()
{
  for(var i=0; i<this.groups.length; i++)
  {
    this.groups[i].hideItemsViews();
  }
  for(var i=0; i<this.feeds.length; i++)
  {
    this.feeds[i].hideItemsViews();
  }
};

bamboo.data.group.prototype.updateUnreadedCount = function()
{
  this.unreadItemCount = 0;
  for(var i=0; i<this.groups.length; i++)
  {
    this.unreadItemCount += this.groups[i].unreadItemCount;
  }
  for(var i=0; i<this.feeds.length; i++)
  {
    this.unreadItemCount += this.feeds[i].unreadItemCount;
  }
};

bamboo.data.group.prototype.getFavoriteUnreadCount = function()
{
  var favoriteUnreadItemCount = 0;
  for(var i=0; i<this.groups.length; i++)
  {
    favoriteUnreadItemCount += this.groups[i].getFavoriteUnreadCount();
  }
  for(var i=0; i<this.feeds.length; i++)
  {
    if(this.feeds[i].favorite)
    {
      favoriteUnreadItemCount += this.feeds[i].unreadItemCount;
    }
  }
  return favoriteUnreadItemCount;
};

bamboo.data.group.prototype.openUnreadItems = function()
{
  var count = 0;
  for(var i=0; i<this.groups.length; i++)
  {
    this.groups[i].openUnreadItems();
    count += this.groups[i].unreadItemCount;
    if(count >= 10)
    {
      return;
    }
  }
  for(var i=0; i<this.feeds.length; i++)
  {
    this.feeds[i].openUnreadItems();
    count += this.feeds[i].unreadItemCount;
    if(count >= 10)
    {
      return;
    }
  }
};

bamboo.data.group.prototype.markFirstAsReaded = function()
{
  var count = 0;
  for(var i=0; i<this.groups.length; i++)
  {
    this.groups[i].markFirstAsReaded();
    count += this.groups[i].unreadItemCount;
    if(count >= 10)
    {
      return;
    }
  }
  for(var i=0; i<this.feeds.length; i++)
  {
    this.feeds[i].markFirstAsReaded();
    count += this.feeds[i].unreadItemCount;
    if(count >= 10)
    {
      return;
    }
  }
};

bamboo.data.group.prototype.onChildUnreadCountChanged = function()
{
  this.updateUnreadedCount();
  this.updateView();

  if(this.getParent())
  {
    this.getParent().onChildUnreadCountChanged();
  }
};

bamboo.data.group.prototype.onChildWaiting = function()
{
  if(!this.waiting && !this.loading)
  {
    this.waiting = true;
    this.updateView();

    if(this.getParent())
    {
      this.getParent().onChildWaiting();
    }
  }
};

bamboo.data.group.prototype.onChildLoading = function()
{
  var isLoading = this.loading;
  this.loading = true;
  this.waiting = false;
  if(!isLoading)
  {
    this.updateView();

    if(this.getParent())
    {
      this.getParent().onChildLoaded();
    }
  }
};

bamboo.data.group.prototype.onChildLoaded = function()
{
  var isLoading = this.loading;
  this.refreshLoading();

  if(this.loading != isLoading)
  {
    this.refreshError();

    this.updateView();

    this.getParent().onChildLoaded();
  }
};

bamboo.data.group.prototype.refreshError = function()
{
  this.errorFeeds = this.getErrorFeeds();
};

bamboo.data.group.prototype.refreshLoading = function()
{
  this.loading = false;
  this.waiting = false;

  for(var i=0; i<this.groups.length; i++)
  {
    if(this.groups[i].waiting)
    {
      this.waiting = true;
    }
    if(this.groups[i].loading)
    {
      this.loading = true;
      this.waiting = false;
      break;
    }
  }
  if(!this.loading)
  {
    for(var i=0; i<this.feeds.length; i++)
    {
      if(this.feeds[i].waiting)
      {
        this.waiting = true;
      }
      if(this.feeds[i].loading)
      {
        this.loading = true;
        this.waiting = false;
        break;
      }
    }
  }
};

bamboo.data.group.prototype.update = function(onlyFavorites)
{
  for(var i=0; i<this.groups.length; i++)
  {
    this.groups[i].update(onlyFavorites);
  }
  for(var i=0; i<this.feeds.length; i++)
  {
    if(!onlyFavorites || this.feeds[i].favorite)
    {
      this.feeds[i].update();
    }
  }
};

bamboo.data.group.prototype.toggleOpen = function()
{
  this.open = !this.open;
  if(this.open)
  {
    this.showView();
  }
  this.updateView();
};

bamboo.data.group.prototype.getItemCount = function()
{
  var itemCount = 0;
  for(var i=0; i<this.groups.length; i++)
  {
    itemCount += this.groups[i].getItemCount();
  }
  for(var i=0; i<this.feeds.length; i++)
  {
    itemCount += this.feeds[i].getItemCount();
  }
  return itemCount;
};

bamboo.data.group.prototype.getFeedCount = function()
{
  var feedCount = this.feeds.length;

  for(var i=0; i<this.groups.length; i++)
  {
    feedCount += this.groups[i].getFeedCount();
  }
  return feedCount;
};

bamboo.data.group.prototype.getFeedByURL = function(url)
{
  for(var i=0; i<this.feeds.length; i++)
  {
    if(this.feeds[i].url == url)
    {
      return this.feeds[i];
    }
  }
  for(var i=0; i<this.groups.length; i++)
  {
    var result = this.groups[i].getFeedByURL(url);
    if(result)
    {
      return result;
    }
  }
  return null;
};

bamboo.data.group.prototype.sortItems = function()
{
  for(var i=0; i<this.groups.length; i++)
  {
    this.groups[i].sortItems();
  }
  for(var i=0; i<this.feeds.length; i++)
  {
    this.feeds[i].sortItems();
  }
};

bamboo.data.group.prototype.buildXml = function(xml, parentNode)
{
  var node = xml.createElement('outline');
  node.setAttribute('title', this.name);
  node.setAttribute('text', this.name);
  parentNode.appendChild(node);

  this.buildChildrenXml(xml, node);
};

bamboo.data.group.prototype.buildChildrenXml = function(xml, node)
{
  for(var i=0; i<this.groups.length; i++)
  {
    this.groups[i].buildXml(xml, node);
  }
  for(var i=0; i<this.feeds.length; i++)
  {
    this.feeds[i].buildXml(xml, node);
  }
};

bamboo.data.group.prototype.getGroupList = function(excludeGroupId)
{
  var groups = [];
  this.addGroupToList(groups, excludeGroupId);
  return groups;
};

bamboo.data.group.prototype.getLabel = function()
{
  return this.name;
};

bamboo.data.group.prototype.addGroupToList = function(list, excludeGroupId)
{
  var group = {};
  group.value = this.id;
  group.label = this.getLabel();
  list.push(group);

  if(!excludeGroupId || this.id != excludeGroupId)
  {
    for(var i=0; i<this.groups.length; i++)
    {
      this.groups[i].addGroupToList(list, excludeGroupId);
    }
  }
};

bamboo.data.group.prototype.getDataList = function()
{
  var list = [];

  this.fillDataList(list);

  return list;
};

bamboo.data.group.prototype.fillDataList = function(list)
{
  for(var i=0; i<this.groups.length; i++)
  {
    var groupItem = {};
    groupItem.value = this.groups[i].id;
    groupItem.label = this.groups[i].name;
    list.push(groupItem);

    this.groups[i].fillDataList(list);
  }

  for(var i=0; i<this.feeds.length; i++)
  {
    var feedItem = {};
    feedItem.value = this.feeds[i].id;
    feedItem.label = this.feeds[i].name;
    list.push(feedItem);
  }
};

bamboo.data.group.prototype.str = function(recursive)
{
  var desc = 'Group (' + this.id + ') "' + this.name + '" ';
  desc += '[open=' + this.open + ']';
  if(recursive)
  {
    desc += '\n';
    for(var i=0; i<this.groups.length; i++)
    {
      desc += '+ ' + this.groups[i].str(recursive);
    }
    for(var i=0; i<this.feeds.length; i++)
    {
      desc += '- ' + this.feeds[i].str(recursive);
    }
  }
  return desc;
};
