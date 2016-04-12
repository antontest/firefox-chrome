
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.ui.panel.add = function()
{
  bamboo.ui.panel.base.call(this, 'add', bamboo.utils.str('bamboo.menu.add.label'), true);

  this.stepBox1 = null;
  this.inputURL = null;

  this.loading = false;
};

bamboo.extend(bamboo.ui.panel.add, bamboo.ui.panel.base);

bamboo.ui.panel.add.prototype.build = function()
{
  this.stepBox1 = this.buildStepBox();

  var panel = this;

  var handlerAddGroup = function()
  {
    panel.run('addGroup');
  };

  var menu = bamboo.doc.createElement('vbox');
  menu.setAttribute('class', 'bamboo-focusable bamboo-menu bamboo-zone-view');
  menu.addEventListener("click", handlerAddGroup, false);
  menu.addEventListener("keypress", function(event)
  {
    if(event.keyCode == 13 || event.charCode == 32)
    {
      handlerAddGroup();
    }
  }, false);
  this.stepBox1.appendChild(menu);

  var box = bamboo.doc.createElement('hbox');
  box.setAttribute('class', 'bamboo-menu-box');
  menu.appendChild(box);

  var icon = bamboo.doc.createElement('image');
  icon.setAttribute('class', 'bamboo-menu-icon bamboo-menu-icon-newgroup');
  box.appendChild(icon);

  var label = bamboo.doc.createElement('label');
  label.setAttribute('class', 'bamboo-menu-label bamboo-font-light');
  label.setAttribute('value', bamboo.utils.str('bamboo.add.dialog.group'));
  box.appendChild(label);

  if(bamboo.isFirefox)
  {
    bamboo.utils.ui.addSpacer(this.stepBox1, true, true);
    bamboo.utils.ui.addSpacer(this.stepBox1, true, true);

    var handlerSubscribePage = function()
    {
      panel.run('subscribeToCurrentPage');
    };

    menu = bamboo.doc.createElement('vbox');
    menu.setAttribute('class', 'bamboo-focusable bamboo-menu bamboo-zone-view');
    menu.addEventListener("click", handlerSubscribePage, false);
    menu.addEventListener("keypress", function(event)
    {
      if(event.keyCode == 13 || event.charCode == 32)
      {
        handlerSubscribePage();
      }
    }, false);
    this.stepBox1.appendChild(menu);

    box = bamboo.doc.createElement('hbox');
    box.setAttribute('class', 'bamboo-menu-box');
    menu.appendChild(box);

    icon = bamboo.doc.createElement('image');
    icon.setAttribute('class', 'bamboo-menu-icon bamboo-menu-icon-subscribe-page');
    box.appendChild(icon);

    label = bamboo.doc.createElement('label');
    label.setAttribute('class', 'bamboo-menu-label bamboo-font-light');
    label.setAttribute('value', bamboo.utils.str('bamboo.add.desc.subscribePage'));
    box.appendChild(label);
  }

  bamboo.utils.ui.addSpacer(this.stepBox1, true, true);
  bamboo.utils.ui.addSpacer(this.stepBox1, true, true);

  var handlerSubscribeUrl = function()
  {
    panel.run('subscribeToUrl');
  };

  menu = bamboo.doc.createElement('vbox');
  menu.setAttribute('class', 'bamboo-focusable bamboo-menu bamboo-zone-view');
  menu.addEventListener("click", handlerSubscribeUrl, false);
  menu.addEventListener("keypress", function(event)
  {
    if(event.keyCode == 13 || event.charCode == 32)
    {
      handlerSubscribeUrl();
    }
  }, false);
  this.stepBox1.appendChild(menu);

  box = bamboo.doc.createElement('hbox');
  box.setAttribute('class', 'bamboo-menu-box');
  menu.appendChild(box);

  icon = bamboo.doc.createElement('image');
  icon.setAttribute('class', 'bamboo-menu-icon bamboo-menu-icon-subscribe-url');
  box.appendChild(icon);

  label = bamboo.doc.createElement('label');
  label.setAttribute('class', 'bamboo-menu-label bamboo-font-light');
  label.setAttribute('value', bamboo.utils.str('bamboo.add.desc.subscribeUrl'));
  box.appendChild(label);

  box = bamboo.doc.createElement('hbox');
  box.setAttribute('class', 'bamboo-menu-box');
  menu.appendChild(box);

  this.inputURL = bamboo.doc.createElement('textbox');
  this.inputURL.setAttribute('class', 'bamboo-input bamboo-input-url bamboo-focusable');
  this.inputURL.setAttribute('placeholder', bamboo.utils.str('bamboo.add.desc.enterUrl'));
  this.inputURL.setAttribute('flex', '1');
  this.inputURL.addEventListener('click', function(event)
  {
    event.stopPropagation();
  }, false);
  this.inputURL.addEventListener('keypress', function(event)
  {
    if((event.keyCode != 9 && event.charCode != 116 && event.charCode != 8224) || !event.altKey)
    {
      event.stopPropagation();
    }

    if(event.keyCode == 13)
    {
      handlerSubscribeUrl();
      event.preventDefault();
    }
  }, false);
  box.appendChild(this.inputURL);

  bamboo.utils.ui.addSpacer(this.stepBox1, true, true);
};

