class Block {

    adjacentBlocks = [];
    containBall = new Set();
    N_ball = 0;

    // ============================================
    constructor(x, y, ind, g) {
        this.stage = g
        this.name = ind.toString();

        this.cx = x;
        this.cy = y;

        this.gx = this.cx;
        this.gy = this.cy;
        this.gspeedx = 0;
        this.gspeedy = 0;

        let len = this.stage.blockLen;
        this.sizeScale = len;

    }

    onClick() {
        this.stage.createBall(this);
    }

    updateBallCollide() {
        const arr = new Array(...this.containBall);
        const arr2 = this.adjacentBlocks.reduce((res,ele)=>[...res, ...ele.containBall], [])

        let bound = arr.length;
        for (let indexA = 0; indexA < bound; indexA++) {
            for (let indexB = indexA + 1; indexB < bound; indexB++) {
                arr[indexA].collisionDetect(arr[indexB]);
            }
            for (let ball2 of arr2) {
                arr[indexA].collisionDetect(ball2);
            }
        }

    }

    updateBallAttract() {
        this.containBall.forEach(b=>{
            b.speedx = b.speedx + this.gspeedx;
            b.speedy = b.speedy + this.gspeedy;
        }
        )
    }
    // ==========
    update() {
        this.N_ball = this.containBall.size;
        if (this.N_ball > 0) {
            let x = 0;
            let y = 0;
            this.containBall.forEach(b=>{
                x = x + b.cx;
                y = y + b.cy
            }
            )
            this.gx = x / this.N_ball;
            this.gy = y / this.N_ball;

            this.gspeedx = 0;
            this.gspeedy = 0;
        }
    }

    draw(ctx) {
        let len = this.stage.blockLen;
        let x = this.cx
        let y = this.cy

        // ctx.lineWidth = 1;
        ctx.fillStyle = "rgb(0 0 0 / 50%)";
        // ctx.fillText(this.name, x, y);
        ctx.fillText(this.containBall.size, x + len / 4, y + len / 4);
        ctx.fillText(this.adjacentBlocks.length, x - len / 4, y + len / 4);

        // const oldStyle = ctx.fillStyle;

        ctx.beginPath()
        ctx.arc(this.gx, this.gy, 1, 0, 2 * Math.PI)
        ctx.fillStyle = "rgb(0 0 0)";
        ctx.fill()
        ctx.beginPath()
        ctx.arc(this.gx, this.gy, 3, 0, 2 * Math.PI)
        ctx.strokeStyle = "rgb(0 0 0)";
        ctx.stroke()

        // c.moveTo(i * this.blockLen, 0)
        // c.lineTo(i * this.blockLen, this.canvas.height)

        // ctx.fillStyle = oldStyle;
    }
}
