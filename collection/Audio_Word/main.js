// https://www.bilibili.com/video/BV1Et421J7hs

const colorHue = Math.floor(Math.random() * 360);
colorWord = `hsl(${(colorHue + 120) % 360} 80% 50%)`
colorWord_h = `hsl(${(colorHue + 240) % 360} 80% 50%)`

// =================
canvas = document.querySelector('canvas');
ctx = canvas.getContext('2d');
const WIDTH = canvas.width = canvas.offsetWidth;
const HEIGHT = canvas.height = canvas.offsetHeight;

// ctx.shadowColor = "red";
ctx.shadowBlur = 15;

// Rectangle
ctx.fillStyle = "hsl(" + colorHue + " 50% 50%)";
ctx.fillRect(0, 0, WIDTH, HEIGHT);

for (let index = 2; index < 11; index++) {
    const r = Math.random() * (WIDTH + HEIGHT) / index;
    const x = Math.random() * (WIDTH + r) - r / 2;
    const y = Math.random() * (HEIGHT + r) - r / 2;
    const h = colorHue + 2 * index - 11;
    const s = 50 + 2 * index;
    const l = 50 - index;

    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    const color = `hsl(${h} ${s}% ${l}% / 100%)`;
    ctx.fillStyle = color;
    ctx.fill();
}

// ======================
const styleSheetContent = `
    .highlight_js{
       color: ${colorWord_h};
       list-style-type: disc;
    }
`;

var style = document.createElement("style");
style.type = "text/css";
style.appendChild(document.createTextNode(styleSheetContent));
document.head.appendChild(style);

const stylesheet = document.styleSheets[1];
console.log(stylesheet.cssRules[0].selectorText);

// ======================

words = ['mash', 'mass', 'math', 'mesh', 'mess', 'muss'];
;phonetic = ['%5Bm&#230;%CA%83%5D', '%5Bm&#230;s%5D', '%5Bm&#230;%CE%B8%5D', '%5Bme%CA%83%5D', '%5Bmes%5D', '%5Bm%CA%8Cs%5D'];
phone = phonetic.map(it=>decodeURI(it).replaceAll(/&#(\d+);/g, (a,b)=>String.fromCharCode(b)));
translation = ['%E7%B3%8A%E9%A3%9F', '%E8%B4%A8%E9%87%8F', '%E6%95%B0%E5%AD%A6', '%E7%BD%91%E7%8A%B6', '%E6%9D%82%E4%B9%B1', '%E5%BC%84%E4%B9%B1'];
trans = translation.map(decodeURI);
postUrls = ['28A30BB1CBA7DA45269DCF45018B2377', 'E02A898C587D71146EED9C0003BFCB41', '0D199A15A9783D2B0F6D2BD72DB3B30F', '611D65AD786510C105F6C213CA5CF4B6', '9FC47001EAB4D5EA76AFDF08AB128D9E', '6FC9B74D4F07E04E090E110BFF83CA19'];
preUrl = "https://cn.bing.com/th?id=ODT.";
wordSound = postUrls.map(a=>new Audio(preUrl + a));

ul = document.querySelector('ul');
ul.style.color = colorWord;
currentIndex = 0;
lastIndex = null;

list = words.map((item,ind)=>{
    //decodeURI(phonetic[0])
    const txt = document.createTextNode(item + ' ' + phone[ind] + " - " + trans[ind]);
    const ele = document.createElement('li');
    ele.appendChild(txt);
    ul.appendChild(ele);
    return ele;
}
);

// ======================

window.addEventListener("click", startSpeak);

function startSpeak() {
    if (lastIndex !== null) {
        list[lastIndex].classList.remove("highlight_js");
        if (currentIndex == 0) {
            lastIndex = null;
            return;
        }
    }

    list[currentIndex].classList.add("highlight_js");
    lastIndex = currentIndex;
    speakWord(currentIndex);
    currentIndex = ++currentIndex % list.length

    // sibling.play();

}

function speakWord(currentIndex) {
    wordSound[currentIndex].play().then((val)=>{
        // console.log(val, Date.now(), sibling.readyState);
        setTimeout(startSpeak, 1500)
    }
    )
}

// ==============================

audioURL = ['https://cn.bing.com/th?id=ODT.E02A898C587D71146EED9C0003BFCB41'];
const sibling = new Audio("https://cn.bing.com/th?id=ODT.8B09F9C715719952B6DEE572E54EB78C");

sibling.addEventListener("ended", (event)=>{
    //canplaythrough
    // console.log(Date.now());
    /* the audio is now playable; play it if permissions allow */
    setTimeout(startSpeak, 1500);
}
);
