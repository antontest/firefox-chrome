
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.ui.panel.import = function()
{
  bamboo.ui.panel.base.call(this, 'import', bamboo.utils.str('bamboo.menu.import.label'), true);

  this.data = null;
};

bamboo.extend(bamboo.ui.panel.import, bamboo.ui.panel.base);

bamboo.ui.panel.import.prototype.build = function()
{
  this.stepBox1 = this.buildStepBox();

  var panel = this;

  var handlerImportFile = function()
  {
    bamboo.utils.import.run('browse');
  };

  var menu = bamboo.doc.createElement('vbox');
  menu.setAttribute('class', 'bamboo-focusable bamboo-menu bamboo-zone-view');
  menu.addEventListener("click", handlerImportFile, false);
  menu.addEventListener("keypress", function(event)
  {
    if(event.keyCode == 13 || event.charCode == 32)
    {
      handlerImportFile();
    }
  }, false);
  this.stepBox1.appendChild(menu);

  var box = bamboo.doc.createElement('hbox');
  box.setAttribute('class', 'bamboo-menu-box');
  menu.appendChild(box);

  var icon = bamboo.doc.createElement('image');
  icon.setAttribute('class', 'bamboo-menu-icon bamboo-menu-icon-import-file');
  box.appendChild(icon);

  var label = bamboo.doc.createElement('label');
  label.setAttribute('class', 'bamboo-menu-label bamboo-font-light');
  label.setAttribute('value', bamboo.utils.str('bamboo.import.button.importfile'));
  box.appendChild(label);

  if(bamboo.isFirefox)
  {
    bamboo.utils.ui.addSpacer(this.stepBox1, true, true);
    bamboo.utils.ui.addSpacer(this.stepBox1, true, true);

    var handlerImportLive = function()
    {
      bamboo.utils.import.run('importLive');
    };

    menu = bamboo.doc.createElement('vbox');
    menu.setAttribute('class', 'bamboo-focusable bamboo-menu bamboo-zone-view');
    menu.addEventListener("click", handlerImportLive, false);
    menu.addEventListener("keypress", function(event)
    {
      if(event.keyCode == 13 || event.charCode == 32)
      {
        handlerImportLive();
      }
    }, false);
    this.stepBox1.appendChild(menu);

    box = bamboo.doc.createElement('hbox');
    box.setAttribute('class', 'bamboo-menu-box');
    menu.appendChild(box);

    icon = bamboo.doc.createElement('image');
    icon.setAttribute('class', 'bamboo-menu-icon bamboo-menu-icon-import-live');
    box.appendChild(icon);

    label = bamboo.doc.createElement('label');
    label.setAttribute('class', 'bamboo-menu-label bamboo-font-light');
    label.setAttribute('value', bamboo.utils.str('bamboo.import.button.importlive'));
    box.appendChild(label);
  }

  bamboo.utils.ui.addSpacer(this.stepBox1, true, true);
  bamboo.utils.ui.addSpacer(this.stepBox1, true, true);

  var handlerExport = function()
  {
    panel.run('exportXML');
  };

  menu = bamboo.doc.createElement('vbox');
  menu.setAttribute('class', 'bamboo-focusable bamboo-menu bamboo-zone-view');
  menu.addEventListener("click", handlerExport, false);
  menu.addEventListener("keypress", function(event)
  {
    if(event.keyCode == 13 || event.charCode == 32)
    {
      handlerExport();
    }
  }, false);
  this.stepBox1.appendChild(menu);

  box = bamboo.doc.createElement('hbox');
  box.setAttribute('class', 'bamboo-menu-box');
  menu.appendChild(box);

  icon = bamboo.doc.createElement('image');
  icon.setAttribute('class', 'bamboo-menu-icon bamboo-menu-icon-export');
  box.appendChild(icon);

  label = bamboo.doc.createElement('label');
  label.setAttribute('class', 'bamboo-menu-label bamboo-font-light');
  label.setAttribute('value', bamboo.utils.str('bamboo.import.button.export'));
  box.appendChild(label);

  bamboo.utils.ui.addSpacer(this.stepBox1, true, true);
};

bamboo.ui.panel.import.prototype.exportXML = function()
{
  bamboo.ui.hidePopup();

  var nsIFilePicker = Components.interfaces.nsIFilePicker;
  var dialog = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
  dialog.init(bamboo.win, bamboo.utils.str('bamboo.export.browse'), nsIFilePicker.modeSave);
  dialog.appendFilter("OPML File","*.xml");

  var res = dialog.show();
  if (res == nsIFilePicker.returnOK || res == nsIFilePicker.returnReplace)
  {
    var dataFile = dialog.file;
    var dataFilePath = dataFile.path;

    if(dataFilePath.substr(dataFilePath.length-4) != '.xml')
    {
      dataFilePath += '.xml';
    }

    if(!bamboo.utils.io.fileExists(dataFilePath))
    {
      this.saveXML(dataFilePath);
    }
    else
    {
      bamboo.ui.showPopup();

      var panel = this;
      var message = bamboo.utils.str('bamboo.export.erasefile');
      var action = bamboo.utils.str('bamboo.export.button.erase');
      bamboo.ui.run('showConfirmDialog', [message, action, null,
      { onValidation: function()
      {
        panel.saveXML(dataFilePath);
      }}]);
    }
  }
};

bamboo.ui.panel.import.prototype.saveXML = function(dataFilePath)
{
  var dataXML = bamboo.data.all.toXml();
  var serializer = new bamboo.serializer();
  var dataString = serializer.serializeToString(dataXML);
  dataString = '<?xml version="1.0" encoding="UTF-8"?>' + dataString;

  bamboo.utils.io.writeToPath(dataFilePath, dataString);

  bamboo.ui.showPopup();
  bamboo.ui.run('showMessageDialog', [bamboo.utils.str('bamboo.export.done')]);
};
