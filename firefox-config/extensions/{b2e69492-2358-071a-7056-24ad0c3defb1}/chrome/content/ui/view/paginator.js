
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.ui.view.paginator = function(id, isSearch)
{
  this.panel = bamboo.ui.panel.get(isSearch ? 'search' : 'reader');

  bamboo.ui.view.base.call(this, id, this.panel.zoneViewData.paginatorContainer);

  this.buttonPrevSmall = null;
  this.buttonLarge = null;
  this.box = null;
  this.icon = null;
  this.checkboxMark = null;
  this.label = null;
  /*
   this.labelInfo = null;
   this.boxFirst = null;
   this.boxDown = null;
   this.boxUp = null;
   this.boxLast = null;
   */
  this.search = isSearch;

  this.boxNoData = null;
};

bamboo.extend(bamboo.ui.view.paginator, bamboo.ui.view.base);

bamboo.ui.view.paginator.prototype.build = function()
{
  var page = this.getData();
  var view = this;

  /*
  this.labelInfo = bamboo.doc.createElement('label');
  this.labelInfo.setAttribute('class', 'bamboo-view-paginator-info');
  this.container.appendChild(this.labelInfo);

  var buttonBox = bamboo.doc.createElement('hbox');
  this.container.appendChild(buttonBox);

  var handlerFirst = function()
  {
    page.run('pageFirst');
  };
  this.boxFirst = bamboo.doc.createElement('vbox');
  this.boxFirst.addEventListener("click", handlerFirst, false);
  this.boxFirst.setAttribute('class', 'bamboo-button-page');
  buttonBox.appendChild(this.boxFirst);
  var img = bamboo.doc.createElement('image');
  img.setAttribute('class', 'bamboo-icon bamboo-button-page-first');
  this.boxFirst.appendChild(img);

  var handlerDown = function()
  {
    page.run('pageDown');
  };
  this.boxDown = bamboo.doc.createElement('vbox');
  this.boxDown.addEventListener("click", handlerDown, false);
  this.boxDown.setAttribute('class', 'bamboo-button-page');
  buttonBox.appendChild(this.boxDown);
  img = bamboo.doc.createElement('image');
  img.setAttribute('class', 'bamboo-icon bamboo-button-page-prev');
  this.boxDown.appendChild(img);

  var handlerUp = function()
  {
    page.run('pageUp');
  };
  this.boxUp = bamboo.doc.createElement('vbox');
  this.boxUp.addEventListener("click", handlerUp, false);
  this.boxUp.setAttribute('class', 'bamboo-button-page');
  buttonBox.appendChild(this.boxUp);
  img = bamboo.doc.createElement('image');
  img.setAttribute('class', 'bamboo-icon bamboo-button-page-next');
  this.boxUp.appendChild(img);

  var handlerLast = function()
  {
    page.run('pageLast');
  };
  this.boxLast = bamboo.doc.createElement('vbox');
  this.boxLast.addEventListener("click", handlerLast, false);
  this.boxLast.setAttribute('class', 'bamboo-button-page');
  buttonBox.appendChild(this.boxLast);
  img = bamboo.doc.createElement('image');
  img.setAttribute('class', 'bamboo-icon bamboo-button-page-last');
  this.boxLast.appendChild(img);
  */

  this.buttonPrevSmall = bamboo.doc.createElement('vbox');
  this.buttonPrevSmall.setAttribute('class', 'bamboo-focusable bamboo-paginator-button-small');
  this.buttonPrevSmall.setAttribute('tooltiptext', bamboo.utils.str('bamboo.option.label.shortcut.pageprevious'));

  var iconBox = bamboo.doc.createElement('vbox');
  var iconPrev = bamboo.doc.createElement('image');
  iconPrev.setAttribute('class', 'bamboo-paginator-icon-prev');
  iconBox.appendChild(iconPrev);
  this.buttonPrevSmall.appendChild(iconBox);

  this.buttonPrevSmall.addEventListener("click", function(event)
  {
    if(event.button < 1)
    {
      view.run('handlerPrev');

      event.stopPropagation();
      event.preventDefault();
    }
  }, false);

  this.buttonPrevSmall.addEventListener("keypress", function(event)
  {
    if(event.keyCode == 13 || event.charCode == 32)
    {
      view.run('handlerPrev', [true]);

      event.stopPropagation();
      event.preventDefault();
    }
  }, false);

  this.container.appendChild(this.buttonPrevSmall);

  this.buttonLarge = bamboo.doc.createElement('hbox');
  this.buttonLarge.setAttribute('class', 'bamboo-focusable bamboo-paginator-button-large');
  this.buttonLarge.setAttribute('flex', '1');
  this.container.appendChild(this.buttonLarge);

  this.buttonLarge.addEventListener("click", function(event)
  {
    if(event.button < 1)
    {
      view.run('handler');

      event.stopPropagation();
      event.preventDefault();
    }
  }, false);

  this.buttonLarge.addEventListener("keypress", function(event)
  {
    if(event.keyCode == 13 || event.charCode == 32)
    {
      view.run('handler', [true]);

      event.stopPropagation();
      event.preventDefault();
    }
  }, false);

  iconBox = bamboo.doc.createElement('vbox');
  this.icon = bamboo.doc.createElement('image');
  this.buttonLarge.appendChild(iconBox);
  iconBox.appendChild(this.icon);

  this.label = bamboo.doc.createElement('label');
  this.label.setAttribute('class', 'bamboo-zone-view-menu-title bamboo-font-light');
  this.buttonLarge.appendChild(this.label);

  bamboo.utils.ui.addSpacer(this.buttonLarge, false, false);

  this.checkboxMark = bamboo.utils.ui.createCheckbox(bamboo.utils.str('bamboo.message.markarticlesasread'), bamboo.option.get('mark-as-read-on-next-page') == 'true', function(checked)
  {
    bamboo.option.run('set', ['mark-as-read-on-next-page', checked ? 'true' : 'false']);
  });
  this.buttonLarge.appendChild(this.checkboxMark);

  this.update();
};

