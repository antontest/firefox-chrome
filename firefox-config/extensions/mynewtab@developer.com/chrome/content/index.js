// myNewTab 文件夹的相对于配置文件的路径
var newTabDirPath = "extensions\\myNewTab@developer.com\\chrome\\content";
// 图片存储的文件夹名字，相对于上面的路径
var bingImageDir = "bingImg";

var useBingImage = 1;  // 1：使用 bing 的背景图片？ 0：不使用
var updateImageTime = 12;  // 更新 bing 背景图片的间隔（单位：小时）
var bingImageSize = 0;  // bing 图片的尺寸，1 为默认的 1366x768，0 为 1920x1080（大很多，可能会加载慢些）
var bingMaxHistory = 10; // 最大历史天数，可设置[2, 16]
var isNewTab = 0;  // 0：默认当前标签页打开导航链接或搜索结果  1：强制新标签页打开导航链接或搜索结果
/*
  以下不要修改
 */

// 解析后的数据结构，开发时查看用
// var data = {
// 	"新闻资讯": [
// 		{ name: "Feedly", url: "http://cloud.feedly.com/", imgSrc: "img/feedly.ico" },
// 	],
// 	"在线应用": [
// 		{ name: "翻译", url: "https://translate.google.de/#auto/zh-CN/", imgSrc: "img/gtrans.ico" },
// 	],
// };

"use strict";

var Ci = Components.interfaces;
var Cc = Components.classes;
var Cu = Components.utils;
 
Cu.import("resource://gre/modules/PlacesUtils.jsm");
Cu.import("resource://gre/modules/Services.jsm");
var appVersion = Services.appinfo.version.split(".")[0];

