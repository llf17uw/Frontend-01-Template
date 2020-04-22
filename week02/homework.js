// 1. 写一个正则表达式 匹配所有Number直接量
// 需要匹配：小数、二进制、八进制和十六进制
const NUMBER_LITERAL_REGEX = /(^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$)|(0[xX][0-9a-fA-F]+)|(0[bB][01]+)|(0[oO][0-7]+)/;
// 2. 写一个UTF-8 Encoding的函数
function utf8Encoding(input) {
    let utf8Array = [];
    let utf8Code = encodeURIComponent(input);
    for(let i = 0; i < utf8Code.length; i++) {
        let c = utf8Code.charAt(i);
        if(c === '%') {
            utf8Array.push(parseInt(utf8Code.substring(i + 1, i + 2), 16));
            i = i + 2;
        } else {
            utf8Array.push(c.charCodeAt(0));
        }
    }
    return utf8Array;
}
// 3. 写一个正则表达式，匹配所有的字符串直接量，单引号和双引号
const STRING_LITERAL_REGEX = /(\"(\\.|[^"\\])*\")|(\'(\\.|[^"\\])*\')/;
