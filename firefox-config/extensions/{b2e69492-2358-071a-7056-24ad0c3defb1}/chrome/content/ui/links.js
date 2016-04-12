
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.ui.links =
{
  run: bamboo.getRun(),

  menuItemBlockLink: null,
  menuItemBlockImage: null,

  init : function()
  {
    var self = this;
    var menu = bamboo.doc.getElementById(bamboo.isFirefox ? 'contentAreaContextMenu' : 'mailContext');
    menu.addEventListener("popupshowing", function(event)
    {
      self.run('onPopupShowing', [event, this]);
    }, false);
  },

  onPopupShowing : function(event, target)
  {
    if(bamboo.win.gContextMenu && bamboo.win.gContextMenu.target)
    {
      var self = this;

      if(!this.menuItemBlockImage)
      {
        this.menuItemBlockImage = bamboo.doc.getElementById("bamboo-contextmenu-blockimage");

        if(!this.menuItemBlockImage)
        {
          this.menuItemBlockImage = event.currentTarget.ownerDocument.createElement("menuitem");
          this.menuItemBlockImage.setAttribute('class', 'menuitem-iconic bamboo-context-menu-button-blocklink');
          this.menuItemBlockImage.setAttribute('label', bamboo.utils.str('bamboo.contextmenu.message.blockimage'));
          event.currentTarget.appendChild(this.menuItemBlockImage);
        }
        this.menuItemBlockImage.addEventListener("command", function(event)
        {
          self.run('onBlockLink', [bamboo.win.gContextMenu.mediaURL ? bamboo.win.gContextMenu.mediaURL : bamboo.win.gContextMenu.imageURL]);
        }, false);
      }

      try
      {
        this.menuItemBlockImage.hidden = !bamboo.win.gContextMenu.target.getAttribute('bambooimage');
      }
      catch (ex) {}
    }
  },

  onBlockLink : function(link)
  {
    if(bamboo.option.get('use-ads-blocker') == 'false')
    {
      bamboo.ui.showMessageDialog(bamboo.utils.str('bamboo.message.mustactivateblocker'));
    }
    else
    {
      var website = bamboo.utils.getWebsiteFromUrl('' + link);
      var message = bamboo.utils.str('bamboo.message.blockcontent');
      var action = bamboo.utils.str('bamboo.button.ok');

      bamboo.ui.run('showConfirmDialog', [message, action, {type: { type: 'radio', values: [bamboo.utils.str('bamboo.message.addsitetoblacklist').replace('%url%', website),
                                                                                            bamboo.utils.str('bamboo.message.addruletoblacklist')]},
                                                            spacer: {type: 'label', value: ''},
                                                            info: {type: 'label', value: bamboo.utils.str('bamboo.message.blacklistinfo')}},
      {
        onValidation: function(result)
        {
          if(result.type == 1)
          {
            bamboo.utils.blacklist.showRuleUi('' + link, true);
          }
          else
          {
            bamboo.utils.blacklist.add(website + '*');
            bamboo.run('selectItem', [bamboo.selection]);
          }
        }
      }]);
    }
  }
};

