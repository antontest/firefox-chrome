
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.ui.view.item = function(id, isSearch)
{
  bamboo.ui.view.base.call(this, id, bamboo.ui.panel.get(isSearch ? 'search' : 'reader').zoneViewData.childContainer);

  this.box = null;
  this.titleBox = null;
  this.titleNode = null;
  this.contentBox = null;
  this.sharingBox = null;
  this.tag = null;

  this.boxAdded = false;
  this.titleBoxAdded = false;
  this.contentBoxAdded = false;
  this.htmlContentCreated = false;

  this.search = isSearch;
  this.preview = false;
  this.sharing = false;
};

bamboo.extend(bamboo.ui.view.item, bamboo.ui.view.base);

bamboo.ui.view.item.prototype.show = function(index)
{
  if(!this.built)
  {
    this.build(index);
    this.built = true;
  }

  if(!this.boxAdded)
  {
    this.addBox(index);
  }
  if(!this.titleBoxAdded)
  {
    this.addItem(true);
  }
  if(this.preview || bamboo.option.get('content-mode') == 'true')
  {
    this.addItem(false);
  }

  return this.childContainer;
};

bamboo.ui.view.item.prototype.build = function(index)
{
  var view = this;
  var data = this.getData();
  var isSearch = this.search;

  var handlerSelect = function()
  {
    if(data.getParent() == bamboo.data.lib)
    {
      bamboo.run('selectFeedByURL', [data.feedURL]);
    }
    else
    {
      bamboo.run(isSearch ? 'selectSearchItem' : 'selectItem', [data.getParent()]);
    }
  };

  var handlerOpen = function(event, fromKey, ctrlKey)
  {
    handlerHideTooltip();

    if(event.button < 2 || fromKey)
    {
      if(bamboo.option.get('content-mode') == 'false' && !view.preview && bamboo.option.get('force-open') != 'true')
      {
        event.stopPropagation();
        event.preventDefault();

        view.run('openPreview');
      }
      else
      {
        if(fromKey || !bamboo.ui.isInTab() || bamboo.option.get('force-tab-in-background') == 'true' || (!bamboo.isFirefox && bamboo.option.get('thunderbird-link-in-tab') == 'true'))
        {
          event.stopPropagation();
          event.preventDefault();

          view.run('openLink', [data.url, ctrlKey || event.button == 1]);
        }

        if(!data.readed)
        {
          data.run('toggleReaded');

          if(!isSearch)
          {
            if(bamboo.data.page.getFilterByName('new').active && (!bamboo.data.page.getFilterByName('search').active || bamboo.data.page.getFilterByName('search').matchFilters))
            {
              if(bamboo.doc.commandDispatcher.focusedElement == view.box)
              {
                bamboo.ui.run('onCommandFocusNext');
              }

              bamboo.data.page.hideItem(data);
              data.getParent().updateVisibleItemsCount(true);

              if(bamboo.doc.commandDispatcher.focusedElement)
              {
                bamboo.doc.commandDispatcher.focusedElement.scrollIntoView(true);
              }
            }
            bamboo.ui.panel.get('reader').zoneViewMenu.update();
            bamboo.data.run('save');
          }
        }
      }
    }
  };

  var handlerOpen2 = function(event)
  {
    handlerHideTooltip();

    if(event.button < 2)
    {
      if(bamboo.option.get('content-mode') == 'false' && !view.preview && bamboo.option.get('force-open') != 'true' && event.button < 1)
      {
        event.stopPropagation();
        event.preventDefault();
      }
      else
      {
        if(!bamboo.ui.isInTab() || (!bamboo.isFirefox && bamboo.option.get('thunderbird-link-in-tab') == 'true'))
        {
          event.stopPropagation();
          event.preventDefault();
        }

        var unread = !data.readed;
        if(unread)
        {
          data.run('toggleReaded');
        }

        if(!isSearch && unread && (bamboo.data.page.getFilterByName('new').active && (!bamboo.data.page.getFilterByName('search').active || bamboo.data.page.getFilterByName('search').matchFilters)))
        {
          if(bamboo.doc.commandDispatcher.focusedElement == view.box)
          {
            bamboo.ui.run('onCommandFocusNext');
          }
          else
          {
            bamboo.ui.rootNode.focus();
          }

          bamboo.data.page.hideItem(data);
          data.getParent().updateVisibleItemsCount(true);

          view.run('openLink', [data.url, event.button == 1]);

          if(bamboo.doc.commandDispatcher.focusedElement)
          {
            bamboo.doc.commandDispatcher.focusedElement.scrollIntoView(true);
          }
        }
        else
        {
          bamboo.ui.rootNode.focus();

          if((!bamboo.ui.isInTab() && event.button == 1))
          {
            view.run('openLink', [data.url, event.button == 1]);
          }
        }

        if(unread)
        {
          bamboo.ui.panel.get('reader').zoneViewMenu.update();
          bamboo.data.run('save');
        }
      }
    }
  };

  var handlerOpenNoLink = function(event)
  {
    if(event.button < 2 && bamboo.option.get('content-mode') == 'false' && !view.preview)
    {
      view.run('openPreview');
    }
  };

  this.box = bamboo.doc.createElement('vbox');
  this.box.setAttribute('class', 'bamboo-focusable bamboo-view-item-box');
  this.box.setAttribute('preview', this.preview);
  this.box.setAttribute('isrtl', data.getParent() == bamboo.data.lib ? data.isRTL : data.getParent().isRTL);
  this.box.addEventListener("mousemove", function(event)
  {
    this.focus();
  }, false);
  this.box.addEventListener("keypress", function(event)
  {
    if(event.keyCode == 46 && !event.ctrlKey)
    {
      event.stopPropagation();
      event.preventDefault();

      if(!data.readed)
      {
        view.run('handlerToggleRead');
      }
      return;
    }
    if((event.keyCode == 13 || event.charCode == 32) && !event.shiftKey)
    {
      event.stopPropagation();
      event.preventDefault();

      handlerOpen(event, true, event.ctrlKey);
      return;
    }
    if(event.keyCode == 27)
    {
      if(view.preview)
      {
        event.stopPropagation();
        event.preventDefault();

        view.run('closePreview');

        if(!data.readed)
        {
          view.run('handlerToggleRead');
        }
      }
      return;
    }
  }, false);

  // Title view

  this.titleBox = bamboo.doc.createElement('hbox');
  this.titleBox.setAttribute('class', 'bamboo-view-item bamboo-view-item-box-title');
  this.titleBox.setAttribute('flex', '1');
  this.titleBox.setAttribute('date', data.date);

  var imgBox = bamboo.doc.createElement('vbox');
  imgBox.setAttribute('class', 'bamboo-button-feed-box');
  imgBox.addEventListener("click", function()
  {
    view.run('handlerToggleRead');
  }, false);
  imgBox.addEventListener("mousedown", function(event)
  {
    event.stopPropagation();
    event.preventDefault();
  }, false);
  imgBox.addEventListener("mouseup", function(event)
  {
    event.stopPropagation();
    event.preventDefault();
  }, false);
  imgBox.setAttribute('tooltiptext', bamboo.utils.str('bamboo.message.togglefeed'));
  this.titleBox.appendChild(imgBox);

  var img = bamboo.doc.createElement('image');
  img.setAttribute('class', 'bamboo-button-feed');
  imgBox.appendChild(img);

  var labelDate = bamboo.doc.createElement('label');
  labelDate.setAttribute('class', 'bamboo-view-item-date');
  labelDate.setAttribute('value', data.getDateString());
  labelDate.setAttribute('tooltiptext', data.getDateFullString());
  this.titleBox.appendChild(labelDate);

  var parentName = data.getParent() == bamboo.data.lib ? data.feedName : data.getParent().name;

  var showFeedName = bamboo.option.get('show-feed-icons') == 'false';

  if(!showFeedName)
  {
    var imgBox = bamboo.doc.createElement('vbox');
    this.titleBox.appendChild(imgBox);

    this.tag = bamboo.doc.createElement('image');
    this.tag.setAttribute('class', 'bamboo-view-item-icon');
    this.tag.setAttribute('src', '');
    this.tag.setAttribute('tooltiptext', bamboo.utils.str('bamboo.message.openfeed') + ' ' + parentName);
    this.tag.addEventListener("click", handlerSelect, false);
    this.tag.addEventListener("mousedown", function(event)
    {
      event.stopPropagation();
      event.preventDefault();
    }, false);
    this.tag.setAttribute('style', 'cursor: pointer;');
    imgBox.appendChild(this.tag);

    var targetURLs = [data.url];
    if(data.getParent() == bamboo.data.lib)
    {
      targetURLs.push(data.feedURL);
    }
    else if(data.getParent().webpage)
    {
      targetURLs.push(data.getParent().webpage);
    }

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
          view.tag.setAttribute('src', 'http://www.google.com/s2/favicons?domain_url=' + encodeURIComponent(data.url));
        }
      }
      catch(ex) {}
    });
  }
  else
  {
    this.tag = bamboo.doc.createElement('label');
    var cssClass = 'bamboo-view-item-tag bamboo-view-item-tag-';
    cssClass += this.search ? 'search' : 'reader';
    this.tag.setAttribute('class', cssClass);
    this.tag.setAttribute('value', parentName);
    this.tag.setAttribute('tooltiptext', bamboo.utils.str('bamboo.message.openfeed') + ' ' + parentName);
    this.tag.addEventListener("click", handlerSelect, false);
    this.tag.addEventListener("mousedown", function(event)
    {
      event.stopPropagation();
      event.preventDefault();
    }, false);
    this.titleBox.appendChild(this.tag);
  }

  var handlerShowTooltip = function(event)
  {
    if(bamboo.option.get('show-content-popup') != 'true')
    { return; }

    var isContentMode = bamboo.option.get('content-mode') == 'true';

    if((!isContentMode && view.preview)
    || (isContentMode && (bamboo.ui.isInTab() || bamboo.option.get('show-link-popup') == 'false')))
    {
        handlerHideTooltip();
        return;
    }

    var node = null;

    if(isContentMode)
    {
      var text = bamboo.doc.createTextNode(bamboo.utils.str('bamboo.message.openlink') + ': ' + bamboo.utils.clearString(data.url));
      var node = bamboo.doc.createElement('html:div');
      node.setAttribute('class', 'bamboo-view-item-div');
      node.appendChild(text);
    }
    else
    {
      view.run('createHtmlContent');

      node = view.contentBox;
    }

    var isRTL = data.getParent() == bamboo.data.lib ? data.isRTL : data.getParent().isRTL;

    bamboo.ui.panel.selection.zoneMenuPopup.run('popup', [event.clientX, event.clientY, node, isRTL]);

    handlerMoveTooltip(event);
  };

  var handlerHideTooltip = function()
  {
    bamboo.ui.panel.selection.zoneMenuPopup.hide();
  };

  var handlerMoveTooltip = function(event)
  {
    bamboo.ui.panel.selection.zoneMenuPopup.move(event.clientX, event.clientY);
  };

  this.titleDiv = bamboo.doc.createElement('html:div');
  this.titleDiv.setAttribute('class', 'bamboo-view-item-title');
  this.titleDiv.setAttribute('type', 'content');
  this.titleDiv.setAttribute('flex', '1');
  this.titleBox.appendChild(this.titleDiv);

  this.titleNode = bamboo.doc.createElementNS("http://www.w3.org/1999/xhtml", 'a');
  this.titleNode.setAttribute('href', encodeURI(data.url));
  this.titleNode.setAttribute('target', bamboo.option.get('force-new-tab') == 'true' ? '_blank' : '_self');
  this.titleNode.setAttribute('tabindex', '-1');
  this.titleNode.textContent = data.title;
  this.titleDiv.appendChild(this.titleNode);

  if(data.url != '')
  {
    this.titleNode.addEventListener("click", handlerOpen, false);
    this.titleNode.addEventListener("mouseup", handlerOpen2, false);
  }else{
    this.titleNode.addEventListener("click", handlerOpenNoLink, false);
    this.titleNode.setAttribute('nolink', 'true');
  }
  this.titleNode.addEventListener("mouseover", handlerShowTooltip, false);
  this.titleNode.addEventListener("mousemove", handlerMoveTooltip, false);
  this.titleNode.addEventListener("mouseout", handlerHideTooltip, false);

  var isFromLib = data.getParent() == bamboo.data.lib;

  var handlerSharing = function()
  {
    view.run('toggleSharing');
  };

  imgBox = bamboo.doc.createElement('vbox');
  imgBox.setAttribute('class', 'bamboo-focusable bamboo-button-share-box');
  this.titleBox.appendChild(imgBox);

  img = bamboo.doc.createElement('image');
  img.setAttribute('class', 'bamboo-button-transparent bamboo-button-share');
  img.addEventListener("click", handlerSharing, false);
  img.setAttribute('tooltiptext', bamboo.utils.str(isFromLib ? 'bamboo.message.sharearticle' : 'bamboo.message.savesharearticle'));
  imgBox.appendChild(img);

  if(isFromLib)
  {
    var handlerRemoveFromLibrary = function()
    {
      bamboo.data.lib.run('removeItem', [data]);
      bamboo.ui.panel.get('reader').zoneViewMenu.run('update');
      bamboo.ui.rootNode.focus();
    };

    imgBox = bamboo.doc.createElement('vbox');
    imgBox.setAttribute('class', 'bamboo-button-remove-box');
    this.titleBox.appendChild(imgBox);

    img = bamboo.doc.createElement('image');
    img.setAttribute('class', 'bamboo-button-transparent bamboo-button-remove');
    img.addEventListener("click", handlerRemoveFromLibrary, false);
    img.setAttribute('tooltiptext', bamboo.utils.str('bamboo.message.removefromlibrary'));
    imgBox.appendChild(img);
  }

  var handlerClosePreview = function()
  {
    view.run('closePreview');

    if(!data.readed)
    {
      view.run('handlerToggleRead');
    }
  };

  var closeBox = bamboo.doc.createElement('vbox');
  closeBox.setAttribute('class', 'bamboo-view-icon-close-box');
  closeBox.addEventListener("click", handlerClosePreview, false);
  this.titleBox.appendChild(closeBox);

  var closeImg = bamboo.doc.createElement('image');
  closeImg.setAttribute('class', 'bamboo-view-icon-close');
  closeImg.setAttribute('tooltiptext', bamboo.utils.str('bamboo.message.closeandmark'));
  closeBox.appendChild(closeImg);

  var handlerSave = function()
  {
    bamboo.data.lib.run('addItem', [data]);
  };

  var handlerMail = function()
  {
    view.run('shareByMail');
  };

  this.sharingBox = bamboo.utils.ui.createSharingBox(data.title, data.url, data.content, isFromLib ? null : handlerSave, handlerMail, this.openLink);

  this.update(true);
};

