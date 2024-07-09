// location.href="https://cn.bing.com/search?q=define+mass"

words = ['mash', 'mass', 'math', 'mesh', 'mess', 'muss'];
trans = ["糊食", "质量", "数学", "网状", "杂乱", "弄乱"].map(encodeURI);

soundsUrl = new Array(words.length);
phonetic = new Array(words.length);

preUrl = "https://cn.bing.com/search?q=define+";
promisesArray = words.map(w=>fetch(preUrl + w).then(resp=>resp.text()).then(html=>html.match(/\?id=ODT\.(.*)&/)[1]))
p1 = Promise.all(promisesArray).then((values)=>{
    // console.log(values);
    soundsUrl = values;
}
, (err)=>console.log(err)).catch(err=>console.log(err));

preUrl = "https://cn.bing.com/dict/search?q=";
promisesArray = words.map(w=>fetch(preUrl + w).then(resp=>resp.text()).then(html=>html.match(/UK&#160;(\[.*\]) <\/div>/)[1]))
p2 = Promise.all(promisesArray).then((values)=>{
    // console.log(values);
    phonetic = values;
}
);

Promise.all([p1, p2]).then(()=>{
    console.log(trans);
    console.log(soundsUrl);
    console.log(phonetic);
    a = phonetic.map(it=>it.replaceAll(/&#(\d+);/g, (a,b)=>String.fromCharCode(b)));
    console.log(a);
}
)

// ======================================
a = ['%E7%B3%8A%E9%A3%9F', '%E8%B4%A8%E9%87%8F', '%E6%95%B0%E5%AD%A6', '%E7%BD%91%E7%8A%B6', '%E6%9D%82%E4%B9%B1', '%E5%BC%84%E4%B9%B1'];
c = ['28A30BB1CBA7DA45269DCF45018B2377', 'E02A898C587D71146EED9C0003BFCB41', '0D199A15A9783D2B0F6D2BD72DB3B30F', '611D65AD786510C105F6C213CA5CF4B6', '9FC47001EAB4D5EA76AFDF08AB128D9E', '6FC9B74D4F07E04E090E110BFF83CA19'];
c = ['[m&#230;ʃ]', '[m&#230;s]', '[m&#230;θ]', '[meʃ]', '[mes]', '[mʌs]'];
c.map(encodeURI);
cc=['%5Bm&#230;%CA%83%5D', '%5Bm&#230;s%5D', '%5Bm&#230;%CE%B8%5D', '%5Bme%CA%83%5D', '%5Bmes%5D', '%5Bm%CA%8Cs%5D'];
d = ['[mæʃ]', '[mæs]', '[mæθ]', '[meʃ]', '[mes]', '[mʌs]'];
'start here'
// ======================================

// fetch("https://cn.bing.com/search?q=define+mas).then(a, b);
// function a(response) {
//     response.text()
//         .then(json=>console.log(json))
//         .catch(err=>console.log('Request Failed', err));
// }

// function b(response) {
//     console.log('b')
// }

// a= await fetch('https://cn.bing.com/search?q=define+mass');
// b= await a.text();
// b.match(/\?id=ODT\.(.*)&/)[1]

// a= await fetch('https://cn.bing.com/dict/search?q=mass');
// b= await a.text();
// b.match(/UK&#160;(\[.*\]) <\/div>/)[1]
// 'UK&#160;[m&#230;s]'.replaceAll(/&#(\d+);/g,(a,b)=>String.fromCharCode(b))
