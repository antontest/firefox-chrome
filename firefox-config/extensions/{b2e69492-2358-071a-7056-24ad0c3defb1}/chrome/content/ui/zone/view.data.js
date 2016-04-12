
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.ui.zone.view.data = function(target)
{
  bamboo.ui.component.call(this, target);

  this.scrollArea = null;
  this.paginatorContainer = null;
};

bamboo.extend(bamboo.ui.zone.view.data, bamboo.ui.component);

bamboo.ui.zone.view.data.prototype.build = function()
{
  var onKeyEvent = function(event)
  {
    if(event.keyCode == 33 || event.keyCode == 34 || event.keyCode == 40 || event.keyCode == 38)
    {
      event.stopPropagation();
    }
  };

  this.scrollArea = bamboo.doc.createElement('vbox');
  this.scrollArea.setAttribute('class', 'bamboo-zone-view-data');
  this.scrollArea.setAttribute('flex', '1');
  this.scrollArea.addEventListener('keydown', onKeyEvent, false);
  this.scrollArea.addEventListener('keyup', onKeyEvent, false);
  this.scrollArea.addEventListener('keypress', onKeyEvent, false);
  this.container.appendChild(this.scrollArea);

  var itemsContainer = bamboo.doc.createElement('vbox');
  this.scrollArea.appendChild(itemsContainer);

  this.paginatorContainer = bamboo.doc.createElement('hbox');
  this.paginatorContainer.setAttribute('class', 'bamboo-paginator-container');
  this.scrollArea.appendChild(this.paginatorContainer);

  return itemsContainer;
};

bamboo.ui.zone.view.data.prototype.update = function() {};

bamboo.ui.zone.view.data.prototype.focusPrevious = function()
{
  var node = bamboo.doc.commandDispatcher.focusedElement;
  var cssClass = node.getAttribute('class');
  if(cssClass && cssClass.indexOf('bamboo-view-item-box') >= 0)
  {
    if(node.previousSibling)
    {
      node.previousSibling.focus();
      node.previousSibling.scrollIntoView(true);
    }
  }
  else if(this.childContainer.childNodes.length)
  {
    this.childContainer.childNodes[this.childContainer.childNodes.length-1].focus();
  }
};

bamboo.ui.zone.view.data.prototype.focusNext = function()
{
  var node = bamboo.doc.commandDispatcher.focusedElement;
  var cssClass = node.getAttribute('class');
  if(cssClass && cssClass.indexOf('bamboo-view-item-box') >= 0)
  {
    if(node.nextSibling)
    {
      node.nextSibling.focus();
      node.nextSibling.scrollIntoView(true);
    }
    else
    {
      this.paginatorContainer.childNodes[1].focus();
      this.paginatorContainer.scrollIntoView(true);
    }
  }
  else if(this.childContainer.childNodes.length && (!cssClass || cssClass.indexOf('bamboo-paginator-button-') < 0))
  {
    this.childContainer.childNodes[0].focus();
    this.childContainer.childNodes[0].scrollIntoView(true);
  }
};

bamboo.ui.zone.view.data.prototype.focusFirst = function()
{
  if(this.childContainer.childNodes.length)
  {
    this.childContainer.childNodes[0].focus();
    this.childContainer.childNodes[0].scrollIntoView(true);
  }
};

bamboo.ui.zone.view.data.prototype.scrollTop = function()
{
  this.scrollArea.scrollTop = 0;
};

bamboo.ui.zone.view.data.prototype.scrollToNext = function()
{
  var height = this.scrollArea.clientHeight;
  var gap = this.scrollArea.scrollTop;
  var offset = bamboo.option.get('content-mode') == 'true' ? 15 : 1;
  var count = this.childContainer.childNodes.length;
  var pos = 0;
  var child = null;

  for(var i=0; i<count; i++)
  {
    child = this.childContainer.childNodes[i];

    pos += child.scrollHeight + offset;

    if(pos > gap)
    {
      if((gap + height) < pos)
      {
        this.scrollArea.scrollTop += height / 2;
      }
      else
      {
        this.scrollArea.scrollTop = pos;
      }
      break;
    }
  }
};

bamboo.ui.zone.view.data.prototype.scrollToPrevious = function()
{
  var gap = this.scrollArea.scrollTop;
  var offset = bamboo.option.get('content-mode') == 'true' ? 15 : 1;
  var count = this.childContainer.childNodes.length;
  var pos = 0;
  var child = null;

  for(var i=0; i<count; i++)
  {
    child = this.childContainer.childNodes[i];

    pos += child.scrollHeight + offset;

    if(pos < gap)
    {
      var h = 0;
      if(i < (count-1) && this.childContainer.childNodes[i+1])
      {
        h = this.childContainer.childNodes[i+1].scrollHeight;
      }

      if((pos + h + offset) >= gap)
      {
        this.scrollArea.scrollTop = pos;
        break;
      }
    }

    if(i == (count - 1))
    {
      this.scrollTop();
    }
  }
};
