// hikermovie v22 — 仅 Omofun / 樱花动漫，海阔 lazyRule 播放
var RULE_JSON = 'hiker://files/rules/xyq/hikermovie.json';
// 兼容旧「更新规则」仍在找旧版本字样
var RULE_VER = 'v22-anime17'; // v22-anime16 v22-anime15 v22-anime14 v22-anime13 v22-anime12 v22-anime11 v22-anime10 v22-anime9 v22-anime8 v22-anime7 v22-anime6 v22-anime5 v22-anime4 v22-anime3 v22-anime2 v21-anime2 v20-anime2
// 不用 jsDelivr @main：CDN 会缓存旧版（曾把 67KB 老规则盖掉 25KB 新规则）
var RULE_BASES = [
    'https://gitee.com/jiewangjiewang/the-vast-world-of-the-sea/raw/main/',
    'https://gitee.com/jiewangjiewang/the-vast-world-of-the-sea/raw/master/',
    'https://raw.githubusercontent.com/wangjiewangjie/VastWorld/main/',
    'https://ghfast.top/https://raw.githubusercontent.com/wangjiewangjie/VastWorld/main/'
];
var COOKIE_DIR = 'hiker://files/rules/xyq/xqyscookie/';
var SITE_ICO = 'https://gitee.com/jiewangjiewang/the-vast-world-of-the-sea/raw/master/icons/site.jpg?v=2';

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
    // 站点页 MY_URL 常为 hiker://empty，pd() 会拼出脏链接，这里一律丢掉
    if (/^hiker:/i.test(url)) return '';
    if (/^https?:/i.test(url)) return url;
    if (url.indexOf('//') == 0) return 'https:' + url;
    base = base || '';
    if (url.charAt(0) == '/') {
        var m = (base + '/').match(/^(https?:\/\/[^\/]+)/i);
        return (m ? m[1] : base.replace(/\/$/, '')) + url;
    }
    return base.replace(/\/?$/, '/') + url;
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

function mergeCookie(oldC, add) {
    var map = {};
    function eat(s) {
        if (!s) return;
        var parts = (s + '').split(';');
        for (var i = 0; i < parts.length; i++) {
            var kv = parts[i].replace(/^\s+|\s+$/g, '');
            if (!kv || kv.indexOf('=') < 0) continue;
            var low = kv.toLowerCase();
            if (/^(path|domain|expires|max-age|secure|httponly|samesite)=/.test(low)) continue;
            var n = kv.split('=')[0].replace(/^\s+|\s+$/g, '');
            if (n) map[n] = kv;
        }
    }
    eat(oldC);
    eat(add);
    var out = [];
    for (var k in map) out.push(map[k]);
    return out.join('; ');
}

function parseSetCookie(head, oldC) {
    if (!head) return oldC || '';
    var cok = oldC || '';
    var re = /set-cookie:\s*([^\r\n]+)/ig;
    var m;
    while ((m = re.exec(head))) {
        var pair = (m[1] || '').split(';')[0];
        if (pair) cok = mergeCookie(cok, pair);
    }
    return cok;
}

// withHeaders 抓取，顺便捞 Set-Cookie（海阔 getCookie 经常为空）
function fetchBundle(url, host, cookie, extra) {
    var headers = { 'User-Agent': MOBILE_UA, 'Referer': (host || url) + '/' };
    if (cookie) headers.Cookie = cookie;
    if (extra && extra.headers) {
        for (var k in extra.headers) headers[k] = extra.headers[k];
    }
    var opt = { headers: headers, timeout: (extra && extra.timeout) || 12000, withHeaders: true };
    if (extra && extra.method) opt.method = extra.method;
    if (extra && extra.body != null) opt.body = extra.body;
    var raw = '';
    try { raw = fetch(url, opt) || ''; } catch (e) {
        try { raw = fetch(url, { headers: headers, timeout: opt.timeout }) || ''; } catch (e2) { raw = ''; }
    }
    if (!raw || raw.substring(0, 5) == 'error') return { html: '', cookie: cookie || '', head: '' };
    var head = '';
    var html = raw;
    var split = raw.indexOf('\r\n\r\n');
    var gap = 4;
    if (split < 0) { split = raw.indexOf('\n\n'); gap = 2; }
    if (split >= 0 && split < 8000 && /set-cookie:|content-type:|HTTP\//i.test(raw.substring(0, split))) {
        head = raw.substring(0, split);
        html = raw.substring(split + gap);
    }
    var cok = parseSetCookie(head, cookie || '');
    try {
        var gc = getCookie(host) || getCookie(url) || '';
        if (gc) cok = mergeCookie(cok, gc);
    } catch (e3) {}
    return { html: html, cookie: cok, head: head };
}

