// 代码题： convertStringToNumber / convertNumberToString

function convertStringToNumber(string, x) {
    let chars = string.split('');
    let number = 0;
    let i;
    for(i = 0; i < chars.length && chars[i] !== '.'; i++) {
        number *= x;
        if(chars[i].match(/[af]/) && x === 16) {
            // 16进制
            number += chars[i].codePointAt(0) - 'a'.codePointAt(0) + 10;
        } else {
            number += chars[i].codePointAt(0) - '0'.codePointAt(0);
        }
    }
    // 小数
    if(chars[i] === '.') i++;
    let fraction = 1;
    for(; i < chars.length; i++) {
        fraction /= x;
        if(chars[i].match(/[af]/) && x === 16) {
            // 16进制
            number += (chars[i].codePointAt(0) - 'a'.codePointAt(0) + 10) * fraction;
        } else {
            number += (chars[i].codePointAt(0) - '0'.codePointAt(0)) * fraction;
        }
    }
    return number;
}

console.log(convertStringToNumber("234", 10));
console.log(convertStringToNumber("234.456", 10));
console.log(convertStringToNumber("0010", 2));
console.log(convertStringToNumber("1.01", 2));
console.log(convertStringToNumber("a", 16));

function convertNumberToString(number, x) {
    let i = Math.floor(number);
    let fraction = number - i, fractionStr = '';
    if(fraction !== 0) {
        fractionStr = String(number).match(/\.\d+$/)[0].replace('', '');
    }
    let string = '';
    while(i > 0) {
        string = String(i % x) + string;
        i = Math.floor(i / x);
    }
    let result = fraction !== 0 ? string + fractionStr : string;
    return result === '' ? '0' : result;
}

console.log(convertNumberToString(10, 10));
console.log(convertNumberToString(0, 10));
console.log(convertNumberToString(12, 2));
console.log(convertNumberToString(12, 10));
console.log(convertNumberToString(12.1, 10));
console.log(convertNumberToString(0xa, 16));