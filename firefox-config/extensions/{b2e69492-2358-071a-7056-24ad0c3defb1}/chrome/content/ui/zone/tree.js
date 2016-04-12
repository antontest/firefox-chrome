
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.ui.zone.tree = function(target, isSearch)
{
  bamboo.ui.component.call(this, target);

  this.tree = null;
  this.splitter = null;
  this.header = null;
  this.search = isSearch;

  this.drag = false;
  this.startPos = 0;
  this.curPos = 0;
};

bamboo.extend(bamboo.ui.zone.tree, bamboo.ui.component);

bamboo.ui.zone.tree.prototype.build = function()
{
  this.tree = bamboo.doc.createElement('vbox');
  this.tree.setAttribute('class', 'bamboo-zone-tree');
  this.container.appendChild(this.tree);

  this.splitter = bamboo.doc.createElement('vbox');
  this.splitter.setAttribute('class', 'bamboo-zone-splitter');
  this.container.appendChild(this.splitter);

  var self = this;

  this.splitter.addEventListener('mousedown', function(event)
  {
    self.startPos = event.screenX;
    self.curPos = event.screenX;
    self.drag = true;
  });

  this.container.addEventListener('mouseup', function(event)
  {
    if(self.drag)
    {
      self.update(true);
    }
  });

  this.container.addEventListener('mousemove', function(event)
  {
    if(self.drag)
    {
      self.curPos = event.screenX;
      self.update();
    }
  });

  this.header = bamboo.doc.createElement('vbox');
  this.header.setAttribute('class', 'bamboo-zone-tree-header ');
  this.tree.appendChild(this.header);

  var tree = bamboo.doc.createElement('vbox');
  tree.setAttribute('class', 'bamboo-zone-tree-view');
  tree.setAttribute('flex', '1');
  this.tree.appendChild(tree);

  this.update();

  return tree;
};

bamboo.ui.zone.tree.prototype.update = function(endDrag)
{
  var option = this.search ? 'tree-width-search' : 'tree-width';

  var width = Number(bamboo.option.get(option));

  if(this.drag)
  {
    var gap = this.startPos - this.curPos;

    if(bamboo.ui.isInTab())
    {
      var w = 0;
      for(var i=0; i<this.container.childNodes.length; i++)
      {
        w += this.container.childNodes[i].clientWidth;
      }
      if(this.container.clientWidth > w)
      {
        var align = bamboo.option.get('interface-align');
        if(align == 'center')
        {
          gap *= 2;
        }
        else if(align == 'end')
        {
          gap *= -1;
        }
      }
    }

    width -= gap;
  }

  if(width > 500)
  {
    width = 500;
  }
  if(width < 50)
  {
    width = 50;
  }

  if(this.drag)
  {
    if(endDrag)
    {
      this.drag = false;

      bamboo.option.set(option, width);
    }
  }
  this.tree.setAttribute('style', 'width: ' + width + 'px;');
  this.tree.setAttribute('sidebarmode', !this.search && width < 100);
};
