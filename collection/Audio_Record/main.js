video_rec.onclick=()=>{
    video_element.play()
    aaa();
    video_rec.disabled=true;
    video_rec.textContent = "recording ..."
}

phone_rec.onclick=()=>{
    bbb();
    phone_rec.disabled=true;
    phone_rec.textContent = "recording ...(click a few times)"
}

function addToDOM(blob) {
    const audio = document.createElement("audio");
    audio.src = window.URL.createObjectURL(blob);
    // audio.setAttribute("controls", "");
    audio.controls = true;

    document.body.append( audio);
    // document.body.insertAdjacentElement('afterbegin', audio);
}

function recordVideoStream(stream) {
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.start();
    console.log('begin!')

    mediaRecorder.ondataavailable = function(e) {
        const blob = new Blob([e.data],{
            type: mediaRecorder.mimeType
        })
        addToDOM(blob);
        console.log('done!')
    }

    setTimeout(()=>{
        mediaRecorder.stop()
    }
    , 10000);
}

function aaa() {
    const video = document.querySelector('video');
    const tracks = video.captureStream().getAudioTracks();
    const stream = new MediaStream(tracks);
    recordVideoStream(stream)
}

//=======================================

let chunks = [];

let onSuccess = function(stream) {
    console.log('begin!')

    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.start();

    mediaRecorder.ondataavailable = function(e) {
        // console.log('once');
        chunks.push(e.data);
    }

    setTimeout(()=>{
        mediaRecorder.stop()
    }
    , 10000);

    mediaRecorder.onstop = function(e) {
        const blob = new Blob(chunks,{
            type: mediaRecorder.mimeType
        })
        // e.target.closest(".clip").remove();
        addToDOM(blob);

        chunks = [];

        console.log('done!')
    }

}

async function bbb() {
    const onError = function(err) {
        console.log("The following error occured: " + err);
    };

    const constraints = {
        audio: true
    }

    await navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
}

// navigator.mediaDevices.enumerateDevices()
// MediaRecorder.isTypeSupported
