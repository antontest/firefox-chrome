
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.data.item = function(parent, pTitle, pContent, pURL, pDate, pReaded, pItemID, pAuthor)
{
  bamboo.data.base.call(this, parent);

  this.title = pTitle;
  this.content = pContent;
  this.url = pURL;
  this.date = pDate;
  this.readed = pReaded;
  this.author = pAuthor;
  this.itemID = pItemID;
};

bamboo.extend(bamboo.data.item, bamboo.data.base);

bamboo.data.item.prototype.toggleReaded = function()
{
  this.markAsReaded(!this.readed);
};

bamboo.data.item.prototype.markAsReaded = function(isReaded)
{
  if(this.readed != isReaded)
  {
    this.readed = isReaded;
    this.updateView();

    var p = this.getParent();
    if(p)
    {
      p.onItemChanged();
    }
  }
};

bamboo.data.item.prototype.openLink = function()
{
  bamboo.utils.browser.run('openLink', [this.url, true]);
};

bamboo.data.item.prototype.getDateFullString = function()
{
  if(!this.date)
  {
    return '';
  }

  var d = new Date();
  d.setTime(this.date);

  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
};

bamboo.data.item.prototype.getDateString = function()
{
  if(!this.date)
  {
    return '';
  }

  var today = new Date();
  var d = new Date();
  d.setTime(this.date);

  if(d.getFullYear() == today.getFullYear() && d.getMonth() == today.getMonth() && d.getDate() == today.getDate())
  {
    return bamboo.utils.twoDigitNumber(d.getHours()) + ':' + bamboo.utils.twoDigitNumber(d.getMinutes());
  }
  else
  {
    var sDate = d.toLocaleDateString();

    if(sDate && sDate.length < 11)
    {
      return sDate;
    }

    var n1 = bamboo.utils.twoDigitNumber(d.getDate());
    var n2 = bamboo.utils.twoDigitNumber(d.getMonth()+1);

    if(bamboo.utils.str('bamboo.button.cancel') == 'Cancel')
    {
      sDate = n2 + '/' + n1;
    }
    else
    {
      sDate = n1 + '/' + n2;
    }

    return sDate + '/' + d.getFullYear();
  }
};

bamboo.data.item.prototype.str = function()
{
  var desc = 'Item (' + this.id + ') "' + this.title + '" ';
  if(!this.readed)
  {
    desc += '[unread] ';
  }
  return desc + '\n';
};
