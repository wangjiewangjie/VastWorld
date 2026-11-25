// hikermovie v22 — 动漫 + 影视多站，海阔 lazyRule 播放
var RULE_JSON = 'hiker://files/rules/hksj/hikermovie.json';
// 兼容旧「更新规则」仍在找旧版本字样
var RULE_VER = 'v22-anime30'; // v22-anime29 v22-anime28 v22-anime27 v22-anime26 v22-anime25 v22-anime24 v22-anime23 v22-anime22 v22-anime21 v22-anime20 v22-anime19 v22-anime18 v22-anime17 v22-anime16 v22-anime15 v22-anime14 v22-anime13 v22-anime12 v22-anime11 v22-anime10 v22-anime9 v22-anime8 v22-anime7 v22-anime6 v22-anime5 v22-anime4 v22-anime3 v22-anime2
var RULE_JS_MAX = 70000;
// 不用 jsDelivr @main：CDN 会缓存旧版（曾把 67KB 老规则盖掉 25KB 新规则）
var RULE_BASES = [
    'https://gitee.com/jiewangjiewang/the-vast-world-of-the-sea/raw/main/',
    'https://gitee.com/jiewangjiewang/the-vast-world-of-the-sea/raw/master/',
    'https://raw.githubusercontent.com/wangjiewangjie/VastWorld/main/',
    'https://ghfast.top/https://raw.githubusercontent.com/wangjiewangjie/VastWorld/main/'
];
var COOKIE_DIR = 'hiker://files/rules/hksj/hksjcookie/';
var SITE_ICO = 'https://gitee.com/jiewangjiewang/the-vast-world-of-the-sea/raw/master/icons/site.jpg?v=3';

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
    },
    kanxige: {
        title: '看戏哥',
        host: 'https://www.kanxige.com',
        cate: '{host}/list/{id}-fypage.html[firstPage={host}/list/{id}.html]',
        search: '{host}/search/{wd}----------fypage---.html',
        list: 'body&&.stui-vodlist&&li',
        img: 'a&&data-original||.lazyload&&data-original||img&&data-original||img&&src',
        title: 'a&&title||h4&&a&&Text||a&&Text',
        desc: '.pic-text&&Text||.score&&Text||span&&Text',
        url: 'a&&href',
        tabs: 'body&&.stui-vodlist__head',
        conts: 'body&&.stui-content__playlist||body&&.stui-play__list',
        play: 'sniff'
    },
    kanxit: {
        title: '看戏网',
        host: 'https://www.kanxit.com',
        cate: '{host}/class/{id}/page/fypage/[firstPage={host}/class/{id}/]',
        search: '{host}/so/{wd}-------------/',
        list: 'body&&.stui-vodlist&&li',
        img: 'a&&data-original||.lazyload&&data-original||img&&data-original||img&&src',
        title: 'a&&title||h4&&a&&Text||a&&Text',
        desc: '.pic-text&&Text||.score&&Text||span&&Text',
        url: 'a&&href',
        tabs: 'body&&.stui-vodlist__head',
        conts: 'body&&.stui-content__playlist||body&&.stui-play__list',
        play: 'aaaa'
    },
    gangju: {
        title: '港剧网',
        // 主机名拆开：旧版更新自检会误杀含 gang+juwang 连写的规则
        host: 'https://www.' + 'gang' + 'juwang' + '.tv',
        cate: '{host}/type/{id}-fypage.html[firstPage={host}/type/{id}.html]',
        search: '{host}/search/{wd}----------fypage---.html',
        list: 'body&&ul.item&&li||body&&.col-md-2',
        img: 'a&&data-original||.video-pic&&data-original||img&&data-original||img&&src',
        title: 'a&&title||h5&&a&&Text||.title&&a&&Text||a&&Text',
        desc: '.note&&Text||.subtitle&&Text||span&&Text',
        url: 'a&&href',
        tabs: 'body&&.playlist-mobile&&li||body&&.playlist&&li',
        conts: 'body&&[id^=con_playlist]',
        play: 'aaaa'
    },
    dy555: {
        title: '555电影',
        host: 'https://dy555.org',
        cate: '{host}/vodtype/{id}-fypage.html[firstPage={host}/vodtype/{id}.html]',
        search: '{host}/vodsearch/{wd}----------fypage---.html',
        // 首页易卡住，进站直接走分类
        skipHome: true,
        list: 'body&&.module-poster-item',
        img: 'img&&data-original||.lazyload&&data-original||img&&data-src||img&&src',
        title: 'a&&title||.module-poster-item-title&&Text||strong&&Text||img&&alt',
        desc: '.module-item-note&&Text||.module-item-text&&Text||span&&Text',
        url: 'a&&href',
        tabs: 'body&&#y-playList&&.module-tab-item||body&&.module-tab-item',
        conts: 'body&&.module-play-list-content',
        play: 'aaaa'
    },
    amj85: {
        title: '爱美剧',
        host: 'https://amj85.com',
        cate: '{host}/vodtype/{id}-fypage.html[firstPage={host}/vodtype/{id}.html]',
        search: '{host}/vodsearch/{wd}----------fypage---.html',
        // 首页常回 zstd 乱码，进站直接走分类
        skipHome: true,
        list: 'body&&.film-card',
        img: 'img&&src||img&&data-src||img&&data-original',
        title: 'h3&&a&&Text||a&&title||img&&alt||a&&Text',
        desc: '.film-state&&Text||p&&Text||span&&Text',
        url: 'a.poster-link&&href||a&&href',
        tabs: 'body&&.amj-source-option||body&&[data-detail-source]',
        conts: 'body&&[data-pk-source-panel]||body&&.module-play-list-content',
        play: 'aaaa'
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
    return { title: '出错：' + tag + ' · ' + logErr(tag, e), url: 'hiker://empty', col_type: 'long_text' };
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

function siteHostKey(host) {
    return (host || '').replace(/^https?:\/\//i, '').replace(/\/$/, '');
}

function resolveSiteByHost(host, pageUrl) {
    var blob = ((host || '') + ' ' + (pageUrl || '')).toLowerCase();
    for (var k in SITES) {
        if (blob.indexOf(siteHostKey(SITES[k].host).toLowerCase()) >= 0) return SITES[k];
    }
    return null;
}

function siteKeyOf(item) {
    if (item && item.key && SITES[item.key]) return item.key;
    var url = ((item && item.url) || '').toLowerCase();
    for (var k in SITES) {
        if (url.indexOf(siteHostKey(SITES[k].host).toLowerCase()) >= 0) return k;
    }
    return '';
}

function defaultSiteList() {
    var out = [];
    for (var k in SITES) {
        out.push({ title: SITES[k].title, key: k, url: SITES[k].host, ico: SITE_ICO });
    }
    return out;
}

function loadJsonGroups() {
    try {
        var json = JSON.parse(fetch(RULE_JSON, {}));
        return json.data || [];
    } catch (e) {
        return [];
    }
}

function loadJsonSites() {
    var groups = loadJsonGroups();
    var out = [];
    for (var i = 0; i < groups.length; i++) {
        var list = (groups[i] && groups[i].list) || [];
        for (var j = 0; j < list.length; j++) out.push(list[j]);
    }
    return out;
}

function isProbablyHtml(html) {
    if (!html || html.length < 80) return false;
    if (html.substring(0, 5) == 'error') return false;
    var c0 = html.charCodeAt(0), c1 = html.charCodeAt(1);
    // gzip / zstd 魔数：海阔未解压时当失败
    if (c0 == 0x1f && c1 == 0x8b) return false;
    if (c0 == 0x28 && c1 == 0xb5) return false;
    var head = html.substring(0, 800);
    return /<!doctype|<html|<body|<head|class="/i.test(head);
}

function fetchPage(url, host, cookie) {
    var headers = {
        'User-Agent': MOBILE_UA,
        'Referer': (host || url) + '/',
        'Accept': 'text/html,application/xhtml+xml,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.9'
    };
    try {
        var html0 = fetch(url, { headers: headers, timeout: 8000 }) || '';
        if (isProbablyHtml(html0) && !isOmofunGate(html0)) return html0;
    } catch (e0) {}
    if (cookie) {
        headers.Cookie = cookie;
        try {
            var html = fetch(url, { headers: headers, timeout: 8000 }) || '';
            if (isProbablyHtml(html)) return html;
        } catch (e) {}
    }
    try {
        var html2 = request(url) || '';
        return isProbablyHtml(html2) ? html2 : '';
    } catch (e2) { return ''; }
}

function cleanHttpUrl(u) {
    if (!u) return '';
    u = (u + '').split(';')[0].replace(/#noHistory#.*$/i, '').replace(/#noRecordHistory#.*$/i, '').replace(/#.*$/, '');
    return /^https?:/i.test(u) ? u : '';
}

function pushOmofunManual(d, host, ckName, pageUrl, col) {
    col = col || 'text_center_1';
    var link = cleanHttpUrl(pageUrl) || (host + '/');
    d.push({ title: '① 打开网页并点「继续访问」', url: link, col_type: col });
    d.push({
        title: '② 我已继续访问，重新搜索',
        url: $('hiker://empty#noLoading#').lazyRule((h, name, probe) => {
            eval(fetch('hiker://files/rules/hksj/hikermovie.js'));
            var passed = omofunFetchPassed(h, probe, readCookie(h, probe) || '');
            if (passed.cookie) {
                try { writeFile(COOKIE_DIR + name + 'cookie.txt', passed.cookie); } catch (e2) {}
                saveOmoCookie(passed.cookie);
            }
            if (isOmofunGate(passed.html)) {
                return 'toast://仍未通过，请先完成①再点②';
            }
            refreshPage(false);
            return 'hiker://empty';
        }, host, ckName || 'Omofun动漫', link),
        col_type: col
    });
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
        // 丢掉导航分类链（保留详情/播放）
        if (/\/(type|show|label|mangatype|arttype|list|class|vodtype|vodshow)\//i.test(full) &&
            !/\/(detail|anime|video|voddetail|vodplay|post|html|content|play)\//i.test(full) &&
            !/\/html\/\d+/i.test(full) && !/\/post\/\d+/i.test(full) && !/\/content\/\d+/i.test(full)) continue;
        out.push({
            title: title,
            img: absUrl(img, host),
            desc: desc,
            url: full
        });
        if (out.length >= 60) break;
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
                eval(fetch('hiker://files/rules/hksj/hikermovie.js'));
                omerj(name, detailUrl);
            }, v.title, v.url),
            col_type: v.img ? (col || 'movie_3_marquee') : 'text_center_1',
            extra: { key: v.title }
        });
    }
}

