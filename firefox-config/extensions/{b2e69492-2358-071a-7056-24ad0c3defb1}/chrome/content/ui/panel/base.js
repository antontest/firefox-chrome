
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.ui.panel.base = function(name, displayName, scroll)
{
  bamboo.ui.component.call(this);

  this.name = name;
  this.displayName = displayName;
  this.seleted = false;
  this.visible = true;
  this.scroll = scroll;

  this.tab = null;
  this.panel = null;
  this.steps = [];

  this.init();
};

bamboo.extend(bamboo.ui.panel.base, bamboo.ui.component);

bamboo.ui.panel.base.prototype.init = function()
{
  this.buildTabs();
  this.buildPanel();
};

bamboo.ui.panel.base.prototype.setSelected = function(isSelected)
{
  this.seleted = isSelected;
  if(this.seleted)
  {
    this.visible = true;
  }

  this.show();
  this.update();
};

bamboo.ui.panel.base.prototype.setVisible = function(isVisible)
{
  this.visible = isVisible;

  this.updateTab(this.tab);
};

bamboo.ui.panel.base.prototype.update = function()
{
  this.updateTab(this.tab);

  this.updatePanel();
};

bamboo.ui.panel.base.prototype.updateTab = function(tab)
{
  tab.setAttribute('selected', this.seleted);
  tab.setAttribute('visible', this.visible);
};

bamboo.ui.panel.base.prototype.updatePanel = function()
{
  this.panel.setAttribute('selected', this.seleted);
};

bamboo.ui.panel.base.prototype.buildTabs = function()
{
  this.tab = this.buildTab();
  bamboo.ui.menu.appendChild(this.tab);
};

bamboo.ui.panel.base.prototype.buildTab = function()
{
  var panelName = this.name;
  var tab = bamboo.doc.createElement('box');
  tab.setAttribute('class', 'bamboo-tab-box');
  tab.setAttribute('name', this.name);
  tab.addEventListener("click", function(event)
  {
    bamboo.ui.panel.run('select', [panelName]);
  }, false);

  var box = bamboo.doc.createElement('vbox');
  box.setAttribute('class', 'bamboo-tab-image-box');
  tab.appendChild(box);

  var img = bamboo.doc.createElement('image');
  img.setAttribute('id', 'bamboo-tab-image-' + panelName);
  img.setAttribute('class', 'bamboo-tab-image bamboo-tab-image-' + panelName);
  box.appendChild(img);

  box = bamboo.doc.createElement('label');
  box.setAttribute('class', 'bamboo-tab-label bamboo-font-light');
  tab.appendChild(box);
  box.textContent = this.displayName;

  return tab;
};

bamboo.ui.panel.base.prototype.buildPanel = function()
{
  this.panel = bamboo.doc.createElement('hbox');
  this.panel.setAttribute('class', 'bamboo-panel bamboo-zone-menu-popup-container');
  this.panel.setAttribute('name', this.name);
  this.panel.setAttribute('vscroll', this.scroll);
  this.panel.setAttribute('flex', '1');
  bamboo.ui.panelArea.appendChild(this.panel);
  this.container = this.panel;
};

bamboo.ui.panel.base.prototype.buildStepBox = function()
{
  var stepBox = bamboo.doc.createElement('vbox');
  stepBox.setAttribute('class', 'bamboo-step');

  this.steps.push(stepBox);

  return this.container.appendChild(stepBox);
};