function fetchPage(url, host, cookie) {
    var r = fetchBundle(url, host, cookie);
    if (r.html) return r.html;
    try {
        var headers = { 'User-Agent': MOBILE_UA, 'Referer': (host || url) + '/' };
        if (cookie) headers.Cookie = cookie;
        return fetch(url, { headers: headers, timeout: 12000 }) || '';
    } catch (e) {
        try { return request(url) || ''; } catch (e2) { return ''; }
    }
}

// 去掉 ;get;utf-8;{...} / #hash，得到可打开的 http 链接
function cleanHttpUrl(u) {
    if (!u) return '';
    u = (u + '').split(';')[0].replace(/#noHistory#.*$/i, '').replace(/#noRecordHistory#.*$/i, '').replace(/#.*$/, '');
    return /^https?:/i.test(u) ? u : '';
}

// 打开验证页：二级页里直接给 https，嵌套 lazyRule/web:// 容易点了无效
function verifyOpenItem(title, u, col) {
    var link = cleanHttpUrl(u);
    return {
        title: title || '需要验证，点此打开网页',
        url: link || 'hiker://empty',
        col_type: col || 'text_center_1'
    };
}

function parseList(html, site, host) {
    var items = firstPdfa(html, site.list);
    var out = [];
    for (var i = 0; i < items.length; i++) {
        var title = firstPdfh(items[i], site.title);
        var img = firstPdfh(items[i], site.img);
        var desc = firstPdfh(items[i], site.desc);
        // 不用 pd()：站点首页 MY_URL=hiker://empty 时 pd 会把 /anime/x 拼成脏地址
        var href = firstPdfh(items[i], site.url);
        if (!href || /javascript:/i.test(href)) continue;
        if (!title) continue;
        var full = absUrl(href, host);
        if (!full || !/^https?:/i.test(full)) continue;
        // 丢掉导航分类链（保留 /detail/ /anime/ /play/）
        if (/\/(type|show|label|mangatype|arttype)\//i.test(full) && !/\/(detail|anime|video|vod|play)\//i.test(full)) continue;
        out.push({
            title: title,
            img: absUrl(img, host),
            desc: desc,
            url: full
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
            // 显式传入详情 URL：站点首页 MY_URL=hiker://empty 时，单靠 getResCode/MY_URL 会解析失败
            url: $(v.url + '#noHistory#').rule((name, detailUrl) => {
                eval(fetch('hiker://files/rules/xyq/hikermovie.js'));
                omerj(name, detailUrl);
            }, v.title, v.url),
            col_type: v.img ? (col || 'movie_3_marquee') : 'text_center_1',
            extra: { key: v.title }
        });
    }
}

// Omofun「访问过多 / 继续访问」门禁：点按钮实际调 verify_check，不是真验证码
function b64enc(str) {
    try { if (typeof base64Encode == 'function') return base64Encode(str); } catch (e) {}
    try { if (typeof btoa == 'function') return btoa(str); } catch (e2) {}
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var out = '', i = 0;
    while (i < str.length) {
        var c1 = str.charCodeAt(i++) & 0xff;
        var c2 = i < str.length ? str.charCodeAt(i++) & 0xff : NaN;
        var c3 = i < str.length ? str.charCodeAt(i++) & 0xff : NaN;
        var e1 = c1 >> 2;
        var e2 = ((c1 & 3) << 4) | (c2 >> 4);
        var e3 = ((c2 & 15) << 2) | (c3 >> 6);
        var e4 = c3 & 63;
        if (isNaN(c2)) { e3 = 64; e4 = 64; }
        else if (isNaN(c3)) e4 = 64;
        out += chars.charAt(e1) + chars.charAt(e2) + (e3 == 64 ? '=' : chars.charAt(e3)) + (e4 == 64 ? '=' : chars.charAt(e4));
    }
    return out;
}

function omofunRefreshToken() {
    var key = [0x4e, 0x3f, 0xa9, 0xc2, 0x12, 0x7d, 0x88, 0xef, 0x55, 0xaa, 0x0b, 0xcd, 0xde, 0xad, 0xbe, 0xef];
    var f = String(+new Date());
    var C = '';
    for (var i = 0; i < f.length; i++) C += String.fromCharCode(f.charCodeAt(i) ^ key[i % key.length]);
    return b64enc(C);
}

function isOmofunGate(html) {
    // 真正列表页很长；门禁页短且带继续访问按钮
    if (!html) return false;
    if (html.length > 20000 && !/verify_submit|继续访问/.test(html)) return false;
    return /因访问过多|继续访问|verify_submit|verify_check/.test(html);
}

function omofunCookie(host, probe) {
    try {
        probe = cleanHttpUrl(probe) || (host + '/search/a----------1---.html');
        var cok = '';
        try { cok = fetch(COOKIE_DIR + 'Omofun动漫cookie.txt', {}) || ''; } catch (e0) {}
        var home = fetchBundle(host + '/', host, cok, { timeout: 8000 });
        cok = home.cookie || cok;
        var page = fetchBundle(probe, host, cok, { timeout: 8000 });
        cok = page.cookie || cok;
        if (!isOmofunGate(page.html)) return cok;

        var token = omofunRefreshToken();
        var chk = fetchBundle(host + '/index.php/ajax/verify_check?type=search', host, cok, {
            method: 'POST',
            body: 'i=' + encodeURIComponent(token),
            timeout: 8000,
            headers: {
                'Referer': probe,
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        cok = chk.cookie || cok;
        if (cok) {
            try { writeFile(COOKIE_DIR + 'Omofun动漫cookie.txt', cok); } catch (e3) {}
        }
        return cok;
    } catch (e) {
        logErr('omofunCookie', e);
        return '';
    }
}

// 过门禁后重抓页面（同一会话 Cookie）
function omofunFetchPassed(host, pageUrl, cookie) {
    var r = fetchBundle(pageUrl, host, cookie || '', { timeout: 10000 });
    var cok = r.cookie || cookie || '';
    var html = r.html || '';
    if (!isOmofunGate(html)) {
        if (cok) {
            try { writeFile(COOKIE_DIR + 'Omofun动漫cookie.txt', cok); } catch (e0) {}
        }
        return { html: html, cookie: cok };
    }
    cok = omofunCookie(host, pageUrl) || cok;
    r = fetchBundle(pageUrl, host, cok, { timeout: 10000 });
    html = r.html || '';
    cok = r.cookie || cok;
    // 再试一次（偶发第一次 check 后页面仍缓存门禁）
    if (isOmofunGate(html) && cok) {
        var token = omofunRefreshToken();
        fetchBundle(host + '/index.php/ajax/verify_check?type=search', host, cok, {
            method: 'POST',
            body: 'i=' + encodeURIComponent(token),
            timeout: 8000,
            headers: {
                'Referer': pageUrl,
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        r = fetchBundle(pageUrl, host, cok, { timeout: 10000 });
        html = r.html || html;
        cok = r.cookie || cok;
    }
    if (cok) {
        try { writeFile(COOKIE_DIR + 'Omofun动漫cookie.txt', cok); } catch (e1) {}
    }
    return { html: html, cookie: cok };
}

// ---------- 更新 ----------
function tryUpdateFrom(bases, ver) {
    var dir = 'hiker://files/rules/xyq/';
    var opt = { headers: { 'User-Agent': MOBILE_UA, 'Cache-Control': 'no-cache', Pragma: 'no-cache' }, timeout: 6000 };
    var logs = [];
    for (var i = 0; i < bases.length; i++) {
        try {
            var js = fetch(bases[i] + 'hikermovie.js?t=' + Date.now(), opt) || '';
            var jn = fetch(bases[i] + 'hikermovie.json?t=' + Date.now(), opt) || '';
            if (js.substring(0, 5) == 'error') js = '';
            if (jn.substring(0, 5) == 'error') jn = '';
            // 黑名单域名拆开写，避免字面量出现在本文件里导致自检失败
            var bad = ('wwgz' + '.cn') + '|' + ('gang' + 'juwang');
            var jsOk = js && js.indexOf(ver) >= 0 && js.indexOf('pageNum') >= 0 && js.length < 45000 && !new RegExp(bad).test(js);
            var jnOk = jn && jn.indexOf('vodhref') >= 0;
            var tag = bases[i].indexOf('192.168.') >= 0 ? 'lan' : (bases[i].indexOf('gitee') >= 0 ? 'gitee' : (bases[i].indexOf('ghfast') >= 0 ? 'ghfast' : 'gh'));
            logs.push(tag + ':' + (js ? js.length : 0) + (jsOk ? '+js' : '') + (jnOk ? '+json' : ''));
            if (!jsOk || !jnOk) continue;
            writeFile(dir + 'hikermovie.js', js);
            writeFile(dir + 'hikermovie.json', jn);
            var check = fetch(dir + 'hikermovie.js') || '';
            if (check.indexOf(ver) < 0) return 'toast://写入校验失败';
            refreshPage(false);
            return 'toast://已更新 ' + ver + ' ←' + tag + ' (' + js.length + 'B)';
        } catch (e) {
            logs.push('err');
        }
    }
    return 'toast://更新失败 ' + ver + ' · ' + logs.join(' | ');
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
            // $.toString 回调在独立环境执行，必须把路径当参数传入，不能直接引用 RULE_JSON
            url: $.toString((jsonPath) => {
                return $('hiker://empty#noRecordHistory#$$$' + jsonPath + '$$$' + input + '$$$fypage$$$').rule(() => {
                    eval(fetch('hiker://files/rules/xyq/hikermovie.js'));
                    hiksearch();
                });
            }, RULE_JSON),
            extra: { onChange: "putMyVar('xyqxqystext',input)", defaultValue: kw, titleVisible: true },
            col_type: 'input'
        });
        d.push({
            title: '更新规则',
            url: $('#noLoading#').lazyRule((bases, ver) => {
                eval(fetch('hiker://files/rules/xyq/hikermovie.js'));
                return tryUpdateFrom(bases, ver);
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
                img: (s.ico || SITE_ICO) + '@Referer=',
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

function omerj(movTitle, detailUrl) {
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

        // 优先用 pushCards 传入的真实详情链；MY_URL 在站点首页入口常为 hiker://empty
        var pageUrl = '';
        try {
            pageUrl = (detailUrl || '').replace(/#noHistory#.*$/, '').replace(/#.*$/, '');
        } catch (e) { pageUrl = detailUrl || ''; }
        if (!/^https?:/i.test(pageUrl)) {
            try { pageUrl = (MY_URL || '').replace(/#noHistory#.*$/, '').replace(/#.*$/, ''); } catch (e2) { pageUrl = ''; }
        }
        if (!/^https?:/i.test(pageUrl)) pageUrl = '';

        var host = '';
        try {
            var m = (pageUrl + '/').match(/(https?:\/\/[^\/\s]+)/i);
            host = m ? m[1] : '';
        } catch (e) {}
        var site = /omofuna|omofun/i.test(host + pageUrl) ? SITES.omofun : (/vtt6/i.test(host + pageUrl) ? SITES.vtt6 : null);
        if (!site) {
            for (var k in SITES) {
                if (host && host.indexOf(SITES[k].host.replace(/^https?:\/\//, '')) != -1) {
                    site = SITES[k];
                    break;
                }
            }
        }
        if (!site) site = SITES.omofun;
        if (!host) host = site.host;

        // 有真实详情 URL 时直接抓，不信任从 hiker://empty 父页带过来的 getResCode
        var html = '';
        if (pageUrl) html = fetchPage(pageUrl, host) || '';
        if (!html || html.length < 800 || !/(play-list|playlist|player_aaaa|channel-tab)/i.test(html)) {
            try {
                var gr = (getResCode() || '').replace(/<!--([\S\s]*?)-->/g, '');
                if (gr && gr.length > html.length) html = gr;
            } catch (e) {}
            if (pageUrl && (!html || html.length < 800)) html = fetchPage(pageUrl, host) || html;
        }
        try { html = (html || '').replace(/<!--([\S\s]*?)-->/g, ''); } catch (e) {}

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
                // 不用 pd()，避免脏 MY_URL 污染播放链
                try { link = pdfh(list[j], 'a&&href'); } catch (e) {}
                if (!link || /javascript:/i.test(link)) continue;
                link = absUrl(link, host);
                if (!link || !/^https?:/i.test(link)) continue;
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
            d.push({
                title: '未解析到选集，打开原网页',
                url: pageUrl || host + '/',
                col_type: 'text_center_1'
            });
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
            title: '搜索「' + wd + '」· 点下方站点',
            url: 'toast://请点下方站点进入',
            col_type: 'text_center_1'
        });
        var sites = loadJsonSites();
        if (!sites.length) {
            sites = [
                { title: 'Omofun动漫', key: 'omofun', url: SITES.omofun.host, ico: SITE_ICO },
                { title: '樱花动漫', key: 'vtt6', url: SITES.vtt6.host, ico: SITE_ICO }
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
            // 不用远程 URL 做 .rule 入口：Omofun 验证页会一直 loading
            var ico = (s.ico || SITE_ICO) + '@Referer=';
            d.push({
                title: s.title,
                img: ico,
                pic_url: ico,
                url: $('hiker://empty#noRecordHistory#').rule((ck, k, w, searchUrl) => {
                    eval(fetch('hiker://files/rules/xyq/hikermovie.js'));
                    hikseaerji(ck, k, w, searchUrl);
                }, s.title, key, wd, url),
                col_type: 'icon_2_card'
            });
        }
        // 聚合改为二级页 .rule()，避免搜索页 lazyRule 空链接
        d.push({
            title: '开始聚合搜索',
            url: $('hiker://empty#noRecordHistory#noLoading#').rule((sitesJson, keyWd) => {
                eval(fetch('hiker://files/rules/xyq/hikermovie.js'));
                hikAggSearch(sitesJson, keyWd);
            }, JSON.stringify(sites), wd),
            col_type: 'text_center_1'
        });
    } catch (e) {
        d.push(errItem('search', e));
    }
    // 首页输入框 .rule 打开的是二级页，必须 setHomeResult；setSearchResult 会导致一直转圈
    setHomeResult(res);
}

function hikAggSearch(sitesJson, wd) {
    var res = { data: [] };
    var d = res.data;
    try {
        wd = wd || '';
        d.push({ title: '聚合「' + wd + '」', col_type: 'text_center_1' });
        var sites = [];
        try { sites = JSON.parse(sitesJson || '[]'); } catch (e) { sites = []; }
        if (!sites.length) {
            sites = [
                { title: 'Omofun动漫', key: 'omofun' },
                { title: '樱花动漫', key: 'vtt6' }
            ];
        }
        var hit = 0;
        for (var i = 0; i < sites.length; i++) {
            try {
                var s = sites[i];
                var key = s.key || (/omo/i.test(s.url || '') ? 'omofun' : 'vtt6');
                var site = getSite(key);
                if (!site) continue;
                var url = fillTpl(site.search, {
                    host: site.host, wd: wd, ewd: encodeURIComponent(wd)
                }).replace(/fypage/g, '1');
                var cookie = '';
                try {
                    if (site.needCookie) cookie = fetch(COOKIE_DIR + s.title + 'cookie.txt', {}) || '';
                } catch (e2) {}
                var html = '';
                if (site.needCookie) {
                    var passed = omofunFetchPassed(site.host, url, cookie);
                    html = passed.html;
                    cookie = passed.cookie || cookie;
                } else {
                    html = fetchPage(url, site.host, cookie);
                }
                if (isOmofunGate(html)) {
                    d.push(verifyOpenItem(s.title + ' 需点网页继续访问', url, 'text_1'));
                    continue;
                }
                var list = parseList(html, site, site.host);
                if (!list.length) {
                    d.push({ title: s.title + ' 无结果', url: url, col_type: 'text_1' });
                    continue;
                }
                d.push({ title: '—— ' + s.title + ' · ' + list.length + ' ——', url: 'hiker://empty', col_type: 'text_1' });
                for (var j = 0; j < list.length; j++) {
                    var v = list[j];
                    d.push({
                        title: (wd ? v.title.replace(wd, '「' + wd + '」') : v.title),
                        desc: v.desc || '',
                        pic_url: v.img ? imgUrl(v.img, site.host) : '',
                        url: $(v.url + '#noHistory#').rule((name, detailUrl) => {
                            eval(fetch('hiker://files/rules/xyq/hikermovie.js'));
                            omerj(name, detailUrl);
                        }, v.title, v.url),
                        col_type: v.img ? 'movie_1_vertical_pic' : 'text_center_1'
                    });
                    hit++;
                }
            } catch (eSite) {
                d.push({ title: (sites[i] && sites[i].title ? sites[i].title : '站点') + ' 失败', url: 'hiker://empty', col_type: 'text_1' });
            }
        }
        if (!hit) d.push({ title: '无聚合结果', url: 'hiker://empty', col_type: 'text_center_1' });
    } catch (e) {
        d.push(errItem('agg', e));
    }
    setHomeResult(res);
}

function hikseaerji(cktitle, key, wd, searchUrl) {
    var res = { data: [] };
    var d = res.data;
    try {
        key = key || '';
        var site = getSite(key);
        if (!site) site = /omo/i.test(key + (searchUrl || '')) ? SITES.omofun : SITES.vtt6;
        var host = site.host;
        var pageUrl = cleanHttpUrl(searchUrl) || cleanHttpUrl(MY_URL) || (host + '/');
        var cookie = '';
        try {
            if (site.needCookie) cookie = fetch(COOKIE_DIR + (cktitle || site.title) + 'cookie.txt', {}) || '';
        } catch (e0) {}
        // 自己抓；遇「访问过多」自动点继续访问（verify_check），不是真验证码
        var html = '';
        if (site.needCookie) {
            var passed = omofunFetchPassed(host, pageUrl, cookie);
            html = passed.html;
            cookie = passed.cookie || cookie;
            if (cookie) {
                try { writeFile(COOKIE_DIR + (cktitle || site.title) + 'cookie.txt', cookie); } catch (e4) {}
            }
        } else {
            html = fetchPage(pageUrl, host, cookie);
        }
        if (isOmofunGate(html)) {
            d.push(verifyOpenItem('访问较多，点此打开网页后点「继续访问」', pageUrl, 'text_center_1'));
            d.push({
                title: '我已继续访问，刷新',
                url: $('hiker://empty#noLoading#').lazyRule((h, ckName, probe) => {
                    eval(fetch('hiker://files/rules/xyq/hikermovie.js'));
                    try {
                        var cok2 = '';
                        try { cok2 = getCookie(h) || ''; } catch (e1) {}
                        if (!cok2) cok2 = omofunCookie(h, probe) || '';
                        if (cok2) writeFile(COOKIE_DIR + ckName + 'cookie.txt', cok2);
                    } catch (e2) {}
                    refreshPage(false);
                    return 'hiker://empty';
                }, host, cktitle || site.title, pageUrl),
                col_type: 'text_center_1'
            });
        } else {
            var list = parseList(html, site, host);
            if (!list.length) {
                d.push({ title: '无搜索结果', url: pageUrl, col_type: 'text_center_1' });
            } else {
                for (var i = 0; i < list.length; i++) {
                    var v = list[i];
                    var show = wd ? v.title.replace(wd, '「' + wd + '」') : v.title;
                    d.push({
                        title: show + (v.desc ? ' ' + v.desc : ''),
                        pic_url: v.img ? imgUrl(v.img, host) : '',
                        url: $(v.url + '#noHistory#').rule((name, detailUrl) => {
                            eval(fetch('hiker://files/rules/xyq/hikermovie.js'));
                            omerj(name, detailUrl);
                        }, v.title, v.url),
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
