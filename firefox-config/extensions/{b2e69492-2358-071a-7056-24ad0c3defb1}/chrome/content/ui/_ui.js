
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.ui =
{
  run: bamboo.getRun(),

  zone : {menu : {}},
  view : {},

  firstShow : true,
  popupId : 'bamboo-popup',
  popupIsOpen : false,
  dlg : null,
  rootNode :  null,
  stack : null,
  area : null,
  panelArea : null,
  topMenu : null,
  bottomMenu : null,
  selectingTab : false,
  selectingTabCount : 0,

  init : function()
  {
    if(bamboo.option.get('toolbar-button-added') == 'false')
    {
      bamboo.ui.toolbar.run('addButton');
    }
    
    this.buildContainers();

    bamboo.ui.panel.run('init');
    bamboo.ui.links.run('init');

    this.applyOptions();
  },
  
  applyOptions : function()
  {
    if(this.area != null)
    {
      this.area.setAttribute('contentmode', bamboo.option.get('content-mode'));
      this.stack.setAttribute('contentfontsize', bamboo.option.get('content-font-size'));
      this.stack.setAttribute('theme', bamboo.option.get('display-theme'));
      this.stack.setAttribute('viewstyle', bamboo.option.get('display-view-style'));
      this.area.setAttribute('menuposition', bamboo.option.get('menu-position'));
      this.area.setAttribute('menuonlyicons', bamboo.option.get('menu-only-icons'));
      this.area.setAttribute('filtertree', bamboo.option.get('apply-filter-tree'));
      this.area.setAttribute('showauthor', bamboo.option.get('show-article-author'));
      this.stack.setAttribute('display-density', bamboo.option.get('display-density'));

      this.area.setAttribute('show-sharing-link-mail', bamboo.option.get('show-sharing-link-mail'));
      this.area.setAttribute('show-sharing-link-facebook', bamboo.option.get('show-sharing-link-facebook'));
      this.area.setAttribute('show-sharing-link-twitter', bamboo.option.get('show-sharing-link-twitter'));
      this.area.setAttribute('show-sharing-link-google', bamboo.option.get('show-sharing-link-google'));
      this.area.setAttribute('show-sharing-link-linkedin', bamboo.option.get('show-sharing-link-linkedin'));
      this.area.setAttribute('show-sharing-link-delicious', bamboo.option.get('show-sharing-link-delicious'));
      this.area.setAttribute('show-sharing-link-pocket', bamboo.option.get('show-sharing-link-pocket'));
      this.area.setAttribute('show-sharing-link-readability', bamboo.option.get('show-sharing-link-readability'));

      this.updateInterfaceAlignment();
      this.applyFilterOptions();
    }
  },

  checkFirstShow : function()
  {
    if(this.firstShow && bamboo.initialized)
    {
      this.firstShow = false;

      bamboo.selectItem(bamboo.data.all);
    }
  },
  
  applyFilterOptions : function()
  {
    this.area.setAttribute('filternew', bamboo.data.page && bamboo.data.page.getFilterByName('new').active ? 'true' : 'false');
    this.area.setAttribute('filterfav', bamboo.data.page && bamboo.data.page.getFilterByName('favorite').active ? 'true' : 'false');
  },
  
  setContentMode : function(isOn)
  {
    bamboo.option.set('content-mode', isOn ? 'true' : 'false');
    this.applyOptions();
    bamboo.data.page.showCurrentItems();
    bamboo.data.searchPage.showCurrentItems();
    bamboo.ui.panel.get('reader').zoneViewMenu.update();
  },
  
  setMenuPosition : function(position)
  {
    bamboo.option.set('menu-position', position);
    this.applyOptions();
  },
  
  getContentFontSize : function()
  {
    return Number(bamboo.option.get('content-font-size'));
  },
  
  setContentFontSize : function(fontSize)
  {
    return bamboo.option.set('content-font-size', fontSize);
  },
  
  canDecreaseContentFontSize : function()
  {
    return this.getContentFontSize() > 9;
  },
  
  canIncreaseContentFontSize : function()
  {
    return this.getContentFontSize() < 16;
  },
  
  decreaseContentFontSize : function()
  {
    if(this.canDecreaseContentFontSize())
    {
      this.setContentFontSize(this.getContentFontSize()-1);
      this.applyOptions();
    }
  },
  
  increaseContentFontSize : function()
  {
    if(this.canIncreaseContentFontSize())
    {
      this.setContentFontSize(this.getContentFontSize()+1);
      this.applyOptions();
    }
  },
  
  updateInterfaceAlignment : function()
  {
    if(this.area != null)
    {
      this.area.setAttribute('interface-align', bamboo.option.get('interface-align'));
    }
  },

  setSelectionType : function(selType)
  {
    this.area.setAttribute('selection', selType);
  },
  
  setSearchSelectionType : function(selType)
  {
    this.area.setAttribute('searchselection', selType);
  },

  showPopup : function(event)
  {
    var isRightPos = false;

    if(event)
    {
      try
      {
        isRightPos = event.screenX > (bamboo.win.screen.availWidth / 2);
      }
      catch (e) {}
    }
    var menu = bamboo.doc.getElementById(this.popupId);
    var target = bamboo.ui.toolbar.getButton();
    menu.openPopup(target, isRightPos ? 'after_end' : 'after_start');
  },

  hidePopup : function()
  {
    var menu = bamboo.doc.getElementById(this.popupId);
    menu.hidePopup();
  },

  hideTooltip : function()
  {
    bamboo.ui.panel.selection.zoneMenuPopup.hide();
  },

  closeDialog : function()
  {
    this.dlg.setVisible(false);
  },
  
  showWaitDialog : function(message, handler)
  {
    this.dlg.setData(message, true, null, null, handler, null, null, false);
    this.dlg.show();
    this.dlg.update();
  },
  
  showMessageDialog : function(message, resultHandler)
  {
    this.dlg.setData(message, false, null, null, resultHandler, null, null, false);
    this.dlg.show();
    this.dlg.update();
  },

  showWebDialog : function(url)
  {
    this.dlg.setData('', false, null, null, null, url, null, false);
    this.dlg.show();
    this.dlg.update();
  },

  showTabDialog : function()
  {
    this.dlg.setData('', false, null, null, null, null, null, true);
    this.dlg.show();
    this.dlg.update();
  },

  showConfirmDialog : function(message, action, choices, resultHandler, secondaryAction)
  {
    this.dlg.setData(message, false, action, choices, resultHandler, null, secondaryAction, false);
    this.dlg.show();
    this.dlg.update();
  },

  showSelectionDialog : function()
  {
    this.dlg.setData(bamboo.utils.str('bamboo.option.label.shortcut.quickselection'), true, null, null, null, null, null, false, true);
    this.dlg.show();
    this.dlg.update();
  },
  
  displayInTab : function(tab)
  {
    this.checkFirstShow();

    try
    {
      tab.appendChild(this.rootNode);
    }
    catch(ex) { }

    var ui = this;
    ui.updateTab();
    this.rootNode.focus();

    if(!bamboo.isFirefox)
    {
      var timer = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);
      timer.initWithCallback({notify: function()
      {
        ui.run('updateTab');
      }
      }, 1000, Components.interfaces.nsITimer.TYPE_ONE_SHOT);
    }
  },
  
  updateTab : function()
  {
    if(bamboo.data.all)
    {
      var news = bamboo.data.all.unreadItemCount > 0;
      var message = news ? bamboo.option.get('tab-text-unread') : bamboo.option.get('tab-text');

      message = bamboo.utils.replaceItems(message, [{target: '%U', content: bamboo.data.all.unreadItemCount},
                                                    {target: '%F', content: bamboo.data.all.favoriteUnreadItemCount}]);

      bamboo.utils.browser.run('setAllTabTitle', [message, news]);
    }
  },

  updateButtons : function()
  {
    if(bamboo.data.all)
    {
      var news = bamboo.data.all.unreadItemCount > 0;

      var state = bamboo.data.all.loading ? 'loading' : (news ? 'new' : 'normal');
      var message = news ? bamboo.option.get('button-text-unread') : bamboo.option.get('button-text');

      message = bamboo.utils.replaceItems(message, [{target: '%U', content: bamboo.data.all.unreadItemCount},
                                                    {target: '%F', content: bamboo.data.all.favoriteUnreadItemCount}]);

      bamboo.ui.toolbar.run('setAllButtonText', [message]);
      bamboo.ui.toolbar.run('setAllButtonState', [state]);
    }
  },

  openTab : function()
  {
    bamboo.utils.browser.openTab();
  },
  
  closeTab : function()
  {
    bamboo.utils.browser.closeTab();
  },
  
  show : function(event)
  {
    this.checkFirstShow();

    if(bamboo.option.get('display-mode') == 'tab' || bamboo.ui.toolbar.isButtonInPopup())
    {
      this.openTab();
    }
    else
    {
      if(this.rootNode.parentNode != null)
      {
        this.rootNode.parentNode.removeChild(this.rootNode);
      }
      var popup = bamboo.doc.getElementById(this.popupId);
      popup.appendChild(this.rootNode);

      this.closeTab();
      this.showPopup(event);
    }
    this.rootNode.focus();
  },
  
  isInTab : function()
  {
    return this.rootNode.parentNode != null && this.rootNode.parentNode.id != 'bamboo-popup';
  },
  
  setDisplayMode : function(mode)
  {
    var isTab = bamboo.option.get('display-mode') == 'tab';

    if(!isTab && this.rootNode.parentNode != null && this.rootNode.parentNode.id == 'bamboo-popup')
    {
      this.hidePopup();
    }
    if(isTab && this.rootNode.parentNode != null && this.rootNode.parentNode.id == 'bamboo-page')
    {
      this.closeTab();
    }

    bamboo.option.set('display-mode', mode);

    this.show();
  },

  getThemeColor : function()
  {
    var theme = bamboo.option.get('display-theme');
    switch (theme)
    {
      case 'darkblue':
        return 'rgb(52, 73, 94)';
      case 'bluegray':
        return 'rgb(133,155,165)';
      case 'gray':
        return 'rgb(140,140,140)';
      case 'black':
        return 'rgb(33,33,33)';
      case 'terminal':
        return '#222';
      case 'red':
        return 'rgb(135,35,8)';
      case 'purple':
        return 'rgb(80,50,100)';
      case 'green':
        return 'rgb(76,155,38)';
      case 'brown':
        return 'rgb(87,38,0)';
      case 'beige':
        return 'rgb(161,142,92)';
      case 'lightrainbow':
        return 'rgb(116,208,241)';
      case 'lightwhite':
        return 'rgb(255,255,255)';
      case 'lightgray':
        return 'rgb(237,237,237)';
      case 'lightsilver':
        return 'rgb(189,195,199)';
      case 'lightblue':
        return 'rgb(220,236,252)';
      case 'lightbeige':
        return 'rgb(222,215,190)';
      default:
        return '#4777b4';
    }
  },
  
  buildContainers : function()
  {
    // Containers

    this.rootNode = bamboo.doc.createElement('hbox');
    this.rootNode.setAttribute('flex', '1');
    this.rootNode.setAttribute('id', 'bamboo-root');

    this.setShortcuts();

    this.stack = bamboo.doc.createElement('stack');
    this.stack.setAttribute('id', 'bamboo-stack');
    this.stack.setAttribute('flex', '1');
    this.rootNode.appendChild(this.stack);

    var popup = bamboo.doc.getElementById(this.popupId);
    popup.addEventListener('popuphiding', function(event)
    {
      bamboo.ui.popupIsOpen = false;
    }, false);
    popup.addEventListener('popupshown', function(event)
    {
      bamboo.ui.popupIsOpen = true;
    }, false);

    // Area

    this.area = bamboo.doc.createElement('box');
    this.area.setAttribute('id', 'bamboo-area');
    this.area.setAttribute('flex', '1');
    this.stack.appendChild(this.area);

    this.menu = bamboo.doc.createElement('box');
    this.menu.setAttribute('class', 'bamboo-menu-area');
    this.area.appendChild(this.menu);

    this.panelArea = bamboo.doc.createElement('hbox');
    this.panelArea.setAttribute('id', 'bamboo-panel-area');
    this.panelArea.setAttribute('flex', '1');
    this.area.appendChild(this.panelArea);

    // Dialog

    this.dlg = new bamboo.ui.dialog(this.stack);
  },

  newGroup : function(parentGroupId)
  {
    var groups = bamboo.data.all.getGroupList();
    var message = bamboo.utils.str('bamboo.add.dialog.group');
    var action = bamboo.utils.str('bamboo.button.add');
    var choices = { name: { type: 'input', mandatory: true, value: '', desc: bamboo.utils.str('bamboo.edit.group.name')},
                    group: { type: 'combo', label: bamboo.utils.str('bamboo.edit.feed.group'), values: groups, value: parentGroupId}};

    bamboo.ui.showConfirmDialog(message, action, choices,
    { onValidation: function(result)
    {
      if(result.name != '')
      {
        var group = bamboo.factory.getData(result.group);

        group.addGroup(result.name, false, 0);
        group.showView();
        bamboo.data.run('saveBackup');
        bamboo.data.run('save');
      }
    }});
  },

  editSelection : function()
  {
    if(bamboo.selection)
    {
      if(bamboo.selection == bamboo.data.all)
      {
        this.editRoot();
        return;
      }
      if(bamboo.selection == bamboo.data.lib)
      {
        this.deleteLibrary();
        return;
      }
      if(bamboo.selection instanceof bamboo.data.group)
      {
        this.editGroup(bamboo.selection);
        return;
      }
      if(bamboo.selection instanceof bamboo.data.feed)
      {
        this.editFeed(bamboo.selection);
        return;
      }
    }
  },

  editFeed : function(feed)
  {
    var groups = bamboo.data.all.getGroupList();
    var message = bamboo.utils.str('bamboo.edit.feed');
    var action = bamboo.utils.str('bamboo.edit.save');
    var choices =
    {
      name: { type: 'input', mandatory: true, value: feed.name, desc: bamboo.utils.str('bamboo.edit.feed.name')},
      webpage: { type: 'input', mandatory: false, value: feed.webpage, desc: bamboo.utils.str('bamboo.edit.feed.webpage')},
      url: { type: 'input', mandatory: true, value: feed.url, desc: bamboo.utils.str('bamboo.edit.feed.url')},
      favorite: { type: 'check', checked: feed.favorite, value: bamboo.utils.str('bamboo.edit.feed.favorite')},
      group: { type: 'combo', label: bamboo.utils.str('bamboo.edit.feed.group'), values: groups, value: feed.getParent().id}
    };

    bamboo.ui.showConfirmDialog(message, action, choices,
    {
      onValidation: function(result)
      {
        feed.name = result.name;
        feed.webpage = result.webpage;
        feed.url = result.url;

        if(feed.favorite != result.favorite)
        {
          feed.toggleFavorite();
        }

        feed.updateView();
        bamboo.ui.panel.get('reader').zoneViewMenu.update();

        if(feed.getParent().id != result.group)
        {
          var targetGroup = bamboo.factory.getData(result.group);
          bamboo.ui.dd.moveFeedToGroup(feed.id, targetGroup);

          bamboo.data.run('saveBackup');
        }

        bamboo.data.save();
      },
      onSecondaryAction: function()
      {
        bamboo.ui.run('deleteFeed', [feed]);
      }
    }, bamboo.utils.str('bamboo.button.delete'));
  },

  deleteFeed : function(feed)
  {
    var action = bamboo.utils.str('bamboo.button.delete');
    var message = bamboo.utils.str('bamboo.message.confirmdeletefeed');

    bamboo.ui.run('showConfirmDialog', [message, action, null,
    { onValidation: function()
    {
      bamboo.deleteGroupOrFeed(feed, false);
    }}]);
  },

  editGroup : function(group)
  {
    var parentId = group.getParent().id;
    var groups = bamboo.data.all.getGroupList(group.id);
    var message = bamboo.utils.str('bamboo.edit.group');
    var action = bamboo.utils.str('bamboo.edit.save');
    var choices =
    {
      name: { type: 'input', mandatory: true, value: group.name, desc: bamboo.utils.str('bamboo.edit.group.name')},
      group: { type: 'combo', label: bamboo.utils.str('bamboo.edit.feed.group'), values: groups, value: parentId},
      favorite: {type: 'button', label: bamboo.utils.str('bamboo.edit.group.favorites'),
      handler: function()
      {
        bamboo.ui.run('editGroupFavorites', [group]);
      }}
    };

    bamboo.ui.showConfirmDialog(message, action, choices,
    {
      onValidation: function(result)
      {
        if(group.name != result.name || group.getParent().id != result.group)
        {
          group.name = result.name;

          if(group.getParent().id != result.group)
          {
            var targetGroup = bamboo.factory.getData(result.group);
            bamboo.ui.dd.moveGroup(group, targetGroup, 'in');

            bamboo.data.run('saveBackup');
          }

          group.updateView();
          bamboo.ui.panel.get('reader').zoneViewMenu.update();
          bamboo.data.save();
        }
      },
      onSecondaryAction: function()
      {
        bamboo.ui.run('deleteGroup', [group]);
      }
    }, bamboo.utils.str('bamboo.button.delete'));
  },

  deleteGroup : function(group)
  {
    var action = bamboo.utils.str('bamboo.button.delete');
    var message = bamboo.utils.str('bamboo.message.confirmdeletegroup');
    var choices = null;

    if(group.hasChild())
    {
      choices = { deletechildren: { type: 'radio', values: [bamboo.utils.str('bamboo.message.deletegroupandchildren'),
                                                            bamboo.utils.str('bamboo.message.deletegrouponly')]}};
    }

    bamboo.ui.run('showConfirmDialog', [message, action, choices,
    { onValidation: function(result)
    {
      var notChildren = false;
      if(result)
      {
        notChildren = result['deletechildren'] == 1;
      }
      bamboo.deleteGroupOrFeed(group, notChildren);
    }}]);
  },

  editRoot : function()
  {
    var message = bamboo.utils.str('bamboo.edit.all');
    var choices = { favorite: { type: 'button', label: bamboo.utils.str('bamboo.edit.group.favorites'), handler: function()
    {
      bamboo.ui.run('editGroupFavorites', [bamboo.data.all]);
    }}};

    bamboo.ui.showConfirmDialog(message, bamboo.utils.str('bamboo.button.delete'), choices,
    {
      onValidation: function()
      {
        bamboo.ui.run('deleteRoot');
      }
    });
  },

  deleteRoot : function()
  {
    var action = bamboo.utils.str('bamboo.button.delete');
    var message = bamboo.utils.str('bamboo.message.confirmdeleteall');

    bamboo.ui.run('showConfirmDialog', [message, action, null,
    { onValidation: function()
    {
      bamboo.deleteRoot();
    }}]);
  },

  deleteLibrary : function()
  {
    var action = bamboo.utils.str('bamboo.button.delete');
    var message = bamboo.utils.str('bamboo.message.confirmdeletelibrary');

    bamboo.ui.run('showConfirmDialog', [message, action, null,
    { onValidation: function()
    {
      bamboo.deleteLibrary();
    }}]);
  },

  editGroupFavorites : function(group)
  {
    if(group.getFeedCount() == 0)
    {
      bamboo.ui.run('showMessageDialog', [bamboo.utils.str('bamboo.message.nofeedingroup')]);
      return;
    }

    var msg = null;
    if(!group.hasFavoriteFeeds())
    {
      msg = bamboo.utils.str('bamboo.message.confirmfavoriteall2');
    }
    else if(group.hasAllFavoriteFeeds())
    {
      msg = bamboo.utils.str('bamboo.message.confirmfavoritenone2');
    }
    if(msg)
    {
      bamboo.ui.run('showConfirmDialog', [msg, bamboo.utils.str('bamboo.button.ok'), null,
      { onValidation: function()
      {
        if(group.hasFavoriteFeeds())
        {
          group.markNoneFeedsAsFavorite();
        }
        else
        {
          group.markAllFeedsAsFavorite();
        }
        bamboo.data.all.run('updateUnreadedCount');
        bamboo.ui.run('updateTab');
        bamboo.ui.run('updateButtons');
        bamboo.data.run('save');
      }}]);
    }
    else
    {
      msg = bamboo.utils.str('bamboo.message.confirmfavorite');
      var choices = { markall: { type: 'radio', values: [bamboo.utils.str('bamboo.message.confirmfavoriteall'),
                                                         bamboo.utils.str('bamboo.message.confirmfavoritenone')]}};

      bamboo.ui.run('showConfirmDialog', [msg, bamboo.utils.str('bamboo.button.ok'), choices,
      { onValidation: function(result)
      {
        if(result['markall'] == 1)
        {
          group.markNoneFeedsAsFavorite();
        }
        else
        {
          group.markAllFeedsAsFavorite();
        }
        bamboo.data.all.run('updateUnreadedCount');
        bamboo.ui.run('updateTab');
        bamboo.ui.run('updateButtons');
        bamboo.data.run('save');
      }}]);
    }
  },

  setShortcuts : function()
  {
    this.rootNode.addEventListener("mousedown", function(event)
    {
      var node = bamboo.doc.commandDispatcher.focusedElement;
      if(!node || !node.getAttribute('class') || (node.getAttribute('class').indexOf('bamboo-view-item-box') < 0 && node.getAttribute('class').indexOf('bamboo-paginator-button-') < 0))
      {
        if(!event.originalTarget || event.originalTarget.nodeName.indexOf('menuitem') < 0)
        {
          bamboo.ui.rootNode.focus();
        }
      }
    }, false);
    this.rootNode.addEventListener("click", function()
    {
      var readerPanel = bamboo.ui.panel.get('reader');
      readerPanel.zoneViewMenu.setOptionMenuVisible(false);
      readerPanel.zoneMenuPopup.hide();
    }, false);
    this.rootNode.addEventListener("keyup", function(event)
    {
      bamboo.ui.run('onKeyUp', [event]);
    }, false);
    this.rootNode.addEventListener("keydown", function(event)
    {
      bamboo.ui.run('onKeyDown', [event]);
    }, false);

    this.rootNode.addEventListener("keypress", function(event)
    {
      bamboo.ui.run('onKeyPress', [event]);
    }, false);
  },

  dispatchEventToScrollArea : function(panel, event, eventName)
  {
    var evt = bamboo.doc.createEvent("KeyboardEvent");
    evt.initKeyEvent(eventName, true, true, null, false, false, false, false, event.keyCode, event.charCode);

    var node = bamboo.doc.commandDispatcher.focusedElement;
    var mustFocus = true;
    if(node)
    {
      var cssClass = node.getAttribute('class');
      mustFocus = cssClass && cssClass.indexOf('bamboo-view-item-box') < 0 && cssClass.indexOf('bamboo-paginator-button-') < 0;
    }

    if(mustFocus)
    {
      var gap = panel.zoneViewData.scrollArea.scrollTop;
      panel.zoneViewData.scrollArea.childNodes[0].childNodes[0].focus();
      panel.zoneViewData.scrollArea.scrollTop = gap;
    }

    panel.zoneViewData.scrollArea.childNodes[0].childNodes[0].dispatchEvent(evt);
  },

  onKeyUp : function(event)
  {
    if((event.keyCode == 18 || event.keyCode == 16) && this.selectingTab)
    {
      bamboo.ui.dlg.run('onCancel');
      bamboo.ui.panel.select(bamboo.ui.panel.history[this.selectingTabCount % bamboo.ui.panel.history.length], true);

      this.selectingTab = false;
      this.selectingTabCount = 0;
      bamboo.ui.panel.updateHistory();
      bamboo.ui.rootNode.focus();
    }
    if(event.keyCode == 33 || event.keyCode == 34 || event.keyCode == 40 || event.keyCode == 38)
    {
      var panel = bamboo.ui.panel.selection;

      if((panel.name == 'reader' || panel.name == 'search') && panel.zoneViewData.scrollArea.childNodes[0].childNodes.length > 0)
      {
        this.dispatchEventToScrollArea(panel, event, 'keyup');
      }
      return;
    }
  },

  onKeyDown : function(event)
  {
    if(event.keyCode == 33 || event.keyCode == 34 || event.keyCode == 40 || event.keyCode == 38)
    {
      var panel = bamboo.ui.panel.selection;

      if((panel.name == 'reader' || panel.name == 'search') && panel.zoneViewData.scrollArea.childNodes[0].childNodes.length > 0)
      {
        this.dispatchEventToScrollArea(panel, event, 'keydown');
      }
      return;
    }
  },

  onKeyPress : function(event)
  {
    if(event.keyCode == 27 && bamboo.ui.dlg && bamboo.ui.dlg.built)
    {
      bamboo.ui.dlg.run('onCancel');
      event.preventDefault();
      return;
    }

    var command = null;

    if((event.keyCode == 9 || event.charCode == 116 || event.charCode == 8224 || event.charCode == 8482) && event.altKey && (this.selectingTab || !bamboo.ui.dlg.container || bamboo.ui.dlg.container.getAttribute('dialog') != 'true'))
    {
      event.stopPropagation();
      event.preventDefault();

      this.selectingTab = true;
      this.selectingTabCount += event.shiftKey ? -1 : 1;
      if(this.selectingTabCount < 0)
      {
        this.selectingTabCount = bamboo.ui.panel.history.length - 1;
      }

      bamboo.ui.showTabDialog();

      return;
    }
    if(bamboo.ui.panel.selection.name == 'reader' && ((event.ctrlKey && event.charCode == 32) || (event.charCode == 160 && event.altKey)) && (!bamboo.ui.dlg.container || bamboo.ui.dlg.container.getAttribute('dialog') != 'true'))
    {
      event.stopPropagation();
      event.preventDefault();

      bamboo.ui.run('showSelectionDialog');

      return;
    }

    if(event.keyCode == 33 || event.keyCode == 34 || event.keyCode == 40 || event.keyCode == 38)
    {
      var panel = bamboo.ui.panel.selection;

      if((panel.name == 'reader' || panel.name == 'search') && panel.zoneViewData.scrollArea.childNodes[0].childNodes.length > 0)
      {
        this.dispatchEventToScrollArea(panel, event, 'keypress');
      }
      return;
    }

    if((event.metaKey || event.ctrlKey) && event.charCode == 102)
    {
      command = 'Search';
    }

    if(!command && event.keyCode == 39)
    {
      command = 'FocusNext';
      if(event.ctrlKey)
      {
        command = event.shiftKey ? 'PageLast' : 'PageNext';
      }
    }
    if(!command && event.keyCode == 37)
    {
      command = 'FocusPrevious';
      if(event.ctrlKey)
      {
        command = event.shiftKey ? 'PageFirst' : 'PagePrevious';
      }
    }
    if(!command && event.keyCode == 46)
    {
      command = event.ctrlKey ? 'MarkAll' : 'MarkFirstItem';
    }
    if(!command && event.keyCode == 13)
    {
      command = 'OpenFirstUnreadItem';

      if(event.ctrlKey)
      {
        command = event.shiftKey ? 'OpenAllUnread' : 'OpenFirstUnreadItemInBack';
      }
    }

    if(!command && event.altKey)
    {
      switch (event.charCode)
      {
        case 114: // R
        case 174: // R
          command = 'Update';
          break;
        case 97: // A
        case 230: // A
          command = 'SelectAll';
          break;
        case 101: // E
        case 234: // E
          command = 'ExpandTree';
          break;
        case 102: // F
        case 402: // F
          command = 'SelectFav';
          break;
        case 120: // X
        case 8776: // X
          command = 'FilterUnread';
          break;
        case 122: // Z
        case 194: // Z
          command = 'FilterTree';
          break;
        case 99: // C
        case 169: // C
          command = 'DisplayContent';
          break;
        default:
          break;
      }
    }

    if(command)
    {
      event.stopPropagation();
      event.preventDefault();

      bamboo.ui.run("onCommand" + command);
    }
/*
    else
    {
       bamboo.utils.error.log("keyCode " + event.keyCode);
       bamboo.utils.error.log("charCode " + event.charCode);
       bamboo.utils.error.log("altKey " + event.altKey);
       bamboo.utils.error.log("ctrlKey " + event.ctrlKey);
       bamboo.utils.error.log("metaKey " + event.metaKey);
       bamboo.utils.error.log("shiftKey " + event.shiftKey);
    }
*/
  },

  onCommandExpandTree : function()
  {
    var panel = bamboo.ui.panel.selection;

    if(panel.name == 'reader')
    {
      var open = bamboo.data.all.hasCollapsedGroup();

      bamboo.data.all.setOpen(open);
    }
  },

  onCommandSearch : function()
  {
    var panel = bamboo.ui.panel.selection;

    if(panel.name == 'reader')
    {
      panel.zoneViewMenu.search.focusInput();
    }
    else if(panel.name == 'search')
    {
      panel.zoneViewMenu.input.focus();
    }
  },

  onCommandSelectAll : function()
  {
    var panel = bamboo.ui.panel.selection;

    if(panel.name == 'reader')
    {
      bamboo.selectItem(bamboo.data.all);
      bamboo.data.all.getView().focus();
    }
    else if(panel.name == 'search')
    {
      bamboo.selectSearchItem(bamboo.data.found);
      bamboo.data.found.getView().focus();
    }
  },
  
  onCommandSelectFav : function()
  {
    var panel = bamboo.ui.panel.selection;

    if(panel.name == 'reader')
    {
      this.hideTooltip();

      var isFav = bamboo.option.get('filter-favorite') == 'true';
      bamboo.data.page.run('activateFilter', ['favorite', !isFav]);
      bamboo.option.set('filter-favorite', isFav ? 'false' : 'true');
      panel.zoneViewMenu.update();
      bamboo.ui.rootNode.focus();
    }
  },
  
  onCommandFilterUnread : function()
  {
    var panel = bamboo.ui.panel.selection;

    if(panel.name == 'reader')
    {
      this.hideTooltip();

      var isNew = bamboo.option.get('filter-new') == 'true';
      bamboo.data.page.run('activateFilter', ['new', !isNew]);
      bamboo.option.set('filter-new', isNew ? 'false' : 'true');
      panel.zoneViewMenu.update();
      bamboo.ui.rootNode.focus();
    }
  },

  onCommandFilterTree : function()
  {
    var panel = bamboo.ui.panel.selection;

    if(panel.name == 'reader')
    {
      this.hideTooltip();

      var active = bamboo.option.get('apply-filter-tree') == 'true';
      bamboo.option.set('apply-filter-tree', active ? 'false' : 'true');
      bamboo.ui.applyOptions();

      if(!active)
      {
        bamboo.data.all.run('updateVisibleItemsCount');
      }

      bamboo.ui.rootNode.focus();
    }
  },

  onCommandDisplayContent : function()
  {
    var panel = bamboo.ui.panel.selection;

    if(panel.name == 'reader' || panel.name == 'search')
    {
      this.hideTooltip();

      this.setContentMode(bamboo.option.get('content-mode') != 'true');
      panel.zoneViewMenu.update();
      bamboo.ui.rootNode.focus();
    }
  },

  onCommandUpdate : function()
  {
    var panel = bamboo.ui.panel.selection;

    if(panel.name == 'reader' && bamboo.selection && !bamboo.selection.loading)
    {
      bamboo.selection.run('update');
    }
  },
  
  onCommandMarkFirstItem : function()
  {
    var panel = bamboo.ui.panel.selection;

    if(panel.name == 'reader' || panel.name == 'search')
    {
      bamboo.data.page.markFirstAsRead();
      this.hideTooltip();
      bamboo.ui.rootNode.focus();
    }
  },
  
  onCommandMarkAll : function()
  {
    var panel = bamboo.ui.panel.selection;

    if((panel.name == 'reader' && bamboo.selection) || (panel.name == 'search' && bamboo.searchSelection))
    {
      var isSearch = panel.name == 'search';

      if(isSearch)
      {
        bamboo.searchSelection.run('markAsReaded');
        panel.zoneViewMenu.update();
        bamboo.data.searchPage.updateView();
      }
      else
      {
        bamboo.selection.run('markAsReaded');
        panel.zoneViewMenu.update();
        bamboo.data.page.updateView();
        bamboo.data.run('save');

        if(bamboo.data.page.getFilterByName('new').active)
        {
          bamboo.selectItem(bamboo.selection);
        }
      }

      this.hideTooltip();
      bamboo.ui.rootNode.focus();
    }
  },
  
  onCommandOpenFirstUnreadItem : function()
  {
    var panel = bamboo.ui.panel.selection;

    if(panel.name == 'reader')
    {
      bamboo.data.page.openFirstUnread(false);
      this.hideTooltip();
    }
    else if(panel.name == 'search')
    {
      bamboo.data.searchPage.openFirstUnread(false);
      this.hideTooltip();
    }
  },
  
  onCommandOpenFirstUnreadItemInBack : function()
  {
    var panel = bamboo.ui.panel.selection;

    if(panel.name == 'reader')
    {
      bamboo.data.page.openFirstUnread(true);
      this.hideTooltip();
      bamboo.ui.rootNode.focus();
    }
    else if(panel.name == 'search')
    {
      bamboo.data.searchPage.openFirstUnread(true);
      this.hideTooltip();
      bamboo.ui.rootNode.focus();
    }
  },
  
  onCommandOpenAllUnread : function()
  {
    var panel = bamboo.ui.panel.selection;

    if(panel.name == 'reader' && bamboo.selection)
    {
      var limit = Number(bamboo.option.get('max-tab-open-count'));
      if(!limit)
      {
        limit = 10;
      }
      if(limit < 5)
      {
        limit = 5;
      }

      if(bamboo.selection.unreadItemCount > limit)
      {
        var message = bamboo.utils.str('bamboo.message.confirmdeletefirst');
        var action = bamboo.utils.str('bamboo.button.ok');

        message = bamboo.utils.replaceItems(message, [{target: '%count%', content: limit}]);

        var values = [5, 10, 15, 20, 30];
        var initIndex = values.indexOf(limit);
        if(initIndex < 0)
        {
          initIndex = 1;
        }

        var choices = { labelUnread: { type: 'label', value: bamboo.utils.str('bamboo.message.changemaxopentabcount')},
                        tabLimit: { type: 'radio', isHorizontal: true, initValue: initIndex, values: values}};

        bamboo.ui.run('showConfirmDialog', [message, action, choices,
        { onValidation: function(result)
        {
          if(Number(result.tabLimit != initIndex))
          {
            bamboo.option.set('max-tab-open-count', values[result.tabLimit]);
          }
          bamboo.ui.doCommandOpenAllUnread();
          bamboo.ui.hideTooltip();
          bamboo.ui.rootNode.focus();
        }}]);
      }
      else
      {
        this.doCommandOpenAllUnread();
        bamboo.ui.rootNode.focus();
      }
    }
  },
  
  doCommandOpenAllUnread : function()
  {
    var panel = bamboo.ui.panel.selection;

    if(panel.name == 'reader')
    {
      bamboo.data.page.openUnread();
      this.hideTooltip();
    }
    else if(panel.name == 'search')
    {
      bamboo.data.searchPage.openUnread();
      this.hideTooltip();
    }
  },
  
  
  getPaginator : function()
  {
    var panel = bamboo.ui.panel.selection;
    var pager = null;

    if(panel.name == 'reader')
    {
      pager = bamboo.data.page;
    }
    else if(panel.name == 'search')
    {
      pager = bamboo.data.searchPage;
    }

    return pager;
  },

  onCommandFocusPrevious : function()
  {
    var panel = bamboo.ui.panel.selection;

    if(panel.name == 'reader' || panel.name == 'search')
    {
      panel.zoneViewData.focusPrevious();
    }
  },

  onCommandFocusNext : function()
  {
    var panel = bamboo.ui.panel.selection;

    if(panel.name == 'reader' || panel.name == 'search')
    {
      panel.zoneViewData.focusNext();
    }
  },

  onCommandFocusFirst : function()
  {
    var panel = bamboo.ui.panel.selection;

    if(panel.name == 'reader' || panel.name == 'search')
    {
      panel.zoneViewData.focusFirst();
    }
  },

  onCommandPagePrevious : function()
  {
    var pager = this.getPaginator();

    if(pager)
    {
      pager.run('pageDown');
      bamboo.ui.rootNode.focus();
    }
  },
  
  onCommandPageNext : function()
  {
    var pager = this.getPaginator();

    if(pager)
    {
      pager.run('pageUp');
      bamboo.ui.rootNode.focus();
    }
  },
  
  onCommandPageDown : function()
  {
    var panel = bamboo.ui.panel.selection;

    if(panel.name == 'reader' || panel.name == 'search')
    {
      panel.zoneViewData.scrollToNext();
    }
  },
  
  onCommandPageUp : function()
  {
    var panel = bamboo.ui.panel.selection;

    if(panel.name == 'reader' || panel.name == 'search')
    {
      panel.zoneViewData.scrollToPrevious();
    }
  },
  
  onCommandPageFirst : function()
  {
    var pager = this.getPaginator();

    if(pager)
    {
      pager.run('pageFirst');
    }
  },
  
  onCommandPageLast : function()
  {
    var pager = this.getPaginator();

    if(pager)
    {
      pager.run('pageLast');
    }
  }
};
