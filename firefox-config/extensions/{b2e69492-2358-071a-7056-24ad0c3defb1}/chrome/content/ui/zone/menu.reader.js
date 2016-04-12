
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.ui.zone.menu.reader = function(target)
{
  bamboo.ui.component.call(this, target);

  this.labelTitle = null;
  this.labelEdit = null;
  this.labelUnread = null;
  this.linkNode = null;
  this.tag = null;
  this.subMenu = null;
  this.search = null;
  this.labelSearchType = null;
  this.radioDisplayDensity = null;

  this.btnUpdate = null;
  this.btnExport = null;
  this.btnMark = null;
  this.btnOpen = null;
};

bamboo.extend(bamboo.ui.zone.menu.reader, bamboo.ui.component);

bamboo.ui.zone.menu.reader.prototype.build = function()
{
  var view = this;

  var menu = bamboo.doc.createElement('hbox');
  menu.setAttribute('class', 'bamboo-zone-view-menu');
  this.container.appendChild(menu);

  this.labelTitle = bamboo.doc.createElement('html:div');
  this.labelTitle.setAttribute('class', 'bamboo-zone-view-menu-title bamboo-font-light');
  this.labelTitle.setAttribute('type', 'content');
  this.labelTitle.setAttribute('flex', '1');
  menu.appendChild(this.labelTitle);
  var labelTitle = bamboo.doc.createElement('html:p');
  this.labelTitle = this.labelTitle.appendChild(labelTitle);
  this.labelTitle.setAttribute('class', 'bamboo-zone-view-menu-title-span');
  this.labelTitle.addEventListener('click', function()
  {
    bamboo.ui.run('editSelection');
  }, false);
  this.labelEdit = bamboo.doc.createElement('html:span');
  this.labelEdit.setAttribute('class', 'bamboo-zone-view-menu-title-span-edit');

  this.subMenu = bamboo.doc.createElement('hbox');
  this.subMenu.setAttribute('class', 'bamboo-zone-view-submenu');
  this.container.appendChild(this.subMenu);

  this.labelUnread = bamboo.doc.createElement('label');
  this.labelUnread.setAttribute('class', 'bamboo-zone-view-menu-unread');
  this.subMenu.appendChild(this.labelUnread);

  var imgBox = bamboo.doc.createElement('vbox');
  this.subMenu.appendChild(imgBox);

  var img = bamboo.doc.createElement('image');
  img.setAttribute('class', 'bamboo-view-item-icon bamboo-zone-view-menu-link-icon');
  imgBox.appendChild(img);

  imgBox = bamboo.doc.createElement('vbox');
  this.subMenu.appendChild(imgBox);

  this.tag = bamboo.doc.createElement('image');
  this.tag.setAttribute('class', 'bamboo-view-item-icon bamboo-zone-view-menu-link-icon');
  imgBox.appendChild(this.tag);

  var handlerAdvancedSearch = function()
  {
    view.search.run('setAdvanced', [!view.search.advanced]);
    view.run('update');
  };

  this.labelSearchType = bamboo.doc.createElement('label');
  this.labelSearchType.setAttribute('class', 'bamboo-zone-view-menu-link-search');
  this.labelSearchType.addEventListener("click", handlerAdvancedSearch, false);
  this.labelSearchType.addEventListener("keypress", function(event)
  {
    if(event.keyCode == 13 || event.charCode == 32)
    {
      handlerAdvancedSearch();

      event.stopPropagation();
      event.preventDefault();
    }
  }, false);
  this.subMenu.appendChild(this.labelSearchType);

  this.divLink = bamboo.doc.createElement('html:div');
  this.divLink.setAttribute('class', 'bamboo-zone-view-menu-link');
  this.divLink.setAttribute('type', 'content');
  this.subMenu.appendChild(this.divLink);

  this.linkNode = bamboo.doc.createElementNS("http://www.w3.org/1999/xhtml", 'a');
  this.linkNode.setAttribute('class', 'bamboo-focusable');
  this.linkNode.addEventListener("click", function(event)
  {
    if(!bamboo.ui.isInTab() || bamboo.option.get('force-tab-in-background') == 'true')
    {
      event.stopPropagation();
      event.preventDefault();

      if(event.button < 2)
      {
        view.run('openLink', [this.getAttribute('href'), event.button == 1]);
      }
    }
    else if(!bamboo.isFirefox && bamboo.option.get('thunderbird-link-in-tab') == 'true')
    {
      event.stopPropagation();
      event.preventDefault();

      view.run('openLink', [this.getAttribute('href'), event.button == 1]);
    }
  }, false);
  this.linkNode.addEventListener("mouseup", function(event)
  {
    if(!bamboo.ui.isInTab() && event.button == 1)
    {
      event.stopPropagation();
      event.preventDefault();

      view.run('openLink', [this.getAttribute('href'), true]);
    }
  }, false);
  this.linkNode.addEventListener("keypress", function(event)
  {
    if(event.keyCode == 13 || event.charCode == 32)
    {
      event.stopPropagation();
      event.preventDefault();

      view.run('openLink', [this.getAttribute('href'), event.ctrlKey]);
    }
  }, false);
  this.divLink.appendChild(this.linkNode);

  this.btnUpdate = bamboo.utils.ui.addMenuButton(menu, bamboo.utils.str('bamboo.button.update'), 'bamboo-view-menu-button-icon-update', function()
  {
    bamboo.ui.run('onCommandUpdate');
  });

  this.btnExport = bamboo.utils.ui.addMenuButton(menu, bamboo.utils.str('bamboo.button.export'), 'bamboo-view-menu-button-icon-export', function()
  {
    view.run('onExport');
  });

  this.btnMark = bamboo.utils.ui.addMenuButton(menu, bamboo.utils.str('bamboo.button.mark'), 'bamboo-view-menu-button-icon-mark', function()
  {
    bamboo.ui.run('onCommandMarkAll');
  });

  this.btnOpen = bamboo.utils.ui.addMenuButton(menu, bamboo.utils.str('bamboo.button.openunread'), 'bamboo-view-menu-button-icon-open', function()
  {
    bamboo.ui.run('onCommandOpenAllUnread');
  });

  bamboo.utils.ui.addSpacer(menu, false, true, true);

  bamboo.utils.ui.addMenuButton(menu, bamboo.utils.str('bamboo.menu.option.label'), 'bamboo-view-menu-button-icon-option', function(event)
  {
    if(event)
    {
      event.stopPropagation();
    }

    view.run('toggleOptionMenu');
  }, true);

  this.optionMenu = bamboo.doc.createElement('vbox');
  this.optionMenu.setAttribute('class', 'bamboo-zone-view-menu-option');
  this.optionMenu.addEventListener("click", function(event)
  {
    event.stopPropagation();
    event.preventDefault();
  }, false);
  menu.appendChild(this.optionMenu);

  var optionContainer = bamboo.doc.createElement('vbox');
  optionContainer.setAttribute('class', 'bamboo-zone-view-menu-option-box');
  this.optionMenu.appendChild(optionContainer);

  var label = bamboo.doc.createElement('label');
  label.setAttribute('class', 'bamboo-label bamboo-label-bold');
  label.setAttribute('value', bamboo.utils.str('bamboo.menu.filter.label'));
  optionContainer.appendChild(label);

  var checked = bamboo.option.get('filter-new') == 'true';
  this.checkboxFilterUnread = bamboo.utils.ui.createCheckbox(bamboo.utils.str('bamboo.menu.filterundread.label'), checked, function(checked)
  {
    bamboo.option.set('filter-new', checked ? 'true' : 'false');
    bamboo.data.page.run('activateFilter', ['new', checked]);
  });
  optionContainer.appendChild(this.checkboxFilterUnread);

  checked = bamboo.option.get('filter-favorite') == 'true';
  this.checkboxFilterFavorite = bamboo.utils.ui.createCheckbox(bamboo.utils.str('bamboo.menu.filterfavorite.label'), checked, function(checked)
  {
    bamboo.option.set('filter-favorite',  checked ? 'true' : 'false');
    bamboo.data.page.run('activateFilter', ['favorite', checked]);
  });
  optionContainer.appendChild(this.checkboxFilterFavorite);

  checked = bamboo.option.get('apply-filter-tree') == 'true';
  this.checkboxFilterTree = bamboo.utils.ui.createCheckbox(bamboo.utils.str('bamboo.menu.filtertree.label'), checked, function(checked)
  {
    bamboo.option.set('apply-filter-tree', checked ? 'true' : 'false');
    bamboo.ui.run('applyOptions');

    if(checked)
    {
      bamboo.data.all.run('updateVisibleItemsCount');
    }
  });
  optionContainer.appendChild(this.checkboxFilterTree);

  label = bamboo.doc.createElement('label');
  label.setAttribute('class', 'bamboo-label bamboo-label-bold');
  label.setAttribute('value', bamboo.utils.str('bamboo.menu.display.label'));
  optionContainer.appendChild(label);

  checked = bamboo.option.get('content-mode') == 'true';
  this.checkboxContentMode = bamboo.utils.ui.createCheckbox(bamboo.utils.str('bamboo.menu.content.label'), checked, function(checked)
  {
    bamboo.ui.run('setContentMode', [checked]);
  });
  optionContainer.appendChild(this.checkboxContentMode);

  checked = bamboo.option.get('use-ads-blocker') == 'true';
  this.checkboxAdsBlocker = bamboo.utils.ui.createCheckbox(bamboo.utils.str('bamboo.button.adsblocker'), checked, function(checked)
  {
    view.run('activateAdsBlocker', [checked]);
  });
  optionContainer.appendChild(this.checkboxAdsBlocker);

  label = bamboo.doc.createElement('label');
  label.setAttribute('class', 'bamboo-label bamboo-label-bold');
  label.setAttribute('value', bamboo.utils.str('bamboo.menu.displaydensity.label'));
  optionContainer.appendChild(label);

  this.radioDisplayDensity = bamboo.utils.ui.createRadioGroup([{label: bamboo.utils.str('bamboo.menu.displaydensity.comfortable'), value: 'comfortable', tooltip: null},
                                                              {label: bamboo.utils.str('bamboo.menu.displaydensity.cosy'), value: 'default', tooltip: null},
                                                              {label: bamboo.utils.str('bamboo.menu.displaydensity.compact'), value: 'compact', tooltip: null}],
    bamboo.option.get('display-density'), true,
    function(value)
    {
      bamboo.option.run('set', ['display-density', value]);
      bamboo.ui.run('applyOptions');
    });
  optionContainer.appendChild(this.radioDisplayDensity);

  bamboo.utils.ui.addSpacer(this.subMenu, false, false);

  this.search = new bamboo.ui.zone.menu.readerSearch(this);
  this.search.build();

  this.update();

  return menu;
};

