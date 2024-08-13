btn = document.querySelector('button')
link = document.querySelector('a')
link.download = "capture.webm";

btn.onclick = function(evt) {
    navigator.mediaDevices.getDisplayMedia().then(onFulfilled, onRejected);
}

function onFulfilled(stm) {
    const stream = stm;
    const [video] = stream.getVideoTracks();
    const recoder = new MediaRecorder(stream);
    recoder.start();
    btn.textContent = 'recording...';

    video.addEventListener("ended", ()=>{
        recoder.stop();
        btn.textContent = "done ! !";
        console.log("stream stopped");
    }
    );

    recoder.addEventListener("dataavailable", (evt)=>{
        link.href = URL.createObjectURL(evt.data);
        link.textContent = "download";
        console.log("get data");
        // a.click();
    }
    );
}

function onRejected(reason) {
    btn.textContent = reason;
    // btn.textContent=reason.message;
}

// (async () => {
//   const stream = await navigator.mediaDevices.getDisplayMedia();
//   const recoder = new MediaRecorder(stream);
//   recoder.start();
//   const [video] = stream.getVideoTracks();
//   video.addEventListener("ended", () => {
//     recoder.stop();
//   });
//   recoder.addEventListener("dataavailable", (evt) => {
//     const a = document.createElement("a");
//     a.href = URL.createObjectURL(evt.data);
//     a.download = "capture.webm";
//     a.click();
//   });
// })();

// navigator.mediaDevices.getUserMedia

const videoElement = document.getElementById('videoElement');

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then((stream)=>{
    videoElement.srcObject = stream;
}
).catch((error)=>{
    console.error('Error accessing webcam:', error);
}
);
