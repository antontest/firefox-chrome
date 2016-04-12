
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.utils.parser =
{
  parse : function(xml, feed, readFeedInfo)
  {
    var data;
    var rss = xml.getElementsByTagName('rss');
    var atom = xml.getElementsByTagName('feed');
    var rdf = xml.getElementsByTagName('rdf:RDF');
    var isRSS = rss.length > 0;
    var isAtom = atom.length > 0;
    var isRdf = rdf.length > 0;
    if(isRSS || isAtom || isRdf)
    {
      if(isRSS)
      {
        data = rss[0];
      }else{
        data = isAtom ? atom[0] : rdf[0];
      }
    }
    else
    {
      var msg = bamboo.utils.str('bamboo.message.error.format');

      try
      {
        var errors = xml.getElementsByTagName('parsererror');
        if(errors.length > 0)
        {
          msg += ' \n' + errors[0].textContent;
        }
      }catch (e){}

      throw {message: msg};
    }
    try
    {
      return this.parseDataNode(data, feed, readFeedInfo, isAtom);
    }
    catch(ex)
    {
      var msg = bamboo.utils.str('bamboo.import.error.parse');
      if(ex.message)
      {
        msg += ': ' + ex.message;
      }
      msg += ' (' + feed.url +  ')';
      
      throw {message: msg};
    }
  },
  
  parseDataNode : function(data, feed, readFeedInfo, isAtom)
  {
    if(readFeedInfo)
    {
      // Title
      var titleNodes = data.getElementsByTagName('title');
      if(titleNodes.length > 0)
      {
        feed.name = new String(titleNodes[0].textContent).trim();
      }
      if(feed.name == '')
      {
        feed.name = '?';
      }
    }

    if(!isAtom && (readFeedInfo || feed.isRTL == 'notset'))
    {
      var isRTL = 'false';

      var langNodes = data.getElementsByTagName('language');
      if(langNodes.length > 0)
      {
        var lang = langNodes[0].textContent;

        if(lang.indexOf && (lang.indexOf('ar') == 0 || lang.indexOf('fa') == 0 || lang.indexOf('ur') == 0 || lang.indexOf('ps') == 0 || lang.indexOf('syr') == 0 || lang.indexOf('dv') == 0 || lang.indexOf('he') == 0 || lang.indexOf('yi') == 0))
        {
          isRTL  = 'true';
        }
      }

      feed.isRTL = isRTL;
    }

    var items = [];

    var buildItem;
    
    var date = null;
    var newItemNode;
    var newItemNodes = data.getElementsByTagName(isAtom ? 'entry' : 'item');
    var titleNodes = null;
    var count = newItemNodes.length;
    for(var i=0; i<count; i++)
    {
      newItemNode = newItemNodes[i];
      
      buildItem = new bamboo.data.item(feed);
      buildItem.itemID = null;
      buildItem.readed = false;
      buildItem.content = '';
      titleNodes = newItemNode.getElementsByTagName('title');
      buildItem.title = titleNodes.length > 0 ? titleNodes[0].textContent : feed.name;
      buildItem.title = new String(buildItem.title).trim();
      if(buildItem.title == '')
      {
        buildItem.title = feed.name;
      }
      buildItem.title = bamboo.utils.clearString(buildItem.title);

      if(isAtom)
      {
        var idNodes = newItemNode.getElementsByTagName('id');
        if(idNodes.length > 0)
        {
          buildItem.itemID = idNodes[0].textContent;
        }

        if(newItemNode.getElementsByTagName('content').length > 0)
        {
          var contentNode = newItemNode.getElementsByTagName('content')[0];
          buildItem.content += contentNode.textContent;

          if(!buildItem.content && contentNode.childNodes.length > 0)
          {
            buildItem.content += new bamboo.serializer().serializeToString(contentNode.firstChild);
          }
          if(contentNode.getAttribute('type') == 'xhtml' && contentNode.childNodes.length > 0)
          {
            buildItem.content = new bamboo.serializer().serializeToString(contentNode);
          }
        }

        var summaries = newItemNode.getElementsByTagName('summary');
        if(!buildItem.content && summaries.length > 0)
        {
          buildItem.content = summaries[0].textContent;
        }

        if(!buildItem.content)
        {
          buildItem.content = buildItem.title;
        }

        var linkNode = null;
        var linkNodes = newItemNode.getElementsByTagName('link');
        for(var n=0; n<linkNodes.length; n++)
        {
          linkNode = linkNodes[n];
          if(!linkNode.getAttribute('rel') || (linkNode.getAttribute('type') == 'text/html' && linkNode.getAttribute('rel') == 'alternate'))
          {
            break;
          }
        }
        buildItem.url = linkNode ? linkNode.getAttribute('href') : '';

        var dateNodes = newItemNode.getElementsByTagName('updated');
        if(dateNodes.length == 0)
        {
          dateNodes = newItemNode.getElementsByTagName('modified');
        }
        if(dateNodes.length == 0)
        {
          dateNodes = newItemNode.getElementsByTagName('published');
        }
        if(dateNodes.length == 0)
        {
          dateNodes = newItemNode.getElementsByTagName('pubDate');
        }
        if(dateNodes.length > 0 && dateNodes[0].firstChild)
        {
          date = dateNodes[0].firstChild.nodeValue;
        }
      }
      else
      {
        var idNodes = newItemNode.getElementsByTagName('guid');
        if(idNodes.length > 0)
        {
          buildItem.itemID = idNodes[0].textContent;
        }
        
        var contents = newItemNode.getElementsByTagName('content:encoded');
        if(contents.length > 0)
        {
          buildItem.content = contents[0].textContent;
        }else{
          var descNodes = newItemNode.getElementsByTagName('description');
          if(descNodes.length > 0)
          {
            buildItem.content = descNodes[0].textContent;

            if(!buildItem.content && descNodes[0].childNodes.length > 0)
            {
              buildItem.content += new bamboo.serializer().serializeToString(descNodes[0]);
            }
          }
        }

        var medias = newItemNode.getElementsByTagName('media:content');
        for(var x=0; x<medias.length; x++)
        {
          var url = medias[x].getAttribute('url');

          if(url)
          {
            var type = medias[x].getAttribute('type');
            var medium = medias[x].getAttribute('medium');
            var isImage = (type && type.toString().indexOf('image') == 0) || (medium && medium == 'image');
            if(!isImage)
            {
              var urlLength = url.length;
              var imageExts = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tif'];

              for(var n=0; n<imageExts.length; n++)
              {
                var imageExt = imageExts[n];
                if(url.toLowerCase().lastIndexOf('.' + imageExt) == (urlLength - imageExt.length - 1))
                {
                  isImage = true;
                  break;
                }
              }
            }

            if(isImage)
            {
              if(!buildItem.content.indexOf || buildItem.content.indexOf(url) < 0)
              {
                buildItem.content = '<img src="' + encodeURI(url) + '" /><br />' + buildItem.content;
              }
            }
          }
        }

        var enclosures = newItemNode.getElementsByTagName('enclosure');
        for(var x=0; x<enclosures.length; x++)
        {
          var type = enclosures[x].getAttribute('type');
          var url = enclosures[x].getAttribute('url');

          if(type && type.toString().indexOf('audio') == 0)
          {
            buildItem.content = '<div class="bamboo-tmp-audio" data-url="' + url + '"></div>' + buildItem.content;
          }
          else if(type && type.toString().indexOf('video') == 0)
          {
            if(x == 0)
            {
              buildItem.content += '<br />';
            }
            buildItem.content += '<video controls src="' + url + '">';
            buildItem.content += '<div class="bamboo-enclosure-video"><a href="' + url + '">Video</a></div>';
            buildItem.content += '</video>';
          }
          else
          {
            var isImage = type && type.toString().indexOf('image') == 0;
            if(!isImage)
            {
              var urlLength = url.length;
              var imageExts = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tif'];

              for(var n=0; n<imageExts.length; n++)
              {
                var imageExt = imageExts[n];
                if(url.toLowerCase().lastIndexOf('.' + imageExt) == (urlLength - imageExt.length - 1))
                {
                  isImage = true;
                  break;
                }
              }
            }
            if(isImage)
            {
              if(!buildItem.content.indexOf || buildItem.content.indexOf(url) < 0)
              {
                buildItem.content = '<img src="' + url + '" /><br />' + buildItem.content;
              }
            }
            else
            {
              buildItem.content += '<div class="bamboo-enclosure"><a href="' + url + '">File</a></div>';
            }
          }
        }
        
        var link = newItemNode.getElementsByTagName('link')[0];
        if(link)
        {
          buildItem.url = link.firstChild ? link.firstChild.nodeValue : link.nodeValue;
        }
        else
        {
          buildItem.url = '';
        }

        var dateNodes = newItemNode.getElementsByTagName('pubDate');
        if(dateNodes.length == 0)
        {
          dateNodes = newItemNode.getElementsByTagName('dc:date');
        }
        if(dateNodes.length == 0)
        {
          dateNodes = newItemNode.getElementsByTagName('a10:updated');
        }
        if(dateNodes.length > 0 && dateNodes[0].firstChild)
        {
          date = dateNodes[0].firstChild.nodeValue;
        }
      }

      if(!buildItem.url && buildItem.itemID && buildItem.itemID.indexOf && buildItem.itemID.indexOf('http') == 0)
      {
        buildItem.url = buildItem.itemID;
      }

      var authorNodes = newItemNode.getElementsByTagName('author');
      if(authorNodes.length == 0)
      {
        authorNodes = newItemNode.getElementsByTagName('dc:creator');
      }
      else if(authorNodes[0].childNodes && authorNodes[0].childNodes.length > 0)
      {
        if(authorNodes[0].getElementsByTagName('name').length > 0)
        {
          authorNodes = authorNodes[0].getElementsByTagName('name');
        }
      }
      if(authorNodes.length == 0)
      {
        authorNodes = newItemNode.getElementsByTagName('dc:author');
      }
      if(authorNodes.length == 0)
      {
        authorNodes = newItemNode.getElementsByTagName('creator');
      }

      if(authorNodes.length > 0)
      {
        buildItem.author = authorNodes[0].textContent;
      }

      if(date && date.length)
      {
        if(date.lastIndexOf(' Z') == (date.length - 2))
        {
          date = date.substring(0, date.length - 2);
        }
        else if(date.lastIndexOf(' CET') == (date.length - 4))
        {
          date = date.substring(0, date.length - 4);
        }
      }
      buildItem.date = new Date(date).getTime();
      items.push(buildItem);
    }
    return items;
  },

  parseOpml : function(xml)
  {
    var root = new bamboo.data.root(0);

    var titles = xml.documentElement.getElementsByTagName('title');
    root.name = titles.length > 0 ? titles[0].firstChild.nodeValue : '';

    var bodies = xml.documentElement.getElementsByTagName('body');
    if(bodies.length > 0)
    {
      this.parseOpmlGroup(root, bodies[0]);
    }

    return root;
  },

  parseOpmlGroup : function(group, node)
  {
    var childCount = node.childNodes.length;
    var childNode;
    var isFeed;
    var name;
    var url;
    var webpage;
    var favorite;

    for(var n=0; n<childCount; n++)
    {
      childNode = node.childNodes[n];
      if(childNode.nodeName != 'outline')
      { continue; }

      isFeed = childNode.hasAttribute('xmlUrl');
      name = this.getOutlineNodeName(childNode);

      if(isFeed)
      {
        url = childNode.getAttribute('xmlUrl');
        webpage = childNode.hasAttribute('htmlUrl') ? childNode.getAttribute('htmlUrl') : '';
        favorite = childNode.hasAttribute('bamboo-favorite') && childNode.getAttribute('bamboo-favorite') == 'true';
        group.addFeed(name, url, webpage, 0, favorite, 'notset');
      }
      else
      {
        var childGroup = group.addGroup(name, false, 0);
        this.parseOpmlGroup(childGroup, childNode);
      }
    }
  },

  getOutlineNodeName : function(node)
  {
    var name = '';
    if(node.hasAttribute('title'))
    {
      name = node.getAttribute('title');
    }else{
      if(node.hasAttribute('text'))
      {
        name = node.getAttribute('text');
      }
    }
    return name;
  },

  parseXMLString : function(sXML)
  {
    var parser = new bamboo.parser();
    var oXML = parser.parseFromString(sXML, "text/xml");

    var rootTag = oXML.documentElement;
    if ((rootTag.tagName == "parserError") || (rootTag.namespaceURI == "http://www.mozilla.org/newlayout/xml/parsererror.xml"))
    {
      var message = 'XML parsing error :';

      var sourceText = rootTag.getElementsByTagNameNS("http://www.mozilla.org/newlayout/xml/parsererror.xml", 'sourcetext')[0];
      if (sourceText != null)
      {
        message += '\nSource text:\n';
        message += sourceText.firstChild.data;
      }
      message += '\nReason:\n';
      message += rootTag.firstChild.data;

      throw {message: message};
    }
    return oXML;
  }
};
