
const Cc = Components.classes;
const Ci = Components.interfaces;

Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");
Components.utils.import("resource://gre/modules/Services.jsm");

function AboutBamboo() { }

AboutBamboo.prototype =
{
  classDescription: "about:sitename",
  contractID: "@mozilla.org/network/protocol/about;1?what=bamboo",
  classID: Components.ID("{ff568d60-91c4-4a86-b839-4d0cb39aebbc}"),
  QueryInterface: XPCOMUtils.generateQI([Ci.nsIAboutModule]),

  getURIFlags: function(aURI)
  {
    return Ci.nsIAboutModule.ALLOW_SCRIPT;
  },

  newChannel: function(aURI, aSecurity_or_aLoadInfo)
  {
    var ios = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);
    var aboutURL = "chrome://bamboo/content/page.xul";
    var channel;

    if(Services.vc.compare(Services.appinfo.version, '47.*') > 0)
    {
      var uri = ios.newURI(aboutURL, null, null);

      channel = ios.newChannelFromURIWithLoadInfo(uri, aSecurity_or_aLoadInfo);
    }
    else
    {
      channel = ios.newChannel(aboutURL, null, null);
    }

    channel.originalURI = aURI;
    return channel;
  }
};
const NSGetFactory = XPCOMUtils.generateNSGetFactory([AboutBamboo]);
