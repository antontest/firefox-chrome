// ==UserScript==
// @name           autoCopyBtn.uc.js
// @namespace      ithinc#mozine.cn
// @description    可控自动复制,地址栏按钮版
// @include        main
// @compatibility  Firefox 3.0.x
// @author         ithinc, iwo
// @charset        UTF-8
// @version        LastMod 2014.04.12 by defpt
// @Note           https://github.com/defpt/userChromeJs/tree/master/autoCopy
// @Note           https://g.mozest.com/redirect.php?goto=findpost&pid=299093&ptid=42980
// ==/UserScript==

(function () {
	var lastSelection = "";
	var autocopyImages = ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAVFBMVEUAAABFRUXR0dEzMzP19fU5OTk0MzPo6OhHR0dISEhPTk6BgYHu7u6zs7O/v793dnbe3t5ZWFiZmZnq6ur7+/uPj49XVlaqqqo8PDxcW1vS0tKioqLNTGjKAAAAAXRSTlMAQObYZgAAAHBJREFUGNNVz0kSwyAQBMEChmXQbkte//9PWwoIiTrmqRvUpNrrBuBtLM3O7aJCTb0DUqQmsylwWL8iWqB7wDMLMRXow4gfOIFh6SauwDvQwD37sYH8/QS5wBRgyesJm4W4yR/a6YiWczXrae4no/wAndQE7o7OJjYAAAAASUVORK5CYII=", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAS1BMVEUAAABFRUXq6urj4+P19fU6OjozMzNHR0fo6OhISEjR0dFubW37+/vLy8vw8PC8vLyZmZnd3d1eXV2Af3+Li4t5eHiwsLBQT0+xsbFlFZ0tAAAAAXRSTlMAQObYZgAAAHBJREFUGNNVz0kSwjAQBMES2ma02HgD/v9SAtkirDrmqRvUxJ5/AvgkV0sIP1FHT30AotArixmg4PQO5bAu3mHfkQaW1pw5QSe7VXis9g81vyG/uMAIaJ03OkSBTzjcAKyJE8bpOO3nJmklz3A/GuULaFAEpXB/tpsAAAAASUVORK5CYII="];
	var autocopyTooltips = ["自动复制已禁用", "自动复制已启用"];
	var prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefBranch);
	if (!prefs.getPrefType("userChrome.autocopy.autocopyState"))
		prefs.setIntPref("userChrome.autocopy.autocopyState", 1);

	function autocopyStart(e) {
		lastSelection = getBrowserSelection();
	}

	function autocopyStop(e) {
		var prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefBranch);
		var autocopyState = prefs.getIntPref("userChrome.autocopy.autocopyState");
		var selection = getBrowserSelection();
		//增加判断是否在输入框或按下功能键
		var exceptTarget = (e.target.nodeName == "TEXTAREA" || e.target.type == "textarea" || e.target.type == "text" || e.target.type == "password" || e.target.type == "email");
		var exceptoriginalTarget = (!e.originalTarget.ownerDocument || e.originalTarget.ownerDocument.designMode == "off" || e.originalTarget.ownerDocument.designMode == "undefined");
		var exceptAlternativeKey = (e.ctrlKey || e.altKey);
		var except = (exceptTarget && exceptoriginalTarget && !exceptAlternativeKey);

		if (autocopyState > 0 && selection && selection != lastSelection && !except) {
			goDoCommand('cmd_copy');
		}
	}

	gBrowser.mPanelContainer.addEventListener("mousedown", autocopyStart, false);
	gBrowser.mPanelContainer.addEventListener("mouseup", autocopyStop, false);

	var statusbarpanel = document.getElementById("urlbar-icons").appendChild(document.createElement("statusbarpanel")); ;
	statusbarpanel.setAttribute("id", "autocopy-statusbarpanel");
	statusbarpanel.setAttribute("class", "statusbarpanel-iconic");
	statusbarpanel.setAttribute("onclick", '\
		    if(event.button==0) {\
		      var prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefBranch);\
		      var autocopyState = prefs.getIntPref("userChrome.autocopy.autocopyState");\
		      prefs.setIntPref("userChrome.autocopy.autocopyState", (autocopyState+1)%2);\
		    }\
		  ');

	function refreshStatus() {
		var prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefBranch);
		var autocopyState = prefs.getIntPref("userChrome.autocopy.autocopyState");
		var statusbarpanel = document.getElementById("autocopy-statusbarpanel");

		statusbarpanel.setAttribute("src", autocopyImages[autocopyState % 2]);
		statusbarpanel.tooltipText = autocopyTooltips[autocopyState % 2];
	}
	refreshStatus();

	var observer = {
		observe : function (subject, topic, prefName) {
			refreshStatus();
		}
	};
	prefs.QueryInterface(Ci.nsIPrefBranchInternal).addObserver("userChrome.autocopy.autocopyState", observer, false);
})();