bamboo.ui.panel.add.prototype.addGroup = function()
{
  bamboo.ui.newGroup(bamboo.data.all.id);
};

bamboo.ui.panel.add.prototype.subscribeToCurrentPage = function()
{
  var allPages = bamboo.utils.browser.getPages();
  var pages = [];

  for(var n=0; n<allPages.length; n++)
  {
    var page = allPages[n];
    if(page && page.title && page.title.length)
    {
      pages.push(page);
    }
  }

  var titles = [];
  for(var i=0; i<pages.length; i++)
  {
    titles.push(pages[i].title);
  }

  if(pages.length > 1)
  {
    var panel = this;
    var message = bamboo.utils.str('bamboo.add.selectpage');
    var action = bamboo.utils.str('bamboo.add.select.button');
    var choices = { selection: { type: 'radio', values: titles}};

    bamboo.ui.showConfirmDialog(message, action, choices,
    { onValidation: function(result)
    {
      var index = result.selection;
      panel.subscribeToPage(pages[index].doc, pages[index].url, pages[index].browser);
    }});
  }
  else if(pages.length == 1)
  {
    this.subscribeToPage(pages[0].doc, pages[0].url, pages[0].browser);
  }
  else
  {
    bamboo.ui.showMessageDialog(bamboo.utils.str('bamboo.message.nopage'));
  }
};

bamboo.ui.panel.add.prototype.subscribeToPage = function(doc, curURL, browser)
{
  var panel = this;

  if(browser && doc.documentURI == 'about:blank')
  {
    this.loading = true;

    bamboo.ui.showWaitDialog(bamboo.utils.str('bamboo.message.loading'),{ onCancel: function()
    {
      panel.loading = false;
      bamboo.ui.closeDialog();
    }});

    browser.addEventListener('load', function(event)
    {
      if(panel.loading)
      {
        panel.loading = false;
        panel.run('subscribeToPage', [event.originalTarget, event.originalTarget.location.href]);
      }
    }, true);

    doc.defaultView.location.reload();
  }
  else
  {
    var links = this.findFeedLinks(doc);
    if(links.length > 0)
    {
      if(links.length == 1)
      {
        this.testFeed(links[0].url, links[0].name, curURL);
      }
      else
      {
        var names = [];
        for(var i=0; i<links.length; i++)
        {
          names.push(links[i].name);
        }
        var message = bamboo.utils.str('bamboo.add.select');
        var action = bamboo.utils.str('bamboo.add.select.button');
        var choices = { selection: { type: 'radio', values: names}};

        bamboo.ui.showConfirmDialog(message, action, choices,
        { onValidation: function(result)
        {
          var index = result.selection;
          panel.testFeed(links[index].url, links[index].name, curURL);
        }});
      }
    }
    else
    {
      if(curURL.indexOf('http') == 0)
      {
        this.testFeed(curURL, '', curURL, true);
      }
      else
      {
        bamboo.ui.showMessageDialog(bamboo.utils.str('bamboo.message.nofeed'));
      }
    }
  }
};

bamboo.ui.panel.add.prototype.findFeedLinks = function(node)
{
  var links = [];
  var linkNodes = node.getElementsByTagName("link");
  var linkNode;
  for(var i=0; i<linkNodes.length; i++)
  {
    linkNode = linkNodes[i];
    if( linkNode.href && linkNode.type
    && (linkNode.type.indexOf('rss') >= 0 || linkNode.type.indexOf('atom') >= 0))
    {
      links.push({name: linkNode.title ? linkNode.title : '', url: linkNode.href});
    }
  }
  return links;
};

