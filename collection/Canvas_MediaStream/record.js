const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const {width, height} = canvas;

ctx.translate(width / 2, height / 2);

function draw(step) {

    ctx.fillStyle = 'rgba(0, 0, 50, 0.2)';
    ctx.fillRect(-100, -100, 300, 300);
    // ctx.clearRect(0, 0, width, height);
    ctx.rotate(0.05);
    // ctx.beginPath()
    ctx.fillStyle = 'red';
    ctx.fillRect(-50, -50, 150, 150);
    void 0;
}

function update(t) {
    draw(t);
    requestAnimationFrame(update);
}
update(0);

// ================

const stream = canvas.captureStream();


// MediaRecorder.isTypeSupported("video/mp4")
// false
// MediaRecorder.isTypeSupported("video/webm;codecs=h264")
// true
// MediaRecorder.isTypeSupported("video/webm")
// true

const recorder = new MediaRecorder(stream,{
    mimeType: 'video/webm'
});
const data = [];
var url,url2;

recorder.ondataavailable = function(event) {
    if (event.data && event.data.size) {
        data.push(event.data);
        console.log('push once');
    }
}
;

recorder.onstop = ()=>{
    url = URL.createObjectURL(new Blob(data,{
        type: 'video/webm'
    }));
    document.querySelector("#videoContainer").style.display = "block";
    document.querySelector("video").src = url;

    url2 = URL.createObjectURL(data[0]);
    alink = document.querySelector('a');
    alink.innerHTML = "Click here to download";
    alink.download = url2.split('-')[3]+".webm"
    alink.href = url2;    
}
;

recorder.start();

setTimeout(()=>{
    recorder.stop();
}
, 6000);
