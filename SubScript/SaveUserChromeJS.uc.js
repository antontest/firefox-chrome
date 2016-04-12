// ==UserScript==
// @name           SaveUserChromeJS.uc.js
// @author         ywzhaiqi
// @description    像 Greasemonkey 一样保存 uc脚本
// @include        main
// @charset        UTF-8
// @version        0.4
// @startup        saveUserChromeJS.init();
// @shutdown       saveUserChromeJS.uninit();
// @homepageURL    https://github.com/ywzhaiqi/userChromeJS/tree/master/SaveUserChromeJS
// @reviewURL      http://bbs.kafan.cn/thread-1590873-1-1.html
// @note           2016.3.10 改造支持 userChromeJS_Mix 式免重启并修复BUG by w13998686967
// ==/UserScript==

(function() {

// 保存完毕是否启用通知？
var notificationsAfterInstall = true;

// 保存完毕是否加载脚本（无需启动）？仅支持 .uc.js，一些脚本有问题。
var runWithoutRestart = false;


let { classes: Cc, interfaces: Ci, utils: Cu, results: Cr } = Components;
if (!window.Services) Cu.import("resource://gre/modules/Services.jsm");
var appVersion = Services.appinfo.version.split(".")[0];
if(typeof window.saveUserChromeJS != "undefined"){
	window.saveUserChromeJS.uninit();
	delete window.saveUserChromeJS;
}

const RE_USERCHROME_JS = /\.uc(?:-\d+)?\.(?:js|xul)$|userChrome\.js$/i;
const RE_CONTENTTYPE = /text\/html/i;

var ns = window.saveUserChromeJS = {
    enableIcon: "data:image/png;base64,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",
	get SCRIPTS_FOLDER() {
		delete this.SCRIPTS_FOLDER;
		return this.SCRIPTS_FOLDER = Services.dirsvc.get("UChrm", Ci.nsILocalFile);
	},

	init: function() {
        gBrowser.mPanelContainer.addEventListener('DOMContentLoaded', this, true);
	},
	uninit: function(){
		gBrowser.mPanelContainer.removeEventListener('DOMContentLoaded', this, true);
	},
	handleEvent: function(event){
		switch(event.type){
			case "DOMContentLoaded":
                var safeWin = event.target.defaultView;
                if (safeWin !== safeWin.top) return;

                if (safeWin.location.protocol === 'view-source:') return;

                var lhref = safeWin.location.href;
                var self = this;
                if (RE_USERCHROME_JS.test(lhref) && !RE_CONTENTTYPE.test(safeWin.document.contentType)) {
                    safeWin.setTimeout(function(){
                        self.showInstallBanner(gBrowser.getBrowserForDocument(safeWin.document), gBrowser);
                    }, 500);
                }
                break;	
		}
	},
	showInstallBanner: function(browser) {
		var notificationBox = gBrowser.getNotificationBox(browser);
		var greeting = "这是 userChrome 脚本，要使用该脚本请点击“安装”";
		var btnLabel = "安装脚本";

		// Remove existing notifications. Notifications get removed
		// automatically onclick and on page navigation, but we need to remove
		// them ourselves in the case of reload, or they stack up.
		for (var i = 0, child; child = notificationBox.childNodes[i]; i++)
			if (child.getAttribute("value") == "install-userChromeJS")
				notificationBox.removeNotification(child);

		var notification = notificationBox.appendNotification(
			greeting,
			"install-userChromeJS",
			null,
			notificationBox.PRIORITY_WARNING_MEDIUM, [{
				label: btnLabel,
				accessKey: "I",
				popup: null,
				callback: this.saveCurrentScript
			}
		]);
	},
	saveCurrentScript: function(event){
		ns.saveScript();
	},
	saveScript: function(url) {
        var win = ns.getFocusedWindow();

		var doc, name, fileName, fileExt, charset;
		if(!url){
			url = win.location.href;
			doc = win.document;
			name = doc.body.textContent.match(/\/\/\s*@name\s+(.*)/i);
			charset = doc.body.textContent.match(/\/\/\s*@charset\s+(.*)/i);
		}else{
            if(url.match(/^https?:\/\/github\.com\/\w+\/\w+\/blob\//)){
                url = url.replace("/blob/", "/raw/");
            }
        }

		name = name && name[1] ? name[1] : decodeURIComponent(url.split("/").pop());
        fileName = name.replace(/\.uc\.(js|xul)$|$/i, ".uc.$1").replace(/\s/g, '_');
        if (fileName.match(/\.uc\.$/i)) {  // 对名字进行修正
            var m = url.match(/\.(js|xul)$/);
            if (m)
                fileName += m[1];
        }
		fileExt = name.match(/\.uc\.js$/i);
		fileExtl = name.match(/\.uc\.xul$/i);
        fileExt = fileExt && fileExt[1] ? fileExt[1] : "js";
		fileExtl = fileExtl && fileExtl[1] ? fileExtl[1] : "xul";
        charset = charset && charset[1] ? charset[1] : "UTF-8";

		// https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XUL/Tutorial/Open_and_Save_Dialogs
		var fp = Cc["@mozilla.org/filepicker;1"].createInstance(Ci.nsIFilePicker);
		fp.init(window, "", Ci.nsIFilePicker.modeSave);
		fp.appendFilter("*." + fileExt, "*.uc.js;");
		fp.appendFilter("*." + fileExtl, "*.uc.xul");
		fp.appendFilters(Ci.nsIFilePicker.filterAll);
		fp.displayDirectory = ns.SCRIPTS_FOLDER; // nsILocalFile
		fp.defaultExtension = fileExt;
		fp.defaultString = fileName;
		var callbackObj = {
			done: function(res) {
				if (res != fp.returnOK && res != fp.returnReplace) return;

                var persist = Cc["@mozilla.org/embedding/browser/nsWebBrowserPersist;1"].createInstance(Ci.nsIWebBrowserPersist);
                persist.persistFlags = persist.PERSIST_FLAGS_AUTODETECT_APPLY_CONVERSION;

                var obj_URI;
                if(doc && fileExt != 'xul'){
                    obj_URI = doc.documentURIObject;
                }else{
                    obj_URI = Services.io.newURI(url, null, null);
                }

                if(notificationsAfterInstall){
                    persist.progressListener = {
                        onProgressChange: function(aWebProgress, aRequest, aCurSelfProgress, aMaxSelfProgress, aCurTotalProgress, aMaxTotalProgress) {
                            if(aCurSelfProgress == aMaxSelfProgress){
                                setTimeout(function(){
                                    ns.showInstallMessage({
                                        fileExt: fileExt,
                                        fileName: fileName,
                                        file: fp.file,
                                        charset: charset
                                    });
                                }, 100);
                            }
                        },
                        onStateChange: function(aWebProgress, aRequest, aStateFlags, aStatus) { }
                    };
                }
                if (appVersion < 35) {
                    persist.saveURI(obj_URI, null, null, null, "", fp.file, null);
			    } else if (appVersion >= 36) {// ff36+
                    persist.saveURI(obj_URI, null, null, null, null, "", fp.file, null);
			    }
			}
		};
		fp.open(callbackObj);
	},
    showInstallMessage: function(info){
        var isRun = (info.fileExt == "js");

        var mainAction, secondActions;
        if(runWithoutRestart && isRun){
            mainAction = {
                label: "立即运行（可能有问题，重启即可）",
                accessKey: "R",
                callback: function(){
                    ns.runScript(info.file, info.charset);
                }
            };
            secondActions = [{
                label: "立即重启",
                accessKey: "R",
                callback: ns.restartApp
            }];
        }else{
            mainAction = {
                label: "立即重启",
                accessKey: "R",
                callback: ns.restartApp
            };
            secondActions = null;
        }

        var showedMsg = ns.popupNotification({
            id: "userchromejs-install-popup-notification",
            message: "'" + info.fileName + "' 安装完毕",
            mainAction: mainAction,
            secondActions: secondActions,
            options: {
                removeOnDismissal: true,
                persistWhileVisible: true,
				popupIconURL: ns.enableIcon
            }
        });
    },
    popupNotification: function(details){
        var win = ns.getMostRecentWindow();
        if (win && win.PopupNotifications) {
            win.PopupNotifications.show(
                win.gBrowser.selectedBrowser,
                details.id,
                details.message,
                "",
                details.mainAction,
                details.secondActions,
                details.options);
            return true;
        }

        return false;
    },
    // 只支持 us.js
    runScript: function(file, charset){
        window.userChrome_js.getScripts();
        if(window.userChromeManager){
            window.userChromeManager.rebuildScripts();
        }

        var dir = file.parent.leafName;
        if(dir.toLowerCase() == 'chrome' || (dir in window.userChrome_js.arrSubdir)){

            let context = {};
            Services.scriptloader.loadSubScript( "file:" + file.path, context, charset || "UTF-8");
        }
    },
    flushCache: function (file) {
        if (file)
             Services.obs.notifyObservers(file, "flush-cache-entry", "");
        else
             Services.obs.notifyObservers(null, "startupcache-invalidate", "");
    },
	getFocusedWindow: function() {
		var win = document.commandDispatcher.focusedWindow;
		return (!win || win == window) ? content : win;
	},
	getMostRecentWindow: function(){
		return Services.wm.getMostRecentWindow("navigator:browser")
	},
	getBrowserForContentWindow: function(aContentWindow) {
	  return aContentWindow
	      .QueryInterface(Ci.nsIInterfaceRequestor)
	      .getInterface(Ci.nsIWebNavigation)
	      .QueryInterface(Ci.nsIDocShellTreeItem)
	      .rootTreeItem
	      .QueryInterface(Ci.nsIInterfaceRequestor)
	      .getInterface(Ci.nsIDOMWindow)
	      .QueryInterface(Ci.nsIDOMChromeWindow);
	},
    restartApp: function() {
      if ("BrowserUtils" in window && typeof BrowserUtils.restartApplication == "function") {
        Components.classes["@mozilla.org/xre/app-info;1"]
                  .getService(Components.interfaces.nsIXULRuntime).invalidateCachesOnRestart();
        BrowserUtils.restartApplication();
        return;
      }
 
      const appStartup = Components.classes["@mozilla.org/toolkit/app-startup;1"]
                        .getService(Components.interfaces.nsIAppStartup);
 
      // Notify all windows that an application quit has been requested.
      var os = Components.classes["@mozilla.org/observer-service;1"]
                         .getService(Components.interfaces.nsIObserverService);
      var cancelQuit = Components.classes["@mozilla.org/supports-PRBool;1"]
                                 .createInstance(Components.interfaces.nsISupportsPRBool);
      os.notifyObservers(cancelQuit, "quit-application-requested", null);
 
      // Something aborted the quit process.
      if (cancelQuit.data)
        return;
 
      // Notify all windows that an application quit has been granted.
      os.notifyObservers(null, "quit-application-granted", null);
 
      // Enumerate all windows and call shutdown handlers
      var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
                         .getService(Components.interfaces.nsIWindowMediator);
      var windows = wm.getEnumerator(null);
      var win;
      while (windows.hasMoreElements()) {
        win = windows.getNext();
        if (("tryToClose" in win) && !win.tryToClose())
          return;
      }
      let XRE = Cc["@mozilla.org/xre/app-info;1"].getService(Ci.nsIXULRuntime);
      if (typeof XRE.invalidateCachesOnRestart == "function")
        XRE.invalidateCachesOnRestart();
      appStartup.quit(appStartup.eRestart | appStartup.eAttemptQuit);
    }
};


function $(id) document.getElementById(id);
function $C(name, attr) {
	var el = document.createElement(name);
	if (attr) Object.keys(attr).forEach(function(n) el.setAttribute(n, attr[n]));
	return el;
}

function log(arg) Application.console.log("[SaveUserChromeJS]" + arg);

function checkDoc(doc) {
	if (!(doc instanceof HTMLDocument)) return false;
	if (!window.mimeTypeIsTextBased(doc.contentType)) return false;
	if (!doc.body || !doc.body.hasChildNodes()) return false;
	if (doc.body instanceof HTMLFrameSetElement) return false;
	return true;
}


})();


window.saveUserChromeJS.init();