bamboo.ui.view.item.prototype.handlerToggleRead = function()
{
  var data = this.getData();
  var remove = !this.search && !data.readed && (bamboo.data.page.getFilterByName('new').active && (!bamboo.data.page.getFilterByName('search').active || bamboo.data.page.getFilterByName('search').matchFilters));

  data.run('toggleReaded');

  if(remove)
  {
    if(bamboo.doc.commandDispatcher.focusedElement == this.box)
    {
      bamboo.ui.run('onCommandFocusNext');
    }

    bamboo.data.page.run('hideItem', [data]);
    data.getParent().updateVisibleItemsCount(true);

    if(bamboo.doc.commandDispatcher.focusedElement)
    {
      bamboo.doc.commandDispatcher.focusedElement.scrollIntoView(true);
    }
  }
  else
  {
    var page = this.search ? bamboo.data.searchPage : bamboo.data.page;
    page.run('updateView');
  }

  if(!this.search)
  {
    bamboo.ui.panel.get('reader').zoneViewMenu.run('update');

    if(data.getParent() != bamboo.data.lib)
    {
      bamboo.data.run('save');
    }
  }
  else
  {
    bamboo.ui.panel.get('search').zoneViewMenu.run('update');
  }
};

bamboo.ui.view.item.prototype.createHtmlContent = function()
{
  if(this.htmlContentCreated)
  { return; }

  this.htmlContentCreated = true;

  var view = this;
  var data = this.getData();

  var newContent = this.run('parseEmbedItems', [data.content]);
  var content = newContent ? newContent : data.content;
  newContent = this.run('manageAds', [content]);
  content = newContent ? newContent : content;

  if(data.author)
  {
    var authorContent = '<p class="bamboo-view-item-author-container"><span class="bamboo-view-item-author">' + data.author + '</span></p>';
    content = content ? authorContent + content : authorContent;
  }

  this.contentBox = bamboo.doc.createElement('html:div');
  this.contentBox.setAttribute('class', 'bamboo-view-item-div');
  this.contentBox.setAttribute('type', 'content');
  this.contentBox.setAttribute('flex', '1');

  var injectHTML = Components.classes["@mozilla.org/feed-unescapehtml;1"]
                             .getService(Components.interfaces.nsIScriptableUnescapeHTML)
                             .parseFragment(content, false, null, this.contentBox);

  this.contentBox.appendChild(injectHTML);

  var handlerShowTooltip = function(event)
  {
    if(bamboo.option.get('show-link-popup') != 'true' || bamboo.ui.isInTab())
    { return; }

    var text = bamboo.utils.str('bamboo.message.openlink') + ':\n ' + event.currentTarget.getAttribute('href');
    if(!event.currentTarget.getAttribute('href'))
    {
      text = bamboo.utils.str('bamboo.message.blockimage');
    }
    else
    {
      if(this.getElementsByTagName('img').length > 0)
      {
        text += ' \n\n ' + bamboo.utils.str('bamboo.message.blockimage');
      }
    }
    var textDiv = bamboo.doc.createElement('html:div');
    textDiv.setAttribute('class', 'bamboo-view-item-div');
    textDiv.appendChild(bamboo.doc.createTextNode(text));

    bamboo.ui.panel.selection.zoneMenuPopup.run('popup', [event.clientX, event.clientY, textDiv]);

    handlerMoveTooltip(event);
  };

  var handlerHideTooltip = function()
  {
    bamboo.ui.panel.selection.zoneMenuPopup.hide();
  };

  var handlerMoveTooltip = function(event)
  {
    bamboo.ui.panel.selection.zoneMenuPopup.move(event.clientX, event.clientY);
  };

  var links = this.contentBox.getElementsByTagName('a');
  var count = links.length;
  var images;

  for(var i=0; i<count; i++)
  {
    var linkNode = links[i];
    var link = linkNode.getAttribute('href');
    var style = '';

    if(link)
    {
      if(bamboo.utils.isVideoLink(link))
      {
        var type = bamboo.utils.getVideoType(link);
        //var pad = type == 'youtube' ? '38' : '20';
        style = 'text-decoration: underline; padding: 0 0 0 20px; background: transparent url("chrome://bamboo/skin/img/' + type + '.png") no-repeat left 50%; border: none;';
      }

      var target = bamboo.option.get('force-new-tab') == 'true' ? '_blank' : '_self';
      linkNode.setAttribute('target', target);
      linkNode.setAttribute('tooltip', 'bamboo-tooltip');
      linkNode.addEventListener("mouseover", handlerShowTooltip, false);
      linkNode.addEventListener("mousemove", handlerMoveTooltip, false);
      linkNode.addEventListener("mouseout", handlerHideTooltip, false);
      linkNode.addEventListener("click", function(event)
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
        else if((event.button == 0 && bamboo.option.get('youtube-integration') == 'true' && bamboo.utils.isVideoLink(this.getAttribute('href')))
          || (!bamboo.isFirefox && bamboo.option.get('thunderbird-link-in-tab') == 'true'))
        {
          event.stopPropagation();
          event.preventDefault();

          view.run('openLink', [this.getAttribute('href'), event.button == 1]);
        }
      }, false);
      linkNode.addEventListener("mouseup", function(event)
      {
        if(!bamboo.ui.isInTab())
        {
          event.stopPropagation();
          event.preventDefault();

          if(event.button == 2)
          {
            bamboo.ui.links.run('onBlockLink', [this.getAttribute('href')]);
          }
        }
      }, false);

      images = linkNode.getElementsByTagName('img');
      linkNode.setAttribute('style', images.length == 0 ? style : 'cursor: pointer; border: none;');

      for(var n=0; n<images.length; n++)
      {
        var img = images[n];
        img.setAttribute('bambooimage', link);
        img.setAttribute('tooltip', 'bamboo-tooltip');
        img.addEventListener("mouseover", handlerShowTooltip, false);
        img.addEventListener("mousemove", handlerMoveTooltip, false);
        img.addEventListener("mouseout", handlerHideTooltip, false);
      }
    }
  }

  var divs = this.contentBox.getElementsByClassName('bamboo-tmp-embed');
  var parseCount = 0;
  var divCount = 0;
  var frame = null;
  var curDiv = null;

  while(parseCount < 5)
  {
    divCount = divs.length;
    for(var x=0; x<divCount; x++)
    {
      curDiv = divs[x];
      if(curDiv)
      {
        var src = curDiv.getAttribute('src');
        if(src)
        {
          if(bamboo.option.get('show-embed-content') == 'true')
          {
            if(bamboo.utils.isVideoLink(src))
            {
              src += '?html=1&html5=1';
            }
            frame = bamboo.doc.createElement('iframe');
            frame.setAttribute('class', 'bamboo-embed-content');
            frame.setAttribute('type', 'content');
            frame.setAttribute('src', src);
            var width = curDiv.getAttribute('width');
            width = width && width.length > 3 && width.substr(width.length-3) == '%25' ? width.substr(0, width.length-2) : width + 'px';
            frame.setAttribute('style', 'width: ' + width + '; height: ' + curDiv.getAttribute('height') + 'px');
            curDiv.parentNode.replaceChild(frame, curDiv);
          }
          else
          {
            curDiv.parentNode.removeChild(curDiv);
          }
        }
      }
    }
    divs = this.contentBox.getElementsByClassName('bamboo-tmp-embed');
    parseCount++;
  }

  images = this.contentBox.getElementsByTagName('img');
  var countImg = images.length;
  var curImg;

  for(i=0; i<countImg; i++)
  {
    curImg = images[i];
    curImg.setAttribute('bambooimage', curImg.getAttribute('src'));
    curImg.addEventListener("mouseover", handlerShowTooltip, false);
    curImg.addEventListener("mousemove", handlerMoveTooltip, false);
    curImg.addEventListener("mouseout", handlerHideTooltip, false);
    curImg.addEventListener("mouseup", function(event)
    {
      if(!bamboo.ui.isInTab())
      {
        if(event.button == 2)
        {
          event.stopPropagation();
          event.preventDefault();

          bamboo.ui.links.run('onBlockLink', [this.getAttribute('bambooimage')]);
        }
      }
    }, false);
  }

  var audios = null;
  var audioCount = 0;
  var audio;

  parseCount = 0;

  while(parseCount < 5)
  {
    audios = this.contentBox.getElementsByClassName('bamboo-tmp-audio');
    audioCount = audios.length;

    for(i=0; i<audioCount; i++)
    {
      audio = audios[i];

      if (audio)
      {
        var widget = view.buildAudioWidget(audio, data);
        audio.parentNode.replaceChild(widget, audio);
      }
    }
    parseCount++;
  }
};

