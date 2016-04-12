
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.ui.panel.option = function()
{
  bamboo.ui.panel.base.call(this, 'option', bamboo.utils.str('bamboo.menu.option.label'), false);

  this.labelTitle = null;
  this.checkAutoUpdate = null;
  this.checkUpdateOnlyFavorite = null;
  this.checkNotificationsOnlyAuto = null;
  this.checkInitUpdate = null;
  this.checkUseAdsBlocker = null;
  this.labelDataFilesLocation = null;
  this.titleReader = null;
  this.titleDisplay = null;
  this.titleUpdate = null;
  this.titleNotifications = null;
  this.titleSharing = null;
  this.titleShortcuts = null;
  this.titleData = null;
  this.contentReader = null;
  this.contentDisplay = null;
  this.contentUpdate = null;
  this.contentNotifications = null;
  this.contentSharing = null;
  this.contentShortcuts = null;
  this.contentData = null;
};

bamboo.extend(bamboo.ui.panel.option, bamboo.ui.panel.base);

bamboo.ui.panel.option.prototype.selectTab = function(tabName)
{
  this.labelTitle.textContent = bamboo.utils.str('bamboo.option.group.' + tabName);

  this.titleReader.setAttribute('selected', tabName == 'reader');
  this.titleDisplay.setAttribute('selected', tabName == 'display');
  this.titleUpdate.setAttribute('selected', tabName == 'updates');
  this.titleNotifications.setAttribute('selected', tabName == 'notifications');
  this.titleSharing.setAttribute('selected', tabName == 'sharing');
  this.titleShortcuts.setAttribute('selected', tabName == 'shortcuts');
  this.titleData.setAttribute('selected', tabName == 'data');
  this.contentReader.setAttribute('selected', tabName == 'reader');
  this.contentDisplay.setAttribute('selected', tabName == 'display');
  this.contentUpdate.setAttribute('selected', tabName == 'updates');
  this.contentNotifications.setAttribute('selected', tabName == 'notifications');
  this.contentSharing.setAttribute('selected', tabName == 'sharing');
  this.contentShortcuts.setAttribute('selected', tabName == 'shortcuts');
  this.contentData.setAttribute('selected', tabName == 'data');
};

