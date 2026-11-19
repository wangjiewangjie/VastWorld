// hikermovie v21 — 仅 Omofun / 樱花动漫，海阔 lazyRule 播放
var RULE_JSON = 'hiker://files/rules/xyq/hikermovie.json';
// 兼容旧「更新规则」仍在找 v20-anime2 字样
var RULE_VER = 'v21-anime2'; // v20-anime2
// 不用 jsDelivr @main：CDN 会缓存旧版（曾把 67KB 老规则盖掉 25KB 新规则）
var RULE_BASES = [
    'https://gitee.com/jiewangjiewang/the-vast-world-of-the-sea/raw/master/',
    'https://gitee.com/jiewangjiewang/the-vast-world-of-the-sea/raw/main/',
    'https://raw.githubusercontent.com/wangjiewangjie/VastWorld/main/',
    'https://ghfast.top/https://raw.githubusercontent.com/wangjiewangjie/VastWorld/main/'
];
var COOKIE_DIR = 'hiker://files/rules/xyq/xqyscookie/';

// ---------- 站点表（抓取 + 布局配置）----------
var SITES = {
    omofun: {
        title: 'Omofun动漫',
        host: 'https://www.omofuna.com',
        cate: '{host}/type/{id}-fypage.html[firstPage={host}/type/{id}.html]',
        search: '{host}/search/{wd}----------fypage---.html',
        needCookie: true,
        list: 'body&&.daFJ_dJJfFHa&&li||body&&ul.daFJ_dJJfFHa&&li',
        img: 'a&&data-original||.lazyload&&data-original||img&&data-original||img&&src',
        title: 'a&&title||h4&&a&&Text||a&&Text',
        desc: '.aaE_EaDE&&Text||.aaE_EaDEa&&Text||span&&Text',
        url: 'a&&href',
        tabs: 'body&&.channel-tab&&li',
        conts: 'body&&.play-list-content',
        play: 'aaaa'
    },
    vtt6: {
        title: '樱花动漫',
        host: 'https://www.vtt6.com',
        cate: '{host}/type/{id}/fypage/[firstPage={host}/type/{id}/]',
        search: '{host}/search/?wd={ewd}',
        // 首页/分类 .main；搜索页是 .search（无 .main）
        list: 'body&&.main&&ul&&li||body&&.search&&ul&&li||body&&.main&&li||body&&.search&&li',
        img: '.lazy&&data-original||img&&data-original||img&&data-src||img&&src',
        title: 'a&&title||img&&alt||h3&&a&&Text||a&&Text',
        desc: '.txt&&p&&Text||p&&Text||.bofang&&Text',
        url: 'a&&href',
        tabs: 'body&&.playlist&&.tabs&&a',
        conts: 'body&&.playlist&&.row',
        play: 'sniff'
    }
};

// ---------- 工具 ----------
function logErr(tag, e) {
    var msg = '';
    try { msg = (e && (e.message || e.toString())) || (e + ''); } catch (e2) { msg = 'error'; }
    try { log('[hikermovie][' + tag + '] ' + msg); } catch (e3) {}
    return msg;
}

function errItem(tag, e) {
    return { title: '报错 · ' + tag + ' · ' + logErr(tag, e), url: 'hiker://empty', col_type: 'long_text' };
}

function fillTpl(tpl, vars) {
    var out = tpl || '';
    for (var k in vars) out = out.split('{' + k + '}').join(vars[k] == null ? '' : vars[k]);
    return out;
}

function absUrl(url, base) {
    if (!url) return '';
    if (/^https?:/i.test(url) || url.indexOf('hiker') == 0) return url;
    return (base || '') + url;
}

function imgUrl(img, host) {
    if (!img) return '';
    img = absUrl(img, host);
    return img + '@Referer=' + (host || img);
}

function firstPdfa(html, sel) {
    if (!html || !sel) return [];
    var parts = (sel + '').split('||');
    for (var i = 0; i < parts.length; i++) {
        try {
            var arr = pdfa(html, parts[i].replace(/^\s+|\s+$/g, ''));
            if (arr && arr.length) return arr;
        } catch (e) {}
    }
    return [];
}

