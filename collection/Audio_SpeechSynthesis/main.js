const colorHue = Math.floor(Math.random() * 360);
colorWord = `hsl(${(colorHue + 120) % 360} 80% 50%)`
colorWord_h = `hsl(${(colorHue + 240) % 360} 70% 70%)`

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

// const stylesheet = document.styleSheets[1];
// console.log(stylesheet.cssRules[0].selectorText);

// ======================

words = ['mash', 'mass', 'math', 'mesh', 'mess', 'muss'];
phonetic = ['%5Bm&#230;%CA%83%5D', '%5Bm&#230;s%5D', '%5Bm&#230;%CE%B8%5D', '%5Bme%CA%83%5D', '%5Bmes%5D', '%5Bm%CA%8Cs%5D'];
phone = phonetic.map(it=>decodeURI(it).replaceAll(/&#(\d+);/g, (a,b)=>String.fromCharCode(b)));
translation = ['%E7%B3%8A%E9%A3%9F', '%E8%B4%A8%E9%87%8F', '%E6%95%B0%E5%AD%A6', '%E7%BD%91%E7%8A%B6', '%E6%9D%82%E4%B9%B1', '%E5%BC%84%E4%B9%B1'];
trans = translation.map(decodeURI);

ul = document.querySelector('ul');
ul.style.color = colorWord;

list = words.map((item,ind)=>{
    const ele = document.createElement('li');
    ele.textContent = item + ' ' + phone[ind] + " - " + trans[ind];
    ul.appendChild(ele);
    return ele;
}
);

// ======================
function initUtter(word, ind, delay=1500) {
    const utterThis = new SpeechSynthesisUtterance(word);

    utterThis.onend = function(event) {
        console.log("SpeechSynthesisUtterance.onend");
        setTimeout(startSpeak, delay, null, ind)
    }
    utterThis.onerror = function(event) {
        console.error("SpeechSynthesisUtterance.onerror");
    }

    utterThis.voice = voices[1];
    console.log(utterThis.voice.name)
    utterThis.pitch = 1;
    utterThis.rate = 0.1;
    utterThis.volume = 2;

    return utterThis;
}

// ================================
var utters = [];
var voices = [];
var timeoutID;

// https://blog.monotonous.org/2021/11/15/speechSynthesis-getVoices/

// The voiceschanged event of the Web Speech API is fired 
// when the returned(list of SpeechSynthesisVoice objects) by the SpeechSynthesis.getVoices() has changed 
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = (e)=>{
        voices = window.speechSynthesis.getVoices();
        console.log(voices.length)

        clearTimeout(timeoutID);
        timeoutID = setTimeout(init, 1000);

    }
}

function init() {
    utters = words.map((item,index)=>initUtter(item, index));
    window.addEventListener("click", startSpeak);
}

function startSpeak(e, ind=-1) {
    if (ind >= 0) {
        list[ind].classList.remove("highlight_js");
    }
    if (ind < utters.length - 1) {
        list[ind + 1].classList.add("highlight_js");

        if (window.speechSynthesis.speaking) {
            console.error("speechSynthesis.speaking");
        } else {
            window.speechSynthesis.speak(utters[ind + 1]);
        }
    }

}
