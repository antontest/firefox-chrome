
var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://bamboomodule/application.js");

bamboo.ui.zone.menu.player = function(target)
{
  bamboo.ui.component.call(this, target);

  this.player = null;
  this.link = null;
  this.canvas = null;
  this.canvasContext = null;

  this.status = 'paused'; // playing / loading / error

  this.currentItem = null;
  this.currentURL = null;

  this.timer = null;
  this.audio = null;
  this.audioContext = null;
  this.audioSource = null;
  this.audioAnalyser = null;

  this.animations = ['wave', 'bar', 'simple', 'none'];
  this.animation = bamboo.option.get('audio-animation');
};

bamboo.extend(bamboo.ui.zone.menu.player, bamboo.ui.component);

bamboo.ui.zone.menu.player.prototype.init = function()
{
  this.timer = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);
};

bamboo.ui.zone.menu.player.prototype.initAudio = function()
{
  if(this.audio)
  {
    return;
  }

  var view = this;
  this.audio = new bamboo.win.Audio();

  this.audio.addEventListener('playing', function()
  {
    view.run('updateStatus', ['playing']);
  }, false);
  this.audio.addEventListener('ended', function()
  {
    view.run('updateStatus', ['paused']);
  }, false);
  this.audio.addEventListener('waiting', function()
  {
    view.run('updateStatus', ['loading']);
  }, false);
  this.audio.addEventListener('error', function()
  {
    view.run('updateStatus', ['error']);
  }, false);

  this.audioContext = new bamboo.win.AudioContext();

  if(this.audioContext.createMediaElementSource)
  {
    this.audioSource = this.audioContext.createMediaElementSource(this.audio);
    this.audioAnalyser = this.audioContext.createAnalyser();
    this.audioSource.connect(this.audioAnalyser);
    this.audioSource.connect(this.audioContext.destination);
  }
};

bamboo.ui.zone.menu.player.prototype.build = function()
{
  this.init();

  var view = this;

  this.player = bamboo.doc.createElement('vbox');
  this.player.setAttribute('class', 'bamboo-zone-view-player');
  this.container.appendChild(this.player);

  var header = bamboo.doc.createElement('hbox');
  header.setAttribute('class', 'bamboo-zone-view-player-header');
  header.setAttribute('flex', '1');
  this.player.appendChild(header);

  var iconLoading = bamboo.doc.createElement('vbox');
  iconLoading.setAttribute('class', 'bamboo-view-player-icon-loading');
  header.appendChild(iconLoading);

  var buttonPlay = bamboo.doc.createElement('vbox');
  buttonPlay.setAttribute('class', 'bamboo-view-player-button bamboo-view-player-button-play');
  buttonPlay.addEventListener("click", function()
  {
    view.run('play');
  }, false);
  header.appendChild(buttonPlay);

  var buttonPause = bamboo.doc.createElement('vbox');
  buttonPause.setAttribute('class', 'bamboo-view-player-button bamboo-view-player-button-pause');
  buttonPause.addEventListener("click", function()
  {
    view.run('pause');
  }, false);
  header.appendChild(buttonPause);

  var linkContainer = bamboo.doc.createElement('html:div');
  linkContainer.setAttribute('class', 'bamboo-zone-view-player-link bamboo-font-light');
  linkContainer.setAttribute('type', 'content');
  linkContainer.setAttribute('flex', '1');
  header.appendChild(linkContainer);

  this.link = bamboo.doc.createElementNS("http://www.w3.org/1999/xhtml", 'a');
  this.link.setAttribute('class', 'bamboo-focusable');
  this.link.addEventListener("click", function(event)
  {
    if(!bamboo.ui.isInTab() || bamboo.option.get('force-tab-in-background') == 'true')
    {
      event.stopPropagation();
      event.preventDefault();

      if(event.button < 2)
      {
        bamboo.utils.browser.openLink(this.getAttribute('href'), true);
      }
    }
    else if(!bamboo.isFirefox && bamboo.option.get('thunderbird-link-in-tab') == 'true')
    {
      event.stopPropagation();
      event.preventDefault();

      bamboo.utils.browser.openLink(this.getAttribute('href'), true);
    }
  }, false);
  this.link.addEventListener("mouseup", function(event)
  {
    if(!bamboo.ui.isInTab() && event.button == 1)
    {
      event.stopPropagation();
      event.preventDefault();

      bamboo.utils.browser.openLink(this.getAttribute('href'), true);
    }
  }, false);
  this.link.addEventListener("keypress", function(event)
  {
    if(event.keyCode == 13 || event.charCode == 32)
    {
      event.stopPropagation();
      event.preventDefault();

      bamboo.utils.browser.openLink(this.getAttribute('href'), true);
    }
  }, false);
  linkContainer.appendChild(this.link);

  var buttonVisu = bamboo.doc.createElement('vbox');
  buttonVisu.setAttribute('class', 'bamboo-view-player-button bamboo-view-player-button-visu');
  buttonVisu.addEventListener("click", function()
  {
    view.run('changeAnimation');
  }, false);
  header.appendChild(buttonVisu);

  var buttonClose = bamboo.doc.createElement('vbox');
  buttonClose.setAttribute('class', 'bamboo-view-player-button bamboo-view-player-button-close');
  buttonClose.addEventListener("click", function()
  {
    view.run('closePlayer');
  }, false);
  header.appendChild(buttonClose);

  var canvasContainer = bamboo.doc.createElement('hbox');
  canvasContainer.setAttribute('class', 'bamboo-zone-view-player-canvas-container');
  canvasContainer.setAttribute('flex', '1');
  canvasContainer.addEventListener("mousedown", function(event)
  {
    view.run('setPosition', [event]);
  }, false);
  this.player.appendChild(canvasContainer);

  this.canvas = bamboo.doc.createElementNS("http://www.w3.org/1999/xhtml", 'canvas');
  this.canvas.setAttribute('class', 'bamboo-zone-view-player-canvas');
  this.canvas.setAttribute('width', '500');
  this.canvas.setAttribute('height', '11');
  canvasContainer.appendChild(this.canvas);

  this.canvasContext = this.canvas.getContext('2d');

  this.update();

  return this.player;
};

