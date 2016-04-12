
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.runnable = function() {};

bamboo.runnable.prototype.run = bamboo.getRun();