bamboo.ui.view.item.prototype.buildAudioWidget = function(node, data)
{
  var url = node.getAttribute('data-url');

  var handlerTogglePlay  = function()
  {
    bamboo.ui.panel.get('reader').zoneViewPlayer.run('playAudio', [url, data]);
  };

  var widget = bamboo.doc.createElement('hbox');
  widget.setAttribute('class', 'bamboo-view-item-audio');
  widget.addEventListener("click", handlerTogglePlay, false);
  widget.setAttribute('data-url', url);

  var img = bamboo.doc.createElement('hbox');
  img.setAttribute('class', 'bamboo-view-item-audio-image');
  widget.appendChild(img);

  return widget;
};

bamboo.ui.view.item.prototype.parseEmbedItems = function(content)
{
  var result = content;

  if(result && result.length)
  {
    result = this.parseEmbedItems_getNodes(content, 'embed');
    result = this.parseEmbedItems_getNodes(result, 'iframe');
  }

  return result;
};

bamboo.ui.view.item.prototype.parseContent_getNodesByName = function(content, nodeName)
{
  var nodes = [];
  var startIndex = 0;
  var endIndex = 0;
  var endIndex2 = 0;

  while(startIndex >= 0)
  {
    startIndex = content.indexOf('<' + nodeName, startIndex);

    if(startIndex >= 0)
    {
      endIndex = content.indexOf('</' + nodeName + '>', startIndex);
      endIndex2 = content.indexOf('>', startIndex);
      if(endIndex2 >= 0 && (endIndex2 < endIndex || endIndex < 0))
      {
        endIndex = endIndex2 + 1;
      }
      else if(endIndex >= 0)
      {
        endIndex += 3 + nodeName.length;
      }

      if(endIndex >= 0)
      {
        nodes.push({content: content.substring(startIndex, endIndex), startIndex: startIndex, endIndex: endIndex});
      }

      startIndex = endIndex;
    }
  }

  return nodes;
};

