
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.ui.dd.base = function(id, node, type, accepted, onlydrop)
{
  bamboo.runnable.call(this);

  this.id = '' + id;
  this.node = node;
  this.type = type;
  this.accepted = accepted;
  this.onlydrop = onlydrop;
  this.dragover = false;
  this.overtype = '';
  this.action = '';
  this.image = null;
};

bamboo.extend(bamboo.ui.dd.base, bamboo.runnable);

bamboo.ui.dd.base.prototype.init = function()
{
  var dd = this;
  if(!this.onlydrop)
  {
     this.node.addEventListener("dragstart", function(event){ dd.run('onDragStart', [event]); }, false);
  }
   this.node.addEventListener("dragenter", function(event){ dd.run('onDragEnter', [event]); }, false);
   this.node.addEventListener("dragleave", function(event){ dd.run('onDragLeave', [event]); }, false);
   this.node.addEventListener("dragover", function(event){ dd.run('onDragOver', [event]); }, false);
   this.node.addEventListener("drop", function(event){ dd.run('onDrop', [event]); }, false);
};

bamboo.ui.dd.base.prototype.updateAction = function()
{
  var view = bamboo.factory.getItem(this.id).view;
  view.setAction(this.action);
};

bamboo.ui.dd.base.prototype.onDragStart = function(event)
{
  for(var i=0; i<event.dataTransfer.types.length; i++)
  {
    event.dataTransfer.clearData(event.dataTransfer.types[i]);
  }
  event.dataTransfer.setData('bamboo/' + this.type, this.id);
  event.dataTransfer.setDragImage(this.node, 20, -20);
};

bamboo.ui.dd.base.prototype.onDragEnter = function(event)
{
  this.dragover = false;
  var acceptedItem;
  for(var i=0; i<this.accepted.length; i++)
  {
    acceptedItem = this.accepted[i];
    if(event.dataTransfer.types.contains('bamboo/' + acceptedItem)
    && event.dataTransfer.getData('bamboo/' + acceptedItem) != this.id)
    {
      this.dragover = true;
      this.overtype = acceptedItem;
      event.preventDefault();
      break;
    }
  }
};

bamboo.ui.dd.base.prototype.onDragLeave = function(event)
{
  this.action = '';
  this.updateAction();
};
