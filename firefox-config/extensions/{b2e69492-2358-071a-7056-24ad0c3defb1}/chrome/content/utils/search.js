
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.utils.search =
{
  run : bamboo.getRun(),

  initialized : false,
  google : null,
  query : null,
  loading : false,
  
  setGoogleObject : function(obj)
  {
    this.google = obj;
    var t = this;
    this.google.setOnLoadCallback(function()
    {
      t.onLoad();
    });
  },
  
  search : function(query)
  {
    this.query = query;
    if(this.initialized)
    {
      bamboo.data.found.removeAll();
      bamboo.selectSearchItem(bamboo.data.found);
      bamboo.data.found.setLoading(true);
      this.loading = true;

      var t = this;
      this.google.feeds.findFeeds(this.query, function(result)
      {
        t.run('onResult', [result]);
      });
    }
  },
  
  onLoad : function()
  {
    this.initialized = true;

    if(this.query)
    {
      this.google.feeds.findFeeds(this.query, this.onResult);
    }
  },
  
  onResult : function(result)
  {
    if(this.loading)
    {
      this.loading = false;

      if(result.error)
      {
        bamboo.data.found.setLoading(false);
        bamboo.utils.error.log('Google search error: ' + result.error.message);
      }
      else
      {
        for(var i=0; i<result.entries.length; i++)
        {
          var entry = result.entries[i];

          bamboo.data.found.addFeed(bamboo.utils.clearString(entry.title), entry.url, entry.link);
        }

        bamboo.selectSearchItem(bamboo.data.found);
        bamboo.data.found.showView();
        bamboo.data.found.update();
      }
    }
  }
};
