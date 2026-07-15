var RULE_JS_NAME = "hikermovie.js";
var RULE_JSON_NAME = "hikermovie.json";
var RULE_DIR = "hiker://files/rules/xyq/";

// 多源拉取，避免 GitHub 直连失败导致无法更新
var RULE_BASES = [
  "https://cdn.jsdelivr.net/gh/wangjiewangjie/VastWorld@main/",
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
  timeout: 15000,
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

function uprulefile() {
  for (var i = 0; i < RULE_BASES.length; i++) {
    var base = RULE_BASES[i];
    var rulejs = fetchRule(base + RULE_JS_NAME, function (c) {
      return c.search(/lazyRule/) != -1;
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
        "https://cdn.jsdelivr.net/gh/wangjiewangjie/VastWorld@main/",
        "https://raw.githubusercontent.com/wangjiewangjie/VastWorld/main/",
        "https://ghfast.top/https://raw.githubusercontent.com/wangjiewangjie/VastWorld/main/",
      ];
      var dir = "hiker://files/rules/xyq/";
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
          return c.search(/lazyRule/) != -1;
        });
        var rulejson = pull(bases[i] + "hikermovie.json", function (c) {
          return c.search(/\"vodhref\"/) != -1;
        });
        if (rulejs && rulejson) {
          writeFile(dir + "hikermovie.js", rulejs);
          writeFile(dir + "hikermovie.json", rulejson);
          try {
            eval(rulejs);
            if (typeof hikerpre == "function") hikerpre();
          } catch (e) {}
          refreshPage(false);
          return "toast://更新成功";
        }
      }
      return "toast://更新失败，请检查网络或代理";
    }),
    col_type: "flex_button",
  };
}

function loadRules() {
  try {
    var lac = fetch(RULE_DIR + RULE_JS_NAME);
    if (lac && lac.substring(0, 5) != "error" && lac.search(/lazyRule/) != -1) {
      eval(lac);
      hikerpre();
      return true;
    }
  } catch (e) {}
  return false;
}

// 首页始终注入「更新规则」，不依赖 hikermovie.js 是否已包含该按钮
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
            var idx = 1;
            if (res.data.length > 0 && res.data[0].col_type == "input") {
              idx = 1;
            } else {
              idx = 0;
            }
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
          title: "本地规则未就绪，点此更新",
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
} else if (uprulefile() && loadRules()) {
  attachUpdateButton();
} else {
  installUpdateStub();
}
