const CryptoJS = require("crypto-js");
const RSA = require('./rsa.js');

function cq8i(gK0x) {
  return xa5f(gK0x, "&", !0)
}

function xa5f(gK0x, VR4V, cKR4V) {
  if (!gK0x) return "";
  var bv8n = [];
  for (var x in gK0x) {
    bv8n.push(encodeURIComponent(x) + "=" + (!!cKR4V ? encodeURIComponent(gK0x[x]) : gK0x[x]))
  }
  return bv8n.join(VR4V || ",")
}

function a(a) {
  var d, e, b = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", c = "";
  for (d = 0; a > d; d += 1)
    e = Math.random() * b.length,
      e = Math.floor(e),
      c += b.charAt(e);
  return c
}

function b(a, b) {
  var c = CryptoJS.enc.Utf8.parse(b)
    , d = CryptoJS.enc.Utf8.parse("0102030405060708")
    , e = CryptoJS.enc.Utf8.parse(a)
    , f = CryptoJS.AES.encrypt(e, c, {
    iv: d,
    mode: CryptoJS.mode.CBC
  });
  return f.toString()
}

function c(a, b, c) {
  var d, e;
  return 1,
    d = new RSA.getKeyPair(b, "", c),
    e = RSA.encryptedString(d, a)
}

function d(d, e, f, g) {
  var h = {}
    , i = a(16);
  return h.encText = b(d, g),
    h.encText = b(h.encText, i),
    h.encSecKey = c(i, e, f),
    h
}

const Xp4t = {
  "emj": {
    "色": "00e0b",
    "流感": "509f6",
    "这边": "259df",
    "弱": "8642d",
    "嘴唇": "bc356",
    "亲": "62901",
    "开心": "477df",
    "呲牙": "22677",
    "憨笑": "ec152",
    "猫": "b5ff6",
    "皱眉": "8ace6",
    "幽灵": "15bb7",
    "蛋糕": "b7251",
    "发怒": "52b3a",
    "大哭": "b17a8",
    "兔子": "76aea",
    "星星": "8a5aa",
    "钟情": "76d2e",
    "牵手": "41762",
    "公鸡": "9ec4e",
    "爱意": "e341f",
    "禁止": "56135",
    "狗": "fccf6",
    "亲亲": "95280",
    "叉": "104e0",
    "礼物": "312ec",
    "晕": "bda92",
    "呆": "557c9",
    "生病": "38701",
    "钻石": "14af6",
    "拜": "c9d05",
    "怒": "c4f7f",
    "示爱": "0c368",
    "汗": "5b7a4",
    "小鸡": "6bee2",
    "痛苦": "55932",
    "撇嘴": "575cc",
    "惶恐": "e10b4",
    "口罩": "24d81",
    "吐舌": "3cfe4",
    "心碎": "875d3",
    "生气": "e8204",
    "可爱": "7b97d",
    "鬼脸": "def52",
    "跳舞": "741d5",
    "男孩": "46b8e",
    "奸笑": "289dc",
    "猪": "6935b",
    "圈": "3ece0",
    "便便": "462db",
    "外星": "0a22b",
    "圣诞": "8e7",
    "流泪": "01000",
    "强": "1",
    "爱心": "0CoJU",
    "女孩": "m6Qyw",
    "惊恐": "8W8ju",
    "大笑": "d"
  },
  "md": [
    "色",
    "流感",
    "这边",
    "弱",
    "嘴唇",
    "亲",
    "开心",
    "呲牙",
    "憨笑",
    "猫",
    "皱眉",
    "幽灵",
    "蛋糕",
    "发怒",
    "大哭",
    "兔子",
    "星星",
    "钟情",
    "牵手",
    "公鸡",
    "爱意",
    "禁止",
    "狗",
    "亲亲",
    "叉",
    "礼物",
    "晕",
    "呆",
    "生病",
    "钻石",
    "拜",
    "怒",
    "示爱",
    "汗",
    "小鸡",
    "痛苦",
    "撇嘴",
    "惶恐",
    "口罩",
    "吐舌",
    "心碎",
    "生气",
    "可爱",
    "鬼脸",
    "跳舞",
    "男孩",
    "奸笑",
    "猪",
    "圈",
    "便便",
    "外星",
    "圣诞"
  ]
};

var j7c = {};
j7c.bg8Y = function (k7d, cG8y, O8G) {
  if (!!k7d.forEach) {
    k7d.forEach(cG8y, O8G);
    return this
  }
  for (var i = 0, l = k7d.length; i < l; i++)
    cG8y.call(O8G, k7d[i], i, k7d);
  return this
}

var bsR1x = function (cxG2x) {
  var m7f = [];
  j7c.bg8Y(cxG2x, function (cxF2x) {
    m7f.push(Xp4t.emj[cxF2x])
  });
  return m7f.join("")
};

// {
//   "s": "keywords",
//   "limit": "8",
//   "csrf_token": ""
// }
export function encrypt(obj) {
  return d(JSON.stringify(obj), bsR1x([ "流泪", "强"]), bsR1x(Xp4t.md), bsR1x(["爱心", "女孩", "惊恐", "大笑"]));
}

module.exports = {
  encrypt,
};