bamboo.ui.view.item.prototype.parseContent_getNodeObject = function(nodeContent, attributeNames)
{
  var node = {};

  for(var i=0; i<attributeNames.length; i++)
  {
    var attribute = attributeNames[i];
    var sep = null;
    var endIndex = null;

    var tag = ' ' + attribute + '=';
    var curIndex = nodeContent.indexOf(tag);
    if(curIndex < 0)
    {
      tag = attribute + '=';
      curIndex = nodeContent.indexOf(tag);
    }
    if(curIndex >= 0)
    {
      sep = nodeContent.substr(curIndex + tag.length, 1);
      endIndex = nodeContent.indexOf(sep, curIndex + tag.length + 1);
      if(endIndex >= 0)
      {
        node[attribute] = nodeContent.substring(curIndex + tag.length + 1, endIndex);
      }
    }
  }

  return node;
};

bamboo.ui.view.item.prototype.getNodeStringFromObject = function(node, nodeName)
{
  var nodeString = '<' + nodeName;

  for(var id in node)
  {
    nodeString += ' ' + id + '="' + node[id] + '"';
  }
  nodeString += ' />';

  return nodeString;
};

bamboo.ui.view.item.prototype.manageAds = function(content)
{
  var newContent = content;
  var offset = 0;
  var length = 0;

  var nodes = this.parseContent_getNodesByName(newContent, 'img');
  for(var i=0; i<nodes.length; i++)
  {
    var node = this.parseContent_getNodeObject(nodes[i].content, ['src', 'width', 'height', 'title']);

    if(node.src)
    {
      node.src = this.manageImagePath(node.src);
    }

    var remove = !node.src || (bamboo.option.get('use-ads-blocker') == 'true' && bamboo.utils.blacklist.isBlocked(node.src));
    remove = remove || (node.width && Number(node.width) < 5 || node.height && Number(node.height) < 5);

    if(remove)
    {
      length = newContent.length;
      newContent = newContent.substring(0, nodes[i].startIndex + offset) + newContent.substring(nodes[i].endIndex + offset);
      offset += newContent.length - length;
    }
    else
    {
      length = newContent.length;
      var newNode = this.getNodeStringFromObject(node, 'img');

      newContent = newContent.substring(0, nodes[i].startIndex + offset) + newNode + newContent.substring(nodes[i].endIndex + offset);
      offset += newContent.length - length;
    }
  }

  return newContent;
};

