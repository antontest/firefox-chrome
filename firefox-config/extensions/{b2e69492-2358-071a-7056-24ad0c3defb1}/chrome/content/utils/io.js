
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.utils.io =
{
  localDirectoryName : 'bamboodata',
  
  fileExists : function(filePath)
  {
    var file = Components.classes["@mozilla.org/file/local;1"]
                         .createInstance(Components.interfaces.nsILocalFile);
    file.initWithPath(filePath);
    return file.exists();
  },

  pathContainData : function(path)
  {
    var filePath = this.getLocalFilesPath(path);
    var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);

    file.initWithPath(filePath);

    file.append(bamboo.data.feedFileName);

    return file.exists();
  },

  getLocalFilesPath : function(tmpPath)
  {
    var path = tmpPath ? tmpPath : bamboo.option.get('data-dir-path');
    if(!path)
    {
      var dir = Components.classes["@mozilla.org/file/directory_service;1"]
                          .getService(Components.interfaces.nsIProperties)
                          .get("ProfLD", Components.interfaces.nsIFile);
      path = dir.path;
    }

    var sep = path.indexOf('/') >= 0 ? '/' : '\\';
    var pos = path.length - this.localDirectoryName.length - 1;
    if(path.lastIndexOf(sep + this.localDirectoryName) != pos)
    {
      path += sep + this.localDirectoryName;
    }

    return path;
  },
  
  // Read local file
  read : function(fileName)
  {
    var file = Components.classes["@mozilla.org/file/local;1"]
                         .createInstance(Components.interfaces.nsILocalFile);

    file.initWithPath(this.getLocalFilesPath());

    if( !file.exists() || !file.isDirectory() )
    {
      file.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, 0777);
    }

    file.append(fileName);

    var sContent = "";
    var fstream = Components.classes["@mozilla.org/network/file-input-stream;1"].
    createInstance(Components.interfaces.nsIFileInputStream);
    var cstream = Components.classes["@mozilla.org/intl/converter-input-stream;1"].
    createInstance(Components.interfaces.nsIConverterInputStream);
    fstream.init(file, -1, 0, 0);
    cstream.init(fstream, "UTF-8", 0, 0);

    var str = {};
    var read = 0;
    do
    {
      read = cstream.readString(0xffffffff, str);
      sContent += str.value;
    }while(read != 0);

    cstream.close();
    return sContent;
  },
  
  // Write local file
  write : function(fileName, content)
  {
    var file = Components.classes["@mozilla.org/file/local;1"]
                         .createInstance(Components.interfaces.nsILocalFile);

    file.initWithPath(this.getLocalFilesPath());

    if( !file.exists() || !file.isDirectory() )
    {
      file.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, 0777);
    }

    file.append(fileName);

    var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"]
                             .createInstance(Components.interfaces.nsIFileOutputStream);
    var converter = Components.classes["@mozilla.org/intl/converter-output-stream;1"]
                              .createInstance(Components.interfaces.nsIConverterOutputStream);

    foStream.init(file, 0x02 | 0x08 | 0x20, 0666, 0); 
    converter.init(foStream, "UTF-8", 0, 0);
    converter.writeString(content);
    converter.close();
  },
  
  getFullPath : function(fileName)
  {
    var dir = Components.classes["@mozilla.org/file/directory_service;1"]
                        .getService(Components.interfaces.nsIProperties)
                        .get("ProfLD", Components.interfaces.nsIFile);

    var file = Components.classes["@mozilla.org/file/local;1"]
                         .createInstance(Components.interfaces.nsILocalFile);

    file.initWithPath(dir.path);
    file.append(this.localDirectoryName);
    file.append(fileName);

    return file.path;
  },

  // Read local file
  readFromPath : function(filePath)
  {
    var file = Components.classes["@mozilla.org/file/local;1"]
                          .createInstance(Components.interfaces.nsILocalFile);
    var fstream = Components.classes["@mozilla.org/network/file-input-stream;1"]
                            .createInstance(Components.interfaces.nsIFileInputStream);
    var cstream = Components.classes["@mozilla.org/intl/converter-input-stream;1"]
                            .createInstance(Components.interfaces.nsIConverterInputStream);

    file.initWithPath(filePath);
    fstream.init(file, -1, 0, 0);
    cstream.init(fstream, "UTF-8", 0, 0);

    var content = "";
    var str = {};
    var read = 0;
    do
    {
      read = cstream.readString(0xffffffff, str);
      content += str.value;
    }while(read != 0);

    cstream.close();
    return content;
  },

  // Write local file
  writeToPath : function(filePath, content)
  {
    var file = Components.classes["@mozilla.org/file/local;1"]
         .createInstance(Components.interfaces.nsILocalFile);
    var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"]
             .createInstance(Components.interfaces.nsIFileOutputStream);
    var converter = Components.classes["@mozilla.org/intl/converter-output-stream;1"]
              .createInstance(Components.interfaces.nsIConverterOutputStream);

    file.initWithPath(filePath);
    foStream.init(file, 0x02 | 0x08 | 0x20, 0666, 0);
    converter.init(foStream, "UTF-8", 0, 0);
    converter.writeString(content);
    converter.close();
    foStream.close();
  }
};
