var canvas, context, canvasImage;
var color = '#fcd1c4'
  , drawMethodInd = 0;

var cursorPosition = {
    x: undefined,
    y: undefined,
};

function changeColor() {
    const colors = ['#fcd1c4', '#abfcec', '#a3d9e1', '#fbbfff', '#a9ef8f', '#fff0b2', '#fff0b2', ];
    color = colors[Math.floor(Math.random() * colors.length)];
}

function throttle(ms, fn) {
    var lastCallTime;
    return function() {
        var now = Date.now();
        if (!lastCallTime || now - lastCallTime > ms) {
            lastCallTime = now;
            fn.apply(this, arguments);
        }
    }
}

drawMethod = [function drawPoints() {
    if (Math.random() > 0.1) {
        return;
    }
    let Radius = 100;
    let x0 = canvas.width * Math.random();
    let y0 = canvas.height * Math.random();

    context.beginPath();
    context.arc(x0, y0, Radius, 0, 2 * Math.PI);
    // context.strokeStyle = color;
    context.stroke();

    let i = 0;
    do {
        i++;
        let r_circle = Math.pow(Math.random(), 1 / 2);
        let phi_circle = 2 * Math.PI * Math.random();
        let x = Radius * r_circle * Math.cos(phi_circle);
        let y = Radius * r_circle * Math.sin(phi_circle);
        context.beginPath();
        context.arc(x0 + x, y0 + y, 2, 0, 2 * Math.PI);
        context.stroke();
    } while (i < 100);

}
, function drawCircle() {
    context.beginPath();
    context.arc(cursorPosition.x, cursorPosition.y, 40, 0, 2 * Math.PI);
    context.closePath();
    context.fillStyle = color;
    context.fill();

}
, function drawCircles() {

    for (let i = 1; i <= 15; i = i + 2) {
        const r1 = 50 * (Math.random() - 0.5);
        const r2 = 50 * (Math.random() - 0.5);
        const r3 = i * Math.random();
        context.beginPath();
        context.arc(cursorPosition.x + r1, cursorPosition.y + r2, r3, 0, 2 * Math.PI);
        context.fillStyle = "rgb(" + 100 + i * 10 + "," + Math.floor(cursorPosition.x / canvas.width * 255) + "," + Math.floor(cursorPosition.y / canvas.height * 255) + ",0.3)";

        // context.fillStyle = color;
        context.fill();
        context.closePath();
    }

}
]

function drawPattern(event) {
    drawMethod[drawMethodInd]();
    canvasImage = context.getImageData(0, 0, canvas.width, canvas.height);
}

function changeDrawer() {
    drawMethodInd = (drawMethodInd + 1) % drawMethod.length;
}

function newBackground() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}
window.onload = function() {

    infoDiv = document.getElementById('info');
    infoDiv.style.whiteSpace = "pre-wrap";
    infoDiv.textContent = "\n\
            \th : show/hide this help info\n\
            \tp : pause and debugger\n\
            \td : change drawer\n\
            \tc : change color\n\
            \tn : new background\n\
            \tr : restart";

    canvas = document.getElementById('background');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    context = canvas.getContext('2d', {
        willReadFrequently: true
    });

    window.onresize = throttle(100, function() {
        newBackground();
        canvasImage && context.putImageData(canvasImage, 0, 0);
    });

    window.onmousemove = throttle(20, function(event) {
        cursorPosition = {
            x: event.clientX,
            y: event.clientY,
        };
        drawPattern(event);
    });

    window.ontouchmove = throttle(20, function(event) {
        cursorPosition = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY,
        };
        drawPattern(event);
    });

    window.addEventListener('keydown', (e)=>{
        switch (e.key) {
        case 'h':
            // window.getComputedStyle(infoDiv).display
            if (infoDiv.style.display == "block") {
                infoDiv.style.display = "none";
            } else {
                infoDiv.style.display = "block";
            }
            break;
        case 'p':
            debugger ;break;
        case 'r':
            document.location.reload();
            break;
        case 'c':
            changeColor();
            break;
        case 'n':
            newBackground();
            break;
        case 'd':
            changeDrawer();
            break;
        case 'Enter':
            // e.keyCode === 13
            break;

        }
    }
    )

}
