
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.ui.panel.error = function()
{
  bamboo.ui.panel.base.call(this, 'error', bamboo.utils.str('bamboo.menu.error.label'), false);

  this.visible = false;
  this.inputMessages = null;
};

bamboo.extend(bamboo.ui.panel.error, bamboo.ui.panel.base);

bamboo.ui.panel.error.prototype.build = function()
{
  if(this.labelTitle)
  { return; }

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
  this.labelTitle.textContent = bamboo.utils.str('bamboo.menu.error.title');
  menuContainer.appendChild(this.labelTitle);

  var contentContainer = bamboo.doc.createElement('vbox');
  contentContainer.setAttribute('flex', '1');
  contentContainer.setAttribute('class', 'bamboo-zone-view-data');
  zoneView.appendChild(contentContainer);

  var groupContainer = bamboo.doc.createElement('hbox');
  groupContainer.setAttribute('flex', '1');

  var group = bamboo.doc.createElement('hbox');
  group.setAttribute('class', 'bamboo-groupbox-error-message');
  group.setAttribute('flex', '1');
  groupContainer.appendChild(group);

  contentContainer.appendChild(groupContainer);

  this.inputMessages = bamboo.doc.createElement('textbox');
  this.inputMessages.setAttribute('id', 'bamboo-input-message');
  this.inputMessages.setAttribute('class', 'bamboo-input bamboo-input-url');
  this.inputMessages.setAttribute('multiline', 'true');
  this.inputMessages.setAttribute('readonly', 'true');
  this.inputMessages.setAttribute('flex', '1');
  this.inputMessages.addEventListener('keypress', function(event)
  {
    if((event.keyCode != 9 && event.charCode != 116 && event.charCode != 8224) || !event.altKey)
    {
      event.stopPropagation();
    }
  }, false);
  group.appendChild(this.inputMessages);

  var handlerSend = function()
  {
    bamboo.utils.error.report();
  };

  var handlerClear = function()
  {
    bamboo.ui.panel.select('reader');
    bamboo.utils.error.clear();
    bamboo.ui.panel.get('error').setVisible(false);
    bamboo.ui.rootNode.focus();
  };

  var menuContainer = bamboo.doc.createElement('hbox');
  contentContainer.appendChild(menuContainer);

  var menu = bamboo.doc.createElement('vbox');
  menu.setAttribute('class', 'bamboo-focusable bamboo-menu bamboo-zone-view');
  menu.setAttribute('flex', '1');
  menu.addEventListener("click", handlerClear, false);
  menu.addEventListener("keypress", function(event)
  {
    if(event.keyCode == 13 || event.charCode == 32)
    {
      handlerClear();
    }
  }, false);
  menuContainer.appendChild(menu);

  var box = bamboo.doc.createElement('hbox');
  box.setAttribute('class', 'bamboo-menu-box');
  box.setAttribute('flex', '1');
  menu.appendChild(box);

  var icon = bamboo.doc.createElement('image');
  icon.setAttribute('class', 'bamboo-menu-icon bamboo-menu-icon-error-clear');
  box.appendChild(icon);

  var label = bamboo.doc.createElement('label');
  label.setAttribute('class', 'bamboo-menu-label bamboo-font-light');
  label.setAttribute('value', bamboo.utils.str('bamboo.button.error.clear'));
  box.appendChild(label);

  menu = bamboo.doc.createElement('vbox');
  menu.setAttribute('flex', '1');
  menu.setAttribute('class', 'bamboo-focusable bamboo-menu bamboo-zone-view');
  menu.addEventListener("click", handlerSend, false);
  menu.addEventListener("keypress", function(event)
  {
    if(event.keyCode == 13 || event.charCode == 32)
    {
      handlerSend();
    }
  }, false);
  menuContainer.appendChild(menu);

  box = bamboo.doc.createElement('hbox');
  box.setAttribute('class', 'bamboo-menu-box');
  box.setAttribute('flex', '1');
  menu.appendChild(box);

  icon = bamboo.doc.createElement('image');
  icon.setAttribute('class', 'bamboo-menu-icon bamboo-menu-icon-email');
  box.appendChild(icon);

  label = bamboo.doc.createElement('label');
  label.setAttribute('class', 'bamboo-menu-label bamboo-font-light');
  label.setAttribute('value', bamboo.utils.str('bamboo.button.error.send'));
  box.appendChild(label);
};

bamboo.ui.panel.error.prototype.updateErrorMessage = function()
{
  if(this.inputMessages)
  {
    this.inputMessages.setAttribute('value', bamboo.utils.error.getFullText());
  }
};
