/**
 * Minimal MD5 hex for Mailchimp subscriber_hash. No dependencies; works in Workers and Node.
 * Based on RFC 1321 / Paul Johnston-style implementation.
 */

function safeAdd(x, y) {
  const lsw = (x & 0xffff) + (y & 0xffff);
  const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xffff);
}

function bitRotateLeft(num, cnt) {
  return (num << cnt) | (num >>> (32 - cnt));
}

function md5cmn(q, a, b, x, s, t) {
  return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
}

function md5ff(a, b, c, d, x, s, t) {
  return md5cmn((b & c) | (~b & d), a, b, x, s, t);
}
function md5gg(a, b, c, d, x, s, t) {
  return md5cmn((b & d) | (c & ~d), a, b, x, s, t);
}
function md5hh(a, b, c, d, x, s, t) {
  return md5cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5ii(a, b, c, d, x, s, t) {
  return md5cmn(c ^ (b | ~d), a, b, x, s, t);
}

function binlMD5(x, len) {
  x[len >> 5] |= 0x80 << (len % 32);
  x[(((len + 64) >>> 9) << 4) + 14] = len;

  let a = 0x67452301, b = 0xefcdab89, c = 0x98badcfe, d = 0x10325476;

  for (let i = 0; i < x.length; i += 16) {
    const olda = a, oldb = b, oldc = c, oldd = d;

    a = md5ff(a, b, c, d, x[i], 7, 0xd76aa478);
    d = md5ff(d, a, b, c, x[i + 1], 12, 0xe8c7b756);
    c = md5ff(c, d, a, b, x[i + 2], 17, 0x242070db);
    b = md5ff(b, c, d, a, x[i + 3], 22, 0xc1bdceee);
    a = md5ff(a, b, c, d, x[i + 4], 7, 0xf57c0faf);
    d = md5ff(d, a, b, c, x[i + 5], 12, 0x4787c62a);
    c = md5ff(c, d, a, b, x[i + 6], 17, 0xa8304613);
    b = md5ff(b, c, d, a, x[i + 7], 22, 0xfd469501);
    a = md5ff(a, b, c, d, x[i + 8], 7, 0x698098d8);
    d = md5ff(d, a, b, c, x[i + 9], 12, 0x8b44f7af);
    c = md5ff(c, d, a, b, x[i + 10], 17, 0xffff5bb1);
    b = md5ff(b, c, d, a, x[i + 11], 22, 0x895cd7be);
    a = md5ff(a, b, c, d, x[i + 12], 7, 0x6b901122);
    d = md5ff(d, a, b, c, x[i + 13], 12, 0xfd987193);
    c = md5ff(c, d, a, b, x[i + 14], 17, 0xa679438e);
    b = md5ff(b, c, d, a, x[i + 15], 22, 0x49b40821);

    a = md5gg(a, b, c, d, x[i + 1], 5, 0xf61e2562);
    d = md5gg(d, a, b, c, x[i + 6], 9, 0xc040b340);
    c = md5gg(c, d, a, b, x[i + 11], 14, 0x265e5a51);
    b = md5gg(b, c, d, a, x[i], 20, 0xe9b6c7aa);
    a = md5gg(a, b, c, d, x[i + 5], 5, 0xd62f105d);
    d = md5gg(d, a, b, c, x[i + 10], 9, 0x02441453);
    c = md5gg(c, d, a, b, x[i + 15], 14, 0xd8a1e681);
    b = md5gg(b, c, d, a, x[i + 4], 20, 0xe7d3fbc8);
    a = md5gg(a, b, c, d, x[i + 9], 5, 0x21e1cde6);
    d = md5gg(d, a, b, c, x[i + 14], 9, 0xc33707d6);
    c = md5gg(c, d, a, b, x[i + 3], 14, 0xf4d50d87);
    b = md5gg(b, c, d, a, x[i + 8], 20, 0x455a14ed);
    a = md5gg(a, b, c, d, x[i + 13], 5, 0xa9e3e905);
    d = md5gg(d, a, b, c, x[i + 2], 9, 0xfcefa3f8);
    c = md5gg(c, d, a, b, x[i + 7], 14, 0x676f02d9);
    b = md5gg(b, c, d, a, x[i + 12], 20, 0x8d2a4c8a);

    a = md5hh(a, b, c, d, x[i + 5], 4, 0xfffa3942);
    d = md5hh(d, a, b, c, x[i + 8], 11, 0x8771f681);
    c = md5hh(c, d, a, b, x[i + 11], 16, 0x6d9d6122);
    b = md5hh(b, c, d, a, x[i + 14], 23, 0xfde5380c);
    a = md5hh(a, b, c, d, x[i + 1], 4, 0xa4beea44);
    d = md5hh(d, a, b, c, x[i + 4], 11, 0x4bdecfa9);
    c = md5hh(c, d, a, b, x[i + 7], 16, 0xf6bb4b60);
    b = md5hh(b, c, d, a, x[i + 10], 23, 0xbebfbc70);
    a = md5hh(a, b, c, d, x[i + 13], 4, 0x289b7ec6);
    d = md5hh(d, a, b, c, x[i], 11, 0xeaa127fa);
    c = md5hh(c, d, a, b, x[i + 3], 16, 0xd4ef3085);
    b = md5hh(b, c, d, a, x[i + 6], 23, 0x04881d05);
    a = md5hh(a, b, c, d, x[i + 9], 4, 0xd9d4d039);
    d = md5hh(d, a, b, c, x[i + 12], 11, 0xe6db99e5);
    c = md5hh(c, d, a, b, x[i + 15], 16, 0x1fa27cf8);
    b = md5hh(b, c, d, a, x[i + 2], 23, 0xc4ac5665);

    a = md5ii(a, b, c, d, x[i], 6, 0xf4292244);
    d = md5ii(d, a, b, c, x[i + 7], 10, 0x432aff97);
    c = md5ii(c, d, a, b, x[i + 14], 15, 0xab9423a7);
    b = md5ii(b, c, d, a, x[i + 5], 21, 0xfc93a039);
    a = md5ii(a, b, c, d, x[i + 12], 6, 0x655b59c3);
    d = md5ii(d, a, b, c, x[i + 3], 10, 0x8f0ccc92);
    c = md5ii(c, d, a, b, x[i + 10], 15, 0xffeff47d);
    b = md5ii(b, c, d, a, x[i + 1], 21, 0x85845dd1);
    a = md5ii(a, b, c, d, x[i + 8], 6, 0x6fa87e4f);
    d = md5ii(d, a, b, c, x[i + 15], 10, 0xfe2ce6e0);
    c = md5ii(c, d, a, b, x[i + 6], 15, 0xa3014314);
    b = md5ii(b, c, d, a, x[i + 13], 21, 0x4e0811a1);
    a = md5ii(a, b, c, d, x[i + 4], 6, 0xf7537e82);
    d = md5ii(d, a, b, c, x[i + 11], 10, 0xbd3af235);
    c = md5ii(c, d, a, b, x[i + 2], 15, 0x2ad7d2bb);
    b = md5ii(b, c, d, a, x[i + 9], 21, 0xeb86d391);

    a = safeAdd(a, olda);
    b = safeAdd(b, oldb);
    c = safeAdd(c, oldc);
    d = safeAdd(d, oldd);
  }
  return [a, b, c, d];
}

function binl2rstr(input) {
  let output = "";
  for (let i = 0; i < input.length * 32; i += 8) {
    output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xff);
  }
  return output;
}

