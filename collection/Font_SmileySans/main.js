strArr = ["B站「得意黑」字体", //
"https://www.bilibili.com/video/BV1sP411g7PZ", //
"在线引用得意黑字体:", //
"https://github.com/Asay-dev/SmileySans-woff-online", //
"Google Fonts | 谷歌字体中文版 | GoogleFonts:", //
"https://www.googlefonts.cn/english", //
"TTF、TOF、WOFF 和 WOFF2 的相关概念:", //
"https://www.cnblogs.com/bianchengsanmei/p/15857883.html"]

strArr2 = ['(() => {', //
'    "use strict";', //
'', //
'    // --------------- APPROXIMATION OF E ----------------', //
'', //
'    const eApprox = n =>', //
'        // Approximation of E obtained after Nth iteration.', //
'        enumFromTo(1)(n).reduce(', //
'            ([fl, e], x) => (', //
'                flx => [flx, e + (1 / flx)]', //
'            )(', //
'                fl * x', //
'            ),', //
'            [1, 1]', //
'        )[1];', //
'', //
'    // ---------------------- TEST -----------------------', //
'    // main :: IO ()', //
'    const main = () =>', //
'        eApprox(20);', //
'', //
'    // --------------------- GENERIC ---------------------', //
'', //
'    // enumFromTo :: Int -> Int -> [Int]', //
'    const enumFromTo = m =>', //
'        n => Array.from({', //
'            length: 1 + n - m', //
'        }, (_, i) => m + i);', //
'', //
'    // MAIN ---', //
'    return main();', //
'})();']

let str = strArr.join('\n') + '<hr />' + strArr2.join('\n');
str = str + "<hr /><pre><code>" + strArr2.join('\n') + "</code></pre>";

document.querySelector('#font_1').innerHTML = str;
document.querySelector('#font_2').innerHTML = str;

const strArray1 = ['的一是了我不人在他有这个上们来到时大地为子中你说生', //
'国年着就那和要她出也得里后自以会家可下而过天去能对', //
'小多然于心学么之都好看起发当没成只如事把还用第样道', //
'想作种开'];
const strArray2 = ['的一是在不了有和人这中大为上个国我以要他时来用们生', //
'到作地于出就分对成会可主发年动同工也能下过子说产种', //
'面而方后多点行学法所民得经十三之进着等部度家电力里', //
'如水化高自二理起小物现实加量都两体制机当西从广业本'];

const strArray = ['的一国在人了有中是年和大业不为发会工经上地市要个产', //
'这出行作生家以成到日民来我部对进多全建他公开们场展', //
'时理新方主企资实学报制政济用同于法高长现本月定化加', //
'动合品重关机分力自外者区能设后就等体下万元社过前面'];
let innerHTML = ''
for (const c of strArray.join(''))
    innerHTML += `<div class='item'><div>${c}</div><div>${c}</div></div>`
document.querySelector('.container').innerHTML = innerHTML