var NewTab = {
	localLinkRegExp: /^[a-z]:\\[^ ]+$/i,  // windows 路径
	get prefs() {
	    delete this.prefs;
	    return this.prefs = Services.prefs.getBranch("myNewTab.");
	},

	init: function() {
		var table = document.getElementById("navtable");
		if (table.children.lenth > 0) {
			return;
		}

		var siteData = this.parseDataText(Config.sites);
		// console.log(siteData);
		var tr, type;
		for(type in siteData) {
			tr = this.buildTr(type, siteData[type]);
			table.appendChild(tr);
		}
	},
	//加载设置
	loadSetting: function() {
		var jsonData;
		try {
			jsonData = this.prefs.getCharPref("jsonData");
			jsonData = JSON.parse(jsonData);
		} catch(e) {
			jsonData = {}
		}
		return jsonData;
	},
	// 设置背景图片并保存设置
	setAndSave: function(ImgPath) {
		document.body.style.backgroundImage = 'url(' + ImgPath + ')';
		var Jsondata = {
			lastCheckTime: Date.now(),
			backgroundImage: ImgPath
		};
		try {
			this.prefs.setCharPref("jsonData", JSON.stringify(Jsondata));
		} catch (e) {}
	},
	getBingImage: function(idx) {
		var self = this;
		var url = 'http://www.bing.com/HPImageArchive.aspx?format=js&idx=' + idx + '&n=1&nc=';
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.onload = function() {
			var data = JSON.parse(xhr.responseText);
			
			// 处理图片地址
			var imageUrl = data.images[0].url;
			if (bingImageSize) {
				imageUrl = imageUrl.replace('1920x1080', '1366x768');
			}
			if (!imageUrl.startsWith('http')) {
				imageUrl = 'http://www.bing.com' + imageUrl;
			}

			// 移除旧图片
			var file = NewTab.localImage(idx);
			if (file.exists()) {
 				file.remove(false);
 			}
			
			//下载图片
			var t = new Image();
			t.src = imageUrl;
			t.onload = function() {
				try {
				    if (appVersion < 36) {
					    file.create(Ci.nsIFile.NOMAL_FILE_TYPE, 0777)
					    Cc["@mozilla.org/embedding/browser/nsWebBrowserPersist;1"].createInstance(Ci.nsIWebBrowserPersist)
					    	.saveURI(Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService).newURI(imageUrl, null, null), null, null, null, null, file, null);
					} else if (appVersion >= 36) {
					    file.create(Ci.nsIFile.NOMAL_FILE_TYPE, 0777)
					    Cc["@mozilla.org/embedding/browser/nsWebBrowserPersist;1"].createInstance(Ci.nsIWebBrowserPersist)
					    	.saveURI(Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService).newURI(imageUrl, null, null), null, null, null, null, null, file, null);
				    }	
				} catch (err) {}
			}
		};
		xhr.send(null);
	},
	parseDataText: function (text) {
		var data = [],
			lines, line, arr, type;

		// 处理下，逗号修正为英文逗号
		text = text.replace(/，/g, ',');

		lines = text.split('\n');
		for (var i = 0, l = lines.length; i < l; i++) {
			line = lines[i].trim();
			if (!line) continue;
			arr = line.split(',');
			if (arr.length == 1) {
				type = arr[0];
				data[type] = [];
			} else {
				data[type].push({
					name: arr[0].trim(),
					url: arr[1] ? arr[1].trim() : null,
					imgSrc: arr[2] ? arr[2].trim() : null
				});
			}
		}
		return data;
	},
	buildTr: function (type, sites) {
		var tr = document.createElement('tr'),
			th = document.createElement('th'),
			span = document.createElement('span'),
			site, td, a, img, textNode, path;
		
		// 添加分类
		span.innerHTML = type;
		th.appendChild(span);
		tr.appendChild(th);

		// 添加站点
		for (var i = 0, l = sites.length; i < l; i++) {
			site = sites[i];

			td = document.createElement('td');
			a = document.createElement('a');
			img = document.createElement('img');
			textNode = document.createTextNode(site.name);

			a.setAttribute('title', site.name);
			path = this.handleUrl(site.url);
			if (path) {
				a.setAttribute('href', 'javascript:;');
				a.setAttribute('localpath', path);
				a.addEventListener('click', function(e){
					var fullpath = e.target.getAttribute('localpath');
					NewTab.exec(fullpath);
				}, false);

				site.exec = path;
			} else {
				a.setAttribute('href', site.url);
			}

			if (isNewTab) {
				a.setAttribute('target', '_blank');
			}
			
			// 设置图片的属性
			img.width = 16;
			img.height = 16;
			if (site.imgSrc) {
				img.src = site.imgSrc;
			} else {
				this.setIcon(img, site);
			}

			a.appendChild(img);
			a.appendChild(textNode);
			td.appendChild(a);
			tr.appendChild(td);
		}
		return tr;
	},
	handleUrl: function (urlOrPath) {
		if (urlOrPath.indexOf('\\') == 0) {  // 相对 firefox 路径文件
			urlOrPath = urlOrPath.replace(/\//g, '\\').toLocaleLowerCase();
			var profileDir = Cc['@mozilla.org/file/directory_service;1'].getService(Ci.nsIProperties)
					.get("ProfD", Ci.nsILocalFile).path;
			return profileDir + urlOrPath;
		} else if (this.localLinkRegExp.test(urlOrPath)) {
			return urlOrPath;
		}

		return false;
	},
	exec: function (path) {
		var file = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsILocalFile);
		file.initWithPath(path);
		if (!file.exists()) {
		    alert('路径并不存在：' + path);
		    return;
		}
		file.launch();
	},
	setIcon: function (img, obj) {
		if (obj.exec) {
		    var aFile = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
		    try {
		        aFile.initWithPath(obj.exec);
		    } catch (e) {
		        return;
		    }
		    if (!aFile.exists()) {
		        img.setAttribute("disabled", "true");
		    } else {
		        var fileURL = Services.io.getProtocolHandler("file").QueryInterface(Ci.nsIFileProtocolHandler).getURLSpecFromFile(aFile);
		        img.setAttribute("src", "moz-icon://" + fileURL + "?size=16");
		    }
		    return;
		}

		var uri, iconURI;
		try {
		    uri = Services.io.newURI(obj.url, null, null);
		} catch (e) { }
		if (!uri) return;

		PlacesUtils.favicons.getFaviconDataForPage(uri, {
		    onComplete: function(aURI, aDataLen, aData, aMimeType) {
		        try {
    			    // javascript: URI の host にアクセスするとエラー
    			    img.setAttribute("src", aURI && aURI.spec?
    			        "moz-anno:favicon:" + aURI.spec:
    			        "moz-anno:favicon:" + uri.scheme + "://" + uri.host + "/favicon.ico");
    			} catch (e) { }
		    }
		});
	},
	// 本地图片
	localImage: function (m) {
		var file = Cc["@mozilla.org/file/directory_service;1"].getService(Ci.nsIProperties).get("ProfD", Ci.nsIFile);
		file.appendRelativePath(newTabDirPath);
		file.appendRelativePath(bingImageDir);
		file.appendRelativePath("BingImg_" + m + ".jpg");
		return file;
	}
};