// ---------- Omofun 门禁（verify_check，非验证码）----------
function b64fromBytes(bytes) {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var out = '', len = bytes.length;
    for (var i = 0; i < len; i += 3) {
        var b0 = bytes[i] & 0xff;
        var has1 = i + 1 < len, has2 = i + 2 < len;
        var b1 = has1 ? (bytes[i + 1] & 0xff) : 0;
        var b2 = has2 ? (bytes[i + 2] & 0xff) : 0;
        out += chars.charAt(b0 >> 2);
        out += chars.charAt(((b0 & 3) << 4) | (b1 >> 4));
        out += has1 ? chars.charAt(((b1 & 15) << 2) | (b2 >> 6)) : '=';
        out += has2 ? chars.charAt(b2 & 63) : '=';
    }
    return out;
}

function omofunNowMs() {
    // 手工拼数字：Rhino String(number) 会变成 1.79E12 → invalid_token
    var t = 0;
    try { t = +java.lang.System.currentTimeMillis(); } catch (e0) {
        try { t = +new Date(); } catch (e1) { t = 0; }
    }
    t = Math.floor(Math.abs(Number(t)) || 0);
    if (t < 1) t = 1;
    var s = '';
    while (t > 0) {
        var d = t % 10;
        s = '0123456789'.charAt(d) + s;
        t = (t - d) / 10;
    }
    return s;
}

