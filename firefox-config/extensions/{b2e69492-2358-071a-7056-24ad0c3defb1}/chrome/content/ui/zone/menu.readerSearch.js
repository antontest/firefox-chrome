
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.ui.zone.menu.readerSearch = function(menu)
{
  bamboo.runnable.call(this);

  this.menu = menu;

  this.active = false;
  this.advanced = false;
  this.caseSensitive = false;
  this.onlyInTitles = false;

  this.boxAdvanced = null;
  this.input = null;
  this.inputValue = '';
};

bamboo.extend(bamboo.ui.zone.menu.readerSearch, bamboo.runnable);

bamboo.ui.zone.menu.readerSearch.prototype.build = function()
{
    var widget = this;

    var inputContainer = bamboo.doc.createElement('hbox');
    inputContainer.setAttribute('class', 'bamboo-menu-search-input-container');
    this.menu.subMenu.appendChild(inputContainer);

    this.input = bamboo.doc.createElement('textbox');
    this.input.setAttribute('id', 'bamboo-search-input');
    this.input.setAttribute('class', 'bamboo-input');
    this.input.setAttribute('placeholder', bamboo.utils.str('bamboo.menu.search.label'));
    this.input.addEventListener('change', function(event)
    {
      widget.run('onInputChange');
    }, false);
    this.input.addEventListener('keypress', function(event)
    {
      if(event.keyCode == 13)
      {
        event.stopPropagation();
        widget.run('search');
      }
      else if(event.keyCode == 27)
      {
        event.stopPropagation();
        widget.run('clear');
      }
    }, false);
    inputContainer.appendChild(this.input);

    this.btnClear = bamboo.utils.ui.addMenuButton(inputContainer, bamboo.utils.str('bamboo.button.clear'), 'bamboo-view-icon-close', function(event)
    {
      event.stopPropagation();
      widget.run('clear');
    });
    this.btnClear.setAttribute('id', 'bamboo-search-input-clear');
    this.btnClear.setAttribute('hidden', 'true');
    this.btnClear.setAttribute('active', 'true');

    this.boxAdvanced = bamboo.doc.createElement('hbox');
    this.boxAdvanced.setAttribute('class', 'bamboo-zone-view-search-advanced');
    this.menu.container.appendChild(this.boxAdvanced);

    var checkboxTitles = bamboo.utils.ui.createCheckbox(bamboo.utils.str('bamboo.menu.search.option.titles'), false, function(checked)
    {
      widget.setOnlyInTitles(checked);

      widget.run('search', [true]);
    });
    this.boxAdvanced.appendChild(checkboxTitles);

    var checkboxCase = bamboo.utils.ui.createCheckbox(bamboo.utils.str('bamboo.menu.search.option.case'), false, function(checked)
    {
      widget.setCaseSensitive(checked);

      widget.run('search', [true]);
    });
    this.boxAdvanced.appendChild(checkboxCase);

    var checkboxFilters = bamboo.utils.ui.createCheckbox(bamboo.utils.str('bamboo.menu.search.option.filters'), false, function(checked)
    {
      widget.setMatchFilters(checked);

      widget.run('search', [true]);
    });
    this.boxAdvanced.appendChild(checkboxFilters);

    bamboo.utils.ui.addSpacer(this.boxAdvanced, false, false);
};

bamboo.ui.zone.menu.readerSearch.prototype.update = function()
{
  this.inputValue = this.input.value ? this.input.value.trim() : '';
  this.active = this.inputValue.length > 0;
  this.input.setAttribute('canclear', this.active);
  this.btnClear.setAttribute('hidden', !this.active);
};

bamboo.ui.zone.menu.readerSearch.prototype.onInputChange = function()
{
  if(this.input.value == '')
  {
    this.search();
  }
};

bamboo.ui.zone.menu.readerSearch.prototype.focusInput = function()
{
  this.input.focus();
};

bamboo.ui.zone.menu.readerSearch.prototype.clear = function()
{
  this.input.value = '';

  this.search(true);
  bamboo.ui.rootNode.focus();
};

bamboo.ui.zone.menu.readerSearch.prototype.search = function(doNotFocusInput)
{
  this.update();

  if(this.active)
  {
    var filter = bamboo.data.page.getFilterByName('search');
    filter.setQuery(this.inputValue);
    filter.setCaseSensitive(this.caseSensitive);
    filter.setOnlyInTitles(this.onlyInTitles);
    filter.setMatchFilters(this.matchFilters);

    bamboo.data.page.activateFilter('search', true, true);

    if(!doNotFocusInput)
    {
      this.focusInput();
    }
  }
  else
  {
    this.setAdvanced(false);

    bamboo.data.page.activateFilter('search', false);
  }

  this.menu.update();
};

bamboo.ui.zone.menu.readerSearch.prototype.setAdvanced = function(advanced)
{
  this.advanced = advanced;

  this.menu.container.setAttribute('search-advanced', this.advanced);
};

bamboo.ui.zone.menu.readerSearch.prototype.setCaseSensitive = function(caseSensitive)
{
  this.caseSensitive = caseSensitive;
};

bamboo.ui.zone.menu.readerSearch.prototype.setOnlyInTitles = function(onlyInTitles)
{
  this.onlyInTitles = onlyInTitles;
};

bamboo.ui.zone.menu.readerSearch.prototype.setMatchFilters = function(matchFilters)
{
  this.matchFilters = matchFilters;
};

