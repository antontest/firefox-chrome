
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.ui.dialog = function(target, bg)
{
  bamboo.ui.component.call(this, target);

  this.focusedElement = null;
  this.focusRestored = true;
  this.firstChoiceFocused = false;
  this.background = null;
  this.box = null;
  this.dialogBox = null;
  this.labelContainer = null;
  this.validationButton = null;
  this.secondaryActionButton = null;
  this.cancelButton = null;

  this.url = null;
  this.message = null;
  this.wait = null;
  this.isTabSelection = false;
  this.isSelection = false;
  this.selectionItems = [];
  this.action = null;
  this.secondaryAction = null;
  this.choices = null;
  this.resultHandler = null;
};

bamboo.extend(bamboo.ui.dialog, bamboo.ui.component);

bamboo.ui.dialog.prototype.setData = function(message, wait, action, choices, resultHandler, url, secondaryAction, isTabSelection, isSelection)
{
  this.url = url;
  this.message = message;
  this.wait = wait;
  this.action = action;
  this.choices = choices;
  this.resultHandler = resultHandler;
  this.secondaryAction = secondaryAction;
  this.isTabSelection = isTabSelection;
  this.isSelection = isSelection;

  this.saveFocusedElement();
};

bamboo.ui.dialog.prototype.saveFocusedElement = function()
{
  if(this.focusRestored)
  {
    this.focusedElement = bamboo.doc.commandDispatcher.focusedElement;
    this.focusRestored = false;
  }
};

bamboo.ui.dialog.prototype.restoreFocusedElement = function()
{
  if(this.focusedElement)
  {
    this.focusRestored = true;
    this.focusedElement.focus();
  }
};

bamboo.ui.dialog.prototype.build = function()
{
  var dlg = this;

  this.background = bamboo.doc.createElement('hbox');
  this.background.setAttribute('id', 'bamboo-dialog-bg');
  this.background.setAttribute('flex', '1');
  this.background.setAttribute('active', 'false');
  this.container.appendChild(this.background);

  this.box = bamboo.doc.createElement('vbox');
  this.box.setAttribute('id', 'bamboo-dialog');
  this.box.setAttribute('flex', '1');
  this.box.setAttribute('active', 'false');
  this.container.appendChild(this.box);

  this.dialogBox = bamboo.doc.createElement('vbox');
  this.dialogBox.setAttribute('id', 'bamboo-dialog-box');
  this.box.appendChild(this.dialogBox);

  var contentBox = bamboo.doc.createElement('vbox');
  contentBox.setAttribute('id', 'bamboo-dialog-content-box');
  contentBox.setAttribute('flex', '1');
  this.dialogBox.appendChild(contentBox);

  this.labelContainer = bamboo.doc.createElement('vbox');
  this.labelContainer.setAttribute('flex', '1');
  this.labelContainer.setAttribute('style', 'overflow-y: auto;');
  contentBox.appendChild(this.labelContainer);

  var ctn = bamboo.doc.createElement('vbox');
  ctn.setAttribute('id', 'bamboo-dialog-container');
  ctn.setAttribute('flex', '1');
  contentBox.appendChild(ctn);

  var dialogButtonBox = bamboo.doc.createElement('hbox');
  dialogButtonBox.setAttribute('id', 'bamboo-dialog-button-box');
  dialogButtonBox.setAttribute('flex', '1');
  this.dialogBox.appendChild(dialogButtonBox);
  bamboo.utils.ui.addSpacer(dialogButtonBox, false);

  this.cancelButton = this.addButton(dialogButtonBox, bamboo.utils.str('bamboo.button.cancel'), function()
  {
    dlg.run('onCancel');
  });
  this.cancelButton.spacer = bamboo.utils.ui.addSpacer(dialogButtonBox, false, true);

  this.secondaryActionButton = this.addButton(dialogButtonBox, '', function()
  {
    dlg.run('onSecondaryAction');
  });
  this.secondaryActionButton.spacer = bamboo.utils.ui.addSpacer(dialogButtonBox, false, true);

  this.validationButton = this.addButton(dialogButtonBox, bamboo.utils.str('bamboo.button.ok'), function()
  {
    dlg.run('onValidation');
  });
  bamboo.utils.ui.addSpacer(dialogButtonBox, false);

  return ctn;
};

