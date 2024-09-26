// https://blog.csdn.net/qlql489/article/details/82780716
a = '\uD83D\uDE00'
a = '😀';
console.log(a.length)

console.log([a.charAt(0), a.charAt(1), a.charAt(2)])
console.log([a[0], a[1], a[2]])
console.log(encodeURI(a).split('%'))
te = new TextEncoder()
console.log(Array.from(te.encode(a)).map(a=>a.toString(16)))

console.log([a.charCodeAt(0), a.charCodeAt(1), a.charCodeAt(2)])
console.log([a.codePointAt(0), a.codePointAt(1), a.codePointAt(2)])

console.log('-----------------------------')

console.log([a.codePointAt(0).toString(16), a.codePointAt(1).toString(16)])
console.log([a.codePointAt(0).toString(16) > '10000', a.codePointAt(1) == parseInt(a.charCodeAt(1).toString(16), 16)])


// =====================================

a.charCodeAt(0).toString(2)
'1101100000111101'
a.charCodeAt(1).toString(2)
'1101111000000000'
a.codePointAt(1).toString(2)
'1101111000000000'
tmp = a.charCodeAt(0).toString(2).substring(6) + a.charCodeAt(1).toString(2).substring(6);
(parseInt(tmp, 2) + 0x10000).toString(2)
a.codePointAt(0).toString(2)
'11111011000000000'

// =====================================
// leading surrogate & trailing surrogate
HighSurrogate = parseInt('1101100000000000', 2)
LowSurrogate = parseInt('1101110000000000', 2)
console.log([HighSurrogate.toString(16), LowSurrogate.toString(16)]);
((a.charCodeAt(0) ^ HighSurrogate) << 10) + (a.charCodeAt(1) ^ LowSurrogate);
a.codePointAt(0) - 0x10000
62976