bamboo.ui.panel.add.prototype.findFeedLinksInText = function(url, text)
{
  var links = [];

  var startIndex = 0;
  var endIndex = 0;
  var node = null;

  while(startIndex >= 0)
  {
    startIndex = text.indexOf('<link ', startIndex);

    if(startIndex >= 0)
    {
      endIndex = text.indexOf('>', startIndex);

      if(endIndex >= 0)
      {
        node = text.substring(startIndex, endIndex);

        var link = this.findFeedLinksInText_getLink(node);
        if(link && link.url)
        {
          if(link.url.indexOf('//') == 0)
          {
            link.url = 'http:' + link.url;
          }
          else if(link.url.indexOf('/') == 0)
          {
            link.url = url + link.url;
          }
          if(link.url.indexOf('http') != 0)
          {
            link.url = url + '/' + link.url;
          }

          links.push(link);
        }
      }

      startIndex = endIndex;
    }
  }

  return links;
};

bamboo.ui.panel.add.prototype.findFeedLinksInText_getLink = function(linkText)
{
  var link = { url: '', name: '' };

  var sep = null;
  var endIndex = null;

  var type = null;
  var tag = ' type=';
  var curIndex = linkText.indexOf(tag);
  if(curIndex < 0)
  {
    tag = 'type=';
    curIndex = linkText.indexOf(tag);
  }
  if(curIndex >= 0)
  {
    sep = linkText.substr(curIndex + tag.length, 1);
    endIndex = linkText.indexOf(sep, curIndex + tag.length + 1);
    if(endIndex >= 0)
    {
      type = linkText.substring(curIndex + tag.length + 1, endIndex);
    }
  }

  if(type && type.indexOf && (type.indexOf('rss') >= 0 || type.indexOf('atom') >= 0))
  {
    tag = ' href=';
    curIndex = linkText.indexOf(tag);
    if(curIndex < 0)
    {
      tag = 'href=';
      curIndex = linkText.indexOf(tag);
    }
    if(curIndex >= 0)
    {
      sep = linkText.substr(curIndex + tag.length, 1);
      endIndex = linkText.indexOf(sep, curIndex + tag.length + 1);
      if(endIndex >= 0)
      {
        link.url = linkText.substring(curIndex + tag.length + 1, endIndex);
      }
    }

    tag = ' title=';
    curIndex = linkText.indexOf(tag);
    if(curIndex < 0)
    {
      tag = 'title=';
      curIndex = linkText.indexOf(tag);
    }
    if(curIndex >= 0)
    {
      sep = linkText.substr(curIndex + tag.length, 1);
      endIndex = linkText.indexOf(sep, curIndex + tag.length + 1);
      if(endIndex >= 0)
      {
        link.name = linkText.substring(curIndex + tag.length + 1, endIndex);
      }
    }
  }

  return link;
};

bamboo.ui.panel.add.prototype.subscribeToUrl = function()
{
  var url = this.inputURL.value.trim();
  if(url)
  {
    if(url.indexOf('//') == 0)
    {
      url = 'http:' + url;
    }
    else if(url.indexOf('http') != 0)
    {
      url = 'http://' + url;
    }
    this.loading = true;
    var panel = this;

    bamboo.ui.showWaitDialog(bamboo.utils.str('bamboo.message.loading'),{ onCancel: function()
    {
      panel.loading = false;
      bamboo.ui.closeDialog();
    }});

    bamboo.utils.ajax.load(url,
    {
      onSuccess: function(xml, text)
      {
        panel.run('subscribeToUrlFromXml', [url, xml, text]);
      },

      onError: function(ex)
      {
        panel.loading = false;
        var errorMessage = ex && ex.message ? ': ' + ex.message : '';
        bamboo.ui.showMessageDialog(bamboo.utils.str('bamboo.message.error.loading') + errorMessage);
      }
    });
  }
};

