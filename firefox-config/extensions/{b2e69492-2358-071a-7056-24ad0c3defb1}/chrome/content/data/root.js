
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.data.root = function(unreadCount)
{
  bamboo.data.group.call(this, null, "ROOT", true, unreadCount);

  this.oldUnreadItemCount = 0;
  this.favoriteUnreadItemCount = 0;
};

bamboo.extend(bamboo.data.root, bamboo.data.group);

bamboo.data.root.prototype.onChildLoaded = function()
{
  var isLoading = this.loading;
  this.refreshLoading();

  if(this.loading != isLoading)
  {
    this.refreshError();
    this.updateView();
    bamboo.ui.panel.get('reader').zoneViewMenu.update();

    var isUpdateEnd = bamboo.utils.updater.queue.length == 0 && bamboo.utils.updater.stack.length == 0;

    if(isUpdateEnd)
    {
      bamboo.data.run('save');
    }

    if(this.loading)
    {
      this.oldUnreadItemCount = this.unreadItemCount;
    }
    else if(isUpdateEnd && this.unreadItemCount > this.oldUnreadItemCount)
    {
      bamboo.ui.notification.run('show');
    }
  }
};

bamboo.data.root.prototype.updateUnreadedCount = function()
{
  this.favoriteUnreadItemCount = this.getFavoriteUnreadCount();

  this.unreadItemCount = 0;
  for(var i=0; i<this.groups.length; i++)
  {
    this.unreadItemCount += this.groups[i].unreadItemCount;
  }
  for(var i=0; i<this.feeds.length; i++)
  {
    this.unreadItemCount += this.feeds[i].unreadItemCount;
  }
};

bamboo.data.root.prototype.getLabel = function()
{
  return bamboo.utils.str('bamboo.all');
};

bamboo.data.root.prototype.toXml = function()
{
  var xml = bamboo.doc.implementation.createDocument(null, 'opml', null);
  xml.documentElement.setAttribute('version', '1.0');

  var head = xml.createElement('head');
  xml.documentElement.appendChild(head);

  var title = xml.createElement('title');
  head.appendChild(title);
  title.appendChild(xml.createTextNode('Bamboo feeds'));

  var body = xml.createElement('body');
  xml.documentElement.appendChild(body);

  this.buildChildrenXml(xml, body);

  return xml;
};
