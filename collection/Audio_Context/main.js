const canvasList = document.querySelectorAll('canvas');
const canvasCtxList = Array.from(canvasList).map(c=>{
    c.width = document.body.offsetWidth * 0.95;
    return c.getContext('2d')
}
);

const COUNT = canvasList.length;
const WIDTH = canvasList[0].width;
const HEIGHT = canvasList[0].height;

let audioCtx;
let source, analyser;
let drawVisual;

const SRate = 10000;
const bufferLength = 4096;
const DT = bufferLength / SRate;
info.textContent = `dt=${DT}`
const dataArray = new Uint8Array(bufferLength);

// =====================
navigator.mediaDevices.getUserMedia({
    audio: true
}).then(init);

function init(stream) {

    audioCtx = new AudioContext({
        sampleRate: SRate
    });

    analyser = audioCtx.createAnalyser();
    analyser.minDecibels = -90;
    analyser.maxDecibels = -10;
    analyser.smoothingTimeConstant = 0;
    analyser.fftSize = bufferLength;

    // audioContext.createMediaStreamSource(video.captureStream());
    source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);

    canvasCtxList.forEach((c)=>{
        c.fillStyle = "rgb(200, 200, 200)";
        c.fillRect(0, 0, WIDTH, HEIGHT);
    }
    )
}

// =======================
document.onclick = (e)=>{
    if (audioCtx) {
        if (drawVisual) {
            cancelAnimationFrame(drawVisual);
            drawVisual = 0;

            hint.textContent = "pause(click to record)"
        } else {
            visualize();
            hint.textContent = "running(click to pause)"

        }
    }
}

function visualize() {

    let canIndex = 0;
    let lastTimeStamp = 0;

    const draw = (step)=>{
        // console.log(step - lastTimeStamp)
        drawVisual = requestAnimationFrame(draw);
        analyser.getByteTimeDomainData(dataArray);

        if (canIndex == 0) {
            if (Math.max(...dataArray.slice(0, 1000)) < 150) {
                return
            }
        }

        const tnow = analyser.context.currentTime;
        if (tnow - lastTimeStamp < DT - 2 / 60) {
            return
        } else {
            lastTimeStamp = tnow;
        }

        const canvasCtx = canvasCtxList[canIndex];
        canIndex = (canIndex + 1) % COUNT;

        canvasCtx.fillStyle = "rgb(200, 200, 200)";
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
        // canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

        canvasCtx.beginPath();

        const unitWidth = WIDTH / (bufferLength - 1);
        const unitHeight = HEIGHT / 2 / 128;

        canvasCtx.moveTo(0, dataArray[0] * unitHeight);
        for (let i = 1; i < bufferLength; i++) {
            canvasCtx.lineTo(i * unitWidth, dataArray[i] * unitHeight);
        }

        // canvasCtx.lineWidth = 1;
        canvasCtx.strokeStyle = "rgb(0, 0, 0)";
        canvasCtx.stroke();

        canvasCtx.fillStyle = "rgb(255, 255, 255)";
        canvasCtx.fillText(audioCtx.currentTime.toFixed(3), 25, 75)
        // canvasCtx.fillText(audioCtx.destination.context.currentTime, 0, 75)
    }

    // performance.now();
    draw(document.timeline.currentTime);
}

// ===================================
async function xxxx() {
    // Set up the different audio nodes we will use for the app

    const distortion = audioCtx.createWaveShaper();
    distortion.oversample = "4x";
    distortion.curve = new Float32Array(44100);

    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 1;

    const biquadFilter = audioCtx.createBiquadFilter();
    biquadFilter.type = "lowshelf";
    biquadFilter.type = "highpass";
    biquadFilter.frequency.value = 1100;
    biquadFilter.frequency.setTargetAtTime(1000, audioCtx.currentTime, 0);
    biquadFilter.gain.setTargetAtTime(25, audioCtx.currentTime, 0);

    const convolver = audioCtx.createConvolver();
    const response = await fetch("https://mdn.github.io/voice-change-o-matic/audio/concert-crowd.ogg");
    const arrayBuffer = await response.arrayBuffer();
    const decodedAudio = await audioCtx.decodeAudioData(arrayBuffer);
    convolver.buffer = decodedAudio;

    const delay = audioContext.createDelay(1);
    delay.delayTime.value = 0.75;

    source.connect(distortion);
    distortion.connect(biquadFilter);
    biquadFilter.connect(gainNode);
    convolver.connect(gainNode);
    biquadFilter.disconnect(0);
    biquadFilter.connect(gainNode);
}
