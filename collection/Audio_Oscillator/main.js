const mute = document.getElementById("btn");
const vol = document.getElementById("volume");
const freq = document.getElementById("frequency");
const detune = document.getElementById("detune");

var soundwave;

mute.addEventListener("click", function() {
    playSound();
});

freq.addEventListener("input", (event)=>{
    const lab = event.srcElement.labels[0];
    const val = event.target.value;
    lab.textContent = `${freq.name} (${val})`;
    soundwave.oscillator.frequency.value = val;

}
);
vol.addEventListener("input", (event)=>{
    const lab = event.srcElement.labels[0];
    const val = event.target.value;
    lab.textContent = `${vol.name} (${val})`;
    soundwave.gainNode.gain.value = val;
}
);
detune.addEventListener("input", (event)=>{
    const lab = event.srcElement.labels[0];
    const val = event.target.value;
    lab.textContent = `${detune.name} (${val})`;
    soundwave.oscillator.detune.value = val;
}
);

class Sound {
    constructor(params) {

        // create web audio api context
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContext();
        // context = new (window.AudioContext || window.webkitAudioContext)();

        // create Oscillator and gain node
        this.oscillator = this.audioCtx.createOscillator();
        this.gainNode = this.audioCtx.createGain();

        // connect oscillator to gain node to speakers
        this.oscillator.connect(this.gainNode);
        this.gainNode.connect(this.audioCtx.destination);

        // ========================
        // set options for the oscillator
        // this.oscillator.type = "square";

        this.oscillator.onended = function() {
            console.log("Your tone has now stopped playing!");
        }

        this.init();
    }

    init() {
        freq.min = this.oscillator.frequency.minValue;
        freq.max = this.oscillator.frequency.maxValue;
        freq.min = -6000;
        freq.max = 6000;
        freq.value = this.oscillator.frequency.value;

        vol.min = this.gainNode.gain.minValue;
        vol.max = this.gainNode.gain.maxValue;
        vol.min = -1;
        vol.max = 2;
        vol.step = 0.1;
        vol.value = this.gainNode.gain.value;

        detune.min = -100;
        detune.max = 200;
        detune.value = this.oscillator.detune.value;

        this.oscillator.start();
    }
    start() {
        // this.oscillator.start();
        this.gainNode.connect(this.audioCtx.destination);
    }
    stop() {
        // this.oscillator.stop();
        this.gainNode.disconnect(this.audioCtx.destination);
    }
}

function playSound() {
    if (mute.textContent === "play") {
        soundwave || (soundwave = new Sound());

        soundwave.start();
        mute.textContent = "stop";
    } else {
        soundwave.stop();
        mute.textContent = "play";
    }

}
