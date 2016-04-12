
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.ui.dd =
{
  run: bamboo.getRun(),
  
  register : function(id, node)
  {
    var data = bamboo.factory.getItem(id).data;
    var isFeed = data instanceof bamboo.data.feed;

    if(isFeed)
    {
      node['dd'] = new bamboo.ui.dd.feed(id, node);
    }else{
      if(data == bamboo.data.all)
      {
        node['dd'] = new bamboo.ui.dd.root(id, node);
      }else{
        node['dd'] = new bamboo.ui.dd.group(id, node);
      }
    }
  },
  
  moveFeed : function(feedId, targetId, before)
  {
    var data = bamboo.factory.getItem(targetId).data;

    if(data instanceof bamboo.data.group)
    {
      this.moveFeedToGroup(feedId, data);
    }
    else
    {
      this.moveFeedToFeed(feedId, data, before);
    }
  },
  
  moveFeedToFeed : function(feedId, targetFeed, before)
  {
    var feed = bamboo.factory.getItem(feedId).data;
    var group = feed.getParent();
    var targetGroup = targetFeed.getParent();

    var refreshSelection = false;

    if(group == targetGroup)
    {
      refreshSelection = bamboo.isItemSelected(feed);

      group.moveFeed(feed, targetFeed, before);
    }
    else
    {
      refreshSelection = bamboo.isItemSelected(feed) || bamboo.isItemSelected(targetGroup);

      group.removeFeed(feed);
      targetGroup.insertFeedBefore(feed, targetFeed, before);
    }

    if(refreshSelection)
    {
      bamboo.selectItem(bamboo.selection);
    }
  },
  
  moveFeedToGroup : function(feedId, targetGroup, noRefresh)
  {
    var feed = bamboo.factory.getItem(feedId).data;
    var group = feed.getParent();

    var refreshSelection = bamboo.isItemSelected(feed) || bamboo.isItemSelected(targetGroup);

    group.removeFeed(feed);
    targetGroup.insertFeed(feed, -1);

    if(refreshSelection && !noRefresh)
    {
      bamboo.selectItem(bamboo.selection);
    }
  },
  
  moveGroup : function(group, targetGroup, action, noRefresh)
  {
    var refreshSelection = false;
     var parentGroup = group.getParent();

    if(action == 'in')
    {
      refreshSelection = bamboo.isItemSelected(parentGroup) || bamboo.isItemSelected(targetGroup);

      parentGroup.removeGroup(group);
      targetGroup.insertGroup(group, -1);
    }
    else
    {
       var targetParentGroup = targetGroup.getParent();

      if(parentGroup == targetParentGroup)
      {
        parentGroup.moveGroup(group, targetGroup, action == 'up');
      }
      else
      {
        refreshSelection = bamboo.isItemSelected(parentGroup) || bamboo.isItemSelected(targetGroup);

        parentGroup.removeGroup(group);
        targetParentGroup.insertGroupBefore(group, targetGroup, action == 'up');
      }
    }

    if(refreshSelection && !noRefresh)
    {
      bamboo.selectItem(bamboo.selection);
    }
  }
};