bamboo.ui.panel.option.prototype.build = function()
{
  var u = bamboo.utils;

  // Titles
  var titleContainer = bamboo.doc.createElement('vbox');
  titleContainer.setAttribute('class', 'bamboo-zone-tree bamboo-zone-tree-option');
  this.container.appendChild(titleContainer);

  var titleContainer2 = bamboo.doc.createElement('vbox');
  titleContainer2.setAttribute('class', 'bamboo-zone-tree-header ');
  titleContainer.appendChild(titleContainer2);

  var optionPanel = this;

  this.titleReader = this.addGroupBoxTitle(titleContainer2, u.str('bamboo.option.group.reader'), function() { optionPanel.selectTab('reader'); });
  this.titleDisplay = this.addGroupBoxTitle(titleContainer2, u.str('bamboo.option.group.display'), function() { optionPanel.selectTab('display'); });
  this.titleUpdate = this.addGroupBoxTitle(titleContainer2, u.str('bamboo.option.group.updates'), function() { optionPanel.selectTab('updates'); });
  this.titleNotifications = this.addGroupBoxTitle(titleContainer2, u.str('bamboo.option.group.notifications'), function() { optionPanel.selectTab('notifications'); });
  this.titleSharing = this.addGroupBoxTitle(titleContainer2, u.str('bamboo.option.group.sharing'), function() { optionPanel.selectTab('sharing'); });
  this.titleData = this.addGroupBoxTitle(titleContainer2, u.str('bamboo.option.group.data'), function() { optionPanel.selectTab('data'); });
  this.titleShortcuts = this.addGroupBoxTitle(titleContainer2, u.str('bamboo.option.group.shortcuts'), function() { optionPanel.selectTab('shortcuts'); });

  var zoneView = bamboo.doc.createElement('vbox');
  zoneView.setAttribute('flex', '1');
  zoneView.setAttribute('class', 'bamboo-zone-view');
  this.container.appendChild(zoneView);

  var menuContainer = bamboo.doc.createElement('hbox');
  menuContainer.setAttribute('class', 'bamboo-zone-view-menu');
  zoneView.appendChild(menuContainer);

  this.labelTitle = bamboo.doc.createElement('html:div');
  this.labelTitle.setAttribute('class', 'bamboo-zone-view-menu-title bamboo-font-light');
  this.labelTitle.setAttribute('type', 'content');
  this.labelTitle.setAttribute('flex', '1');
  menuContainer.appendChild(this.labelTitle);

  var contentContainer = bamboo.doc.createElement('vbox');
  contentContainer.setAttribute('flex', '1');
  contentContainer.setAttribute('class', 'bamboo-zone-view-data');
  zoneView.appendChild(contentContainer);

  // Reader options
  this.contentReader = this.addGroupBox(contentContainer);
  var checkbox;
  var checked;
  var label;

  if(bamboo.isFirefox)
  {
    checked = bamboo.option.get('force-new-tab') == 'true';
    label = u.str('bamboo.option.check.alwaysnewtab');
    checkbox = bamboo.utils.ui.createCheckbox(label, checked, function(checked)
    {
      bamboo.option.run('set', ['force-new-tab', checked ? 'true' : 'false']);

      bamboo.run('selectItem', [bamboo.selection]);
    });
    this.contentReader.appendChild(checkbox);
  }
  else
  {
    checked = bamboo.option.get('thunderbird-link-in-tab') == 'true';
    label = u.str('bamboo.option.check.thunderbirdtab');
    checkbox = bamboo.utils.ui.createCheckbox(label, checked, function(checked)
    {
      bamboo.option.run('set', ['thunderbird-link-in-tab', checked ? 'true' : 'false']);
    });
    this.contentReader.appendChild(checkbox);
  }

  checked = bamboo.option.get('force-tab-in-background') == 'true';
  label = u.str('bamboo.option.check.alwaystabinbackground');
  checkbox = bamboo.utils.ui.createCheckbox(label, checked, function(checked)
  {
    bamboo.option.run('set', ['force-tab-in-background', checked ? 'true' : 'false']);

    bamboo.run('selectItem', [bamboo.selection]);
  });
  this.contentReader.appendChild(checkbox);

  checked = bamboo.option.get('force-open') == 'true';
  label = u.str('bamboo.option.check.forceopen');
  checkbox = bamboo.utils.ui.createCheckbox(label, checked, function(checked)
  {
    bamboo.option.run('set', ['force-open', checked ? 'true' : 'false']);
  });
  this.contentReader.appendChild(checkbox);

  checked = bamboo.option.get('show-content-popup') == 'true';
  label = u.str('bamboo.option.check.showpreviewtooltip');
  checkbox = bamboo.utils.ui.createCheckbox(label, checked, function(checked)
  {
    bamboo.option.run('set', ['show-content-popup', checked ? 'true' : 'false']);
  });
  this.contentReader.appendChild(checkbox);

  checked = bamboo.option.get('youtube-integration') == 'true';
  label = u.str('bamboo.option.check.youtubevideointegration');
  checkbox = bamboo.utils.ui.createCheckbox(label, checked, function(checked)
  {
    bamboo.option.run('set', ['youtube-integration', checked ? 'true' : 'false']);
  });
  this.contentReader.appendChild(checkbox);

  checked = bamboo.option.get('show-embed-content') == 'true';
  label = u.str('bamboo.option.check.showembeddedcontent');
  this.checkShowEmbedContent = bamboo.utils.ui.createCheckbox(label, checked, function(checked)
  {
    bamboo.option.run('set', ['show-embed-content', checked ? 'true' : 'false']);
    bamboo.ui.run('applyOptions');
    bamboo.ui.panel.get('reader').zoneViewMenu.update();
    if(bamboo.ui.panel.get('search').zoneViewMenu)
    {
      bamboo.ui.panel.get('search').zoneViewMenu.update();
    }
  });
  this.contentReader.appendChild(this.checkShowEmbedContent);

  label = bamboo.doc.createElement('label');
  label.setAttribute('class', 'bamboo-label');
  label.setAttribute('value', bamboo.utils.str('bamboo.option.info.onlyintabmode'));
  this.contentReader.appendChild(label);

  checked = bamboo.option.get('use-ads-blocker') == 'true';
  label = u.str('bamboo.option.check.useadsblocker');
  this.checkUseAdsBlocker = bamboo.utils.ui.createCheckbox(label, checked, function(checked)
  {
    bamboo.option.run('set', ['use-ads-blocker', checked ? 'true' : 'false']);
    bamboo.ui.panel.get('reader').zoneViewMenu.update();
    bamboo.run('selectItem', [bamboo.selection]);
  });
  this.contentReader.appendChild(this.checkUseAdsBlocker);

  var box = bamboo.doc.createElement('hbox');
  this.contentReader.appendChild(box);

  label = bamboo.doc.createElement('label');
  label.setAttribute('class', 'bamboo-label');
  label.setAttribute('value', bamboo.utils.str('bamboo.option.label.blacklist'));
  box.appendChild(label);

  bamboo.utils.ui.addSpacer(box, false, true);

  bamboo.utils.ui.addButton(box, bamboo.utils.str('bamboo.button.editblacklist'), function(event)
  {
    bamboo.utils.blacklist.run('edit');
  }, true);

  checked = bamboo.option.get('recover-icons') == 'true';
  label = u.str('bamboo.option.check.recoverfeedicons');
  checkbox = bamboo.utils.ui.createCheckbox(label, checked, function(checked)
  {
    bamboo.option.run('set', ['recover-icons', checked ? 'true' : 'false']);
  });
  this.contentReader.appendChild(checkbox);

  checked = bamboo.option.get('show-feed-icons') == 'true';
  label = u.str('bamboo.option.check.showfeedicons');
  checkbox = bamboo.utils.ui.createCheckbox(label, checked, function(checked)
  {
    bamboo.option.run('set', ['show-feed-icons', checked ? 'true' : 'false']);
  });
  this.contentReader.appendChild(checkbox);

  checked = bamboo.option.get('show-link-popup') == 'true';
  label = u.str('bamboo.option.check.showlinktooltipinpopup');
  checkbox = bamboo.utils.ui.createCheckbox(label, checked, function(checked)
  {
    bamboo.option.run('set', ['show-link-popup', checked ? 'true' : 'false']);
  });
  this.contentReader.appendChild(checkbox);

  checked = bamboo.option.get('use-cache') == 'true';
  label = u.str('bamboo.option.check.usecache');
  checkbox = bamboo.utils.ui.createCheckbox(label, checked, function(checked)
  {
    bamboo.option.run('set', ['use-cache', checked ? 'true' : 'false']);
  });
  this.contentReader.appendChild(checkbox);

  checked = bamboo.option.get('show-article-author') == 'true';
  label = u.str('bamboo.option.check.showarticleauthor');
  checkbox = bamboo.utils.ui.createCheckbox(label, checked, function(checked)
  {
    bamboo.option.run('set', ['show-article-author', checked ? 'true' : 'false']);
    bamboo.ui.run('applyOptions');
  });
  this.contentReader.appendChild(checkbox);

  checked = bamboo.option.get('sort-older-first') == 'true';
  label = u.str('bamboo.option.check.sortolderfirst');
  checkbox = bamboo.utils.ui.createCheckbox(label, checked, function(checked)
  {
    bamboo.option.run('set', ['sort-older-first', checked ? 'true' : 'false']);
    bamboo.data.run('sortItems');
  });
  this.contentReader.appendChild(checkbox);

  label = bamboo.doc.createElement('label');
  label.setAttribute('class', 'bamboo-label');
  label.setAttribute('value', bamboo.utils.str('bamboo.option.label.pageitemcount'));
  this.contentReader.appendChild(label);

  var limit = Number(bamboo.option.get('page-item-count'));
  if(limit < 10)
  {
    limit = 100;
  }
  var radioLimit = bamboo.utils.ui.createRadioGroup([{label: '10', value: '10', tooltip: null},
                                                    {label: '15', value: '15', tooltip: null},
                                                    {label: '20', value: '20', tooltip: null},
                                                    {label: '25', value: '25', tooltip: null},
                                                    {label: '30', value: '30', tooltip: null},
                                                    {label: '50', value: '50', tooltip: null},
                                                    {label: '100', value: '100', tooltip: null}], limit, false,
  function(value)
  {
    bamboo.option.run('set', ['page-item-count', value]);
    bamboo.data.page.run('onPageItemCountChanged');
    bamboo.data.searchPage.run('onPageItemCountChanged');
  });
  this.contentReader.appendChild(radioLimit);

  // Update options

  this.contentUpdate = this.addGroupBox(contentContainer);

  label = bamboo.doc.createElement('label');
  label.setAttribute('class', 'bamboo-label');
  label.setAttribute('value', bamboo.utils.str('bamboo.option.label.simultaneousupdates'));
  this.contentUpdate.appendChild(label);

  var radioSimUpdates = bamboo.utils.ui.createRadioGroup([{label: '1', value: '1', tooltip: null},
                                                          {label: '2', value: '2', tooltip: null},
                                                          {label: '5', value: '5', tooltip: null},
                                                          {label: '10', value: '10', tooltip: null},
                                                          {label: '15', value: '15', tooltip: null},
                                                          {label: '20', value: '20', tooltip: null},
                                                          {label: '30', value: '30', tooltip: null}], bamboo.option.get('simultaneous-updates'), false,
  function(value)
  {
    bamboo.option.set('simultaneous-updates', value);
    bamboo.utils.updater.run('launchUpdate');
  });
  this.contentUpdate.appendChild(radioSimUpdates);

  label = bamboo.doc.createElement('label');
  label.setAttribute('class', 'bamboo-label');
  label.setAttribute('value', bamboo.utils.str('bamboo.option.label.timeout'));
  this.contentUpdate.appendChild(label);

  var radioTimeout = bamboo.utils.ui.createRadioGroup([{label: '10', value: '10', tooltip: null},
                                                      {label: '15', value: '15', tooltip: null},
                                                      {label: '20', value: '20', tooltip: null},
                                                      {label: '30', value: '30', tooltip: null},
                                                      {label: '60', value: '60', tooltip: null}], bamboo.option.get('loading-timeout'), false,
  function(value)
  {
    bamboo.option.run('set', ['loading-timeout', value]);
  });
  this.contentUpdate.appendChild(radioTimeout);

  var label = bamboo.doc.createElement('label');
  label.setAttribute('class', 'bamboo-label');
  label.setAttribute('value', bamboo.utils.str('bamboo.option.label.timeout.info'));
  this.contentUpdate.appendChild(label);

  bamboo.utils.ui.addSpacer(this.contentUpdate, true, true);

  label = bamboo.doc.createElement('label');
  label.setAttribute('class', 'bamboo-label bamboo-label-large');
  label.setAttribute('value', bamboo.utils.str('bamboo.option.label.autoupdate'));
  this.contentUpdate.appendChild(label);

  checked = bamboo.option.get('auto-update');
  label = u.str('bamboo.option.check.autoupdate');
  this.checkAutoUpdate = bamboo.utils.ui.createCheckbox(label, checked, function(checked)
  {
    bamboo.option.run('set', ['auto-update', checked ? 'true' : 'false']);
    optionPanel.run('updateAutoUpdates');
    bamboo.utils.timer.run('init');
  });
  this.contentUpdate.appendChild(this.checkAutoUpdate);

  checked = bamboo.option.get('update-only-favorite') == 'true';
  label = u.str('bamboo.option.check.updateonlyfavorite');
  this.checkUpdateOnlyFavorite = bamboo.utils.ui.createCheckbox(label, checked, function(checked)
  {
    bamboo.option.run('set', ['update-only-favorite', checked ? 'true' : 'false']);
  });
  this.contentUpdate.appendChild(this.checkUpdateOnlyFavorite);

  checked = bamboo.option.get('init-update') == 'true';
  label = u.str('bamboo.option.check.initupdate');
  this.checkInitUpdate = bamboo.utils.ui.createCheckbox(label, checked, function(checked)
  {
    bamboo.option.run('set', ['init-update', checked ? 'true' : 'false']);
  });
  this.contentUpdate.appendChild(this.checkInitUpdate);

  label = bamboo.doc.createElement('label');
  label.setAttribute('class', 'bamboo-label');
  label.setAttribute('value', bamboo.utils.str('bamboo.option.label.delay'));
  this.contentUpdate.appendChild(label);

  var updateDelay = Number(bamboo.option.get('auto-update-delay'));
  if(updateDelay < 1)
  {
    updateDelay = 20;
  }

  this.radioUpdateDelay = bamboo.utils.ui.createRadioGroup([{label: '1', value: '1', tooltip: null},
                                                          {label: '2', value: '2', tooltip: null},
                                                          {label: '5', value: '5', tooltip: null},
                                                          {label: '10', value: '10', tooltip: null},
                                                          {label: '20', value: '20', tooltip: null},
                                                          {label: '30', value: '30', tooltip: null},
                                                          {label: '60', value: '60', tooltip: null},
                                                          {label: '120', value: '120', tooltip: null}], updateDelay, false,
  function(value)
  {
    bamboo.option.set('auto-update-delay', value);
    bamboo.utils.timer.run('init');
  });
  this.contentUpdate.appendChild(this.radioUpdateDelay);

  this.updateAutoUpdates(true);

  // Display options

  this.contentDisplay = this.addGroupBox(contentContainer);
  var panel = this;

  var boxLine = bamboo.doc.createElement('hbox');
  this.contentDisplay.appendChild(boxLine);

  label = bamboo.doc.createElement('label');
  label.setAttribute('class', 'bamboo-label');
  label.setAttribute('value', bamboo.utils.str('bamboo.option.label.displaymode'));
  boxLine.appendChild(label);

  bamboo.utils.ui.addSpacer(boxLine, false, true, false);

  var radioDisplayMode = bamboo.utils.ui.createRadioGroup([{label: bamboo.utils.str('bamboo.option.label.displaymode.popup'), value: 'popup', tooltip: bamboo.utils.str('bamboo.option.tooltip.displaymode.popup')},
                                                           {label: bamboo.utils.str('bamboo.option.label.displaymode.tab'), value: 'tab', tooltip: bamboo.utils.str('bamboo.option.tooltip.displaymode.tab')}], bamboo.option.get('display-mode'), false,
  function(value)
  {
    panel.run('setDisplayMode', [value]);
  });
  boxLine.appendChild(radioDisplayMode);

  label = bamboo.doc.createElement('label');
  label.setAttribute('class', 'bamboo-label');
  label.setAttribute('value', bamboo.utils.str('bamboo.option.label.displaymode.info'));
  this.contentDisplay.appendChild(label);

  bamboo.utils.ui.addSpacer(this.contentDisplay, true, true, true);

  boxLine = bamboo.doc.createElement('hbox');
  this.contentDisplay.appendChild(boxLine);

  label = bamboo.doc.createElement('label');
  label.setAttribute('class', 'bamboo-label');
  label.setAttribute('value', bamboo.utils.str('bamboo.option.label.theme'));
  boxLine.appendChild(label);

  bamboo.utils.ui.addSpacer(boxLine, false, true, false);

  var radioTheme = bamboo.utils.ui.createRadioGroup([{label: bamboo.utils.str('bamboo.option.label.theme.blue'), value: 'blue'},
                                                    {label: bamboo.utils.str('bamboo.option.label.theme.darkblue'), value: 'darkblue'},
                                                    {label: bamboo.utils.str('bamboo.option.label.theme.bluegray'), value: 'bluegray'},
                                                    {label: bamboo.utils.str('bamboo.option.label.theme.gray'), value: 'gray'},
                                                    {label: bamboo.utils.str('bamboo.option.label.theme.black'), value: 'black'},
                                                    {label: bamboo.utils.str('bamboo.option.label.theme.terminal'), value: 'terminal'}, null,
                                                    {label: bamboo.utils.str('bamboo.option.label.theme.red'), value: 'red'},
                                                    {label: bamboo.utils.str('bamboo.option.label.theme.purple'), value: 'purple'},
                                                    {label: bamboo.utils.str('bamboo.option.label.theme.green'), value: 'green'},
                                                    {label: bamboo.utils.str('bamboo.option.label.theme.brown'), value: 'brown'},
                                                    {label: bamboo.utils.str('bamboo.option.label.theme.beige'), value: 'beige'},
                                                    {label: bamboo.utils.str('bamboo.option.label.theme.rainbow'), value: 'lightrainbow'}, null,
                                                    {label: bamboo.utils.str('bamboo.option.label.theme.white'), value: 'lightwhite'},
                                                    {label: bamboo.utils.str('bamboo.option.label.theme.lightgray'), value: 'lightgray'},
                                                    {label: bamboo.utils.str('bamboo.option.label.theme.silver'), value: 'lightsilver'},
                                                    {label: bamboo.utils.str('bamboo.option.label.theme.lightblue'), value: 'lightblue'},
                                                    {label: bamboo.utils.str('bamboo.option.label.theme.lightbeige'), value: 'lightbeige'}],
                                                    bamboo.option.get('display-theme'), false,
  function(value)
  {
    panel.run('setTheme', [value]);
  });
  boxLine.appendChild(radioTheme);

  bamboo.utils.ui.addSpacer(this.contentDisplay, true, true, true);

  boxLine = bamboo.doc.createElement('hbox');
  this.contentDisplay.appendChild(boxLine);

  label = bamboo.doc.createElement('label');
  label.setAttribute('class', 'bamboo-label');
  label.setAttribute('value', bamboo.utils.str('bamboo.option.label.viewstyle'));
  boxLine.appendChild(label);

  bamboo.utils.ui.addSpacer(boxLine, false, true, false);

  var radioViewStyle = bamboo.utils.ui.createRadioGroup([{label: bamboo.utils.str('bamboo.option.label.viewstyle.light'), value: 'light'},
                                                         {label: bamboo.utils.str('bamboo.option.label.viewstyle.dark'), value: 'dark'}],
                                                         bamboo.option.get('display-view-style'), false,
  function(value)
  {
    panel.run('setViewStyle', [value]);
  });
  boxLine.appendChild(radioViewStyle);

  bamboo.utils.ui.addSpacer(this.contentDisplay, true, true, true);

  boxLine = bamboo.doc.createElement('hbox');
  this.contentDisplay.appendChild(boxLine);

  label = bamboo.doc.createElement('label');
  label.setAttribute('class', 'bamboo-label');
  label.setAttribute('value', bamboo.utils.str('bamboo.option.label.align'));
  boxLine.appendChild(label);

  bamboo.utils.ui.addSpacer(boxLine, false, true, false);

  var radioAlign = bamboo.utils.ui.createRadioGroup([{label: bamboo.utils.str('bamboo.option.label.align.left'), value: 'start', tooltip: bamboo.utils.str('bamboo.option.tooltip.align.left')},
                                                    {label: bamboo.utils.str('bamboo.option.label.align.center'), value: 'center', tooltip: bamboo.utils.str('bamboo.option.tooltip.align.center')},
                                                    {label: bamboo.utils.str('bamboo.option.label.align.right'), value: 'end', tooltip: bamboo.utils.str('bamboo.option.tooltip.align.right')}], bamboo.option.get('interface-align'), false,
  function(value)
  {
    panel.run('setAlignment', [value]);
  });
  boxLine.appendChild(radioAlign);

  bamboo.utils.ui.addSpacer(this.contentDisplay, true, true, true);

  boxLine = bamboo.doc.createElement('hbox');
  this.contentDisplay.appendChild(boxLine);

  label = bamboo.doc.createElement('label');
  label.setAttribute('class', 'bamboo-label');
  label.setAttribute('value', bamboo.utils.str('bamboo.option.label.menuposition'));
  boxLine.appendChild(label);

  bamboo.utils.ui.addSpacer(boxLine, false, true, false);

  var radioMenuPosition = bamboo.utils.ui.createRadioGroup([{label: bamboo.utils.str('bamboo.option.label.menuposition.top'), value: 'top', tooltip: null},
                                                    {label: bamboo.utils.str('bamboo.option.label.menuposition.bottom'), value: 'bottom', tooltip: null},
                                                    {label: bamboo.utils.str('bamboo.option.label.menuposition.left'), value: 'left', tooltip: null},
                                                    {label: bamboo.utils.str('bamboo.option.label.menuposition.right'), value: 'right', tooltip: null}],
  bamboo.option.get('menu-position'), false,
  function(value)
  {
    bamboo.ui.run('setMenuPosition', [value]);
  });
  boxLine.appendChild(radioMenuPosition);

  checked = bamboo.option.get('menu-only-icons') == 'true';
  label = u.str('bamboo.option.check.menuonlyicons');
  checkbox = bamboo.utils.ui.createCheckbox(label, checked, function(checked)
  {
    bamboo.option.run('set', ['menu-only-icons', checked ? 'true' : 'false']);
    bamboo.ui.run('applyOptions');
  });
  this.contentDisplay.appendChild(checkbox);

  bamboo.utils.ui.addSpacer(this.contentDisplay, true, true);

  box = bamboo.doc.createElement('hbox');
  this.contentDisplay.appendChild(box);

  label = bamboo.doc.createElement('label');
  label.setAttribute('class', 'bamboo-label');
  label.setAttribute('value', bamboo.utils.str('bamboo.option.label.buttontext'));
  box.appendChild(label);

  bamboo.utils.ui.addSpacer(box, false, true);

  bamboo.utils.ui.addButton(box, bamboo.utils.str('bamboo.option.button.customize'), function(event)
  {
    panel.run('editButtonText');
  }, true);

  box = bamboo.doc.createElement('hbox');
  this.contentDisplay.appendChild(box);

  label = bamboo.doc.createElement('label');
  label.setAttribute('class', 'bamboo-label');
  label.setAttribute('value', bamboo.utils.str('bamboo.option.label.tabtext'));
  box.appendChild(label);

  bamboo.utils.ui.addSpacer(box, false, true);

  bamboo.utils.ui.addButton(box, bamboo.utils.str('bamboo.option.button.customize'), function(event)
  {
    panel.run('editTabText');
  }, true);

  // Notifications options

  this.contentNotifications = this.addGroupBox(contentContainer);

  checked = bamboo.option.get('show-notifications-') == 'true';
  label = u.str('bamboo.option.check.shownotifications');
  checkbox = bamboo.utils.ui.createCheckbox(label, checked, function(checked)
  {
    bamboo.option.run('set', ['show-notifications-', checked ? 'true' : 'false']);
    panel.run('updateNotifications');
  });
  this.contentNotifications.appendChild(checkbox);

  checked = bamboo.option.get('show-notifications-only-auto') == 'true';
  label = u.str('bamboo.option.check.shownotificationsonlyauto');
  this.checkNotificationsOnlyAuto = bamboo.utils.ui.createCheckbox(label, checked, function(checked)
  {
    bamboo.option.run('set', ['show-notifications-only-auto', checked ? 'true' : 'false']);
  });
  this.contentNotifications.appendChild(this.checkNotificationsOnlyAuto);

  this.updateNotifications();

  box = bamboo.doc.createElement('hbox');
  this.contentNotifications.appendChild(box);

  label = bamboo.doc.createElement('label');
  label.setAttribute('class', 'bamboo-label');
  label.setAttribute('value', bamboo.utils.str('bamboo.option.label.notificationtext'));
  box.appendChild(label);

  bamboo.utils.ui.addSpacer(box, false, true);

  bamboo.utils.ui.addButton(box, bamboo.utils.str('bamboo.option.button.customize'), function(event)
  {
    panel.run('editNotificationText');
  }, true);

  // Sharing options

  this.contentSharing = this.addGroupBox(contentContainer);

  label = bamboo.doc.createElement('label');
  label.setAttribute('class', 'bamboo-label');
  label.setAttribute('value', bamboo.utils.str('bamboo.option.label.share'));
  this.contentSharing.appendChild(label);

  label = u.str('bamboo.option.check.showsharinglink');

  checked = bamboo.option.get('show-sharing-link-facebook') == 'true';
  checkbox = bamboo.utils.ui.createCheckbox(label.replace('%name%', 'Facebook'), checked, function(checked)
  {
    bamboo.option.run('set', ['show-sharing-link-facebook', checked ? 'true' : 'false']);
    bamboo.ui.run('applyOptions');
  });
  this.contentSharing.appendChild(checkbox);

  checked = bamboo.option.get('show-sharing-link-twitter') == 'true';
  checkbox = bamboo.utils.ui.createCheckbox(label.replace('%name%', 'Twitter'), checked, function(checked)
  {
    bamboo.option.run('set', ['show-sharing-link-twitter', checked ? 'true' : 'false']);
    bamboo.ui.run('applyOptions');
  });
  this.contentSharing.appendChild(checkbox);

  checked = bamboo.option.get('show-sharing-link-google') == 'true';
  checkbox = bamboo.utils.ui.createCheckbox(label.replace('%name%', 'Google +'), checked, function(checked)
  {
    bamboo.option.run('set', ['show-sharing-link-google', checked ? 'true' : 'false']);
    bamboo.ui.run('applyOptions');
  });
  this.contentSharing.appendChild(checkbox);

  checked = bamboo.option.get('show-sharing-link-linkedin') == 'true';
  checkbox = bamboo.utils.ui.createCheckbox(label.replace('%name%', 'LinkedIn'), checked, function(checked)
  {
    bamboo.option.run('set', ['show-sharing-link-linkedin', checked ? 'true' : 'false']);
    bamboo.ui.run('applyOptions');
  });
  this.contentSharing.appendChild(checkbox);

  checked = bamboo.option.get('show-sharing-link-delicious') == 'true';
  checkbox = bamboo.utils.ui.createCheckbox(label.replace('%name%', 'Delicious'), checked, function(checked)
  {
    bamboo.option.run('set', ['show-sharing-link-delicious', checked ? 'true' : 'false']);
    bamboo.ui.run('applyOptions');
  });
  this.contentSharing.appendChild(checkbox);

  checked = bamboo.option.get('show-sharing-link-pocket') == 'true';
  checkbox = bamboo.utils.ui.createCheckbox(label.replace('%name%', 'Pocket'), checked, function(checked)
  {
    bamboo.option.run('set', ['show-sharing-link-pocket', checked ? 'true' : 'false']);
    bamboo.ui.run('applyOptions');
  });
  this.contentSharing.appendChild(checkbox);

  checked = bamboo.option.get('show-sharing-link-readability') == 'true';
  checkbox = bamboo.utils.ui.createCheckbox(label.replace('%name%', 'Readability'), checked, function(checked)
  {
    bamboo.option.run('set', ['show-sharing-link-readability', checked ? 'true' : 'false']);
    bamboo.ui.run('applyOptions');
  });
  this.contentSharing.appendChild(checkbox);

  bamboo.utils.ui.addSpacer(this.contentSharing, true, true);

  box = bamboo.doc.createElement('hbox');
  this.contentSharing.appendChild(box);

  var boxx = bamboo.doc.createElement('vbox');
  box.appendChild(boxx);

  checked = bamboo.option.get('show-sharing-link-mail') == 'true';
  checkbox = bamboo.utils.ui.createCheckbox(bamboo.utils.str('bamboo.option.check.showsharinglink.mail'), checked, function(checked)
  {
    bamboo.option.run('set', ['show-sharing-link-mail', checked ? 'true' : 'false']);
    bamboo.ui.run('applyOptions');
  });
  boxx.appendChild(checkbox);

  bamboo.utils.ui.addSpacer(box, false, true);

  bamboo.utils.ui.addButton(box, bamboo.utils.str('bamboo.option.button.managemailsharinglink'), function()
  {
    panel.run('manageMailSharingLink');
  }, true);

  bamboo.utils.ui.addSpacer(this.contentSharing, true, true);

  label = bamboo.doc.createElement('label');
  label.setAttribute('class', 'bamboo-label');
  label.setAttribute('value', bamboo.utils.str('bamboo.option.label.customsharinglinks'));
  this.contentSharing.appendChild(label);

  box = bamboo.doc.createElement('hbox');
  this.contentSharing.appendChild(box);

  bamboo.utils.ui.addButton(box, bamboo.utils.str('bamboo.option.button.managecustomsharinglinks'), function()
  {
    panel.run('manageSharingLinks');
  }, true);

  // Data options

  this.contentData = this.addGroupBox(contentContainer);

  label = bamboo.doc.createElement('label');
  label.setAttribute('class', 'bamboo-label');
  label.setAttribute('value', bamboo.utils.str('bamboo.option.label.datafileslocation'));
  this.contentData.appendChild(label);

  this.labelDataFilesLocation = bamboo.doc.createElement('html:div');
  this.labelDataFilesLocation.setAttribute('class', 'bamboo-label bamboo-selectable-text');
  this.labelDataFilesLocation.setAttribute('type', 'content');
  this.labelDataFilesLocation.setAttribute('flex', '1');
  this.labelDataFilesLocation.textContent = bamboo.utils.io.getLocalFilesPath();
  this.contentData.appendChild(this.labelDataFilesLocation);

  box = bamboo.doc.createElement('hbox');
  this.contentData.appendChild(box);

  label = bamboo.doc.createElement('label');
  label.setAttribute('class', 'bamboo-label');
  label.setAttribute('value', bamboo.utils.str('bamboo.option.label.datafileslocation.edit'));
  box.appendChild(label);

  bamboo.utils.ui.addSpacer(box, false, false);

  bamboo.utils.ui.addButton(box, bamboo.utils.str('bamboo.option.button.datafileslocation.browse'), function(event)
  {
    panel.run('editDataFilesLocation');
  }, true);

  bamboo.utils.ui.addButton(box, bamboo.utils.str('bamboo.option.button.datafileslocation.default'), function(event)
  {
    panel.run('setDefaultDataFilesLocation');
  }, true);

  // Shortcuts options

  this.contentShortcuts = this.addGroupBox(contentContainer);

  this.buildKeyRow(this.contentShortcuts, 'show');
  this.buildKeyRow(this.contentShortcuts, 'selecttab');
  this.buildKeyRow(this.contentShortcuts, 'quickselection');

  bamboo.utils.ui.addSpacer(this.contentShortcuts, true, true, true);

  this.buildKeyRow(this.contentShortcuts, 'search');
  this.buildKeyRow(this.contentShortcuts, 'update');
  this.buildKeyRow(this.contentShortcuts, 'selectall');
  this.buildKeyRow(this.contentShortcuts, 'displaycontent');
  this.buildKeyRow(this.contentShortcuts, 'filterunread');
  this.buildKeyRow(this.contentShortcuts, 'selectfav');
  this.buildKeyRow(this.contentShortcuts, 'filtertree');
  this.buildKeyRow(this.contentShortcuts, 'expandtree');

  bamboo.utils.ui.addSpacer(this.contentShortcuts, true, true, true);

  this.buildKeyRow(this.contentShortcuts, 'markfirst');
  this.buildKeyRow(this.contentShortcuts, 'markall');

  bamboo.utils.ui.addSpacer(this.contentShortcuts, true, true, true);

  this.buildKeyRow(this.contentShortcuts, 'openfirst');
  this.buildKeyRow(this.contentShortcuts, 'openfirstinback');
  this.buildKeyRow(this.contentShortcuts, 'openall');

  bamboo.utils.ui.addSpacer(this.contentShortcuts, true, true, true);

  this.buildKeyRow(this.contentShortcuts, 'pagedown');
  this.buildKeyRow(this.contentShortcuts, 'pageup');
  this.buildKeyRow(this.contentShortcuts, 'scroll');
  this.buildKeyRow(this.contentShortcuts, 'pagenext');
  this.buildKeyRow(this.contentShortcuts, 'pageprevious');
  this.buildKeyRow(this.contentShortcuts, 'pagelast');
  this.buildKeyRow(this.contentShortcuts, 'pagefirst');

  this.selectTab('reader');
};

