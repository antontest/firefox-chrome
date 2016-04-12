// 导航站点设置
var Config = getMStr(function(){
    var sites;
/*
门户网站
  网易, http://www.163.com/,  img/163.ico
	新浪, http://www.sina.com.cn/,  img/sina.ico
	腾讯, http://www.qq.com/,  img/qq.ico
	搜狐, http://www.sohu.com/,  img/souhu.ico
	环球网, http://www.huanqiu.com/,  img/huanqiu.ico
	凤凰网, http://www.ifeng.com/,  img/fenghuang.ico
	太平洋, http://www.pconline.com.cn/,  img/pconline.ico
	阳光导航, http://gps.sunbox.cc/,  img/sunbox.png

兴趣阅读
	cnBeta, http://www.cnbeta.com/,  img/cnBeta.ico
	TechWeb, http://www.techweb.com.cn/,  img/TechWeb.ico
	极客公园, http://www.geekpark.net/, img/geekpark.ico
	36氪, http://36kr.com/, img/36k.ico
	知乎, http://www.zhihu.com/,  img/zhihu.ico
	花瓣, http://huaban.com/,  img/huaban.ico
	简书, http://www.jianshu.com/,  img/jianshu.ico
	煎蛋, http://jandan.net/,  img/jandan.ico
	
在线应用
	谷歌翻译, http://translate.google.cn/, img/gtrans.ico
	为知笔记, https://note.wiz.cn/web, img/wiz.ico
	Pocket, https://getpocket.com/a/queue/list/, img/pocket.ico	
	站长工具, http://tool.oschina.net/, img/tools.ico
	百度云, http://pan.baidu.com/disk/home?, img/baiduyun.ico
	360云盘, http://yunpan.360.cn/, img/yunpan.png
	live邮箱, http://home.live.com/, img/live.ico
	TinyPNG, https://tinypng.com/, img/tinypng.ico
	
火狐专区
  AMO, https://addons.mozilla.org/zh-CN/firefox/, img/addons.png
	官方 FTP, http://ftp.mozilla.org/pub/mozilla.org/firefox/, img/ftp.ico
	Greasyfork, https://greasyfork.org/scripts, img/userscript.png
	Userstyles, https://userstyles.org/, img/userstyles.png
	卡饭火狐, http://bbs.kafan.cn/forum-215-1.html, img/kafan.ico
	火狐贴吧, http://tieba.baidu.com/f?ie=utf-8&kw=firefox, img/tieba.png
	阳光盒子, http://sunbox.cc/, img/sunbox.png
	火狐范, http://firefoxfan.cc/, img/firefoxfan.png
	
视频门户
	Youtube, https://www.youtube.com/, img/youtube.png
	优酷视频, http://www.youku.com/, img/youku.ico
	爱奇艺, http://v.iqiyi.com/, img/iqiyi.ico
	腾讯视频, http://v.qq.com/index.html, img/vqq.ico
	乐视, http://www.letv.com/, img/letv.ico
	搜狐视频, http://tv.sohu.com/, img/vsouhu.ico
	芒果, http://www.hunantv.com/, img/hunantv.ico
	风行, http://www.fun.tv/, img/fun.ico
	
视频直播
	斗鱼, http://www.douyutv.com/directory/all/, img/douyu.ico
	战旗, http://www.zhanqi.tv/lives/, img/zhanqi.png
	龙珠, http://longzhu.com/channels/all/, img/longzhu.ico
	风云, http://www.fengyunlive.com/, img/fengyun.ico
	电视直播, http://www.cietv.com/, img/cietv.ico	
	阳光影城, http://sunbox.cc/online/, img/sunbox.ico
	PPTV直播, http://live.pptv.com/, img/pptv.ico
	云点播, http://vod.lixian.xunlei.com/, img/xunlei.ico
	
影音娱乐
	网易云音乐, http://music.163.com/, img/music.ico
	虾米, http://www.xiami.com/, img/xiami.ico
	QQ音乐, http://y.qq.com/, img/qqmusic.ico
	百度随心听, http://fm.baidu.com/, img/baidufm.ico
	阳光电台, http://sunbox.cc/sunbox-fm.html, img/sunboxfm.ico	
	全集网, http://www.loldytt.com/, img/loldytt.ico
	AcFun, http://www.acfun.tv/, img/acfun.ico
	哔哩哔哩, http://www.bilibili.com/, img/bilibili.ico
	
软件下载
  MSDN镜像, http://www.itellyou.cn/,  img/weiruan.ico
  PortableApps, http://portableapps.com/,  img/portableapps.ico
	快科技, http://www.mydrivers.com/,  img/mydrivers.ico
	汉化新世纪, http://www.hanzify.org/,  img/hanzify.ico
	远景论坛, http://bbs.pcbeta.com/,  img/pcbeta.ico
	卡饭下载, http://bbs.kafan.cn/forum-65-1.html,  img/kafan.ico
	睿派克, http://www.repaik.com/,  img/repaik.ico
	异次元, http://www.iplaysoft.com/,  img/iplaysoft.ico
	
资源收藏
	站酷, http://www.zcool.com.cn/, img/zcool.ico
	DeviantArt, http://www.deviantart.com/, img/deviantart.ico
	Wallhaven, http://alpha.wallhaven.cc/, img/wallhaven.ico
	炫音论坛, http://bbs.musicool.cn/, img/musicool.ico	
	足球录像, http://www.qiuw.com/a/zuqiu/qc/, img/qiuw.ico
	电影天堂, http://www.dygod.net/, img/dianying.ico
	字幕组, http://www.zimuzu.tv/, img/zimuzu.ico
	MP4吧, http://www.mp4ba.com/, img/mp4ba.ico	
	
游戏联盟
    游侠论坛, http://game.ali213.net/, img/ali213.ico
    游民星空, http://www.gamersky.com/,  img/gamersky.ico
    多玩, http://www.duowan.com/,  img/duowan.ico
    电玩巴士, http://www.tgbus.com/,  img/tgbus.ico
    暴雪战网, http://www.battlenet.com.cn/zh/,  img/battlenet.gif	
    魔兽世界, http://www.battlenet.com.cn/wow/zh/,  img/wow.ico
    NGA, http://nga.178.com/,  img/nga.ico
    英雄联盟, http://lol.qq.com/main.shtml,  img/lol.ico
    
社区交流
	新浪微博, http://weibo.com/, img/weibo.ico
	腾讯微博, http://t.qq.com/, img/tqq.ico
	豆瓣, http://www.douban.com/, img/douban.ico
	贴吧, http://tieba.baidu.com/, img/tieba.png
	天涯社区, http://focus.tianya.cn/, img/tianya.ico
	猫扑, http://www.mop.com/, img/mop.ico
	Twitter, https://twitter.com/, img/twitter.ico
	V2EX, http://www.v2ex.com/, img/v2ex.png
	
综合辅助
	谷歌首页, https://www.google.com/, img/googleg_lodp.ico
	百度首页, http://www.baidu.com/, img/baidu.ico
	必应首页, http://www.bing.com/, img/bing.ico
	维基百科, https://de.wikipedia.org/wiki/Wikipedia:Hauptseite, img/wiki.ico
	网盘搜索, http://so.baiduyun.me/, img/baiduyun.ico
	搜索图标, http://www.easyicon.net/, img/easyicon.ico
	BookLink, http://booklink.me/, img/booklink.png
	装逼大全, http://zhuangbi.info/, img/bi.png
*/
});