bamboo.ui.view.item.prototype.manageImagePath = function(source)
{
  var path = source;

  if(!path || !path.length)
  {
    return path;
  }
  var data = this.getData();
  var parent = data.getParent();

  if(bamboo.option.get('use-cache') != 'true')
  {
    if(path.indexOf('?') > 0)
    {
      path += '&';
    }
    else
    {
      path += '?';
    }
    path = path + 'bambooadd=' + new Date().getTime();
  }

  if(parent.url.indexOf('www.facebook.com') >= 0 && path.indexOf('_s.') > 0)
  {
    var indexReplace = path.indexOf('_s.');
    path = path.substr(0, indexReplace) + '_n.' + path.substr(indexReplace + 3);
  }

  if(path.substr(0, 1) == '/')
  {
    if(path.substr(1, 1) == '/')
    {
      path = 'http:' + path;
    }
    else
    {
      var url = '';
      if(parent == bamboo.data.lib)
      {
        url = data.feedURL
      }
      else
      {
        url = parent.webpage == '' ? parent.url : parent.webpage;
      }

      var websiteURL = bamboo.utils.getWebsiteFromUrl(url);

      path = websiteURL + path;
    }
  }

  return path;
};

bamboo.ui.view.item.prototype.parseEmbedItems_getNodes = function(content, nodeName)
{
  var startIndex = 0;
  var endIndex = 0;
  var node = null;
  var div = null;

  while(startIndex >= 0)
  {
    startIndex = content.indexOf('<' + nodeName, startIndex);

    if(startIndex >= 0)
    {
      endIndex = content.indexOf('</' + nodeName, startIndex);

      if(endIndex >= 0)
      {
        node = content.substring(startIndex, endIndex);

        var item = this.parseEmbedItems_getItemFromNode(node);
        if(item.src)
        {
          if(item.src.indexOf('//') == 0)
          {
            item.src = 'http:' + item.src;
          }
          if(bamboo.option.get('use-ads-blocker') == 'true' && bamboo.utils.blacklist.isBlocked(item.src))
          {
            div = '';
          }
          else
          {
            div = '<div class="bamboo-tmp-embed" src="' + encodeURI(decodeURIComponent(item.src)) + '" width="'+ encodeURI(item.width) + '" height="'+ encodeURI(item.height) + '"></div>';
          }

          content = content.substring(0, startIndex) + div + content.substring(startIndex);
          endIndex += div.length;
        }
      }

      startIndex = endIndex;
    }
  }

  return content;
};

