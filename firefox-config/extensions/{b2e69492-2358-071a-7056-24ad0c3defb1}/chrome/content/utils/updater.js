
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.utils.updater =
{
  run: bamboo.getRun(),
  stack: [],
  queue: [],

  update : function(feed)
  {
    if(this.stack.indexOf(feed.id) < 0 && this.queue.indexOf(feed.id) < 0)
    {
      this.queue.push(feed.id);
      this.launchUpdate();
    }
  },

  getFeed : function(id)
  {
    if(bamboo.factory.hasItem(id))
    {
      return bamboo.factory.getData(id);
    }
    return null;
  },

  launchUpdate: function()
  {
    var limit = Number(bamboo.option.get('simultaneous-updates'));

    if(this.queue.length > 0 && this.stack.length < limit)
    {
      var id = this.queue.shift();
      var feed = this.getFeed(id);
      if(feed)
      {
        this.stack.push(id);

        feed.onUpdateStart();

        bamboo.utils.ajax.load(feed.url,
        {
          onSuccess: function(xml)
          {
            if(xml)
            {
              bamboo.utils.updater.run('onUpdateSuccess', [id, xml]);
            }
            else
            {
              var msg = bamboo.utils.str('bamboo.message.error.format');
              bamboo.utils.updater.run('onUpdateError', [id, {message: msg}]);
            }
          },

          onError: function(feed, ex)
          {
            bamboo.utils.updater.run('onUpdateError', [id, ex]);
          }
        });
      }

      this.launchUpdate();
    }
  },

  onUpdateSuccess : function(id, xml)
  {
    var index = this.stack.indexOf(id);
    if(index >= 0)
    {
      this.stack.splice(index, 1);

      var feed = this.getFeed(id);
      if(feed)
      {
        feed.run('onUpdateSuccess', [xml]);
      }
    }

    this.launchUpdate();
  },

  onUpdateError : function(id, ex)
  {
    var index = this.stack.indexOf(id);
    if(index >= 0)
    {
      this.stack.splice(index, 1);

      var feed = this.getFeed(id);
      if(feed)
      {
        feed.run('onUpdateError', [ex]);
      }
    }

    this.launchUpdate();
  }
};