bamboo.ui.dialog.prototype.update = function()
{
  this.setVisible(true);
  this.clearContainer();

  if(this.message)
  {
    if(this.message.push)
    {
      for(var i=0; i<this.message.length; i++)
      {
        this.addLabel(this.labelContainer, this.message[i]);
      }
    }
    else
    {
      this.addLabel(this.labelContainer, this.message, true);
    }
  }

  this.dialogBox.setAttribute('web', this.url ? 'true' : 'false');
  this.dialogBox.setAttribute('tab', this.isTabSelection ? 'true' : 'false');
  this.background.setAttribute('tab', this.isTabSelection ? 'true' : 'false');
  this.validationButton.setAttribute('value', this.action == null ? bamboo.utils.str('bamboo.button.ok') : this.action);
  this.validationButton.setAttribute('hidden', this.wait ? 'true' : 'false');
  this.secondaryActionButton.setAttribute('value', this.secondaryAction);
  this.secondaryActionButton.setAttribute('hidden', this.secondaryAction ? 'false' : 'true');
  this.secondaryActionButton.spacer.setAttribute('hidden', this.secondaryAction ? 'false' : 'true');
  this.cancelButton.setAttribute('hidden', !this.wait && this.action == null);
  this.cancelButton.spacer.setAttribute('hidden', this.wait || this.action == null);
  this.childContainer.setAttribute('align', 'left');

  while(this.childContainer.firstChild)
  {
    this.childContainer.removeChild(this.childContainer.firstChild);
  }

  if(this.url)
  {
    this.validationButton.setAttribute('value', bamboo.utils.str('bamboo.button.close'));

    var small = bamboo.ui.rootNode.clientHeight < 550;

    var browser = bamboo.doc.createElement('browser');
    browser.setAttribute('type', 'content');
    browser.setAttribute('src', this.url);
    browser.setAttribute('width', small ? '640' : '854');
    browser.setAttribute('height', small ? '390' : '510');
    this.labelContainer.appendChild(browser);
  }

  this.firstChoiceFocused = false;

  if(this.isTabSelection)
  {
    this.buildTabSelectionUi();
  }
  else if(this.isSelection)
  {
    this.buildSelectionUi();
  }

  if(this.choices)
  {
    var choice;
    for(var id in this.choices)
    {
      choice = this.choices[id];
      if(choice.type == 'radio')
      {
        this.addRadioGroup(choice);

        if(!this.firstChoiceFocused && choice.ui.childNodes.length > 0)
        {
          this.firstChoiceFocused = true;
          choice.ui.childNodes[0].childNodes[0].focus();
        }
        continue;
      }
      if(choice.type == 'label')
      {
        this.addLabel(this.childContainer, choice.value, false, choice.selectable);
        continue;
      }
      if(choice.type == 'combo')
      {
        choice.ui = this.addCombo(this.childContainer, choice.label, choice.values, choice.value);
        continue;
      }
      if(choice.type == 'button')
      {
        var button = bamboo.utils.ui.addButton(this.childContainer, choice.label, function()
        {
          if(choice.handler)
          {
            choice.handler();
          }
        }, true);

        choice.ui = button;

        if(!this.firstChoiceFocused)
        {
          this.firstChoiceFocused = true;
          button.focus();
        }
        continue;
      }
      if(choice.type == 'check')
      {
        var checkbox = bamboo.utils.ui.createCheckbox(choice.value, choice.checked, function(checked){});

        choice.ui = checkbox;

        this.childContainer.appendChild(checkbox);

        if(!this.firstChoiceFocused)
        {
          this.firstChoiceFocused = true;
          checkbox.focus();
        }
        continue;
      }
      if(choice.type == 'input')
      {
        var box = bamboo.doc.createElement('hbox');
        box.setAttribute('flex', '1');
        if(!choice.multiline)
        {
          box.setAttribute('class', 'bamboo-center-box');
        }
        this.childContainer.appendChild(box);

        var textBox = bamboo.doc.createElement('textbox');
        textBox.setAttribute('class', 'bamboo-input bamboo-dialog-input');
        textBox.setAttribute('value', choice.value);
        textBox.setAttribute('multiline', choice.multiline);
        textBox.addEventListener('keypress', this.onInputKeyPress, false);

        choice.ui = textBox;

        if(choice.desc)
        {
          choice.ui.label = this.addLabel(box, choice.desc);
        }

        box.appendChild(textBox);

        if(!this.firstChoiceFocused)
        {
          this.firstChoiceFocused = true;

          try
          {
            textBox.focus();
            textBox.select();
          }
          catch(e) {}
        }
        continue;
      }
      if(choice.type == 'list')
      {
        this.createListUi(this.childContainer, choice);
      }
    }
  }

  if(!this.firstChoiceFocused)
  {
    var button = this.wait ? this.cancelButton : this.validationButton;
    if(this.secondaryAction)
    {
      button = this.secondaryActionButton;
    }
    button.focus();
  }
};