bamboo.ui.zone.menu.player.prototype.update = function()
{
  this.player.setAttribute('open', this.isOpen);
  this.player.setAttribute('status', this.status);
  this.player.setAttribute('has-data', this.currentItem && this.currentURL);
  this.container.setAttribute('player-open', this.isOpen);

  this.link.setAttribute('href', encodeURI(this.currentURL));
  this.link.setAttribute('target', bamboo.option.get('force-new-tab') == 'true' ? '_blank' : '_self');
  this.link.textContent = this.currentItem ? this.currentItem.title : '';
};

bamboo.ui.zone.menu.player.prototype.clearCanvas = function(w, h)
{
  this.canvasContext.clearRect(0, 0, w, h);
};

bamboo.ui.zone.menu.player.prototype.updateCanvas = function()
{
  if(this.animation == 'none')
  {
    return;
  }

  var w = this.canvas.clientWidth;
  var h = this.canvas.clientHeight;

  var parentW = this.canvas.parentNode.clientWidth;

  if(parentW != w)
  {
    w = parentW;
    this.canvas.setAttribute('width', parentW);
  }

  this.clearCanvas(w, h);

  var isDark = bamboo.option.get('display-view-style') != 'light';
  var limit = this.audio.duration ? (this.audio.currentTime / this.audio.duration) * w : 0;
  var beforeLimit = true;

  if(this.animation == 'simple' || !this.audioSource || !this.audioAnalyser || (this.animation == 'wave' && this.audio.paused))
  {
    this.canvasContext.lineWidth = 1;
    this.canvasContext.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)';

    this.canvasContext.beginPath();

    this.canvasContext.moveTo(0, h/2);
    this.canvasContext.lineTo(limit, h/2);

    this.canvasContext.stroke();
    this.canvasContext.beginPath();

    this.canvasContext.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';

    this.canvasContext.lineTo(limit, h/2);
    this.canvasContext.lineTo(w, h/2);

    this.canvasContext.stroke();
  }
  else
  {
    var bufferLength = null;
    var dataArray = null;
    var i = null;
    var x = null;

    if(this.animation == 'wave')
    {
      bufferLength = 1024;
      this.audioAnalyser.fftSize = bufferLength;
      dataArray = new Uint8Array(bufferLength);
      this.audioAnalyser.getByteTimeDomainData(dataArray);

      this.canvasContext.lineWidth = 1;
      this.canvasContext.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)';

      this.canvasContext.beginPath();

      var sliceWidth = w * 1.0 / bufferLength;
      x = 0;

      for (i = 0; i < bufferLength; i++)
      {
        var v = dataArray[i] / 128.0;
        var y = v * h / 2;

        if (i == 0)
        {
          this.canvasContext.moveTo(x, y);
        }
        else
        {
          this.canvasContext.lineTo(x, y);
        }

        if (beforeLimit && x >= limit)
        {
          beforeLimit = false;
          this.canvasContext.stroke();
          this.canvasContext.beginPath();
          this.canvasContext.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';
        }

        x += sliceWidth;
      }

      this.canvasContext.stroke();
    }
    else if(this.animation == 'bar')
    {
      this.audioAnalyser.fftSize = 256;
      bufferLength = this.audioAnalyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);

      if(!this.audio.paused)
      {
        this.audioAnalyser.getByteFrequencyData(dataArray);
      }

      this.canvasContext.fillStyle = isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.3)';

      var barWidth = w / bufferLength;
      var barHeight;
      x = 0;

      for(i = 0; i < bufferLength; i++)
      {
        if(this.audio.paused)
        {
          barHeight = 1;
        }
        else
        {
          barHeight = ((dataArray[i]/2) * (h/256));

          if(barHeight < 1)
          {
            barHeight = 1;
          }
        }

        if(beforeLimit && limit < (x + barWidth))
        {
          beforeLimit = false;
          this.canvasContext.fillStyle = isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.1)';
        }

        this.canvasContext.fillRect(x, Math.ceil(h/2) - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    }
  }
};

