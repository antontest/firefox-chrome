
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.factory =
{
  run: bamboo.getRun(),

  content : {},
  currentId : 0,

  item : function(data, parent, view)
  {
    this.data = data;
    this.parent = parent;
    this.view = view;
  },
  /*
  log : function(id)
  {
    var nbNull = 0;
    var nbData = 0;
    var nbView = 0;

    for(var id in this.content)
    {
      if(!this.content[id])
      {
        nbNull++;
      }
      if(this.content[id] && this.content[id].data)
      {
        nbData++;
      }
      if(this.content[id] && this.content[id].view)
      {
        nbView++;
      }
    }

    return 'nbData: ' + nbData + 'nbNull: ' + nbNull + 'nbView: ' + nbView;
  },*/

  hasItem : function(id)
  {
    return this.content['item-' + id] ? true : false;
  },

  getItem : function(id)
  {
    var foundItem = this.content['item-' + id];
    if(!foundItem)
    {
      bamboo.utils.error.log('No item corresponding to id "' + id + '"', true);
    }
    return foundItem;
  },

  delItem : function(id)
  {
    if(this.content['item-' + id])
    {
      if(this.content['item-' + id].view)
      {
        this.content['item-' + id].view = null;
      }
      if(this.content['item-' + id].parent)
      {
        this.content['item-' + id].parent = null;
      }
      if(this.content['item-' + id].data)
      {
        this.content['item-' + id].data = null;
      }
      delete this.content['item-' + id];
    }
  },

  getData : function(id)
  {
    var foundItem = this.getItem(id);
    if(foundItem)
    {
      return foundItem.data;
    }
    return null;
  },

  getParent : function(id)
  {
    var foundItem = this.getItem(id);
    if(foundItem)
    {
      return foundItem.parent;
    }
    return null;
  },

  setParent : function(id, data)
  {
    var foundItem = this.getItem(id);
    if(foundItem)
    {
      foundItem.parent = data;
    }
  },

  hasView : function(id)
  {
    var foundItem = this.getItem(id);
    return foundItem != null && foundItem.view != null;
  },

  getView : function(id)
  {
    var foundItem = this.getItem(id);
    if(foundItem)
    {
      return foundItem.view;
    }
    return null;
  },

  delView : function(id)
  {
    var foundItem = this.getItem(id);
    delete foundItem.view;
  },

  create : function(data, parent)
  {
    this.currentId++;

    this.content['item-' + this.currentId] = new this.item(data, parent, null);

    return this.currentId;
  },

  createView : function(id)
  {
    var foundItem = this.getItem(id);
    if(foundItem)
    {
      if(!foundItem.view)
      {
        var found = false;
        var view = null;

        if(foundItem.data instanceof bamboo.data.root)
        {
          found = true;
          view = new bamboo.ui.view.root(id);
        }
        if(foundItem.data instanceof bamboo.data.library)
        {
          found = true;
          view = new bamboo.ui.view.library(id);
        }
        if(!found && foundItem.data instanceof bamboo.data.item)
        {
            found = true;
            var search = this.getParent(id) instanceof bamboo.data.searchfeed;
            view = new bamboo.ui.view.item(id, search);
        }
        if(!found && foundItem.data instanceof bamboo.data.paginator)
        {
            found = true;
            view = new bamboo.ui.view.paginator(id, foundItem.data.search);
        }
        if(!found && foundItem.data instanceof bamboo.data.search)
        {
            found = true;
            view = new bamboo.ui.view.search(id);
        }
        if(!found)
        {
          if(!foundItem.parent || !foundItem.parent.getView)
          {
            bamboo.utils.error.log('no parent for: ' + foundItem.data.str(), true);
            return;
          }
          if(foundItem.parent.getView() == null)
          {
            var msg = 'no parent view for: ' + foundItem.data.str() + '\nparent: ';
            msg += foundItem.parent.str ? foundItem.parent.str() : 'none';
            bamboo.utils.error.log(msg, true);
            return;
          }
          var ctn = foundItem.parent.getView().childContainer;

          if(foundItem.data instanceof bamboo.data.group)
          {
            view = new bamboo.ui.view.group(id, ctn[1]);
          }
          if(foundItem.data instanceof bamboo.data.searchfeed)
          {
            view = new bamboo.ui.view.searchfeed(id, ctn[0]);
          }
          else if(foundItem.data instanceof bamboo.data.feed)
          {
            view = new bamboo.ui.view.feed(id, ctn[0]);
          }
        }
        foundItem.view = view;
      }
    }
  }
};