bamboo.ui.dialog.prototype.clearContainer = function()
{
  if(this.choices)
  {
    var choice;
    for(var id in this.choices)
    {
      choice = this.choices[id];
      if(choice.ui && choice.type == 'input')
      {
        choice.ui.removeEventListener('keypress', this.onInputKeyPress, false);
      }
    }
  }

  while(this.labelContainer.firstChild)
  {
    this.labelContainer.removeChild(this.labelContainer.firstChild);
  }
};

bamboo.ui.dialog.prototype.buildSelectionUi = function()
{
  this.selectionItems = bamboo.data.all.getDataList();

  this.childContainer.setAttribute('align', 'center');

  var b = bamboo.doc.createElement('hbox');
  b.setAttribute('flex', '1');
  this.childContainer.appendChild(b);

  var box = bamboo.doc.createElement('vbox');
  box.setAttribute('class', 'bamboo-dialog-selection-box');
  b.appendChild(box);

  var itemBox = bamboo.doc.createElement('vbox');
  itemBox.setAttribute('class', 'bamboo-dialog-selection-item-box');

  var textBox = bamboo.doc.createElement('textbox');
  textBox.setAttribute('class', 'bamboo-input bamboo-dialog-input');
  textBox.addEventListener('keypress', function(event)
  {
    if(event.keyCode == 13)
    {
      event.stopPropagation();
      event.preventDefault();

      bamboo.ui.dlg.run('onSelectionFirst', [itemBox]);
    }
  }, false);
  textBox.addEventListener('keyup', function(event)
  {
    if(event.keyCode != 13)
    {
      bamboo.ui.dlg.run('onSelectionInputChange', [textBox, itemBox]);
    }
  }, false);

  box.appendChild(textBox);
  box.appendChild(itemBox);

  try
  {
    textBox.focus();
    textBox.select();
  }
  catch(e) {}
  this.firstChoiceFocused = true;
};

bamboo.ui.dialog.prototype.onSelectionInputChange = function(textBox, itemBox)
{
  while(itemBox.firstChild)
  {
    itemBox.removeChild(itemBox.firstChild);
  }

  var results = [];
  var value = new String(textBox.value).trim().toLowerCase();

  if(value.length > 1)
  {
    for(var i=0; i<this.selectionItems.length; i++)
    {
      if(this.selectionItems[i].label.toLowerCase().indexOf(value) >= 0)
      {
        results.push(this.selectionItems[i]);
      }
    }
  }

  var addResultItem = function(resultItem)
  {
    var comboItemContainer = bamboo.doc.createElement('hbox');
    comboItemContainer.setAttribute('class', 'bamboo-combo-item-container');

    var comboItem = bamboo.doc.createElement('vbox');
    comboItem.setAttribute('flex', '1');
    comboItem.setAttribute('class', 'bamboo-focusable bamboo-combo-item');
    comboItem.setAttribute('value', resultItem.value);
    comboItem.setAttribute('bamboo-value', resultItem.value);

    var comboItemLabel = bamboo.doc.createElement('label');
    comboItemLabel.setAttribute('class', 'bamboo-combo-item-label');
    comboItemLabel.setAttribute('value', resultItem.label);
    comboItem.appendChild(comboItemLabel);

    comboItem.addEventListener("click", function(event)
    {
      if(event.button < 2)
      {
        bamboo.ui.dlg.run('onSelection', [comboItem.getAttribute('bamboo-value')]);
      }
    }, false);
    comboItem.addEventListener("keypress", function(event)
    {
      if(event.keyCode == 13 || event.charCode == 32)
      {
        event.stopPropagation();

        bamboo.ui.dlg.run('onSelection', [comboItem.getAttribute('bamboo-value')]);
      }
    }, false);

    comboItemContainer.appendChild(comboItem);
    itemBox.appendChild(comboItemContainer);
  };

  for(i=0; i<results.length; i++)
  {
    addResultItem(results[i]);
  }
};

bamboo.ui.dialog.prototype.onSelectionFirst = function(itemBox)
{
  if(itemBox.firstChild && itemBox.firstChild.firstChild)
  {
    var id = itemBox.firstChild.firstChild.getAttribute('bamboo-value');

    this.onSelection(id);
  }
};

