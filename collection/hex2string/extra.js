function xxx() {
    a = "\u1234\u2345";
    b = escape(a);
    c = unescape(b);
    console.log(a, b, c);

    const hexString = '48656c6c6f20576f726c64';
    const hexString_byte = Uint8Array.from({
        length: hexString.length / 2
    }, (v,k)=>parseInt(hexString.slice(2 * k, 2 * k + 2), 16));

    Array.from({length:256},(n,ind)=>String.fromCharCode(ind)).join('')
}

// =============

function hexToString(hex) {
    // 确保输入是字符串
    if (typeof hex !== 'string') {
        hex = hex.toString();
    }

    // 确保十六进制字符串是有效的（只包含0-9, a-f, A-F）
    if (!/^[0-9A-Fa-f]+$/.test(hex)) {
        throw new Error('Invalid hexadecimal string');
    }

    // 如果十六进制字符串长度是奇数，添加一个前导零
    if (hex.length % 2 !== 0) {
        hex = '0' + hex;
    }

    //============
    let result;
    hexArray = hex.match(/../g);
    result = decodeURI('%' + hexArray.join('%'));

    numArray = Array.from(hexArray, str=>Number.parseInt(str, 16));
    result = numArray.map(int=>String.fromCharCode(int)).join('')
    result = String.fromCharCode(...numArray);
    // hexArray.map((str)=>String.fromCharCode( Number.parseInt(str,16) )).join('')

    const uint8Array = Uint8Array.from(hexArray, byte=>parseInt(byte, 16));
    if (typeof TextDecoder !== 'undefined') {
        const decoder = new TextDecoder('utf-8');
        result = decoder.decode(uint8Array);
    } else {
        result = String.fromCharCode(...uint8Array);
    }

    return result;

}

const hexString = '48656c6c6f20576f726c64';
// Hello World in hexadecimal
const string = hexToString(hexString);
console.log(string);
// output: Hello World
