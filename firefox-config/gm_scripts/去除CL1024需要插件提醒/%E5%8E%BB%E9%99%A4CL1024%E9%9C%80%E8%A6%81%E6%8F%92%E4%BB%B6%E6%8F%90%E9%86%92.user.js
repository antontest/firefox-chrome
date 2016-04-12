// ==UserScript==
// @name        去除CL1024需要插件提醒
// @namespace   times.eu.org
// @description 去除1024论坛 播放在线视频需要安装插件的提示
// @homepageURL https://greasyfork.org/zh-CN/scripts/5998
// @include http://*cl*
// @include http://*184*
// @include http://*t66y*
// @include http://*1024*
// @include http://*caoliu*
// @include http://wo.yao.cl
// @include http://*shenyingwang*
// @exclude http://*baidu*
// @version     2.0
// @grant       none
// ==/UserScript==

(function (embedList) {
  [
  ].forEach.call(embedList, function (i) {
    var iframe = document.createElement('iframe');
    iframe.src = i.src,
    iframe.width = i.width,
    iframe.height = i.height;
    i.parentNode.replaceChild(iframe, i);
  });
}) (document.querySelectorAll('embed'));