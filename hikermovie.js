// ========== 公共工具（对齐 Feather / 海阔文档：$ / require / getHome）==========
// 文档：https://docs.189.tyrantg.com/docs/hikerview/help_js.html
var RULE_JSON = 'hiker://files/rules/xyq/hikermovie.json';
var RULE_BASES = [
    'https://cdn.jsdelivr.net/gh/wangjiewangjie/VastWorld@main/',
    'https://raw.githubusercontent.com/wangjiewangjie/VastWorld/main/',
    'https://ghfast.top/https://raw.githubusercontent.com/wangjiewangjie/VastWorld/main/'
];

// 模板指纹库：按页面 HTML 模糊打分匹配，新站同模板无需再写 JS
// JSON 只需 url + vodtype + vodhref；engine 可选（强制指定时才用）
var TEMPLATES = [
    {
        key: 'wwgz',
        marks: ['globalPicList', 'leftTabBox', 'numList', 'vod-type-id'],
        cate: '{host}/vod-type-id-{id}-pg-fypage.html',
        search: '{host}/vod-type-id-1-pg-fypage.html?wd={ewd}',
        searchMode: 'rss',
        needMobileUA: true,
        list: 'body&&.globalPicList&&li||body&&.resize_list&&li||body&&#data_list&&li',
        img: 'img&&data-src||data-echo||src',
        title: 'a[title]&&title||.sTit&&Text||a&&Text',
        desc: '.sBottom||.sDes&&Text',
        url: 'a&&href',
        detailTabs: '#leftTabBox&&.hd&&li||#leftTabBox&&ul&&li',
        detailConts: '#leftTabBox&&.numList',
        reverseEps: true
    },
    {
        key: 'auete',
        marks: ['threadlist', 'episode-list', 'player_list', 'play-card', 'auete4so'],
        cate: '{host}/{id}/indexfypage.html[firstPage={host}/{id}/index.html]',
        search: '{host}/auete4so.php?searchword={wd}',
        captcha: 'vdimgck',
        list: 'body&&.threadlist&&li',
        img: 'img&&src||data-src||data-echo',
        title: 'h2&&a&&title||h2&&a&&Text||img&&alt||a[title]&&title',
        desc: '.hdtag||.rating||.date_hits&&Text',
        url: 'a.pic&&href||h2&&a&&href||a&&href||li&&data-href',
        detailTabs: 'body&&.play-card&&.card-header||body&&#player_list&&.card-header',
        detailConts: 'body&&.play-card&&.episode-list||body&&#player_list&&.episode-list||body&&.episode-list'
    },
    {
        key: 'maccms_fed',
        marks: ['fed-list-info', 'fed-play-item', 'fed-tabs-btns', 'fed-deta-info', 'fed-list-pics'],
        cate: '{host}/index.php/vod/type/id/{id}/page/fypage.html[firstPage={host}/index.php/vod/type/id/{id}.html]',
        search: '{host}/index.php/vod/search/page/fypage/wd/{wd}.html',
        list: 'body&&.fed-list-info&&.fed-list-item||body&&.fed-list-info&&li',
        listSearch: 'body&&.fed-deta-info||body&&.fed-list-info&&li',
        img: '.fed-list-pics||.fed-lazy||.lazy||.lazyload||img&&data-original||data-src||src',
        title: '.fed-list-title&&Text||.fed-deta-title&&Text||a[title]&&title||a&&Text',
        desc: '.fed-list-remarks||.fed-deta-tips||.fed-list-desc&&Text',
        url: 'a&&href',
        detailTabs: 'body&&.fed-drop-tops&&.fed-play-btns||body&&.fed-tabs-item&&.fed-play-btns',
        detailConts: 'body&&.fed-play-item',
        epLinks: 'body&&.fed-btns-info',
        play: 'fed'
    },
    {
        key: 'omofun',
        marks: ['daFJ_dJJfFHa', 'FieH_hiaFheE', 'channel-tab', 'play-list-content', 'play-list-content-item'],
        cate: '{host}/type/{id}-fypage.html[firstPage={host}/type/{id}.html]',
        search: '{host}/search/{wd}----------fypage---.html',
        needCookie: true,
        list: 'body&&.daFJ_dJJfFHa&&li||body&&.FieH_hiaFheE&&li',
        img: '.daFJ_dJJfFHa__aAICe||.FieH_hiaFheE__aAICe||.lazyload||a&&data-original||data-src||src',
        title: 'a[title]&&title||h4&&a&&Text||.title&&a&&Text||a&&Text',
        desc: '.aaE_EaDE||.aaE_EaDEa||.aaE_EaDEc||.Iha_Ejhh||.Iha_EjhhE||.Iha_EjhhI&&Text',
        url: 'a&&href',
        detailTabs: 'body&&.channel-tab&&li',
        detailConts: 'body&&.play-list-content',
        play: 'aaaa'
    },
    {
        key: 'vtt6',
        marks: ['icon-bofang-fill', '/type/riman', '/type/guoman', '/detail/', 'bofang'],
        cate: '{host}/type/{id}/fypage/[firstPage={host}/type/{id}/]',
        search: '{host}/search/?wd={ewd}',
        list: 'body&&.main&&li||body&&ul&&li',
        img: '.lazy||img&&data-original||data-src||src',
        title: 'a[title]&&title||img&&alt||a&&Text',
        desc: '.bofang||span&&Text',
        url: 'a&&href',
        detailTabs: 'body&&.playlist&&.tabs&&a',
        detailConts: 'body&&.playlist&&.row',
        play: 'x5'
    },
    {
        key: 'maccms_stui',
        marks: ['stui-vodlist', 'stui-content__playlist', 'stui-vodlist__thumb', 'stui-pannel'],
        cate: '{host}/list/{id}-fypage.html[firstPage={host}/list/{id}.html]',
        search: '{host}/search/{wd}-------------.html',
        list: 'body&&.stui-vodlist&&li',
        listSearch: 'body&&.stui-vodlist&&li||body&&.stui-vodlist__media&&li',
        img: '.lazyload||.lazy||img&&data-original||data-src||src',
        title: 'a[title]&&title||.title&&Text||h4&&Text||a&&Text',
        desc: '.pic-text||.text-muted||span&&Text',
        url: 'a&&href',
        detailTabs: 'body&&.stui-vodlist__head',
        detailConts: 'body&&.stui-content__playlist',
        play: 'aaaa'
    },
    {
        key: 'gangju',
        marks: ['video-pic', 'con_playlist', 'playlist-mobile', 'gico', '/content/'],
        cate: '{host}/type/{id}-fypage.html[firstPage={host}/type/{id}.html]',
        search: '{host}/search/{wd}-------------.html',
        list: 'body&&.video-pic||body&&.col-md-2||body&&.col-xs-4',
        img: '.video-pic||a&&data-original||data-src||src',
        title: 'a[title]&&title||.title&&a&&Text||h5&&a&&Text||a&&Text',
        desc: '.note||.text-bg-r||span&&Text',
        url: '.video-pic&&href||a&&href',
        detailTabs: 'body&&.playlist&&.gico||body&&a.gico',
        detailConts: 'body&&ul[id*=con_playlist]||body&&.playlist&&ul',
        play: 'aaaa'
    }
];

// 通用兜底（未命中模板时按区分度依次尝试）
var FUZZY_LIST = 'body&&.globalPicList&&li||body&&.fed-list-info&&li||body&&.stui-vodlist&&li||body&&.myui-vodlist&&li||body&&.module-item||body&&.module-poster-item||body&&.hl-list-item||body&&.hl-vod-list&&li||body&&.ewave-vodlist&&li||body&&.public-list-box||body&&.packing-list&&li||body&&.van-list&&li||body&&.daFJ_dJJfFHa&&li||body&&.FieH_hiaFheE&&li||body&&.threadlist&&li||body&&.video-pic||body&&.box-video||body&&.vodlist&&li||body&&.c2_list&&li||body&&.v_list&&li';
var FUZZY_IMG = '.lazyload||.lazy||.lazyload_img||.video-pic||.module-item-pic||.hl-item-thumb||img&&data-original||data-src||data-echo||data-bg||data-url||src';
var FUZZY_TITLE = 'a[title]&&title||.fed-list-title&&Text||.module-item-title&&Text||.hl-item-title&&Text||.sTit&&Text||.vod-name&&Text||.name&&Text||h4&&a&&Text||h3&&a&&Text||h2&&a&&Text||.title&&a&&Text||.title&&Text||img&&alt||a&&Text';
var FUZZY_DESC = '.pic-text||.pic-text-right||.module-item-note||.module-item-text||.hl-item-content||.note||.remarks||.v_note||.jidi||.sBottom||.fed-list-remarks||.text-right||span&&Text';
var FUZZY_URL = 'a&&href||.video-pic&&href||.module-item-pic&&href||.hl-item-thumb&&href';
var FUZZY_TABS = 'body&&.channel-tab&&li||body&&.anthology-tab&&a||body&&.module-tab-item||body&&.hl-plays-from&&a||body&&.stui-vodlist__head||body&&.fed-drop-tops&&.fed-play-btns||body&&.playfrom&&li||body&&.from_list&&li||#leftTabBox&&ul&&li||body&&.playlist&&.tabs&&a||body&&a.gico||body&&.play-card&&.card-header||body&&.play_source_tab&&a';
var FUZZY_CONTS = 'body&&.play-list-content||body&&.anthology-list-play||body&&.module-play-list-content||body&&.module-player-list||body&&.hl-plays-list||body&&.stui-content__playlist||body&&.myui-content__list||body&&.ewave-content__playlist||body&&.fed-play-item||body&&#play_link&&li||#leftTabBox&&.numList||body&&.playlist&&.row||body&&ul[id*=con_playlist]||body&&.content_playlist||body&&.videourl||body&&.episode-list||body&&.playNumList';

