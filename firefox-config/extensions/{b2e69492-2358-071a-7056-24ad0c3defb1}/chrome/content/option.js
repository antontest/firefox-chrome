
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.option =
{
  run: bamboo.getRun(),
  content : {},
  prefService : null,
  
  init : function()
  {
    this.content = {};
    this.content['feed-backup'] = '';
    this.content['data-dir-path'] = '';
    this.content['audio-animation'] = 'wave';
    this.content['tree-width'] = '200';
    this.content['tree-width-search'] = '200';
    this.content['menu-position'] = 'top';
    this.content['content-mode'] = 'false';
    this.content['force-new-tab'] = 'true';
    this.content['force-tab-in-background'] = 'false';
    this.content['force-open'] = 'false';
    this.content['menu-only-icons'] = 'false';
    this.content['max-tab-open-count'] = '10';
    this.content['simultaneous-updates'] = '10';
    this.content['auto-update'] = 'false';
    this.content['init-update'] = 'false';
    this.content['update-only-favorite'] = 'false';
    this.content['auto-update-delay'] = '0';
    this.content['page-item-count'] = '20';
    this.content['mark-as-read-on-next-page'] = 'true';
    this.content['confirm-mark-as-read-from-tree'] = 'true';
    this.content['use-ads-blocker'] = 'true';
    this.content['display-mode'] = 'tab';
    this.content['loading-timeout'] = '30';
    this.content['toolbar-button-added'] = 'false';
    this.content['apply-filter-tree'] = 'false';
    this.content['filter-new'] = 'false';
    this.content['filter-favorite'] = 'false';
    this.content['display-theme'] = 'blue';
    this.content['display-view-style'] = 'light';
    this.content['display-density'] = 'default';
    this.content['youtube-integration'] = 'true';
    this.content['thunderbird-link-in-tab'] = 'true';
    this.content['interface-align'] = 'center';
    this.content['show-content-popup'] = 'true';
    this.content['show-embed-content'] = 'true';
    this.content['show-link-popup'] = 'true';
    this.content['sort-older-first'] = 'false';
    this.content['use-cache'] = 'true';
    this.content['recover-icons'] = 'true';
    this.content['show-article-author'] = 'true';
    this.content['show-feed-icons'] = 'true';
    this.content['show-notifications-'] = 'true';
    this.content['show-notifications-only-auto'] = 'true';
    this.content['notifications-text'] = '';
    this.content['button-text'] = '';
    this.content['button-text-unread'] = ' %U';
    this.content['tab-text'] = 'Bamboo';
    this.content['tab-text-unread'] = 'Bamboo (%U)';
    this.content['show-sharing-link-mail'] = 'true';
    this.content['limit-mail-length'] = 'true';
    this.content['sharing-mail-subject'] = '%title%';
    this.content['sharing-mail-body'] = '%url%\n\n%content%';
    this.content['sharing-mail-to'] = '';
    this.content['show-sharing-link-facebook'] = 'true';
    this.content['show-sharing-link-twitter'] = 'true';
    this.content['show-sharing-link-google'] = 'true';
    this.content['show-sharing-link-linkedin'] = 'true';
    this.content['show-sharing-link-delicious'] = 'true';
    this.content['show-sharing-link-pocket'] = 'true';
    this.content['show-sharing-link-readability'] = 'true';

    for(var option in this.content)
    {
      var value = this.getPref( option );
      if(!value)
      {
        this.setPref( option, this.content[option] );
      }
      else
      {
        this.content[option] = value;
      }
    }
  },
  
  get : function(option)
  {
    return this.content[option];
  },
  
  set : function(option, value)
  {
    this.setPref(option, value);
    this.content[option] = value;
  },
  
  getPref: function(name)
  {
    return this.getPrefString('extensions.' + bamboo.ID + '.' + name);
  },
  
  getPrefString: function(name)
  {
    try
    {
      return this.getPrefService().getCharPref(name);
    }
    catch(ex)
    {
      return null;
    }
  },
  
  setPref : function(option, value)
  {
    this.setPrefString('extensions.' + bamboo.ID + '.' + option, value);
  },
  
  setPrefString : function(option, value)
  {
    this.getPrefService().setCharPref(option, value);
  },
  
  getPrefService : function()
  {
    if(this.prefService == null)
    {
      this.prefService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
    }
    return this.prefService;
  }
};

