
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.utils =
{  
  messageBundle : null,
  
  getMessageBundle : function()
  {
    if(this.messageBundle == null || !this.messageBundle.getString)
    {
      this.messageBundle = bamboo.doc.getElementById("bamboo-bundle");
    }
    return this.messageBundle;
  },

  str : function(messageID, doNotCall)
  {
    try
    {
      var messageBundle = this.getMessageBundle();

      if(messageBundle && messageBundle.getString)
      {
        return messageBundle.getString(messageID);
      }
      bamboo.utils.error.log('?: ' + messageID);
    }
    catch(ex)
    {
      var error = "";
      if(!doNotCall)
      {
        error = this.str('bamboo.error.stringbundle', true);
        error += ' "' + messageID + '"';
      }
      if(ex.message)
      {
        error += '\nDetails:\n';
        error += ex.message;
        error += '\n';
      }
      bamboo.utils.error.log(error);
    }
    return '?';
  },

  clearString : function(value)
  {
    var htmlService = Components.classes["@mozilla.org/feed-unescapehtml;1"].getService(Components.interfaces.nsIScriptableUnescapeHTML);
    return htmlService.unescape(value);
  },
  
  twoDigitNumber : function(n)
  {
    var s = n.toString();
    if(n < 10)
    {
      return  '0' + s;
    }
    var l = s.length;
    return l > 2 ? s.substr(l - 2, l) : s;
  },

  getWebsiteFromUrl : function(url)
  {
    var website = url;

    var index = url.indexOf('://');
    if(index == 4 || index == 5)
    {
      index = url.indexOf('/', index+4);
      if(index >= 0)
      {
        website = url.substr(0, index);
      }
    }

    return website;
  },

  getWebsiteHostFromUrl : function(url)
  {
    var ioService = null;
    var uri = null;

    try
    {
      ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
    }
    catch(ex)
    {
      return url;
    }

    try
    {
      uri = ioService.newURI(url, null, null);
    }
    catch(ex)
    {
      return url;
    }

    try
    {
      if (uri.host && uri.host.indexOf('www.') == 0)
      {
        return uri.host.substr(4);
      }
      return uri.host;
    }
    catch(ex)
    {
      return url;
    }
  },

  getIconFromUrl : function(urlList, handler)
  {
    this.getIconFromUrl2(urlList, handler, true);
  },

  getIconFromUrl2 : function(urlList, handler, firstTry)
  {
    var faviconService = null;
    var ioService = null;
    var uri = null;

    try
    {
      faviconService = Components.classes["@mozilla.org/browser/favicon-service;1"].getService(Components.interfaces.nsIFaviconService);
      ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
    }
    catch(ex)
    {
      handler();
    }

    var url = firstTry ? urlList[0] : urlList.shift();

    try
    {
      uri = ioService.newURI(url, null, null);

      var path = uri.prePath;

      if(firstTry)
      {
        path = uri.path;
        var index = path.lastIndexOf('/');
        if(index >= 0)
        {
          path = path.substring(0, index+1);
        }
        else
        {
          path = '';
        }
        path = uri.prePath + path;
      }

      uri = ioService.newURI(path, null, null);
    }
    catch(ex)
    {
      handler();
    }

    try
    {
      var asyncFavicons = faviconService.QueryInterface(Components.interfaces.mozIAsyncFavicons);

      asyncFavicons.getFaviconDataForPage(uri, function (aURI, aDataLen, aData, aMimeType)
      {
        if(aURI)
        {
          var mimeType = aMimeType ? aMimeType.value : '';
          handler('data:' + mimeType + ';base64,' + btoa(String.fromCharCode.apply(null, aData)));
        }
        else
        {
          if(urlList.length > 0)
          {
            bamboo.utils.getIconFromUrl2(urlList, handler, !firstTry);
          }
          else
          {
            handler();
          }
        }
      });
    }
    catch (ex)
    {
      handler();
    }
  },
  
  isVideoLink : function(url)
  {
    if(url)
    {
      if(url.indexOf('http://www.youtube.com/watch?') == 0 || url.indexOf('https://www.youtube.com/watch?') == 0)
      {
        return url.indexOf('v=') > 0;
      }
      if(url.indexOf('http://youtu.be/') == 0)
      {
        return true;
      }
      if(url.indexOf('http://www.youtube.com/embed/') == 0 || url.indexOf('https://www.youtube.com/embed/') == 0)
      {
        return true;
      }
      if(url.indexOf('http://www.dailymotion.com/video/') == 0)
      {
        return true;
      }

      var vimeo = '://vimeo.com/';

      if(url.indexOf(vimeo) > 0)
      {
        var index = url.indexOf(vimeo);
        var key = url.substr(index + vimeo.length);

        if(!isNaN(key))
        {
          return true;
        }

        return url.indexOf('clip_id=') > 0;
      }
    }
    return false;
  },
  
  getVideoType : function(url)
  {
    if(url)
    {
      if((url.indexOf('http://www.youtube.com/watch?') == 0 || url.indexOf('https://www.youtube.com/watch?') == 0) && url.indexOf('v=') > 0)
      {
        return 'youtube';
      }
      if(url.indexOf('http://youtu.be/') == 0)
      {
        return 'youtube';
      }
      if(url.indexOf('http://www.youtube.com/embed/') == 0 || url.indexOf('https://www.youtube.com/embed/') == 0)
      {
        return 'youtube';
      }
      if(url.indexOf('http://www.dailymotion.com/video/') == 0)
      {
        return 'dailymotion';
      }
      if(url.indexOf('://vimeo.com/') > 0)
      {
        return 'vimeo';
      }
    }
    return '';
  },
  
  getVideoUrl : function(url)
  {
    if(url)
    {
      var youtube = '://www.youtube.com/watch?';
      var youtubeShort = 'http://youtu.be/';
      var parameters = '?html=1&autoplay=1&html5=1';
      var dailymotion = 'http://www.dailymotion.com/video/';
      var vimeo = '://vimeo.com/';
      var index = null;
      var key = null;

      var anchorIndex = url.indexOf('#');
      if(anchorIndex > 0)
      {
        url = url.substring(0, anchorIndex);
      }

      if(url.indexOf('http://www.youtube.com/embed/') == 0 || url.indexOf('https://www.youtube.com/embed/') == 0)
      {
        return url + parameters;
      }
      if(url.indexOf('http' + youtube) == 0 || url.indexOf('https' + youtube) == 0)
      {
        var tag = 'v=';
        index = url.indexOf(tag);
        if(index > 0)
        {
          key = url.substr(index + tag.length);
          index = key.indexOf('&');
          if(index > 0)
          {
            key = key.substring(0, index);
          }
          return 'http://www.youtube.com/embed/' + key + parameters;
        }
      }
      else if(url.indexOf(youtubeShort) == 0)
      {
        return 'http://www.youtube.com/embed/' + url.substr(youtubeShort.length) + parameters;
      }
      else if(url.indexOf(dailymotion) == 0)
      {
        key = url.substr(dailymotion.length);
        index = key.indexOf('#');
        if(index > 0)
        {
          key = key.substring(0, index);
        }
        return 'http://www.dailymotion.com/embed/video/' + key + parameters;
      }
      else if(url.indexOf(vimeo) > 0)
      {
        var tag = 'clip_id=';
        index = url.indexOf(tag);
        if(index > 0)
        {
          key = url.substr(index + tag.length);
          index = key.indexOf('&');
          if(index > 0)
          {
            key = key.substring(0, index);
          }
        }
        else
        {
          index = url.indexOf(vimeo);
          key = url.substr(index + vimeo.length);
        }

        return 'http://player.vimeo.com/video/' + key + parameters;
      }

    }
    return null;
  },

  replaceItems : function(targetString, targetItems)
  {
    var item = null;
    var count = targetItems.length;
    for(var i=0; i<count; i++)
    {
      item = targetItems[i];

      while(targetString.indexOf(item.target) >= 0)
      {
        targetString = targetString.replace(item.target, item.content);
      }
    }

    return targetString;
  }
};
