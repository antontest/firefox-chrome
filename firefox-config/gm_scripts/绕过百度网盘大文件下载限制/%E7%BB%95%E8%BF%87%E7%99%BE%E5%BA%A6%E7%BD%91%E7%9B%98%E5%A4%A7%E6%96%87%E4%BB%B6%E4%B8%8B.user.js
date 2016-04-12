// ==UserScript==
// @name         绕过百度网盘大文件下载限制
// @namespace https://greasyfork.org/users/16216
// @version      1.0
// @description  绕过百度网盘大文件下载限制，不用装云管家，直接下载
// @author       QIQI
// @match        *://pan.baidu.com/*
// @match        *://yun.baidu.com/*
// @grant        none
// ==/UserScript==

window.navigator.__defineGetter__ ('platform', function () {return ''});
//原理：修改platform读取方法，让百度认为当前浏览器不是Windows平台的