bamboo.ui.panel.option.prototype.buildKeyRow = function(pContainer, pShortcutId)
{
  var labelBox = bamboo.doc.createElement('hbox');
  labelBox.setAttribute('flex', '1');
  labelBox.setAttribute('class', 'bamboo-option-key-row');
  pContainer.appendChild(labelBox);

  var label = bamboo.doc.createElement('label');
  label.setAttribute('class', 'bamboo-label bamboo-label-key');
  label.setAttribute('value', pShortcutId == '' ? '' : bamboo.utils.str('bamboo.option.label.shortcut.' + pShortcutId));
  labelBox.appendChild(label);

  bamboo.utils.ui.addSpacer(labelBox, false, false);

  label = bamboo.doc.createElement('label');
  label.setAttribute('class', 'bamboo-label bamboo-label-key bamboo-label-keycode');
  label.setAttribute('value', pShortcutId == '' ? '' : bamboo.utils.str('bamboo.option.label.shortcut.' + pShortcutId + '.key'));
  labelBox.appendChild(label);
};

bamboo.ui.panel.option.prototype.setTheme = function(theme)
{
  bamboo.option.set('display-theme', theme);

  bamboo.ui.applyOptions();
};

bamboo.ui.panel.option.prototype.setViewStyle = function(style)
{
  bamboo.option.set('display-view-style', style);

  bamboo.ui.applyOptions();
};