bamboo.ui.view.paginator.prototype.update = function()
{
  var page = this.getData();
  var isLastPage = page.isLastPage();
  var isFirstPage = page.isFirstPage();

  var hasUnread = this.search ? bamboo.searchSelection && bamboo.searchSelection.unreadItemCount > 0 : bamboo.selection && bamboo.selection.unreadItemCount > 0;
  var hide = !page.hasData() || (isFirstPage && isLastPage && !hasUnread);

  this.buttonLarge.setAttribute('hidden', hide);
  this.buttonPrevSmall.setAttribute('hidden', isFirstPage || (isLastPage && !hasUnread));

  if(!hide)
  {
    var hasCurrentUnread = page.hasCurrentUnreadItems();

    var iconType = isLastPage ? 'mark' : 'next';
    if(isLastPage && !hasUnread)
    {
      iconType = 'prev';
    }
    this.icon.setAttribute('class', 'bamboo-paginator-icon-' + iconType);

    this.checkboxMark.setAttribute('hidden', isLastPage || !hasCurrentUnread);

    var label = isLastPage ? bamboo.utils.str('bamboo.button.mark') : bamboo.utils.str('bamboo.option.label.shortcut.pagenext');
    if(isLastPage && !hasUnread)
    {
      label = bamboo.utils.str('bamboo.option.label.shortcut.pageprevious');
    }
    this.label.setAttribute('value', label);
    /*
    this.labelInfo.setAttribute('value', page.str());

    this.boxFirst.setAttribute('active', !page.isFirstPage());
    this.boxDown.setAttribute('active', !page.isFirstPage());
    this.boxUp.setAttribute('active', !page.isLastPage());
    this.boxLast.setAttribute('active', !page.isLastPage());
    */
  }
  else
  {
    if(bamboo.doc.commandDispatcher.focusedElement == this.container)
    {
      bamboo.ui.rootNode.focus();
    }
  }

  if(this.boxNoData != null && page.hasData())
  {
    this.panel.zoneViewData.childContainer.removeChild(this.boxNoData);
    this.boxNoData = null;
    this.labelNoData = null;
  }

  if(!page.hasData() && (!this.search || (!bamboo.data.found || bamboo.data.found.feeds.length > 0)))
  {
    if(this.boxNoData == null)
    {
      this.boxNoData = bamboo.doc.createElement('vbox');
      this.boxNoData.setAttribute('class', 'bamboo-view-nodata-box');
      this.panel.zoneViewData.childContainer.appendChild(this.boxNoData);

      this.labelNoData = bamboo.doc.createElement('label');
      this.labelNoData.setAttribute('class', 'bamboo-view-nodata-label bamboo-font-light');

      this.boxNoData.appendChild(this.labelNoData);
    }

    this.updateNoDataLabel();
  }
};

bamboo.ui.view.paginator.prototype.handlerPrev = function(fromKey)
{
  var page = this.getData();

  if(!page.isFirstPage())
  {
    page.run('pageDown');

    if(fromKey)
    {
      bamboo.ui.run('onCommandFocusFirst');
    }
  }
};

bamboo.ui.view.paginator.prototype.handler = function(fromKey)
{
  var page = this.getData();

  if(page.isLastPage())
  {
    var hasUnread = this.search ? bamboo.searchSelection && bamboo.searchSelection.unreadItemCount > 0 : bamboo.selection && bamboo.selection.unreadItemCount > 0;
    if(hasUnread)
    {
      bamboo.ui.run('onCommandMarkAll');
    }
    else
    {
      this.handlerPrev(fromKey);
    }
  }
  else
  {
    page.run('pageUp');
    bamboo.ui.panel.selection.zoneViewMenu.update();

    if(fromKey)
    {
      bamboo.ui.run('onCommandFocusFirst');
    }
  }
};

bamboo.ui.view.paginator.prototype.updateNoDataLabel = function()
{
  var val = 'bamboo.info.nodata';
  var page = this.search ? bamboo.data.searchPage : bamboo.data.page;
  var noFav = false;

  if(!this.search && page.getFilterByName('search').active)
  {
    val += '.search';

    if(page.getFilterByName('search').searchInSelection)
    {
      val += '.selection';
    }
  }
  else
  {
    if(!this.search && bamboo.selection instanceof bamboo.data.library && bamboo.selection.items.length <= 0)
    {
      val = 'bamboo.info.nosaveditem';
      noFav = true;
    }

    if(!noFav && !this.search && page.getFilterByName('favorite').active)
    {
      val += '.favorite';

      if(!bamboo.data.all.hasFavoriteFeeds())
      {
        val = 'bamboo.info.nofavorite';
        noFav = true;
      }
      else
      {
        var isFeed = bamboo.selection instanceof bamboo.data.feed;
        var isGroup = bamboo.selection instanceof bamboo.data.group;
        var isRoot = bamboo.selection instanceof bamboo.data.root;

        if(  (isFeed && !bamboo.selection.favorite)
          || ((isGroup || isRoot) && !bamboo.selection.hasFavoriteFeeds()))
        {
          val = 'bamboo.info.nofavoriteinselection';
          noFav = true;
        }
      }
    }
    if(!noFav && page.getFilterByName('new').active)
    {
      val += '.new';
    }
  }

  this.labelNoData.setAttribute('value', bamboo.utils.str(val));
};
