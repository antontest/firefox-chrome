
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.ui.zone.view = function(target)
{
  bamboo.ui.component.call(this, target);
};

bamboo.extend(bamboo.ui.zone.view, bamboo.ui.component);

bamboo.ui.zone.view.prototype.build = function()
{
  var zone = bamboo.doc.createElement('vbox');
  zone.setAttribute('class', 'bamboo-zone-view');
  zone.setAttribute('flex', '1');
  return this.container.appendChild(zone);
};

bamboo.ui.zone.view.prototype.update = function() {};
