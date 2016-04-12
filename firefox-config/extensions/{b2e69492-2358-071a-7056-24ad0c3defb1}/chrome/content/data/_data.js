
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.data =
{
  run: bamboo.getRun(),
  all : null,
  lib : null,
  found : null,
  page : null,
  searchPage : null,
  
  feedFileName : 'feeds.json',
  libFileName : 'items.json',
  
  init : function()
  {
    this.load();
  },
  
  logContent : function()
  {
    bamboo.utils.error.log(this.all.str(true));
  },

  save : function()
  {
    var jsonContent = JSON.stringify(this.all, null, '\t');
    bamboo.utils.io.write(this.feedFileName, jsonContent);
  },
  
  saveLib : function()
  {
    var jsonContent = JSON.stringify(this.lib.items);
    bamboo.utils.io.write(this.libFileName, jsonContent);
  },

  saveBackup : function()
  {
    var dataXML = this.all.toXml();
    var serializer = new bamboo.serializer();
    var dataString = serializer.serializeToString(dataXML);

    bamboo.option.set('feed-backup', dataString);
  },

  hasBackup : function()
  {
    var backupContent = bamboo.option.get('feed-backup');
    return backupContent ? true : false;
  },

  loadBackup : function()
  {
    var backupContent = bamboo.option.get('feed-backup');

    var parser = new bamboo.parser();
    var xml = parser.parseFromString(backupContent, "text/xml");
    var root = bamboo.utils.parser.parseOpml(xml);

    if(root.hasChild())
    {
      this.all.open = false;
      this.all.addGroups(root.groups);
      this.all.addFeeds(root.feeds);
      this.all.open = true;
    }

    bamboo.ui.showMessageDialog(bamboo.utils.str('bamboo.message.backuploaded'));
  },

  reload : function()
  {
    if(this.all)
    {
      this.all.removeAll();
    }

    if(this.lib)
    {
      this.lib.removeAll(true);
    }

    this.load(true);

    bamboo.selectItem(this.all);
  },

  load : function(reload)
  {
    if(this.all == null || reload)
    {
      var strData = null;
      try
      {
        strData = bamboo.utils.io.read(this.feedFileName);
      }
      catch(ex)
      {
        strData = null;
      }

      if(!reload)
      {
        this.all = new bamboo.data.root(0);
        this.found = new bamboo.data.search(0);
        this.page = new bamboo.data.paginator(false);
        this.searchPage = new bamboo.data.paginator(true);
      }
      this.page.init();
      this.searchPage.init();

      if(!strData)
      {
        this.addDefaultData();
        this.save();
      }
      else
      {
        var oldData = null;
        try
        {
          oldData = JSON.parse(strData);
        }
        catch(ex)
        {
          oldData = null;
        }

        if(oldData)
        {
          this.loadGroup(oldData, this.all);
          this.all.updateUnreadedCount();

          this.run('saveBackup');
        }
        else
        {
          this.addDefaultData();
          this.save();
        }
      }

      this.all.showView();
    }

    this.loadLib(reload);
  },
  
  loadLib : function(reload)
  {
    if(this.lib == null || reload)
    {
      if(!reload)
      {
        this.lib = new bamboo.data.library();
        this.lib.showView();
      }

      var strData = '';
      var oldData = null;

      try
      {
        strData = bamboo.utils.io.read(this.libFileName);
      }
      catch(ex)
      { }

      if(strData != '')
      {
        try
        {
          oldData = JSON.parse(strData);
        }
        catch(ex)
        { }
      }
      if(oldData)
      {
        var count = oldData.length;
        for(var i=0; i<count; i++)
        {
          this.lib.addItem(oldData[i], true);
        }
      }
    }
  },

  loadGroup : function(oldGroup, newGroup)
  {
    var oldSubGroup;
    var newSubGroup;
    for(var i=0; i<oldGroup.groups.length; i++)
    {
      oldSubGroup = oldGroup.groups[i];

       newSubGroup = newGroup.addGroup(oldSubGroup.name, oldSubGroup.open, oldSubGroup.unreadItemCount);

       this.loadGroup(oldSubGroup, newSubGroup);
    }

    var oldFeed;
    var newFeed;
    for(var i=0; i<oldGroup.feeds.length; i++)
    {
      oldFeed = oldGroup.feeds[i];

       newFeed = newGroup.addFeed(oldFeed.name, oldFeed.url, oldFeed.webpage, oldFeed.unreadItemCount, oldFeed.favorite, oldFeed.isRTL === 'true' || oldFeed.isRTL === 'false' ? oldFeed.isRTL : 'notset');

       this.loadFeed(oldFeed, newFeed);
    }
  },
  
  loadFeed : function(oldFeed, newFeed)
  {
    var oldItem;
    for(var i=0; i<oldFeed.items.length; i++)
    {
      oldItem = oldFeed.items[i];

       newFeed.addItem(oldItem.title, oldItem.content, oldItem.url, oldItem.date, oldItem.readed, oldItem.itemID, oldItem.author);
    }
  },
  
  addDefaultData : function()
  {
    if(this.hasBackup())
    {
      this.run('loadBackup');
    }
    else
    {
      var root = this.all.addGroup(bamboo.utils.str('bamboo.defaultfeeds'), true, 0);
      root.addFeed('Bamboo versions', 'https://addons.mozilla.org/firefox/addon/bamboo-feed-reader/versions/format:rss', 'https://addons.mozilla.org/firefox/addon/bamboo-feed-reader/versions/', 0, false, 'false');

      var group = root.addGroup('Mozilla', true, 0);
      group.addFeed('The Mozilla Blog', 'http://blog.mozilla.com/feed/', 'http://blog.mozilla.org/', 0, false, 'false');
      group.addFeed('Mozilla - YouTube', 'https://www.youtube.com/feeds/videos.xml?channel_id=UCajipi80aORRDz6gZ8ZyCWw', 'http://www.youtube.com/user/Mozilla', 0, false, 'false');

      if(bamboo.isFirefox)
      {
        bamboo.utils.import.run('initFromLive');
      }
    }
  },
  
  sortItems : function()
  {
    this.all.sortItems();
    this.lib.sortItems();
    bamboo.selectItem(bamboo.selection);

    if(this.found && bamboo.searchSelection)
    {
      this.found.sortItems();
      bamboo.selectSearchItem(bamboo.searchSelection);
    }
  }
};

