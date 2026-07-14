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

function uprulefile(showTip) {
  var rulejs = fetchRule(ruleUrl(RULE_JS_BASE), function (content) {
    return content.search(/lazyRule/) != -1;
  });

  var rulejson = fetchRule(ruleUrl(RULE_JSON_BASE), function (content) {
    return content.search(/\"vodhref\"/) != -1;
  });

  var jsOk = rulejs != "";

  var jsonOk = rulejson != "";

  if (jsOk) {
    writeFile(RULE_DIR + "hikermovie.js", rulejs);
  }

  if (jsonOk) {
    writeFile(RULE_DIR + "hikermovie.json", rulejson);
  }

  if (jsOk && jsonOk) {
    return true;
  }

  if (showTip) {
    confirm({ title: "更新失败", content: "GitHub 规则拉取失败，请检查网络" });
  }

  return false;
}

function loadRules() {
  var lac = fetch(RULE_DIR + "hikermovie.js");

  if (lac.search(/lazyRule/) != -1) {
    eval(lac);

    hikerpre();

    return true;
  }

  return false;
}

uprulefile(false);

if (!loadRules()) {
  uprulefile(true);

  if (!loadRules()) {
    setError("本地规则加载失败，请检查网络后重试");
  }
}
