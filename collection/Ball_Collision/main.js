canvas = document.querySelector('canvas');

canvas.addEventListener("click", (e)=>{
    let offsetX = e.offsetX;
    let offsetY = e.offsetY;

    updateCanvas()
}
)

const len = 225;
canvas.width = 2 * len;
canvas.height = 2 * len;

ctx = canvas.getContext("2d");
ctx.font = "12px Courier New";
ctx.textBaseline = "middle";
ctx.textAlign = "center";
ctx.translate(len, len)

ballA = new Ball(0);
ballB = new Ball(240);

//=================

function drawBall(x, y, ball) {
    ctx.beginPath();
    ctx.arc(x, y, ball.radius, 0, 2 * Math.PI);
    ctx.strokeStyle = `hsl(${ball.hue} 100% 50% / 0.5 )`;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
}

function drawVector(x, y, dx, dy, scale, hue) {
    // ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + scale * dx, y + scale * dy);
    ctx.strokeStyle = `hsl(${hue} 100% 50% / 0.6 )`;
    ctx.setLineDash([5, 5]);
    ctx.stroke()
}

function drawInfo(x=-len / 2, y=-len / 2) {
    const a = ballA.getEnergy();
    const b = ballB.getEnergy();
    const c = a + b;
    ctx.beginPath();
    ctx.fillText(a.toFixed(2) + " + " + b.toFixed(2) + " = " + c.toFixed(2), x, y)
}

var xa_c, xb_c;
var ya_c, yb_c;
var dx_c, dy_c;

var vta, vna, vtb, vnb;

//=================
function updateCanvas(params) {
    ctx.clearRect(-len, -len, 2 * len, 2 * len);

    ballA.init();
    ballB.init();
    ballA.draw(ctx);
    ballB.draw(ctx);
    drawInfo();

    ballA.collisionDetect(ballB);

    drawVector((xa_c + xb_c) / 2, (ya_c + yb_c) / 2, dx_c, dy_c, 3, 120)
    drawVector((xa_c + xb_c) / 2, (ya_c + yb_c) / 2, -dy_c, dx_c, 3, 120)
    const dist = ballA.radius + ballB.radius;

    drawBall(xa_c, ya_c, ballA);
    const c = ballA.graphScale / dist / dist;
    drawVector(xa_c, ya_c, dx_c, dy_c, c * vna, ballA.hue);
    drawVector(xa_c, ya_c, -dy_c, dx_c, c * vta, ballA.hue);

    drawBall(xb_c, yb_c, ballB);
    drawVector(xb_c, yb_c, dx_c, dy_c, c * vnb, ballB.hue);
    drawVector(xb_c, yb_c, -dy_c, dx_c, c * vtb, ballB.hue);

    ballA.draw(ctx, 0.6);
    ballB.draw(ctx, 0.6);
    drawInfo(len / 2);

}

window.addEventListener("DOMContentLoaded", updateCanvas, false);

// =================================
class Sim {
    btn_pause = document.querySelector('div > button');
    btn_step = document.querySelector('div > button:nth-child(2)');
    btn_continue = document.querySelector('div > button:nth-child(3)');

    constructor() {
        this.initButton();
    }
    // ==========================

    initButton() {
        this.timeoutID = 0;
        this.btn_pause.disabled = false;
        this.btn_step.disabled = true;
        this.btn_continue.disabled = true;
        this.btn_pause.onclick = ()=>{
            this.btn_pause.disabled = true;
            this.btn_step.disabled = false;
            this.btn_continue.disabled = false;
            clearTimeout(this.timeoutID)
        }
        this.btn_step.onclick = ()=>{
            this.update(true);
        }
        this.btn_continue.onclick = ()=>{
            this.btn_pause.disabled = false;
            this.btn_step.disabled = true;
            this.btn_continue.disabled = true;
            this.update();
        }

    }

}
