// ==UserScript==
// @name            URLbarInAddonManager.uc.js
// @namespace       URLbarInAddonManager@mozest
// @description     让addon manager显示地址栏
// @version         0.0.1.1
// @compatibility   firefox 4.0+
// @updateURL     https://j.mozest.com/ucscript/script/49.meta.js
// ==/UserScript==

if (window.XULBrowserWindow)
{void(window.XULBrowserWindow.inContentWhitelist.shift())};