bamboo.ui.panel.add.prototype.subscribeToUrlFromXml = function(url, xml, text)
{
  if(this.loading)
  {
    var panel = this;
    this.loading = false;
    bamboo.ui.closeDialog();

    if(xml && (xml.getElementsByTagName('rss').length > 0 || xml.getElementsByTagName('feed').length > 0 || xml.getElementsByTagName('rdf:RDF').length > 0 || xml.getElementsByTagName('parsererror').length > 0))
    {
      var feed = new bamboo.data.feed(null, '', url, '', 0, false, 'notset');
      feed.run('testUpdateFromDocument', [xml, { onTestResult: function(resultFeed)
      {
        if(resultFeed.error)
        {
          bamboo.ui.showMessageDialog(resultFeed.error);
        }
        else
        {
          panel.validateFeed(resultFeed);
        }
      }}]);
    }
    else if(xml && xml.getElementsByTagName('opml').length > 0)
    {
      bamboo.utils.import.run('importXML', [xml]);
    }
    else if(text)
    {
      var links = this.findFeedLinksInText(url, text);
      if(links.length > 0)
      {
        if(links.length == 1)
        {
          this.testFeed(links[0].url, links[0].name, url);
        }
        else
        {
          var names = [];
          for(var i=0; i<links.length; i++)
          {
            names.push(links[i].url);
          }
          var message = bamboo.utils.str('bamboo.add.select');
          var action = bamboo.utils.str('bamboo.add.select.button');
          var choices = { selection: { type: 'radio', values: names}};

          bamboo.ui.showConfirmDialog(message, action, choices,
          { onValidation: function(result)
          {
            var index = result.selection;
            panel.testFeed(links[index].url, links[index].name, url);
          }});
        }
      }
      else
      {
        bamboo.ui.showMessageDialog(bamboo.utils.str('bamboo.message.nofeed'));
      }
    }
    else
    {
      bamboo.ui.showMessageDialog(bamboo.utils.str('bamboo.message.error.format'));
    }
  }
};

bamboo.ui.panel.add.prototype.testFeed = function(url, name, webpage, curPage)
{
  this.loading = true;
  var panel = this;

  bamboo.ui.showWaitDialog(bamboo.utils.str('bamboo.message.loading'),{ onCancel: function()
  {
    panel.loading = false;
    bamboo.ui.closeDialog();
  }});

  var feed = new bamboo.data.feed(null, name, url, webpage, 0, false, 'notset');
  feed.testUpdate({ onTestResult: function(resultFeed)
  {
    if(panel.loading)
    {
      panel.loading = false;
      bamboo.ui.closeDialog();

      if(resultFeed.error)
      {
        if(curPage)
        {
          bamboo.ui.showMessageDialog(bamboo.utils.str('bamboo.message.nofeed'));
        }else{
          bamboo.ui.showMessageDialog(resultFeed.error);
        }
      }
      else
      {
        panel.validateFeed(resultFeed);
      }
    }
  }});
};

bamboo.ui.panel.add.prototype.validateFeed = function(feed)
{
  var panel = this;
  var groups = bamboo.data.all.getGroupList();
  var message = bamboo.utils.str('bamboo.add.option');
  var action = bamboo.utils.str('bamboo.button.add');
  var choices = { name:
                  { type: 'input', mandatory: true, value: feed.name, desc: bamboo.utils.str('bamboo.edit.feed.name')},
                  webpage:
                  { type: 'input', mandatory: false, value: feed.webpage, desc: bamboo.utils.str('bamboo.edit.feed.webpage')},
                  favorite:
                  { type: 'check', checked: false, value: bamboo.utils.str('bamboo.edit.feed.favorite')},
                  group:
                  { type: 'combo', label: bamboo.utils.str('bamboo.edit.feed.group'), values: groups, value: bamboo.data.all.id}};

  bamboo.ui.showConfirmDialog(message, action, choices,
  { onValidation: function(result)
  {
    // Add feed
    feed.name = result.name;
    feed.webpage = result.webpage;
    feed.favorite = result.favorite;

    panel.addFeed(feed, result.group);
  }});
};

bamboo.ui.panel.add.prototype.addFeed = function(feed, groupId)
{
  bamboo.data.all.feeds.push(feed);
  feed.setParent(bamboo.data.all);
  feed.updateUnreadedCount();
  bamboo.data.all.updateUnreadedCount();

  bamboo.data.all.showView();
  bamboo.selectItem(feed);

  if(groupId)
  {
    var group = bamboo.factory.getData(groupId);
    bamboo.ui.dd.moveFeedToGroup(feed.id, group);
  }

  bamboo.ui.panel.select('reader');
  bamboo.data.save();
  bamboo.data.run('saveBackup');
};

bamboo.ui.panel.add.prototype.addFeedFromURL = function(url)
{
  this.testFeed(url, '', '');
};