bamboo.ui.zone.menu.reader.prototype.activateAdsBlocker = function(checked)
{
  bamboo.option.run('set', ['use-ads-blocker', checked ? 'true' : 'false']);
  bamboo.ui.panel.get('reader').zoneViewMenu.update();
  bamboo.ui.panel.get('option').updateUseAdsBlocker();
  bamboo.run('selectItem', [bamboo.selection]);
};

bamboo.ui.zone.menu.reader.prototype.update = function()
{
  var view = this;
  var name = bamboo.selection ? bamboo.selection.name : '';

  this.labelEdit.textContent = bamboo.utils.str('bamboo.button.edit') + ' - ' + bamboo.utils.str('bamboo.button.delete');

  if(bamboo.selection == bamboo.data.all)
  {
    name = bamboo.utils.str('bamboo.all');
  }
  else if(bamboo.selection == bamboo.data.lib)
  {
    name = bamboo.utils.str('bamboo.library');

    this.labelEdit.textContent = bamboo.utils.str('bamboo.button.delete');
  }

  if(this.search.active)
  {
    name = bamboo.utils.str('bamboo.menu.search.into.label').replace('%name%', name);
  }

  this.labelTitle.textContent = name;
  this.labelTitle.appendChild(this.labelEdit);
  this.labelSearchType.setAttribute('value', bamboo.utils.str(this.search.advanced ? 'bamboo.menu.search.simple' : 'bamboo.menu.search.advanced'));
  this.tag.setAttribute('src', '');

  if(this.search.active)
  {
    var cssClass = 'bamboo-view-item-icon bamboo-zone-view-menu-link-icon';
    cssClass += this.search.advanced ? ' bamboo-zone-view-menu-icon-search-simple' : ' bamboo-zone-view-menu-icon-search-advanced';
    this.tag.setAttribute('class', cssClass);
  }
  else
  {
    this.tag.setAttribute('class', 'bamboo-view-item-icon bamboo-zone-view-menu-link-icon');

    if(bamboo.selection instanceof bamboo.data.feed && bamboo.selection.webpage)
    {
      var targetURLs = [];
      if(bamboo.selection.webpage)
      {
        targetURLs.push(bamboo.selection.webpage);
      }
      if(bamboo.selection.items.length > 0)
      {
        targetURLs.push(bamboo.selection.items[0].url);
      }
      targetURLs.push(bamboo.selection.url);

      bamboo.utils.getIconFromUrl(targetURLs, function(source)
      {
        try
        {
          if(source)
          {
            view.tag.setAttribute('src', source);
          }
          else if(bamboo.option.get('recover-icons') == 'true')
          {
            var url = bamboo.selection.url;
            if(bamboo.selection.items.length > 0)
            {
              url = bamboo.selection.items[0].url;
            }
            else if(bamboo.selection.webpage)
            {
              url = bamboo.selection.webpage;
            }
            view.tag.setAttribute('src', 'http://www.google.com/s2/favicons?domain_url=' + encodeURIComponent(url));
          }
        }
        catch(ex) {}
      });

      this.linkNode.setAttribute('href', bamboo.utils.clearString(bamboo.selection.webpage));
      this.linkNode.setAttribute('target', bamboo.option.get('force-new-tab') == 'true' ? '_blank' : '_self');
      this.linkNode.textContent = encodeURI(bamboo.utils.getWebsiteHostFromUrl(bamboo.selection.webpage));
    }
    else
    {
      this.linkNode.setAttribute('href', '');
      this.linkNode.textContent = '';
    }
  }

  var unreadItemCount = bamboo.selection ? bamboo.selection.unreadItemCount : 0;
  var news = unreadItemCount > 0;
  var isLib = bamboo.selection == bamboo.data.lib;

  this.subMenu.setAttribute('searching', this.search.active);
  this.btnUpdate.setAttribute('hidden', isLib);
  this.btnExport.setAttribute('hidden', !isLib);
  this.btnUpdate.setAttribute('active', bamboo.selection && !bamboo.selection.loading);
  this.btnExport.setAttribute('active', bamboo.selection && bamboo.selection.items && bamboo.selection.items.length);
  this.btnMark.setAttribute('active', news);
  this.btnOpen.setAttribute('active', news);
  this.checkboxFilterUnread.setAttribute('bamboo-checked', bamboo.option.get('filter-new'));
  this.checkboxFilterFavorite.setAttribute('bamboo-checked', bamboo.option.get('filter-favorite'));
  this.checkboxContentMode.setAttribute('bamboo-checked', bamboo.option.get('content-mode'));
  this.checkboxAdsBlocker.setAttribute('bamboo-checked', bamboo.option.get('use-ads-blocker'));
  this.checkboxFilterTree.setAttribute('bamboo-checked', bamboo.option.get('apply-filter-tree'));

  this.btnOpen.setAttribute('tooltiptext', bamboo.utils.str('bamboo.button.openunread') + ' (' + unreadItemCount + ')');

  this.updateLabelUnread();
};

