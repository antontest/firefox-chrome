
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

/* Base filter */

bamboo.data.filter = function(name)
{
  bamboo.runnable.call(this);

  this.name = name;
  this.active = false;
};

bamboo.extend(bamboo.data.filter, bamboo.runnable);

bamboo.data.filter.prototype.isItemValid = function(item)
{
  return false;
};

bamboo.data.filter.prototype.activate = function(active, force, search)
{
  if(this.active != active || force)
  {
    this.active = active;

    if(!search && bamboo.selection)
    {
      bamboo.selectItem(bamboo.selection);
    }
    if(search && bamboo.searchSelection)
    {
      bamboo.selectSearchItem(bamboo.searchSelection);
    }
  }
};

/* Filter NEW */

bamboo.data.filterNew = function()
{
  bamboo.data.filter.call(this, 'new');
};

bamboo.extend(bamboo.data.filterNew, bamboo.data.filter);

bamboo.data.filterNew.prototype.isItemValid = function(item)
{
  return !item.readed;
};

/* Filter FAVORITE */

bamboo.data.filterFavorite = function()
{
  bamboo.data.filter.call(this, 'favorite');
};

bamboo.extend(bamboo.data.filterFavorite, bamboo.data.filter);

bamboo.data.filterFavorite.prototype.isItemValid = function(item)
{
  var p = item.getParent();
  return p && p.favorite;
};

/* Filter SEARCH */

bamboo.data.filterSearch = function()
{
  bamboo.data.filter.call(this, 'search');

  this.query = '';
  this.keywords = [];
  this.caseSensitive = false;
  this.onlyInTitles = false;
  this.matchFilters = false;
};

bamboo.extend(bamboo.data.filterSearch, bamboo.data.filter);

bamboo.data.filterSearch.prototype.setQuery = function(pQuery)
{
  this.query = pQuery;
  this.buildKeywords();
};

bamboo.data.filterSearch.prototype.buildKeywords = function()
{
  var currentQuery = this.caseSensitive ? this.query : this.query.toLowerCase();

  var tmpKeywords = currentQuery.split(' ');
  this.keywords = [];

  for(var i=0; i<tmpKeywords.length; i++)
  {
    var tmpKeyword = tmpKeywords[i];

    if(tmpKeyword.indexOf('"') != 0)
    {
      this.keywords.push(tmpKeyword);
    }
    else
    {
      var foundAt = -1;
      for(var n=i+1; n<tmpKeywords.length; n++)
      {
        if(foundAt < 0 && tmpKeywords[n].lastIndexOf('"') == (tmpKeywords[n].length - 1))
        {
          foundAt = n;
        }
      }

      if(foundAt < 0)
      {
        this.keywords.push(tmpKeyword);
      }
      else
      {
        var keyword = tmpKeyword.substr(1);
        for(var n=i+1; n<=foundAt; n++)
        {
          keyword += ' ' + tmpKeywords[n];
        }
        keyword = keyword.substr(0, keyword.length-1);
        this.keywords.push(keyword);
        i = foundAt;
      }
    }
  }
};

bamboo.data.filterSearch.prototype.setCaseSensitive = function(caseSensitive)
{
  this.caseSensitive = caseSensitive;
  this.buildKeywords();
};

bamboo.data.filterSearch.prototype.setOnlyInTitles = function(onlyInTitles)
{
  this.onlyInTitles = onlyInTitles;
};

bamboo.data.filterSearch.prototype.setMatchFilters = function(matchFilters)
{
  this.matchFilters = matchFilters;
};

bamboo.data.filterSearch.prototype.isItemValid = function(item)
{
  var targets = [item.title];

  if(!this.onlyInTitles)
  {
    targets.push(item.content);
  }

  for(var i=0; i<this.keywords.length; i++)
  {
    var found = false;
    var keyword = this.keywords[i];

    for(var n=0; n<targets.length; n++)
    {
      var target = targets[n];

      if(target)
      {
        if(!this.caseSensitive)
        {
          target = target.toLowerCase();
        }

        if(target.indexOf(keyword) >= 0)
        {
          found = true;
        }
      }
    }

    if(!found)
    {
      return false;
    }
  }

  return true;
};