function firstPdfh(html, sel) {
    if (!html || !sel) return '';
    var parts = (sel + '').split('||');
    for (var i = 0; i < parts.length; i++) {
        try {
            var v = pdfh(html, parts[i].replace(/^\s+|\s+$/g, ''));
            if (v) return v;
        } catch (e) {}
    }
    return '';
}

function pageNum(raw) {
    var s = String(raw == null ? '1' : raw).replace(/fypage/gi, '1');
    var n = parseInt(s, 10);
    return (isNaN(n) || n < 1) ? 1 : n;
}

// 展开 cate 模板：[firstPage=...] 仅第 1 页使用
function cateUrl(site, host, id, page) {
    var tpl = site.cate || '';
    var first = '';
    var m = tpl.match(/\[firstPage=(.*?)\]/);
    if (m) {
        first = m[1];
        tpl = tpl.replace(/\[firstPage=.*?\]/, '');
    }
    var vars = { host: host, id: id };
    if (page <= 1 && first) return fillTpl(first, vars);
    return fillTpl(tpl, vars).replace(/fypage/g, String(page));
}

function getSite(key) {
    return SITES[key] || null;
}

function loadJsonSites() {
    try {
        var json = JSON.parse(fetch(RULE_JSON, {}));
        return ((json.data || [])[0] || {}).list || [];
    } catch (e) {
        return [];
    }
}

function fetchPage(url, host, cookie) {
    var headers = { 'User-Agent': MOBILE_UA, 'Referer': (host || url) + '/' };
    if (cookie) headers.Cookie = cookie;
    try {
        return fetch(url, { headers: headers, timeout: 12000 }) || '';
    } catch (e) {
        try { return request(url) || ''; } catch (e2) { return ''; }
    }
}

