// ==UserScript==
// @name        Flash Accelerate
// @namespace   fengwn1997@163.com
// @description 开启FlashPlayer硬件渲染加速
// @include     http://*
// @include     https://*
// @exclude     http://www.imdb.com/*
// @exclude     http://www.xiami.com/play*
// @version     1.14
// @grant       none
// ==/UserScript==
//创意来自 gpu-accelerated-flash-player 扩展！
//是否有加速效果作者也不知道。
//关于wmode参数的解释：http://helpx.adobe.com/flash/kb/flash-object-embed-tag-attributes.html
//如果你使用的是firefox，可以在about:config将plugins.force.wmode修改(新建)为 gpu 或 direct
//如果你发现平时正常浏览的网页无法正常使用，请优先禁用此脚本以排查问题
//
var run_time_max = 3; //最大运行次数
var wmode_value = 'gpu'; //默认 gpu，可以是 direct。一般不需要更改
var toggle = function (o) {
  if (o) {
    o.setAttribute('fa-sign', 1);
    var display = o.style.display;
    o.style.display = 'none';
    setTimeout(function () {
      o.style.display = display;
      //console.log(o);
    }, 0);
  }
};
var replace_node = function (o, objects) {
  if (o) {
    //     if (o.clientWidth < 300 || o.clientHeight < 300) {
    //       //跳过小Flash
    //     } 
    if (o.type != 'application/x-shockwave-flash') {
      //跳过非Flash
    } 
    else {
      clone = o.cloneNode(true);
      clone.setAttribute('fa-sign', 1);
      o.parentElement.replaceChild(clone, o);
    }
  }
};
var run_time = 1;
var find_wmode = function (t) {
  for (var i = 0; i < t.length; i++) {
    if (t[i].name == 'wmode' || t[i].name == 'wMode') {
      return t[i];
    }
  }
  return null;
};
var interval = setInterval(function () {
  var objects = document.getElementsByTagName('object');
  var embeds = document.getElementsByTagName('embed');
  console.log('run_time', run_time, location);
  if (run_time == run_time_max) {
    clearInterval(interval);
  }
  run_time = run_time + 1;
  if (embeds.length > 0) {
    for (var i = 0; i < embeds.length; i++) {
      if (embeds[i].clientWidth < 300 || embeds[i].clientHeight < 300 || embeds[i].type != 'application/x-shockwave-flash') {
        //跳过小Flash
      } 
      else if (embeds[i].getAttribute('fa-sign')) {
        continue;
      } 
      else {
        embeds[i].setAttribute('wmode', wmode_value);
        replace_node(embeds[i], objects);
      }
    }
  }
  if (objects.length > 0) {
    for (var j = 0; j < objects.length; j++) {
      if (objects[j].clientWidth < 300 || objects[j].clientHeight < 300 || objects[j].type != 'application/x-shockwave-flash') {
        //跳过小Flash
      } 
      else if (objects[j].getAttribute('fa-sign')) {
        continue;
      } 
      else {
        var d = find_wmode(objects[j].childNodes);
        if (d) {
          d.value = wmode_value;
        } 
        else {
          var e = document.createElement('param');
          e.name = 'wmode';
          e.value = wmode_value;
          objects[j].appendChild(e);
        }
        replace_node(objects[j]);
      }
    }
  }
}, 1500);