bamboo.ui.panel.option.prototype.setAlignment = function(alignment)
{
  bamboo.option.set('interface-align', alignment);
  bamboo.ui.updateInterfaceAlignment();
};

bamboo.ui.panel.option.prototype.setDisplayMode = function(mode)
{
  if(bamboo.option.get('display-mode') != mode)
  {
    if(mode == 'popup' && (!bamboo.ui.toolbar.isButtonAdded() || bamboo.ui.toolbar.isButtonInPopup()))
    {
      bamboo.ui.showMessageDialog(bamboo.utils.str('bamboo.message.popupmodenobutton'));
    }
    else
    {
      bamboo.ui.setDisplayMode(mode);
    }
  }
};

bamboo.ui.panel.option.prototype.updateUseAdsBlocker = function()
{
  if(this.built)
  {
    this.checkUseAdsBlocker.setAttribute('bamboo-checked', bamboo.option.get('use-ads-blocker'));
  }
};

bamboo.ui.panel.option.prototype.updateShowEmbedContent = function()
{
  if(this.built)
  {
    this.checkShowEmbedContent.setAttribute('bamboo-checked', bamboo.option.get('show-embed-content'));
  }
};

bamboo.ui.panel.option.prototype.updateAutoUpdates = function(onBuild)
{
  if(this.built || onBuild)
  {
    var enabled = bamboo.option.get('auto-update') == 'true';

    this.radioUpdateDelay.setAttribute('disabled', !enabled);
    this.checkUpdateOnlyFavorite.setAttribute('disabled', !enabled);
    this.checkInitUpdate.setAttribute('disabled', !enabled);
  }
};

