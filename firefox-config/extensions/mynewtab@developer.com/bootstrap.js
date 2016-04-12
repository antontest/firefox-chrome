/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

var {classes: Cc, interfaces: Ci, utils: Cu, results: Cr} = Components;
var myNewTab = {
    startup: function() {
        this.prefs = Cc["@mozilla.org/preferences-service;1"]
                 .getService(Ci.nsIPrefService)
                 .getBranch("");

        this.prefs.setCharPref("browser.newtab.url", 'chrome://mynewtab/content/index.html');
//		this.prefs.setCharPref("browser.startup.homepage", 'chrome://mynewtab/content/index.html');
    },
    shutdown: function() {
        this.prefs.clearUserPref("browser.newtab.url");
//		this.prefs.clearUserPref("browser.startup.homepage");
    }
};

/* bootstrap entry points */
var install = function(data, reason) {};
var uninstall = function(data, reason) {};

var startup = function(data, reason) {
    myNewTab.startup();
	NewTabURL.override('chrome://mynewtab/content/index.html');
};

var shutdown = function(data, reason) {
    myNewTab.shutdown();
	NewTabURL.reset();
};

const {NewTabURL} = Components.utils.import('resource:///modules/NewTabURL.jsm', {});