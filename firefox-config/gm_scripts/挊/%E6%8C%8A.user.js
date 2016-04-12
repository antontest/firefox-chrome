// ==UserScript==
// @name        挊
// @namespace   撸
// @description 自动获取磁链接并自动离线下载
// @include     http*://www.avmoo.com/*
// @include     http*://www.avsox.com/*
// @include     http*://www.avmemo.com/*

// @include     http*://*5avlib.com/*
// @include     http*://*look4lib.com/*
// @include     http*://javlib3.com/*
// @include     http*://www.javlibrary.com/*

// @include     http*://www.libredmm.com/products/*
// @include     http*://www.javbus.in/*
// @include     http*://www.javbus.me/*
// @include     http*://avdb.la/movie/*
// @include     http*://www.141jav.com/view/*
// @include     http*://www.av4you.net/work/*.htm
// @include     http*://www.dmmy18.com/*
// @include     http*://pan.baidu.com/disk/home*
// @include     http*://115.com/?tab=offline&mode=wangpan
// @include     http*://cloud.letv.com/webdisk/home/index
// @include     http*://disk.yun.uc.cn/
// @include     http*://www.furk.net/users/files/add
// @include     *.yunpan.360.cn/my/


// @include     http://www.dmm.co.jp/digital/videoa/*


// @include     http://www.btcherry.org/*
// @include     https://btdigg.org/search*