bamboo.ui.panel.option.prototype.updateNotifications = function()
{
  var notificationActivated = bamboo.option.get('show-notifications-') == 'true';
  this.checkNotificationsOnlyAuto.setAttribute('disabled', !notificationActivated);
};

bamboo.ui.panel.option.prototype.editNotificationText = function()
{
  var message = bamboo.utils.str('bamboo.option.label.notificationcustomizetitle');

  var currentValue = bamboo.option.get('notifications-text');
  if(currentValue == '')
  {
    currentValue = bamboo.utils.str('bamboo.option.label.notificationdefaulttext');
  }
  var action = bamboo.utils.str('bamboo.button.ok');
  var choices = { labelUnread: { type: 'label', value: bamboo.utils.str('bamboo.option.label.customizevar.unread'), selectable: true},
                  labelFavorite: { type: 'label', value: bamboo.utils.str('bamboo.option.label.customizevar.favorite'), selectable: true},
                  labelDefault: { type: 'label', value: bamboo.utils.str('bamboo.option.label.emptyfordefault')},
                  labelSpacer: { type: 'label', value: ''},
                  customtext: { type: 'input', mandatory: false, value: currentValue, desc: bamboo.utils.str('bamboo.option.label.notificationtext')} };

  bamboo.ui.showConfirmDialog(message, action, choices,
  { onValidation: function(result)
  {
    bamboo.option.set('notifications-text', result['customtext']);
  }});
};

