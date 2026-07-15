function hikhmrule() {
    var json = JSON.parse(fetch('hiker://files/rules/xyq/hikermovie.json', {}));
    var res = {};
    var d = [];
    var decText = getMyVar("xyqxqystext", "");
    d.push({
        title: "搜索",
        url: $.toString(() => {
            var link = 'hiker://empty#noRecordHistory#$$$hiker://files/rules/xyq/hikermovie.json$$$' + input + '$$$fypage$$$';
            return $(link).rule(() => {
                eval(fetch('hiker://files/rules/xyq/hikermovie.js'));
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
        url: $("#noLoading#").lazyRule(() => {
            var kw = getMyVar('xyqxqystext', '');
            if (!kw) return 'toast://请先输入关键词';
            var link = 'hiker://empty#noRecordHistory#$$$hiker://files/rules/xyq/hikermovie.json$$$' + kw + '$$$fypage$$$';
            return $(link).rule(() => {
                eval(fetch('hiker://files/rules/xyq/hikermovie.js'));
                hiksearch();
            });
        }),
        col_type: 'flex_button'
    });
    for (var i = 0; i < json.data.length; i++) {
        var tab = json.data[i];
        for (var k = 0; k < tab.list.length; k++) {
            var list = tab.list[k];
            d.push({
                title: list.title,
                img: list.ico + '@Referer=',
                url: 'hiker://empty$$' + list.url + '$$fypage$$' + list.vodtype + '$$' + list.vodhref + '$$',
                col_type: 'icon_4_card'
            });
        }
    }

    res.data = d;
    setHomeResult(res);
}
function hikhmerj() {
    var res = {};
    var d = [];
    var spl = MY_URL.split('$$')[1];
    var pn = MY_URL.split('$$')[2];
    var vtype = MY_URL.split('$$')[3];
    var vhref = MY_URL.split('$$')[4];

    try {
        if (pn == 1) {
            var clst = vtype.split('&');
            var clsu = vhref.split('&');

            for (var i = 0; i < clst.length; i++) {
                if (/saohuo|shdy3|shdy2/.test(spl)) {
                    var url = spl + '/list/' + clsu[i] + '-fypage.html';
                } else if (/dm84/.test(spl)) {
                    var url = spl + '/list-' + clsu[i] + '-fypage.html';
                } else if (/auete/.test(spl)) {
                    var url = spl + '/' + clsu[i] + '/indexfypage.html[firstPage=' + spl + '/' + clsu[i] + '/index.html]';
                } else if (/viptv/.test(spl)) {
                    var url = spl + '/vod/type/id/' + clsu[i] + '/page/fypage.html';
                } else if (/qkan8/.test(spl)) {
                    var url = spl + '/index.php/vod/type/id/' + clsu[i] + '/page/fypage.html';
                } else if (/omofuna/.test(spl)) {
                    var url = spl + '/type/' + clsu[i] + '-fypage.html[firstPage=' + spl + '/type/' + clsu[i] + '.html]';
                } else if (/wwgz/.test(spl)) {
                    var url = spl + '/vod-list-id-' + clsu[i] + '-pg-fypage-order--by-time-class-0-year-0-letter--area--lang-.html';
                }

                d.push({
                    title: clst[i],
                    url: url + `@rule=js:eval(fetch('hiker://files/rules/xyq/hikermovie.js'));clsrule();`,
                    col_type: clst.length >= 16 ? 'scroll_button' : 'flex_button'
                })
            }

            d.push({
                col_type: 'line'
            });
        }

        if (pn == 1) {
            var html = request(spl, {});
        }

        if (html.indexOf('检测中') != -1) {
            
            html = fetch(spl + '/?btwaf' + html.match(/btwaf(.*?)\"/)[1], {
                headers: {
                    "User-Agent": MOBILE_UA
                }
            });
        } else if (html.indexOf('人机身份验证，请完成以下操作') > -1 || html.indexOf('人机识别，请稍等') > -1) {
            eval(getItem('huadong').replace(/refre/g, spl));
            var html = fetch(spl, {
                headers: {
                    "User-Agent": MOBILE_UA,
                    "Cookie": cok,
                    "Referer": spl
                }
            });
        } else if (html.includes("请稍等5秒钟左右") && html.includes("提供DDoS防护")) {
            eval(pdfh(html, 'head&&script&&Html').split('function')[0]);

            function loadFunc() {
                var e = getCookie(spl);
                if (null != e) {
                    for (var t = e.toString().split(";"), n = "", o = 0; o < t.length; o++) {
                        var i = (e = t[o].trim()).split("=");
                        if (2 == i.length && i[0] == cpk) {
                            n = i[1];
                            break
                        }
                    }
                    if (0 != n.length) {
                        for (var a = 0, o = 0; o < n.length; o++) {
                            var d = n[o];
                            /^[a-zA-Z0-9]$/.test(d) && (a += n.charCodeAt(o) * (nonce + o))
                        }
                        let jum = request(spl, {
                            headers: {
                                'X-GE-UA-Step': step,
                                'Referer': spl,
                                'Cookie': 'ge_ua_p=' + n
                            },
                            body: "sum=" + a + "&nonce=" + nonce,
                            method: 'POST'
                        });
                        log(jum);
                    }
                }
            }
            loadFunc();
            html = request(spl, {
                headers: {
                    "Cookie": getCookie(spl),
                    "Referer": spl
                }
            });
        }
        if (/class\=\"v_list/.test(html)) {
            var conts = pdfa(html, 'body&&.v_list');
        } else if (/class\=\"c2_list/.test(html)) {
            var conts = pdfa(html, 'body&&.c2_list');
        } else if (/mo-part-round/.test(html) && /mo-situ-name/.test(html)) {
            var conts = pdfa(html, 'body&&.mo-part-round:has(.mo-situ-name)');
        } else if (/mo-main-foot/.test(html) && /mo-list-wrap/.test(html)) {
            var conts = pdfa(html, 'body&&.mo-list-wrap:has(.mo-lazy-play)');
        } else if (/menuBar/.test(html) && /imgBox/.test(html)) {
            var conts = pdfa(html, 'body&&.imgBox:has(.ImgA)');
        } else if (/myui-vodlist/.test(html) && /pic-text/.test(html)) {
            var conts = pdfa(html, 'body&&.myui-vodlist:has(.pic-text)');
        } else if (/myui-vodlist/.test(html) && /pic-tag/.test(html)) {
            var conts = pdfa(html, 'body&&.myui-vodlist:has(.pic-tag)');
        } else if (/stui-vodlist/.test(html) && /stui-vodlist__detail|stui-vodlist__title/.test(html)) {
            var conts = pdfa(html, 'body&&.stui-vodlist');
        } else if (/ewave-vodlist/.test(html) && /ewave-vodlist__detail/.test(html)) {
            var conts = pdfa(html, 'body&&.ewave-vodlist');
        } else if (/stui-vodlist/.test(html) && /class\=\"text-red/.test(html)) {
            var conts = pdfa(html, 'body&&.stui-vodlist');
        } else if (/vodlist/.test(html) && /vodlist_item/.test(html)) {
            var conts = pdfa(html, 'body&&.vodlist:has(.vodlist_item)');
        } else if (/pack-packcover/.test(html)) {
            var conts = pdfa(html, 'body&&.vodlist:has(.pack-packcover)');
        } else if (/fed-list-info/.test(html) && /fed-col-sm3/.test(html)) {
            var conts = pdfa(html, 'body&&.fed-list-info:has(.fed-col-sm3)');
        } else if (/list-unstyled/.test(html) && /col-sm-3/.test(html)) {
            var conts = pdfa(html, 'body&&.list-unstyled:has(.col-sm-3)');
        } else if (/list-unstyled/.test(html) && /col-xs-4/.test(html)) {
            var conts = pdfa(html, 'body&&.list-unstyled:has(.col-xs-4)');
        } else if (/hy-video-list/.test(html) && /col-sm-3/.test(html)) {
            var conts = pdfa(html, 'body&&.hy-video-list:has(.col-sm-3)');
        } else if (/hl-vod-list/.test(html) && /hl-list-item/.test(html)) {
            var conts = pdfa(html, 'body&&.hl-vod-list:has(.hl-list-item)');
        } else if (/layout-box/.test(html) && /col-sm-3/.test(html)) {
            var conts = pdfa(html, 'body&&.layout-box:has(.col-sm-3)');
        } else if (/forum_card_fid/.test(html) && /threadlist/.test(html)) {
            var conts = pdfa(html, 'body&&.threadlist');
        } else if (/index-area/.test(html) && /link-hover/.test(html) && /sj-nav-search|sy-nav-search/.test(html)) {
            var conts = pdfa(html, 'body&&.index-area');
        } else if (/indexShowBox/.test(html) && /video-model-list/.test(html)) {
            var conts = pdfa(html, 'body&&.video-model-list');
        } else if (/module-item/.test(html) && /module-list/.test(html)) {
            var conts = pdfa(html, 'body&&.module-list');
        } else if (/module-items/.test(html) && /module-poster-item-info/.test(html)) {
            var conts = pdfa(html, 'body&&.module-items');
        } else if (/movie-list/.test(html) && /m-item/.test(html)) {
            var conts = pdfa(html, 'body&&.movie-list');
        } else if (/data_list/.test(html) && /DianDian/.test(html)) {
            var conts = pdfa(html, 'body&&#data_list');
        } else if (/tbox_t/.test(html) && /tbox_m2/.test(html)) {
            var conts = pdfa(html, 'body&&.tbox_m2');
        } else if (/tbox_t/.test(html) && /tbox_m/.test(html)) {
            var conts = pdfa(html, 'body&&.tbox_m');
        } else if (/volistheightb/.test(html) && /volistwidthb/.test(html)) {
            var conts = pdfa(html, 'body&&.box:has(.volistwidthb)');
        } else if (/globalPicList/.test(html) && /resize_list/.test(html)) {
            var conts = pdfa(html, 'body&&.globalPicList');
        } else if (/gen-movie-img/.test(html) && /public-list-box/.test(html)) {
            var conts = pdfa(html, 'body&&.fadeInUp:has(.gen-movie-img)');
        } else if (/align-items-center/.test(html) && /card-link/.test(html)) {
            var conts = pdfa(html, 'body&&.container:has(.card-link)');
        } else if (/daFJ_dJJfFHa/.test(html)) {
            var conts = pdfa(html, 'body&&.daFJ_dJJfFHa');
        }

        for (var i = 0; i < conts.length; i++) {
            if (html.indexOf('mo-part-round') != -1) {
                var list = pdfa(conts[i], 'body&&.mo-cols-info');
            } else if (/hy-video-list/.test(html) && /col-sm-3/.test(html)) {
                var list = pdfa(conts[i], 'body&&.col-sm-3');
            } else if (/align-items-center/.test(html) && /card-link/.test(html)) {
                var list = pdfa(conts[i], 'body&&.card-link');
            } else if (/hl-vod-list/.test(html) && /hl-list-item/.test(html)) {
                var list = pdfa(conts[i], 'body&&.hl-list-item');
            } else if (/layout-box/.test(html) && /col-sm-3/.test(html)) {
                var list = pdfa(conts[i], 'body&&.col-sm-3');
            } else if (html.indexOf('fed-list-info') != -1) {
                var list = pdfa(conts[i], 'body&&.fed-col-sm3');
            } else if (html.indexOf('pack-packcover') != -1) {
                var list = pdfa(conts[i], 'body&&.pack-packcover');
            } else if (/module-item/.test(html) && /module-list/.test(html)) {
                var list = pdfa(conts[i], 'body&&.module-item');
            } else if (/module-items/.test(html) && /module-poster-item-info/.test(html)) {
                var list = pdfa(conts[i], 'body&&.module-item');
            } else if (/data_list/.test(html) && /DianDian/.test(html)) {
                var list = pdfa(html, 'body&&#data_list&&.DianDian');
            } else if (/public-list-box/.test(html) && /gen-movie-img/.test(html)) {
                var list = pdfa(conts[i], 'body&&.public-list-box');
            } else if (html.indexOf('link-hover') != -1) {
                var list = pdfa(conts[i], 'body&&li:has(.link-hover)');
            } else if (html.indexOf('globalPicList') != -1) {
                var list = pdfa(conts[i], 'body&&li:has(img)');
            } else if (html.indexOf('c2_list') != -1) {
                var list = pdfa(conts[i], 'body&&li:has(.lazyload)');
            } else {
                var list = pdfa(conts[i], 'body&&li:has(a)')
            }

            for (var j = 0; j < list.length; j++) {
                try {
                    if (/auete|wwgz/.test(spl)) {
                        var img = pdfh(list[j], 'img&&data-src||src||data-echo');
                    } else if (/module-list/.test(html) && /module-item/.test(html)) {
                        var img = pdfh(list[j], ".lazyloaded||.lazyload||.lazy&&data-src||data-6.66a.vipal");
                    } else if (/vbox_t/.test(html) && /vbox/.test(html)) {
                        var img = pdfh(list[j], "a&&style||data-6.66a.vipal");
                    } else if (/data-background/.test(list[j]) && /swiper-lazy/.test(list[j])) {
                        var img = pdfh(list[j], "a&&data-background");
                    } else {
                        var img = pdfh(list[j], '.lozad||.lazy||.lazyload||.lazyloaded||.mo-situ-pics||.mo-lazy-load||.myui-vodlist__thumb||.fed-list-pics||.img-responsive||.eclazy||.video-pic||.hl-lazy||.leo-lazy&&data-6.66a.vipal||style||data-src||data-bg||data-original');
                    }
                    if (img.substring(0, 4) == 'http') {
                        img = img;
                    } else {
                        img = spl + img
                    }
                } catch (e) {}

                try {
                    if (/class="jidi"|class="hdinfo"|class="qr"/.test(list[j])) {
                        var desc = pdfh(list[j], '.jidi||.hdinfo||.qr&&Text');
                    } else if (/leo-video-remark/.test(list[j]) && /leo-video-(\S*?)item/.test(list[i])) {
                        var desc = pdfh(list[j], '.leo-video-remark&&Text');
                    } else if (/class="type"|class="time"/.test(list[j])) {
                        var typ = pdfh(list[j], '.type&&Text');
                        var tim = pdfh(list[j], '.time&&Text');
                        var desc = typ + ' ' + tim;
                    } else if (/module-item-text/.test(list[j]) && /module-item-caption/.test(list[j])) {
                        var desc = pdfh(list[j], '.module-item-text&&Text');
                    } else if (/mo-lazy-wind/.test(list[j]) && /dc-west/.test(list[j])) {
                        var desc = pdfh(list[j], '.dc-west&&Text');
                    } else {
                        var desc = pdfh(list[j], '.pic-text||.pic_text||.mo-situ-rema||.fed-list-remarks||.continu||.anime_icon1_name1||.v_note||.pack-prb||.note||.pic-tag-left||.pic-tag-top||.hl-pic-text||.hdtag||.tag-mark||.other||.zhuangtai||.module-item-text||.module-item-caption||.module-item-note||.list-remarks||.sBottom||.public-list-prb||.position-absolute||.ribbon-bookmark||.tc_wz||span&&Text')
                    }
                } catch (e) {}

                if (/mo-situ-name/.test(list[j])) {
                    var title = pdfh(list[j], '.mo-situ-name&&Text');
                } else if (/txtA/.test(list[j])) {
                    var title = pdfh(list[j], '.txtA&&Text');
                } else if (/txt-area/.test(list[j])) {
                    var title = pdfh(list[j], '.txt-area&&a&&Text');
                } else if (/fed-list-title/.test(list[j])) {
                    var title = pdfh(list[j], '.fed-list-title&&Text');
                } else if (/video-model-title/.test(list[j])) {
                    var title = pdfh(list[j], '.video-model-title&&Text');
                } else if (/ff-text-right|anime_icon1_name|zoomOverlay|mo-lazy-wind/.test(list[j])) {
                    var title = pdfh(list[j], 'img&&alt');
                } else {
                    var title = pdfh(list[j], 'a[title],-1&&title')
                }

                if (/hdinfo/.test(list[j])) {
                    var url = pdfh(list[j], 'h3&&a&&href');
                } else {
                    var url = pdfh(list[j], 'a&&href')
                }

                if (!img) {
                    d.push({
                        title: title,
                        url: ((url.substring(0, 4) == 'http' || url.substring(0, 4) == 'hike') ? url : spl + url) + `@rule=js:eval(fetch('hiker://files/rules/xyq/hikermovie.js'));omerj();`,
                        desc: desc,
                        extra: {
                            longClick: [{
                                    title: JSON.parse(getRule()).title + '搜索',
                                    js: $.toString((title) => {
                                        var link = 'hiker://empty#noRecordHistory#$$$hiker://files/rules/xyq/hikermovie.json$$$' + title + '$$$fypage$$$';
                                        return $(link).rule(() => {
                                            setPageTitle('搜索');
                                            eval(fetch('hiker://files/rules/xyq/hikermovie.js'));
                                            hiksearch();
                                        });
                                    }, title),
                                    extra: {
                                        pageTitle: "搜索"
                                    }
                                }
                            ],
                            key: title
                        },
                        col_type: 'text_center_1'
                    });
                }
                else {
                    if (/imgdb/.test(img)) {
                        var tup = img + '@Referer=';
                    } else if (/cocomanga/.test(spl)) {
                        var tup = img + '@Referer=' + spl + '@User-Agent=' + MOBILE_UA;
                    } else if (/look4you/.test(img)) {
                        var tup = img + '@Referer=' + spl;
                    } else {
                        var tup = img + '@Referer=' + img
                    }
                    d.push({
                        title: title,
                        url: $(((url.substring(0, 4) == 'http' || url.substring(0, 4) == 'hike') ? url : spl + url)).rule((MOVtitle) => {
                            eval(fetch('hiker://files/rules/xyq/hikermovie.js'));
                            omerj();
                        }, title),
                        pic_url: tup,
                        desc: desc,
                        extra: {
                            longClick: [{
                                    title: JSON.parse(getRule()).title + '搜索',
                                    js: $.toString((title) => {
                                        var link = 'hiker://empty#noRecordHistory#$$$hiker://files/rules/xyq/hikermovie.json$$$' + title + '$$$fypage$$$';
                                        return $(link).rule(() => {
                                            setPageTitle('搜索');
                                            eval(fetch('hiker://files/rules/xyq/hikermovie.js'));
                                            hiksearch();
                                        });
                                    }, title),
                                    extra: {
                                        pageTitle: "搜索"
                                    }
                                }
                            ],
                            key: title
                        },
                        col_type: 'movie_3_marquee'
                    });
                }

            }
        }
    } catch (e) {}
    res.data = d;
    setHomeResult(res);

}

function clsrule() {
    var res = {};
    var d = [];
    var html = getResCode();
    if (html.indexOf('检测中') != -1) {
        
        html = fetch(MY_URL + '?btwaf' + html.match(/btwaf(.*?)\"/)[1], {
            headers: {
                "User-Agent": MOBILE_UA
            }
        });
    };

    var spl = MY_URL.match(/([\S]*?:\/\/[\S]*?)\//)[1];
    if (html.indexOf('人机身份验证，请完成以下操作') > -1 || html.indexOf('人机识别，请稍等') > -1) {
        eval(getItem('huadong').replace(/refre/g, spl));
        var html = fetch(MY_URL, {
            headers: {
                "User-Agent": MOBILE_UA,
                "Cookie": cok,
                "Referer": spl
            }
        });
    };
    if (html.includes('js=click_html') || html.includes('_guard/auto.js')) {
        var _0x486ax7 = {
            "x": 616,
            "y": 288,
            "a": 904
        };

        var cook = "";
        
        var aa = getCookie(MY_URL);

        function setRet(_0x486axd, _0x486ax7) {
            let jsf = request(spl + "/_guard/encrypt.js");
            eval(jsf);
            var _0x486axe = _0x486axd["substr"](0, 8);
            var _0x486axf = cdn.MD5(_0x486axe);
            var _0x486ax10 = cdn["centos"]["encrypt"](JSON["stringify"](_0x486ax7), _0x486axf, {
                iv: _0x486axf
            });
            cook = "guardret=" + _0x486ax10.toString();
        }

        function t(_0x486ax7) {
            var co = aa.split("guard=");
            var _0x486axd = co.pop().split(";").shift();
            if (!_0x486axd) {
                log("重载");
            } else {
                setRet(_0x486axd, _0x486ax7)
            }
        }
        t(_0x486ax7);
        html = fetch(MY_URL, {
            headers: {
                'User-Agent': MOBILE_UA,
                'Cookie': aa + '; ' + cook
            }
        });
    };
    refreshX5WebView("");
        if (/myui-vodlist/.test(html) && /pic-tag|pic-text/.test(html)) {
            var list = pdfa(html, ".myui-vodlist&&li:has(a)");
        } else if (/stui-vodlist/.test(html) && /pic-text|pic-tag|<\/em>/.test(html)) {
            var list = pdfa(html, ".stui-vodlist&&li:has(a)");
        } else if (/stui-vodlist/.test(html) && /stui-vodlist__detail/.test(html)) {
            var list = pdfa(html, ".stui-vodlist&&li:has(a)");
        } else if (/ewave-vodlist/.test(html) && /ewave-vodlist__detail/.test(html)) {
            var list = pdfa(html, ".ewave-vodlist&&li:has(a)");
        } else if (/vodlist/.test(html) && /pack-ykpack/.test(html)) {
            var list = pdfa(html, '.vodlist&&.pack-ykpack');
        } else if (/vodlist/.test(html) && /vodlist_item/.test(html)) {
            var list = pdfa(html, ".vodlist&&li");
        } else if (/mo-part-round/.test(html) && /mo-situ-name/.test(html)) {
            var list = pdfa(html, 'body&&.mo-part-round:has(.mo-situ-name)&&.mo-cols-info');
        } else if (/mo-main-foot/.test(html) && /mo-list-wrap/.test(html)) {
            var list = pdfa(html, 'body&&.mo-list-wrap:has(.mo-lazy-play)&&li');
        } else if (/fed-list-info/.test(html)) {
            var list = pdfa(html, '.fed-list-info&&li');
        } else if (/list-unstyled/.test(html)) {
            var list = pdfa(html, '.list-unstyled:has(.continu)&&li');
        } else if (/row-cards/.test(html) && /card-link/.test(html)) {
            var list = pdfa(html, '.row-cards&&.card');
        } else if (/cards/.test(html) && /card/.test(html)) {
            var list = pdfa(html, '.cards&&.card');
        } else if (/class\=\"v_list/.test(html)) {
            var list = pdfa(html, '.v_list&&li:has(a)');
        } else if (/leo-video-item/.test(html)) {
            var list = pdfa(html, 'body&&.leo-video-item');
        } else if (/hy-video-list/.test(html) && /col-sm-3/.test(html)) {
            var list = pdfa(html, '.hy-video-list&&.col-sm-3');
        } else if (/hl-vod-list/.test(html) && /hl-list-item/.test(html)) {
            var list = pdfa(html, '.hl-vod-list&&.hl-list-item');
        } else if (/box-video-list/.test(html) && /col-sm-3/.test(html)) {
            var list = pdfa(html, '.box-video-list&&.col-sm-3');
        } else if (/forum_card_fid/.test(html) && /threadlist/.test(html)) {
            var list = pdfa(html, 'body&&.threadlist&&li');
        } else if (/index-area/.test(html) && /link-hover/.test(html)) {
            var list = pdfa(html, 'body&&.main&&li:has(.link-hover)');
        } else if (/search-class-list-common/.test(html) && /search-class-list-li/.test(html)) {
            var list = pdfa(html, 'body&&.search-class-list-common&&li');
        } else if (/module-list/.test(html) && /module-item/.test(html)) {
            var list = pdfa(html, 'body&&.module-item');
        } else if (/module-items/.test(html) && /module-poster-item-info/.test(html)) {
            var list = pdfa(html, 'body&&.module-poster-item.module-item');
        } else if (/module-class-items/.test(html) && /module-poster-item/.test(html)) {
            var list = pdfa(html, 'body&&.module-item');
        } else if (/menuBar/.test(html) && /movie-item/.test(html)) {
            var list = pdfa(html, 'body&&.movie-item');
        } else if (/data_list/.test(html) && /DianDian/.test(html)) {
            var list = pdfa(html, 'body&&#data_list&&.DianDian');
        } else if (/tbox_m2/.test(html) && /tbox_t/.test(html)) {
            var list = pdfa(html, 'body&&.tbox_m2&&li');
        } else if (/tbox_m/.test(html) && /tbox_t/.test(html)) {
            var list = pdfa(html, 'body&&.tbox_m&&li');
        } else if (/vod_list/.test(html) && /common-action/.test(html)) {
            var list = pdfa(html, 'body&&#vod_list&&li');
        } else if (/volistheightb/.test(html) && /volistwidthb/.test(html)) {
            var list = pdfa(html, 'body&&.volistwidthb');
        } else if (/resize_list/.test(html) && /globalPicList/.test(html)) {
            var list = pdfa(html, '.globalPicList&&li');
        } else if (/public-list-button/.test(html) && /public-list-box/.test(html)) {
            var list = pdfa(html, '.list-vod||.border-box&&.public-list-box');
        } else if (/daFJ_dJJfFHa/.test(html)) {
            var list = pdfa(html, 'body&&.daFJ_dJJfFHa&&li');
        }

        for (var i = 0; i < list.length; i++) {
            try {
                if (/auete|wwgz/.test(MY_URL)) {
                    var img = pdfh(list[i], 'img&&src||data-echo');
                } else if (/module-list/.test(html) && /module-item/.test(html)) {
                    var img = pdfh(list[i], ".lazyloaded||.lazyload||.lazy&&data-src||data-6.66a.vipal");
                } else if (/vbox/.test(list[i]) && /vbox_t/.test(list[i])) {
                    var img = pdfh(list[i], "a&&style||data-6.66a.vipal");
                } else {
                    var img = pd(list[i], '.lazy||.lazyload||.lazyloaded||.mo-situ-pics||.mo-lazy-load||.fed-list-pics||.img-responsive||.eclazy||.video-pic||.hl-lazy||.leo-lazy&&data-6.66a.vipal||data-src||data-bg||data-original');
                }
                if (img.substring(0, 4) == 'http') {
                    img = img;
                } else {
                    img = spl + img
                }
            } catch (e) {}

            try {
                if (/class="jidi"|class="hdinfo"|class="qr"/.test(list[i])) {
                    var desc = pdfh(list[i], '.jidi||.hdinfo||.qr&&Text');
                } else if (/class="type"|class="time"/.test(list[i])) {
                    var typ = pdfh(list[i], '.type&&Text');
                    var tim = pdfh(list[i], '.time&&Text');
                    var desc = typ + ' ' + tim;
                } else if (/module-item-text/.test(list[i]) && /module-item-caption/.test(list[i])) {
                    var desc = pdfh(list[i], '.module-item-text&&Text');
                } else if (/mo-lazy-wind/.test(list[i]) && /dc-west/.test(list[i])) {
                    var desc = pdfh(list[i], '.dc-west&&Text');
                } else {
                    var desc = pdfh(list[i], '.pic-text||.pic_text||.mo-situ-rema||.fed-list-remarks||.continu||.newname||.v_note||.pack-prb||.note||.pic-tag-left||.pic-tag-top||.hl-pic-text||.hdtag||.other||.zhuangtai||.module-item-text||.module-item-caption||.module-item-note||.list-remarks||.sBottom||.public-list-prb||.ribbon-bookmark||span&&Text');
                }
            } catch (e) {}

            if (/mo-situ-name/.test(list[i])) {
                var title = pdfh(list[i], '.mo-situ-name&&Text');
            } else if (/fed-list-title/.test(list[i])) {
                var title = pdfh(list[i], '.fed-list-title&&Text');
            } else if (/ff-text-right|cell_imform|zoomOverlay|mo-lazy-wind/.test(list[i])) {
                var title = pdfh(list[i], 'img&&alt');
            } else if (/video-model-title/.test(list[i])) {
                var title = pdfh(list[i], '.video-model-title&&Text');
            } else if (/txtA/.test(list[i])) {
                var title = pdfh(list[i], '.txtA&&Text');
            } else if (/stui-vodlist__detail/.test(list[i])) {
                var title = pdfh(list[i], 'a[title],-1&&title');
            } else {
                var title = pdfh(list[i], 'a[title]&&title');
            }

            var url = pd(list[i], 'a&&href');
            if (!img) {
                d.push({
                    title: title,
                    url: $(((url.substring(0, 4) == 'http' || url.substring(0, 4) == 'hike') ? url : spl + url)).rule((MOVtitle) => {
                        eval(fetch('hiker://files/rules/xyq/hikermovie.js'));
                        omerj();
                    }, title),
                    desc: desc,
                    extra: {
                        longClick: [{
                                title: JSON.parse(getRule()).title + '搜索',
                                js: $.toString((title) => {
                                    var link = 'hiker://empty#noRecordHistory#$$$hiker://files/rules/xyq/hikermovie.json$$$' + title + '$$$fypage$$$';
                                    return $(link).rule(() => {
                                        setPageTitle('搜索');
                                        eval(fetch('hiker://files/rules/xyq/hikermovie.js'));
                                        hiksearch();
                                    });
                                }, title),
                                extra: {
                                    pageTitle: "搜索"
                                }
                            }
                        ],
                        key: title
                    },
                    col_type: 'text_center_1'
                });
            }
            else {
                if (/imgdb/.test(img)) {
                    var tup = img + '@Referer=';
                } else if (/cocomanga/.test(spl)) {
                    var tup = img + '@Referer=' + spl + '@User-Agent=' + MOBILE_UA;
                } else if (/look4you/.test(img)) {
                    var tup = img + '@Referer=' + spl;
                } else {
                    var tup = img + '@Referer=' + img
                }
                d.push({
                    title: title,
                    pic_url: tup,
                    desc: desc,
                    url: $(((url.substring(0, 4) == 'http' || url.substring(0, 4) == 'hike') ? url : spl + url)).rule((MOVtitle) => {
                        eval(fetch('hiker://files/rules/xyq/hikermovie.js'));
                        omerj();
                    }, title),
                    extra: {
                        longClick: [{
                                title: JSON.parse(getRule()).title + '搜索',
                                js: $.toString((title) => {
                                    var link = 'hiker://empty#noRecordHistory#$$$hiker://files/rules/xyq/hikermovie.json$$$' + title + '$$$fypage$$$';
                                    return $(link).rule(() => {
                                        setPageTitle('搜索');
                                        eval(fetch('hiker://files/rules/xyq/hikermovie.js'));
                                        hiksearch();
                                    });
                                }, title),
                                extra: {
                                    pageTitle: "搜索"
                                }
                            }
                        ],
                        key: title
                    },
                    col_type: 'movie_3_marquee'
                });
            }

        }

    res.data = d;
    setHomeResult(res);

}

function hiksearch() {
    var urlph = $.toString(() => {
        if (/dm84/.test(url)) {
            url = url + '/s-' + spl[2] + '---------fypage.html';
        } else if (/saohuo|shdy3|shdy2/.test(url)) {
            url = url + '/s-' + spl[2] + '---------fypage.html';
        } else if (/viptv/.test(url)) {
            url = url + '/vod/search/page/fypage/wd/' + spl[2] + '.html';
        } else if (/qkan8/.test(url)) {
            url = url + '/index.php/vod/search/page/fypage/wd/' + spl[2] + '.html';
        } else if (/omofuna/.test(url)) {
            url = url + '/search/' + spl[2] + '----------fypage.html';
        } else if (/auete/.test(url)) {
            url = url + '/auete4so.php?searchword=' + spl[2];
        } else if (/wwgz/.test(url)) {
            url = url + '/index.php？？m=vod-search?wd=' + spl[2];
        }
    });
    var res = {};
    var d = [];
    var spl = MY_URL.split('$$$');
    var json = JSON.parse(fetch(spl[1], {}));
    for (var i = 0; i < json.data.length; i++) {
        var list = json.data[i].list;
        d.push({
            title: '点击开始聚合搜索：' + spl[2],
            url: $('hiker://empty#noHistory#$$$hiker://files/rules/xyq/hikermovie.js$$$' + spl[2] + '$$$fypage').rule((list, urlph) => {
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
                                var url = list[j].url;
                                eval(urlph);
                                var Url = url.replace('fypage', '1');
                                if (/wwgz/.test(Url)) {
                                    Data.push({
                                        url: Url.split('?')[0].replace('？？', '?'),
                                        options: {
                                            headers: {
                                                "User-Agent": MOBILE_UA
                                            },
                                            body: Url.split('?')[1],
                                            method: 'POST',
                                            timeout: tout
                                        }
                                    });
                                } else if (/viptv|saohuo|shdy3|shdy2|dm84|omofuna/.test(Url)) {
                                    Data.push({
                                        url: Url,
                                        options: {
                                            headers: {
                                                "User-Agent": MOBILE_UA,
                                                "Cookie": fetch("hiker://files/rules/xyq/xqyscookie/" + title + "cookie.txt", {})
                                            },
                                            timeout: tout
                                        }
                                    });
                                } else {
                                    Data.push({
                                        url: Url,
                                        options: {
                                            headers: {
                                                "User-Agent": MOBILE_UA
                                            },
                                            timeout: tout
                                        }
                                    });
                                };
                                Tit.push({
                                    tit: title
                                });
                            }
                        }
                    } catch (e) {
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
                                        eval(fetch('hiker://files/rules/xyq/hikermovie.js'));
                                        hikseaerji();
                                    }, param.tit.tit);
                                    let html = fetch(param.it.url, param.it.options);
                                    if (html == "" || html == null || html.substring(0, 5) == 'error') {
                                        d.push({
                                            title: param.tit.tit + ' 未找到结果，点击查看原站',
                                            url: param.it.url,
                                            desc: "",
                                            pic_url: "",
                                            col_type: 'text_1'
                                        });
                                    } else if (/btwaf/.test(html)) {
                                        
                                        html = fetch(param.it.url + '?btwaf' + html.match(/btwaf(.*?)\"/)[1], {
                                            headers: {
                                                "User-Agent": MOBILE_UA
                                            }
                                        });
                                    } else if (html.search(/请输入验证码|首次搜索需要输入验证码|此数据需要输入验证码|验证后查看搜索结果|访问此数据需要输入验|正确的验证码继续访问|需要先输入验证码/) != -1 && !/wwgz/.test(param.it.url)) {
                                        if (html.search(/验证后查看搜索结果/) != -1) {
                                            d.push({
                                                title: param.tit.tit + ' 需要验证，点击进入原站搜索',
                                                url: param.it.url,
                                                desc: "",
                                                pic_url: "",
                                                col_type: 'text_1'
                                            });
                                        } else {
                                            d.push({
                                                title: param.tit.tit + ' 需要验证码，请进入站点搜索',
                                                url: param.it.url + ';get;utf-8;{User-Agent@.js:MOBILE_UA&&Cookie@.js:fetch("hiker://files/rules/xyq/xqyscookie/' + param.tit.tit + 'cookie.txt", {})}' + sear,
                                                desc: "",
                                                pic_url: "",
                                                col_type: 'text_1'
                                            });
                                        }
                                    } else {
                                        var spl = param.it.url.match(/([\S]*?:\/\/[\S]*?)\//)[1];
                                        if (html.indexOf('人机身份验证，请完成以下操作') > -1 || html.indexOf('人机识别，请稍等') > -1) {
                                            eval(getItem('huadong').replace(/refre/g, spl));
                                            html = fetch(param.it.url, {
                                                headers: {
                                                    "User-Agent": MOBILE_UA,
                                                    "Cookie": cok,
                                                    "Referer": spl
                                                }
                                            });
                                        };
                                        if (html.includes('js=click_html') || html.includes('_guard/auto.js')) {
                                            var _0x486ax7 = {
                                                "x": 616,
                                                "y": 288,
                                                "a": 904
                                            };

                                            var cook = "";
                                            
                                            var aa = getCookie(param.it.url);

                                            function setRet(_0x486axd, _0x486ax7) {
                                                let jsf = request(spl + "/_guard/encrypt.js");
                                                eval(jsf);
                                                var _0x486axe = _0x486axd["substr"](0, 8);
                                                var _0x486axf = cdn.MD5(_0x486axe);
                                                var _0x486ax10 = cdn["centos"]["encrypt"](JSON["stringify"](_0x486ax7), _0x486axf, {
                                                    iv: _0x486axf
                                                });
                                                cook = "guardret=" + _0x486ax10.toString();
                                            }

                                            function t(_0x486ax7) {
                                                var co = aa.split("guard=");
                                                var _0x486axd = co.pop().split(";").shift();
                                                if (!_0x486axd) {
                                                    log("重载");
                                                } else {
                                                    setRet(_0x486axd, _0x486ax7)
                                                }
                                            }
                                            t(_0x486ax7);
                                            html = fetch(param.it.url, {
                                                headers: {
                                                    'User-Agent': MOBILE_UA,
                                                    'Cookie': 'searchneed=ok; ' + aa + '; ' + cook
                                                }
                                            });
                                        };
                                        if (html.includes("请稍等5秒钟左右") && html.includes("提供DDoS防护")) {
                                            eval(pdfh(html, 'head&&script&&Html').split('function')[0]);

                                            function loadFunc() {
                                                var e = getCookie(param.it.url);
                                                if (null != e) {
                                                    for (var t = e.toString().split(";"), n = "", o = 0; o < t.length; o++) {
                                                        var i = (e = t[o].trim()).split("=");
                                                        if (2 == i.length && i[0] == cpk) {
                                                            n = i[1];
                                                            break
                                                        }
                                                    }
                                                    if (0 != n.length) {
                                                        for (var a = 0, o = 0; o < n.length; o++) {
                                                            var d = n[o];
                                                            /^[a-zA-Z0-9]$/.test(d) && (a += n.charCodeAt(o) * (nonce + o))
                                                        }
                                                        let jum = request(param.it.url, {
                                                            headers: {
                                                                'X-GE-UA-Step': step,
                                                                'Referer': param.it.url,
                                                                'Cookie': 'ge_ua_p=' + n
                                                            },
                                                            body: "sum=" + a + "&nonce=" + nonce,
                                                            method: 'POST'
                                                        });
                                                        log(jum);
                                                    }
                                                }
                                            }
                                            loadFunc();
                                            html = request(param.it.url, {
                                                headers: {
                                                    "Cookie": getCookie(param.it.url),
                                                    "Referer": param.it.url
                                                }
                                            });
                                        };

                                        eval(fetch('hiker://files/rules/xyq/hikermovie.js'));
                                        ssjiex();

                                    };
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
                }, list, urlph),
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
            var url = list[j].url;
            eval(urlph);
            if (/saohuo|shdy3|shdy2|dm84/.test(url)) {
                var link = url + ';get;utf-8;{User-Agent@.js:MOBILE_UA&&Cookie@.js:fetch("hiker://files/rules/xyq/xqyscookie/' + list[j].title + 'cookie.txt", {})}';
            } else if (/wwgz/.test(url)) {
                var link = url + ';post;utf-8;{User-Agent@.js:MOBILE_UA}';
            } else if (/viptv/.test(url)) {
                var link = url + ';get;utf-8;{User-Agent@.js:MOBILE_UA&&Cookie@.js:fetch("hiker://files/rules/xyq/xqyscookie/' + list[j].title + 'cookie.txt", {})}';
            } else if (/omofuna/.test(url)) {
                var link = url + ';get;utf-8;{User-Agent@.js:MOBILE_UA&&Cookie@.js:fetch("hiker://files/rules/xyq/xqyscookie/' + list[j].title + 'cookie.txt", {})}';
            } else {
                var link = url
            }
            d.push({
                title: list[j].title,
                img: list[j].ico,
                url: $(link + '#noHistory#').rule((cktitle) => {
                    eval(fetch('hiker://files/rules/xyq/hikermovie.js'));
                    hikseaerji();
                }, list[j].title),
                col_type: 'icon_4_card'
            });
        }
    }
    res.data = d;
    setSearchResult(res);
}

function ssjiex() {
    try {
        if (/public-list-box/.test(html) && /public-list-prb|search-box/.test(html)) {
            var list = pdfa(html, 'body&&.search-box');
        } else if (/search_list/.test(html)) {
            var list = pdfa(html, '.search_list&&li');
        } else if (/list-unstyled/.test(html) && /justify-content-between/.test(html)) {
            var list = pdfa(html, 'body&&.list-unstyled');
        } else if (/globalMarginTop/.test(html) && /globalPicList/.test(html)) {
            var list = pdfa(html, '#data_list&&li');
        } else if (/globalPadding/.test(html) && /txtHeight/.test(html)) {
            var list = pdfa(html, '#data_list&&li');
        } else if (/list-unstyled/.test(html)) {
            var list = pdfa(html, '.list-unstyled:has(.continu)&&li');
        } else if (/pack-packcover/.test(html)) {
            var list = pdfa(html, 'body&&.search-list');
        } else if (/result_list/.test(html)) {
            var list = pdfa(html, 'body&&.result_list');
        } else if (/hl-list-item|hy-main-content/.test(html)) {
            var list = pdfa(html, 'body&&.hl-list-item||.hy-video-details');
        } else if (/module-list/.test(html) && /module-search-item/.test(html)) {
            var list = pdfa(html, 'body&&.module-search-item');
        } else if (/module-card-items/.test(html) && /module-card-item-info/.test(html)) {
            var list = pdfa(html, 'body&&.module-card-item');
        } else if (/search-list/.test(html) && /card/.test(html)) {
            var list = pdfa(html, '.search-list&&.card');
        } else if (/position-relative/.test(html) && /card-body/.test(html)) {
            var list = pdfa(html, '.row-cards&&.row-0');
        } else if (/searchList/.test(html)) {
            var list = pdfa(html, '#searchList&&li');
        } else if (/searchlilst/.test(html)) {
            var list = pdfa(html, '.searchlilst&&li');
        } else if (/stui-vodlist__media/.test(html)) {
            var list = pdfa(html, '.stui-vodlist__media&&li');
        } else if (/ewave-vodlist__media/.test(html)) {
            var list = pdfa(html, '.ewave-vodlist__media&&li');
        } else if (/stui-vodlist/.test(html)) {
            var list = pdfa(html, '.stui-vodlist&&li:has(a)');
        } else if (/daFJ_dJJfFHa/.test(html)) {
            var list = pdfa(html, 'body&&.daFJ_dJJfFHa&&li');
        } else if (/vodlist/.test(html) && /searchlist_item/.test(html)) {
            var list = pdfa(html, '.vodlist&&li');
        } else if (/class\=\"v_list/.test(html)) {
            var list = pdfa(html, '.v_list&&li:has(a)');
        } else if (/mo-main-info/.test(html)) {
            var list = pdfa(html, '.mo-main-info&&.mo-deta-info:has(a)');
        } else if (/mo-main-foot/.test(html) && /mo-info-item/.test(html)) {
            var list = pdfa(html, '.mo-main-foot&&.mo-info-wrap:has(a)');
        } else if (/fed-main-info/.test(html)) {
            var list = pdfa(html, '.fed-main-info&&.fed-deta-info');
        } else if (/long-list/.test(html) && /long-result/.test(html)) {
            var list = pdfa(html, '.long-result&&li');
        } else if (/index-area/.test(html) && /link-hover/.test(html) && /sy-nav-down|sj-nav-down/.test(html)) {
            var list = pdfa(html, 'body&&.main&&li:has(.link-hover)');
        } else if (/box-main-content/.test(html) && /col-sm-4/.test(html)) {
            var list = pdfa(html, '.box-main-content&&.col-sm-4');
        } else if (/data_list/.test(html) && /DianDian/.test(html)) {
            var list = pdfa(html, 'body&&#data_list&&.DianDian');
        } else if (/tbox_m2/.test(html) && /tbox_t/.test(html)) {
            var list = pdfa(html, 'body&&.tbox_m2&&li');
        } else if (/tbox_m/.test(html) && /tbox_t/.test(html)) {
            var list = pdfa(html, 'body&&.tbox_m&&li');
        } else if (/common-action/.test(html) && /vod_list/.test(html)) {
            var list = pdfa(html, 'body&&#vod_list&&li');
        }
    } catch (e) {}
    try {
        var tkt = param.tit.tit;
        var dku = param.it.url;
    } catch (e) {
        var tkt = '';
        var dku = MY_URL;
    }

    if (list) {
        if (list.length < 1) {
            d.push({
                title: tkt + ' 未找到结果，点击查看原站',
                url: dku,
                desc: "",
                pic_url: "",
                col_type: 'text_1'
            });
        } else {
            for (var i = 0; i < list.length; i++) {
                var cont = '',
                    desc = '';
                if (/<rss/.test(html) && /<generator>/.test(html)) {
                    var title = list[i].match(/\<title\>(.*?)\<\/title\>/)[1];
                    var desc = pdfh(list[i], 'description&&Text');
                    var cont = pdfh(list[i], 'pubdate&&Text');
                    var url = list[i].match(/\<link\>(.*?)\n/)[1];
                } else {
                    try {
                        if (/txtHeight/.test(list[i]) && /sTit/.test(list[i])) {
                            var title = pdfh(list[i], '.sTit&&Text');
                        } else if (/img/.test(list[i]) && /alt/.test(list[i]) && !/<!-- <img/.test(list[i])) {
                            var title = pdfh(list[i], 'img[alt]&&alt');
                        } else if (/title=\"/.test(list[i])) {
                            var title = pdfh(list[i], 'a[title]&&title');
                        } else if (/h1|h2|h3|h4/.test(list[i])) {
                            var title = pdfh(list[i], 'h1||h2||h3||h4&&a&&Text');
                        } else if (/module-card-item-title/.test(list[i])) {
                            var title = pdfh(list[i], '.module-card-item-title&&Text');
                        } else if (/gen-movie-img/.test(list[i])) {
                            var title = pdfh(list[i], '.thumb-txt&&Text');
                        } else if (/result_title/.test(list[i])) {
                            var title = pdfh(list[i], '.result_title&&Text');
                        } else {
                            var title = pdfh(list[i], 'a&&Text');
                        }
                    } catch (e) {}

                    try {
                        if (/search-movie-title/.test(list[i]) && /object-cover/.test(list[i])) {
                            var img = pdfh(list[i], "img&&src");
                        } else if (/module-list/.test(html) && /module-search-item/.test(html)) {
                            var img = pdfh(list[i], ".lazyload||.lazyloaded||.lazy&&data-src||data-6.66a.vipal");
                        } else if (/background-position/.test(list[i])) {
                            var img = list[i].match(/url\((.*?)\)/)[1];
                        } else if (/vbox/.test(list[i]) && /vbox_t/.test(list[i])) {
                            var img = pdfh(list[i], "a&&style||data-6.66a.vipal");
                        } else {
                            var img = pd(list[i], '.lazyload||.lazyloaded||.lazy||.mo-situ-pics||.mo-lazy-load||.fed-list-pics||.img-responsive||.eclazy||.video-pic||.videopic||.hl-lazy||.leo-lazy&&data-6.66a.vipal||data-src||style||data-bg||data-original');
                        }
                    } catch (e) {}

                    try {
                        if (/vbox/.test(list[i]) && /vbox_t/.test(list[i])) {
                            var desc = pdfh(list[i], 'span&&Text');
                        } else if (/class="jidi"|class="hdinfo"|class="qr"/.test(list[i])) {
                            var desc = pdfh(list[i], '.jidi||.hdinfo||.qr&&Text');
                        } else {
                            var desc = pdfh(list[i], '.pic-text||.pic_text||.mo-situ-rema||.fed-list-remarks||.continu||.newname||.meta||.v_note||.note||.pack-prb||.hl-pic-text||.pic-tag||.other||.score||.video-serial||.list-remarks||.module-item-note||.public-list-prb||.reuslt_score&&Text');
                        }
                    } catch (e) {}

                    try {
                        
                        if (/class="type"|class="time"/.test(list[i])) {
                            var typ = pdfh(list[i], '.type&&Text');
                            var tim = pdfh(list[i], '.time&&Text');
                            var cont = typ + ' ' + tim;
                        } else if (/module-card-item-info/.test(list[i])) {
                            var cont = pdfh(list[i], '.module-card-item-info&&.module-info-item,-1&&Text');
                        } else {
                            var cont = pdfh(list[i], '.detail||dd||.fed-deta-content||.cell_imform_kv_desc||.leo-detail-media||.description||.ecitem-desc||.hl-item-content||.hy-video-details||.list-detail||.actor||.video-info-main||.stui-vodlist__detail||.thumb-content||.reusltbox_info&&Text');
                        }
                    } catch (e) {}

                    var url = pdfh(list[i], 'a&&href');
                }

                if (!img) {
                    d.push({
                        title: MY_TYPE == "home" ? title.replace(getMyVar("xyqxqystext", ""), '「' + getMyVar("xyqxqystext", "") + '」') : title,
                        url: $(((url.substring(0, 4) == 'http' || url.substring(0, 4) == 'hike') ? url : spl + url)).rule((tkt, MOVtitle) => {
                            if (tkt != '') {
                                setPageTitle(tkt + '-' + MOVtitle);
                            }
                            eval(fetch('hiker://files/rules/xyq/hikermovie.js'));
                            omerj();
                        }, tkt, title),
                        pic_url: "",
                        desc: cont + ' ' + tkt,
                        col_type: 'text_center_1'
                    });
                }
                else {
                    if (img.substring(0, 4) == 'http') {
                        img = img;
                    } else {
                        img = spl + img
                    }
                    if (/imgdb/.test(img)) {
                        var tup = img + '@Referer=';
                    } else if (/look4you/.test(img)) {
                        var tup = img + '@Referer=' + spl;
                    } else {
                        var tup = img + '@Referer=' + img
                    }
                    d.push({
                        title: MY_TYPE == "home" ? title.replace(getMyVar("xyqxqystext", ""), '「' + getMyVar("xyqxqystext", "") + '」') + ' ' + desc + '\n' + tkt : title + ' ' + desc,
                        pic_url: tup,
                        url: $(((url.substring(0, 4) == 'http' || url.substring(0, 4) == 'hike') ? url : spl + url)).rule((tkt, MOVtitle) => {
                            if (tkt != '') {
                                setPageTitle(tkt + '-' + MOVtitle);
                            }
                            eval(fetch('hiker://files/rules/xyq/hikermovie.js'));
                            omerj();
                        }, tkt, title),
                        desc: MY_TYPE == "home" ? cont : ' ' + tkt,
                        content: cont,
                        col_type: 'movie_1_vertical_pic'
                    });
                }

            }
        }

    }
    else {
        d.push({
            title: tkt + ' 未找到结果，点击查看原站',
            url: dku,
            desc: "",
            pic_url: "",
            col_type: 'text_1'
        });
    }
}

function hikseaerji() {
    var res = {};
    var d = [];
    var html = getResCode();

    if (html.indexOf('检测中') != -1) {
        
        html = fetch(MY_URL + '?btwaf' + html.match(/btwaf(.*?)\"/)[1], {
            headers: {
                "User-Agent": MOBILE_UA
            }
        });
    };

    var spl = MY_URL.match(/([\S]*?:\/\/[\S]*?)\//)[1];
    if (html.indexOf('人机身份验证，请完成以下操作') > -1 || html.indexOf('人机识别，请稍等') > -1) {
        eval(getItem('huadong').replace(/refre/g, spl));
        var html = fetch(MY_URL, {
            headers: {
                "User-Agent": MOBILE_UA,
                "Cookie": cok,
                "Referer": spl
            }
        });
    };
    if (html.includes('js=click_html') || html.includes('_guard/auto.js')) {
        var _0x486ax7 = {
            "x": 616,
            "y": 288,
            "a": 904
        };

        var cook = "";
        
        var aa = getCookie(MY_URL);

        function setRet(_0x486axd, _0x486ax7) {
            let jsf = request(spl + "/_guard/encrypt.js");
            eval(jsf);
            var _0x486axe = _0x486axd["substr"](0, 8);
            var _0x486axf = cdn.MD5(_0x486axe);
            var _0x486ax10 = cdn["centos"]["encrypt"](JSON["stringify"](_0x486ax7), _0x486axf, {
                iv: _0x486axf
            });
            cook = "guardret=" + _0x486ax10.toString();
        }

        function t(_0x486ax7) {
            var co = aa.split("guard=");
            var _0x486axd = co.pop().split(";").shift();
            if (!_0x486axd) {
                log("重载");
            } else {
                setRet(_0x486axd, _0x486ax7)
            }
        }
        t(_0x486ax7);
        html = fetch(MY_URL, {
            headers: {
                'User-Agent': MOBILE_UA,
                'Cookie': 'searchneed=ok; ' + aa + '; ' + cook
            }
        });
    };
    if (html.includes("请稍等5秒钟左右") && html.includes("提供DDoS防护")) {
        eval(pdfh(html, 'head&&script&&Html').split('function')[0]);

        function loadFunc() {
            var e = getCookie(MY_URL);
            if (null != e) {
                for (var t = e.toString().split(";"), n = "", o = 0; o < t.length; o++) {
                    var i = (e = t[o].trim()).split("=");
                    if (2 == i.length && i[0] == cpk) {
                        n = i[1];
                        break
                    }
                }
                if (0 != n.length) {
                    for (var a = 0, o = 0; o < n.length; o++) {
                        var d = n[o];
                        /^[a-zA-Z0-9]$/.test(d) && (a += n.charCodeAt(o) * (nonce + o))
                    }
                    let jum = request(MY_URL, {
                        headers: {
                            'X-GE-UA-Step': step,
                            'Referer': MY_URL,
                            'Cookie': 'ge_ua_p=' + n
                        },
                        body: "sum=" + a + "&nonce=" + nonce,
                        method: 'POST'
                    });
                    log(jum);
                }
            }
        }
        loadFunc();
        var html = request(MY_URL, {
            headers: {
                "Cookie": getCookie(MY_URL),
                "Referer": MY_URL
            }
        });
    };
    if (html.search(/请输入验证码|验证后查看搜索结果|首次搜索需要输入验证码|访问此数据需要输入验|正确的验证码继续访问|需要先输入验证码|系统安全验证|因访问过多/) != -1 && !/wwgz/.test(spl)) {
        if (/omofuna/.test(spl) && html.search(/系统安全验证|因访问过多|继续访问/) != -1) {
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
        var imglin = /saohuo|shdy3|shdy2|auete/.test(spl) ? spl + '/include/vdimgck.php?get=' + new Date() : spl + '/index.php/verify/index.html?r=' + Math.random();
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
                    if (/saohuo|shdy3|shdy2|auete/.test(spl)) {
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
        eval(fetch('hiker://files/rules/xyq/hikermovie.js'));
        ssjiex();
    }
    res.data = d;
    setHomeResult(res);
}

function omerj() {
    var res = {};
    var d = [];

    d.push({
        title: '',
        desc: '255&&float',
        url: '',
        col_type: 'x5_webview_single'
    });
    refreshX5WebView('');
    d.push({
        title: JSON.parse(getRule()).title + '搜索',
        desc: '',
        url: $('hiker://empty#noHistory#$$$hiker://files/rules/xyq/hikermovie.json$$$' + MOVtitle + '$$$fypage$$$').rule(() => {
            eval(fetch('hiker://files/rules/xyq/hikermovie.js'));
            hiksearch();
        }),
        extra: {
            pageTitle: "搜索"
        },
        col_type: 'flex_button'
    });
    var html = getResCode().replace(/<!--([\S\s]*?)-->/g, '');
    if (html.indexOf('检测中') != -1) {
        html = fetch(MY_URL + '?btwaf' + html.match(/btwaf(.*?)\"/)[1], {
            headers: {
                "User-Agent": MOBILE_UA
            }
        });
    };
    var omdomin = MY_URL.match(/([\S]*?:\/\/[\S]*?)\//)[1];
    if (html.indexOf('人机身份验证，请完成以下操作') > -1 || html.indexOf('人机识别，请稍等') > -1) {
        eval(getItem('huadong').replace(/refre/g, omdomin));
        var html = fetch(MY_URL, {
            headers: {
                "User-Agent": MOBILE_UA,
                "Cookie": cok,
                "Referer": omdomin
            }
        });
    };
    if (/saohuo|shdy3|shdy2|dm84/.test(omdomin)) {
        var tabs = pdfa(html, 'body&&.from_list&&li');
        var conts = pdfa(html, 'body&&#play_link&&li');
    } else if (/wwgz/.test(omdomin)) {
        var tabs = pdfa(html, '#leftTabBox&&ul&&li');
        var conts = pdfa(html, '#leftTabBox&&.numList');
    } else if (/channel-tab/.test(html) && /play-list-content/.test(html)) {
        var tabs = pdfa(html, '.channel-tab&&li');
        var conts = pdfa(html, 'body&&.play-list-content');
    } else if (/hy-play-list/.test(html) && /tab-content/.test(html)) {
        var tabs = pdfa(html, '.tab-content&&.option');
        var conts = pdfa(html, '.tab-content&&.playlist');
    } else if (/hl-plays-list/.test(html) && /hl-plays-from/.test(html)) {
        var tabs = pdfa(html, '.hl-plays-from&&a');
        var conts = pdfa(html, '.hl-play-source&&.hl-plays-list');
    } else if (/nav-tabs/.test(html) && /\=\"#playlist/.test(html)) {
        var tabs = pdfa(html, ".nav-tabs&&li");
    } else if (/nav-tabs/.test(html) && /#player/.test(html)) {
        var tabs = pdfa(html, ".nav-tabs&&.item&&li");
    } else if (/nav-tabs/.test(html) && /player-sidebar/.test(html)) {
        var tabs = pdfa(html, ".nav-tabs&&.item&&li");
    } else if (/vod-nav-play/.test(html) && /glyphicon-facetime-video/.test(html)) {
        var tabs = pdfa(html, ".vod-nav-play&&h2");
    } else if (/nav-tabs/.test(html) && /ff-playurl-tab/.test(html)) {
        var tabs = pdfa(html, ".nav-tabs&&li");
    } else if (/nav-tabs/.test(html) && /#con_playlist/.test(html)) {
        var tabs = pdfa(html, "body&&.nav-tabs&&.gico");
    } else if (/stui-content__detail/.test(html) && /stui-content__playlist/.test(html)) {
        if(/data-toggle\=\"tab/.test(html)){
            var tabs = pdfa(html, ".nav-tabs&&li");
        } else if (/fa-youtube-play|pull-right/.test(html)) {
            var tabs = pdfa(html, "body&&.stui-pannel__head||.stui-vodlist__head");
        } else if (/s-playsite/.test(html)) {
            var tabs = pdfa(html, "body&&.js-list&&li");
        } else if (/open-dropdown/.test(html)) {
            var tabs = pdfa(html, "body&&.dropdown-menu&&li");
        } else if (/stui-vodlist__head/.test(html)) {
            var tabs = pdfa(html, "body&&.stui-vodlist__head");
        } else {
            var tabs = pdfa(html, "body&&.playlist");
        }
    } else if (/stui-player__video/.test(html) && /stui-play__list/.test(html)) {
        var tabs = pdfa(html, ".play-tab&&li");
    } else if (/myui-panel__head/.test(html) && /sort-button/.test(html)) {
        var tabs = pdfa(html, "body&&.myui-panel_hd:has(.sort-button)");
    } else if (html.indexOf('mo-sort-head') != -1) {
        var tabs = pdfa(html, 'body&&.mo-sort-head&&.mo-movs-btns');
        var conts = pdfa(html, 'body&&.mo-main-info&&.mo-movs-item');
    } else if (html.indexOf('mo-list-boxs') != -1) {
        var tabs = pdfa(html, 'body&&.mo-list-wrap');
        var conts = pdfa(html, 'body&&.mo-list-boxs');
    } else if (html.indexOf('play_source_tab') != -1) {
        var tabs = pdfa(html, '.play_source_tab&&a');
    } else if (/fed-tabs-item/.test(html)) {
        var tabs = pdfa(html, '.fed-tabs-item&&.fed-btns-info');
    } else if (/leo-source-cho/.test(html)) {
        var tabs = pdfa(html, 'body&&.leo-source-cho&&li');
    } else if (/player_list/.test(html) && /justify-content-center/.test(html)) {
        var tabs = pdfa(html, 'body&&#player_list&&h2');
        var conts = pdfa(html, '#player_list&&ul');
    } else if (/tagContent/.test(html) && /js-list/.test(html)) {
        var tabs = pdfa(html, "body&&.js-list&&li");
        var conts = pdfa(html, 'body&&#tagContent&&ul');
    } else if (/playNumTab/.test(html) && /tabContainer/.test(html)) {
        var tabs = pdfa(html, 'body&&#playNumTab&&a');
    } else if (/playfrom/.test(html) && /videourl/.test(html)) {
        var tabs = pdfa(html, "body&&.playfrom&&li");
        var conts = pdfa(html, 'body&&.videourl');
    } else if (/tab_content/.test(html) && /tab_control/.test(html)) {
        var tabs = pdfa(html, 'body&&.play_from&&li');
        var conts = pdfa(html, 'body&&.play_list');
    }

    if (/anthology-list-play/.test(html) && /anthology-list-box/.test(html)) {
        var tabs = pdfa(html, '.anthology-tab&&a');
        var conts = pdfa(html, 'body&&.anthology-list-play');
    } else if (/tab-content/.test(html) && /list-unstyled/.test(html)) {
        var conts = pdfa(html, 'body&&.tab-content&&ul');
    } else if (/tab-content/.test(html) && /stui-content__playlist/.test(html)) {
        var conts = pdfa(html, 'body&&.stui-content__playlist');
    } else if (/stui-content__detail/.test(html) && /stui-content__playlist/.test(html)) {
        var conts = pdfa(html, 'body&&.stui-content__playlist');
    } else if (/ewave-content__detail/.test(html) && /ewave-content__playlist/.test(html)) {
        var conts = pdfa(html, 'body&&.ewave-content__playlist');
    } else if (/stui-content__detail/.test(html) && !/stui-content__playlist/.test(html) && /btn-primary/.test(html)) {
        var conts = pdfa(html, 'body&&.btn-primary');
    } else if (/stui-player__video/.test(html) && /stui-play__list/.test(html)) {
        var conts = pdfa(html, "body&&.stui-play__list");
    } else if (/tab-content/.test(html) && /myui-content__list/.test(html)) {
        var conts = pdfa(html, 'body&&.myui-content__list');
    } else if (/tabContainer/.test(html) && /playNumList/.test(html)) {
        if (/urlsTab/.test(html)) {
            var conts = pdfa(pdfh(html, 'body&&#tabContainer&&Html'), 'body&&.tabContainer');
        } else {
            var conts = pdfa(html, '#tabContainer&&.playNumList')
        };
    } else if (/playlist_full/.test(html) && /content_playlist/.test(html)) {
        var conts = pdfa(html, 'body&&.playlist_full:has(.content_playlist)');
    } else if (/play_list_box/.test(html) && /content_playlist/.test(html)) {
        var conts = pdfa(html, 'body&&.playlist_notfull:has(.content_playlist)');
    } else if (/tab-play/.test(html) && /content_playlist/.test(html)) {
        var tabs = pdfa(html, 'body&&#bofy&&h2');
        var conts = pdfa(html, 'body&&.content_playlist');
    } else if (/details-info/.test(html) && /con_playlist/.test(html)) {
        var conts = pdfa(html, '.playlist&&ul');
    } else if (/fed-play-item|leo-play-num/.test(html)) {
        var conts = pdfa(html, 'body&&.fed-play-item||.leo-play-num');
    } else if (/contentURL/.test(html) && /movievod/.test(html)) {
        var conts = pdfa(html, 'body&&.contentURL&&ul');
    } else if (/module-tab-item/.test(html) && /module-play-list-content/.test(html)) {
        var tabs = pdfa(html, 'body&&.module-tab-item:not(:matches(排序))');
        var conts = pdfa(html, 'body&&.module-play-list-content');
    } else if (/module-tab-item/.test(html) && /module-player-list/.test(html)) {
        var tabs = pdfa(html, 'body&&.module-tab-item:not(:matches(排序))');
        var conts = pdfa(html, 'body&&.module-player-list:has(.scroll-content)');
    } else if (/tabs_block/.test(html) && /list_block/.test(html)) {
        var tabs = pdfa(html, 'body&&.tabs');
        var conts = pdfa(html, 'body&&.list_block');
    } else if (/albumSelect/.test(html) && /mod-head-title/.test(html)) {
        var tabs = pdfa(html, 'body&&section:has(.albumSelect)');
        var conts = pdfa(html, 'body&&.albumSelect');
    } else if (/playListBox/.test(html) && /play-list/.test(html)) {
        var tabs = pdfa(html, 'body&&#playListBox&&.play-list');
        var conts = pdfa(html, 'body&&#playListBox&&.play-list');
    } else if (/align-items-center/.test(html) && /card-body/.test(html)) {
        var tabs = pdfa(html, 'body&&.mt-3:has(#play-list)');
        var conts = pdfa(html, 'body&&#play-list');
    } else if (/playlist-tab/.test(html) && /con_c2_list/.test(html)) {
        var tabs = pdfa(html, '.playlist-tab&&li');
        var conts = pdfa(html, 'body&&.con_c2_list');
    }

    if (conts || tabs) {
        for (var i = 0; i < conts.length; i++) {
            if (/contentURL/.test(html) && /movievod/.test(html)) {
                var list = conts[i].match(/name=\"copy_sel[\s\S]*?<span>/g);
            } else if (/fed-btns-info/.test(conts[i])) {
                var list = pdfa(conts[i], 'body&&.fed-btns-info');
            } else if (/scroll-content/.test(conts[i]) && /scroll-box/.test(conts[i])) {
                var list = pdfa(conts[i], 'body&&.scroll-content&&a');
            } else if (/<li>/.test(conts[i])) {
                var list = pdfa(conts[i], 'body&&li');
            } else {
                var list = pdfa(conts[i], 'body&&a:not(a:contains(展开全部))');
            }

            if (/saohuo|shdy3|shdy2|wwgz|dm84/.test(omdomin)) {
                list = list.reverse();
            }

            if (getVar('hikermsort', '1') == '1') {
                list = list;
            } else {
                list = list.reverse();
            }

            if (tabs) {
                if (/<\/h3>|<\/h2>/.test(tabs[i])) {
                    var tabt = pdfh(tabs[i], "h3||h2&&Text");
                } else if (/albumSelect|stui-vodlist__head/.test(tabs[i])) {
                    var tabt = pdfh(tabs[i], "span&&Text");
                } else if (/pull-left/.test(tabs[i])) {
                    var tabt = pdfh(tabs[i], ".pull-left&&Text");
                }
                
                else if (tabs[i] == undefined) {
                    var tabt = "线路一";
                } else {
                    var tabt = pdfh(tabs[i], "body&&Text");
                }

                d.push({
                    title: tabt + ' 🔗' + [i + 1] + '/' + conts.length + '（点击切换排序）',
                    url: "hiker://empty@lazyRule=.js:putVar('hikermsort', getVar('hikermsort','1')=='1'?'0':'1');refreshPage(false);'toast://排序已切换'",
                    col_type: 'text_1'
                });
            } else if (conts) {
                d.push({
                    title: '在线播放 🔗' + [i + 1] + '/' + conts.length + '（点击切换排序）',
                    url: "hiker://empty@lazyRule=.js:putVar('hikermsort', getVar('hikermsort','1')=='1'?'0':'1');refreshPage(false);'toast://排序已切换'",
                    col_type: 'text_1'
                });
            }

            for (var j = 0; j < list.length; j++) {
                var title = pdfh(list[j], "a&&Text");
                var link = pd(list[j], "a&&href");
                try {
                    title = title.match(/(第|\d|-)*(集|话|期)/g) ? title.replace(/第|集|话|期/g, '') : title;
                } catch (e) {
                    title = title
                }
                if (/duanju/.test(omdomin)) {
                    title = title.replace('VIP', '').replace('最新', '');
                }
                if (list.length <= 4) {
                    var clt = 'text_2';
                } else {
                    var clt = (isNaN(title) && !title.includes('番外')) ? 'flex_button' : 'text_5'
                }
                d.push({
                    title: title,
                    url: 'hiker://empty$$$' + omdomin + '$$$' + link + '$$$' + title + '$$$' + `@lazyRule=.js:eval(fetch('hiker://files/rules/xyq/hikermovie.js'));omlazy();`,
                    extra: {
                        blockRules: ['.css', '.gif', '.jpeg', '.png', '.ico', 'cnzz', '.51.la', 'google', 'xn--*:*', 'hm.baidu.com', '/ads/*.js'],
                        referer: omdomin,
                        id: 'hiker://empty$$$' + omdomin + '$$$' + link + '$$$' + title + '$$$'
                    },
                    col_type: clt
                });
            }
        }
    }

    res.data = d;
    setHomeResult(res);
}

function omlazy() {
    var myurl = input.split('$$$')[1];
    var srcurl = input.split('$$$')[2];
    var epititle = input.split('$$$')[3];
    var pgt = getPageTitle() + '-' + epititle;
    try {
        function playUrl(urls) {
            if ((urls.includes("vip.ffzy") || urls.includes("vip.lz") || urls.includes("hd.lz") || urls.includes("suonizy")) && urls.includes("index.m3u8") && !urls.includes("\"urls\"")) {
                let m3u8 = fetch(urls);
                if (m3u8.includes('EXT-X-STREAM-INF')) {
                    urls = urls.replace("index.m3u8", m3u8.split("\n")[2]);
                }
            }
            return urls;
        }
        function fixjiek(jiek) {
            if (jiek != '') {
                if (jiek.substring(0, 4) == 'http') {
                    jiek = jiek;
                } else if (jiek.substring(0, 2) == '\/\/') {
                    jiek = 'https:' + jiek;
                } else {
                    jiek = myurl + jiek
                }
                return jiek;
            }
            return '';
        }
        function zywyun(srcurl) {
            var link = srcurl.split("/share")[0];
            var fc = fetch(srcurl, {}).replace("var purl", "var main");
            if (fc.indexOf("main") != -1) {
                var mat = fc.match(/var main.*?;/)[0];
                eval(mat);
                var play = (main.indexOf("http") != -1 ? main : link + main);
            } else {
                var main = fc.match(/url:.*?[\'\"](.*?)[\'\"]/)[1];
                var play = (main.indexOf("http") != -1 ? main : link + main)
            }
            if ((play.includes("vip.ffzy") || play.includes("vip.lz") || play.includes("hd.lz") || play.includes(".cdnlz") || play.includes("suonizy")) && play.includes("index.m3u8")) {
                let m3u8 = fetch(play);
                if (m3u8.includes('EXT-X-STREAM-INF')) {
                    let houz = m3u8.split("\n")[2];
                    play = play.replace("index.m3u8", houz);
                }
                play = clearM3u8(play);
            }
            return play
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
        } else if (/wwgz/.test(myurl)) {
            return x5rule(srcurl, srcurl);
        }
        else if (/qkan8/.test(myurl)) {
            var phtml = request(srcurl);
            var urll = pdfh(phtml, '.fed-play-player&&iframe&&data-play');
            if (/qkan8/.test(myurl)) {
                urll = base64Decode(urll.slice(3))
            }
            var pars = pd(phtml, '.fed-play-player&&iframe&&data-pars');
            if (/.m3u8|.mp4|obj\/tos/.test(urll) && /http/.test(urll)) {
                if (urll.indexOf('cqzyw') != -1) {
                    var ul = JSON.parse(fetch(urll, {
                        headers: {
                            "User-Agent": "Dalvik/2.1.0"
                        },
                        redirect: false,
                        withHeaders: true
                    }));
                    if (ul.statusCode == "302") {
                        return playUrl(ul.headers.location[0]);
                    } else {
                        return playUrl(urll)
                    };
                } else {
                    return playUrl(urll + '#isVideo=true#')
                };
            }
            else if (/qkan8/.test(myurl)) {
                if (urll.indexOf('http') != -1) {
                    if (urll.indexOf('html') != -1) {
                        return x5rule(urll, srcurl);
                    } else {
                        return playUrl(urll + '#isVideo=true#')
                    };
                } else {
                    var html = fetch(pars + urll, {
                        headers: {
                            "User-Agent": MOBILE_UA,
                            "Referer": "https://qkan8.com/"
                        }
                    });
                    if (html.indexOf('purl') != -1) {
                        var kjjx = pdfh(html, 'body&&Html').match(/var purl = \'(.*?)\'/)[1];
                        return x5rule(kjjx, srcurl);
                    };
                    var vurl = html.indexOf('var vid') != -1 ? html.match(/var vid=\"(.*?)\"/)[1] : html.match(/var url = \'(.*?)\'/)[1];
                    return playUrl(vurl);
                }
            }
        }
        else if (/saohuo|shdy3|shdy2|dm84/.test(myurl)) {
            var phtml = request(srcurl);
            var src = pd(phtml, "body&&iframe&&src");
            if (/api\.hhplayer|hkjx\.hhplayer|hhjx\.hhplayer/.test(src)) {
                var psurl = 'https://hhjx.hhplayer.com/api.php';
            } else if (/play\.hhplayer/.test(src)) {
                var psurl = 'https://play.hhplayer.com/api.php'
            }
            var cc = 'function OKOK'+pdfh(request(src, {}), 'body&&script,0&&Html').split('var act')[0].split('function OKOK')[1];
            cc = cc.replace('atob', 'base64Decode').replace(/const/g, 'let');
            eval(cc);
            var cs = 'url=' + url + '&t=' + t + '&key=' + key + '&act=0&play=1';
            var fc = fetch(psurl, {
                headers: {
                    'User-Agent': MOBILE_UA,
                    'referer': src
                },
                body: cs,
                method: 'POST'
            });
            var playlink = JSON.parse(fc).url;
            if (/obj\/tos/.test(playlink)) {
                return playUrl(playlink + '#isVideo=true#');
            } else {
                return playUrl((playlink.indexOf('http') != -1 ? playlink : 'https://hhjx.hhplayer.com' + playlink) + '#isVideo=true#')
            }
        }
        else if (/viptv/.test(myurl)) {
            var phtml = fetch(srcurl, {
                headers: {
                    "User-Agent": MOBILE_UA
                }
            });
            if (phtml.indexOf('检测中') != -1) {
                phtml = fetch(srcurl + '?btwaf' + phtml.match(/btwaf(.*?)\"/)[1], {
                    headers: {
                        "User-Agent": MOBILE_UA
                    }
                });
            }
            var scrpt = pdfh(phtml, "#player||#video||.player||.stui-player__video&&script&&Html").replace(/base64decode/g, "base64Decode");
            if (scrpt) {
                eval(scrpt);
                var urll = typeof player_aaaa !== 'undefined' ? player_aaaa.url : (typeof now !== 'undefined' ? now : '');
                if (/\.m3u8|\.mp4|obj\/tos/.test(urll) && /http/.test(urll)) {
                    return playUrl(urll + '#isVideo=true#');
                }
            }
            return x5rule(srcurl, srcurl);
        }
        else if (/auete/.test(myurl)) {
            var phtml = fetch(srcurl, {
                headers: {
                    "User-Agent": MOBILE_UA,
                    "Sec-Fetch-Site": "none",
                    "Sec-Fetch-Mode": "navigate",
                    "Sec-Fetch-User": "?1",
                    "Sec-Fetch-Dest": "document"
                }
            });
            var scrpt = pdfh(phtml, "#player||#video||.player||.hy-player&&script&&Html").replace(/base64decode/g, "base64Decode");
            eval(scrpt);
            var urll = now;
            if (/\.m3u8|\.mp4|obj\/tos/.test(urll) && /http/.test(urll)) {
                return playUrl(urll + '#isVideo=true#');
            } else {
                return x5rule(srcurl, srcurl);
            }
        }
        else if (/omofuna/.test(myurl)) {
            var phtml = fetch(srcurl, {
                headers: {
                    "User-Agent": MOBILE_UA,
                    "Referer": myurl
                }
            });
            var m = phtml.match(/var player_aaaa=(\{[\s\S]*?\});/);
            if (m) {
                eval('var player_aaaa=' + m[1]);
                var urll = player_aaaa.url;
                if (player_aaaa.encrypt == '1' || player_aaaa.encrypt == 1) {
                    urll = unescape(urll);
                } else if (player_aaaa.encrypt == '2' || player_aaaa.encrypt == 2) {
                    urll = unescape(base64Decode(urll));
                }
                if (/\.m3u8|\.mp4|obj\/tos/.test(urll) && /http/.test(urll)) {
                    return playUrl(urll + '#isVideo=true#');
                }
            }
            return x5rule(srcurl, srcurl);
        }

        else {
            return playUrl(srcurl)
        }
    } catch (e) {
        log('报错打开原网页');
        return srcurl
    }
}

function hikerpre() {
    setItem('huadong', base64Decode('ZnVuY3Rpb24gc3RyaW5ndG9IZXgoYWNTVFIpIHsKICAgIHZhciB2YWwgPSAiIjsKICAgIGZvciAodmFyIGkgPSAwOyBpIDw9IGFjU1RSLmxlbmd0aCAtIDE7IGkrKykgewogICAgICAgIHZhciBzdHIgPSBhY1NUUi5jaGFyQXQoaSk7CiAgICAgICAgdmFyIGNvZGUgPSBzdHIuY2hhckNvZGVBdCgpOwogICAgICAgIHZhbCArPSBwYXJzZUludChjb2RlKSArIDEKICAgIH07CiAgICByZXR1cm4gdmFsCn07CgpmdW5jdGlvbiBtZDVlbmNvZGUod29yZCkgewogICAgcmV0dXJuIG1kNSh3b3JkKS50b1N0cmluZygpCn07CmxldCBqc3AgPSBwYXJzZURvbUZvckh0bWwoaHRtbCwgJ2JvZHkmJnNjcmlwdCYmc3JjJyk7CmxldCBqc2YgPSByZXF1ZXN0KCdyZWZyZScgKyBqc3AsIHsKICAgIGhlYWRlcnM6IHsKICAgICAgICAiVXNlci1BZ2VudCI6IE1PQklMRV9VQSwKICAgICAgICAiUmVmZXJlciI6ICJyZWZyZSIKICAgIH0KfSk7CmV2YWwoanNmLm1hdGNoKC9rZXk9IlteXCJdKyIsdmFsdWU9IlteXCJdKyIvKVswXSk7CmV2YWwoImxldCBodXJsPSdyZWZyZScrIiArIGpzZi5tYXRjaCgvZnVuY3Rpb25cKFwpXHtjXC5nZXRcKChbXixdKyksLylbMV0pOwp2YXIgY29rID0gSlNPTi5wYXJzZShmZXRjaENvb2tpZShodXJsLCB7CiAgICBoZWFkZXJzOiB7CiAgICAgICAgIlVzZXItQWdlbnQiOiBNT0JJTEVfVUEsCiAgICAgICAgIlJlZmVyZXIiOiAicmVmcmUiCiAgICB9Cn0pKVswXTs='));
}