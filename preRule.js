var RULE_JS_NAME = "hikermovie.js";
var RULE_JSON_NAME = "hikermovie.json";
var RULE_DIR = "hiker://files/rules/xyq/";
var RULE_VER = "v17-idx";

// raw 优先，避免 jsDelivr 缓存旧文件
var RULE_BASES = [
  "https://raw.githubusercontent.com/wangjiewangjie/VastWorld/main/",
  "https://ghfast.top/https://raw.githubusercontent.com/wangjiewangjie/VastWorld/main/",
  "https://cdn.jsdelivr.net/gh/wangjiewangjie/VastWorld@main/",
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
    if (content && content.substring(0, 5) != "error" && check(content)) {
      return content;
    }
  } catch (e) {}
  return "";
}

function isCurrentVer(js) {
  return js && js.indexOf(RULE_VER) != -1 && js.indexOf("lazyRule") != -1;
}

// 强制从远程拉取并覆盖本地（用于本地版本过旧）
function uprulefile(force) {
  var localJs = "";
  try {
    localJs = fetch(RULE_DIR + RULE_JS_NAME) || "";
  } catch (e) {}
  if (!force && isCurrentVer(localJs)) {
    return false;
  }
  for (var i = 0; i < RULE_BASES.length; i++) {
    var base = RULE_BASES[i];
    var rulejs = fetchRule(base + RULE_JS_NAME, function (c) {
      return c.search(/lazyRule/) != -1 && c.indexOf(RULE_VER) != -1;
    });
    var rulejson = fetchRule(base + RULE_JSON_NAME, function (c) {
      return c.search(/\"vodhref\"/) != -1;
    });
    if (rulejs && rulejson) {
      writeFile(RULE_DIR + RULE_JS_NAME, rulejs);
      writeFile(RULE_DIR + RULE_JSON_NAME, rulejson);
      return true;
    }
  }
  return false;
}

function buildUpdateItem() {
  return {
    title: "更新规则",
    url: $("#noLoading#").lazyRule(() => {
      var bases = [
        "https://raw.githubusercontent.com/wangjiewangjie/VastWorld/main/",
        "https://ghfast.top/https://raw.githubusercontent.com/wangjiewangjie/VastWorld/main/",
        "https://cdn.jsdelivr.net/gh/wangjiewangjie/VastWorld@main/",
      ];
      var dir = "hiker://files/rules/xyq/";
      var ver = "v17-idx";
      var opt = {
        headers: {
          "User-Agent": MOBILE_UA,
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
        timeout: 20000,
      };
      function pull(url, check) {
        try {
          var content = fetch(url + "?t=" + Date.now(), opt);
          if (content && content.substring(0, 5) != "error" && check(content)) {
            return content;
          }
        } catch (e) {}
        return "";
      }
      for (var i = 0; i < bases.length; i++) {
        var rulejs = pull(bases[i] + "hikermovie.js", function (c) {
          return c.search(/lazyRule/) != -1 && c.indexOf(ver) != -1;
        });
        var rulejson = pull(bases[i] + "hikermovie.json", function (c) {
          return c.search(/\"vodhref\"/) != -1;
        });
        if (rulejs && rulejson) {
          writeFile(dir + "hikermovie.js", rulejs);
          writeFile(dir + "hikermovie.json", rulejson);
          var check = "";
          try {
            check = fetch(dir + "hikermovie.js") || "";
          } catch (e) {}
          if (check.indexOf(ver) < 0) {
            return "toast://写入校验失败，请手动覆盖 hikermovie.js";
          }
          try {
            eval(rulejs);
            if (typeof hikerpre == "function") hikerpre();
          } catch (e) {}
          refreshPage(false);
          return "toast://已更新 " + ver + "，请下拉刷新首页，勿从历史记录进站";
        }
      }
      return "toast://更新失败，请检查网络（需能访问 GitHub raw）";
    }),
    col_type: "flex_button",
  };
}

function loadRules() {
  try {
    var lac = fetch(RULE_DIR + RULE_JS_NAME) || "";
    // 本地不是 v17 则强制远程覆盖
    if (!isCurrentVer(lac)) {
      uprulefile(true);
      lac = fetch(RULE_DIR + RULE_JS_NAME) || "";
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
            if (res.data[i].title == "更新规则") {
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
          title: "本地规则未就绪，点此更新到 " + RULE_VER,
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
