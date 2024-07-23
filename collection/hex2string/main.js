const styleSheetContent = `
            .alterContent::before {
                content: "\u2023";
            }
`;

var style = document.createElement("style");
style.type = "text/css";
style.appendChild(document.createTextNode(styleSheetContent));
document.head.appendChild(style);

const stylesheet = document.styleSheets[1];
console.log(stylesheet.cssRules[0].selectorText);

// ==============
const ele = document.querySelector('h1')
document.onclick = ()=>{
    ele.classList.toggle("alterContent");
}

// ==============
// \xxx The character with the Latin-1 encoding 
// specified by up to three octal digits XXX between 0 and 377. 
// For example, \251 is the octal sequence for the copyright symbol. 
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types

[255..toString(8), 0377.toString(16)];
[0b11111111.toString(8), 0xff.toString(16)];
parseInt(400, 8) == 0o400n
'\377' == '\u00ff'
'\400' == String.fromCharCode(Number.parseInt(40, 8)) + '0'
String.fromCharCode(97).codePointAt(0)

function name(params) {
    escape("𠮷");
    '\uD842\uDFB7' == "𠮷";

    const a = "𠮷".codePointAt(0);
    a > 0xffff;
    55296..toString(2);
    56320..toString(16);
    const b = 55296 + (~~(a - 65536) >> 10 & 1023) & 65535;
    const c = 56320 + (a - 65536 & 1023) & 65535;
    "𠮷".charCodeAt(0) == b;
    "𠮷".charCodeAt(1) == c;
    String.fromCharCode(b) + String.fromCharCode(c) == "𠮷";

}