var _siteMapCache = null;
var _tplCache = {};
var _homeHtmlCache = {};
var _tplByKey = {};
for (var _ti = 0; _ti < TEMPLATES.length; _ti++) _tplByKey[TEMPLATES[_ti].key] = TEMPLATES[_ti];

function loadSiteMap() {
    if (_siteMapCache) return _siteMapCache;
    var map = {};
    try {
        var json = JSON.parse(fetch(RULE_JSON, {}));
        var tabs = (json && json.data) || [];
        for (var i = 0; i < tabs.length; i++) {
            var list = tabs[i].list || [];
            for (var j = 0; j < list.length; j++) {
                var s = list[j];
                if (!s || !s.url) continue;
                var host = (s.url + '').replace(/\/$/, '');
                map[host] = s;
                try {
                    map[getDomin(host)] = s;
                } catch (e) {}
            }
        }
    } catch (e) {}
    _siteMapCache = map;
    return map;
}

function getSiteByHost(host) {
    host = (host || '').replace(/\/$/, '');
    var map = loadSiteMap();
    if (map[host]) return map[host];
    var dom = getDomin(host);
    if (map[dom]) return map[dom];
    for (var k in map) {
        if (host.indexOf(k.replace(/^https?:\/\//, '')) != -1 || k.indexOf(dom) != -1) return map[k];
    }
    return null;
}

function scoreTemplate(html, tpl) {
    if (!html || !tpl || !tpl.marks) return 0;
    var score = 0;
    for (var i = 0; i < tpl.marks.length; i++) {
        var m = tpl.marks[i];
        if (html.indexOf(m) != -1) score += (html.split(m).length - 1) > 3 ? 3 : 1;
    }
    return score;
}

// 模糊匹配：对 HTML 打分选最高模板
function detectTemplate(html) {
    if (!html) return null;
    var best = null;
    var bestScore = 0;
    for (var i = 0; i < TEMPLATES.length; i++) {
        var s = scoreTemplate(html, TEMPLATES[i]);
        if (s > bestScore) {
            bestScore = s;
            best = TEMPLATES[i];
        }
    }
    return bestScore > 0 ? best : null;
}

function getTemplateByKey(key) {
    return key ? (_tplByKey[key] || null) : null;
}

// hostOrKey 可为模板 key 或站点 host
function getTpl(hostOrKey, html, site) {
    var k = (hostOrKey || '') + '';
    return getTemplateByKey(k) || resolveTemplate(k, html, site) || null;
}

function fetchHomeHtml(host) {
    host = (host || '').replace(/\/$/, '');
    if (_homeHtmlCache[host]) return _homeHtmlCache[host];
    var html = '';
    try {
        html = fetch(host + '/', {
            headers: {
                'User-Agent': MOBILE_UA,
                'Referer': host + '/'
            },
            timeout: 10000
        }) || '';
        html = passHtmlGuard(html, host + '/', {
            base: host
        });
    } catch (e) {}
    _homeHtmlCache[host] = html;
    return html;
}

// 解析站点模板：缓存 > JSON.engine 强制 > HTML 指纹模糊匹配
function resolveTemplate(host, html, site) {
    host = (host || '').replace(/\/$/, '');
    var dom = '';
    try {
        dom = getDomin(host);
    } catch (e) {
        dom = host;
    }
    if (_tplCache[host] || _tplCache[dom]) {
        return getTemplateByKey(_tplCache[host] || _tplCache[dom]);
    }
    site = site || getSiteByHost(host) || getSiteByHost(dom);
    if (site && site.engine) {
        var forced = getTemplateByKey(site.engine);
        if (forced) {
            _tplCache[host] = forced.key;
            _tplCache[dom] = forced.key;
            return forced;
        }
    }
    if (!html) html = _homeHtmlCache[host] || _homeHtmlCache[dom] || '';
    if (!html && host.indexOf('http') == 0) html = fetchHomeHtml(host);
    var tpl = detectTemplate(html);
    if (tpl) {
        _tplCache[host] = tpl.key;
        _tplCache[dom] = tpl.key;
    }
    return tpl;
}

function fillTpl(tpl, vars) {
    var out = tpl || '';
    for (var k in vars) {
        out = out.split('{' + k + '}').join(vars[k] == null ? '' : vars[k]);
    }
    return out;
}

// 从首页链接模糊推断分类 URL（命中则优先于模板默认）
function inferCateFromHtml(host, id, html) {
    if (!html || !id) return '';
    host = host.replace(/\/$/, '');
    var idEsc = (id + '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var patterns = [
        new RegExp('href=["\']([^"\']*vod-type-id-' + idEsc + '[^"\']*)["\']', 'i'),
        new RegExp('href=["\']([^"\']*/vod/type/id/' + idEsc + '[^"\']*)["\']', 'i'),
        new RegExp('href=["\']([^"\']*/list/' + idEsc + '(?:\\.html|-[^"\']*)?)["\']', 'i'),
        new RegExp('href=["\']([^"\']*/type/' + idEsc + '(?:\\.html|-[^"\']*|/[^"\']*)?)["\']', 'i'),
        new RegExp('href=["\']([^"\']*/' + idEsc + '/(?:index\\.html)?)["\']', 'i'),
        new RegExp('href=["\']([^"\']*/type/' + idEsc + '/)["\']', 'i')
    ];
    for (var i = 0; i < patterns.length; i++) {
        var m = html.match(patterns[i]);
        if (!m) continue;
        var href = m[1].replace(/&amp;/g, '&');
        if (/javascript:/i.test(href)) continue;
        // 把分页位归一成 fypage 模板
        var full = absUrl(href, host + '/');
        // /list/1-2.html → /list/1-fypage.html[firstPage=/list/1.html]
        var mList = full.match(/^(https?:\/\/[^\/]+)\/list\/([^\/\-]+)(?:-(\d+))?\.html/i);
        if (mList) {
            return mList[1] + '/list/' + mList[2] + '-fypage.html[firstPage=' + mList[1] + '/list/' + mList[2] + '.html]';
        }
        var mType = full.match(/^(https?:\/\/[^\/]+)\/type\/([^\/]+?)(?:-(\d+))?\.html/i);
        if (mType) {
            return mType[1] + '/type/' + mType[2] + '-fypage.html[firstPage=' + mType[1] + '/type/' + mType[2] + '.html]';
        }
        var mTypeDir = full.match(/^(https?:\/\/[^\/]+)\/type\/([^\/]+)\/?(?:\d+\/)?$/i);
        if (mTypeDir) {
            return mTypeDir[1] + '/type/' + mTypeDir[2] + '/fypage/[firstPage=' + mTypeDir[1] + '/type/' + mTypeDir[2] + '/]';
        }
        var mFed = full.match(/^(https?:\/\/[^\/]+)(\/index\.php\/vod\/type\/id\/[^\/]+)/i);
        if (mFed) {
            var basePath = mFed[2].replace(/\/page\/\d+/, '');
            return mFed[1] + basePath + '/page/fypage.html[firstPage=' + mFed[1] + basePath + '.html]';
        }
        var mWw = full.match(/vod-type-id-([^\/\-]+)/i);
        if (mWw) {
            return host + '/vod-type-id-' + mWw[1] + '-pg-fypage.html';
        }
        var mAu = full.match(/^(https?:\/\/[^\/]+)\/([^\/]+)\/(?:index\d*\.html)?$/i);
        if (mAu && /Movie|Tv|Zy|Dm|qita/i.test(mAu[2])) {
            return mAu[1] + '/' + mAu[2] + '/indexfypage.html[firstPage=' + mAu[1] + '/' + mAu[2] + '/index.html]';
        }
        return full;
    }
    return '';
}

function inferSearchFromHtml(host, wd, html) {
    if (!html) return '';
    host = host.replace(/\/$/, '');
    var ewd = encodeURIComponent(wd);
    // form action
    var fm = html.match(/<form[^>]+(?:search|searchword|wd)[^>]*action=["']([^"']+)["']/i) ||
        html.match(/<form[^>]+action=["']([^"']*search[^"']*)["']/i);
    if (fm) {
        var action = absUrl(fm[1].replace(/&amp;/g, '&'), host + '/');
        if (/auete4so|searchword=/i.test(action)) {
            return host + '/auete4so.php?searchword=' + wd;
        }
        if (/[?&]wd=|\?wd/i.test(action) || /\/search\/?\s*$/i.test(action) || /\/search\/$/.test(action)) {
            return host + '/search/?wd=' + ewd;
        }
        if (/-------------/.test(action) || /search\//i.test(action)) {
            // MacCMS 伪静态
            if (/----------/.test(action) || html.indexOf('----------') != -1) {
                return host + '/search/' + wd + '----------fypage---.html';
            }
            return host + '/search/' + wd + '-------------.html';
        }
        if (/vod\/search/i.test(action)) {
            return host + '/index.php/vod/search/page/fypage/wd/' + wd + '.html';
        }
    }
    if (/auete4so\.php/.test(html)) return host + '/auete4so.php?searchword=' + wd;
    if (/\/index\.php\/vod\/search\//.test(html)) return host + '/index.php/vod/search/page/fypage/wd/' + wd + '.html';
    if (/\/search\/[^"']*----------/.test(html)) return host + '/search/' + wd + '----------fypage---.html';
    if (/\/search\/[^"']*-------------/.test(html)) return host + '/search/' + wd + '-------------.html';
    if (/action=["']\/search\/?["']/.test(html) || /\/search\/\?wd=/.test(html)) return host + '/search/?wd=' + ewd;
    return '';
}

function buildCateUrl(host, id, engine, html) {
    host = (host || '').replace(/\/$/, '');
    if (!html) html = _homeHtmlCache[host] || '';
    var inferred = inferCateFromHtml(host, id, html);
    if (inferred) return inferred;
    var eng = getTpl(engine || host, html);
    if (!eng || !eng.cate) return '';
    return fillTpl(eng.cate, { host: host, id: id });
}

function buildSearchUrl(host, wd, engine, html) {
    host = (host || '').replace(/\/$/, '');
    if (!html) html = _homeHtmlCache[host] || '';
    var inferred = inferSearchFromHtml(host, wd, html);
    if (inferred) return inferred;
    var eng = getTpl(engine || host, html);
    if (!eng || !eng.search) return host;
    return fillTpl(eng.search, { host: host, wd: wd, ewd: encodeURIComponent(wd) });
}

function firstPdfa(html, sel) {
    if (!html || !sel) return [];
    var parts = (sel + '').split('||');
    for (var i = 0; i < parts.length; i++) {
        var s = parts[i].replace(/^\s+|\s+$/g, '');
        if (!s) continue;
        try {
            var arr = pdfa(html, s);
            if (arr && arr.length) return arr;
        } catch (e) {}
    }
    return [];
}

function parseListBySite(html, host, mode, engine) {
    var eng = getTpl(engine || host, html) || {};
    var sel = (mode == 'search' && eng.listSearch) ? eng.listSearch : (eng.list || FUZZY_LIST);
    var list = firstPdfa(html, sel);
    if (!list.length && sel != FUZZY_LIST) list = firstPdfa(html, FUZZY_LIST);
    return list || [];
}

function extractVodBySite(item, host, engine) {
    var eng = getTpl(engine || host) || {};
    var img = '', title = '', desc = '', url = '';
    try {
        img = pdfh(item, eng.img || FUZZY_IMG);
        title = pdfh(item, eng.title || FUZZY_TITLE);
        desc = pdfh(item, eng.desc || FUZZY_DESC);
        try { url = pd(item, (eng.url || FUZZY_URL).split('||')[0]); } catch (e) {}
        if (!url) url = pdfh(item, eng.url || FUZZY_URL);
    } catch (e) {}
    return {
        img: absUrl(img, host),
        title: title,
        desc: desc || '',
        url: absUrl(url, host)
    };
}

function pushVodCard(d, vod, col) {
    if (!vod || !vod.title) return;
    var item = {
        title: vod.title,
        url: detailRule(vod.url, vod.title),
        desc: vod.desc,
        extra: { longClick: searchLongClick(vod.title), key: vod.title },
        col_type: vod.img ? (col || 'movie_3_marquee') : 'text_center_1'
    };
    if (vod.img) item.pic_url = imgReferer(vod.img, getDomin(vod.url) || vod.url);
    d.push(item);
}

function fillVodList(d, html, host, col, engine) {
    var list = parseListBySite(html, host, 'list', engine);
    for (var i = 0; i < list.length; i++) {
        pushVodCard(d, extractVodBySite(list[i], host, engine), col);
    }
    return list.length;
}

function getDomin(url) {
    try {
        if (typeof getHome == 'function') {
            return getHome(url || MY_URL);
        }
    } catch (e) {}
    var u = url || (typeof MY_URL != 'undefined' ? MY_URL : '');
    var m = (u + '/').match(/([\S]*?:\/\/[\S]*?)\//);
    return m ? m[1] : u;
}

function absUrl(url, base) {
    if (!url) return '';
    if (url.substring(0, 4) == 'http' || url.substring(0, 4) == 'hike') return url;
    return (base || '') + url;
}

function imgReferer(img, base) {
    if (!img) return '';
    if (/imgdb/.test(img)) return img + '@Referer=';
    return img + '@Referer=' + (base || img);
}

function detailRule(url, title) {
    return $(absUrl(url)).rule((t) => {
        require('hiker://files/rules/xyq/hikermovie.js');
        omerj(t);
    }, title || '');
}

function searchLongClick(title) {
    return [{
        title: JSON.parse(getRule()).title + '搜索',
        js: $.toString((title) => {
            var link = 'hiker://empty#noRecordHistory#$$$hiker://files/rules/xyq/hikermovie.json$$$' + title + '$$$fypage$$$';
            return $(link).rule(() => {
                setPageTitle('搜索');
                require('hiker://files/rules/xyq/hikermovie.js');
                hiksearch();
            });
        }, title),
        extra: {
            pageTitle: '搜索'
        }
    }];
}

function sortToggleRule() {
    return $('#noLoading#').lazyRule(() => {
        putVar('hikermsort', getVar('hikermsort', '1') == '1' ? '0' : '1');
        refreshPage(false);
        return 'toast://排序已切换';
    });
}

function playLazyRule(omdomin, link, title) {
    // host 放最后，避免 :port$$$ 被解析成非法端口
    return $('hiker://empty$$$' + link + '$$$' + title + '$$$' + omdomin).lazyRule(() => {
        require('hiker://files/rules/xyq/hikermovie.js');
        return omlazy();
    });
}

function tipCard(title, url) {
    return { title: title, url: url || '', desc: '', pic_url: '', col_type: 'text_1' };
}

// 统一报错：日志 + 页面可见文案，方便复制粘贴
function logErr(tag, e) {
    var msg = '';
    try {
        msg = (e && (e.message || e.toString())) || (e + '');
    } catch (e2) {
        msg = 'unknown error';
    }
    var stack = '';
    try {
        if (e && e.stack) stack = e.stack;
    } catch (e3) {}
    var text = '[hikermovie][' + tag + '] ' + msg + (stack ? '\n' + stack : '');
    try { log(text); } catch (e4) {}
    return text;
}

function errCard(tag, e) {
    var full = logErr(tag, e);
    var short = '';
    try {
        short = (e && (e.message || e.toString())) || '';
    } catch (e2) {}
    return {
        title: '规则报错 · ' + tag + (short ? ' · ' + short : ''),
        desc: full,
        url: 'hiker://empty',
        col_type: 'long_text'
    };
}

function parseWwgzSearch(url) {
    var wd = '', page = 1;
    try {
        var wm = (url || '').match(/[?&]wd=([^&#]+)/);
        if (wm) wd = decodeURIComponent(wm[1].replace(/\+/g, ' '));
    } catch (e) {}
    try {
        var pm = (url || '').match(/-pg-(\d+)\.html/);
        if (pm) page = parseInt(pm[1], 10) || 1;
    } catch (e) {}
    return { wd: wd, page: page };
}

var CAPTCHA_HINT = /请输入验证码|首次搜索需要输入验证码|此数据需要输入验证码|验证后查看搜索结果|访问此数据需要输入验|正确的验证码继续访问|需要先输入验证码/;
var OMO_VERIFY_HINT = /系统安全验证|因访问过多|继续访问/;

// 统一绕过 btwaf / 人机滑动 / _guard / GE DDoS
function passHtmlGuard(html, url, opts) {
    opts = opts || {};
    if (!html) return html || '';
    var base = opts.base || getDomin(url);
    var cookiePrefix = opts.cookiePrefix || '';
    try {
        if (html.indexOf('检测中') != -1) {
            html = fetch(url + '?btwaf' + html.match(/btwaf(.*?)\"/)[1], {
                headers: {
                    'User-Agent': MOBILE_UA
                }
            });
        }
    } catch (e) {}
    try {
        if (html.indexOf('人机身份验证，请完成以下操作') > -1 || html.indexOf('人机识别，请稍等') > -1) {
            eval(getItem('huadong').replace(/refre/g, base));
            html = fetch(url, {
                headers: {
                    'User-Agent': MOBILE_UA,
                    'Cookie': cok,
                    'Referer': base
                }
            });
        }
    } catch (e) {}
    try {
        if (html.indexOf('js=click_html') != -1 || html.indexOf('_guard/auto.js') != -1) {
            var point = {
                x: 616,
                y: 288,
                a: 904
            };
            var cook = '';
            var aa = getCookie(url);
            var jsf = request(base + '/_guard/encrypt.js');
            eval(jsf);
            var guardToken = aa.split('guard=').pop().split(';').shift();
            if (guardToken) {
                var keyPart = guardToken.substr(0, 8);
                var md5key = cdn.MD5(keyPart);
                cook = 'guardret=' + cdn.centos.encrypt(JSON.stringify(point), md5key, {
                    iv: md5key
                }).toString();
            } else {
                log('重载');
            }
            html = fetch(url, {
                headers: {
                    'User-Agent': MOBILE_UA,
                    'Cookie': cookiePrefix + aa + '; ' + cook
                }
            });
        }
    } catch (e) {}
    try {
        if (html.indexOf('请稍等5秒钟左右') != -1 && html.indexOf('提供DDoS防护') != -1) {
            eval(pdfh(html, 'head&&script&&Html').split('function')[0]);
            var e = getCookie(url);
            if (null != e) {
                for (var t = e.toString().split(';'), n = '', o = 0; o < t.length; o++) {
                    var i = (e = t[o].trim()).split('=');
                    if (2 == i.length && i[0] == cpk) {
                        n = i[1];
                        break;
                    }
                }
                if (0 != n.length) {
                    for (var a = 0, o = 0; o < n.length; o++) {
                        var ch = n[o];
                        /^[a-zA-Z0-9]$/.test(ch) && (a += n.charCodeAt(o) * (nonce + o));
                    }
                    request(url, {
                        headers: {
                            'X-GE-UA-Step': step,
                            'Referer': url,
                            'Cookie': 'ge_ua_p=' + n
                        },
                        body: 'sum=' + a + '&nonce=' + nonce,
                        method: 'POST'
                    });
                }
            }
            html = request(url, {
                headers: {
                    'Cookie': getCookie(url),
                    'Referer': url
                }
            });
        }
    } catch (e) {}
    return html;
}

function hikhmrule() {
    var res = {};
    var d = [];
    try {
        var json = JSON.parse(fetch(RULE_JSON, {}));
        var decText = getMyVar('xyqxqystext', '');
        d.push({
            title: '搜索',
            url: $.toString(() => {
                var link = 'hiker://empty#noRecordHistory#$$$hiker://files/rules/xyq/hikermovie.json$$$' + input + '$$$fypage$$$';
                return $(link).rule(() => {
                    require('hiker://files/rules/xyq/hikermovie.js');
                    hiksearch();
                });
            }),
            extra: {
                onChange: "putMyVar('xyqxqystext',input)",
                defaultValue: decText,
                titleVisible: true
            },
            col_type: 'input'
        });
        d.push({
            title: '聚合搜索',
            url: $('#noLoading#').lazyRule(() => {
                var kw = getMyVar('xyqxqystext', '');
                if (!kw) return 'toast://请先输入关键词';
                var link = 'hiker://empty#noRecordHistory#$$$hiker://files/rules/xyq/hikermovie.json$$$' + kw + '$$$fypage$$$';
                return $(link).rule(() => {
                    require('hiker://files/rules/xyq/hikermovie.js');
                    hiksearch();
                });
            }),
            col_type: 'flex_button'
        });
        d.push({
            title: '更新规则',
            url: $('#noLoading#').lazyRule((bases) => {
                var dir = 'hiker://files/rules/xyq/';
                var opt = {
                    headers: {
                        'User-Agent': MOBILE_UA,
                        'Cache-Control': 'no-cache',
                        Pragma: 'no-cache'
                    },
                    timeout: 20000
                };
                function pull(url, check) {
                    try {
                        var content = fetch(url + '?t=' + Date.now(), opt);
                        if (content && content.substring(0, 5) != 'error' && check(content)) {
                            return content;
                        }
                    } catch (e) {
                        logErr('hikhmrule.pull', e);
                    }
                    return '';
                }
                for (var i = 0; i < bases.length; i++) {
                    var rulejs = pull(bases[i] + 'hikermovie.js', function (c) {
                        return c.search(/lazyRule/) != -1;
                    });
                    var rulejson = pull(bases[i] + 'hikermovie.json', function (c) {
                        return c.search(/\"vodhref\"/) != -1;
                    });
                    if (rulejs && rulejson) {
                        writeFile(dir + 'hikermovie.js', rulejs);
                        writeFile(dir + 'hikermovie.json', rulejson);
                        try {
                            eval(rulejs);
                            if (typeof hikerpre == 'function') hikerpre();
                        } catch (e) {
                            logErr('hikhmrule.eval', e);
                        }
                        refreshPage(false);
                        return 'toast://更新成功';
                    }
                }
                return 'toast://更新失败，请检查网络或代理';
            }, RULE_BASES),
            col_type: 'flex_button'
        });
        for (var i = 0; i < json.data.length; i++) {
            var tab = json.data[i];
            for (var k = 0; k < tab.list.length; k++) {
                var list = tab.list[k];
                d.push({
                    title: list.title,
                    img: list.ico + '@Referer=',
                    // 站点 URL 放最后，避免 host:port$$页码 被当成非法端口去请求
                    url: 'hiker://empty$$fypage$$' + list.vodtype + '$$' + list.vodhref + '$$' + list.url,
                    col_type: 'icon_4_card'
                });
            }
        }
    } catch (e) {
        d.push(errCard('hikhmrule', e));
    }
    res.data = d;
    setHomeResult(res);
}
function hikhmerj() {
    var res = {};
    var d = [];
    try {
        // MY_URL: hiker://empty$$页码$$vodtype$$vodhref$$https://host:port
        var parts = MY_URL.split('$$');
        var pn = parts[1];
        var vtype = parts[2];
        var vhref = parts[3];
        var spl = (parts.slice(4).join('$$') || '').replace(/\/$/, '');
        if (pn == 1) {
            // 先拉首页做指纹匹配，并用来模糊推断分类/搜索 URL
            var html = passHtmlGuard(request(spl, {}), spl, {
                base: spl
            });
            _homeHtmlCache[spl] = html;
            var tpl = resolveTemplate(spl, html);
            var engine = tpl ? tpl.key : '';
            var clst = vtype.split('&');
            var clsu = vhref.split('&');
            for (var i = 0; i < clst.length; i++) {
                var url = buildCateUrl(spl, clsu[i], engine, html);
                if (!url) continue;
                d.push({
                    title: clst[i],
                    url: $(url).rule((engine) => {
                        require('hiker://files/rules/xyq/hikermovie.js');
                        clsrule(engine);
                    }, engine),
                    col_type: clst.length >= 16 ? 'scroll_button' : 'flex_button'
                });
            }
            d.push({
                col_type: 'line'
            });
            fillVodList(d, html, spl, 'movie_3_marquee', engine);
        }
    } catch (e) {
        d.push(errCard('hikhmerj', e));
    }
    res.data = d;
    setHomeResult(res);
}

function clsrule(engine) {
    var res = {};
    var d = [];
    try {
        var spl = getDomin(MY_URL);
        var html = passHtmlGuard(getResCode(), MY_URL, { base: spl });
        var tpl = getTpl(engine || spl, html);
        refreshX5WebView('');
        fillVodList(d, html, spl, 'movie_3_marquee', tpl ? tpl.key : engine);
    } catch (e) {
        d.push(errCard('clsrule', e));
    }
    res.data = d;
    setHomeResult(res);
}

// Omofun 搜索安全验证：从验证页取出 refresh() token，提交后拿到可搜索 cookie
function omofunaPassVerify(dom, searchUrl) {
    try {
        var probe = searchUrl || (dom + '/search/a----------1---.html');
        var baseOpt = {
            headers: {
                'User-Agent': MOBILE_UA,
                'Referer': dom + '/'
            },
            timeout: 10000
        };
        fetch(dom + '/', baseOpt);
        var vhtml = fetch(probe, baseOpt);
        var cok = '';
        try {
            cok = getCookie(dom) || getCookie(probe) || '';
        } catch (e) {}
        if (!OMO_VERIFY_HINT.test(vhtml) && !/function\s+refresh/.test(vhtml)) {
            return cok;
        }
        var scripts = vhtml.match(/<script>([\s\S]*?)<\/script>/g);
        if (!scripts || !scripts.length) return '';
        var code = scripts[scripts.length - 1].replace(/<\/?script>/gi, '');
        if (code.indexOf('refresh') < 0) return '';
        var token = '';
        (function () {
            var $ = function (x) {
                if (typeof x == 'function') {
                    try {
                        x();
                    } catch (e) {}
                    return $;
                }
                return {
                    focus: function () {
                        return this;
                    },
                    bind: function () {
                        return this;
                    },
                    click: function () {
                        return this;
                    },
                    val: function () {
                        return '';
                    }
                };
            };
            var MAC = {
                Ajax: function () {},
                Verify: {
                    Refresh: function () {}
                }
            };
            var maccms = {
                path: ''
            };
            eval(code);
            if (typeof refresh == 'function') {
                token = refresh();
            }
        })();
        if (!token) return '';
        try {
            cok = getCookie(dom) || getCookie(probe) || cok;
        } catch (e) {}
        var r = fetch(dom + '/index.php/ajax/verify_check?type=search', {
            headers: {
                'User-Agent': MOBILE_UA,
                'X-Requested-With': 'XMLHttpRequest',
                'Referer': probe,
                'Cookie': cok,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'i=' + encodeURIComponent(token),
            method: 'POST',
            timeout: 10000
        });
        try {
            var j = typeof r == 'string' ? JSON.parse(r) : r;
            if (!j || j.code != 1) return '';
        } catch (e) {
            if (!(r && (r + '').indexOf('"code":1') >= 0)) return '';
        }
        try {
            cok = getCookie(dom) || getCookie(probe) || cok;
        } catch (e) {}
        if (cok && cok.indexOf('searchneed') < 0) {
            cok = 'searchneed=ok; ' + cok;
        }
        return cok || 'searchneed=ok';
    } catch (e) {
        try {
            log('omofunaPassVerify:' + e.message);
        } catch (e2) {}
        return '';
    }
}

// 旺旺影视站内搜索模板已失效（页面写明升级中），用分类页+RSS 按关键词筛选；须移动 UA
function wwgzFillSearch(d, dom, wd, page, siteTitle) {
    siteTitle = siteTitle || '';
    page = parseInt(page, 10) || 1;
    if (!wd) {
        d.push({
            title: (siteTitle ? siteTitle + ' ' : '') + '请输入关键词',
            col_type: 'text_1'
        });
        return;
    }
    var seen = {};
    var hit = 0;
    var opt = {
        headers: {
            'User-Agent': MOBILE_UA,
            'Referer': dom + '/'
        },
        timeout: 10000
    };

    function pushOne(title, url, img, desc) {
        if (!title || title.indexOf(wd) < 0) return;
        if (!url) return;
        url = url.replace(/^http:\/\/vip\.wwgz\.cn:5200/i, dom).replace(/^http:\/\/vip\.wwgz\.cn/i, dom);
        if (url.substring(0, 4) != 'http') url = dom + url;
        if (seen[url]) return;
        seen[url] = 1;
        hit++;
        var tup = '';
        if (img) {
            if (img.substring(0, 4) != 'http') img = dom + img;
            tup = img + '@Referer=' + dom;
        }
        d.push({
            title: siteTitle ? (title.replace(wd, '「' + wd + '」') + '\n' + siteTitle) : (title + (desc ? ' ' + desc : '')),
            pic_url: tup,
            desc: siteTitle ? '' : (desc || ' '),
            url: detailRule(url, title),
            col_type: tup ? 'movie_1_vertical_pic' : 'text_1'
        });
    }

    var rssPages = page == 1 ? [1, 2, 3, 4, 5, 6, 8, 10] : [page, page + 1, page + 2];
    for (var ri = 0; ri < rssPages.length; ri++) {
        try {
            var rss = fetch(dom + '/map-rss-pg-' + rssPages[ri] + '.html', opt);
            if (!rss || rss.indexOf('<item>') < 0) continue;
            var items = rss.match(/<item>[\s\S]*?<\/item>/g) || [];
            for (var j = 0; j < items.length; j++) {
                var it = items[j];
                var title = '';
                var tm = it.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
                if (tm) title = tm[1];
                else {
                    tm = it.match(/<title>([\s\S]*?)<\/title>/);
                    if (tm) title = tm[1];
                }
                var link = '';
                var lm = it.match(/<link>([\s\S]*?)<\/link>/);
                if (lm) link = lm[1].replace(/\s+/g, '');
                pushOne(title, link, '', '');
            }
        } catch (e) {}
    }

    var types = [1, 2, 3, 4, 26];
    for (var ti = 0; ti < types.length; ti++) {
        try {
            var html = fetch(dom + '/vod-type-id-' + types[ti] + '-pg-' + page + '.html', opt);
            if (!html || html.length < 800 || /404/.test(html.substring(0, 200))) continue;
            var list = parseListBySite(html, dom, 'list', 'wwgz');
            for (var i = 0; i < list.length; i++) {
                var vod = extractVodBySite(list[i], dom, 'wwgz');
                pushOne(vod.title, vod.url, vod.img, vod.desc);
            }
        } catch (e) {}
    }

    if (hit < 1) {
        d.push(tipCard((siteTitle ? siteTitle + ' ' : '') + '未找到「' + wd + '」（源站搜索升级中，已用分类/RSS 检索）', dom));
    }
}

function hiksearch() {
    var res = {};
    var d = [];
    try {
    var spl = MY_URL.split('$$$');
    var json = JSON.parse(fetch(spl[1], {}));
    for (var i = 0; i < json.data.length; i++) {
        var list = json.data[i].list;
        d.push({
            title: '点击开始聚合搜索：' + spl[2],
            url: $('hiker://empty#noHistory#$$$hiker://files/rules/xyq/hikermovie.js$$$' + spl[2] + '$$$fypage').rule((list) => {
                require('hiker://files/rules/xyq/hikermovie.js');
                var items = [];
                var spl = MY_URL.split('$$$');
                var ssxc = 5;
                var tout = 3000;
                    var num = spl[3];
                    var le = num * ssxc;
                    var Data = [];
                    var Tit = [];
                    let pageid = "__xqys" + num;
                    try {
                        for (var j = le - ssxc; j < le; j++) {
                            if (j < list.length) {
                                var title = list[j].title;
                                var host = getDomin(list[j].url);
                                var homeHtml = fetchHomeHtml(host);
                                var tpl = resolveTemplate(host, homeHtml, list[j]);
                                var eng = tpl || {};
                                var key = eng.key || '';
                                var Url = buildSearchUrl(host, spl[2], key, homeHtml).replace(/fypage/g, '1');
                                var hdr = { "User-Agent": MOBILE_UA };
                                var to = tout;
                                if (eng.searchMode == 'rss' || eng.needMobileUA || eng.needCookie) {
                                    hdr.Referer = host + '/';
                                    to = eng.needCookie ? 10000 : 15000;
                                }
                                if (eng.needCookie) {
                                    var omock = omofunaPassVerify(host, Url);
                                    if (omock) writeFile('hiker://files/rules/xyq/xqyscookie/' + title + 'cookie.txt', omock);
                                    hdr.Cookie = omock || fetch("hiker://files/rules/xyq/xqyscookie/" + title + "cookie.txt", {});
                                }
                                Data.push({ url: Url, options: { headers: hdr, timeout: to } });
                                Tit.push({ tit: title });
                            }
                        }
                    } catch (e) {
                        logErr('hiksearch.batch', e);
                    }

                    if (Data.length <= 0) {
                        setResult([]);
                    } else {
                        items.push({
                            title: "正在加载第" + MY_PAGE + "页，进度：1/" + Data.length,
                            url: "",
                            col_type: "text_center_1",
                            desc: "",
                            pic_url: "",
                            extra: {
                                id: pageid
                            }
                        });
                        setResult(items);
                        let tasks = [];
                        for (let k in Data) {
                            let it = Data[k];
                            tasks.push({
                                func: function(param) {
                                    let d = [];
                                    var sear = $('').rule((cktitle) => {
                                        require('hiker://files/rules/xyq/hikermovie.js');
                                        hikseaerji();
                                    }, param.tit.tit);
                                    if (/wwgz/.test(param.it.url)) {
                                        var qs = parseWwgzSearch(param.it.url);
                                        wwgzFillSearch(d, getDomin(param.it.url), qs.wd, qs.page, param.tit.tit);
                                        return d;
                                    }
                                    let html = fetch(param.it.url, param.it.options);
                                    if (html == "" || html == null || html.substring(0, 5) == 'error') {
                                        d.push(tipCard(param.tit.tit + ' 未找到结果，点击查看原站', param.it.url));
                                    } else if (/omofuna/.test(param.it.url) && OMO_VERIFY_HINT.test(html)) {
                                        var omdomin = getDomin(param.it.url);
                                        var omock = omofunaPassVerify(omdomin, param.it.url);
                                        if (omock) {
                                            writeFile('hiker://files/rules/xyq/xqyscookie/' + param.tit.tit + 'cookie.txt', omock);
                                            html = fetch(param.it.url, {
                                                headers: { "User-Agent": MOBILE_UA, "Referer": omdomin + '/', "Cookie": omock },
                                                timeout: 10000
                                            });
                                        }
                                        if (OMO_VERIFY_HINT.test(html)) {
                                            d.push(tipCard(param.tit.tit + ' 搜索验证失败，点击查看原站', param.it.url));
                                        } else {
                                            var spl = omdomin;
                                            require('hiker://files/rules/xyq/hikermovie.js');
                                            ssjiex();
                                        }
                                    } else if (CAPTCHA_HINT.test(html) && !/wwgz/.test(param.it.url)) {
                                        if (html.search(/验证后查看搜索结果/) != -1) {
                                            d.push(tipCard(param.tit.tit + ' 需要验证，点击进入原站搜索', param.it.url));
                                        } else {
                                            d.push(tipCard(
                                                param.tit.tit + ' 需要验证码，请进入站点搜索',
                                                param.it.url + ';get;utf-8;{User-Agent@.js:MOBILE_UA&&Cookie@.js:fetch("hiker://files/rules/xyq/xqyscookie/' + param.tit.tit + 'cookie.txt", {})}' + sear
                                            ));
                                        }
                                    } else {
                                        var spl = getDomin(param.it.url);
                                        html = passHtmlGuard(html, param.it.url, { base: spl, cookiePrefix: 'searchneed=ok; ' });
                                        require('hiker://files/rules/xyq/hikermovie.js');
                                        ssjiex();
                                    }
                                    return d;
                                },
                                param: {
                                    it: it,
                                    tit: Tit[k]
                                },
                                id: "task"
                            });
                        }

                        batchExecute(tasks, {
                            func: function(param, id, error, result) {
                                param.i = param.i + 1;
                                if (result) {
                                    for (let it of result) {
                                        param.j = param.j + 1;
                                        addItemBefore(pageid, {
                                            title: it.title,
                                            desc: it.desc,
                                            url: it.url,
                                            pic_url: it.pic_url,
                                            col_type: it.col_type,
                                            extra: {
                                                id: "__xqys" + MY_PAGE + "@" + param.j
                                            }
                                        })
                                    }

                                }
                                if (param.i >= param.all) {
                                    deleteItem(pageid)
                                } else {
                                    updateItem({
                                        title: "正在加载第" + MY_PAGE + "页，进度：" + (param.i + 1) + "/" + param.all,
                                        url: "",
                                        pic_url: "",
                                        col_type: "text_center_1",
                                        desc: "",
                                        extra: {
                                            id: pageid
                                        }
                                    })
                                }
                            },
                            param: {
                                all: Data.length,
                                i: 0,
                                j: -1
                            }
                        })
                    }
                }, list),
                col_type: 'text_center_1'
            });
        }

    for (var i = 0; i < json.data.length; i++) {
        var list = json.data[i].list;
        if (MY_TYPE != "home") {
            d.push({
                title: '选择一个站点查看「' + spl[2] + '」的搜索结果',
                col_type: 'text_center_1'
            });
        }
        for (var j = 0; j < list.length; j++) {
            var host = getDomin(list[j].url);
            var homeHtml = fetchHomeHtml(host);
            var eng = resolveTemplate(host, homeHtml, list[j]) || {};
            var key = eng.key || '';
            var url = buildSearchUrl(host, spl[2], key, homeHtml);
            var link = url;
            if (eng.needCookie) {
                link = url + ';get;utf-8;{User-Agent@.js:MOBILE_UA&&Cookie@.js:fetch("hiker://files/rules/xyq/xqyscookie/' + list[j].title + 'cookie.txt", {})}';
            } else if (eng.needMobileUA || eng.searchMode == 'rss') {
                link = url + ';get;utf-8;{User-Agent@.js:MOBILE_UA}';
            }
            d.push({
                title: list[j].title,
                img: list[j].ico,
                url: $(link + '#noHistory#').rule((cktitle) => {
                    require('hiker://files/rules/xyq/hikermovie.js');
                    hikseaerji();
                }, list[j].title),
                col_type: 'icon_4_card'
            });
        }
    }
    } catch (e) {
        d.push(errCard('hiksearch', e));
    }
    res.data = d;
    setSearchResult(res);
}

function ssjiex() {
    try {
        var tkt = '';
        var dku = MY_URL;
        try {
            tkt = param.tit.tit;
            dku = param.it.url;
        } catch (e) {}
        var kw = '';
        try { kw = getMyVar('xyqxqystext', ''); } catch (e) {}
        var engKey = (getTpl(spl, html) || {}).key || '';
        var list = parseListBySite(html, spl, 'search', engKey);
        if (!list || list.length < 1) {
            d.push(tipCard(tkt + ' 未找到结果，点击查看原站', dku));
            return;
        }
        var detailFn = (tkt, t) => {
            if (tkt != '') setPageTitle(tkt + '-' + t);
            require('hiker://files/rules/xyq/hikermovie.js');
            omerj(t);
        };
        for (var i = 0; i < list.length; i++) {
            var vod = extractVodBySite(list[i], spl, engKey);
            if (!vod.title) continue;
            var showTitle = MY_TYPE == 'home' && kw ? vod.title.replace(kw, '「' + kw + '」') : vod.title;
            d.push({
                title: vod.img
                    ? (MY_TYPE == 'home' ? (showTitle + ' ' + vod.desc + '\n' + tkt) : (vod.title + ' ' + vod.desc))
                    : showTitle,
                url: $(vod.url).rule(detailFn, tkt, vod.title),
                pic_url: vod.img ? imgReferer(vod.img, spl) : '',
                desc: (vod.img && MY_TYPE != 'home') ? (' ' + tkt) : tkt,
                col_type: vod.img ? 'movie_1_vertical_pic' : 'text_center_1'
            });
        }
    } catch (e) {
        try { d.push(errCard('ssjiex', e)); } catch (e2) { logErr('ssjiex', e); }
    }
}

function hikseaerji() {
    var res = {};
    var d = [];
    try {
    var spl = getDomin(MY_URL);
    // 旺旺影视站内搜索不可用，走分类/RSS 关键词检索
    if (/wwgz/.test(spl)) {
        var qs = parseWwgzSearch(MY_URL);
        var page = qs.page || (typeof MY_PAGE != 'undefined' ? MY_PAGE : 1);
        wwgzFillSearch(d, spl, qs.wd, page, '');
        res.data = d;
        setHomeResult(res);
        return;
    }
    var html = getResCode();

    // Omofun 搜索需先过安全验证，否则只会拿到验证页
    if (/omofuna/.test(spl) && OMO_VERIFY_HINT.test(html)) {
        var ckt = typeof cktitle != 'undefined' ? cktitle : 'Omofun动漫';
        var omock = omofunaPassVerify(spl, MY_URL);
        if (omock) {
            writeFile('hiker://files/rules/xyq/xqyscookie/' + ckt + 'cookie.txt', omock);
            html = fetch(MY_URL, {
                headers: { "User-Agent": MOBILE_UA, "Referer": spl + '/', "Cookie": omock },
                timeout: 10000
            });
        }
    }
    html = passHtmlGuard(html, MY_URL, { base: spl, cookiePrefix: 'searchneed=ok; ' });
    if ((CAPTCHA_HINT.test(html) || OMO_VERIFY_HINT.test(html)) && !/wwgz/.test(spl)) {
        if (/omofuna/.test(spl) && OMO_VERIFY_HINT.test(html)) {
            d.push({
                title: '需要安全验证，点此打开网页点「继续访问」后再返回刷新',
                url: MY_URL,
                col_type: 'text_center_1'
            });
            d.push({
                title: '我已完成验证，刷新',
                url: $('#noLoading#').lazyRule(() => {
                    refreshPage(false);
                    return 'hiker://empty';
                }),
                col_type: 'text_center_1'
            });
        } else {
            var capEng = resolveTemplate(spl, typeof html != 'undefined' ? html : '') || {};
            var imglin = (capEng.captcha == 'vdimgck' || /vdimgck|auete4so/.test(typeof html != 'undefined' ? html : '')) ? spl + '/include/vdimgck.php?get=' + new Date() : spl + '/index.php/verify/index.html?r=' + Math.random();
            var cok = JSON.parse(fetchCookie(imglin, {
                headers: {
                    'User-Agent': MOBILE_UA
                },
                method: 'GET',
                withHeaders: true
            })).join(';');

            d.push({
                pic_url: imglin + '@User-Agent=' + MOBILE_UA + '@Cookie=' + cok,
                url: $('').lazyRule(() => {
                    return refreshPage();
                }),
                col_type: 'pic_1_full'
            });
            d.push({
                title: '',
                url: "'toast://你输入的是' + input",
                extra: {
                    onChange: "putMyVar('xqys验证码',input)",
                    titleVisible: false
                },
                col_type: 'input'
            });
            d.push({
                title: '发送',
                url: $(MY_URL).lazyRule((cok, spl, cktitle) => {
                    var cod = getMyVar('xqys验证码');
                    if ((resolveTemplate(spl) || {}).captcha == 'vdimgck' || /aeete|auete/.test(spl)) {
                        var html = fetch(spl + '/search.php?scheckAC=check&page=&searchtype=&order=&tid=&area=&year=&letter=&yuyan=&state=&money=&ver=&jq=', {
                            headers: {
                                'User-Agent': MOBILE_UA,
                                'Cookie': cok
                            },
                            body: 'validate=' + cod + '&searchword=',
                            method: 'POST'
                        });
                        if (html.indexOf('正确的验证码继续访问') > 0) {
                            return "toast://验证失败。"
                        } else {
                            writeFile('hiker://files/rules/xyq/xqyscookie/' + cktitle + 'cookie.txt', cok);
                            refreshPage();
                            return "toast://验证成功。"
                        }
                    } else {
                        var html = JSON.parse(fetch(spl + '/index.php/ajax/verify_check?type=search&verify=' + cod, {
                            headers: {
                                'X-Requested-With': 'XMLHttpRequest',
                                'User-Agent': MOBILE_UA,
                                'Cookie': cok
                            },
                            body: '',
                            method: 'POST'
                        }));
                        if (html.code == 1) {
                            writeFile('hiker://files/rules/xyq/xqyscookie/' + cktitle + 'cookie.txt', cok);
                            refreshPage();
                            return "toast://验证成功。"
                        } else {
                            return "toast://验证失败！"
                        }
                    }
                }, cok, spl, cktitle),
                col_type: 'text_2'
            });
        }
    } else if (html.indexOf('不要频繁操作') >= 0) {
        d.push({
            title: '太过频繁，等待6秒后下滑刷新本页面。',
            col_type: 'text_center_1'
        })

    } else {
        require('hiker://files/rules/xyq/hikermovie.js');
        ssjiex();
    }
    } catch (e) {
        d.push(errCard('hikseaerji', e));
    }
    res.data = d;
    setHomeResult(res);
}

function reverseList(list) {
    if (!list || !list.length) return list || [];
    try {
        return list.reverse();
    } catch (e) {
        var out = [];
        for (var i = list.length - 1; i >= 0; i--) out.push(list[i]);
        return out;
    }
}

function omerj(movTitle) {
    var res = {};
    var d = [];
    try {
        movTitle = (movTitle == null ? '' : (movTitle + ''));
        if (!movTitle) {
            try { movTitle = getPageTitle() || ''; } catch (e) {}
        }

        d.push({
            title: '',
            desc: '255&&float',
            url: '',
            col_type: 'x5_webview_single'
        });
        try { refreshX5WebView(''); } catch (e) {}

        var ruleTitle = '搜索';
        try {
            ruleTitle = (JSON.parse(getRule()).title || '') + '搜索';
        } catch (e) {}
        d.push({
            title: ruleTitle,
            desc: '',
            url: $('hiker://empty#noHistory#$$$' + RULE_JSON + '$$$' + movTitle + '$$$fypage$$$').rule(() => {
                require('hiker://files/rules/xyq/hikermovie.js');
                hiksearch();
            }),
            extra: { pageTitle: '搜索' },
            col_type: 'flex_button'
        });

        var omdomin = getDomin(MY_URL);
        var raw = '';
        try { raw = getResCode() || ''; } catch (e) { raw = ''; }
        if (!raw) {
            try {
                raw = fetch(MY_URL, {
                    headers: { 'User-Agent': MOBILE_UA, 'Referer': omdomin + '/' }
                }) || '';
            } catch (e) {}
        }
        var html = passHtmlGuard(('' + raw).replace(/<!--([\S\s]*?)-->/g, ''), MY_URL, {
            base: omdomin
        });
        var eng = resolveTemplate(omdomin, html) || {};
        var tabs = firstPdfa(html, eng.detailTabs ? eng.detailTabs + '||' + FUZZY_TABS : FUZZY_TABS);
        var conts = firstPdfa(html, eng.detailConts ? eng.detailConts + '||' + FUZZY_CONTS : FUZZY_CONTS);

        if (conts && conts.length) {
            for (var i = 0; i < conts.length; i++) {
                var list = [];
                try {
                    if (eng.epLinks) list = pdfa(conts[i], eng.epLinks);
                    else if (('' + conts[i]).indexOf('fed-btns-info') != -1) list = pdfa(conts[i], 'body&&.fed-btns-info');
                    else if (('' + conts[i]).indexOf('<li') != -1) list = pdfa(conts[i], 'body&&li');
                    else list = pdfa(conts[i], 'body&&a:not(a:contains(展开全部))');
                } catch (e) { list = []; }
                if (!list || !list.length) continue;

                if (eng.reverseEps) list = reverseList(list);
                if (getVar('hikermsort', '1') != '1') list = reverseList(list);

                var tabt = '在线播放';
                if (tabs && tabs[i]) {
                    try {
                        tabt = pdfh(tabs[i], 'a&&Text||b&&Text||span&&Text||body&&Text') || ('线路' + (i + 1));
                    } catch (e) {
                        tabt = '线路' + (i + 1);
                    }
                }
                d.push({
                    title: tabt + ' 🔗' + (i + 1) + '/' + conts.length + '（点击切换排序）',
                    url: sortToggleRule(),
                    col_type: 'text_1'
                });

                for (var j = 0; j < list.length; j++) {
                    var title = '';
                    try { title = pdfh(list[j], 'a&&Text||body&&Text') || ''; } catch (e) {}
                    var link = '';
                    try { link = pd(list[j], 'a&&href'); } catch (e) {}
                    if (!link) try { link = pdfh(list[j], 'a&&href||body&&href'); } catch (e2) {}
                    if (!link || /javascript:/i.test(link)) continue;
                    try {
                        if (title && title.match(/(第|\d|-)*(集|话|期)/g)) title = title.replace(/第|集|话|期/g, '');
                    } catch (e) {}
                    var clt = 'text_5';
                    if (list.length <= 4) clt = 'text_2';
                    else if (isNaN(title) && (title + '').indexOf('番外') < 0) clt = 'flex_button';
                    d.push({
                        title: title,
                        url: playLazyRule(omdomin, link, title),
                        extra: {
                            blockRules: ['.css', '.gif', '.jpeg', '.png', '.ico', 'cnzz', '.51.la', 'google', 'xn--*:*', 'hm.baidu.com', '/ads/*.js'],
                            referer: omdomin,
                            id: 'hiker://empty$$$' + link + '$$$' + title + '$$$' + omdomin
                        },
                        col_type: clt
                    });
                }
            }
        } else {
            d.push({
                title: '未解析到播放列表，可打开原网页',
                url: MY_URL,
                col_type: 'text_center_1'
            });
        }
    } catch (e) {
        d.push(errCard('omerj', e));
    }

    res.data = d;
    setHomeResult(res);
}

function omlazy() {
    // 新: empty$$$playUrl$$$title$$$host  旧: empty$$$host$$$playUrl$$$title
    var _p = input.split('$$$');
    var srcurl = '';
    var myurl = '';
    if (/^https?:/i.test(_p[2] || '')) {
        myurl = (_p[1] || '').replace(/\/$/, '');
        srcurl = _p[2] || '';
    } else {
        srcurl = _p[1] || '';
        myurl = (_p.slice(3).join('$$$') || '').replace(/\/$/, '');
    }
    try {
        function playUrl(urls) {
            if (!urls || urls.indexOf('index.m3u8') < 0 || urls.indexOf('"urls"') >= 0) return urls;
            if (!/vip\.ffzy|vip\.lz|hd\.lz|\.cdnlz|suonizy/.test(urls)) return urls;
            try {
                var m3u8 = fetch(urls);
                if (m3u8 && m3u8.indexOf('EXT-X-STREAM-INF') >= 0) {
                    urls = urls.replace('index.m3u8', m3u8.split('\n')[2]);
                }
            } catch (e) {}
            return urls;
        }
        function zywyun(shareUrl) {
            var link = shareUrl.split('/share')[0];
            var fc = fetch(shareUrl, {}).replace('var purl', 'var main');
            var play = '';
            if (fc.indexOf('main') != -1) {
                eval(fc.match(/var main.*?;/)[0]);
                play = main.indexOf('http') != -1 ? main : link + main;
            } else {
                var main2 = fc.match(/url:.*?[\'\"](.*?)[\'\"]/)[1];
                play = main2.indexOf('http') != -1 ? main2 : link + main2;
            }
            play = playUrl(play);
            try { play = clearM3u8(play); } catch (e) {}
            return play;
        }
        function x5rule(links, srcurl) {
            showLoading("正在进行网页访问检索。");
            var video = 'webRule://' + links + '@' + $.toString((srcurl) => {
                var urls = _getUrls();
                if (window.__count == null || window.__count == 'undefined') {
                    fba.log('网页访问开始');
                    window.__count = 0
                }
                if (window.__count >= 23) {
                    return srcurl
                }
                window.__count = window.__count + 1;
                if (window.__count > 1 && window.__count <= 3 && window.__count != null && window.__count != undefined) {
                    if (document.querySelector('body').innerText.search(/触发了防盗链|未授权|接口防盗/) != -1 && !document.querySelector('body').innerText.search(/出现域名未授权/)) {
                        if (window.__count == 2) {
                            fba.log('尝试跳防盗验证一');
                            location.href = location.href;
                        } else {
                            fba.log('尝试跳防盗验证二');
                            location.href = srcurl
                        }
                    }
                } else if (window.__count > 3 && window.__count != null && window.__count != undefined) {
                    if (urls.length < 1) {
                        fba.hideLoading();
                        return 'toast://访问失败，可能链接已失效。';
                    } else if (urls.length == 1) {
                        fba.log('尝试打开直链与JSON解析');
                        if (urls[0].match(/dycdn\-tos\.pstatp|\.m3u8|\.mp4|\.flv|netease\.com|video_mp4|type\=m3u8|\/video\/tos\//) && !urls[0].match(/\.html|\.m3u8\.tv|\.m3u8\.pw|\&next|ac\=dm|\=http|https\:\/\/[\d]\.m3u8|\?url\=\/m3u8/) && !urls[0].match(/banyung/)) {
                            if (urls[0].indexOf('bilivideo') != -1) {
                                return urls[0] + ';{Referer@https://www.bilibili.com&&User-Agent@Mozilla/5.0}';
                            } else if (urls[0].indexOf('titan.mgtv.com') != -1) {
                                return urls[0] + '#isVideo=true#' + ';{Referer@www.mgtv.com&&User-Agent@Mozilla/5.0}';
                            } else {
                                return urls[0]
                            }
                        } else if (urls[0].match(/from\=https\:\/\/banyung\.pw/)) {
                            return urls[0]
                        } else if (location.href.match(/dycdn\-tos\.pstatp|\.m3u8|\.mp4|\.flv|netease\.com|video_mp4|type\=m3u8|\/video\/tos\//) && !location.href.match(/html|\.m3u8\.tv|\.m3u8\.pw|\&next|ac\=dm|\=http|https\:\/\/[\d]\.m3u8|\?url\=\/m3u8/)) {
                            return location.href
                        } else {
                            var html = fba.fetch(location.href, {});
                            if (!/\</.test(html)) {
                                return JSON.parse(html).url;
                            } else {
                                fba.log(location.href)
                            }
                        }
                    } else {
                        fba.log('网页加载日志检索' + window.__count + '');
                        for (var i in urls) {
                            if (urls[i].match(/miued\.com\/m3|obj\/tos\-alisg|dycdn\-tos\.pstatp|\.m3u8|\.mp4|\.flv|netease\.com|video_mp4|type\=m3u8|\?pt\=m3u8|\/video\/tos\/|item\/video|stariverpan\.com\:9096\/ipfs|vod\.shihuocdn\./) && !urls[i].match(/html|\.m3u8\.|\.m3u8zy\.fun|\&next|ac\=dm|\=http|https\:\/\/[\d]\.m3u8|\?url\=\/m3u8|name\=fyjson/) && !urls[i].match(/banyung/)) {
                                fy_bridge_app.log(urls[i])
                                fba.hideLoading();
                                if (fy_bridge_app.getHeaderUrl) {
                                    if (fy_bridge_app.clearM3u8Ad) {
                                        if ((urls[i].includes("vip.ffzy") || urls[i].includes("vip.lz") || urls[i].includes("hd.lz") || urls[i].includes(".cdnlz") || urls[i].includes("suonizy")) && urls[i].includes("index.m3u8") && !urls[i].includes("=http")) {
                                            let url = urls[i];
                                            let m3u8 = fba.fetch(url);
                                            if (m3u8.includes('EXT-X-STREAM-INF')) {
                                                let houz = m3u8.split("\n")[2];
                                                url = urls[i].replace("index.m3u8", houz);
                                            }
                                            return url;
                                        }
                                    }
                                    return fy_bridge_app.getHeaderUrl(urls[i]).replace(";{", "#ignoreImg=true##isVideo=true#;{");
                                } else {
                                    if (urls[i].indexOf('bilivideo') != -1) {
                                        return urls[i] + ';{Referer@https://www.bilibili.com&&User-Agent@Mozilla/5.0}';
                                    } else if (urls[i].indexOf('titan.mgtv.com') != -1) {
                                        return urls[i] + '#isVideo=true#' + ';{Referer@www.mgtv.com&&User-Agent@Mozilla/5.0}';
                                    } else {
                                        return urls[i] + '#isVideo=true#'
                                    }
                                }
                            } else if (urls[i].match(/from\=https\:\/\/banyung\.pw|m3u8\.pw\/Cache|getm3u8\?url|\/ftn_handler\//)) {
                                if (fy_bridge_app.getHeaderUrl) {
                                    return fy_bridge_app.getHeaderUrl(urls[i]).replace(";{", "#ignoreImg=true##isVideo=true#;{");
                                } else {
                                    return urls[i]
                                }
                            }
                        }
                    }
                }
            }, srcurl);
            return video
        }

        if (srcurl.indexOf("135-cdn") != -1) {
            refreshX5WebView(srcurl);
            return "toast://请等待加载选集！";
        } else if (srcurl.indexOf("/share/") != -1) {
            return zywyun(srcurl);
        }

        // 播放：按页面内容模糊识别，不绑死域名
        var phtml = '';
        try {
            phtml = fetch(srcurl, {
                headers: {
                    "User-Agent": MOBILE_UA,
                    "Referer": myurl + '/'
                }
            }) || request(srcurl) || '';
        } catch (e) {
            try {
                phtml = request(srcurl) || '';
            } catch (e2) {}
        }
        var playTpl = resolveTemplate(myurl, phtml) || {};

        // fed 播放器
        if ((playTpl.play == 'fed' || /fed-play-player/.test(phtml)) && /data-play/.test(phtml)) {
            var urll = pdfh(phtml, '.fed-play-player&&iframe&&data-play');
            try {
                urll = base64Decode(urll.slice(3));
            } catch (e) {}
            var pars = pd(phtml, '.fed-play-player&&iframe&&data-pars');
            if (/.m3u8|.mp4|obj\/tos/.test(urll) && /http/.test(urll)) {
                return playUrl(urll + '#isVideo=true#');
            }
            if (urll && urll.indexOf('http') != -1) {
                return /html/.test(urll) ? x5rule(urll, srcurl) : playUrl(urll + '#isVideo=true#');
            }
            if (pars && urll) {
                var html = fetch(pars + urll, {
                    headers: {
                        "User-Agent": MOBILE_UA,
                        "Referer": myurl + '/'
                    }
                });
                if (html.indexOf('purl') != -1) {
                    var kjjx = pdfh(html, 'body&&Html').match(/var purl = \'(.*?)\'/)[1];
                    return x5rule(kjjx, srcurl);
                }
                var vurl = html.indexOf('var vid') != -1 ? html.match(/var vid=\"(.*?)\"/)[1] : (html.match(/var url = \'(.*?)\'/) || [])[1];
                if (vurl) return playUrl(vurl);
            }
        }

        // auete: var now=base64decode
        var mnow = phtml.match(/var\s+now\s*=\s*base64decode\([\'\"]([^\'\"]+)[\'\"]\)/i);
        if (mnow) {
            var urll2 = base64Decode(mnow[1]);
            if (/\.m3u8|\.mp4|obj\/tos/.test(urll2) && /http/.test(urll2)) {
                return playUrl(urll2 + '#isVideo=true#');
            }
        }

        // MacCMS player_aaaa
        var m = phtml.match(/var\s+player_aaaa\s*=\s*(\{[\s\S]*?\});/);
        if (m) {
            eval('var player_aaaa=' + m[1]);
            var urll3 = player_aaaa.url;
            if (player_aaaa.encrypt == '1' || player_aaaa.encrypt == 1) urll3 = unescape(urll3);
            else if (player_aaaa.encrypt == '2' || player_aaaa.encrypt == 2) urll3 = unescape(base64Decode(urll3));
            if (/\.m3u8|\.mp4|obj\/tos/.test(urll3) && /http/.test(urll3)) {
                return playUrl(urll3 + '#isVideo=true#');
            }
        }

        // 页面内已有 m3u8 / 嗅探兜底
        var mm = phtml.match(/https?:\/\/[^\"\'\s<>]+\.m3u8[^\"\'\s<>]*/);
        if (mm) return playUrl(mm[0] + '#isVideo=true#');
        return x5rule(srcurl, srcurl);
    } catch (e) {
        logErr('omlazy', e);
        return srcurl;
    }
}

function hikerpre() {
    setItem('huadong', base64Decode('ZnVuY3Rpb24gc3RyaW5ndG9IZXgoYWNTVFIpIHsKICAgIHZhciB2YWwgPSAiIjsKICAgIGZvciAodmFyIGkgPSAwOyBpIDw9IGFjU1RSLmxlbmd0aCAtIDE7IGkrKykgewogICAgICAgIHZhciBzdHIgPSBhY1NUUi5jaGFyQXQoaSk7CiAgICAgICAgdmFyIGNvZGUgPSBzdHIuY2hhckNvZGVBdCgpOwogICAgICAgIHZhbCArPSBwYXJzZUludChjb2RlKSArIDEKICAgIH07CiAgICByZXR1cm4gdmFsCn07CgpmdW5jdGlvbiBtZDVlbmNvZGUod29yZCkgewogICAgcmV0dXJuIG1kNSh3b3JkKS50b1N0cmluZygpCn07CmxldCBqc3AgPSBwYXJzZURvbUZvckh0bWwoaHRtbCwgJ2JvZHkmJnNjcmlwdCYmc3JjJyk7CmxldCBqc2YgPSByZXF1ZXN0KCdyZWZyZScgKyBqc3AsIHsKICAgIGhlYWRlcnM6IHsKICAgICAgICAiVXNlci1BZ2VudCI6IE1PQklMRV9VQSwKICAgICAgICAiUmVmZXJlciI6ICJyZWZyZSIKICAgIH0KfSk7CmV2YWwoanNmLm1hdGNoKC9rZXk9IlteXCJdKyIsdmFsdWU9IlteXCJdKyIvKVswXSk7CmV2YWwoImxldCBodXJsPSdyZWZyZScrIiArIGpzZi5tYXRjaCgvZnVuY3Rpb25cKFwpXHtjXC5nZXRcKChbXixdKyksLylbMV0pOwp2YXIgY29rID0gSlNPTi5wYXJzZShmZXRjaENvb2tpZShodXJsLCB7CiAgICBoZWFkZXJzOiB7CiAgICAgICAgIlVzZXItQWdlbnQiOiBNT0JJTEVfVUEsCiAgICAgICAgIlJlZmVyZXIiOiAicmVmcmUiCiAgICB9Cn0pKVswXTs='));
}