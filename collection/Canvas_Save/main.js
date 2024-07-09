window.onload = function() {
    createNewCanvas();
    createDownloadLink();
    createImageLable();
}

var canvas, newCanvas;

function createNewCanvas() {
    // docFrame = window.frames['appIframe'].contentDocument;
    docFrame = window.frames[0].document;
    canvas = docFrame.getElementsByClassName('timemachine')[0];

    newCanvas = document.createElement('canvas');
    newCtx = newCanvas.getContext('2d');

    newCanvas.width = canvas.width / 3;
    newCanvas.height = canvas.height / 3;
    newCtx.drawImage(canvas, 0, 0, newCanvas.width, newCanvas.height);

    // canvas.parentElement.insertBefore(newCanvas, canvas);
    document.body.insertBefore(newCanvas, document.body.children[0]);
}

function createImageLable() {
    img = document.createElement("img");
    img.onload = function() {
        newCtx.drawImage(img, 0, 0, newCanvas.width / 2, newCanvas.height / 2);
    }
    img.src = canvas.toDataURL("image/png");
    document.body.appendChild(img)
}

function createDownloadLink() {
    im = document.createElement("a");
    im.download = 'image.png';
    im.href = newCanvas.toDataURL("image/png");
    //image/jpeg
    im.textContent = "Click here to download !";
    newCanvas.insertAdjacentElement("afterend", im);
    // im.click();
    // im.remove(); 
}