// 搜索引擎设置
$(document).ready(function(){

	$('#Searchtype ul li a').on('click', function(){
		$(this).parent().addClass('active').siblings().removeClass('active');
		$('#Searchbox').submit();
	});
	
	$('#Searchbox').submit(function() {
		var type = $('#Searchtype li.active a').attr('lang');
		var que = $('input[name="wd"]').val();
		if(que !== '') {
			switch (type) {
				case 'Bing':
					searchstr='http://www.bing.com/search?q=' + que;
					break;
				case 'baidu':
					searchstr='https://www.baidu.com/s?wd=' + que;
					break;
				case 'tieba':
					searchstr='http://tieba.baidu.com/f?kw=' + que;
					break;
				case 'baiduyun':
					searchstr='https://www.google.com/search?q=site:pan.baidu.com%20' + que;
					break;
				case 'image':
					searchstr='http://www.bing.com/images/search?q=' + que;
					break;
				case 'video':
					searchstr='http://www.soku.com/search_video/q_' + que;
					break;
				case 'music':
					searchstr='http://music.baidu.com/search?key=' + que;
					break;
				case 'YTB':
					searchstr='https://www.youtube.com/results?search_query=' + que;
					break;
				case 'shop':
					searchstr='http://s.taobao.com/search?q=' + que;
					break;
				case 'map':
					searchstr='https://www.google.com/maps/place/' + que;
					break;
				case 'kafan':
					searchstr='http://bds.kafan.cn/cse/search?q=' + que +'&s=15563968344970452529';
					break;
				case 'wiki':
					searchstr='https://zh.wikipedia.org/zh-cn/' + que;
					break;
				default:
			}
		
			if(isNewTab){
				window.open(searchstr);
				$('input[name="wd"]').val("");
			} 
			else {
				window.location.href = searchstr;
			}
			
			return false;
		}
	});
});

// 从函数中获取多行注释的字符串
function getMStr(fn) {
    var fnSource = fn.toString();
    var ret = {};
    fnSource = fnSource.replace(/^[^{]+/, '');
    // console.log(fnSource);
    var matched;
    var reg = /var\s+([$\w]+)[\s\S]*?\/\*([\s\S]+?)\*\//g;
    while (matched = reg.exec(fnSource)) {
        // console.log(matched);
        ret[matched[1]] = matched[2];
    };
    
    return ret;
}