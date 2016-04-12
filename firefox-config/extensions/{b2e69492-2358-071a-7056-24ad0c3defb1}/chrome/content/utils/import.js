
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");
try
{
  Components.utils.import('resource://gre/modules/PlacesUtils.jsm');
  Components.utils.import('resource://gre/modules/Services.jsm');
  Components.utils.import('resource://gre/modules/XPCOMUtils.jsm');
}
catch(e){}

bamboo.utils.import =
{
  run : bamboo.getRun(),

  initFromLive : function()
  {
    var group = new bamboo.data.group(bamboo.data.all, bamboo.utils.str('bamboo.firefoxfeeds'), true, 0);

    this.readAllBookmarks(group);
    
    if(group.hasChild())
    {
      bamboo.data.all.groups.push(group);
    }
  },

  importLive : function()
  {
    var root = new bamboo.data.root(0);
    root.name = bamboo.utils.str('bamboo.firefoxfeeds');

    this.readAllBookmarks(root);
    
    if(!root.hasChild())
    {
      bamboo.ui.showMessageDialog(bamboo.utils.str('bamboo.import.error.nolive'));
    }
    else
    {
      this.data = root;

      this.importOptions();
    }
  },

  readAllBookmarks : function(group)
  {
    var bookmarkService = Components.classes["@mozilla.org/browser/nav-bookmarks-service;1"].getService(Components.interfaces.nsINavBookmarksService);

    this.readAllBookmarksInFolder(group, bookmarkService.bookmarksMenuFolder);
    this.readAllBookmarksInFolder(group, bookmarkService.toolbarFolder);
    this.readAllBookmarksInFolder(group, bookmarkService.unfiledBookmarksFolder);

    group.removeEmptyGroups();
  },

  readAllBookmarksInFolder : function(group, folder)
  {
    var query = PlacesUtils.history.getNewQuery();
    var options = PlacesUtils.history.getNewQueryOptions();
    query.setFolders([folder], 1);

    var result = PlacesUtils.history.executeQuery(query, options);

    this.readBookmark(result.root, group);
  },

  readBookmark : function(bookmark, group)
  {
      bookmark.containerOpen = true;

    for (var i=0; i<bookmark.childCount; i++)
    {
      var child = bookmark.getChild(i);

      if(child.type == Components.interfaces.nsINavHistoryResultNode.RESULT_TYPE_FOLDER || child.type == Components.interfaces.nsINavHistoryResultNode.RESULT_TYPE_FOLDER_SHORTCUT)
      {
        if(PlacesUtils.annotations.itemHasAnnotation(child.itemId, PlacesUtils.LMANNO_FEEDURI))
        {
          var name = child.title;
          var xmlUrl = null;
          var htmlUrl = null;
          try
          {
            xmlUrl = PlacesUtils.annotations.getItemAnnotation(child.itemId, PlacesUtils.LMANNO_FEEDURI);
          }
          catch(e) {}
          try
          {
            htmlUrl = PlacesUtils.annotations.getItemAnnotation(child.itemId, PlacesUtils.LMANNO_SITEURI);
          }
          catch(e) {}

          group.addFeed(name, xmlUrl, htmlUrl, 0, false);
        }
        else
        {
          var childGroup = group.addGroup(child.title, false, 0);

          this.readBookmark(child.QueryInterface(Components.interfaces.nsINavHistoryContainerResultNode), childGroup);
        }
      }
    }
    try
    {
      bookmark.containerOpen = false;
    }
    catch (e){}
  },
  
  browse : function()
  {
    bamboo.ui.hidePopup();

    var nsIFilePicker = Components.interfaces.nsIFilePicker;
    var dialog = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    dialog.init(bamboo.win, bamboo.utils.str('bamboo.import.browse'), nsIFilePicker.modeOpen);
    dialog.appendFilter("OPML Files","*.xml; *.opml");

    var res = dialog.show();
    if (res == nsIFilePicker.returnOK)
    {
      var fileContent = bamboo.utils.io.readFromPath(dialog.file.path);

      var parser = new bamboo.parser();
      var xml = parser.parseFromString(fileContent, "text/xml");

      var error = null;
      if(xml.documentElement.nodeName == 'parsererror')
      {
        error = bamboo.utils.str('bamboo.import.error.parse');
      }
      else if(xml.documentElement.nodeName != 'opml')
      {
        error = bamboo.utils.str('bamboo.import.error.format');
      }
      if(error)
      {
        bamboo.ui.showMessageDialog(bamboo.utils.str('bamboo.import.error') + ' ' + error);
      }
      else
      {
        this.importXML(xml);
      }
    }
    bamboo.ui.showPopup();
  },

  importXML : function(xml)
  {
    var root = null;
    try
    {
      root = bamboo.utils.parser.parseOpml(xml);
    }
    catch(ex)
    {
      root = null;
      var error = 'exception ' + bamboo.utils.error.exToStr(ex);
      bamboo.ui.showMessageDialog(bamboo.utils.str('bamboo.import.error') + ' ' + error);
    }
    if(root == null)
    { return; }

    if(!root.hasChild())
    {
      bamboo.ui.showMessageDialog(bamboo.utils.str('bamboo.import.error.nodata'));
    }
    else
    {
      this.data = root;

      this.importOptions();
    }
  },

  importOptions : function()
  {
    var panel = this;
    var message = bamboo.utils.str('bamboo.import.option') + ' "';
    message += this.data.name == '' ? bamboo.utils.str('bamboo.import.defaultname') : this.data.name;
    message += '":';
    var action = bamboo.utils.str('bamboo.import.option.button');
    var choices = { importmode:
                    { type: 'radio', values: [bamboo.utils.str('bamboo.import.option.add'),
                                              bamboo.utils.str('bamboo.import.option.replace')]},
                    newgroup:
                    { type: 'check', checked: true, value: bamboo.utils.str('bamboo.import.option.newgroup')},
                    update:
                    { type: 'check', checked: true, value: bamboo.utils.str('bamboo.import.option.update')}};

    bamboo.ui.showConfirmDialog(message, action, choices,
    { onValidation: function(result)
    {
      panel.run('importData', [result['importmode'], result['newgroup'], result['update']]);
    }});
  },

  importData : function(mode, newGroup, update)
  {
    var groupCount = this.data.groups.length;
    var feedCount = this.data.feeds.length;

    if(mode == 1)
    {
      // Delete existing data
      bamboo.data.all.removeAll();
    }

    // Add imported data
    var target = bamboo.data.all;
    if(newGroup)
    {
      var name = !this.data.name || !this.data.name.length ? bamboo.utils.str('bamboo.import.defaultname') : this.data.name;
      target = bamboo.data.all.addGroup(name, true, 0);
      bamboo.data.all.showView();
    }

    target.addGroups(this.data.groups);
    target.addFeeds(this.data.feeds);
    bamboo.data.run('saveBackup');
    bamboo.data.save();
    bamboo.selectItem(target);
    bamboo.data.all.showChildrenViews();

    bamboo.ui.panel.select('reader');

    if(update)
    {
      if(mode == 1)
      {
        target.update();
      }
      else
      {
        var count = target.groups.length;
        for(var i=0; i<groupCount; i++)
        {
          var index = count - i - 1;
          target.groups[index].update();
        }
        count = target.feeds.length;
        for(var i=0; i<feedCount; i++)
        {
          var index = count - i - 1;
          target.feeds[index].update();
        }
      }
    }
  }
};