bamboo.ui.zone.menu.reader.prototype.updateLabelUnread = function()
{
  var label = '';

  if(this.search.active)
  {
    if(bamboo.data.page.itemCount > 1)
    {
      label = bamboo.utils.str('bamboo.menu.search.result');
      label = label.replace('%count%', bamboo.data.page.itemCount);
    }
    else
    {
      label = bamboo.utils.str(bamboo.data.page.itemCount >  0 ? 'bamboo.menu.search.oneresult' : 'bamboo.menu.search.noresult');
    }
  }
  else
  {
    if(bamboo.selection)
    {
      if(bamboo.selection.unreadItemCount > 0)
      {
        if(bamboo.selection.unreadItemCount > 1)
        {
          label = bamboo.utils.str('bamboo.menu.unread.label');
          label = label.replace('%count%', bamboo.selection.unreadItemCount);
        }
        else
        {
          label = bamboo.utils.str('bamboo.menu.unread.one.label');
        }
      }
      else
      {
        label = bamboo.utils.str('bamboo.menu.unread.none.label');
      }
    }
  }

  this.labelUnread.setAttribute('value', label);
};

bamboo.ui.zone.menu.reader.prototype.toggleOptionMenu = function()
{
  var visible = this.container.getAttribute('option-menu-open') == 'true';
  this.setOptionMenuVisible(!visible);
};

