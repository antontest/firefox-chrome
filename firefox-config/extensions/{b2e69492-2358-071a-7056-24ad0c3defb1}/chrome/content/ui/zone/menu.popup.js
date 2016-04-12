
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.ui.zone.menu.popup = function(target)
{
  bamboo.ui.component.call(this, target);

  this.popupNode = null;
  this.box = null;
};

bamboo.extend(bamboo.ui.zone.menu.popup, bamboo.ui.component);

bamboo.ui.zone.menu.popup.prototype.build = function()
{
  this.popupNode = bamboo.doc.createElement('hbox');
  this.popupNode.setAttribute('class', 'bamboo-zone-menu-popup');
  this.container.appendChild(this.popupNode);

  var container = bamboo.doc.createElement('vbox');
  container.setAttribute('id', 'bamboo-tooltip');
  container.setAttribute('class', 'bamboo-zone-menu-popup-box');
  this.popupNode.appendChild(container);

  this.box = bamboo.doc.createElement('vbox');
  this.box.setAttribute('id', 'bamboo-tooltip-div');
  container.appendChild(this.box);

  this.update();

  return this.box;
};

bamboo.ui.zone.menu.popup.prototype.update = function()
{
};

bamboo.ui.zone.menu.popup.prototype.hide = function()
{
  this.clear();

  this.container.setAttribute('popup-menu-open', 'false');
};

bamboo.ui.zone.menu.popup.prototype.clear = function()
{
  while (this.box.firstChild)
  {
    this.box.removeChild(this.box.firstChild);
  }
};

bamboo.ui.zone.menu.popup.prototype.popup = function(posX, posY, contentNode, isRTL)
{
  this.clear();

  this.container.setAttribute('popup-menu-open', 'true');
  this.move(posX, posY, true);

  this.box.setAttribute('isrtl', isRTL);
  this.box.setAttribute('theme', bamboo.option.get('display-theme'));
  this.box.setAttribute('viewstyle', bamboo.option.get('display-view-style'));
  this.box.appendChild(contentNode);
};

bamboo.ui.zone.menu.popup.prototype.setPopupStyle = function(top, left, w, h)
{
  var style = 'top: ' + top + 'px; left: ' + left + 'px; width: ' + w + 'px; height: ' + h + 'px;';

  this.popupNode.setAttribute('style', style);
};

bamboo.ui.zone.menu.popup.prototype.move = function(posX, posY, firstDisplay)
{
  const cursorSpace = 10;

  var fullHeight = bamboo.ui.panelArea.clientHeight;
  var fullWidth = bamboo.ui.panelArea.clientWidth;

  var vOffsetTop = 0;
  var hOffsetLeft = 0;

  if(bamboo.ui.popupIsOpen)
  {
    try
    {
      var pop = bamboo.doc.getElementById(bamboo.ui.popupId);
      posX -= pop.boxObject.x;
      posY -= pop.boxObject.y;
    }
    catch (e) {}
  }

  var menuPos = bamboo.option.get('menu-position');
  if(menuPos == 'left')
  {
    hOffsetLeft = bamboo.ui.rootNode.clientWidth - fullWidth;
  }
  else if(menuPos == 'top')
  {
    vOffsetTop = bamboo.ui.rootNode.clientHeight - fullHeight;
  }

  var top = posY + cursorSpace - vOffsetTop;
  var left = posX + cursorSpace - hOffsetLeft;
  var w = fullWidth - left;
  var h = fullHeight - top;

  this.setPopupStyle(top, left, w, h);

  if(firstDisplay)
  { return; }

  if(this.popupNode.scrollHeight > this.popupNode.clientHeight)
  {
    top = fullHeight - this.popupNode.scrollHeight;
    if(top < 0)
    {
      top = 0;
    }
    h = fullHeight - top;

    if(this.popupNode.scrollWidth > this.popupNode.clientWidth && this.popupNode.scrollWidth <= (left - 2 * cursorSpace))
    {
      w = this.popupNode.scrollWidth;
      left = left - 2 * cursorSpace - w;
    }

    this.setPopupStyle(top, left, w, h);
  }
  else if(this.popupNode.scrollWidth > this.popupNode.clientWidth)
  {
    w = this.popupNode.scrollWidth;
    left = fullWidth - w;
    if(left < 0)
    {
      left = 0;
    }

    this.setPopupStyle(top, left, w, h);
  }
};
