// hikermovie v22 — 动漫 + 影视多站，海阔 lazyRule 播放
// RULE_VER 必须单独 var：旧更新器正则是 /var\s+RULE_VER=/，join_vars 后会读不到版本
var RULE_VER = 'v22-anime48';
var RULE_JSON = 'hiker://files/rules/hksj/hikermovie.json';
// 仅作旧预加载兼容标记，更新校验以 parseRuleVer 为准，避免注释里的旧版号把 CDN 老包写回
var RULE_COMPAT = 'v22-anime27';
var RULE_JS_MAX = 70000;
// 不用 jsDelivr @main：CDN 会缓存旧版（曾把 67KB 老规则盖掉 25KB 新规则）
var RULE_BASES = [
    'http://192.168.3.222:8765/',
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
        // 首页「今日更新」改为前端空 ul，跳过首页直进分类
        skipHome: true,
        // 新皮肤卡片是 .daFJ_dJJfFHa__gEI；旧 ul>li 保留兜底
        list: 'body&&.daFJ_dJJfFHa__gEI||body&&ul.daFJ_dJJfFHa&&li',
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
        // 主机名运行时拼接，避免压缩成连续域名被旧自检误杀
        host: 'https://www.' + String.fromCharCode(103, 97, 110, 103, 106, 117, 119, 97, 110, 103, 46, 116, 118),
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
        list: 'body&&.module-poster-item||body&&.module-item.module-poster-item',
        img: 'img&&data-original||.lazyload&&data-original||img&&data-src||img&&src',
        title: 'a&&title||.module-poster-item-title&&Text||img&&alt||Text',
        desc: '.module-item-note&&Text||.module-item-text&&Text||span&&Text',
        url: 'a&&href||href',
        tabs: 'body&&#y-playList&&.module-tab-item||body&&.module-tab-item',
        conts: 'body&&.module-play-list-content',
        play: 'aaaa'
    },
    amj85: {
        title: '爱美剧',
        // aimeiju.org 返回未压缩 HTML，比 amj85.com 的 br/zstd 更稳
        host: 'https://aimeiju.org',
        altHosts: ['https://amj85.com', 'https://www.aimeiju.org'],
        // 福利分类 124 只在 amj85.com，且需验证码；aimeiju.org/vodtype/124 直接 404
        flHost: 'https://amj85.com',
        cate: '{host}/vodtype/{id}-fypage.html[firstPage={host}/vodtype/{id}.html]',
        search: '{host}/vodsearch/{wd}----------fypage---.html',
        // 首页常回 zstd 乱码，进站直接走分类
        skipHome: true,
        list: 'body&&.film-card||body&&.module-items&&.film-card',
        img: 'img&&src||img&&data-src||img&&data-original',
        title: 'h3&&a&&Text||a&&title||img&&alt||a&&Text',
        desc: '.film-state&&Text||p&&Text||span&&Text',
        url: 'a&&href',
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
    if (url.indexOf('//') == 0) url = 'https:' + url;
    if (!/^https?:/i.test(url)) {
        base = base || '';
        if (url.charAt(0) == '/') {
            var m = (base + '/').match(/^(https?:\/\/[^\/]+)/i);
            url = (m ? m[1] : base.replace(/\/$/, '')) + url;
        } else {
            url = base.replace(/\/?$/, '/') + url;
        }
    }
    // omofun 图床常见 https://host//upload/...
    return (url + '').replace(/^(https?:\/\/[^\/]+)\/+/, '$1/');
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
    // 福利区走专用域名（爱美剧 124）
    if (site.flHost && String(id) === '124') host = site.flHost;
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
    if (/aimeiju|amj85/.test(blob)) return SITES.amj85;
    if (/dy555|555dy|555yy|555kan/.test(blob)) return SITES.dy555;
    for (var k in SITES) {
        if (blob.indexOf(siteHostKey(SITES[k].host).toLowerCase()) >= 0) return SITES[k];
        var alts = SITES[k].altHosts || [];
        for (var i = 0; i < alts.length; i++) {
            if (blob.indexOf(siteHostKey(alts[i]).toLowerCase()) >= 0) return SITES[k];
        }
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
    // 不限前 800 字：部分站 head 很长，标记在后面
    var head = html.substring(0, 4000);
    if (/<!doctype|<html|<body|<head|module-poster|film-card|stui-vodlist|video-pic|voddetail|lazyload/i.test(head)) return true;
    return html.length > 3000 && /href=|<\/div>|<a /i.test(head);
}

function fetchPage(url, host, cookie) {
    var headers = {
        'User-Agent': MOBILE_UA,
        'Referer': (host || url) + '/',
        'Accept-Encoding': 'identity'
    };
    // 有 cookie 时必须先带 cookie：裸请求会先撞上福利验证页（也是合法 HTML），导致详情反复要验证码
    if (cookie) {
        headers.Cookie = cookie;
        try {
            var htmlC = fetch(url, { headers: headers, timeout: 10000 }) || '';
            if (isProbablyHtml(htmlC) && !isOmofunGate(htmlC) && !isWelfareGate(htmlC)) return htmlC;
        } catch (eC) {}
        try {
            var jr = javaHttp('GET', url, headers, null);
            if (jr && jr.body && isProbablyHtml(jr.body) && !isOmofunGate(jr.body) && !isWelfareGate(jr.body)) return jr.body;
            // 仍是验证页则把验证页交回去，上层走规则内验证
            if (jr && jr.body && isWelfareGate(jr.body)) return jr.body;
        } catch (eJ) {}
    }
    // 先裸请求：部分机型对自定义 header / Accept-Encoding 会拿回压缩脏数据
    try {
        var bare = fetch(url, { timeout: 10000 }) || '';
        if (isProbablyHtml(bare) && !isOmofunGate(bare) && !isWelfareGate(bare)) return bare;
    } catch (eBare) {}
    try {
        var html0 = fetch(url, { headers: {
            'User-Agent': MOBILE_UA,
            'Referer': (host || url) + '/',
            'Accept-Encoding': 'identity'
        }, timeout: 10000 }) || '';
        if (isProbablyHtml(html0) && !isOmofunGate(html0) && !isWelfareGate(html0)) return html0;
        if (isWelfareGate(html0)) return html0;
    } catch (e0) {}
    try {
        var html2 = request(url) || '';
        if (isProbablyHtml(html2) && !isWelfareGate(html2)) return html2;
        if (html2 && html2.length > 5000 && html2.substring(0, 5) != 'error') return html2;
        return '';
    } catch (e2) { return ''; }
}

function swapHost(url, fromHost, toHost) {
    if (!url || !toHost) return url;
    var from = siteHostKey(fromHost || '');
    var to = (toHost + '').replace(/\/$/, '');
    if (!from) return url.replace(/^(https?:\/\/)[^\/]+/i, to);
    return (url + '').split(from).join(siteHostKey(to));
}

function fetchSiteHtml(site, pageUrl) {
    var html = fetchPage(pageUrl, site.host);
    if (isProbablyHtml(html) && html.length > 800) return html;
    var alts = site.altHosts || [];
    for (var i = 0; i < alts.length; i++) {
        var u = swapHost(pageUrl, site.host, alts[i]);
        if (!u || u == pageUrl) continue;
        html = fetchPage(u, alts[i]);
        if (isProbablyHtml(html) && html.length > 800) return html;
    }
    return html || '';
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

function isDetailHref(full) {
    if (!full) return false;
    if (/\/(voddetail|vodplay|post|content|detail|anime|video)\//i.test(full)) return true;
    if (/\/html\/\d+/i.test(full) || /\/post\/\d+/i.test(full) || /\/content\/\d+/i.test(full)) return true;
    if (/\/(type|show|label|mangatype|arttype|list|class|vodtype|vodshow|category)\//i.test(full)) return false;
    return true;
}

function parseListFallback(html, host) {
    var out = [];
    var seen = {};
    if (!html) return out;
    var m;
    // Omofun 新卡片：lazyload a 上同时有 href/title/data-original
    var reOmo = /<a\b[^>]*class="[^"]*lazyload[^"]*"[^>]*href="([^"]*\/anime\/[^"]+)"[^>]*title="([^"]*)"[^>]*data-original="([^"]*)"/gi;
    while ((m = reOmo.exec(html)) && out.length < 60) {
        var full0 = absUrl(m[1], host);
        var t0 = (m[2] || '').replace(/^\s+|\s+$/g, '');
        if (!full0 || !t0 || seen[full0] || !isDetailHref(full0)) continue;
        seen[full0] = 1;
        out.push({ title: t0, img: absUrl(m[3], host), desc: '', url: full0 });
    }
    if (out.length) return out;
    // title 在前 / href 在前 两种 <a>
    var re = /<a\b[^>]*?(?:title="([^"]+)"[^>]*?href="([^"]+)"|href="([^"]+)"[^>]*?title="([^"]+)")[^>]*>/gi;
    while ((m = re.exec(html)) && out.length < 60) {
        var title = (m[1] || m[4] || '').replace(/^\s+|\s+$/g, '');
        var href = m[2] || m[3] || '';
        if (!href || /javascript:/i.test(href)) continue;
        if (!title || title.length > 80) continue;
        if (/首页|登录|注册|排行|筛选|更多|下一页|上一页/i.test(title)) continue;
        var full = absUrl(href, host);
        if (!full || !/^https?:/i.test(full) || seen[full]) continue;
        if (!/\/(voddetail|post|html|content|detail|anime)\//i.test(full) && !/\/html\/\d+/i.test(full)) continue;
        if (!isDetailHref(full)) continue;
        seen[full] = 1;
        out.push({ title: title, img: '', desc: '', url: full });
    }
    // 爱美剧 film-card：title 在 h3，href 在 poster-link
    if (!out.length) {
        var re2 = /<article[^>]*class="[^"]*film-card[\s\S]*?href="(\/voddetail\/[^"]+)"[\s\S]*?<h3>\s*<a[^>]*>([^<]+)</gi;
        while ((m = re2.exec(html)) && out.length < 60) {
            var full2 = absUrl(m[1], host);
            var t2 = (m[2] || '').replace(/^\s+|\s+$/g, '');
            if (!full2 || !t2 || seen[full2]) continue;
            seen[full2] = 1;
            out.push({ title: t2, img: '', desc: '', url: full2 });
        }
    }
    return out;
}

function parseList(html, site, host) {
    var items = firstPdfa(html, site.list);
    var out = [];
    var seen = {};
    for (var i = 0; i < items.length; i++) {
        var title = firstPdfh(items[i], site.title);
        var img = firstPdfh(items[i], site.img);
        var desc = firstPdfh(items[i], site.desc);
        // 不用 pd()：站点首页 MY_URL=hiker://empty 时 pd 会把 /anime/x 拼成脏地址
        var href = firstPdfh(items[i], site.url);
        if (!href || /javascript:/i.test(href)) continue;
        if (!title) continue;
        var full = absUrl(href, host);
        if (!full || !/^https?:/i.test(full) || seen[full]) continue;
        if (!isDetailHref(full)) continue;
        seen[full] = 1;
        out.push({
            title: title,
            img: absUrl(img, host),
            desc: desc,
            url: full
        });
        if (out.length >= 60) break;
    }
    if (!out.length) out = parseListFallback(html, host);
    return out;
}

function pushCards(d, list, host, col) {
    for (var i = 0; i < list.length; i++) {
        var v = list[i];
        d.push({
            title: v.title,
            desc: v.desc || '',
            pic_url: v.img ? imgUrl(v.img, host) : '',
            // 必须用 empty：$(http详情).rule 在部分机型会直接打开原网页而不是进二级
            url: $('hiker://empty#noHistory#').rule((name, detailUrl) => {
                eval(fetch('hiker://files/rules/hksj/hikermovie.js'));
                omerj(name, detailUrl);
            }, v.title, v.url),
            col_type: v.img ? (col || 'movie_3_marquee') : 'text_center_1',
            extra: { key: v.title }
        });
    }
}

function isWelfareGate(html) {
    return !!html && /访问验证|完成验证后继续访问|welfare\/check|welfare\/image|welfare\/index|welfare-answer|name=["']csrf["']/i.test(html);
}

function welfareIndexUrl(host, nextPath) {
    host = (host || '').replace(/\/$/, '');
    nextPath = nextPath || '/vodtype/124.html';
    try {
        return host + '/welfare/index.html?next=' + String(java.net.URLEncoder.encode(String(nextPath), 'UTF-8'));
    } catch (e) {
        return host + '/welfare/index.html?next=' + encodeURIComponent(String(nextPath));
    }
}

function welfareCkFile(site) {
    return COOKIE_DIR + ((site && site.title) || 'amj85') + '_welfarecookie.txt';
}

function readWelfareSession(site) {
    var raw = '';
    try { raw = fetch(welfareCkFile(site), {}) || ''; } catch (e) { raw = ''; }
    if (!raw) return { cookie: '', csrf: '', next: '', page: '' };
    if (raw.charAt(0) == '{') {
        try {
            var o = JSON.parse(raw);
            return {
                cookie: o.c || o.cookie || '',
                csrf: o.s || o.csrf || '',
                next: o.n || o.next || '',
                page: o.p || o.page || ''
            };
        } catch (e2) {}
    }
    return { cookie: raw, csrf: '', next: '', page: '' };
}

function readWelfareCookie(site) {
    return readWelfareSession(site).cookie || '';
}

function writeWelfareSession(site, sess) {
    sess = sess || {};
    var cok = sess.cookie || '';
    if (!cok) return;
    try {
        writeFile(welfareCkFile(site), JSON.stringify({
            v: 1,
            c: cok,
            s: sess.csrf || '',
            n: sess.next || '',
            p: sess.page || ''
        }));
    } catch (e) {
        try { writeFile(welfareCkFile(site), cok); } catch (e2) {}
    }
}

function writeWelfareCookie(site, cok) {
    if (!cok) return;
    var old = readWelfareSession(site);
    writeWelfareSession(site, {
        cookie: cok,
        csrf: old.csrf || '',
        next: old.next || '',
        page: old.page || ''
    });
}

function syncWelfareCookie(site, pageUrl) {
    var hosts = [];
    if (site && site.flHost) hosts.push(site.flHost);
    if (site && site.host) hosts.push(site.host);
    var alts = (site && site.altHosts) || [];
    for (var i = 0; i < alts.length; i++) hosts.push(alts[i]);
    var cok = '';
    for (var j = 0; j < hosts.length && !cok; j++) {
        try { cok = getCookie(hosts[j]) || ''; } catch (e0) {}
        try { if (!cok) cok = getCookie(hosts[j] + '/') || ''; } catch (e1) {}
    }
    try { if (!cok && pageUrl) cok = getCookie(pageUrl) || ''; } catch (e2) {}
    if (cok) writeWelfareCookie(site, cok);
    return cok || readWelfareCookie(site);
}

function welfareParseGate(html) {
    html = html || '';
    var csrf = '';
    var nextPath = '/vodtype/124.html';
    try {
        var m1 = html.match(/name=["']csrf["'][^>]*value=["']([^"']+)["']/i) ||
            html.match(/value=["']([^"']+)["'][^>]*name=["']csrf["']/i);
        if (m1) csrf = m1[1];
        var m2 = html.match(/name=["']next["'][^>]*value=["']([^"']+)["']/i) ||
            html.match(/value=["']([^"']+)["'][^>]*name=["']next["']/i);
        if (m2) nextPath = m2[1] || nextPath;
    } catch (e) {}
    return { csrf: csrf, next: nextPath };
}

function welfareFetchGate(host, pageUrl, cok) {
    host = (host || '').replace(/\/$/, '');
    var url = cleanHttpUrl(pageUrl) || (host + '/vodtype/124.html');
    var headers = {
        'User-Agent': MOBILE_UA,
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Encoding': 'identity',
        'Referer': host + '/welfare/index.html'
    };
    if (cok) headers.Cookie = cok;
    try {
        var r = javaHttp('GET', url, headers, null);
        // 仍是压缩脏数据时，改走明文验证页
        if ((!r.body || !isProbablyHtml(r.body) || (!isWelfareGate(r.body) && !/film-card|module-item/i.test(r.body))) && /\/(vodtype|vodshow)\/124\b/.test(url)) {
            var gateUrl = welfareIndexUrl(host, '/vodtype/124.html');
            var g2 = javaHttp('GET', gateUrl, headers, null);
            if (g2.body && (isWelfareGate(g2.body) || isProbablyHtml(g2.body))) {
                g2.cookie = mergeCookie(r.cookie || '', g2.cookie || '');
                return g2;
            }
        }
        return r;
    } catch (e) {
        return { body: '', cookie: '', code: -1 };
    }
}

function welfareSaveCaptcha(host, cok, referer) {
    host = (host || '').replace(/\/$/, '');
    // 服务端返回 image/png，必须存成 .png，否则海阔常显示裂图
    var imgUrl = host + '/welfare/image.html?t=' + Date.now();
    var headers = {
        'User-Agent': MOBILE_UA,
        'Referer': referer || (host + '/welfare/index.html'),
        'Accept': 'image/png,image/*,*/*',
        'Accept-Encoding': 'identity'
    };
    if (cok) headers.Cookie = cok;
    try {
        var conn = new java.net.URL(imgUrl).openConnection();
        conn.setConnectTimeout(10000);
        conn.setReadTimeout(10000);
        conn.setRequestMethod('GET');
        for (var k in headers) conn.setRequestProperty(k, String(headers[k]));
        var stream = conn.getInputStream();
        var baos = new java.io.ByteArrayOutputStream();
        var buf = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 4096);
        var n;
        while ((n = stream.read(buf)) != -1) baos.write(buf, 0, n);
        stream.close();
        var bytes = baos.toByteArray();
        // 验证码图若回写新 PHPSESSID，会让页面上的 csrf 失效 → 提交 403；忽略图片的 Set-Cookie
        try { conn.disconnect(); } catch (eD) {}
        var dir = new java.io.File('/storage/emulated/0/Android/data/com.example.hikerview/files/Documents/Hiker/cache');
        try { if (!dir.exists()) dir.mkdirs(); } catch (e0) {}
        var file = new java.io.File(dir, 'amj_welfare.png');
        var fileUrl = '';
        try {
            var fos = new java.io.FileOutputStream(file);
            fos.write(bytes);
            fos.close();
            fileUrl = 'file://' + file.getAbsolutePath();
        } catch (e1) {
            file = java.io.File.createTempFile('amj_welfare', '.png');
            var fos2 = new java.io.FileOutputStream(file);
            fos2.write(bytes);
            fos2.close();
            fileUrl = 'file://' + file.getAbsolutePath();
        }
        return { url: fileUrl, cookie: '' };
    } catch (e) {
        return { url: imgUrl, cookie: '' };
    }
}

function welfareCheckPost(host, csrf, nextPath, answer, cok, referer) {
    host = (host || '').replace(/\/$/, '');
    var checkUrl = host + '/welfare/check.html';
    var enc = function (s) {
        try { return String(java.net.URLEncoder.encode(String(s), 'UTF-8')); } catch (e) {
            return encodeURIComponent(String(s));
        }
    };
    if (!csrf) return { ok: false, msg: '缺少csrf，请刷新验证码', cookie: cok || '' };
    if (!hasPhpSession(cok)) return { ok: false, msg: '会话丢失，请点验证码刷新', cookie: cok || '' };
    var body = 'csrf=' + enc(csrf) + '&next=' + enc(nextPath || '/vodtype/124.html') + '&answer=' + enc(answer);
    try {
        var conn = new java.net.URL(checkUrl).openConnection();
        conn.setInstanceFollowRedirects(false);
        conn.setConnectTimeout(12000);
        conn.setReadTimeout(12000);
        conn.setRequestMethod('POST');
        conn.setDoOutput(true);
        conn.setRequestProperty('User-Agent', MOBILE_UA);
        // 强制验证页 Referer；POST 不要带 gzip（实测 Accept-Encoding:gzip 会 403）
        var ref = referer || '';
        if (!/welfare\/index/i.test(ref)) {
            try {
                ref = host + '/welfare/index.html?next=' + enc(nextPath || '/vodtype/124.html');
            } catch (eR) {
                ref = host + '/welfare/index.html';
            }
        }
        conn.setRequestProperty('Referer', ref);
        conn.setRequestProperty('Origin', host);
        conn.setRequestProperty('Accept', 'text/html,application/xhtml+xml,*/*');
        conn.setRequestProperty('Accept-Encoding', 'identity');
        conn.setRequestProperty('Content-Type', 'application/x-www-form-urlencoded');
        conn.setRequestProperty('Cookie', cok);
        var bytes = new java.lang.String(body).getBytes('UTF-8');
        conn.setRequestProperty('Content-Length', String(bytes.length));
        var os = conn.getOutputStream();
        os.write(bytes);
        os.flush();
        os.close();
        var code = 0;
        try { code = conn.getResponseCode(); } catch (eC) { code = -1; }
        var newCok = mergeCookie(cok || '', collectSetCookies(conn));
        var loc = '';
        try { loc = conn.getHeaderField('Location') || ''; } catch (eL) {}
        var text = '';
        try {
            var stream = null;
            try { stream = code >= 400 ? conn.getErrorStream() : conn.getInputStream(); } catch (eS) {}
            if (stream) {
                var ce = '';
                try { ce = String(conn.getContentEncoding() || ''); } catch (eCe) {}
                var baos = new java.io.ByteArrayOutputStream();
                var buf = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 4096);
                var n;
                while ((n = stream.read(buf)) != -1) baos.write(buf, 0, n);
                stream.close();
                var raw = baos.toByteArray();
                var b0 = raw.length > 0 ? (raw[0] & 0xff) : 0;
                var b1 = raw.length > 1 ? (raw[1] & 0xff) : 0;
                if (/gzip/i.test(ce) || (b0 == 0x1f && b1 == 0x8b)) {
                    var gis = new java.util.zip.GZIPInputStream(new java.io.ByteArrayInputStream(raw));
                    var baos2 = new java.io.ByteArrayOutputStream();
                    while ((n = gis.read(buf)) != -1) baos2.write(buf, 0, n);
                    gis.close();
                    text = String(new java.lang.String(baos2.toByteArray(), 'UTF-8'));
                } else {
                    text = String(new java.lang.String(raw, 'UTF-8'));
                }
            }
        } catch (eB) {}
        try { conn.disconnect(); } catch (eD) {}

        if (code == 403) {
            return { ok: false, msg: '提交被拒(403)会话失效，请点验证码刷新', cookie: newCok };
        }
        if (code >= 300 && code < 400 && loc) {
            if (!/^https?:/i.test(loc)) loc = host + (loc.charAt(0) == '/' ? loc : '/' + loc);
            var gr = javaHttp('GET', loc, {
                'User-Agent': MOBILE_UA,
                'Cookie': newCok,
                'Referer': ref,
                'Accept-Encoding': 'identity'
            }, null);
            newCok = mergeCookie(newCok, gr.cookie);
            if (isWelfareGate(gr.body)) return { ok: false, msg: '验证码错误', cookie: newCok };
            return { ok: true, cookie: newCok, html: gr.body || '' };
        }
        if (isWelfareGate(text)) return { ok: false, msg: '验证码错误或已过期', cookie: newCok };
        if (code >= 200 && code < 400 && !isWelfareGate(text)) return { ok: true, cookie: newCok, html: text };
        return { ok: false, msg: '提交失败(' + code + ')', cookie: newCok };
    } catch (e) {
        return { ok: false, msg: '提交异常', cookie: cok || '' };
    }
}

function pushWelfareManual(d, key, site, pageUrl) {
    // 规则内验证：禁止打开原站 POST（海阔 WebView 会「页面错误稍后重试」）
    var host = ((site && (site.flHost || site.host)) || '').replace(/\/$/, '');
    var link = cleanHttpUrl(pageUrl) || (host + '/vodtype/124.html');
    var nextPath = '/vodtype/124.html';
    try {
        var mNext = (link || '').match(/[?&]next=([^&]+)/);
        if (mNext) {
            try { nextPath = decodeURIComponent(mNext[1]); } catch (eN) { nextPath = mNext[1]; }
        } else {
            // 详情/播放页验证：next 必须是真实目标路径，验证后才能回到该页
            var pathOnly = (link || '').replace(/^https?:\/\/[^\/]+/i, '');
            pathOnly = (pathOnly || '').split('#')[0];
            if (pathOnly && pathOnly.charAt(0) == '/' && !/welfare/i.test(pathOnly)) nextPath = pathOnly;
            else if (/\/(vodtype|vodshow)\/124\b/.test(link)) nextPath = '/vodtype/124.html';
        }
    } catch (e0) {}
    // csrf 必须与 PHPSESSID 同一次响应：不要先空会话再 merge getCookie（旧 SID 会盖掉新会话 → 403）
    var gateUrl = welfareIndexUrl(host, nextPath);
    var cok = readWelfareCookie(site) || '';
    var gate = welfareFetchGate(host, gateUrl, cok);
    // 只合并本次响应 Set-Cookie；禁止再用 getCookie 覆盖
    cok = mergeCookie(cok, gate.cookie || '');
    var html = gate.body || '';
    if (!isWelfareGate(html) || !hasPhpSession(cok)) {
        // javaHttp 拿不到 Set-Cookie 时，改走海阔 fetch，让 jar 与页面同源
        try {
            var fh = {
                'User-Agent': MOBILE_UA,
                'Accept': 'text/html,application/xhtml+xml',
                'Accept-Encoding': 'identity',
                'Referer': host + '/'
            };
            if (cok) fh.Cookie = cok;
            var fhtml = fetch(gateUrl, { headers: fh, timeout: 10000 }) || '';
            if (isWelfareGate(fhtml)) {
                html = fhtml;
                try {
                    // fetch 与 jar 同源：仅当本地还没有 SID 时才取 jar，绝不用旧 SID 覆盖已对齐会话
                    if (!hasPhpSession(cok)) {
                        cok = getCookie(host) || getCookie(host + '/') || getCookie(gateUrl) || cok;
                    }
                } catch (eGc) {}
            }
        } catch (eF) {}
    }
    if (!isWelfareGate(html)) {
        gate = welfareFetchGate(host, link, cok);
        cok = mergeCookie(cok, gate.cookie || '');
        html = gate.body || html;
    }
    var parsed = welfareParseGate(html);
    if (!parsed.next || parsed.next == '/') parsed.next = nextPath;
    // csrf+cookie 同文件落盘，提交只信文件，避免 myVar/getCookie 串会话
    writeWelfareSession(site, {
        cookie: cok,
        csrf: parsed.csrf || '',
        next: parsed.next || nextPath,
        page: gateUrl
    });
    var imgBag = welfareSaveCaptcha(host, cok, gateUrl);
    var img = (imgBag && typeof imgBag == 'object') ? (imgBag.url || '') : (imgBag || '');
    try {
        putMyVar('amj_w_host', host);
        putMyVar('amj_w_csrf', parsed.csrf || '');
        putMyVar('amj_w_next', parsed.next || nextPath);
        // Referer 必须是验证页本身，用详情 URL 当 Referer 会 403
        putMyVar('amj_w_page', gateUrl);
        putMyVar('amj_w_key', key || 'amj85');
        putMyVar('amj_w_cok', cok || '');
        putMyVar('amj_w_target', link);
    } catch (eV) {}

    d.push({
        title: '福利区验证 · 看图输入4位数字（勿打开原网页）',
        url: 'hiker://empty',
        col_type: 'text_center_1'
    });
    d.push({
        title: '验证码（点此刷新）',
        pic_url: img,
        url: $('hiker://empty#noLoading#').lazyRule(() => {
            eval(fetch('hiker://files/rules/hksj/hikermovie.js'));
            refreshPage(false);
            return 'toast://已刷新验证码';
        }),
        col_type: 'pic_1_center'
    });
    if (!parsed.csrf || !hasPhpSession(cok)) {
        d.push({
            title: '未拿到验证会话，点此重试',
            url: $('hiker://empty#noLoading#').lazyRule(() => {
                refreshPage(false);
                return 'toast://重试中';
            }),
            col_type: 'text_center_1'
        });
        return;
    }
    d.push({
        title: '输入验证码并提交',
        // 参数只走 myVar，避免 input:// + $.toString(..., args) 把 csrf/url 填进输入框
        url: $('hiker://empty#noLoading#').lazyRule(() => {
            eval(fetch('hiker://files/rules/hksj/hikermovie.js'));
            return 'input://' + JSON.stringify({
                value: '',
                hint: '请输入图片中的4位数字（1-9）',
                js: $.toString(() => {
                    eval(fetch('hiker://files/rules/hksj/hikermovie.js'));
                    var ans = String(input || '').replace(/\s+/g, '');
                    if (!/^[1-9]{4}$/.test(ans)) return 'toast://请输入4位数字（1-9）';
                    var host = '';
                    var k = 'amj85';
                    try {
                        host = getMyVar('amj_w_host', '') || '';
                        k = getMyVar('amj_w_key', '') || k;
                    } catch (e1) {}
                    var site2 = getSite(k) || SITES.amj85;
                    if (!host) host = ((site2.flHost || site2.host) || '').replace(/\/$/, '');
                    // 提交只信落盘会话（csrf+PHPSESSID 成对），禁止 getCookie 掺入旧 SID
                    var sess = readWelfareSession(site2);
                    var csrf = sess.csrf || '';
                    var nextPath = sess.next || '/vodtype/124.html';
                    var page = sess.page || '';
                    var cok2 = sess.cookie || '';
                    try {
                        if (!csrf) csrf = getMyVar('amj_w_csrf', '') || '';
                        if (!page) page = getMyVar('amj_w_page', '') || '';
                        if (!sess.next) nextPath = getMyVar('amj_w_next', '') || nextPath;
                        if (!hasPhpSession(cok2)) cok2 = getMyVar('amj_w_cok', '') || '';
                    } catch (e0) {}
                    if (!csrf) return 'toast://验证已过期，请点验证码刷新后重试';
                    if (!hasPhpSession(cok2)) {
                        refreshPage(false);
                        return 'toast://会话丢失，已刷新，请重新看图输入';
                    }
                    var r = welfareCheckPost(host, csrf, nextPath, ans, cok2, page || (host + '/welfare/index.html'));
                    writeWelfareSession(site2, {
                        cookie: r.cookie || cok2,
                        csrf: r.ok ? '' : csrf,
                        next: nextPath,
                        page: page
                    });
                    try { putMyVar('amj_w_cok', r.cookie || cok2 || ''); } catch (e2) {}
                    if (!r.ok) {
                        refreshPage(false);
                        return 'toast://' + (r.msg || '验证失败，请看新图重试');
                    }
                    refreshPage(false);
                    return 'toast://验证成功';
                })
            });
        }),
        col_type: 'text_center_1'
    });
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

// 从连接头收集 Set-Cookie（部分安卓 getHeaderFields 会丢，再扫一遍 getHeaderFieldKey）
function collectSetCookies(conn) {
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
    } catch (e0) {}
    try {
        for (var n = 0; n < 32; n++) {
            var hk = conn.getHeaderFieldKey(n);
            if (hk == null && n > 0) break;
            if (hk && /^set-cookie$/i.test(String(hk))) {
                cok = mergeCookie(cok, String(conn.getHeaderField(n) || '').split(';')[0]);
            }
        }
    } catch (e1) {}
    return cok;
}

function hasPhpSession(cok) {
    return !!(cok && /PHPSESSID=/i.test(cok));
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
    // 显式只要 identity：amj85 对 br/zstd 常回魔数脏数据；若仍回 gzip 则下方手动解
    var hasAe = false;
    if (headers) {
        for (var hk in headers) {
            if (headers[hk] == null || headers[hk] === '') continue;
            if (/^accept-encoding$/i.test(hk)) hasAe = true;
            conn.setRequestProperty(hk, String(headers[hk]));
        }
    }
    if (!hasAe) conn.setRequestProperty('Accept-Encoding', 'identity');
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
    var ce = '';
    try { ce = String(conn.getContentEncoding() || conn.getHeaderField('Content-Encoding') || ''); } catch (eCe) {}
    var text = '';
    if (stream) {
        try {
            // 读成字节再判断 gzip/zstd，避免 identity 请求仍被强塞压缩
            var baos = new java.io.ByteArrayOutputStream();
            var buf = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 4096);
            var n;
            while ((n = stream.read(buf)) != -1) baos.write(buf, 0, n);
            stream.close();
            var raw = baos.toByteArray();
            var b0 = raw.length > 0 ? (raw[0] & 0xff) : 0;
            var b1 = raw.length > 1 ? (raw[1] & 0xff) : 0;
            var b2 = raw.length > 2 ? (raw[2] & 0xff) : 0;
            var b3 = raw.length > 3 ? (raw[3] & 0xff) : 0;
            var isGzip = /gzip/i.test(ce) || (b0 == 0x1f && b1 == 0x8b);
            var isZstd = /zstd/i.test(ce) || (b0 == 0x28 && b1 == 0xb5 && b2 == 0x2f && b3 == 0xfd);
            if (isZstd) {
                // 无法解 zstd，交由上层换 URL / 重试
                text = '';
            } else if (isGzip) {
                var gis = new java.util.zip.GZIPInputStream(new java.io.ByteArrayInputStream(raw));
                var baos2 = new java.io.ByteArrayOutputStream();
                while ((n = gis.read(buf)) != -1) baos2.write(buf, 0, n);
                gis.close();
                text = String(new java.lang.String(baos2.toByteArray(), 'UTF-8'));
            } else {
                text = String(new java.lang.String(raw, 'UTF-8'));
            }
        } catch (eRead) {
            text = '';
        }
    }
    var cok = collectSetCookies(conn);
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
function parseRuleVer(js) {
    // 压缩后是 var RULE_JSON=...,RULE_VER="v22-animeN"，不能要求前面有 var
    var m = (js || '').match(/RULE_VER\s*=\s*['"](v22-anime\d+)['"]/);
    return m ? m[1] : '';
}

function animeNum(ver) {
    var m = (ver || '').match(/anime(\d+)/);
    return m ? parseInt(m[1], 10) : 0;
}

function tryUpdateFrom(bases, ver) {
    var dir = 'hiker://files/rules/hksj/';
    var opt = { headers: { 'User-Agent': MOBILE_UA, 'Cache-Control': 'no-cache', Pragma: 'no-cache' }, timeout: 8000 };
    var logs = [];
    var want = animeNum(ver);
    var localNum = 0;
    try { localNum = animeNum(parseRuleVer(fetch(dir + 'hikermovie.js') || '')); } catch (e0) {}
    var minNeed = Math.max(want, localNum, 28);
    var best = null;
    // 用 fromCharCode，避免 terser 把 'wwgz'+'.cn' 折成字面量导致自检失败
    var bad = String.fromCharCode(119, 119, 103, 122, 46, 99, 110);
    for (var i = 0; i < bases.length; i++) {
        try {
            var js = fetch(bases[i] + 'hikermovie.js?t=' + Date.now(), opt) || '';
            var jn = fetch(bases[i] + 'hikermovie.json?t=' + Date.now(), opt) || '';
            if (js.substring(0, 5) == 'error') js = '';
            if (jn.substring(0, 5) == 'error') jn = '';
            var remoteVer = parseRuleVer(js);
            var rn = animeNum(remoteVer);
            var jsOk = js && remoteVer && rn >= minNeed && js.indexOf('pageNum') >= 0 && js.length < RULE_JS_MAX && js.indexOf(bad) < 0;
            var jnOk = jn && jn.indexOf('vodhref') >= 0;
            var tag = bases[i].indexOf('192.168.') >= 0 ? 'lan' : (bases[i].indexOf('gitee') >= 0 ? 'gitee' : (bases[i].indexOf('ghfast') >= 0 ? 'ghfast' : 'gh'));
            logs.push(tag + ':' + (js ? js.length : 0) + '/' + (remoteVer || '-') + (jsOk ? '+js' : '') + (jnOk ? '+json' : ''));
            if (!jsOk || !jnOk) continue;
            if (!best || rn > best.num) best = { js: js, jn: jn, ver: remoteVer, num: rn, tag: tag };
        } catch (e) {
            logs.push('err');
        }
    }
    if (!best) return 'toast://更新失败 want≥' + minNeed + ' · ' + logs.join(' | ');
    writeFile(dir + 'hikermovie.js', best.js);
    writeFile(dir + 'hikermovie.json', best.jn);
    var check = parseRuleVer(fetch(dir + 'hikermovie.js') || '');
    if (animeNum(check) < best.num) return 'toast://写入校验失败';
    refreshPage(false);
    return 'toast://已更新 ' + best.ver + ' ←' + best.tag + ' (' + best.js.length + 'B)';
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
            html = fetchSiteHtml(site, host + '/');
            list = parseList(html, site, host);
        }
        // 首页拉空 / 翻页 / skipHome：用分类页
        if (!list.length && ids[0]) {
            var fallback = cateUrl(site, host, ids[0], pn);
            html = fetchSiteHtml(site, fallback);
            list = parseList(html, site, host);
        }
        // 再兜底：换第二个分类试一次
        if (!list.length && ids[1] && pn == 1) {
            html = fetchSiteHtml(site, cateUrl(site, host, ids[1], 1));
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
        // 福利分类强制走 flHost，避免 aimeiju.org/124 的 404
        if (site.flHost && /\/(vodtype|vodshow)\/124\b/.test(target || '')) {
            host = site.flHost;
            if (target) target = swapHost(target, site.host, site.flHost);
        }
        var html = '';
        // 仅当父页已是真实站点 HTML 时才用 getResCode，避免 empty 入口脏数据
        if (!target || !/^https?:/i.test(target)) {
            try {
                var gr = getResCode() || '';
                if (isProbablyHtml(gr)) html = gr;
            } catch (e) {}
        }
        var wCok = '';
        var isFl = !!(site.flHost && /\/(vodtype|vodshow)\/124\b/.test(target || ''));
        if (isFl) {
            wCok = readWelfareCookie(site) || syncWelfareCookie(site, target) || '';
            // 福利区用 javaHttp 带 cookie，避免 fetch 丢会话后又进验证页
            if (!html && target) {
                var wg = welfareFetchGate(host, target, wCok);
                html = wg.body || '';
                wCok = mergeCookie(wCok, wg.cookie || '');
                if (wCok) writeWelfareCookie(site, wCok);
            }
            // zstd/压缩脏数据：当作未通过验证，走规则内验证页
            if (html && !isProbablyHtml(html) && !isWelfareGate(html)) {
                html = '';
            }
        }
        if (!html && target) {
            html = wCok ? (fetchPage(target, host, wCok) || '') : fetchSiteHtml(site, target);
        }
        if (!html && /^https?:/i.test(MY_URL || '')) html = fetchSiteHtml(site, MY_URL);
        try { refreshX5WebView(''); } catch (e) {}
        if (isFl && (!html || !isProbablyHtml(html) || isWelfareGate(html))) {
            pushWelfareManual(d, key, site, target || host + '/vodtype/124.html');
            setHomeResult(res);
            return;
        }
        if (isWelfareGate(html)) {
            pushWelfareManual(d, key, site, target || host + '/vodtype/124.html');
            setHomeResult(res);
            return;
        }
        var list = parseList(html, site, host);
        if (!list.length) {
            if (isFl) {
                pushWelfareManual(d, key, site, target || host + '/vodtype/124.html');
                setHomeResult(res);
                return;
            }
            d.push({
                title: '分类无数据 · html=' + ((html || '').length) + (target ? ' · ' + target : ''),
                url: target || host + '/',
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
    // 标题里的 # 会拆坏 lazyRule 参数
    var safeTitle = String(title || '').replace(/#/g, ' ');
    return $('hiker://empty#' + host + '#' + link + '#' + safeTitle + '#' + playType).lazyRule(() => {
        eval(fetch('hiker://files/rules/hksj/hikermovie.js'));
        return omlazy();
    });
}

function extractPlayerAaaa(html) {
    if (!html) return '';
    var i = html.indexOf('player_aaaa');
    if (i < 0) return '';
    var start = html.indexOf('{', i);
    if (start < 0) return '';
    var depth = 0;
    for (var p = start; p < html.length && p < start + 8000; p++) {
        var ch = html.charAt(p);
        if (ch === '{') depth++;
        else if (ch === '}') {
            depth--;
            if (depth === 0) return html.slice(start, p + 1);
        }
    }
    return '';
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
        var detailCok = '';
        var needWelfare = !!(site.flHost && /amj|aimeiju|amj85/i.test(host + pageUrl));
        if (needWelfare) {
            detailCok = readWelfareCookie(site) || syncWelfareCookie(site, pageUrl) || '';
            // 福利站详情强制 javaHttp + cookie，避免裸 fetch 先撞验证页
            if (pageUrl) {
                try {
                    var dj = javaHttp('GET', pageUrl, {
                        'User-Agent': MOBILE_UA,
                        'Cookie': detailCok,
                        'Referer': (site.flHost || host) + '/',
                        'Accept-Encoding': 'identity'
                    }, null);
                    html = (dj && dj.body) || '';
                    if (dj && dj.cookie) {
                        detailCok = mergeCookie(detailCok, dj.cookie);
                        writeWelfareCookie(site, detailCok);
                    }
                } catch (eDj) {}
            }
        }
        if ((!html || html.length < 800) && pageUrl) html = fetchPage(pageUrl, host, detailCok) || html;
        if ((!html || html.length < 800) && site.altHosts) {
            html = fetchSiteHtml(site, pageUrl) || html;
        }
        if (!html || html.length < 800 || !/(play-list|playlist|player_aaaa|channel-tab|stui-content__playlist|stui-play__list|module-play-list|con_playlist|pk-episodes|amj-source)/i.test(html)) {
            try {
                var gr = (getResCode() || '').replace(/<!--([\S\s]*?)-->/g, '');
                if (gr && gr.length > html.length && !isWelfareGate(gr)) html = gr;
            } catch (e) {}
            if (pageUrl && (!html || html.length < 800)) html = fetchPage(pageUrl, host, detailCok) || html;
        }
        try { html = (html || '').replace(/<!--([\S\s]*?)-->/g, ''); } catch (e) {}
        if (isWelfareGate(html) || (needWelfare && html && !isProbablyHtml(html))) {
            pushWelfareManual(d, siteKeyOf({ key: 'amj85', url: host }) || 'amj85', site, pageUrl || host + '/');
            setHomeResult(res);
            return;
        }

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
        // 选择器失败时，直接扫 vodplay 链接（555 福利页结构偶发对不上）
        if (!ep && html) {
            var seenP = {};
            var reP = /href=["']([^"']*\/vodplay\/[^"']+)["'][^>]*?(?:title=["']([^"']*)["']|>([\s\S]*?)<\/a>)/gi;
            var mp;
            var plays = [];
            while ((mp = reP.exec(html)) && plays.length < 40) {
                var hrefP = absUrl(mp[1], host);
                if (!hrefP || seenP[hrefP] || !/^https?:/i.test(hrefP)) continue;
                seenP[hrefP] = 1;
                var tt = ((mp[2] || mp[3] || '') + '').replace(/<[^>]+>/g, '').replace(/^\s+|\s+$/g, '');
                if (/立刻播放|立即播放|播放/.test(tt) && tt.length > 20) tt = tt.replace(/^立刻播放|^立即播放|^播放/, '');
                plays.push({ link: hrefP, title: tt || ('线路' + plays.length) });
            }
            if (plays.length) {
                d.push({ title: '播放列表 · ' + plays.length, url: 'hiker://empty', col_type: 'text_1' });
                for (var pi = 0; pi < plays.length; pi++) {
                    d.push({
                        title: plays[pi].title || ('播放' + (pi + 1)),
                        url: playLazy(host, plays[pi].link, plays[pi].title || movTitle, site.play),
                        col_type: plays.length <= 4 ? 'text_2' : 'flex_button',
                        extra: { id: host + '#' + plays[pi].link, referer: host }
                    });
                    ep++;
                }
            }
        }
        if (!ep) {
            d.push({
                title: '未解析到选集',
                url: 'toast://无选集，请换线路或反馈',
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

        var playCok = '';
        try {
            if (/amj|aimeiju|amj85/i.test(host + src)) {
                playCok = readWelfareCookie(SITES.amj85) || '';
            }
        } catch (ePc) {}
        var html = fetchPage(src, host, playCok) || '';
        if (playCok && (isWelfareGate(html) || !html)) {
            try {
                var pj = javaHttp('GET', src, {
                    'User-Agent': MOBILE_UA,
                    'Cookie': playCok,
                    'Referer': host + '/',
                    'Accept-Encoding': 'identity'
                }, null);
                if (pj && pj.body) html = pj.body;
                if (pj && pj.cookie) writeWelfareCookie(SITES.amj85, mergeCookie(playCok, pj.cookie));
            } catch (ePj) {}
        }
        // MacCMS player_aaaa：用括号计数，避免 vod_data 嵌套截断
        var aaaaJson = extractPlayerAaaa(html);
        if (!aaaaJson) {
            var m0 = html.match(/var\s+player_aaaa\s*=\s*(\{[\s\S]*?\});/);
            if (m0) aaaaJson = m0[1];
        }
        if (aaaaJson || playType == 'aaaa') {
            if (aaaaJson) {
                eval('var player_aaaa=' + aaaaJson);
                var url = player_aaaa.url || '';
                if (player_aaaa.encrypt == '1' || player_aaaa.encrypt == 1) url = unescape(url);
                else if (player_aaaa.encrypt == '2' || player_aaaa.encrypt == 2) url = unescape(base64Decode(url));
                if (url && /^https?:/i.test(url)) return url + '#isVideo=true#';
            }
            // 直抽 url 字段兜底
            var um = html.match(/"url"\s*:\s*"(https?:[^"]+)"/);
            if (um && /m3u8|\.mp4|obj\/tos/i.test(um[1])) return um[1].replace(/\\u002F/g, '/').replace(/\\\//g, '/') + '#isVideo=true#';
        }
        // 页面内 m3u8
        var mm = html.match(/https?:\/\/[^\"\'\s<>]+\.m3u8[^\"\'\s<>]*/);
        if (mm) return mm[0] + '#isVideo=true#';

        // 樱花等：海阔嗅探播放（会短暂打开网页再抽链，不是失败回落）
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
        // 禁止 return 播放页 http：会变成「跳转原站」
        return 'toast://播放解析失败';
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
                        url: $('hiker://empty#noHistory#').rule((name, detailUrl) => {
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
                        url: $('hiker://empty#noHistory#').rule((name, detailUrl) => {
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
