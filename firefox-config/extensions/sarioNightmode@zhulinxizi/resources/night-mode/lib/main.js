var { setTimeout, clearTimeout } = require("sdk/timers");
const { Cc, Ci } = require("chrome"),
	IOService = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService),
	StyleSheetService = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService);

var _ = require("sdk/l10n").get,
    Data = require("sdk/self").data,
	Hotkey = require("sdk/hotkeys").Hotkey,
	Panel = require("sdk/panel").Panel,
	Tabs = require("sdk/tabs"),
	ActionButton = require("sdk/ui/button/action").ActionButton,
    globestat = "off",
    workers = [],
    ss = require("sdk/simple-storage");
    ss.storage.brs || (ss.storage.brs = 0);
    ss.storage.web || (ss.storage.web = 0);
    ss.storage.img || (ss.storage.img = 0);
    ss.storage.auto || (ss.storage.auto = 0);
    ss.storage.beginh || (ss.storage.beginh = 20);
    ss.storage.beginm || (ss.storage.beginm = 0);
    ss.storage.endh || (ss.storage.endh = 6);
    ss.storage.endm || (ss.storage.endm = 0);

var styleUri = {
    browserGUI: IOService.newURI(Data.url("css/browserGUI.css"), null, null),
    websiteContent: IOService.newURI(Data.url("css/websiteContent.css"), null, null),
    dimImages: IOService.newURI(Data.url("css/dimImages.css"), null, null)
};
var attachStyleSheets = function () {
    if (ss.storage.brs == 1) {
        if (!StyleSheetService.sheetRegistered(styleUri.browserGUI, StyleSheetService.USER_SHEET)) {
            StyleSheetService.loadAndRegisterSheet(styleUri.browserGUI, StyleSheetService.USER_SHEET);
        }
    }
    if (ss.storage.web == 1) {
	    if (!StyleSheetService.sheetRegistered(styleUri.websiteContent, StyleSheetService.USER_SHEET)) {
	        StyleSheetService.loadAndRegisterSheet(styleUri.websiteContent, StyleSheetService.USER_SHEET);
	    }
    }
    if (ss.storage.img == 1) {
        if (!StyleSheetService.sheetRegistered(styleUri.dimImages, StyleSheetService.USER_SHEET)) {
            StyleSheetService.loadAndRegisterSheet(styleUri.dimImages, StyleSheetService.USER_SHEET);
        }
    }
};
var detachStyleSheets = function () {
    if (StyleSheetService.sheetRegistered(styleUri.browserGUI, StyleSheetService.USER_SHEET)) {
        StyleSheetService.unregisterSheet(styleUri.browserGUI, StyleSheetService.USER_SHEET);
    }
    if (StyleSheetService.sheetRegistered(styleUri.websiteContent, StyleSheetService.USER_SHEET)) {
        StyleSheetService.unregisterSheet(styleUri.websiteContent, StyleSheetService.USER_SHEET);
    }
    if (StyleSheetService.sheetRegistered(styleUri.dimImages, StyleSheetService.USER_SHEET)) {
        StyleSheetService.unregisterSheet(styleUri.dimImages, StyleSheetService.USER_SHEET);
    }
};

var button = ActionButton({
    id: "nightmode-button",
    label: _("button_string_nightModeEnabled"),
    icon: {
        16: "./icons/moon16.png",
        32: "./icons/moon32.png",
        64: "./icons/moon64.png"
    },
	onClick : function (e) { changed(); }
});

function changed(a) {
    panel.port.emit("stat", {
        stat: globestat,
        brs: ss.storage.brs,
        web: ss.storage.web,
        img: ss.storage.img,
        auto: ss.storage.auto,
        beginh: ss.storage.beginh,
        beginm: ss.storage.beginm,
        endh: ss.storage.endh,
        endm: ss.storage.endm
    });
    panel.show({
        position: button
    })
}

function turnOn() {
	button.label = _("button_string_nightModeEnabled");
    button.icon = {
        16: "./icons/sun16.png",
        32: "./icons/sun32.png",
        64: "./icons/sun64.png"
    };
    globestat = "on";
    attachStyleSheets();
}

function turnOff() {
	button.label = _("button_string_nightModeDisabled");
    button.icon = {
        16: "./icons/moon16.png",
        32: "./icons/moon32.png",
        64: "./icons/moon64.png"
    };
    globestat = "off";
    detachStyleSheets();
}

var panel = Panel({
    contentURL: Data.url("setting/panel.html"),
    contentScriptFile: Data.url("setting/panel.js"),
    onHide: handleHide
});
panel.port.on("option", function(a) {
	"brs" == a.cmd && ("on" == a.type ? ss.storage.brs = 1 : ss.storage.brs = 0);
	"web" == a.cmd && ("on" == a.type ? ss.storage.web = 1 : ss.storage.web = 0);
	"img" == a.cmd && ("on" == a.type ? ss.storage.img = 1 : ss.storage.img = 0);
    "on" == a.cmd ? turnOn() : "off" == a.cmd ? turnOff() : "auto" == a.cmd && ("off" == a.type ? (ss.storage.auto = 0, clearTimeout(aTimerId), "on" == globestat && turnOff()) : ("on" == a.type ? (ss.storage.auto = 1, console.log("set auto:" + ss.storage.auto), aTimer()) : "beginh" == a.type ? (ss.storage.beginh = parseInt(a.value), aTimer()) :
        "beginm" == a.type ? (ss.storage.beginm = parseInt(a.value), aTimer()) : "endh" == a.type ? (ss.storage.endh = parseInt(a.value), aTimer()) : "endm" == a.type && (ss.storage.endm = parseInt(a.value), aTimer()), immediate()))
});

function immediate() {
    var a = new Date,
        c = a.getHours(),
        b = a.getMinutes(),
        a = 60 * ss.storage.beginh + ss.storage.beginm,
        d = 60 * ss.storage.endh + ss.storage.endm,
        c = 60 * c + b,
        b = 0;
    a < d ? c >= a && c < d ? "off" == globestat && (turnOn(), b = 1) : (c < a || c >= d) && "on" == globestat && (turnOff(), b = 2) : a > d && (c < d || c >= a ? "off" == globestat && (turnOn(), b = 1) : "on" == globestat && (turnOff(), b = 2));
    0 < b && panel.port.emit("toggle", {
        value: b
    })
}
var aTimerId;
1 == ss.storage.auto && (aTimer(), immediate());

function aTimer() {
    clearTimeout(aTimerId);
    var a = new Date,
        c, b = a.getHours(),
        d = a.getMinutes(),
        a = 60 * ss.storage.beginh + ss.storage.beginm,
        e = 60 * ss.storage.endh + ss.storage.endm,
        b = 60 * b + d;
    a < e ? (b <= a ? c = 6E4 * (a - b) : b > a && b < e ? c = 6E4 * (e - b) : b >= e && (c = 6E4 * (1440 - e + a)), aTimerId = setTimeout(auto, c)) : a > e && (b <= e ? c = 6E4 * (e - b) : b > e && b < a ? c = 6E4 * (a - b) : b >= a && (c = 6E4 * (1440 - a + e)), aTimerId = setTimeout(auto, c))
}

function auto() {
    var a = new Date,
        c = a.getHours(),
        b = a.getMinutes(),
        a = 60 * ss.storage.beginh + ss.storage.beginm,
        d = 60 * ss.storage.endh + ss.storage.endm,
        c = 60 * c + b;
    c >= a && a > d || c >= a && c < d || c < d && d < a ? "off" == globestat && turnOn() : "on" == globestat && turnOff();
    aTimer()
}
require("setting").setup();

function handleHide() {}