bamboo.ui.zone.menu.reader.prototype.setOptionMenuVisible = function(visible)
{
  this.container.setAttribute('option-menu-open', visible);
};

bamboo.ui.zone.menu.reader.prototype.openLink = function(url, newTab)
{
  if(!newTab && bamboo.option.get('force-tab-in-background') != 'true')
  {
    bamboo.ui.hidePopup();
  }

  bamboo.utils.browser.openLink(url, newTab);

  if((newTab || bamboo.option.get('force-tab-in-background') == 'true') && bamboo.ui.isInTab())
  {
    bamboo.ui.openTab();
  }
};

bamboo.ui.zone.menu.reader.prototype.onExport = function()
{
  var menu = this;
  var msg = bamboo.utils.str('bamboo.message.exportsavedarticles');
  var choices = { format: { type: 'radio', values: [bamboo.utils.str('bamboo.message.exporttypehtmlpage'),
                                                    bamboo.utils.str('bamboo.message.exporttypehtmlbookmarks')]},
                  filter: { type: 'radio', values: [bamboo.utils.str('bamboo.message.exportfilterall'),
                                                    bamboo.utils.str('bamboo.message.exportfilterunread'),
                                                    bamboo.utils.str('bamboo.message.exportfiltertoday'),
                                                    bamboo.utils.str('bamboo.message.exportfilterweek')]}};

  bamboo.ui.run('showConfirmDialog', [msg, bamboo.utils.str('bamboo.button.ok'), choices,
  { onValidation: function(result)
  {
    menu.run('export', [result['format'], result['filter']]);
  }}]);
};

