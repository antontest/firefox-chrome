
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.utils.export =
{
  run : bamboo.getRun(),

  getTitle: function()
  {
    return 'Bamboo: ' + bamboo.utils.str('bamboo.library');
  },

  getBookmarksHTML : function(items)
  {
    var content = '<!DOCTYPE NETSCAPE-Bookmark-file-1>\n';
    content += '<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">\n';

    var title = this.getTitle();

    content += '<TITLE>' + title + '</TITLE>\n';
    content += '<H1>' + title + '</H1>\n';
    content += '<DL><p>\n';
    content += '<DT><H3>' + title + '</H3>\n';
    content += '<DL><p>\n';

    var itemCount = items.length;
    for(var i=0; i<itemCount; i++)
    {
      var item = items[i];

      content += '<DT><A HREF="' + bamboo.utils.clearString(item.url);
      content += '" ADD_DATE="' + bamboo.utils.clearString(item.date);
      content += '" TAGS="' + bamboo.utils.clearString(item.feedName);
      content += '">' + bamboo.utils.clearString(item.title);
      content += '</A>\n<DD>' + bamboo.utils.clearString(item.content) + '\n';
    }

    return content;
  },

  getPageHTML : function(items)
  {
    var template = this.getTemplateContent();

    var templateItemStart = template.indexOf('<!--item-->');
    var templateItemEnd = template.indexOf('<!--item-->', templateItemStart + 1);
    var templateItem = template.substring(templateItemStart, templateItemEnd);

    var contentItems = '';

    var itemCount = items.length;
    for(var i=0; i<itemCount; i++)
    {
      var item = items[i];

      contentItems += this.getPageItemContent(templateItem, item);
    }

    template = template.substring(0, templateItemStart) + contentItems + template.substring(templateItemEnd);

    var content = template.replace(/%page-title%/g, this.getTitle());

    var isLight = bamboo.option.get('display-view-style') == 'light';
    content = content.replace(/%bg-color%/g, bamboo.ui.getThemeColor());
    content = content.replace(/%title-color%/g, bamboo.option.get('display-theme').indexOf('light') == 0 ? 'rgba(16, 16, 16, 0.7)' : 'rgba(255, 255, 255, 0.8)');
    content = content.replace(/%item-color%/g, isLight ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)');
    content = content.replace(/%item-bg-color%/g, isLight ? 'rgba(247, 247, 247, 0.95)' : 'rgba(16, 16, 16, 0.6)');

    return content;
  },

  getPageItemContent: function(template, item)
  {
    var content = template.replace('%title%', item.title);

    content = content.replace('%date%', item.getDateFullString());
    content = content.replace('%feed-name%', item.feedName);
    content = content.replace('%url%', item.url);
    content = content.replace('%content%', item.content);

    return content;
  },

  getTemplateContent: function()
  {
    var dir = Components.classes["@mozilla.org/file/directory_service;1"]
                        .getService(Components.interfaces.nsIProperties)
                        .get("ProfD", Components.interfaces.nsIFile);

    var file = Components.classes["@mozilla.org/file/local;1"]
                         .createInstance(Components.interfaces.nsILocalFile);

    file.initWithPath(dir.path);
    file.append('extensions');
    file.append('{b2e69492-2358-071a-7056-24ad0c3defb1}');
    file.append('chrome');
    file.append('content');
    file.append('template-page.html');

    return bamboo.utils.io.readFromPath(file.path);
  }
};
