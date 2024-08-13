u = "https://ee.phncdn.com/videos/202108/27/393679371/480P_2000K_393679371.mp4?validfrom=1682589806&validto=1682597006&rate=500k&burst=1600k&ip=216.218.223.53&ipa=216.218.223.53&hash=3UmMK5KGS8DbGepvpT2V0gau5s8%3D&"
u = "https://upos-sz-estgoss.bilivideo.com/upgcxcode/70/40/259964070/259964070-1-30064.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1686641027&gen=playurlv2&os=upos&oi=2027438130&trid=31a9a886f6e643a0a1fc067c39f40e25u&mid=95646000&platform=pc&upsig=6fc9ded03b5e91f2109faa31ef616823&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=0,3&buvid=155B0A80-A099-FA20-3389-6344D7C2711E95646infoc&build=0&agrr=1&bw=113930&logo=80000000"

console.log('start!')
function downloadJPG(filename) {
    url = "https://img4.wncdn.ru/data/1640/48/" + filename
    url = u
    fetch(url, {
        mode: 'cors'
    }).then(async res=>{
        const e = await res.blob()
        return e;
    }
    ).then((blob)=>{
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(()=>{
            a.remove();
        }
        , 2000)
    }
    )
}

// for (var i = 1; i < 35; i++) {
//     var name = ('0' + i).substr(-2) + ".jpg"
//     downloadJPG(name)
// }

downloadJPG('aaa')
console.log('done!')

/*
for (var i = 3; i < 4; i++) {
    //     window.open
    //     console.log("https://img.xchina.pics/photos/633063c85738d/00" + ('0' + i).substr(-2) + ".jpg")
    var oPop = window.open("https://img.xchina.pics/photos/633063c85738d/00" + ('0' + i).substr(-2) + ".jpg");
    for (; oPop.document.readyState != "complete"; ) {
        if (oPop.document.readyState == "complete")
            break;
    }
    oPop.document.execCommand("SaveAs");
    oPop.close();
}
*/