function parseList(html, site, host) {
    var items = firstPdfa(html, site.list);
    var out = [];
    for (var i = 0; i < items.length; i++) {
        var title = firstPdfh(items[i], site.title);
        var img = firstPdfh(items[i], site.img);
        var desc = firstPdfh(items[i], site.desc);
        var href = '';
        try { href = pd(items[i], site.url.split('||')[0]); } catch (e) {}
        if (!href) href = firstPdfh(items[i], site.url);
        if (!href || /javascript:/i.test(href)) continue;
        if (!title) continue;
        // 丢掉导航分类链（保留 /detail/ /anime/ /play/）
        var full = absUrl(href, host);
        if (/\/(type|show|label|mangatype|arttype)\//i.test(full) && !/\/(detail|anime|video|vod|play)\//i.test(full)) continue;
        out.push({
            title: title,
            img: absUrl(img, host),
            desc: desc,
            url: absUrl(href, host)
        });
    }
    return out;
}

function pushCards(d, list, host, col) {
    for (var i = 0; i < list.length; i++) {
        var v = list[i];
        d.push({
            title: v.title,
            desc: v.desc || '',
            pic_url: v.img ? imgUrl(v.img, host) : '',
            url: $(v.url).rule((name) => {
                eval(fetch('hiker://files/rules/xyq/hikermovie.js'));
                omerj(name);
            }, v.title),
            col_type: v.img ? (col || 'movie_3_marquee') : 'text_center_1',
            extra: { key: v.title }
        });
    }
}

// Omofun 搜索验证
function omofunCookie(host, probe) {
    try {
        var opt = { headers: { 'User-Agent': MOBILE_UA, 'Referer': host + '/' }, timeout: 10000 };
        fetch(host + '/', opt);
        var html = fetch(probe || (host + '/search/a----------1---.html'), opt);
        var cok = '';
        try { cok = getCookie(host) || ''; } catch (e) {}
        if (!/系统安全验证|因访问过多|继续访问|function\s+refresh/.test(html || '')) return cok;
        var scripts = (html || '').match(/<script>([\s\S]*?)<\/script>/g);
        if (!scripts || !scripts.length) return '';
        var code = scripts[scripts.length - 1].replace(/<\/?script>/gi, '');
        if (code.indexOf('refresh') < 0) return '';
        var token = '';
        (function () {
            var $ = function (x) {
                if (typeof x == 'function') { try { x(); } catch (e) {} return $; }
                return {
                    focus: function () { return this; },
                    bind: function () { return this; },
                    click: function () { return this; },
                    val: function (v) { if (v != null) token = v; return token; }
                };
            };
            eval(code);
            try { refresh(); } catch (e) {}
        })();
        if (!token) return cok;
        fetch(host + '/search/index.php?searchtype=5&tid=&page=1&submit=&keyword=a', {
            headers: { 'User-Agent': MOBILE_UA, 'Referer': host + '/', 'Cookie': cok },
            body: 'validate=' + token,
            method: 'POST',
            timeout: 10000
        });
        try { cok = getCookie(host) || cok; } catch (e) {}
        return cok;
    } catch (e) {
        logErr('omofunCookie', e);
        return '';
    }
}

// ---------- 首页 ----------
function hikhmrule() {
    var res = { data: [] };
    var d = res.data;
    try {
        d.push({
            title: '引擎 ' + RULE_VER + ' · Omofun / 樱花',
            url: 'hiker://empty',
            col_type: 'text_center_1'
        });
        var kw = getMyVar('xyqxqystext', '');
        d.push({
            title: '搜索',
            url: $.toString(() => {
                return $('hiker://empty#noRecordHistory#$$$' + RULE_JSON + '$$$' + input + '$$$fypage$$$').rule(() => {
                    eval(fetch('hiker://files/rules/xyq/hikermovie.js'));
                    hiksearch();
                });
            }),
            extra: { onChange: "putMyVar('xyqxqystext',input)", defaultValue: kw, titleVisible: true },
            col_type: 'input'
        });
        d.push({
            title: '聚合搜索',
            url: $('#noLoading#').lazyRule(() => {
                var w = getMyVar('xyqxqystext', '');
                if (!w) return 'toast://请先输入关键词';
                return $('hiker://empty#noRecordHistory#$$$' + RULE_JSON + '$$$' + w + '$$$fypage$$$').rule(() => {
                    eval(fetch('hiker://files/rules/xyq/hikermovie.js'));
                    hiksearch();
                });
            }),
            col_type: 'flex_button'
        });
        d.push({
            title: '更新规则',
            url: $('#noLoading#').lazyRule((bases, ver) => {
                var dir = 'hiker://files/rules/xyq/';
                var opt = { headers: { 'User-Agent': MOBILE_UA, 'Cache-Control': 'no-cache' }, timeout: 8000 };
                var logs = [];
                for (var i = 0; i < bases.length; i++) {
                    try {
                        var js = fetch(bases[i] + 'hikermovie.js?t=' + Date.now(), opt) || '';
                        var jn = fetch(bases[i] + 'hikermovie.json?t=' + Date.now(), opt) || '';
                        var jsOk = js && js.indexOf(ver) >= 0 && js.indexOf('pageNum') >= 0 && js.length < 45000 && !/旺旺影视|wwgz\.cn/.test(js);
                        var jnOk = jn && jn.indexOf('vodhref') >= 0;
                        logs.push((i + 1) + ':' + (js ? js.length : 0) + (jsOk ? '+js' : '') + (jnOk ? '+json' : ''));
                        if (!jsOk || !jnOk) continue;
                        writeFile(dir + 'hikermovie.js', js);
                        writeFile(dir + 'hikermovie.json', jn);
                        var check = fetch(dir + 'hikermovie.js') || '';
                        if (check.indexOf(ver) < 0) return 'toast://写入校验失败';
                        refreshPage(false);
                        return 'toast://已更新 ' + ver + ' (' + js.length + 'B)';
                    } catch (e) {
                        logs.push((i + 1) + ':err');
                    }
                }
                return 'toast://更新失败 ' + ver + ' · ' + logs.join(' | ') + ' · 可开电脑 8765 或重装预处理';
            }, RULE_BASES, RULE_VER),
            col_type: 'flex_button'
        });
        d.push({ col_type: 'line' });

        var sites = loadJsonSites();
        if (!sites.length) {
            sites = [
                { title: 'Omofun动漫', key: 'omofun', url: SITES.omofun.host, vodtype: '日漫&国漫&动画&剧场&特摄&美漫', vodhref: '1&2&5&24&4&3' },
                { title: '樱花动漫', key: 'vtt6', url: SITES.vtt6.host, vodtype: '国产动漫&日本动漫&欧美动漫&动漫电影', vodhref: 'guoman&riman&oman&dmfilm' }
            ];
        }
        for (var i = 0; i < sites.length; i++) {
            var s = sites[i];
            var key = s.key || ( /omo/i.test(s.url || '') ? 'omofun' : 'vtt6');
            d.push({
                title: s.title || key,
                img: (s.ico || '') + '@Referer=',
                // 只用站点 key，避免把 http URL 塞进 MY_URL
                url: 'hiker://empty#noRecordHistory#$$' + key + '$$fypage$$' + (s.vodtype || '') + '$$' + (s.vodhref || ''),
                col_type: 'icon_2_card'
            });
        }
    } catch (e) {
        d.push(errItem('home', e));
    }
    setHomeResult(res);
}

// ---------- 站点页：分类 + 列表 ----------
function hikhmerj() {
    var res = { data: [] };
    var d = res.data;
    try {
        // MY_URL: hiker://empty#...$$key$$页码$$vodtype$$vodhref
        // 注意：未翻页时 parts[2] 可能仍是字面量 "fypage"
        var parts = MY_URL.split('$$');
        var key = parts[1] || '';
        var pn = pageNum(parts[2]);
        var vtype = parts[3] || '';
        var vhref = parts[4] || '';
        var site = getSite(key);
        if (!site) {
            d.push({ title: '未知站点: ' + key, col_type: 'text_center_1' });
            setHomeResult(res);
            return;
        }
        var host = site.host;
        var types = vtype.split('&');
        var ids = vhref.split('&');
        if (pn == 1) {
            for (var i = 0; i < types.length; i++) {
                if (!types[i] || !ids[i]) continue;
                var cate = fillTpl(site.cate, { host: host, id: ids[i] });
                d.push({
                    title: types[i],
                    url: $(cate).rule((k) => {
                        eval(fetch('hiker://files/rules/xyq/hikermovie.js'));
                        clsrule(k);
                    }, key),
                    col_type: 'scroll_button'
                });
            }
            if (types.length) d.push({ col_type: 'line' });
        }

        var html = '';
        var list = [];
        if (pn == 1) {
            html = fetchPage(host + '/', host);
            list = parseList(html, site, host);
        }
        // 首页拉空 / 翻页：用第一个分类兜底
        if (!list.length && ids[0]) {
            var fallback = cateUrl(site, host, ids[0], pn);
            html = fetchPage(fallback, host);
            list = parseList(html, site, host);
        }
        if (!list.length) {
            d.push({
                title: '暂无列表 · 可点上方分类重试 · html=' + ((html || '').length),
                url: host + '/',
                col_type: 'text_center_1'
            });
        } else {
            pushCards(d, list, host, 'movie_3_marquee');
        }
    } catch (e) {
        d.push(errItem('site', e));
    }
    setHomeResult(res);
}

function clsrule(key) {
    var res = { data: [] };
    var d = res.data;
    try {
        key = key || '';
        var site = getSite(key);
        if (!site) site = getSite('omofun');
        var host = site.host;
        var html = '';
        try { html = getResCode() || ''; } catch (e) {}
        if (!html) html = fetchPage(MY_URL, host);
        try { refreshX5WebView(''); } catch (e) {}
        var list = parseList(html, site, host);
        if (!list.length) {
            d.push({
                title: '分类无数据 · html=' + ((html || '').length),
                url: MY_URL,
                col_type: 'text_center_1'
            });
        } else {
            pushCards(d, list, host, 'movie_3_marquee');
        }
    } catch (e) {
        d.push(errItem('cate', e));
    }
    setHomeResult(res);
}

// ---------- 详情 + 选集（海阔播放器 lazyRule）----------
function playLazy(host, link, title, playType) {
    return $('hiker://empty#' + host + '#' + link + '#' + title + '#' + playType).lazyRule(() => {
        eval(fetch('hiker://files/rules/xyq/hikermovie.js'));
        return omlazy();
    });
}

function omerj(movTitle) {
    var res = { data: [] };
    var d = res.data;
    try {
        if (!movTitle) {
            try { movTitle = MOVtitle; } catch (e) { movTitle = ''; }
        }
        movTitle = movTitle || '';
        try { refreshX5WebView(''); } catch (e) {}

        d.push({
            title: '搜索「' + movTitle + '」',
            url: $('hiker://empty#noHistory#$$$' + RULE_JSON + '$$$' + movTitle + '$$$fypage$$$').rule(() => {
                eval(fetch('hiker://files/rules/xyq/hikermovie.js'));
                hiksearch();
            }),
            col_type: 'flex_button',
            extra: { pageTitle: '搜索' }
        });

        var host = '';
        try {
            var m = (MY_URL + '/').match(/([\S]*?:\/\/[\S]*?)\//);
            host = m ? m[1] : '';
        } catch (e) {}
        var site = /omofuna|omofun/i.test(host) ? SITES.omofun : (/vtt6/i.test(host) ? SITES.vtt6 : null);
        if (!site) {
            // 按 host 匹配
            for (var k in SITES) {
                if (host.indexOf(SITES[k].host.replace(/^https?:\/\//, '')) != -1) {
                    site = SITES[k];
                    break;
                }
            }
        }
        if (!site) site = SITES.omofun;

        var html = '';
        try { html = (getResCode() || '').replace(/<!--([\S\s]*?)-->/g, ''); } catch (e) {}
        if (!html) html = fetchPage(MY_URL, host);

        var tabs = firstPdfa(html, site.tabs);
        var conts = firstPdfa(html, site.conts);
        var ep = 0;
        for (var i = 0; i < conts.length; i++) {
            var list = [];
            try {
                if (/<li/.test(conts[i])) list = pdfa(conts[i], 'body&&li');
                else list = pdfa(conts[i], 'body&&a');
            } catch (e) {}
            if (!list || !list.length) continue;

            var tabName = '线路' + (i + 1);
            if (tabs[i]) {
                try { tabName = pdfh(tabs[i], 'a&&Text||body&&Text') || tabName; } catch (e) {}
            }
            d.push({
                title: tabName + ' · ' + list.length + ' 集',
                url: 'hiker://empty',
                col_type: 'text_1'
            });

            for (var j = 0; j < list.length; j++) {
                var t = '';
                var link = '';
                try { t = pdfh(list[j], 'a&&Text||body&&Text') || ''; } catch (e) {}
                try { link = pd(list[j], 'a&&href'); } catch (e) {}
                if (!link) try { link = pdfh(list[j], 'a&&href'); } catch (e) {}
                if (!link || /javascript:/i.test(link)) continue;
                link = absUrl(link, host);
                try {
                    if (t && t.match(/(第|\d|-)*(集|话|期)/g)) t = t.replace(/第|集|话|期/g, '');
                } catch (e) {}
                d.push({
                    title: t || ('第' + (j + 1)),
                    url: playLazy(host, link, t || movTitle, site.play),
                    col_type: list.length <= 4 ? 'text_2' : (isNaN(t) ? 'flex_button' : 'text_5'),
                    extra: {
                        id: host + '#' + link,
                        blockRules: ['.css', '.gif', '.png', '.ico', 'cnzz', 'hm.baidu.com', '/ads/*.js'],
                        referer: host
                    }
                });
                ep++;
            }
        }
        if (!ep) {
            d.push({ title: '未解析到选集，打开原网页', url: MY_URL, col_type: 'text_center_1' });
        }
    } catch (e) {
        d.push(errItem('detail', e));
    }
    setHomeResult(res);
}

// ---------- 播放：返回直链给海阔播放器 ----------
function omlazy() {
    // input: hiker://empty#host#playUrl#title#playType
    var raw = (input || '').replace(/^hiker:\/\/empty#/, '');
    var parts = raw.split('#');
    var host = parts[0] || '';
    var src = parts[1] || '';
    var playType = parts[3] || '';
    try {
        if (!src) return 'toast://无播放地址';
        if (/\/share\//.test(src)) {
            var link = src.split('/share')[0];
            var fc = fetch(src, {}).replace('var purl', 'var main');
            var play = '';
            if (fc.indexOf('main') != -1) {
                eval(fc.match(/var main.*?;/)[0]);
                play = main.indexOf('http') != -1 ? main : link + main;
            } else {
                var u2 = fc.match(/url:.*?[\'\"](.*?)[\'\"]/)[1];
                play = u2.indexOf('http') != -1 ? u2 : link + u2;
            }
            return play + '#isVideo=true#';
        }

        var html = fetchPage(src, host);
        // MacCMS player_aaaa（Omofun）
        var m = html.match(/var\s+player_aaaa\s*=\s*(\{[\s\S]*?\});/);
        if (m || playType == 'aaaa') {
            if (m) {
                eval('var player_aaaa=' + m[1]);
                var url = player_aaaa.url || '';
                if (player_aaaa.encrypt == '1' || player_aaaa.encrypt == 1) url = unescape(url);
                else if (player_aaaa.encrypt == '2' || player_aaaa.encrypt == 2) url = unescape(base64Decode(url));
                if (/\.m3u8|\.mp4|obj\/tos/i.test(url) && /http/i.test(url)) {
                    return url + '#isVideo=true#';
                }
                if (url && /^https?:/i.test(url)) {
                    return url + '#isVideo=true#';
                }
            }
        }
        // 页面内 m3u8
        var mm = html.match(/https?:\/\/[^\"\'\s<>]+\.m3u8[^\"\'\s<>]*/);
        if (mm) return mm[0] + '#isVideo=true#';

        // 樱花等：海阔嗅探播放
        return 'webRule://' + src + '@' + $.toString(() => {
            var urls = _getUrls();
            if (window.__n == null) window.__n = 0;
            window.__n++;
            if (window.__n > 20) return 'toast://嗅探超时';
            for (var i = 0; i < urls.length; i++) {
                if (/\.m3u8|\.mp4|video_mp4|type=m3u8|\/video\/tos\//i.test(urls[i]) &&
                    !/\.html|ac=dm|=http|\?url=\/m3u8/i.test(urls[i])) {
                    fba.hideLoading();
                    if (fy_bridge_app.getHeaderUrl) {
                        return fy_bridge_app.getHeaderUrl(urls[i]).replace(';{', '#ignoreImg=true##isVideo=true#;{');
                    }
                    return urls[i] + '#isVideo=true#';
                }
            }
        });
    } catch (e) {
        logErr('play', e);
        return src;
    }
}

// ---------- 搜索 ----------
function hiksearch() {
    var res = { data: [] };
    var d = res.data;
    try {
        var parts = MY_URL.split('$$$');
        var jsonPath = parts[1] || RULE_JSON;
        var wd = parts[2] || '';
        d.push({
            title: '搜索「' + wd + '」· 点站点查看',
            col_type: 'text_center_1'
        });
        var sites = loadJsonSites();
        if (!sites.length) {
            sites = [
                { title: 'Omofun动漫', key: 'omofun', url: SITES.omofun.host },
                { title: '樱花动漫', key: 'vtt6', url: SITES.vtt6.host }
            ];
        }
        for (var i = 0; i < sites.length; i++) {
            var s = sites[i];
            var key = s.key || (/omo/i.test(s.url || '') ? 'omofun' : 'vtt6');
            var site = getSite(key);
            if (!site) continue;
            var url = fillTpl(site.search, {
                host: site.host,
                wd: wd,
                ewd: encodeURIComponent(wd)
            }).replace(/fypage/g, '1');
            var link = url;
            if (site.needCookie) {
                link = url + ';get;utf-8;{User-Agent@.js:MOBILE_UA&&Cookie@.js:fetch("' + COOKIE_DIR + s.title + 'cookie.txt",{})}';
            } else {
                link = url + ';get;utf-8;{User-Agent@.js:MOBILE_UA}';
            }
            d.push({
                title: s.title,
                url: $(link + '#noHistory#').rule((ck, k, w) => {
                    eval(fetch('hiker://files/rules/xyq/hikermovie.js'));
                    hikseaerji(ck, k, w);
                }, s.title, key, wd),
                col_type: 'icon_2_card'
            });
        }
        // 一键聚合
        d.push({
            title: '开始聚合搜索',
            url: $('#noLoading#').lazyRule((sites, wd) => {
                eval(fetch('hiker://files/rules/xyq/hikermovie.js'));
                var items = [{ title: '搜索中…', col_type: 'text_center_1', extra: { id: '__s' } }];
                setResult(items);
                var all = [];
                for (var i = 0; i < sites.length; i++) {
                    var s = sites[i];
                    var key = s.key || (/omo/i.test(s.url || '') ? 'omofun' : 'vtt6');
                    var site = getSite(key);
                    if (!site) continue;
                    var url = fillTpl(site.search, {
                        host: site.host, wd: wd, ewd: encodeURIComponent(wd)
                    }).replace(/fypage/g, '1');
                    var cookie = '';
                    if (site.needCookie) {
                        cookie = omofunCookie(site.host, url);
                        if (cookie) writeFile(COOKIE_DIR + s.title + 'cookie.txt', cookie);
                        else cookie = fetch(COOKIE_DIR + s.title + 'cookie.txt', {}) || '';
                    }
                    var html = fetchPage(url, site.host, cookie);
                    if (/系统安全验证|因访问过多/.test(html || '')) {
                        all.push({ title: s.title + ' 需验证，点站点进入', url: url, col_type: 'text_1' });
                        continue;
                    }
                    var list = parseList(html, site, site.host);
                    if (!list.length) {
                        all.push({ title: s.title + ' 无结果', url: url, col_type: 'text_1' });
                        continue;
                    }
                    for (var j = 0; j < list.length; j++) {
                        var v = list[j];
                        all.push({
                            title: v.title.replace(wd, '「' + wd + '」') + '\n' + s.title,
                            desc: v.desc || '',
                            pic_url: v.img ? imgUrl(v.img, site.host) : '',
                            url: $(v.url).rule((name) => {
                                eval(fetch('hiker://files/rules/xyq/hikermovie.js'));
                                omerj(name);
                            }, v.title),
                            col_type: v.img ? 'movie_1_vertical_pic' : 'text_center_1'
                        });
                    }
                }
                deleteItem('__s');
                for (var x = 0; x < all.length; x++) addItemAfter('', all[x]);
                return 'hiker://empty';
            }, sites, wd),
            col_type: 'text_center_1'
        });
    } catch (e) {
        d.push(errItem('search', e));
    }
    setSearchResult(res);
}

function hikseaerji(cktitle, key, wd) {
    var res = { data: [] };
    var d = res.data;
    try {
        key = key || '';
        var site = getSite(key);
        if (!site) {
            var host0 = '';
            try {
                var mm = (MY_URL + '/').match(/([\S]*?:\/\/[\S]*?)\//);
                host0 = mm ? mm[1] : '';
            } catch (e) {}
            site = /omo/i.test(host0) ? SITES.omofun : SITES.vtt6;
            key = /omo/i.test(host0) ? 'omofun' : 'vtt6';
        }
        var host = site.host;
        var html = '';
        try { html = getResCode() || ''; } catch (e) {}

        if (site.needCookie && /系统安全验证|因访问过多|继续访问/.test(html)) {
            var cok = omofunCookie(host, MY_URL);
            if (cok) {
                writeFile(COOKIE_DIR + (cktitle || site.title) + 'cookie.txt', cok);
                html = fetchPage(MY_URL, host, cok);
            }
        }
        if (/系统安全验证|因访问过多|请输入验证码/.test(html || '')) {
            d.push({ title: '需要验证，打开网页完成后再刷新', url: MY_URL, col_type: 'text_center_1' });
            d.push({
                title: '我已验证，刷新',
                url: $('#noLoading#').lazyRule(() => { refreshPage(false); return 'hiker://empty'; }),
                col_type: 'text_center_1'
            });
        } else {
            var list = parseList(html, site, host);
            if (!list.length) {
                d.push({ title: '无搜索结果', url: MY_URL, col_type: 'text_center_1' });
            } else {
                for (var i = 0; i < list.length; i++) {
                    var v = list[i];
                    var show = wd ? v.title.replace(wd, '「' + wd + '」') : v.title;
                    d.push({
                        title: show + (v.desc ? ' ' + v.desc : ''),
                        pic_url: v.img ? imgUrl(v.img, host) : '',
                        url: $(v.url).rule((name) => {
                            eval(fetch('hiker://files/rules/xyq/hikermovie.js'));
                            omerj(name);
                        }, v.title),
                        col_type: v.img ? 'movie_1_vertical_pic' : 'text_center_1'
                    });
                }
            }
        }
    } catch (e) {
        d.push(errItem('searchPage', e));
    }
    setHomeResult(res);
}

function hikerpre() {}