function rstr2binl(input) {
  const output = [];
  output[(input.length >> 2) - 1] = undefined;
  for (let i = 0; i < output.length; i += 1) output[i] = 0;
  const length8 = input.length * 8;
  for (let i = 0; i < length8; i += 8) {
    output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << (i % 32);
  }
  return output;
}

function rstr2hex(input) {
  const hexTab = "0123456789abcdef";
  let output = "";
  for (let i = 0; i < input.length; i += 1) {
    const x = input.charCodeAt(i);
    output += hexTab.charAt((x >>> 4) & 0x0f) + hexTab.charAt(x & 0x0f);
  }
  return output;
}

/** Encode string as UTF-8 (raw bytes as string). Works in Workers and Node. */
function str2rstrUTF8(input) {
  if (typeof unescape === "function") {
    return unescape(encodeURIComponent(input));
  }
  const utf8 = [];
  for (let i = 0; i < input.length; i++) {
    const c = input.charCodeAt(i);
    if (c < 128) utf8.push(c);
    else if (c < 2048) {
      utf8.push(192 | (c >> 6), 128 | (c & 63));
    } else if (c < 65536) {
      utf8.push(224 | (c >> 12), 128 | ((c >> 6) & 63), 128 | (c & 63));
    } else {
      utf8.push(240 | (c >> 18), 128 | ((c >> 12) & 63), 128 | ((c >> 6) & 63), 128 | (c & 63));
    }
  }
  return String.fromCharCode.apply(null, utf8);
}

function rstrMD5(s) {
  return binl2rstr(binlMD5(rstr2binl(s), s.length * 8));
}

/**
 * @param {string} s - UTF-8 string (e.g. lowercased email)
 * @returns {string} - 32-char hex MD5 hash
 */
export function md5Hex(s) {
  const raw = str2rstrUTF8(s);
  return rstr2hex(rstrMD5(raw));
}