bamboo.ui.dialog.prototype.onSelection = function(id)
{
  var target = bamboo.factory.getData(id);

  if(target)
  {
    bamboo.selectItem(target);

    this.onCancel();
  }
};

bamboo.ui.dialog.prototype.buildTabSelectionUi = function()
{
  var container = bamboo.doc.createElement('vbox');
  container.setAttribute('class', 'bamboo-dialog-tab-container');
  this.labelContainer.appendChild(container);

  var count = bamboo.ui.panel.history.length;
  for(var i=0; i<count; i++)
  {
    var tabName = bamboo.ui.panel.history[i];

    var tab = bamboo.doc.createElement('hbox');
    tab.setAttribute('class', 'bamboo-dialog-tab-box');
    tab.setAttribute('name', tabName);
    tab.setAttribute('selected', i == (bamboo.ui.selectingTabCount % count) ? 'true' : 'false');
    container.appendChild(tab);

    var box = bamboo.doc.createElement('vbox');
    box.setAttribute('class', 'bamboo-dialog-tab-image-box');
    tab.appendChild(box);

    var img = bamboo.doc.createElement('image');
    img.setAttribute('class', 'bamboo-tab-image bamboo-tab-image-' + tabName);
    box.appendChild(img);

    var label = bamboo.doc.createElement('label');
    label.setAttribute('class', 'bamboo-dialog-tab-label bamboo-font-light');
    label.setAttribute('value', bamboo.utils.str('bamboo.menu.' + tabName + '.label'));
    tab.appendChild(label);
  }
};

bamboo.ui.dialog.prototype.addRadioGroup = function(choice)
{
  var items = [];
  var maxLength = 85;

  for(var i=0; i<choice.values.length; i++)
  {
    var label = choice.values[i] && choice.values[i].length > maxLength ? choice.values[i].substr(0, maxLength) + '...' : choice.values[i];
    items.push({label: label, value: i});
  }

  var box = bamboo.doc.createElement('hbox');

  var group = bamboo.utils.ui.createRadioGroup(items, choice.initValue ? choice.initValue : 0, !choice.isHorizontal, function(value)
  {
    group.setAttribute('current-value', value);
  });
  group.setAttribute('current-value', choice.initValue ? choice.initValue : '0');

  choice.ui = group;
  box.appendChild(group);
  this.childContainer.appendChild(box);
};

bamboo.ui.dialog.prototype.addButton = function(container, name, handler)
{
  var label = bamboo.doc.createElement('label');
  label.setAttribute('class', 'bamboo-dialog-button');
  label.setAttribute('value', name);
  label.addEventListener("click", function(event)
  {
    event.stopPropagation();
    event.preventDefault();

    handler();
  }, false);
  label.addEventListener("keypress", function(event)
  {
    if(event.keyCode == 13 || event.charCode == 32)
    {
      event.stopPropagation();
      event.preventDefault();

      handler();
    }
  }, false);
  return container.appendChild(label);
};

bamboo.ui.dialog.prototype.addLabel = function(container, value, isTitle, isSelectable)
{
  if(value)
  {
    var values = new String(value).split('\n');
    var count = values.length;
    var label = null;

    for(var i=0; i<count; i++)
    {
      var cssClass = isTitle && i == 0 ?  'bamboo-label bamboo-dialog-label bamboo-dialog-label-title' : 'bamboo-label bamboo-dialog-label';
      if(isSelectable)
      {
        cssClass += ' bamboo-selectable-text';

        label = bamboo.doc.createElement('html:div');
        label.setAttribute('class', cssClass);
        label.setAttribute('type', 'content');
        label.setAttribute('flex', '1');
        label.textContent = values[i];
      }
      else
      {
        label = bamboo.doc.createElement('description');
        label.setAttribute('class', cssClass);
        label.setAttribute('value', values[i]);
      }
      container.appendChild(label);
    }

    return label;
  }
  else
  {
    bamboo.utils.ui.addSpacer(container, true, true);
  }
};

