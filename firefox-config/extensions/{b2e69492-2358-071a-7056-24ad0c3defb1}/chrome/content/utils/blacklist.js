
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.utils.blacklist =
{
  run: bamboo.getRun(),
  list : null,
  listFileName : 'blacklist-v2.json',
  
  getList : function()
  {
    if(this.list === null)
    {
      this.list = [];

      try
      {
        var strData = bamboo.utils.io.read(this.listFileName);

        var list = JSON.parse(strData);

        if(list && list.length)
        {
          this.list = list;
        }
      }
      catch(e) {}
    }
    return this.list;
  },

  onListChanged : function()
  {
    bamboo.data.page.showCurrentItems();
    bamboo.data.searchPage.showCurrentItems();
  },

  reload : function()
  {
    this.list = null;
    this.getList();
  },
  
  isBlocked : function(url)
  {
    var list = this.getList();
    var count = list.length;

    for(var i=0; i<count; i++)
    {
      var target = list[i];
      var type = 'exact';
      if(target.indexOf('*') == 0)
      {
        type = 'ends';
        target = target.substr(1);
      }
      var targetLength = target.length;
      if(targetLength > 0 && target.lastIndexOf('*') == (targetLength - 1))
      {
        type = type == 'ends' ? 'contains' : 'starts';
        target = target.substr(0, targetLength - 1);
        targetLength--;
      }

      switch (type)
      {
        case 'exact':
        {
          if(url == target)
          {
            return true;
          }
          break;
        }
        case 'ends':
        {
          if(url.indexOf(target) == (url.length - targetLength))
          {
            return true;
          }
          break;
        }
        case 'starts':
        {
          if(url.indexOf(target) == 0)
          {
            return true;
          }
          break;
        }
        case 'contains':
        {
          if(url.indexOf(target) >= 0)
          {
            return true;
          }
          break;
        }
        default:
          break;
      }
    }

    return false;
  },
  
  add : function(url)
  {
    this.getList();
    this.list.push(url);
    this.save();
    this.onListChanged();
  },
  
  save : function()
  {
    this.getList();

    var jsonContent = JSON.stringify(this.list);
    bamboo.utils.io.write(this.listFileName, jsonContent);
  },
  
  setList : function(newList)
  {
    this.list = newList;
    this.save();
    this.onListChanged();
  },
  
  edit : function(editedList)
  {
    var message = bamboo.utils.str('bamboo.button.editblacklist');
    var action = bamboo.utils.str('bamboo.button.save');
    var choices = { blacklist: { type: 'list', values: editedList ? editedList : this.getList(), editHandler: function(value, values)
    {
      bamboo.utils.blacklist.showRuleUi(value, false, values);
    }}};

    bamboo.ui.showConfirmDialog(message, action, choices,
    {
    onSecondaryAction: function()
    {
      bamboo.utils.blacklist.showRuleUi('', true);
    },
    onValidation: function(result)
    {
      bamboo.utils.blacklist.setList(result.blacklist);
      bamboo.run('selectItem', [bamboo.selection]);
    }},
    bamboo.utils.str('bamboo.button.add'));
  },

  showRuleUi : function(url, isNew, editedList)
  {
    var message = bamboo.utils.str(isNew ? 'bamboo.button.addtoblacklist' : 'bamboo.button.editfromblacklist');
    var action = bamboo.utils.str(isNew ? 'bamboo.button.add' : 'bamboo.button.ok');
    var choices = { input: { type: 'input', value: url, desc: bamboo.utils.str('bamboo.button.blacklistrule') },
                    info: {type: 'label', value: bamboo.utils.str('bamboo.button.blacklistruleinfo')}};

    bamboo.ui.showConfirmDialog(message, action, choices,
    {
    onCancel: function()
    {
      if(editedList)
      {
        bamboo.utils.blacklist.run('edit', [editedList]);
      }
    },
    onValidation: function(result)
    {
      if(editedList)
      {
        if(isNew)
        {
          editedList.push(result.input);
        }
        else
        {
          for(var i=0; i<editedList.length; i++)
          {
            if(editedList[i] == url)
            {
              editedList[i] = result.input;
            }
          }
        }
        bamboo.utils.blacklist.run('edit', [editedList]);
      }
      else
      {
        bamboo.utils.blacklist.add(result.input);
        bamboo.run('selectItem', [bamboo.selection]);
      }
    }});
  }
};