bamboo.ui.zone.menu.player.prototype.changeAnimation = function()
{
  var index = this.animations.indexOf(this.animation);
  if(index >= 0)
  {
    this.animation = this.animations[(index+1)%this.animations.length];

    if(this.animation == 'none')
    {
      this.clearCanvas(this.canvas.clientWidth, this.canvas.clientHeight);
    }

    bamboo.option.set('audio-animation', this.animation);
  }
};

bamboo.ui.zone.menu.player.prototype.updateStatus = function(status)
{
  this.status = status;
  this.update();
};

bamboo.ui.zone.menu.player.prototype.openPlayer = function()
{
  if(!this.isOpen)
  {
    this.isOpen = true;
    this.update();

    var view = this;

    this.timer.cancel();
    this.timer.initWithCallback({notify: function()
    {
      view.animationID = bamboo.win.requestAnimationFrame(function()
      {
        view.updateCanvas();
      });
    }}, 40, Components.interfaces.nsITimer.TYPE_REPEATING_SLACK);
  }
};

bamboo.ui.zone.menu.player.prototype.closePlayer = function()
{
  if(this.animationID)
  {
    bamboo.win.cancelAnimationFrame(this.animationID);
    this.animationID = null;
  }

  this.timer.cancel();

  this.pause();
  this.isOpen = false;
  this.update();
};

bamboo.ui.zone.menu.player.prototype.play = function()
{
  if(this.currentItem && this.currentURL)
  {
    this.updateStatus('loading');

    if(this.audioSource)
    {
      this.audioSource.connect(this.audioContext.destination);
    }

    this.audio.play();
  }
};

bamboo.ui.zone.menu.player.prototype.pause = function()
{
  if(this.currentItem && this.currentURL)
  {
    this.updateStatus('paused');
    this.audio.pause();
  }
};

bamboo.ui.zone.menu.player.prototype.playAudio = function(url, item)
{
  this.currentItem = item;
  this.currentURL = url;

  this.updateStatus('loading');

  this.run('initAudio');

  if(this.audio)
  {
    this.audio.src = this.currentURL;

    if(this.audio.play)
    {
      this.audio.play();
    }
  }

  this.openPlayer();
};

bamboo.ui.zone.menu.player.prototype.setPosition = function(event)
{
  if(this.audio.duration)
  {
    if(this.audio.paused)
    {
      this.audio.play();
    }

    var pos = event.layerX;
    var w = this.canvas.clientWidth;

    this.audio.currentTime = this.audio.duration * (pos / w);
  }
};