bamboo.ui.dialog.prototype.addCombo = function(container, label, items, value)
{
  var itemCount = items.length;
  var selectedItem = null;
  for(var i=0; i<itemCount; i++)
  {
    if(items[i].value == value)
    {
      selectedItem = items[i];
      break;
    }
  }

  var box = bamboo.doc.createElement('hbox');
  box.setAttribute('class', 'bamboo-center-box');
  this.addLabel(box, label);

  var combo = bamboo.doc.createElement('vbox');
  combo.setAttribute('class', 'bamboo-combo-box');
  combo.setAttribute('bamboo-value', selectedItem.value);
  box.appendChild(combo);

  var toggleOpenHandler = function()
  {
    combo.setAttribute('open', combo.getAttribute('open') == 'true' ? 'false' : 'true');

    combo.firstChild.focus();
  };

  var comboCurrentItem = bamboo.utils.ui.addButton(combo, selectedItem.label, toggleOpenHandler);

  var spacer = bamboo.doc.createElement('spacer');
  spacer.setAttribute('flex', '1');
  comboCurrentItem.appendChild(spacer);

  var img = bamboo.doc.createElement('image');
  img.setAttribute('class', 'bamboo-icon-open-combo');
  comboCurrentItem.appendChild(img);

  var selectHandler = function(itemNode)
  {
    var cb = itemNode.parentNode.parentNode.parentNode;
    var currentItemLabel = cb.firstChild.firstChild;
    currentItemLabel.setAttribute('value', itemNode.getAttribute('value'));
    cb.setAttribute('bamboo-value', itemNode.getAttribute('bamboo-value'));

    toggleOpenHandler();
  };

  var comboList = bamboo.doc.createElement('vbox');
  comboList.setAttribute('class', 'bamboo-combo-list');
  combo.appendChild(comboList);

  var addComboItem = function(item)
  {
    var comboItemContainer = bamboo.doc.createElement('hbox');
    comboItemContainer.setAttribute('flex', '1');
    comboItemContainer.setAttribute('class', 'bamboo-combo-item-container');

    var comboItem = bamboo.doc.createElement('vbox');
    comboItem.setAttribute('flex', '1');
    comboItem.setAttribute('class', 'bamboo-focusable bamboo-combo-item');
    comboItem.setAttribute('value', item.label);
    comboItem.setAttribute('bamboo-value', item.value);

    var comboItemLabel = bamboo.doc.createElement('label');
    comboItemLabel.setAttribute('class', 'bamboo-combo-item-label');
    comboItemLabel.setAttribute('value', item.label);
    comboItem.appendChild(comboItemLabel);

    comboItem.addEventListener("click", function(event)
    {
      if(event.button < 2)
      {
        selectHandler(comboItem);
      }
    }, false);
    comboItem.addEventListener("keypress", function(event)
    {
      if(event.keyCode == 13 || event.charCode == 32)
      {
        selectHandler(comboItem);
      }
    }, false);

    comboItemContainer.appendChild(comboItem);
    comboList.appendChild(comboItemContainer);
  };

  for(i=0; i<itemCount; i++)
  {
    addComboItem(items[i]);
  }

  container.appendChild(box);

  if(!this.firstChoiceFocused)
  {
    this.firstChoiceFocused = true;
    combo.firstChild.focus();
  }

  return combo;
};

bamboo.ui.dialog.prototype.createListUi = function(container, choice)
{
  container.setAttribute('align', 'center');

  var box = bamboo.doc.createElement('hbox');

  var list = bamboo.doc.createElement('vbox');
  list.setAttribute('class', 'bamboo-ui-list');
  choice.ui = list;

  var items = [];
  var selectedValue = '';
  for(var i=0; i<choice.values.length; i++)
  {
    if(i == 0)
    {
      selectedValue = choice.values[i];
    }
    items.push({label: choice.values[i], value: choice.values[i]});
  }

  list.setAttribute('bamboo-selection', selectedValue);

  var radio = bamboo.utils.ui.createRadioGroup(items, selectedValue, true, function(value)
  {
    list.setAttribute('bamboo-selection', value);
    editButton.setAttribute('hidden', 'false');
    removeButton.setAttribute('hidden', 'false');
  });

  list.appendChild(radio);
  box.appendChild(list);
  container.appendChild(box);

  var buttonBox = bamboo.doc.createElement('hbox');
  container.appendChild(buttonBox);

  var dlg = this;
  var editButton = bamboo.utils.ui.addButton(buttonBox, bamboo.utils.str('bamboo.button.editselection'), function()
  {
    if(choice.editHandler)
    {
      choice.editHandler(list.getAttribute('bamboo-selection'), dlg.getListFromUi(list));
    }
  }, true);
  editButton.setAttribute('hidden', selectedValue ? 'false' : 'true');

  var removeButton = bamboo.utils.ui.addButton(buttonBox, bamboo.utils.str('bamboo.button.deleteselection'), function()
  {
    for(var n=0; n<list.firstChild.childNodes.length; n++)
    {
      var containerNode = list.firstChild.childNodes[n];
      var childCount = containerNode.childNodes.length;
      for(var i=0; i<childCount; i++)
      {
        if(containerNode.childNodes[i].getAttribute('bamboo-checked') == 'true')
        {
          containerNode.removeChild(containerNode.childNodes[i]);
          var targetIndex = i;

          if(childCount > 1)
          {
            if(targetIndex >= (childCount-1))
            {
              targetIndex = containerNode.childNodes.length - 1;
            }

            containerNode.childNodes[targetIndex].setAttribute('bamboo-checked', 'true');
            list.setAttribute('bamboo-selection', containerNode.childNodes[targetIndex].getAttribute('bamboo-value'));
          }
          else
          {
            list.setAttribute('bamboo-selection', '');
            editButton.setAttribute('hidden', 'true');
            removeButton.setAttribute('hidden', 'true');
          }
          break;
        }
      }
    }
  }, true);
  removeButton.setAttribute('hidden', selectedValue ? 'false' : 'true');

  if(!this.firstChoiceFocused && choice.values.length > 0)
  {
    this.firstChoiceFocused = true;
    radio.childNodes[0].childNodes[0].focus();
  }
};