bamboo.ui.panel.option.prototype.editButtonText = function()
{
  var message = bamboo.utils.str('bamboo.option.label.buttoncustomizetitle');

  var currentValue = bamboo.option.get('button-text');
  var currentValueUnread = bamboo.option.get('button-text-unread');

  var action = bamboo.utils.str('bamboo.button.ok');
  var choices = { labelUnread: { type: 'label', value: bamboo.utils.str('bamboo.option.label.customizevar.unread'), selectable: true},
                  labelFavorite: { type: 'label', value: bamboo.utils.str('bamboo.option.label.customizevar.favorite'), selectable: true},
                  labelSpacer: { type: 'label', value: ''},
                  customtext: { type: 'input', mandatory: false, value: currentValue, desc: bamboo.utils.str('bamboo.option.label.displayedtext')},
                  customtextunread: { type: 'input', mandatory: false, value: currentValueUnread, desc: bamboo.utils.str('bamboo.option.label.displayedtextunread')} };

  bamboo.ui.showConfirmDialog(message, action, choices,
  { onValidation: function(result)
  {
    bamboo.option.set('button-text', result['customtext']);
    bamboo.option.set('button-text-unread', result['customtextunread']);
    bamboo.ui.updateButtons();
  }});
};

bamboo.ui.panel.option.prototype.editTabText = function()
{
  var message = bamboo.utils.str('bamboo.option.label.tabcustomizetitle');

  var currentValue = bamboo.option.get('tab-text');
  var currentValueUnread = bamboo.option.get('tab-text-unread');

  var action = bamboo.utils.str('bamboo.button.ok');
  var choices = { labelUnread: { type: 'label', value: bamboo.utils.str('bamboo.option.label.customizevar.unread')},
                  labelFavorite: { type: 'label', value: bamboo.utils.str('bamboo.option.label.customizevar.favorite')},
                  labelSpacer: { type: 'label', value: ''},
                  customtext: { type: 'input', mandatory: false, value: currentValue, desc: bamboo.utils.str('bamboo.option.label.displayedtext')},
                  customtextunread: { type: 'input', mandatory: false, value: currentValueUnread, desc: bamboo.utils.str('bamboo.option.label.displayedtextunread')} };

  bamboo.ui.showConfirmDialog(message, action, choices,
  { onValidation: function(result)
  {
    bamboo.option.set('tab-text', result['customtext']);
    bamboo.option.set('tab-text-unread', result['customtextunread']);
    bamboo.ui.updateTab();
  }});
};

