
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.ui.dd.group = function(id, node)
{
  bamboo.ui.dd.base.call(this, id, node, 'group', ['group', 'feed'], false);

  this.init();
};

bamboo.extend(bamboo.ui.dd.group, bamboo.ui.dd.base);

bamboo.ui.dd.group.prototype.onDragOver = function(event)
{
  if(this.dragover)
  {
    if(this.overtype == 'feed')
    {
      var sourceId = event.dataTransfer.getData('bamboo/' + this.overtype);
      var sourceData = bamboo.factory.getItem(sourceId).data;
      var data = bamboo.factory.getItem(this.id).data;

      if(sourceData.getParent() != data)
      {
        this.action = 'in';
      }
    }
    else
    {
      var percentY = (event.clientY + 1 - this.node.boxObject.y) / this.node.boxObject.height;

      if(percentY < 0.3)
      {
        this.action = 'up';
      }else{
        if(percentY < 0.6)
        {
          this.action = 'in';
        }else{
          this.action = 'down';
        }
      }
    }
    this.updateAction();
    if(this.action != '')
    {
      event.preventDefault();
    }
  }
};

bamboo.ui.dd.group.prototype.onDrop = function(event)
{
  var act = this.action;
  this.action = '';
  this.updateAction();

  var sourceId = event.dataTransfer.getData('bamboo/' + this.overtype);

  if(sourceId == '')
  { return; }

  var sourceData = bamboo.factory.getItem(sourceId).data;
  var targetData = bamboo.factory.getItem(this.id).data;
  var moved = true;

  if(sourceData instanceof bamboo.data.group)
  {
    if(sourceData.isChildGroup(targetData))
    {
      bamboo.ui.showMessageDialog(bamboo.utils.str('bamboo.message.impossibledirmove'));
      moved = false;
    }else{
      bamboo.ui.dd.moveGroup(sourceData, targetData, act);
    }
  }
  else
  {
    bamboo.ui.dd.moveFeedToGroup(sourceId, targetData);
  }

  if(moved)
  {
    bamboo.data.run('saveBackup');
    bamboo.data.save();
  }
};