bamboo.ui.dialog.prototype.getListFromUi = function(ui)
{
  var list = [];
  var count = ui.firstChild.childNodes.length;
  for(var i=0; i<count; i++)
  {
    var container = ui.firstChild.childNodes[i];
    for(var n=0; n<container.childNodes.length; n++)
    {
      list.push(container.childNodes[n].getAttribute('bamboo-value'));
    }
  }
  return list;
};

bamboo.ui.dialog.prototype.setVisible = function(visible)
{
  this.container.setAttribute('dialog', visible);
};

bamboo.ui.dialog.prototype.validateInput = function()
{
  var valid = true;
  var choice;
  for(var id in this.choices)
  {
    choice = this.choices[id];
    if(choice.type == 'input' && choice.mandatory)
    {
      if(choice.ui.value.trim() == '')
      {
        choice.ui.label.setAttribute('invalid', 'true');
        valid = false;
      }else{
        choice.ui.label.setAttribute('invalid', 'false');
      }
    }
  }
  return valid;
};

bamboo.ui.dialog.prototype.onValidation = function()
{
  if(!this.validateInput())
  {
    return;
  }

  this.setVisible(false);
  this.clearContainer();
  this.restoreFocusedElement();

  if(this.resultHandler && this.resultHandler.onValidation)
  {
    var result = null;
    if(this.choices)
    {
      result = {};

      for(var id in this.choices)
      {
        var choice = this.choices[id];
        if(choice.type == 'radio')
        {
          result[id] = choice.ui.getAttribute('current-value');
          continue;
        }
        if(choice.type == 'check')
        {
          result[id] = choice.ui.getAttribute('bamboo-checked') == 'true';
          continue;
        }
        if(choice.type == 'combo')
        {
          result[id] = choice.ui.getAttribute('bamboo-value');
          continue;
        }
        if(choice.type == 'input')
        {
          result[id] = choice.ui.value;
          continue;
        }
        if(choice.type == 'list')
        {
          result[id] = this.getListFromUi(choice.ui);
        }
      }
    }
    this.resultHandler.onValidation(result);
  }
};

bamboo.ui.dialog.prototype.onSecondaryAction = function()
{
  this.setVisible(false);
  this.clearContainer();
  this.restoreFocusedElement();

  if(this.resultHandler.onSecondaryAction)
  {
    this.resultHandler.onSecondaryAction();
  }
};

bamboo.ui.dialog.prototype.onInputKeyPress = function(event)
{
  if(bamboo.ui.dlg)
  {
    event.stopPropagation();

    if(event.keyCode == 13 && (!event.currentTarget || event.currentTarget.getAttribute('multiline') != 'true'))
    {
      bamboo.ui.dlg.run('onValidation');
    }
    else if(event.keyCode == 27)
    {
      bamboo.ui.dlg.run('onCancel');
    }
  }
};

bamboo.ui.dialog.prototype.onCancel = function()
{
  this.setVisible(false);
  this.clearContainer();
  this.restoreFocusedElement();

  if(this.resultHandler && this.resultHandler.onCancel)
  {
    this.resultHandler.onCancel();
  }
};

