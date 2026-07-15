var RULE_JS_BASE =
  "https://raw.githubusercontent.com/wangjiewangjie/VastWorld/main/hikermovie.js";

var RULE_JSON_BASE =
  "https://raw.githubusercontent.com/wangjiewangjie/VastWorld/main/hikermovie.json";

var RULE_DIR = "hiker://files/rules/xyq/";

var FETCH_OPT = {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  },
  timeout: 8000,
};

function ruleUrl(base) {
  return base + "?t=" + Date.now();
}

function fetchRule(url, check) {
  try {
    var content = fetch(url, FETCH_OPT);
    if (content && content.substring(0, 5) != "error" && check(content)) {
      return content;
    }
  } catch (e) {}
  return "";
}

function uprulefile() {
  var rulejs = fetchRule(ruleUrl(RULE_JS_BASE), function (content) {
    return content.search(/lazyRule/) != -1;
  });
  var rulejson = fetchRule(ruleUrl(RULE_JSON_BASE), function (content) {
    return content.search(/\"vodhref\"/) != -1;
  });
  if (rulejs) writeFile(RULE_DIR + "hikermovie.js", rulejs);
  if (rulejson) writeFile(RULE_DIR + "hikermovie.json", rulejson);
  return rulejs != "" && rulejson != "";
}

function loadRules() {
  try {
    var lac = fetch(RULE_DIR + "hikermovie.js");
    if (lac && lac.substring(0, 5) != "error" && lac.search(/lazyRule/) != -1) {
      eval(lac);
      hikerpre();
      return true;
    }
  } catch (e) {}
  return false;
}

// 本地加载失败时给首页一个更新入口，避免 setError / confirm 反复打断
function installUpdateStub() {
  hikhmrule = function () {
    setHomeResult({
      data: [
        {
          title: "本地规则未就绪，点此更新",
          url: $("#noLoading#").lazyRule(() => {
            var jsBase =
              "https://raw.githubusercontent.com/wangjiewangjie/VastWorld/main/hikermovie.js";
            var jsonBase =
              "https://raw.githubusercontent.com/wangjiewangjie/VastWorld/main/hikermovie.json";
            var dir = "hiker://files/rules/xyq/";
            var opt = {
              headers: {
                "User-Agent": MOBILE_UA,
                "Cache-Control": "no-cache",
                Pragma: "no-cache",
              },
              timeout: 15000,
            };
            function pull(url, check) {
              try {
                var content = fetch(url + "?t=" + Date.now(), opt);
                if (
                  content &&
                  content.substring(0, 5) != "error" &&
                  check(content)
                ) {
                  return content;
                }
              } catch (e) {}
              return "";
            }
            var rulejs = pull(jsBase, function (c) {
              return c.search(/lazyRule/) != -1;
            });
            var rulejson = pull(jsonBase, function (c) {
              return c.search(/\"vodhref\"/) != -1;
            });
            if (rulejs) writeFile(dir + "hikermovie.js", rulejs);
            if (rulejson) writeFile(dir + "hikermovie.json", rulejson);
            if (rulejs && rulejson) {
              return "toast://更新成功，请返回重新进入规则";
            }
            return "toast://更新失败，请检查网络或代理后再试";
          }),
          col_type: "text_center_1",
        },
      ],
    });
  };
  hikerpre = function () {};
}

if (!loadRules()) {
  // 首次静默拉取，失败不弹窗
  if (!(uprulefile() && loadRules())) {
    installUpdateStub();
  }
}