bamboo.ui.view.item.prototype.parseEmbedItems_getItemFromNode = function(nodeContent)
{
  var item = { src: '', width: '400px', height: '50px' };

  var sep = null;
  var endIndex = null;

  var tag = ' src=';
  var curIndex = nodeContent.indexOf(tag);
  if(curIndex < 0)
  {
    tag = 'src=';
    curIndex = nodeContent.indexOf(tag);
  }
  if(curIndex >= 0)
  {
    sep = nodeContent.substr(curIndex + tag.length, 1);
    endIndex = nodeContent.indexOf(sep, curIndex + tag.length + 1);
    if(endIndex >= 0)
    {
      item.src = nodeContent.substring(curIndex + tag.length + 1, endIndex);
    }
  }

  tag = ' width=';
  curIndex = nodeContent.indexOf(tag);
  if(curIndex < 0)
  {
    tag = 'width=';
    curIndex = nodeContent.indexOf(tag);
  }
  if(curIndex >= 0)
  {
    sep = nodeContent.substr(curIndex + tag.length, 1);
    endIndex = nodeContent.indexOf(sep, curIndex + tag.length + 1);
    if(endIndex >= 0)
    {
      item.width = nodeContent.substring(curIndex + tag.length + 1, endIndex);
    }
  }

  tag = ' height=';
  curIndex = nodeContent.indexOf(tag);
  if(curIndex < 0)
  {
    tag = 'height=';
    curIndex = nodeContent.indexOf(tag);
  }
  if(curIndex >= 0)
  {
    sep = nodeContent.substr(curIndex + tag.length, 1);
    endIndex = nodeContent.indexOf(sep, curIndex + tag.length + 1);
    if(endIndex >= 0)
    {
      item.height = nodeContent.substring(curIndex + tag.length + 1, endIndex);
    }
  }

  return item;
};