bamboo.ui.panel.option.prototype.setDefaultDataFilesLocation = function()
{
  if(bamboo.option.get('data-dir-path'))
  {
    var message = bamboo.utils.str('bamboo.option.message.datafileslocation.confirmdefault');
    var action = bamboo.utils.str('bamboo.button.ok');

    bamboo.ui.run('showConfirmDialog', [message, action, null,
    { onValidation: function()
    {
      bamboo.ui.panel.get('option').run('setDataFilesLocation', ['']);
    }}]);
  }
};

bamboo.ui.panel.option.prototype.editDataFilesLocation = function()
{
  bamboo.ui.hidePopup();

  var nsIFilePicker = Components.interfaces.nsIFilePicker;
  var dialog = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
  dialog.init(bamboo.win, bamboo.utils.str('bamboo.export.browse'), nsIFilePicker.modeGetFolder);

  var res = dialog.show();
  if (res == nsIFilePicker.returnOK)
  {
    var dataFilePath = dialog.file.path;

    bamboo.ui.panel.get('option').run('setDataFilesLocation', [dataFilePath]);
  }
};

bamboo.ui.panel.option.prototype.setDataFilesLocation = function(path)
{
  var fileExists = bamboo.utils.io.pathContainData(path);

  if(fileExists)
  {
    var message = bamboo.utils.str('bamboo.option.message.datafileslocation.existingfile');
    var action = bamboo.utils.str('bamboo.button.ok');
    var choices = { existingdata: { type: 'radio', values: [bamboo.utils.str('bamboo.option.message.datafileslocation.existingfile.replace'),
                                                           bamboo.utils.str('bamboo.option.message.datafileslocation.existingfile.reload')]}};

    bamboo.ui.run('showConfirmDialog', [message, action, choices,
    { onValidation: function(result)
    {
      bamboo.ui.panel.get('option').run('applyDataFilesLocation', [path, result['existingdata'] == 1]);
    }}]);
  }
  else
  {
    this.applyDataFilesLocation(path);
  }
};

bamboo.ui.panel.option.prototype.applyDataFilesLocation = function(path, reloadFromPath)
{
  var backup = bamboo.option.get('data-dir-path');
  bamboo.option.set('data-dir-path', path);

  this.labelDataFilesLocation.textContent = bamboo.utils.io.getLocalFilesPath();

  if(reloadFromPath)
  {
    try
    {
      bamboo.data.reload();
      bamboo.utils.blacklist.reload();

      bamboo.ui.showMessageDialog(bamboo.utils.str('bamboo.option.message.datafileslocation.foldermodified'));
    }
    catch (ex)
    {
      bamboo.option.set('data-dir-path', backup);
      this.labelDataFilesLocation.textContent = bamboo.utils.io.getLocalFilesPath();

      bamboo.ui.showMessageDialog(bamboo.utils.str('bamboo.option.message.datafileslocation.erroronload') + '\n' + bamboo.utils.error.exToStr(ex));
    }
  }
  else
  {
    try
    {
      bamboo.data.save();
      bamboo.data.saveLib();
      bamboo.utils.blacklist.save();

      bamboo.ui.showMessageDialog(bamboo.utils.str('bamboo.option.message.datafileslocation.foldermodified'));
    }
    catch (ex)
    {
      bamboo.option.set('data-dir-path', backup);
      this.labelDataFilesLocation.textContent = bamboo.utils.io.getLocalFilesPath();

      bamboo.ui.showMessageDialog(bamboo.utils.str('bamboo.option.message.datafileslocation.erroronsave') + '\n' + bamboo.utils.error.exToStr(ex));
    }
  }
};

bamboo.ui.panel.option.prototype.manageMailSharingLink = function()
{
  var message = bamboo.utils.str('bamboo.option.label.customizemail');

  var currentMailTo = bamboo.option.get('sharing-mail-to');
  var currentMailSubject = bamboo.option.get('sharing-mail-subject');
  var currentMailBody = bamboo.option.get('sharing-mail-body');
  var limitLength = bamboo.option.get('limit-mail-length');

  var action = bamboo.utils.str('bamboo.button.ok');
  var choices = { labelTitle: { type: 'label', value: bamboo.utils.str('bamboo.option.label.sharinglinkinserttitle'), selectable: true},
                  labelURL: { type: 'label', value: bamboo.utils.str('bamboo.option.label.sharinglinkinserturl'), selectable: true},
                  labelContent: { type: 'label', value: bamboo.utils.str('bamboo.option.label.sharingmailinsertcontent'), selectable: true},
                  customTo: { type: 'input', mandatory: false, value: currentMailTo, desc: bamboo.utils.str('bamboo.option.label.mailto')},
                  customSubject: { type: 'input', mandatory: false, value: currentMailSubject, desc: bamboo.utils.str('bamboo.option.label.mailsubject')},
                  customBody: { type: 'input', mandatory: false, value: currentMailBody, desc: bamboo.utils.str('bamboo.option.label.mailbody'), multiline: true},
                  limitLength: { type: 'check', checked: limitLength, value: bamboo.utils.str('bamboo.option.check.limitmaillength')}};

  bamboo.ui.showConfirmDialog(message, action, choices,
  { onValidation: function(result)
  {
    bamboo.option.set('sharing-mail-to', result['customTo']);
    bamboo.option.set('sharing-mail-subject', result['customSubject']);
    bamboo.option.set('sharing-mail-body', result['customBody']);
    bamboo.option.set('limit-mail-length', result['limitLength']);
  }});
};

