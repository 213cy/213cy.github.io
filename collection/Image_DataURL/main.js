// icon size: 16×16 32×32 48×48
// url creating method: canvas.toDataURL reader.readAsDataURL URL.createObjectURL
function createIcon(imageData) {
    // Iterate through every pixel
    for (let i = 0; i < imageData.data.length; i += 4) {
        // Modify pixel data
        imageData.data[i + 0] = 240;
        // R value
        imageData.data[i + 1] = 240;
        // G value
        imageData.data[i + 2] = 240;
        // B value
        imageData.data[i + 3] = 255;
        // A value
    }
    if (imageData.width == 16) {
        for (let x = 0; x < imageData.width; x++) {
            for (let y = 0; y < imageData.height; y++) {
                const s1 = 2 < x && x < 13 && y < 10;
                const s2 = x < 3 && 9 < y;
                const s3 = 5 < x && x < 10 && 9 < y && y < 13;
                const s4 = 12 < x && 9 < y;
                if (s1 || s2 || s3 || s4) {
                    const i = 4 * (x + y * imageData.width);
                    imageData.data[i + 0] = 101;
                    imageData.data[i + 1] = 209;
                    imageData.data[i + 2] = 89;
                }

            }
        }
    }
    if (imageData.width == 32) {
        for (let x = 0; x < imageData.width; x++) {
            for (let y = 0; y < imageData.height; y++) {
                const s1 = 6 < x && x < 25 && 0 < y && y < 19;
                const s2 = 0 < x && x < 7 && 18 < y && y < 31;
                const s3 = 12 < x && x < 19 && 18<y && y < 25;
                const s4 = 24 < x && x < 31 && 18 < y && y < 31;
                if (s1 || s2 || s3 || s4) {
                    const i = 4 * (x + y * imageData.width);
                    imageData.data[i + 0] = 101;
                    imageData.data[i + 1] = 209;
                    imageData.data[i + 2] = 89;
                }

            }
        }
    }

    return imageData;
}

// ===========================
let dataURL;

const canvas = document.createElement('canvas');
canvas.width = 32;
canvas.height = 32;
const image_fromCanvas = new Image(32,32);
image_fromCanvas.alt = "Image preview";

document.querySelector('#fromCanvas').append(canvas)
document.querySelector('#fromCanvas').append(image_fromCanvas)

const ctx = canvas.getContext("2d");
const imageData = createIcon(ctx.createImageData(32, 32));
ctx.putImageData(imageData, 0, 0);

dataURL = canvas.toDataURL("image/x-icon")
console.log(dataURL.length, dataURL);

dataURL = canvas.toDataURL('image/jpeg', 0.95)
console.log(dataURL.length, dataURL);

canvas.toBlob(function(blob) {
    const reader = new FileReader();
    reader.addEventListener("load", ()=>{
        // convert blob to base64 string
        dataURL = reader.result
        console.log(dataURL.length, dataURL);
        console.log('='.repeat(50))
    }
    )
    reader.readAsDataURL(blob);

    image_fromCanvas.src = URL.createObjectURL(blob);
}, "image/jpeg", 0.95);
// JPEG at 95% quality

//=====================================

const canvas16 = document.createElement('canvas');
canvas16.width = 16;
canvas16.height = 16;
const image_fromCanvas16 = new Image(16,16);
image_fromCanvas16.alt = "Image preview";

document.querySelector('#fromCanvas').append(canvas16)
document.querySelector('#fromCanvas').append(image_fromCanvas16)

const ctx16 = canvas16.getContext("2d");
const imageData16 = createIcon(new ImageData(16,16));
ctx16.putImageData(imageData16, 0, 0);

dataURL = canvas16.toDataURL("image/png")
console.log(dataURL.length, dataURL);
image_fromCanvas16.src = dataURL;
// ===============================================================

var file;
const image_fromFile = new Image(32,32);
image_fromFile.alt = "Image preview";
document.querySelector('#fromFile').append(image_fromFile)

function previewFile() {
    file = document.querySelector("input[type=file]").files[0];
    const reader = new FileReader();
    reader.addEventListener("load", ()=>{
        // convert image file to base64 string
        image_fromFile.src = reader.result;
        dataURL = reader.result
        console.log(dataURL.length, dataURL);
    }
    )

    if (file) {
        reader.readAsDataURL(file);
        // image_fromFile.src = URL.createObjectURL(file);
    }
}

// =========================================================

// <link rel="shortcut icon" href="favicon.ico">
link = document.createElement('link')
link.setAttribute('rel', "icon")
link.setAttribute('href', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAGRJREFUWEdj/PDhw3+GAQSM+BxQ+jCTKk7rlp+O05xRB4yGwGgIjIbAaAiMhsBoCIyGwOAIAVwtH1wtGWqqB4cANQ3E1vbCZ/6oA0ZDgKwQILWzQPVEOOqA0RCgegiQaiA11QMAFHoKEDqZYCQAAAAASUVORK5CYII=')
document.head.append(link)

var previewImage = new Image();
previewImage.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAEFJREFUOE9j/PDhw38GKCh9mAlj4qW75afD5RlHDWAYDQMGKoRB6sVIeEpETmHoqRKXHOPgNQBfbkL2Hk4v0M0AACRXbnsqZHiQAAAAAElFTkSuQmCC"