bamboo.ui.view.item.prototype.openLink = function(url, newTab)
{
  if(bamboo.ui.isInTab() && bamboo.option.get('youtube-integration') == 'true' && !newTab && bamboo.option.get('force-tab-in-background') != 'true' && bamboo.utils.isVideoLink(url))
  {
    bamboo.ui.showWebDialog(bamboo.utils.getVideoUrl(url));
  }
  else
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
  }
};

bamboo.ui.view.item.prototype.addBox = function(index)
{
  if(index >= 0)
  {
    var child = this.container.childNodes[index];
    this.container.insertBefore(this.box, child);
  }
  else
  {
    this.container.appendChild(this.box);
  }

  this.boxAdded = true;
};

bamboo.ui.view.item.prototype.addItem = function(isList)
{
  if(!isList)
  {
    this.createHtmlContent();
  }

  var target = isList ? this.titleBox : this.contentBox;

  this.box.appendChild(target);

  if(isList)
  {
    this.box.appendChild(this.sharingBox);
  }

  if(isList)
  {
    this.titleBoxAdded = true;
  }else{
    this.contentBoxAdded = true;
  }
};

bamboo.ui.view.item.prototype.openPreview = function()
{
  bamboo.ui.panel.selection.zoneMenuPopup.hide();

  this.preview = true;
  this.show();
  this.update();
};

