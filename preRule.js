var RULE_JS_NAME = "hikermovie.js";
var RULE_JSON_NAME = "hikermovie.json";
var RULE_DIR = "hiker://files/rules/hksj/";
var RULE_VER = "v22-anime44";
var RULE_JS_MAX = 70000;

// ½ûÓÃ jsDelivr @main£¬±ÜÃâ CDN »º´æ¾É¹æÔò
var RULE_BASES = [
  "https://gitee.com/jiewangjiewang/the-vast-world-of-the-sea/raw/main/",
  "https://gitee.com/jiewangjiewang/the-vast-world-of-the-sea/raw/master/",
  "https://raw.githubusercontent.com/wangjiewangjie/VastWorld/main/",
  "https://ghfast.top/https://raw.githubusercontent.com/wangjiewangjie/VastWorld/main/",
];

var FETCH_OPT = {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  },
  timeout: 20000,
};

function fetchRule(url, check) {
  try {
    var content = fetch(url + (url.indexOf("?") >= 0 ? "&" : "?") + "t=" + Date.now(), FETCH_OPT);
    if (content && content.substring(0, 5) != "error" && check(content)) return content;
  } catch (e) {}
  return "";
}

function stripBom(js) {
  return js ? (js + "").replace(/^\uFEFF+/, "").replace(/\uFEFF/g, "") : js;
}

function parseRuleVer(js) {
  var m = (js || "").match(/RULE_VER\s*=\s*['"](v22-anime\d+)['"]/);
  return m ? m[1] : "";
}

function animeNum(ver) {
  var m = (ver || "").match(/anime(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

function isCurrentVer(js) {
  var v = parseRuleVer(js);
  return (
    !!v &&
    animeNum(v) >= animeNum(RULE_VER) &&
    js.indexOf("lazyRule") != -1 &&
    js.length < RULE_JS_MAX &&
    !(new RegExp("wwgz"+".cn")).test(js)
  );
}

function uprulefile(force) {
  var localJs = "";
  try {
    localJs = fetch(RULE_DIR + RULE_JS_NAME) || "";
  } catch (e) {}
  if (!force && isCurrentVer(localJs)) return false;
  var minNeed = Math.max(animeNum(RULE_VER), animeNum(parseRuleVer(localJs)), 28);
  var bestJs = "";
  var bestJson = "";
  var bestNum = 0;
  for (var i = 0; i < RULE_BASES.length; i++) {
    var rulejs = fetchRule(RULE_BASES[i] + RULE_JS_NAME, function (c) {
      var n = animeNum(parseRuleVer(c));
      return n >= minNeed && c.indexOf("lazyRule") != -1 && c.length < RULE_JS_MAX && !(new RegExp("wwgz"+".cn")).test(c);
    });
    var rulejson = fetchRule(RULE_BASES[i] + RULE_JSON_NAME, function (c) {
      return c.search(/\"vodhref\"/) != -1 && c.indexOf("omofun") != -1;
    });
    if (rulejs && rulejson) {
      var n = animeNum(parseRuleVer(rulejs));
      if (n > bestNum) {
        bestNum = n;
        bestJs = rulejs;
        bestJson = rulejson;
      }
    }
  }
  if (bestJs && bestJson) {
    writeFile(RULE_DIR + RULE_JS_NAME, stripBom(bestJs));
    writeFile(RULE_DIR + RULE_JSON_NAME, bestJson);
    return true;
  }
  return false;
}

function buildUpdateItem() {
  return {
    title: "¸üÐÂ¹æÔò",
    url: $("#noLoading#").lazyRule(() => {
      var bases = RULE_BASES.slice(0);
      var dir = RULE_DIR;
      var ver = RULE_VER;
      var opt = {
        headers: { "User-Agent": MOBILE_UA, "Cache-Control": "no-cache", Pragma: "no-cache" },
        timeout: 8000,
      };
      var logs = [];
      var localNum = 0;
      try {
        localNum = animeNum(parseRuleVer(fetch(dir + "hikermovie.js") || ""));
      } catch (e0) {}
      var minNeed = Math.max(animeNum(ver), localNum, 28);
      var best = null;
      for (var i = 0; i < bases.length; i++) {
        try {
          var rulejs = fetch(bases[i] + "hikermovie.js?t=" + Date.now(), opt) || "";
          var rulejson = fetch(bases[i] + "hikermovie.json?t=" + Date.now(), opt) || "";
          var remoteVer = parseRuleVer(rulejs);
          var rn = animeNum(remoteVer);
          var jsOk =
            !!remoteVer &&
            rn >= minNeed &&
            rulejs.indexOf("pageNum") >= 0 &&
            rulejs.length < RULE_JS_MAX &&
            !(new RegExp("wwgz"+".cn")).test(rulejs);
          var jnOk = rulejson.indexOf("vodhref") >= 0;
          logs.push(i + 1 + ":" + (rulejs ? rulejs.length : 0) + "/" + (remoteVer || "-") + (jsOk ? "+js" : "") + (jnOk ? "+json" : ""));
          if (!jsOk || !jnOk) continue;
          if (!best || rn > best.num) best = { js: rulejs, jn: rulejson, ver: remoteVer, num: rn };
        } catch (e) {
          logs.push(i + 1 + ":err");
        }
      }
      if (!best) return "toast://¸üÐÂÊ§°Ü want¡Ý" + minNeed + " ¡¤ " + logs.join(" | ");
      writeFile(dir + "hikermovie.js", stripBom(best.js));
      writeFile(dir + "hikermovie.json", best.jn);
      var check = parseRuleVer(fetch(dir + "hikermovie.js") || "");
      if (animeNum(check) < best.num) return "toast://Ð´ÈëÐ£ÑéÊ§°Ü";
      refreshPage(false);
      return "toast://ÒÑ¸üÐÂ " + best.ver + " (" + best.js.length + "B)";
    }),
    col_type: "flex_button",
  };
}

function loadRules() {
  try {
    var lac = stripBom(fetch(RULE_DIR + RULE_JS_NAME) || "");
    if (!isCurrentVer(lac)) {
      uprulefile(true);
      lac = stripBom(fetch(RULE_DIR + RULE_JS_NAME) || "");
    }
    if (lac && lac.substring(0, 5) != "error" && lac.search(/lazyRule/) != -1) {
      eval(lac);
      try {
        hikerpre();
      } catch (e) {}
      return true;
    }
  } catch (e) {}
  return false;
}

function attachUpdateButton() {
  if (typeof hikhmrule != "function") return;
  var origin = hikhmrule;
  hikhmrule = function () {
    var _set = setHomeResult;
    setHomeResult = function (res) {
      try {
        if (res && res.data) {
          var has = false;
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].title == "¸üÐÂ¹æÔò") {
              has = true;
              break;
            }
          }
          if (!has) {
            var idx = res.data.length > 0 && res.data[0].col_type == "input" ? 1 : 0;
            res.data.splice(idx, 0, buildUpdateItem());
          }
        }
      } catch (e) {}
      setHomeResult = _set;
      _set(res);
    };
    origin();
  };
}

function installUpdateStub() {
  hikhmrule = function () {
    setHomeResult({
      data: [
        {
          title: "±¾µØ¹æÔòÎ´¾ÍÐ÷£¬µã´Ë¸üÐÂµ½ " + RULE_VER,
          url: buildUpdateItem().url,
          col_type: "text_center_1",
        },
      ],
    });
  };
  hikerpre = function () {};
}

if (loadRules()) {
  attachUpdateButton();
} else if (uprulefile(true) && loadRules()) {
  attachUpdateButton();
} else {
  installUpdateStub();
}