NewTab.init();
// 获取 bing 中国主页的背景图片
if (useBingImage) {
	var data = NewTab.loadSetting();
	if (data.backgroundImage && (Date.now() - data.lastCheckTime) < updateImageTime * 3600 * 1000) {
		document.body.style.backgroundImage = 'url(' + data.backgroundImage + ')';
	} else {
		var todayImg = 'chrome://mynewtab/content/bingImg/bingImg_0.jpg';
		NewTab.setAndSave(todayImg);
		for (var n = 0; n < bingMaxHistory; n++) {
			NewTab.getBingImage(n);
		}
	}
}

//切换|下载背景图
function changeImg() {
	var datastr = NewTab.loadSetting().backgroundImage;
	var n = parseInt(datastr.slice(-5,-4),10);
	n = n+1;
	if (n == bingMaxHistory) n = 0;
	var NextImage = NewTab.localImage(n);
	if (NextImage.exists()){
		var nextImgUrl = 'chrome://mynewtab/content/bingImg/BingImg_' + n + '.jpg';
		NewTab.setAndSave(nextImgUrl);
	} else {
		for (var i = 0; i < bingMaxHistory; i++) {
			NewTab.getBingImage(i);
		}
	}
}

//定位文件目录
function openDir() {
	var dsFile = Cc["@mozilla.org/file/directory_service;1"].getService(Ci.nsIProperties).get("ProfD", Ci.nsIFile);
	dsFile.appendRelativePath(newTabDirPath);
	dsFile.reveal();
}

//编辑配置
function edit() {
	// get editor
	var editor;
	try {
	    editor = Services.prefs.getComplexValue("view_source.editor.path", Ci.nsILocalFile);
	} catch(e) {}

	if (!editor || !editor.exists()) {
	    alert("请先设置编辑器的路径!!!");
	    var fp = Cc['@mozilla.org/filepicker;1'].createInstance(Ci.nsIFilePicker);
	    fp.init(window, "设置全局脚本编辑器", fp.modeOpen);
	    fp.appendFilter("执行文件", "*.exe");
	    if (fp.show() == fp.returnCancel || !fp.file)
	        return;
	    else {
	    	editor = fp.file;
	        Services.prefs.setCharPref("view_source.editor.path", editor.path);
	    }
	}

	var dsFile = Cc["@mozilla.org/file/directory_service;1"].getService(Ci.nsIProperties).get("ProfD", Ci.nsIFile);
	dsFile.appendRelativePath(newTabDirPath);
	dsFile.appendRelativePath('data.js');

	var process = Cc["@mozilla.org/process/util;1"].createInstance(Ci.nsIProcess);
	var args = [dsFile.path]
	process.init(editor);
	process.runw(false, args, args.length);
}