bamboo.ui.view.item.prototype.closePreview = function()
{
  this.preview = false;
  this.sharing = false;
  this.update();
};

bamboo.ui.view.item.prototype.toggleSharing = function()
{
  this.sharing = !this.sharing;
  this.update();
};

bamboo.ui.view.item.prototype.shareByMail = function()
{
  var url = 'mailto:';
  url += encodeURIComponent(bamboo.option.get('sharing-mail-to'));
  url += '?subject=';
  url += this.replaceMailTags(bamboo.option.get('sharing-mail-subject'));
  url += '&body=';
  url += this.replaceMailTags(bamboo.option.get('sharing-mail-body').split('\n').join('%0A'));

  var limit = 1000;

  if(bamboo.option.get('limit-mail-length') == 'true' && url.length > limit)
  {
    url = url.substr(0, limit);
  }

  bamboo.utils.browser.openLink(url, true);
};

bamboo.ui.view.item.prototype.replaceMailTags = function(template)
{
  var data = this.getData();

  return template.replace('%url%', encodeURIComponent(data.url))
                 .replace('%title%', encodeURIComponent(data.title))
                 .replace('%content%', encodeURIComponent(bamboo.utils.clearString(data.content)));
};

bamboo.ui.view.item.prototype.update = function(onBuild)
{
  if(this.built || onBuild)
  {
    var data = this.getData();

    this.box.setAttribute('preview', this.preview);
    this.box.setAttribute('sharing', this.sharing);
    this.titleBox.setAttribute('readed', data.readed);
    this.titleDiv.setAttribute('class', data.readed ? 'bamboo-view-item-title' : 'bamboo-view-item-title bamboo-font-light');
    if(this.contentBox)
    {
      this.contentBox.setAttribute('readed', data.readed);
    }

    if(this.tag)
    {
      var name = data.getParent() == bamboo.data.lib ? data.feedName : data.getParent().name;
      if(name.length > 25)
      {
        name = name.substring(0, 22) + '...';
      }
      this.tag.setAttribute('value', name);
    }
  }
};

bamboo.ui.view.item.prototype.hide = function()
{
  if(this.built)
  {
     if(this.boxAdded)
     {
      this.container.removeChild(this.box);
      this.boxAdded = false;
     }
  }
};

bamboo.ui.view.item.prototype.remove = function()
{
  if(this.built)
  {
    this.hide();

    this.box = null;
    this.titleBox = null;
    this.titleNode = null;
    this.contentBox = null;
    this.tag = null;

    this.built = false;
  }
};
