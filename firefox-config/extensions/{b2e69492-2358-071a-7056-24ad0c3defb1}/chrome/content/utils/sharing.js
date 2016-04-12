
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.utils.sharing =
{
  run: bamboo.getRun(),

  fileName: 'sharing-links.json',
  links: null,
  defaultLinks: null,
  customLinks: null,

  getLinks: function()
  {
    if(!this.links)
    {
      this.links = [];

      var defaultLinks = this.getDefaultLinks();
      for(var i=0; i<defaultLinks.length; i++)
      {
        this.links.push(defaultLinks[i]);
      }

      this.getCustomLinks();

      for(var i=0; i<this.customLinks.length; i++)
      {
        this.links.push(this.customLinks[i]);
      }
    }
    return this.links;
  },

  getCustomLinks: function()
  {
    if(!this.customLinks)
    {
      var strData = '';
      var noFile = false;
      try
      {
        strData = bamboo.utils.io.read(this.fileName);
      }
      catch(ex)
      {
        if(ex.message && ex.message.indexOf('NS_ERROR_FILE_NOT_FOUND') >= 0)
        {
          noFile = true;
        }else{
          throw ex;
        }
      }

      this.customLinks = noFile ? [] : JSON.parse(strData);
    }
    return this.customLinks;
  },

  hasCustomLink: function(name)
  {
    for(var i=0; i<this.customLinks.length; i++)
    {
      if(this.customLinks[i].name == name)
      {
        return true;
      }
    }
    return false;
  },

  getDefaultLinks: function()
  {
    if(!this.defaultLinks)
    {
      this.defaultLinks = [];

      this.defaultLinks.push({id: 'facebook', name: 'Facebook', icon: 'chrome://bamboo/skin/img/icon-sharing-facebook.gif', url: 'https://www.facebook.com/sharer.php?u=%url%&t=%title%'});
      this.defaultLinks.push({id: 'twitter', name: 'Twitter', icon: 'chrome://bamboo/skin/img/icon-sharing-twitter.ico', url: 'https://twitter.com/share?url=%url%&text=%title%'});
      this.defaultLinks.push({id: 'google', name: 'Google +', icon: 'chrome://bamboo/skin/img/icon-sharing-google.ico', url: 'https://plus.google.com/share?url=%url%'});
      this.defaultLinks.push({id: 'linkedin', name: 'LinkedIn', icon: 'chrome://bamboo/skin/img/icon-sharing-linkedin.ico', url: 'https://www.linkedin.com/shareArticle?url=%url%&title=%title%'});
      this.defaultLinks.push({id: 'delicious', name: 'Delicious', icon: 'chrome://bamboo/skin/img/icon-sharing-delicious.ico', url: 'https://delicious.com/save?v=5&noui&jump=close&url=%url%&title=%title%'});
      this.defaultLinks.push({id: 'pocket', name: 'Pocket', icon: 'chrome://bamboo/skin/img/icon-sharing-pocket.ico', url: 'https://getpocket.com/edit?url=%url%&title=%title%'});
      this.defaultLinks.push({id: 'readability', name: 'Readability', icon: 'chrome://bamboo/skin/img/icon-sharing-readability.png', url: 'http://www.readability.com/save?url=%url%'});
    }
    return this.defaultLinks;
  },

  setCustomLinks: function(customLinks)
  {
    this.links = null;
    this.customLinks = customLinks;
    this.save();
  },

  addCustomLink: function(name, url)
  {
    this.links = null;
    this.customLinks.push({name: name, url: url});
    this.save();
  },

  save : function()
  {
    var jsonContent = JSON.stringify(this.customLinks);
    bamboo.utils.io.write(this.fileName, jsonContent);
  }
};
