
Components.utils.import("resource://bamboomodule/application.js");
Components.utils.import("resource://bamboomodule/option.js");
Components.utils.import("resource://bamboomodule/factory.js");
Components.utils.import("resource://bamboomodule/runnable.js");

Components.utils.import("resource://bamboomodule/utils/_utils.js");
Components.utils.import("resource://bamboomodule/utils/io.js");
Components.utils.import("resource://bamboomodule/utils/ui.js");
Components.utils.import("resource://bamboomodule/utils/error.js");
Components.utils.import("resource://bamboomodule/utils/ajax.js");
Components.utils.import("resource://bamboomodule/utils/browser.js");
Components.utils.import("resource://bamboomodule/utils/parser.js");
Components.utils.import("resource://bamboomodule/utils/timer.js");
Components.utils.import("resource://bamboomodule/utils/search.js");
Components.utils.import("resource://bamboomodule/utils/import.js");
Components.utils.import("resource://bamboomodule/utils/export.js");
Components.utils.import("resource://bamboomodule/utils/blacklist.js");
Components.utils.import("resource://bamboomodule/utils/sharing.js");
Components.utils.import("resource://bamboomodule/utils/updater.js");

Components.utils.import("resource://bamboomodule/data/_data.js");
Components.utils.import("resource://bamboomodule/data/base.js");
Components.utils.import("resource://bamboomodule/data/feed.js");
Components.utils.import("resource://bamboomodule/data/group.js");
Components.utils.import("resource://bamboomodule/data/item.js");
Components.utils.import("resource://bamboomodule/data/root.js");
Components.utils.import("resource://bamboomodule/data/library.js");
Components.utils.import("resource://bamboomodule/data/search.js");
Components.utils.import("resource://bamboomodule/data/searchfeed.js");
Components.utils.import("resource://bamboomodule/data/filter.js");
Components.utils.import("resource://bamboomodule/data/paginator.js");

Components.utils.import("resource://bamboomodule/ui/_ui.js");
Components.utils.import("resource://bamboomodule/ui/error.js");
Components.utils.import("resource://bamboomodule/ui/component.js");
Components.utils.import("resource://bamboomodule/ui/toolbar.js");
Components.utils.import("resource://bamboomodule/ui/dialog.js");
Components.utils.import("resource://bamboomodule/ui/notification.js");
Components.utils.import("resource://bamboomodule/ui/links.js");

Components.utils.import("resource://bamboomodule/ui/contextMenu/_contextMenu.js");
Components.utils.import("resource://bamboomodule/ui/contextMenu/base.js");
Components.utils.import("resource://bamboomodule/ui/contextMenu/feed.js");
Components.utils.import("resource://bamboomodule/ui/contextMenu/group.js");
Components.utils.import("resource://bamboomodule/ui/contextMenu/root.js");
Components.utils.import("resource://bamboomodule/ui/contextMenu/library.js");

Components.utils.import("resource://bamboomodule/ui/view/base.js");
Components.utils.import("resource://bamboomodule/ui/view/root.js");
Components.utils.import("resource://bamboomodule/ui/view/group.js");
Components.utils.import("resource://bamboomodule/ui/view/feed.js");
Components.utils.import("resource://bamboomodule/ui/view/item.js");
Components.utils.import("resource://bamboomodule/ui/view/library.js");
Components.utils.import("resource://bamboomodule/ui/view/search.js");
Components.utils.import("resource://bamboomodule/ui/view/searchfeed.js");
Components.utils.import("resource://bamboomodule/ui/view/paginator.js");

Components.utils.import("resource://bamboomodule/ui/dd/_dd.js");
Components.utils.import("resource://bamboomodule/ui/dd/base.js");
Components.utils.import("resource://bamboomodule/ui/dd/root.js");
Components.utils.import("resource://bamboomodule/ui/dd/group.js");
Components.utils.import("resource://bamboomodule/ui/dd/feed.js");

Components.utils.import("resource://bamboomodule/ui/zone/tree.js");
Components.utils.import("resource://bamboomodule/ui/zone/view.js");
Components.utils.import("resource://bamboomodule/ui/zone/view.data.js");
Components.utils.import("resource://bamboomodule/ui/zone/menu.player.js");
Components.utils.import("resource://bamboomodule/ui/zone/menu.reader.js");
Components.utils.import("resource://bamboomodule/ui/zone/menu.readerSearch.js");
Components.utils.import("resource://bamboomodule/ui/zone/menu.search.js");
Components.utils.import("resource://bamboomodule/ui/zone/menu.popup.js");

Components.utils.import("resource://bamboomodule/ui/panel/_panel.js");
Components.utils.import("resource://bamboomodule/ui/panel/base.js");
Components.utils.import("resource://bamboomodule/ui/panel/reader.js");
Components.utils.import("resource://bamboomodule/ui/panel/search.js");
Components.utils.import("resource://bamboomodule/ui/panel/option.js");
Components.utils.import("resource://bamboomodule/ui/panel/add.js");
Components.utils.import("resource://bamboomodule/ui/panel/import.js");
Components.utils.import("resource://bamboomodule/ui/panel/help.js");
Components.utils.import("resource://bamboomodule/ui/panel/error.js");

window.addEventListener("load", function () { bamboo.setContext(window, XMLHttpRequest, gBrowser, gNavToolbox, DOMParser, XMLSerializer, openUILinkIn, Notification); bamboo.init(); }, false);
window.addEventListener("focus", function () { bamboo.setContext(window, XMLHttpRequest, gBrowser, gNavToolbox, DOMParser, XMLSerializer, openUILinkIn, Notification); }, true);