bamboo.ui.zone.menu.reader.prototype.export = function(type, filter)
{
  var articles = bamboo.data.lib.getItems(filter);

  if(articles.length == 0)
  {
    bamboo.ui.showMessageDialog(bamboo.utils.str('bamboo.message.noarticletoexport'));
  }
  else
  {
    bamboo.ui.hidePopup();

    var nsIFilePicker = Components.interfaces.nsIFilePicker;
    var dialog = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    dialog.init(bamboo.win, bamboo.utils.str('bamboo.export.browse'), nsIFilePicker.modeSave);
    dialog.appendFilter("HTML File","*.html");

    var res = dialog.show();
    if (res == nsIFilePicker.returnOK || res == nsIFilePicker.returnReplace)
    {
      var dataFile = dialog.file;
      var dataFilePath = dataFile.path;

      if(dataFilePath.substr(dataFilePath.length-5) != '.html')
      {
        dataFilePath += '.html';
      }

      this.saveHTML(dataFilePath, articles, type);
    }
  }
};

bamboo.ui.zone.menu.reader.prototype.saveHTML = function(dataFilePath, items, type)
{
  var dataString = type == 0 ? bamboo.utils.export.getPageHTML(items) : bamboo.utils.export.getBookmarksHTML(items);

  bamboo.utils.io.writeToPath(dataFilePath, dataString);

  bamboo.ui.showPopup();
  bamboo.ui.run('showMessageDialog', [bamboo.utils.str('bamboo.export.done')]);
};
