
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.ui.dd.root = function(id, node)
{
  bamboo.ui.dd.base.call(this, id, node, 'root', ['group', 'feed'], true);

  this.init();
};

bamboo.extend(bamboo.ui.dd.root, bamboo.ui.dd.base);

bamboo.ui.dd.root.prototype.onDragOver = function(event)
{
  if(this.dragover)
  {
    var sourceId = event.dataTransfer.getData('bamboo/' + this.overtype);
    var sourceData = bamboo.factory.getItem(sourceId).data;
    var data = bamboo.factory.getItem(this.id).data;

    if(sourceData.getParent() != data)
    {
      this.action = 'in';
    }

    this.updateAction();
    if(this.action != '')
    {
      event.preventDefault();
    }
  }
};

bamboo.ui.dd.root.prototype.onDrop = function(event)
{
  var act = this.action;
  this.action = '';
  this.updateAction();

  if(act == 'in')
  {
    var sourceId = event.dataTransfer.getData('bamboo/' + this.overtype);

    var sourceData = bamboo.factory.getItem(sourceId).data;
    var targetData = bamboo.factory.getItem(this.id).data;
    var moved = true;

    if(sourceData instanceof bamboo.data.group)
    {
      if(sourceData.isChildGroup(targetData))
      {
        bamboo.ui.showMessageDialog('Target dir contained in the dir');
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
  }
};