bamboo.ui.panel.option.prototype.manageSharingLinks = function(currentValues)
{
  var panel = this;

  var values = [];
  if(currentValues)
  {
    values = currentValues;
  }
  else
  {
    var links = bamboo.utils.sharing.getCustomLinks();
    for(var i=0; i<links.length; i++)
    {
      values.push(links[i].name + ': ' + links[i].url);
    }
  }

  var message = bamboo.utils.str('bamboo.option.label.customsharinglinks');
  var action = bamboo.utils.str('bamboo.button.save');
  var choices = { linklist: { type: 'list', values: values, editHandler: function(value, values)
  {
    panel.run('editSharingLink', [value, values]);
  }}};

  bamboo.ui.showConfirmDialog(message, action, choices,
  {
  onSecondaryAction: function()
  {
    panel.run('addSharingLink');
  },
  onValidation: function(result)
  {
    panel.run('applyCustomLinks', [result.linklist]);
    bamboo.run('selectItem', [bamboo.selection]);
  }},
  bamboo.utils.str('bamboo.button.add'));
};

bamboo.ui.panel.option.prototype.addSharingLink = function(name, url)
{
  var panel = this;

  var message = bamboo.utils.str('bamboo.option.label.addcustomsharinglink');
  var action = bamboo.utils.str('bamboo.button.add');
  var choices = { name: { type: 'input', value: name ? name : '', mandatory: true, desc: bamboo.utils.str('bamboo.option.label.sharinglinkname') },
                  url: { type: 'input', value: url ? url : '', mandatory: true, desc: bamboo.utils.str('bamboo.option.label.sharinglinkurl') },
                  infoUrl: {type: 'label', value: bamboo.utils.str('bamboo.option.label.sharinglinkinserturl')},
                  infoTitle: {type: 'label', value: bamboo.utils.str('bamboo.option.label.sharinglinkinserttitle')} };

  bamboo.ui.showConfirmDialog(message, action, choices,
  {
    onValidation: function(result)
    {
      if(bamboo.utils.sharing.hasCustomLink(result.name))
      {
        bamboo.ui.showMessageDialog(bamboo.utils.str('bamboo.option.label.customsharinglinkexists'),
        { onValidation: function()
        {
          panel.addSharingLink(result.name, result.url);
        }});
      }
      else
      {
        bamboo.utils.sharing.addCustomLink(result.name, result.url);
        bamboo.run('selectItem', [bamboo.selection]);
      }
    }});
};

bamboo.ui.panel.option.prototype.editSharingLink = function(value, values)
{
  var panel = this;
  var link = this.getLinkFromString(value);

  var message = bamboo.utils.str('bamboo.option.label.editcustomsharinglink');
  var action = bamboo.utils.str('bamboo.button.ok');
  var choices = { name: { type: 'input', value: link.name, mandatory: true, desc: bamboo.utils.str('bamboo.option.label.sharinglinkname') },
                  url: { type: 'input', value: link.url, mandatory: true, desc: bamboo.utils.str('bamboo.option.label.sharinglinkurl') },
                  infoUrl: {type: 'label', value: bamboo.utils.str('bamboo.option.label.sharinglinkinserturl'), selectable: true},
                  infoTitle: {type: 'label', value: bamboo.utils.str('bamboo.option.label.sharinglinkinserttitle'), selectable: true}};

  bamboo.ui.showConfirmDialog(message, action, choices,
  {
    onCancel: function()
    {
      panel.manageSharingLinks(values);
    },
    onValidation: function(result)
    {
      var newValue = result.name + ': ' + result.url;
      if(value.indexOf(result.name + ': ') < 0 && bamboo.utils.sharing.hasCustomLink(result.name))
      {
        bamboo.ui.showMessageDialog(bamboo.utils.str('bamboo.option.label.customsharinglinkexists'),
        { onValidation: function()
        {
          panel.editSharingLink(value, values);
        }});
      }
      else
      {
        var newValues = [];
        for(var i=0; i<values.length; i++)
        {
          if(values[i] == value)
          {
            newValues.push(newValue);
          }
          else
          {
            newValues.push(values[i]);
          }
        }
        panel.manageSharingLinks(newValues);
      }
    }});
};

bamboo.ui.panel.option.prototype.applyCustomLinks = function(values)
{
  var links = [];

  for(var i=0; i<values.length; i++)
  {
    links.push(this.getLinkFromString(values[i]));
  }

  bamboo.utils.sharing.setCustomLinks(links);
};

bamboo.ui.panel.option.prototype.getLinkFromString = function(linkString)
{
  var index = linkString.indexOf(': ');
  return {name: linkString.substring(0, index), url: linkString.substring(index+2)};
};

// Components creation

bamboo.ui.panel.option.prototype.addGroupBox = function(target)
{
  var groupContainer = bamboo.doc.createElement('hbox');

  var group = bamboo.doc.createElement('vbox');
  group.setAttribute('class', 'bamboo-groupbox');
  group.setAttribute('flex', '1');
  groupContainer.appendChild(group);

  target.appendChild(groupContainer);

  return group;
};

bamboo.ui.panel.option.prototype.addGroupBoxTitle = function(target, name, handler)
{
  var box = bamboo.doc.createElement('hbox');
  box.setAttribute('class', 'bamboo-focusable bamboo-view-group bamboo-view-group-category bamboo-view-group-container');
  box.addEventListener("click", handler, false);
  box.addEventListener("keypress", function(event)
  {
    if(event.keyCode == 13 || event.charCode == 32)
    {
      handler();
    }
  }, false);

  var label = bamboo.doc.createElement('html:div');
  label.setAttribute('class', 'bamboo-view-group-label');
  label.setAttribute('type', 'content');
  label.setAttribute('flex', '1');
  label.textContent = name;
  box.appendChild(label);

  return target.appendChild(box);
};

bamboo.ui.panel.option.prototype.addCheckBox = function(target, name, checked, handler)
{
  var checkbox = bamboo.doc.createElement('checkbox');
  checkbox.setAttribute('class', 'bamboo-checkbox');
  checkbox.setAttribute('checked', checked);
  checkbox.setAttribute('label', name);
  checkbox.addEventListener("click", handler, false);

  return target.appendChild(checkbox);
};

bamboo.ui.panel.option.prototype.addRadioGroup = function(target, value, values, disabled, handler)
{
  var group = bamboo.doc.createElement('radiogroup');

  for(var i=0; i<values.length; i++)
  {
    var item = bamboo.doc.createElement('radio');
    item.setAttribute('label', values[i]);
    item.addEventListener('command', handler, false);

    if(values[i] == value)
    {
      item.setAttribute('selected', 'true');
    }

    group.appendChild(item);
  }

  group.setAttribute('disabled', disabled);
  group.setAttribute('orient', 'horizontal');

  return target.appendChild(group);
};
