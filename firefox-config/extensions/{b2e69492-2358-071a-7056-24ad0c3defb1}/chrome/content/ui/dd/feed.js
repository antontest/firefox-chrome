
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.ui.dd.feed = function(id, node)
{
  bamboo.ui.dd.base.call(this, id, node, 'feed', ['feed'], false);

  this.init();
};

bamboo.extend(bamboo.ui.dd.feed, bamboo.ui.dd.base);

bamboo.ui.dd.feed.prototype.onDragOver = function(event)
{
  if(this.dragover)
  {
    var percentY = (event.clientY + 1 - this.node.boxObject.y) / this.node.boxObject.height;

    if(percentY < 0.5)
    {
      this.action = 'up';
    }else{
      this.action = 'down';
    }
    this.updateAction();
    event.preventDefault();
  }
};

bamboo.ui.dd.feed.prototype.onDrop = function(event)
{
  var before = this.action == 'up';
  var sourceId = event.dataTransfer.getData('bamboo/feed');

  if(sourceId == '')
  { return; }

  this.action = '';
  this.updateAction();

  bamboo.ui.dd.moveFeed(sourceId, this.id, before);

  bamboo.data.run('saveBackup');
  bamboo.data.save();
};
