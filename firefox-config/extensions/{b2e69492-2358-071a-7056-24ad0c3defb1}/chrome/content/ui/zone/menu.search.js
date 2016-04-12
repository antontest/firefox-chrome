
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.ui.zone.menu.search = function(target)
{
  bamboo.ui.component.call(this, target);

  this.zone = null;
  this.input = null;
  this.btnSearch = null;
  this.btnAdsBlocker = null;
  this.btnEmbedContent = null;
  this.paginatorContainer = null;
  this.frame = null;
  this.query = '';

  this.btnSearch = null;
};

bamboo.extend(bamboo.ui.zone.menu.search, bamboo.ui.component);

bamboo.ui.zone.menu.search.prototype.build = function()
{
  var menu = this;

  this.zone = bamboo.doc.createElement('hbox');
  this.zone.setAttribute('class', 'bamboo-zone-view-menu');
  this.container.appendChild(this.zone);

  var handlerChange = function()
  {
    if(menu.btnSearch.getAttribute('active') == 'true')
    {
      menu.run('setQuery');
      menu.run('search');
      menu.run('update');
    }
  };

  var handlerKey = function(event)
  {
    if((event.keyCode != 9 && event.charCode != 116 && event.charCode != 8224) || !event.altKey)
    {
      event.stopPropagation();
    }

    if(event.keyCode == 13)
    {
      if(menu.btnSearch.getAttribute('active') == 'true')
      {
        menu.run('setQuery');
        menu.run('search');
        menu.run('update');
      }
      event.preventDefault();
    }
    else if(event.keyCode == 27)
    {
      menu.run('clear');
      event.preventDefault();
    }
  };

  var inputContainer = bamboo.doc.createElement('hbox');
  inputContainer.setAttribute('class', 'bamboo-menu-search-input-container');
  this.zone.appendChild(inputContainer);

  this.input = bamboo.doc.createElement('textbox');
  this.input.setAttribute('id', 'bamboo-menu-search-input');
  this.input.setAttribute('class', 'bamboo-input');
  this.input.setAttribute('placeholder', bamboo.utils.str('bamboo.menu.search.feed.label'));
  //this.input.addEventListener("change", handlerChange, false);
  this.input.addEventListener('keypress', handlerKey, false);
  inputContainer.appendChild(this.input);

  this.btnSearch = bamboo.utils.ui.addMenuButton(this.zone, bamboo.utils.str('bamboo.button.search'), 'bamboo-view-menu-button-icon-search', function(event)
  {
    if(menu.btnSearch.getAttribute('active') == 'true')
    {
      menu.run('setQuery');
      menu.run('search');
      menu.run('update');
    }
  });
  this.btnSearch.setAttribute('active', 'true');

  this.btnClear = bamboo.utils.ui.addMenuButton(inputContainer, bamboo.utils.str('bamboo.button.clear'), 'bamboo-view-menu-button-icon-clear', function(event)
  {
    menu.run('clear');
  });
  this.btnClear.setAttribute('id', 'bamboo-menu-search-input-clear');
  this.btnClear.setAttribute('hidden', 'true');
  this.btnClear.setAttribute('active', 'true');

  bamboo.utils.ui.addSpacer(this.zone, false, true);

  this.btnAdd = bamboo.utils.ui.addButton(this.zone, bamboo.utils.str('bamboo.button.addfeed'), function(event)
  {
    menu.run('onAddSelection');
  }, true);
  this.btnAdd.setAttribute('hidden', 'true');

  bamboo.utils.ui.addSpacer(this.zone, false, false);

  var label = bamboo.doc.createElement('label');
  label.setAttribute('id', 'bamboo-menu-search-google');
  label.setAttribute('value', bamboo.utils.str('bamboo.powered'));
  this.zone.appendChild(label);

  var imgBox = bamboo.doc.createElement('vbox');
  this.zone.appendChild(imgBox);
  var img = bamboo.doc.createElement('image');
  img.setAttribute('class', 'bamboo-button-google');
  img.setAttribute('src', 'chrome://bamboo/skin/img/google.png');
  imgBox.appendChild(img);

  bamboo.utils.ui.addSpacer(this.zone, false, true);

  this.frame = bamboo.doc.createElement('iframe');
  this.frame.setAttribute("type", "content");
  this.frame.setAttribute("collapsed", "true");
  this.frame.addEventListener("load", function (event)
  {
    if(!menu.run('googleIsLoaded'))
    {
      var doc = event.originalTarget;
      doc.location.href = 'chrome://bamboo/content/google.html';
    }
    else
    {
      bamboo.utils.search.run('setGoogleObject', [menu.getGoogleObject()]);
    }
  }, true);

  var ctn = bamboo.doc.getElementById('navigator-toolbox');
  if(!ctn)
  {
    ctn = bamboo.doc.getElementById('mail-toolbox');
  }
  if(!ctn)
  {
    ctn = bamboo.ui.toolbar.getButton();
  }
  if(ctn)
  {
    ctn.parentNode.appendChild(this.frame);
  }

  this.update();

  return this.zone;
};

bamboo.ui.zone.menu.search.prototype.googleIsLoaded = function()
{
  return this.getGoogleObject() ? true : false;
};

bamboo.ui.zone.menu.search.prototype.getGoogleObject = function()
{
  return this.frame.contentWindow && this.frame.contentWindow.google ? this.frame.contentWindow.google : this.frame.contentWindow.wrappedJSObject.google;
};

bamboo.ui.zone.menu.search.prototype.setQuery = function()
{
  this.query = this.input.value;
};

bamboo.ui.zone.menu.search.prototype.search = function()
{
  if(this.query != '')
  {
    bamboo.utils.search.run('search', [this.query]);
  }
};

bamboo.ui.zone.menu.search.prototype.clear = function()
{
  bamboo.utils.search.loading = false;
  bamboo.data.found.removeAll();
  bamboo.data.found.setLoading(false);
  bamboo.selectSearchItem(bamboo.data.found);
  this.update();
  this.input.value = '';
};

bamboo.ui.zone.menu.search.prototype.onAddSelection = function()
{
  if(bamboo.searchSelection instanceof bamboo.data.searchfeed)
  {
    var panel = this;
    var feed = bamboo.searchSelection;
    var groups = bamboo.data.all.getGroupList();
    var message = bamboo.utils.str('bamboo.add.option');
    var action = bamboo.utils.str('bamboo.button.add');
    var choices = { name:
                    { type: 'input', mandatory: true, value: feed.name, desc: bamboo.utils.str('bamboo.edit.feed.name')},
                    favorite:
                    { type: 'check', checked: false, value: bamboo.utils.str('bamboo.edit.feed.favorite')},
                    group:
                    { type: 'combo', label: bamboo.utils.str('bamboo.edit.feed.group'), values: groups, value: bamboo.data.all.id}};

    bamboo.ui.showConfirmDialog(message, action, choices,
    { onValidation: function(result)
    {
      // Add feed
      feed.name = result.name;
      feed.favorite = result.favorite;

      bamboo.run('addSearchSelection', [result.group]);
      panel.btnAdd.setAttribute('active', 'false');
    }});
  }
};

bamboo.ui.zone.menu.search.prototype.update = function()
{
  this.btnSearch.setAttribute('active', !bamboo.data.found.loading);
  this.btnClear.setAttribute('hidden', !bamboo.data.found.loading && !bamboo.data.found.hasChild());
  this.btnAdd.setAttribute('hidden', !(bamboo.searchSelection instanceof bamboo.data.searchfeed));
};