// @version     1.32
// @run-at      document-end
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// ==/UserScript==
var debugging = false;
/*
// @include     https://btdigg.org/search*
// @include     http://www.cilizhushou.com/search/*
// @include     http://www.btava.com/*
// @include     http://www.minnano-av.com/av*
// @include     http://www.oisinbosoft.com/dera/*

*/
var matched_sites = {
    //av信息查询 类
    jav: {
        re: /(avmoo|avsox|avmemo).*movie.*/,
        vid: function() {
            return $('.header')[0].nextElementSibling.innerHTML;
        },
        proc: function(tab) {
            tab.after('#movie-share');
        }
    },
    javlibrary: {
        re: /(javlibrary|javlib3|look4lib|5avlib).*\?v=.*/,
        vid: function() {
            return $('#video_id')[0].getElementsByClassName('text')[0].innerHTML;
        },
        proc: function(tab) {
            tab.after('#video_favorite_edit');
        }
    },
    libredmm: {
        re: /libredmm/,
        vid: function() {
            return location.href.match(/products\/(.*)/)[1];
        },
        proc: function(tab) {
            tab.after('.container');
        }
    },
    dmm: {
        re: /dmm\.co\.jp/,
        vid: function() {
            var result = location.href.replace(/.*cid=/, '').replace(/\/\??.*/, '').match(/[^h_0-9].*/);
            return result[0] ? result[0].replace('00', '') : '';
        },
        proc: function(tab) {
            tab.after('.lh4')
        },
    },
    minnano: {
        re: /minnano-av/,
        vid: function() {
            var elems = $('.t11');
            var r = '';
            for (var i = 0; i < elems.length; i++) {
                if (elems[i].textContent == '品番') {
                    r = elems[i].nextElementSibling.textContent;
                    break;
                }
            }
            return r;
        },
        proc: function(tab) {
            var tmp = (function() {
                var a = $('table');
                for (var i = 0; i < a.length; i++) {
                    if (a[i].bgColor == '#EEEEEE') {
                        return a[i];
                    }
                }
            })();
            tab.after(tmp)
        }
    },
    oisinbosoft: {
        re: /oisinbosoft/,
        vid: function() {
            var r = location.pathname.replace(/.*\/+/, '').replace('.html', '');
            return r.indexOf('-') == r.lastIndexOf('-') ? r : r.replace(/\w*-?/, '');
        },
        proc: function(tab) {
            // add_style('#magnet-tab table{clear:both;}');
            tab.after('#detail_info');
        }
    },
    javbus: {
        re: /javbus/,
        vid: function() {
            var a = $('.header')[0].nextElementSibling;
            return a ? a.textContent : '';
        },
        proc: function(tab) {
            tab.after('.movie')
        }
    },
    avdb: {
        re: /avdb\.la/,
        vid: function() {
            return $('.info')[0].firstElementChild.innerHTML.replace(/<.*>/, '').trim();
        },
        proc: function(tab) {
            tab.after($('#downs')[0].previousElementSibling)
        }
    },
    jav141: {
        re: /141jav/,
        vid: function() {
            return location.href.match(/view\/(.*)\//)[1];
        },
        proc: function(tab) {
            tab.after($('.dlbtn')[0].previousElementSibling)
        },
    },
    av4you: {
        re: /av4you/,
        vid: function() {
            return $('.star-detail-name')[0].textContent.trim();
        },
        proc: function(tab) {
            tab.after('.star-detail')
        }
    },
    dmmy18_sin: {
        re: /dmmy18\.com\/details\.aspx\?id=.*/,
        vid: function() {
            return $('.info li')[0].textContent.replace('番号：', '');
        },
        proc: function(tab) {
            tab.after('.head_coverbanner')
        },
    },
    //网盘下载 类
    //这些 $ 是真正的 jquery
    baidu: {
        re: /pan\.baidu\.com/,
        fill_form: function(magnet) {
            document.querySelector('.g-button[data-button-id=b13]').click();
            setTimeout(function() {
                document.querySelector('#_disk_id_2').click();
                setTimeout(function() {
                    document.querySelector('#share-offline-link').value = magnet;
                    document.querySelector('.g-button[data-button-id=b63]').click();
                }, 500)
            }, 1500);
        }
    },
    115: {
        re: /115\.com/,
        fill_form: function(link) {
            var rsc = setInterval(function() {
                if (document.readyState == 'complete') {
                    clearInterval(rsc);
                    setTimeout(function() {
                        Core['OFFL5Plug'].OpenLink();
                        setTimeout(function() {
                            $('#js_offline_new_add').val(link);
                        }, 300);
                    }, 1000);
                }
            }, 400);
        }
    },
    letv: {
        re: /cloud\.letv\.com/,
        fill_form: function(link) {
            setTimeout(function() {
                $('#offline-btn').click();
                setTimeout(function() {
                    $('#offline_clear_complete').prev().click();
                    setTimeout(function() {
                        $('#offline-add-link').val(link);
                    }, 500);
                }, 1000);
            }, 2000);
        }
    },
    furk: {
        re: /www\.furk\.net/,
        fill_form: function(link) {
            setTimeout(function() {
                $('#url').val(link.replace('magnet:?xt=urn:btih:', ''));
            }, 1500);
        }
    },
    360: {
        re: /yunpan\.360\.cn\/my/,
        fill_form: function(link) {
            yunpan.cmdCenter.showOfflineDia();
            setTimeout(function() {
                $('.offdl-btn-create').click();
                setTimeout(function() {
                    $('#offdlUrl').val(link);
                }, 500);
            }, 1000);
        }
    },
    uc: {
        re: /disk\.yun\.uc\.cn\//,
        fill_form: function(link) {
            setTimeout(function() {
                $('#newuclxbtn_index').click();
                setTimeout(function() {
                    $('#uclxurl').val(link);
                }, 1000);
            }, 1200);
        }
    },
    //磁链接搜索 类
    btcherry_a: {
        re: /btcherry\.org\/search\?keyword=.*/,
        func: function(tab) {
            var selector = '.r div a';
            var a = $(selector);
            for (var i = 0; i < a.length; i++) {
                var b = tab.cloneNode(true);
                b.setAttribute('maglink', a[i].href)
                    //console.log(a[i].href)
                a[i].parentElement.appendChild(b)
            }
        },
    },
    btcherry_b: {
        re: /btcherry\.org\/hash\/.*/,
        func: function(tab) {
            var selector = '#content div ul';
            var a = $(selector)[0];
            tab.setAttribute('maglink', $('li a', a)[0])
            a.parentElement.insertBefore(tab, a)
        },
    },
    btdigg: {
        re: /btdigg\.org\/search/,
        func: function(tab) {
            console.log($('#search_res'))
            if ($('#search_res').length!=0) {//搜索页面
                console.log(3)
                var selector = '.snippet';
                var a = $(selector);
                for (var i = 0; i < a.length; i++) {
                    var b = tab.cloneNode(true);
                    //console.log($('.ttth a',a[i].previousElementSibling)[0]))
                    b.setAttribute('maglink', $('.ttth a', a[i].previousElementSibling)[0].href);
                    a[i].parentElement.appendChild(b);
                };
            }
            else if ($('.torrent_info_tbl').length!=0) {//详情页面
                console.log(1)
                var selector = '.torrent_info_tbl';
                var a = $(selector)[0];
                tab.setAttribute('maglink', $('a', a)[1].href);
                a.parentElement.insertBefore(tab, a);
            }

        },
    },
    // cilizhushou_a: {
    //     re: /cilizhushou/,
    //     func: function(div) {
    //         $xafter('.tail', div, function(elem) {
    //             return elem.getElementsByTagName('a')[0].href;
    //         });
    //     },
    // },
    // // shousibaocai_single: {
    // //   re: '',
    // //   func: '',
    // // },
    // btava_a: {
    //     re: /search\//,
    //     func: function(div) {
    //         $xafter('.data-list .date', div, function(elem) {
    //             return 'magnet:?xt=urn:btih:' + elem.parentElement.getElementsByTagName('a')[0].href.match(/hash\/(.*)/)[1];
    //         });
    //     },
    // },
    // btava_single: {
    //     re: /magnet\/detail\/hash\//,
    //     func: function(div) {
    //         div.setAttribute('data', $('#magnetLink')[0].value);
    //         common.after($('#magnetLink')[0], div);
    //     },
    // },
    // // instsee_a:{
    // //   re: /^http:\/\/www\.instsee.com\/$|instsee\.com\/default.aspx.*/,
    // //   func: function(div){
    // //   }
    // // },
    // demo: {
    //     re: /.*/,
    //     vid: function() {
    //         return 'demo'
    //     },
    //     proc: function(table) {
    //         common.after(document.body, table);
    //     }
    // },
};





var $ = function(selector, context) {
    if (context) {
        return context.querySelectorAll(selector);
    }
    return document.querySelectorAll(selector);
};

var offline_sites = {
    baidu: {
        url: 'http://pan.baidu.com/disk/home',
        name: '百度云',
        enable: true
    },
    115: {
        name: '115离线',
        url: 'http://115.com/?tab=offline&mode=wangpan',
        enable: true,
    },
    letv: {
        name: '乐视云',
        url: 'http://cloud.letv.com/webdisk/home/index',
        enable: false
    },
    360: {
        name: '360云',
        url: 'http://yunpan.360.cn/my/',
        enable: true
    },
    uc: {
        name: 'UC离线',
        url: 'http://disk.yun.uc.cn/',
        enable: true
    },
    furk: {
        name: 'Furk',
        url: 'https://www.furk.net/users/files/add',
        enable: true
    },
};
var common = {
    add_style: function(css) {
        if (css) {
            GM_addStyle(css);
        }
        else {
            GM_addStyle([
                '#nong-table{margin:10px auto;color:#666 !important;font-size:13px;text-align:center;background-color: #F2F2F2;}',
                '#nong-table th,#nong-table td{text-align: center;height:30px;background-color: #FFF;padding:0 1em 0;border: 1px solid #EFEFEF;}',
                '.nong-row{text-align: center;height:30px;background-color: #FFF;padding:0 1em 0;border: 1px solid #EFEFEF;}',
                '.nong-copy{color:#08c !important;}',
                '.nong-offline{text-align: center;}',
                '.nong-offline-download{color: rgb(0, 180, 30) !important; margin-right: 4px !important;}',
                '.nong-offline-download:hover{color:red !important;}',
            ].join(''));
        }
    },
    handle_event: function(event) {
        if (event.target.className == 'nong-copy') {
            event.target.innerHTML = '成功';
            GM_setClipboard(event.target.href);
            setTimeout(function() {
                event.target.innerHTML = '复制';
            }, 1000);
            event.preventDefault(); //阻止跳转
        }
        else if (event.target.className == 'nong-offline-download') {

            var maglink = event.target.parentElement.parentElement.getAttribute('maglink') || event.target.parentElement.parentElement.parentElement.getAttribute('maglink')

            GM_setValue('magnet', maglink);
        }
        else if (event.target.id == 'nong-search-select') {
            current_search_name = event.target.value;
            GM_setValue('search', current_search_name);
            search_engines[current_search_name](current_vid, function(src, data) {
                magnet_table.updata_table(src, data);
            });
        }
    },
    reg_event: function() { //TODO target 处理 更精准
        var list = [
            '.nong-copy',
            '.nong-offline-download'
        ];
        for (var i = 0; i < list.length; i++) {
            var a = document.querySelectorAll(list[i]);
            for (var u = 0; u < a.length; u++) {
                a[u].addEventListener('click', this.handle_event, false);
            }
        }
        // var b = document.querySelectorAll('#nong-search-select')[0];
        // b.addEventListener('change', this.handle_event, false);

    },
    after: function(target, newnode) {
        target.parentElement.insertBefore(newnode, target.nextElementSibling);
    },
    parsetext: function(text) {
        var doc = null;
        try {
            doc = document.implementation.createHTMLDocument('');
            doc.documentElement.innerHTML = text;
            return doc;
        }
        catch (e) {
            alert('parse error');
        }
    },
    insert_js: function(js, maglink) {
        var script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.innerHTML = '(' + js.toString() + ')(\'' + maglink + '\')';
        document.body.appendChild(script);
    },
    add_mini_table: function(sel, func) {
        var a = $(sel);
        for (var i = a.length - 1; i >= 0; i--) {
            a[i].parentElement.insertBefore(a[i], magnet_table.mini()); //TODO
            func(a[i]);
        }
    },
};
var magnet_table = {
    template: {
        create_head: function() {
            var a = document.createElement('tr');
            a.className = 'nong-row';
            a.id = 'nong-head';
            var list = [
                '标题',
                '大小',
                '操作',
                '离线下载'
            ];
            for (var i = 0; i < list.length; i++) {
                var b = this.head.cloneNode(true);
                b.firstChild.textContent = list[i];
                a.appendChild(b);
            }
            // var select_box = this.create_select_box();
            // a.firstChild.appendChild(select_box);

            return a;
        },
        create_row: function(data) {
            var a = document.createElement('tr');
            a.className = 'nong-row';
            a.setAttribute('maglink', data.maglink);
            var b = document.createElement('td');
            var list = [
                this.create_info(data.title, data.maglink),
                this.create_size(data.size),
                this.create_operation(data.maglink),
                this.create_offline()
            ];
            for (var i = 0; i < list.length; i++) {
                var c = b.cloneNode(true);
                c.appendChild(list[i]);
                a.appendChild(c);
            }
            return a;
        },
        create_loading: function() {
            var a = document.createElement('tr');
            a.className = 'nong-row';
            var p = document.createElement('p');
            p.textContent = 'Loading';
            p.id = 'notice';
            a.appendChild(p);
            return a;
        },
        create_info: function(title, maglink) {
            var a = this.info.cloneNode(true);
            a.firstChild.textContent = title.length < 20 ? title : title.substr(0, 20) + '...';
            a.firstChild.href = maglink;
            a.title = title;
            return a;
        },
        create_size: function(size) {
            var a = this.size.cloneNode(true);
            a.textContent = size;
            return a;
        },
        create_operation: function(maglink) {
            var a = this.operation.cloneNode(true);
            a.firstChild.href = maglink;
            return a;
        },
        create_offline: function() {
            var a = this.offline.cloneNode(true);
            a.className = 'nong-offline';
            return a;
        },
        create_select_box: function() {
            var select_box = document.createElement('select');
            select_box.id = 'nong-search-select';
            select_box.setAttribute('title', '切换搜索结果');
            var search_name = GM_getValue('search', default_search_name);
            for (var k in search_engines) {
                var o = document.createElement('option');
                if (k == search_name) {
                    o.setAttribute('selected', 'selected');
                }
                o.setAttribute('value', k);
                o.textContent = k;
                select_box.appendChild(o);
            }
            return select_box;
        },
        head: (function() {
            var a = document.createElement('th');
            var b = document.createElement('a');
            a.appendChild(b);
            return a;
        })(),
        info: (function() {
            var a = document.createElement('div');
            var b = document.createElement('a');
            b.textContent = 'name';
            b.href = 'src';
            a.appendChild(b);
            return a;
        })(),
        size: function() {
            var p = document.createElement('p');
            p.textContent = 'size';
            return p;
        }(),
        operation: (function() {
            var a = document.createElement('div');
            var copy = document.createElement('a');
            copy.className = 'nong-copy';
            copy.textContent = '复制';
            a.appendChild(copy);
            return a;
        })(),
        offline: (function() {
            var a = document.createElement('div');
            var b = document.createElement('a');
            b.className = 'nong-offline-download';
            b.target = '_blank';
            for (var k in offline_sites) {
                if (offline_sites[k].enable) {
                    var c = b.cloneNode(true);
                    c.href = offline_sites[k].url;
                    c.textContent = offline_sites[k].name;
                    a.appendChild(c);
                }
            }
            return a;
        })(),
    },
    create_empty_table: function() {
        var a = document.createElement('table');
        a.id = 'nong-table';
        return a;
    },
    updata_table: function(src, data, type) {
        // console.log(data);
        if (type == 'full') {
            var tab = $('#nong-table')[0];
            var a = tab.querySelectorAll('.nong-row');
            for (var i = 0; i < a.length; i++) {
                if (a[i].id == 'nong-head') {
                    continue;
                }
                tab.removeChild(a[i]);
            }
            for (var i = 0; i < data.length; i++) {
                tab.appendChild(this.template.create_row(data[i]));
            }

        }
        // else if(type =='mini'){
        // }
        common.reg_event();
    },
    full: function(src, data) {
        var tab = this.create_empty_table();
        tab.appendChild(this.template.create_head());
        // for (var i = 0; i < data.length; i++) {
        //     tab.appendChild(this.template.create_row(data[i]))
        // }
        var loading = this.template.create_loading();
        tab.appendChild(loading);
        return tab;
    },
    mini: function(data) {
        var tab = this.create_empty_table();
        tab.appendChild(this.template.create_offline());
        return tab;
    }
};
var extend_tab = function(target) {
    this.target = target
};
extend_tab.prototype.after = function(selector) {
    var a = null
    if (typeof selector === 'string') {
        var a = $(selector)[0]
    }
    else {
        a = selector;
    }
    console.log(a, selector)
    var parent = a.parentElement;
    if (parent.lastChild === a) {
        parent.appendChild(this.target);
    }
    else {
        parent.insertBefore(this.target, a.nextSibling);
    }
};
extend_tab.prototype.setmaglink = function(maglink) {
    this.target.setAttribute('maglink', maglink)
};
extend_tab.prototype.appendTo = function(selector) {
    selector.appendChild(this.target)
}

var search_engines = {
    bt2mag: function(kw, cb) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'http://www.btaia.com/search/' + kw,
            onload: function(result) {
                var doc = common.parsetext(result.responseText)
                if (!doc) {
                    //TODO
                }
                var data = [];
                var t = doc.getElementsByClassName('data-list')[0];
                if (t) {
                    var a = t.getElementsByTagName('a');
                    for (var i = 0; i < a.length; i++) {
                        if (!a[i].className.match('btn')) {
                            data.push({
                                'title': a[i].title,
                                'maglink': 'magnet:?xt=urn:btih:' + a[i].outerHTML.replace(/.*hash\//, '').replace(/" .*\n.*\n.*\n.*/,''), 
                                'size': a[i].nextElementSibling.textContent
                                    //'src':'' TODO
                            });
                        }
                    }
                }
                cb(result.finalUrl, data);
            },
            onerror: function(e) {
                console.log(e);
            }
        })
    },
    diggbt: function(kw, cb) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: this.url,
            data: 's=' + kw,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            onload: function(result) {
                var trick = function(str) {
                    var t = document.createElement('a');
                    t.outerHTML = str.match(/document.write\(\'(.*)\'\)/)[1].split('\'+\'').join('');
                    return t.href;
                }
                var doc = document.implementation.createHTMLDocument('');
                doc.documentElement.innerHTML = result.responseText;
                var data = [];
                var t = doc.getElementsByClassName('list-con')[0];
                if (t) {
                    var elems = t.getElementsByClassName('item-title');
                    for (var i = 0; i < elems.length; i++) {
                        data.push({
                            'title': elems[i].getElementsByTagName('a')[0].textContent,
                            'magnet': trick(elems[i].nextElementSibling.getElementsByTagName('script')[0].innerHTML),
                            'size': elems[i].nextElementSibling.getElementsByTagName('b')[1].textContent
                        });
                    }
                    cb(result.finalUrl, data);
                }
            },
            onerror: function(e) {
                console.log(e);
            }
        });
    },
    btlibrary: function(kw, cb) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: this.url,
            data: 's=' + kw,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            onload: function(result) {
                var doc = document.implementation.createHTMLDocument('');
                doc.documentElement.innerHTML = result.responseText;
                var data = [];
                var t = doc.getElementsByClassName('list-content')[0];
                if (t) {
                    var elems = t.getElementsByClassName('item-title');
                    for (var i = 0; i < elems.length; i++) {
                        data.push({
                            'title': elems[i].getElementsByTagName('a')[0].textContent,
                            'magnet': elems[i].nextElementSibling.getElementsByTagName('a')[0].href,
                            'size': elems[i].nextElementSibling.getElementsByTagName('b')[1].textContent
                        });
                    }
                    cb(result.finalUrl, data);
                }
            },
            onerror: function(e) {
                console.log(e);
            }
        });
    },
    demo: function(kw, cb) {
        var data = [];
        var r = 0;
        for (var i = 0; i < 10; i++) {
            r = Math.round(Math.random() * 100)
            data.push({
                title: r + 'title',
                maglink: r + 'maglink',
                size: r + 'size'
            })
        }
        cb(data);
    },
};
var test = {
    cb_search: function(src, data) {
        // body...
    },
    search: function() {
        var vid = '';
        for (var k in search_engines) {
            search_engines[k](vid, function() {
                console.log(k, src, data); //?????作用域
            });
        }
    },
};
var current_vid = ''
var current_search_name = 'bt2mag'; //GM_getValue('search', default_search_name);
var run = function() {
    common.add_style();
    if (!debugging) {
        for (var key in matched_sites) {
            if (matched_sites[key].re.test(location.href)) {
                if (matched_sites[key].proc) {

                    var newtab = new extend_tab(magnet_table.full())
                    matched_sites[key].proc(newtab);
                    current_vid = matched_sites[key].vid();
                    if (!current_vid) {
                        $('#notice').textContent = 'Can\'t match vid';
                    }
                    search_engines[current_search_name](current_vid, function(src, data) {
                        if (data.length == 0) {
                            $('#nong-table')[0].querySelectorAll('#notice')[0].textContent = 'No search result';
                        }
                        else {
                            magnet_table.updata_table(src, data, 'full');
                        }
                    });
                }
                else if (matched_sites[key].fill_form) {
                    var js = matched_sites[key].fill_form;
                    var maglink = GM_getValue('magnet');
                    if (maglink) {
                        common.insert_js(js, maglink);
                        GM_setValue('magnet', '')
                    }
                }
                else if (matched_sites[key].func) {
                    //var newtab = new extend_tab(magnet_table.mini())
                    console.log(matched_sites[key]);
                    matched_sites[key].func(magnet_table.mini());
                    magnet_table.updata_table('', '', 'mini');
                }
                break;
            }
        }
    }
    else {
        var key = 'demo';
        // current_key = key;
        search_engines.demo(matched_sites[key].vid(), function(data) {
            var table = magnet_table.full(data);
            matched_sites[key].proc(table);
            common.reg_event();
        })
    };
};
run();