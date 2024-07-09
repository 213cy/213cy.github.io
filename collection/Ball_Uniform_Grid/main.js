class Sim {

    canvas = document.querySelector('canvas');
    btn_pause = document.querySelector('div > button');
    btn_step = document.querySelector('div > button:nth-child(2)');
    btn_continue = document.querySelector('div > button:nth-child(3)');

    constructor(r, c, len, restitution=0.6, gravity=20) {
        this.blockLen = len
        this.Nr = r;
        this.Nc = c;
        this.gravity = gravity;
        this.elastic = restitution;

        this.blockArray = new Array(r * c);
        this.initBlockArray();
        this.ballSet = new Set();
        this.selector = new Selector(this);

        this.canvas.width = this.Nc * this.blockLen;
        this.canvas.height = this.Nr * this.blockLen;

        this.ctx = this.canvas.getContext("2d");
        this.ctx.font = "12px Courier New";
        this.ctx.textBaseline = "middle";
        this.ctx.textAlign = "center";
        this.initContextBackground();

        this.draw_bind = this.draw.bind(this);
        this.update_bind = this.update.bind(this);

        this.initButton()
        this.init();
    }
    // ==========================
    initBlockArray() {
        for (let i = 0; i < this.Nr; i++) {
            for (let j = 0; j < this.Nc; j++) {
                let ind = i * this.Nc + j;
                const x = j * this.blockLen + this.blockLen / 2;
                const y = i * this.blockLen + this.blockLen / 2;
                this.blockArray[ind] = new Block(x,y,ind,this);
                
                const arr = [];
                if (j < this.Nc - 1) {
                    arr.push(ind + 1);
                }
                if (i < this.Nr - 1) {
                    arr.push(ind + this.Nc);
                    if (j > 0) {
                        arr.push(ind + this.Nc - 1)
                    }
                    if (j < this.Nc - 1) {
                        arr.push(ind + this.Nc + 1)
                    }
                }
                this.blockArray[ind]._adjacentBlockIndice = arr;
            }
        }

        this.blockArray.forEach(block=>{
            block.adjacentBlocks = block._adjacentBlockIndice.map(index=>this.blockArray[index]);
        }
        )
    }

    initContextBackground() {
        let ctx = this.ctx;

        // ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        ctx.beginPath();
        for (let i = 0; i < this.Nc; i++) {
            ctx.moveTo(i * this.blockLen, 0)
            ctx.lineTo(i * this.blockLen, this.canvas.height)
        }
        for (let i = 0; i < this.Nr; i++) {
            ctx.moveTo(0, i * this.blockLen)
            ctx.lineTo(this.canvas.width, i * this.blockLen)
        }
        // ctx.strokeStyle = "green";
        ctx.strokeStyle = "rgb(0 255 0 / 50%)";
        ctx.stroke()

        this.blockArray.forEach(b=>{
            ctx.fillStyle = "rgb(0 0 0 / 50%)";
            ctx.fillText(b.name, b.cx, b.cy);
        }
        )

        this.backImageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        // this.backImageData = this.ctx.createImageData(200, 200,50,50);
        // drawImage(image, dx, dy)

    }

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

    init(n=100) {
        do {
            const index = Math.floor(this.Nr * this.Nc * Math.random());
            this.createBall(this.blockArray[index])
        } while (n-- > 1)
    }
    //===========================
    //===========================

    createBall(block) {
        this.ballSet.add(new Ball(block,this))
    }

    // =================


    updateBlockAttract() {
        const bound = this.blockArray.length;
        for (let indexA = 0; indexA < bound; indexA++) {
            for (let indexB = indexA + 1; indexB < bound; indexB++) {
                const blockA = this.blockArray[indexA];
                const blockB = this.blockArray[indexB];
                if (!blockA.adjacentBlocks.includes(blockB)) {

                    const dx = blockA.cx - blockB.cx;
                    const dy = blockA.cy - blockB.cy;
                    const dist = Math.hypot(dx, dy);

                    const dCube = Math.pow(dist, 3)
                    const vdx = this.gravity * dx / dCube;
                    const vdy = this.gravity * dy / dCube;

                    blockA.gspeedx = blockA.gspeedx - blockB.N_ball * vdx;
                    blockA.gspeedy = blockA.gspeedy - blockB.N_ball * vdy;

                    blockB.gspeedx = blockB.gspeedx + blockA.N_ball * vdx;
                    blockB.gspeedy = blockB.gspeedy + blockA.N_ball * vdy;

                }
            }
        }
    }

    // ==========================

    update(once=false) {

        this.ballSet.forEach(b=>b.update());
        this.blockArray.forEach(b=>b.updateBallCollide());
        
        this.blockArray.forEach(b=>b.update());
        this.updateBlockAttract();
        this.blockArray.forEach(b=>b.updateBallAttract());
        
        if (!once) {
            this.timeoutID = setTimeout(this.update_bind, 1000 / 25)
        }

    }

    draw() {
        this.ctx.putImageData(this.backImageData, 0, 0);

        this.ballSet.forEach((b)=>b.draw(this.ctx));
        this.blockArray.forEach((b)=>b.draw(this.ctx));
        this.selector.draw(this.ctx);

        requestAnimationFrame(this.draw_bind);
        // requestAnimationFrame(()=>this.draw());
        // requestAnimationFrame(this.gameLoop.bind(this));
    }

    simLoop() {
        this.draw();
        this.update();
    }
}

// ============================================================

function simPlay() {
    sim = new Sim(r = 9,c = 9,50);
    sim.simLoop();
}

window.addEventListener("DOMContentLoaded", simPlay, false);
