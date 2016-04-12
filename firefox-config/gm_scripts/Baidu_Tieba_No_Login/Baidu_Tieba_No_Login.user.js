// ==UserScript==
// @namespace   VA_i
// @version     1.0.1.20160106
// @grant       unsafeWindow
// @include     http://tieba.baidu.com/*
// @run-at      document-start
// @name        Baidu Tieba: No Login
// @name:zh-CN  百度贴吧：不登录即可看贴
// @name:zh-TW  百度贴吧：不登入即可看貼
// @description View Baidu Tieba without login.
// @description:zh-CN 百度贴吧看贴（包括楼中楼）无须登录。
// @description:zh-TW 百度贴吧看貼（包括樓中樓）无須登入。
// ==/UserScript==

unsafeWindow.Object.freeze = null;

document.addEventListener('DOMContentLoaded', function (event) {
  try {
    unsafeWindow.PageData.user.is_login = 1;
  } catch (error) {
    //alert(error);
  }
}, true);