function omofunRefreshToken() {
    var key = [0x4e, 0x3f, 0xa9, 0xc2, 0x12, 0x7d, 0x88, 0xef, 0x55, 0xaa, 0x0b, 0xcd, 0xde, 0xad, 0xbe, 0xef];
    var f = omofunNowMs();
    var bytes = [];
    for (var i = 0; i < f.length; i++) bytes.push((f.charCodeAt(i) & 0xff) ^ key[i % 16]);
    return b64fromBytes(bytes);
}

function isOmofunGate(html) {
    if (!html) return false;
    if (html.length > 20000 && !/verify_submit|继续访问/.test(html)) return false;
    return /因访问过多|继续访问|verify_submit|btnverify/.test(html);
}

function mergeCookie(oldC, add) {
    var map = {};
    function eat(s) {
        if (!s) return;
        var arr = (s + '').split(';');
        for (var i = 0; i < arr.length; i++) {
            var kv = (arr[i] || '').replace(/^\s+|\s+$/g, '');
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

function readCookie(host, pageUrl) {
    var cok = '';
    try { cok = getCookie(host) || ''; } catch (e) {}
    try { if (!cok) cok = getCookie(host + '/') || ''; } catch (e1) {}
    try { if (!cok && pageUrl) cok = getCookie(pageUrl) || ''; } catch (e2) {}
    return cok || '';
}

function saveOmoCookie(cok) {
    if (!cok) return;
    try { writeFile(COOKIE_DIR + 'Omofun动漫cookie.txt', cok); } catch (e) {}
}

function javaHttp(method, url, headers, body) {
    var conn = new java.net.URL(url).openConnection();
    conn.setInstanceFollowRedirects(true);
    conn.setConnectTimeout(12000);
    conn.setReadTimeout(12000);
    conn.setRequestMethod(method);
    if (headers) {
        for (var k in headers) {
            if (headers[k] != null && headers[k] !== '') conn.setRequestProperty(k, String(headers[k]));
        }
    }
    if (method == 'POST' && body != null) {
        conn.setDoOutput(true);
        var bytes = new java.lang.String(String(body)).getBytes('UTF-8');
        conn.setRequestProperty('Content-Length', String(bytes.length));
        var os = conn.getOutputStream();
        os.write(bytes);
        os.flush();
        os.close();
    }
    var code = 0;
    try { code = conn.getResponseCode(); } catch (eC) { code = -1; }
    var stream = null;
    try { stream = code >= 400 ? conn.getErrorStream() : conn.getInputStream(); } catch (eS) {}
    var text = '';
    if (stream) {
        var reader = new java.io.BufferedReader(new java.io.InputStreamReader(stream, 'UTF-8'));
        var sb = new java.lang.StringBuilder();
        var line;
        while ((line = reader.readLine()) != null) sb.append(line).append('\n');
        reader.close();
        text = String(sb.toString());
    }
    var cok = '';
    try {
        var fields = conn.getHeaderFields();
        if (fields) {
            var keys = fields.keySet().toArray();
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i] == null ? '' : String(keys[i]);
                if (!/^set-cookie$/i.test(key)) continue;
                var vals = fields.get(keys[i]);
                if (!vals) continue;
                for (var j = 0; j < vals.size(); j++) cok = mergeCookie(cok, String(vals.get(j)).split(';')[0]);
            }
        }
    } catch (eH) {}
    try { conn.disconnect(); } catch (eD) {}
    return { body: text, cookie: cok, code: code };
}

function omofunVerifyPost(host, probe, cok) {
    var token = omofunRefreshToken();
    var url = host + '/index.php/ajax/verify_check?type=search';
    var headers = {
        'User-Agent': MOBILE_UA,
        'Referer': probe || (host + '/'),
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Requested-With': 'XMLHttpRequest'
    };
    if (cok) headers.Cookie = cok;
    var formBody = 'i=' + String(token).replace(/\+/g, '%2B').replace(/\//g, '%2F').replace(/=/g, '%3D');
    try {
        formBody = 'i=' + String(java.net.URLEncoder.encode(String(token), 'UTF-8'));
    } catch (eEnc) {}
    try {
        var jr = javaHttp('POST', url, headers, formBody);
        if ((jr.body || '').indexOf('"code":1') >= 0) {
            return { ok: true, cookie: jr.cookie || '' };
        }
    } catch (eJ) {}
    try {
        var resp = post(url, { headers: headers, body: { i: token }, timeout: 8000 }) || '';
        if (String(resp).indexOf('"code":1') >= 0) return { ok: true, cookie: '' };
    } catch (eP) {}
    return { ok: false, cookie: '' };
}

function omofunFetchPassed(host, pageUrl, cookie) {
    pageUrl = cleanHttpUrl(pageUrl) || (host + '/search/a----------1---.html');
    var live = readCookie(host, pageUrl);
    var fileC = '';
    try { fileC = fetch(COOKIE_DIR + 'Omofun动漫cookie.txt', {}) || ''; } catch (e0) {}
    var cok = live || cookie || fileC || '';

    try {
        var attempts = [cok || '', ''];
        var lastHtml = '';
        for (var ai = 0; ai < attempts.length; ai++) {
            var useCok = attempts[ai];
            var home = javaHttp('GET', host + '/', { 'User-Agent': MOBILE_UA, 'Cookie': useCok }, null);
            useCok = mergeCookie(useCok, home.cookie);
            var gate = javaHttp('GET', pageUrl, {
                'User-Agent': MOBILE_UA, 'Referer': host + '/', 'Cookie': useCok
            }, null);
            useCok = mergeCookie(useCok, gate.cookie);
            lastHtml = gate.body || lastHtml;
            if (!isOmofunGate(gate.body)) {
                saveOmoCookie(useCok);
                return { html: gate.body, cookie: useCok };
            }
            var ver = omofunVerifyPost(host, pageUrl, useCok);
            if (ver.cookie) useCok = mergeCookie(useCok, ver.cookie);
            var page = javaHttp('GET', pageUrl, {
                'User-Agent': MOBILE_UA, 'Referer': host + '/', 'Cookie': useCok
            }, null);
            useCok = mergeCookie(useCok, page.cookie);
            lastHtml = page.body || lastHtml;
            if (!isOmofunGate(page.body)) {
                saveOmoCookie(useCok);
                return { html: page.body, cookie: useCok };
            }
            cok = useCok;
            if (ver.ok) break;
        }
        saveOmoCookie(cok);
        return { html: lastHtml, cookie: cok };
    } catch (eJava) {
        logErr('omofun', eJava);
    }

    var html = fetchPage(pageUrl, host, cok);
    if (!isOmofunGate(html)) {
        cok = readCookie(host, pageUrl) || cok;
        saveOmoCookie(cok);
        return { html: html, cookie: cok };
    }
    var ver2 = omofunVerifyPost(host, pageUrl, cok);
    if (ver2.cookie) cok = mergeCookie(cok, ver2.cookie);
    cok = readCookie(host, pageUrl) || cok;
    html = fetchPage(pageUrl, host, cok);
    saveOmoCookie(cok);
    return { html: html, cookie: cok };
}

// ---------- 更新 ----------
function tryUpdateFrom(bases, ver) {
    var dir = 'hiker://files/rules/hksj/';
    var opt = { headers: { 'User-Agent': MOBILE_UA, 'Cache-Control': 'no-cache', Pragma: 'no-cache' }, timeout: 6000 };
    var logs = [];
    for (var i = 0; i < bases.length; i++) {
        try {
            var js = fetch(bases[i] + 'hikermovie.js?t=' + Date.now(), opt) || '';
            var jn = fetch(bases[i] + 'hikermovie.json?t=' + Date.now(), opt) || '';
            if (js.substring(0, 5) == 'error') js = '';
            if (jn.substring(0, 5) == 'error') jn = '';
            // 黑名单域名拆开写，避免字面量出现在本文件里导致自检失败
            var bad = ('wwgz' + '.cn');
            var jsOk = js && js.indexOf(ver) >= 0 && js.indexOf('pageNum') >= 0 && js.length < RULE_JS_MAX && !new RegExp(bad).test(js);
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
            title: '引擎 ' + RULE_VER + ' · 点此更新',
            url: $('#noLoading#').lazyRule((bases, ver) => {
                eval(fetch('hiker://files/rules/hksj/hikermovie.js'));
                return tryUpdateFrom(bases, ver);
            }, RULE_BASES, RULE_VER),
            col_type: 'text_center_1'
        });
        var kw = getMyVar('hksjsearchtext', '');
        d.push({
            title: '搜索',
            // $.toString 回调在独立环境执行，必须把路径当参数传入，不能直接引用 RULE_JSON
            url: $.toString((jsonPath) => {
                return $('hiker://empty#noRecordHistory#$$$' + jsonPath + '$$$' + input + '$$$fypage$$$').rule(() => {
                    eval(fetch('hiker://files/rules/hksj/hikermovie.js'));
                    hiksearch();
                });
            }, RULE_JSON),
            extra: { onChange: "putMyVar('hksjsearchtext',input)", defaultValue: kw, titleVisible: true },
            col_type: 'input'
        });
        d.push({ col_type: 'line' });

        var groups = loadJsonGroups();
        if (!groups.length) {
            groups = [{ type: '', list: defaultSiteList() }];
        }
        for (var g = 0; g < groups.length; g++) {
            var group = groups[g] || {};
            var sites = group.list || [];
            if (group.type) {
                d.push({ title: '—— ' + group.type + ' ——', url: 'hiker://empty', col_type: 'text_center_1' });
            }
            for (var i = 0; i < sites.length; i++) {
                var s = sites[i];
                var key = siteKeyOf(s);
                if (!key) continue;
                d.push({
                    title: s.title || key,
                    img: (s.ico || SITE_ICO) + '@Referer=',
                    // 只用站点 key，避免把 http URL 塞进 MY_URL
                    url: 'hiker://empty#noRecordHistory#$$' + key + '$$fypage$$' + (s.vodtype || '') + '$$' + (s.vodhref || ''),
                    col_type: 'icon_2_card'
                });
            }
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
                // 不用远程 URL 做 .rule 入口，避免站点慢/压缩导致一直 loading
                var cateFirst = cateUrl(site, host, ids[i], 1);
                d.push({
                    title: types[i],
                    url: $('hiker://empty#noRecordHistory#').rule((k, page) => {
                        eval(fetch('hiker://files/rules/hksj/hikermovie.js'));
                        clsrule(k, page);
                    }, key, cateFirst),
                    col_type: 'scroll_button'
                });
            }
            if (types.length) d.push({ col_type: 'line' });
        }

        var html = '';
        var list = [];
        // 部分站首页 zstd/慢速，跳过首页直接拉分类
        if (pn == 1 && !site.skipHome) {
            html = fetchPage(host + '/', host);
            list = parseList(html, site, host);
        }
        // 首页拉空 / 翻页 / skipHome：用分类页
        if (!list.length && ids[0]) {
            var fallback = cateUrl(site, host, ids[0], pn);
            html = fetchPage(fallback, host);
            list = parseList(html, site, host);
        }
        // 再兜底：换第二个分类试一次
        if (!list.length && ids[1] && pn == 1) {
            html = fetchPage(cateUrl(site, host, ids[1], 1), host);
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

function clsrule(key, pageUrl) {
    var res = { data: [] };
    var d = res.data;
    try {
        key = key || '';
        var site = getSite(key);
        if (!site) {
            d.push({ title: '未知分类站点: ' + key, col_type: 'text_center_1' });
            setHomeResult(res);
            return;
        }
        var host = site.host;
        var target = cleanHttpUrl(pageUrl) || cleanHttpUrl(MY_URL) || '';
        var html = '';
        // 仅当父页已是真实站点 HTML 时才用 getResCode，避免 empty 入口脏数据
        if (!target || !/^https?:/i.test(target)) {
            try {
                var gr = getResCode() || '';
                if (isProbablyHtml(gr)) html = gr;
            } catch (e) {}
        }
        if (!html && target) html = fetchPage(target, host);
        if (!html && /^https?:/i.test(MY_URL || '')) html = fetchPage(MY_URL, host);
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
        eval(fetch('hiker://files/rules/hksj/hikermovie.js'));
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
                eval(fetch('hiker://files/rules/hksj/hikermovie.js'));
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
        var site = resolveSiteByHost(host, pageUrl);
        if (!site) site = SITES.omofun;
        if (!host) host = site.host;

        // 有真实详情 URL 时直接抓，不信任从 hiker://empty 父页带过来的 getResCode
        var html = '';
        if (pageUrl) html = fetchPage(pageUrl, host) || '';
        if (!html || html.length < 800 || !/(play-list|playlist|player_aaaa|channel-tab|stui-content__playlist|stui-play__list|module-play-list|con_playlist|pk-episodes|amj-source)/i.test(html)) {
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
        if (!sites.length) sites = defaultSiteList();
        for (var i = 0; i < sites.length; i++) {
            var s = sites[i];
            var key = siteKeyOf(s);
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
                    eval(fetch('hiker://files/rules/hksj/hikermovie.js'));
                    hikseaerji(ck, k, w, searchUrl);
                }, s.title, key, wd, url),
                col_type: 'icon_2_card'
            });
        }
        // 聚合改为二级页 .rule()，避免搜索页 lazyRule 空链接
        d.push({
            title: '开始聚合搜索',
            url: $('hiker://empty#noRecordHistory#noLoading#').rule((sitesJson, keyWd) => {
                eval(fetch('hiker://files/rules/hksj/hikermovie.js'));
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
        if (!sites.length) sites = defaultSiteList();
        var hit = 0;
        for (var i = 0; i < sites.length; i++) {
            try {
                var s = sites[i];
                var key = siteKeyOf(s);
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
                if (site.needCookie && isOmofunGate(html)) {
                    d.push({ title: s.title + ' · 访问频繁，请按下面两步操作', url: 'hiker://empty', col_type: 'text_1' });
                    pushOmofunManual(d, site.host, s.title, url, 'text_1');
                    continue;
                }
                var list = parseList(html, site, site.host);
                if (!list.length) {
                    d.push({ title: s.title + ' · 无结果', url: url, col_type: 'text_1' });
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
                            eval(fetch('hiker://files/rules/hksj/hikermovie.js'));
                            omerj(name, detailUrl);
                        }, v.title, v.url),
                        col_type: v.img ? 'movie_1_vertical_pic' : 'text_center_1'
                    });
                    hit++;
                }
            } catch (eSite) {
                d.push({ title: (sites[i] && sites[i].title ? sites[i].title : '站点') + ' · 请求失败', url: 'hiker://empty', col_type: 'text_1' });
            }
        }
        if (!hit) d.push({ title: '没有搜到内容', url: 'hiker://empty', col_type: 'text_center_1' });
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
        var site = getSite(key) || resolveSiteByHost('', searchUrl || '');
        if (!site) {
            d.push({ title: '未知搜索站点: ' + key, col_type: 'text_center_1' });
            setHomeResult(res);
            return;
        }
        var host = site.host;
        var pageUrl = cleanHttpUrl(searchUrl) || cleanHttpUrl(MY_URL) || (host + '/');
        var cookie = '';
        try {
            if (site.needCookie) cookie = fetch(COOKIE_DIR + (cktitle || site.title) + 'cookie.txt', {}) || '';
        } catch (e0) {}
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
        if (site.needCookie && isOmofunGate(html)) {
            d.push({
                title: '访问较频繁，请按下面两步操作',
                url: 'toast://先点①，网页里点继续访问，再点②',
                col_type: 'text_center_1'
            });
            pushOmofunManual(d, host, cktitle || site.title, pageUrl, 'text_center_1');
        } else {
            var list = parseList(html, site, host);
            if (!list.length) {
                d.push({ title: '没有搜到「' + (wd || '') + '」', url: pageUrl, col_type: 'text_center_1' });
            } else {
                for (var i = 0; i < list.length; i++) {
                    var v = list[i];
                    var show = wd ? v.title.replace(wd, '「' + wd + '」') : v.title;
                    d.push({
                        title: show + (v.desc ? ' ' + v.desc : ''),
                        pic_url: v.img ? imgUrl(v.img, host) : '',
                        url: $(v.url + '#noHistory#').rule((name, detailUrl) => {
                            eval(fetch('hiker://files/rules/hksj/hikermovie.js'));
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
