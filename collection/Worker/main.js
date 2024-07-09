var worker;
var inputElement = document.querySelector("#input");
var outputElement = document.querySelector("#output");

function initWorker() {
    scriptContent = `importScripts('${location.href.replace(/[^\/]*$/, 'worker.js')}')`
    // scriptContent += ";console.log('adfsdf')"
    blob = new Blob([scriptContent]);
    const url = window.URL.createObjectURL(blob)

    worker = new Worker(url);
    worker.onmessage = function(e) {
        var msg = e.data;
        switch (msg.type) {
        case "ready":
            inputElement.value = '';
            inputElement.placeholder = 'Ready: Please type some command';
            initEventListener();
            break;

        case "run":
            document.querySelector("#image-loader").style.visibility = "visible";
            outputElement.innerHTML += "<hr />"
            outputElement.className = "";
            break;

        case "stdout":
            outputElement.innerHTML += msg.data + "\n";
            outputElement.scrollTop = outputElement.scrollHeight;
            break;
        case "stderr":
            outputElement.innerHTML += "<span>" + msg.data + "</span>\n";
            outputElement.scrollTop = outputElement.scrollHeight;
            break;

        case "done":
            document.querySelector("#image-loader").style.visibility = "hidden";
            outputElement.innerHTML += "[get the result : " + msg.data + "]\n";
            outputElement.scrollTop = outputElement.scrollHeight;
            // var buffers = msg.data.MEMFS;
            break;

        case "error":
            inputElement.value = '';
            inputElement.placeholder = `error: ${msg.data}`;
            break;
        case "exit":
            console.log("Process exited with code " + msg.data);
            worker.terminate();
            break;
        }
    }
}

// ===========================

document.addEventListener("DOMContentLoaded", function() {
    initWorker();
});

// window.onload = initWorker;

function initEventListener(params) {
    inputElement.addEventListener("change", function() {
        worker.postMessage({
            type: "run",
            command: inputElement.value
        });
    });
    document.querySelector("#run").addEventListener("click", function() {
        worker.postMessage({
            type: "run",
            command: inputElement.value
        });
    });
    // document.querySelector(".terminal-header").addEventListener("change", function(e) {
    //     console.log(e);
    // });

    
    document.querySelector("#composeCommand").onclick = function() {
        inputElement.value="ffmpeg -i input.mp4 -c:v copy -bsf hevc_mp4toannexb -f rawvideo video.hevc";
    }
    document.querySelector("#getError").onclick = function() {
        worker.postMessage({
            type: "command",
            command: "make some error"
        });
    }
    document.querySelector("#sendData").onclick = function() {
        worker.postMessage({
            type: "run",
            command: '-i input.mp4 -b:a 192K -vn audio.mp3',
            MEMFS: [{
                "name": "input.jpeg",
                "data": new Uint8Array([1, 2, 3, 4])
            }, {
                "name": "input.mp4",
                "data": new Uint8Array([5, 6, 7, 8])
            }]
        })
    }
    ;

}
