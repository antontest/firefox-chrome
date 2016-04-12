
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.ui.panel.help = function()
{
  bamboo.ui.panel.base.call(this, 'help', bamboo.utils.str('bamboo.menu.help.label'), true);
};

bamboo.extend(bamboo.ui.panel.help, bamboo.ui.panel.base);

bamboo.ui.panel.help.prototype.build = function()
{
  this.stepBox1 = this.buildStepBox();
  var panel = this;

  var handlerGroup = function()
  {
    panel.run('openLink', ['https://groups.google.com/forum/#!forum/bamboo-feedreader']);
  };

  var handlerMail = function()
  {
    panel.run('openLink', ['mailto:bamboo.feedreader@gmail.com']);
  };

  var handlerWeb = function()
  {
    panel.run('openLink', ['https://addons.mozilla.org/firefox/addon/bamboo-feed-reader/']);
  };

  var handlerSupport = function()
  {
    panel.run('openLink', ['https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=ZQHP2PC37EP4U']);
  };

  var menu = bamboo.doc.createElement('vbox');
  menu.setAttribute('class', 'bamboo-focusable bamboo-menu bamboo-zone-view');
  menu.addEventListener("click", handlerGroup, false);
  menu.addEventListener("keypress", function(event)
  {
    if(event.keyCode == 13 || event.charCode == 32)
    {
      handlerGroup();
    }
  }, false);
  this.stepBox1.appendChild(menu);

  var box = bamboo.doc.createElement('hbox');
  box.setAttribute('class', 'bamboo-menu-box');
  menu.appendChild(box);

  var icon = bamboo.doc.createElement('image');
  icon.setAttribute('class', 'bamboo-menu-icon bamboo-menu-icon-disc-group');
  box.appendChild(icon);

  var label = bamboo.doc.createElement('label');
  label.setAttribute('class', 'bamboo-menu-label bamboo-font-light');
  label.setAttribute('value', bamboo.utils.str('bamboo.help.discussions'));
  box.appendChild(label);

  bamboo.utils.ui.addSpacer(this.stepBox1, true, true);
  bamboo.utils.ui.addSpacer(this.stepBox1, true, true);

  menu = bamboo.doc.createElement('vbox');
  menu.setAttribute('class', 'bamboo-focusable bamboo-menu bamboo-zone-view');
  menu.addEventListener("click", handlerMail, false);
  menu.addEventListener("keypress", function(event)
  {
    if(event.keyCode == 13 || event.charCode == 32)
    {
      handlerMail();
    }
  }, false);
  this.stepBox1.appendChild(menu);

  box = bamboo.doc.createElement('hbox');
  box.setAttribute('class', 'bamboo-menu-box');
  menu.appendChild(box);

  icon = bamboo.doc.createElement('image');
  icon.setAttribute('class', 'bamboo-menu-icon bamboo-menu-icon-email');
  box.appendChild(icon);

  label = bamboo.doc.createElement('label');
  label.setAttribute('class', 'bamboo-menu-label bamboo-font-light');
  label.setAttribute('value', bamboo.utils.str('bamboo.help.message'));
  box.appendChild(label);

  bamboo.utils.ui.addSpacer(this.stepBox1, true, true);
  bamboo.utils.ui.addSpacer(this.stepBox1, true, true);

  menu = bamboo.doc.createElement('vbox');
  menu.setAttribute('class', 'bamboo-focusable bamboo-menu bamboo-zone-view');
  menu.addEventListener("click", handlerWeb, false);
  menu.addEventListener("keypress", function(event)
  {
    if(event.keyCode == 13 || event.charCode == 32)
    {
      handlerWeb();
    }
  }, false);
  this.stepBox1.appendChild(menu);

  box = bamboo.doc.createElement('hbox');
  box.setAttribute('class', 'bamboo-menu-box');
  menu.appendChild(box);

  icon = bamboo.doc.createElement('image');
  icon.setAttribute('class', 'bamboo-menu-icon bamboo-menu-icon-review');
  box.appendChild(icon);

  label = bamboo.doc.createElement('label');
  label.setAttribute('class', 'bamboo-menu-label bamboo-font-light');
  label.setAttribute('value', bamboo.utils.str('bamboo.help.website'));
  box.appendChild(label);

  bamboo.utils.ui.addSpacer(this.stepBox1, true, true);
  bamboo.utils.ui.addSpacer(this.stepBox1, true, true);

  menu = bamboo.doc.createElement('vbox');
  menu.setAttribute('class', 'bamboo-focusable bamboo-menu bamboo-zone-view');
  menu.addEventListener("click", handlerSupport, false);
  menu.addEventListener("keypress", function(event)
  {
    if(event.keyCode == 13 || event.charCode == 32)
    {
      handlerSupport();
    }
  }, false);
  this.stepBox1.appendChild(menu);

  box = bamboo.doc.createElement('hbox');
  box.setAttribute('class', 'bamboo-menu-box');
  menu.appendChild(box);

  icon = bamboo.doc.createElement('image');
  icon.setAttribute('class', 'bamboo-menu-icon bamboo-menu-icon-support');
  box.appendChild(icon);

  label = bamboo.doc.createElement('label');
  label.setAttribute('class', 'bamboo-menu-label bamboo-font-light');
  label.setAttribute('value', bamboo.utils.str('bamboo.help.support'));
  box.appendChild(label);

  bamboo.utils.ui.addSpacer(this.stepBox1, true, true);
};

bamboo.ui.panel.help.prototype.openLink = function(url)
{
  bamboo.utils.browser.openLink(url, true);
  bamboo.ui.hidePopup();
};
