
var EXPORTED_SYMBOLS = ["bamboo"];

var bamboo;
bamboo = {
  ID: '{b2e69492-2358-071a-7056-24ad0c3defb1}',
  win: null,
  doc: null,
  xhr: null,
  funcOpenLink: null,
  browser: null,
  toolbox: null,
  parser: null,
  serializer: null,
  bo: {},
  selection: null,
  searchSelection: null,
  isFirefox: true,
  initialized: false,

  getRun: function ()
  {
    return function (sFunction, args)
    {
      try
      {
        if (this[sFunction] == null)
        {
          throw {message: sFunction + ' is not a function.'};
        } else
        {
          return this[sFunction].apply(this, args);
        }
      }
      catch (ex)
      {
        bamboo.utils.error.logEx(ex, sFunction);
        return null;
      }
    };
  },

  extend: function (superClass, baseClass)
  {
    superClass.prototype = Object.create(baseClass.prototype);
    superClass.prototype.constructor = superClass;
  },

  getTargetApplication: function ()
  {
    this.isFirefox = bamboo.browser ? true : false;
  },

  setContext: function (targetWindow, targetXHR, targetBrowser, targetToolbox, targetParser, targetSerializer, functionOpenLink, notification)
  {
    this.win = targetWindow;
    this.doc = this.win ? this.win.document : null;
    this.xhr = targetXHR;
    this.browser = targetBrowser;
    this.toolbox = targetToolbox;
    this.parser = targetParser;
    this.serializer = targetSerializer;
    this.funcOpenLink = functionOpenLink;
    this.notification = notification;
  },

  init: function ()
  {
    if (!this.initialized)
    {
      this.initialized = true;

      this.run = this.getRun();
      this.getTargetApplication();
      this.run('setApplicationHandler', ['feed']);
      this.run('setApplicationHandler', ['audio.feed']);

      bamboo.option.run('init');
      bamboo.utils.blacklist.run('getList');
      bamboo.ui.run('init');
      bamboo.data.run('init');

      if (bamboo.option.get('filter-new') == 'true')
      {
        bamboo.data.page.run('activateFilter', ['new', true]);
      }
      if (bamboo.option.get('filter-favorite') == 'true')
      {
        bamboo.data.page.run('activateFilter', ['favorite', true]);
      }

      //this.run('selectItem', [bamboo.data.all]);
      bamboo.data.all.run('showView');

      bamboo.utils.timer.run('init', [true]);
    }
    else
    {
      bamboo.ui.run('updateButtons');
    }
  },

  setApplicationHandler: function (type)
  {
    var index = 0;
    var found = false;
    var prefValue = '';

    do
    {
      prefValue = bamboo.option.getPrefString('browser.contentHandlers.types.' + index + '.title');

      found = prefValue == 'Bamboo';

      if (found)
      {
        found = bamboo.option.getPrefString('browser.contentHandlers.types.' + index + '.type') == 'application/vnd.mozilla.maybe.' + type;
      }
      index++;
    }
    while (!found && prefValue != null);

    index--;
    bamboo.option.setPrefString('browser.contentHandlers.types.' + index + '.title', 'Bamboo');
    bamboo.option.setPrefString('browser.contentHandlers.types.' + index + '.type', 'application/vnd.mozilla.maybe.' + type);
    bamboo.option.setPrefString('browser.contentHandlers.types.' + index + '.uri', 'chrome://bamboo/content/feedhandler.html?url=%s');
  },

  selectItem: function (item)
  {
    if (this.selection)
    {
      this.selection.selected = false;
      this.selection.updateView();
      bamboo.data.page.hideAllItems();
    }

    this.selection = item;

    if (this.selection)
    {
      this.selection.selected = true;

      bamboo.ui.setSelectionType(this.getSelectionType());

      bamboo.data.page.onSelectionChanged();

      this.selection.updateView();
      this.selection.showItemsViews();

      bamboo.ui.panel.get('reader').zoneViewMenu.update();
      bamboo.ui.panel.get('reader').zoneViewData.scrollTop();

      if (bamboo.option.get('apply-filter-tree') == 'true')
      {
        bamboo.data.all.updateVisibleItemsCount();
      }
    }
  },

  selectSearchItem: function (item)
  {
    if (this.searchSelection)
    {
      this.searchSelection.selected = false;
      this.searchSelection.updateView();
      bamboo.data.searchPage.hideAllItems();
    }

    this.searchSelection = item;
    this.searchSelection.selected = true;

    bamboo.ui.setSearchSelectionType(this.getSearchSelectionType());

    bamboo.ui.panel.get('search').zoneViewMenu.update();
    bamboo.data.searchPage.onSelectionChanged();

    this.searchSelection.updateView();
    this.searchSelection.showItemsViews();

    bamboo.ui.panel.get('search').zoneViewData.scrollTop();
  },

  selectFeedByURL: function (url)
  {
    var result = bamboo.data.all.getFeedByURL(url);
    if (result)
    {
      this.selectItem(result);
    }
  },

  isItemSelected: function (item)
  {
    if (this.selection)
    {
      var parent = item;
      while (parent)
      {
        if (parent.id == this.selection.id)
        {
          return true;
        }
        parent = parent.getParent();
      }
      if (item.groups)
      {
        var groupContainsItem = function (group, targetItem)
        {
          for (var i = 0; i < group.feeds.length; i++)
          {
            if (group.feeds[i].id == targetItem.id)
            {
              return true;
            }
          }
          for (i = 0; i < group.groups.length; i++)
          {
            if (group.groups[i].id == targetItem.id)
            {
              return true;
            }
          }
          for (i = 0; i < group.groups.length; i++)
          {
            if (groupContainsItem(group.groups[i], targetItem))
            {
              return true;
            }
          }
          return false;
        };

        return groupContainsItem(item, this.selection);
      }
    }
    return false;
  },

  isSearchItemSelected: function (item)
  {
    if (this.searchSelection)
    {
      var parent = item;
      while (parent)
      {
        if (parent.id == this.searchSelection.id)
        {
          return true;
        }
        parent = parent.getParent();
      }
    }
    return false;
  },

  deleteSelection: function (notChildren)
  {
    if (this.getSelectionType() == 'all')
    {
      this.deleteRoot();
    }
    else if (this.getSelectionType() == 'lib')
    {
      this.deleteLibrary();
    }
    else
    {
      this.deleteGroupOrFeed(this.selection, notChildren);
    }
  },

  deleteRoot: function ()
  {
    bamboo.data.all.removeAll();
    this.selectItem(bamboo.data.all);

    this.data.save();
  },

  deleteLibrary: function ()
  {
    bamboo.data.lib.removeAll(true);

    if (bamboo.selection == bamboo.data.lib)
    {
      bamboo.ui.panel.get('reader').zoneViewMenu.run('update');
    }

    this.data.save();
  },

  deleteGroupOrFeed: function (target, notChildren)
  {
    var parent = target.getParent();
    if (notChildren)
    {
      parent.addGroups(target.groups);
      parent.addFeeds(target.feeds);
    }
    parent.removeChild(target);

    if (target.id == this.selection.id)
    {
      this.selectItem(parent);
    }
    else if (this.isItemSelected(target))
    {
      this.selectItem(this.selection);
    }

    this.data.save();
  },

  addSearchSelection: function (targetGroupId)
  {
    if (this.searchSelection instanceof bamboo.data.searchfeed)
    {
      var newFeed = bamboo.data.all.addFeed(this.searchSelection.name, this.searchSelection.url, this.searchSelection.webpage, 0, this.searchSelection.favorite, 'notset');
      newFeed.updateUnreadedCount();
      bamboo.data.all.showView();
      this.selectItem(newFeed);
      this.selectSearchItem(bamboo.data.found);

      var group = bamboo.factory.getData(targetGroupId);
      bamboo.ui.dd.moveFeedToGroup(newFeed.id, group);

      newFeed.update();
      bamboo.ui.panel.select('reader');
      bamboo.data.run('saveBackup');
    }
  },

  getSelectionType: function ()
  {
    if (this.selection == bamboo.data.all)
    {
      return 'all';
    }
    if (this.selection == bamboo.data.lib)
    {
      return 'lib';
    }
    if (this.selection instanceof bamboo.data.group)
    {
      return 'group';
    }
    if (this.selection instanceof bamboo.data.feed)
    {
      return 'feed';
    }
    return '';
  },

  getSearchSelectionType: function ()
  {
    if (this.searchSelection == bamboo.data.found)
    {
      return 'search';
    }
    if (this.searchSelection instanceof bamboo.data.searchfeed)
    {
      return 'feed';
    }
    return '';
  }
};
