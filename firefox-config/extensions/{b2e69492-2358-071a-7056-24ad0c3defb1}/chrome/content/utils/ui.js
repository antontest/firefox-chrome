
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.utils.ui =
{
  createSharingBox: function(title, url, content, handlerSave, handlerMail, openLink)
  {
    var div = bamboo.doc.createElement('html:div');
    div.setAttribute('class', 'bamboo-sharing-box');
    div.setAttribute('type', 'content');

    var table = bamboo.doc.createElementNS("http://www.w3.org/1999/xhtml", 'table');
    table.setAttribute('class', 'bamboo-sharing-table');
    table.setAttribute('width', '100%');
    div.appendChild(table);

    var row = bamboo.doc.createElementNS("http://www.w3.org/1999/xhtml", 'tr');
    table.appendChild(row);

    var cell = bamboo.doc.createElementNS("http://www.w3.org/1999/xhtml", 'td');
    cell.setAttribute('valign', 'top');
    row.appendChild(cell);

    var span = bamboo.doc.createElementNS("http://www.w3.org/1999/xhtml", 'span');
    span.textContent = bamboo.utils.str('bamboo.message.share');
    cell.appendChild(span);

    var container = bamboo.doc.createElementNS("http://www.w3.org/1999/xhtml", 'td');
    container.setAttribute('class', 'bamboo-sharing-cell');
    container.setAttribute('width', '100%');
    row.appendChild(container);

    cell = bamboo.doc.createElementNS("http://www.w3.org/1999/xhtml", 'td');
    cell.textContent = ' ';
    row.appendChild(cell);

    cell = bamboo.doc.createElementNS("http://www.w3.org/1999/xhtml", 'td');
    cell.setAttribute('valign', 'top');
    row.appendChild(cell);

    var mailLink = bamboo.doc.createElementNS("http://www.w3.org/1999/xhtml", 'span');
    mailLink.textContent = bamboo.utils.str('bamboo.message.sharebymail');
    mailLink.setAttribute("class", 'bamboo-sharing-mail');
    mailLink.addEventListener("click", handlerMail, false);
    mailLink.addEventListener("keypress", function(event)
    {
      if(event.keyCode == 13 || event.charCode == 32)
      {
        event.stopPropagation();
        event.preventDefault();

        handlerMail();
      }
    }, false);
    cell.appendChild(mailLink);

    if(handlerSave)
    {
      cell = bamboo.doc.createElementNS("http://www.w3.org/1999/xhtml", 'td');
      cell.textContent = ' ';
      row.appendChild(cell);

      cell = bamboo.doc.createElementNS("http://www.w3.org/1999/xhtml", 'td');
      cell.setAttribute('valign', 'top');
      row.appendChild(cell);

      var saveLink = bamboo.doc.createElementNS("http://www.w3.org/1999/xhtml", 'span');
      saveLink.textContent = bamboo.utils.str('bamboo.message.save');
      saveLink.setAttribute("class", 'bamboo-sharing-save');
      saveLink.addEventListener("click", handlerSave, false);
      saveLink.addEventListener("keypress", function(event)
      {
        if(event.keyCode == 13 || event.charCode == 32)
        {
          event.stopPropagation();
          event.preventDefault();

          handlerSave();
        }
      }, false);
      cell.appendChild(saveLink);
    }

    var links = bamboo.utils.sharing.getLinks();
    for(var i=0; i<links.length; i++)
    {
      this.createSharingLink(links[i], title, url, content, container, openLink);
    }

    return div;
  },

  createSharingLink: function(link, title, url, content, container, openLink)
  {
    var handlerShare = function()
    {
      openLink(link.url.replace('%url%', url).replace('%title%', title), true);
    };

    var box = bamboo.doc.createElement('hbox');

    if(link.id)
    {
      box.setAttribute('class', 'bamboo-sharing-link-box bamboo-sharing-link-hidden bamboo-sharing-link-' + link.id);
    }
    else
    {
      box.setAttribute('class', 'bamboo-sharing-link-box');
    }
    container.appendChild(box);

    var icon = bamboo.doc.createElement('image');
    icon.setAttribute('class', 'bamboo-sharing-link-icon');
    box.appendChild(icon);

    if(link.icon)
    {
      icon.setAttribute('src', link.icon);
    }
    else
    {
      bamboo.utils.getIconFromUrl([link.url], function(source)
      {
        try
        {
          if(source)
          {
            icon.setAttribute('src', source);
          }
          else
          {
            icon.setAttribute('src', 'http://www.google.com/s2/favicons?domain_url=' + link.url.replace('%url%', 'url').replace('%title%', 'title'));
          }
        }
        catch(ex) {}
      });
    }

    var div = bamboo.doc.createElement('html:div');
    div.setAttribute('class', 'bamboo-sharing-link-label bamboo-sharing-link-label-' + link.id);
    div.setAttribute('type', 'content');
    box.appendChild(div);

    var href = link.url.replace('%url%', encodeURIComponent(url)).replace('%title%', encodeURIComponent(title)).replace('%html%', encodeURIComponent(content));
    if(href.indexOf('%html%') > 0)
    {
      href = href.replace('%html%', content.length > 900 ? encodeURIComponent(content.substr(0, 900)) : encodeURIComponent(content));
    }
    if(href.indexOf('%text%') > 0)
    {
      var contentParam = bamboo.utils.clearString(content);
      if(contentParam.length > 900)
      {
        contentParam = contentParam.substr(0, 900);
      }
      href = href.replace('%text%', encodeURIComponent(contentParam));
    }

    var linkNode = bamboo.doc.createElementNS("http://www.w3.org/1999/xhtml", 'a');
    linkNode.setAttribute('href', href);
    linkNode.setAttribute('target', '_blank');
    linkNode.textContent = link.name;
    div.appendChild(linkNode);

    linkNode.addEventListener("click", function(event)
    {
      if(!bamboo.ui.isInTab() || bamboo.option.get('force-tab-in-background') == 'true')
      {
        event.stopPropagation();
        event.preventDefault();

        if(event.button < 2)
        {
          handlerShare();
        }
      }
      else if(!bamboo.isFirefox && bamboo.option.get('thunderbird-link-in-tab') == 'true')
      {
        event.stopPropagation();
        event.preventDefault();

        handlerShare();
      }
    }, false);
    linkNode.addEventListener("mouseup", function(event)
    {
      if(!bamboo.ui.isInTab() && event.button == 1)
      {
        event.stopPropagation();
        event.preventDefault();

        handlerShare();
      }
    }, false);
    linkNode.addEventListener("keypress", function(event)
    {
      if(event.keyCode == 13 || event.charCode == 32)
      {
        event.stopPropagation();
        event.preventDefault();

        handlerShare();
      }
    }, false);
  },

  createCheckbox: function(label, checked, handler)
  {
    var checkbox = bamboo.doc.createElement('hbox');
    checkbox.setAttribute('class', 'bamboo-focusable bamboo-ui-component bamboo-ui-checkbox');
    checkbox.setAttribute('bamboo-checked', checked);

    var checkboxIcon = bamboo.doc.createElement('vbox');
    checkboxIcon.setAttribute('class', 'bamboo-ui-checkbox-icon');
    checkbox.appendChild(checkboxIcon);

    var checkboxLabel = bamboo.doc.createElement('label');
    checkboxLabel.textContent = label;
    checkbox.appendChild(checkboxLabel);

    checkbox.addEventListener("click", function(event)
    {
      if(checkbox.getAttribute('disabled') != 'true')
      {
        event.stopPropagation();
        event.preventDefault();

        var isChecked = checkbox.getAttribute('bamboo-checked') == 'true';
        checkbox.setAttribute('bamboo-checked', !isChecked);

        handler(!isChecked);
      }
    }, false);

    checkbox.addEventListener("keypress", function(event)
    {
      if(checkbox.getAttribute('disabled') != 'true' && (event.keyCode == 13 || event.charCode == 32))
      {
        event.stopPropagation();
        event.preventDefault();

        var isChecked = checkbox.getAttribute('bamboo-checked') == 'true';
        checkbox.setAttribute('bamboo-checked', !isChecked);

        handler(!isChecked);
      }
    }, false);

    return checkbox;
  },

  createRadioGroup: function(items, value, isVertical, handler)
  {
    var radioGroup = bamboo.doc.createElement('vbox');
    radioGroup.setAttribute('class', 'bamboo-ui-radiogroup');

    var itemBox = bamboo.doc.createElement('box');
    itemBox.setAttribute('class', 'bamboo-ui-radiogroup-row');
    itemBox.setAttribute('vertical', isVertical ? 'true' : 'false');
    radioGroup.appendChild(itemBox);

    for(var i=0; i<items.length; i++)
    {
      var item = items[i];

      if(item)
      {
        this.addRadioGroupItem(itemBox, item, value, handler);
      }
      else
      {
        itemBox = bamboo.doc.createElement('hbox');
        itemBox.setAttribute('class', 'bamboo-ui-radiogroup-row');
        itemBox.setAttribute('vertical', isVertical ? 'true' : 'false');
        radioGroup.appendChild(itemBox);
      }
    }

    return radioGroup;
  },

  addRadioGroupItem: function(radioGroup, item, value, handler)
  {
    var radioGroupItem = bamboo.doc.createElement('hbox');
    radioGroupItem.setAttribute('class', 'bamboo-focusable bamboo-ui-component bamboo-ui-radiogroup-item');
    radioGroupItem.setAttribute('bamboo-value', item.value);
    radioGroupItem.setAttribute('bamboo-checked', item.value == value);
    radioGroup.appendChild(radioGroupItem);

    if(item.tooltip)
    {
      radioGroupItem.setAttribute('tooltiptext', item.tooltip);
    }

    var radioGroupIcon = bamboo.doc.createElement('vbox');
    radioGroupIcon.setAttribute('class', 'bamboo-ui-radiogroup-icon');
    radioGroupItem.appendChild(radioGroupIcon);

    var radioGroupLabel = bamboo.doc.createElement('label');
    radioGroupLabel.textContent = item.label;
    radioGroupItem.appendChild(radioGroupLabel);

    radioGroupItem.addEventListener("click", function(event)
    {
      event.stopPropagation();
      event.preventDefault();

      var isChecked = radioGroupItem.getAttribute('bamboo-checked') == 'true';
      if(!isChecked && radioGroupItem.parentNode.parentNode.getAttribute('disabled') != 'true')
      {
        for(var i=0; i<radioGroupItem.parentNode.parentNode.childNodes.length; i++)
        {
          for(var n=0; n<radioGroupItem.parentNode.parentNode.childNodes[i].childNodes.length; n++)
          {
            radioGroupItem.parentNode.parentNode.childNodes[i].childNodes[n].setAttribute('bamboo-checked', 'false');
          }
        }
        radioGroupItem.setAttribute('bamboo-checked', 'true');

        handler(radioGroupItem.getAttribute('bamboo-value'));
      }
    }, false);

    radioGroupItem.addEventListener("keypress", function(event)
    {
      if(event.keyCode == 13 || event.charCode == 32)
      {
        event.stopPropagation();
        event.preventDefault();

        var isChecked = radioGroupItem.getAttribute('bamboo-checked') == 'true';

        if(!isChecked && radioGroupItem.parentNode.parentNode.getAttribute('disabled') != 'true')
        {
          for(var i=0; i<radioGroupItem.parentNode.parentNode.childNodes.length; i++)
          {
            for(var n=0; n<radioGroupItem.parentNode.parentNode.childNodes[i].childNodes.length; n++)
            {
              radioGroupItem.parentNode.parentNode.childNodes[i].childNodes[n].setAttribute('bamboo-checked', 'false');
            }
          }
          radioGroupItem.setAttribute('bamboo-checked', 'true');

          handler(radioGroupItem.getAttribute('bamboo-value'));
        }
      }
    }, false);
  },

  addSpacer : function(target, isVertical, noFlex, isMini)
  {
    var css = isVertical ? 'v' : 'h';
    css = 'bamboo-spacer-' + css;
    var sp = bamboo.doc.createElement('spacer');
    sp.setAttribute('class', isMini ? css + '-mini' : css);
    if(!noFlex)
    {
      sp.setAttribute('flex', '1');
    }
    return target.appendChild(sp);
  },

  addButton : function(target, name, handler, small)
  {
    var button = bamboo.doc.createElement('hbox');
    button.addEventListener("click", handler, false);
    button.addEventListener("keypress", function(event)
    {
      if(event.keyCode == 13 || event.charCode == 32)
      {
        handler();
      }
    }, false);
    button.setAttribute('class', 'bamboo-focusable bamboo-button-box');

    var label = bamboo.doc.createElement('label');
    var cssClass = small ? ' bamboo-button-label-small' : '';
    label.setAttribute('class', 'bamboo-button-label' + cssClass);
    label.setAttribute('value', name);
    button.appendChild(label);

    return target.appendChild(button);
  },

  addMenuButton : function(container, tooltip, cssClass, handler, focusable)
  {
    var button = bamboo.doc.createElement('vbox');
    button.setAttribute('class', 'bamboo-view-menu-button');
    button.setAttribute('tooltiptext', tooltip);
    button.addEventListener("click", handler, false);

    if(focusable)
    {
      button.setAttribute('class', 'bamboo-focusable bamboo-ui-component bamboo-view-menu-button');
      button.addEventListener("keypress", function(event)
      {
        if(event.charCode == 32)
        {
          event.stopPropagation();
          event.preventDefault();

          handler();
        }
      }, false);
    }

    var img = bamboo.doc.createElement('image');
    img.setAttribute('class', 'bamboo-view-menu-button-icon ' + cssClass);
    button.appendChild(img);

    container.appendChild(button);

    return button;
  },

  addButton2 : function(container, name, cssClass, handler, noLabel, noBorder)
  {
    var button = bamboo.doc.createElement('hbox');
    button.setAttribute('class', 'bamboo-view-menu-button-box');
    button.setAttribute('tooltiptext', name);
    button.addEventListener("click", handler, false);

    if(noBorder)
    {
      button.setAttribute('noborder', 'true');
    }

    if(cssClass != null)
    {
      var box = bamboo.doc.createElement('vbox');
      button.appendChild(box);

      var img = bamboo.doc.createElement('image');
      img.setAttribute('class', 'bamboo-icon ' + cssClass);
      box.appendChild(img);
    }

    if(!noLabel)
    {
      var label = bamboo.doc.createElement('label');
      label.setAttribute('class', 'bamboo-view-menu-button-label');
      label.setAttribute('value', name);
      button.appendChild(label);
      button['label'] = label;
    }

    container.appendChild(button);

    return button;
  }
};
