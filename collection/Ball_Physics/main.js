class UI {
    canvas = document.querySelector('canvas');

    infoPanel = document.querySelector("#info");
    infoLine = document.querySelector("#myp");

    watchA = document.querySelector("p[name='varA']");
    watchB = document.querySelector("p[name='varB']");
    // watchB = document.querySelector('div#monitor>p:nth-child(2)');

    constructor() {
        this.stage = new Stage(this);
        this.render = new Render(this);
        this.infoPanel.textContent = "reference: https://www.youtube.com/@PezzzasWork \n\
            \th : show/hide this help info\n\
            \tp : pause and debugger\n\
            \tf : set fps\n\
            \tg : set gravity\n\
            \te : set elastic\n\
            \tc : set constrain\n\
            \ts : show energy statistics\n\
            \tr : restart";

        this.init();

        this.stage.update();
        this.render.loop();

    }
    init() {

        window.addEventListener('keydown', (e)=>{
            this.watchB.textContent = 'key pressed: ' + e.key;
            switch (e.key) {
            case 'h':
                // window.getComputedStyle(infoPanel).display
                if (this.infoPanel.style.display == "block") {
                    this.infoPanel.style.display = "none";
                } else {
                    this.infoPanel.style.display = "block";
                }
                break;
            case 'p':
                debugger ;break;
            case 'r':
                document.location.reload();
                break;
            case 'c':
                this.stage.doConstrain = !this.stage.doConstrain;
                break;
            case 's':
                this.stage.energyStatistic.toggle();
            case 'f':
                this.stage.paramSeter.setOprField("FPS", this.watchA);
                break;
            case 'n':
                this.stage.paramSeter.setOprField("N", this.watchA);
                break;
            case 'g':
                this.stage.paramSeter.setOprField("gravity", this.watchA);
                break;
            case 'e':
                this.stage.paramSeter.setOprField("elastic", this.watchA);
                break;
            case 'Enter':
                // e.keyCode === 13
                break;

            }
        }
        )
    }

}
// ===========================
class Render {

    constructor(ui) {
        this.interface = ui;
        this.ctx = ui.canvas.getContext('2d');
        this.ctx.font = "16px Courier New";
        this.ctx.textBaseline = "bottom";
        this.graphSet = new Set();
        this.init();
    }
    init() {}

    drawMethod = {
        stage: function(ctx, stage) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
            ctx.fillRect(0, 0, stage.boundary.w, stage.boundary.h);
        },
        ball: function(ctx, ball) {
            const bw = ball.stage.boundary.w;
            const bh = ball.stage.boundary.h;
            let h = 360 * (Math.atan2(ball.velY, ball.velX) / Math.PI + 0.5);
            let s = 100 - 140 * Math.hypot(ball.x - bw / 2, ball.y - bh / 2) / bw;
            let l = 60 * Math.hypot(ball.velY, ball.velX) / ball.velocity + 30;

            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.size, 0, 2 * Math.PI);
            ctx.fillStyle = `hsl(${h},${s}%,${l}%)`;
            ctx.fill();
        },
        boundary: function(ctx, bound) {
            ctx.beginPath();
            ctx.shadowColor = "blue";
            ctx.shadowBlur = 20;
            ctx.lineWidth = 5;
            ctx.strokeStyle = "hsl(215 100% 40%)";
            ctx.strokeRect(0, 0, bound.w, bound.h)

        },
        paramSeter: function(ctx, seter) {
            ctx.beginPath();
            ctx.moveTo(seter.xo, seter.yo);
            ctx.lineTo(seter.xd, seter.yd);
            ctx.strokeStyle = "hsl(215 100% 60%)";
            ctx.lineWidth = 3;
            ctx.stroke();
        },
        energyStatistic: function(ctx, eStat) {
            // const w0 = 50;
            const p = eStat.arrPointer;

            ctx.translate(50, 0.9 * eStat.stage.boundary.h);
            // ctx.scale(3, -1);

            ctx.beginPath();
            ctx.fillStyle = "hsl(95 100% 60%)";
            ctx.fillText("kinetic energy", 0, eStat.eKineticArray[0])
            ctx.moveTo(0, eStat.eKineticArray[0]);
            for (let index = 1; index < p; index++) {
                ctx.lineTo(4 * index, eStat.eKineticArray[index]);
            }
            ctx.moveTo(4 * p, eStat.eKineticArray[p + 1]);
            for (let index = p + 1; index < 100; index++) {
                ctx.lineTo(4 * index, eStat.eKineticArray[index]);
            }
            ctx.lineWidth = 3;
            ctx.strokeStyle = "hsl(95 100% 60%)";
            ctx.stroke();

            ctx.beginPath();
            ctx.fillStyle = "hsl(335 100% 60%)";
            ctx.fillText("potential energy", 0, eStat.ePotentialArray[0])
            ctx.moveTo(0, eStat.ePotentialArray[0]);
            for (let index = 1; index < p; index++) {
                ctx.lineTo(4 * index, eStat.ePotentialArray[index]);
            }
            ctx.moveTo(4 * p, eStat.ePotentialArray[p + 1]);
            for (let index = p + 1; index < 100; index++) {
                ctx.lineTo(4 * index, eStat.ePotentialArray[index]);
            }
            ctx.lineWidth = 3;
            ctx.strokeStyle = "hsl(335 100% 60%)";
            ctx.stroke();

        }
    };

    drawSingle(obj) {
        this.ctx.save();
        this.drawMethod[obj.type](this.ctx, obj);
        this.ctx.restore();
    }
    drawMultiple(arr) {
        for (let item of arr) {
            this.drawMethod[item.type](this.ctx, item);
        }
    }

    loop() {
        this.drawSingle(this.interface.stage);

        if (this.interface.stage.doConstrain) {
            this.drawSingle(this.interface.stage.boundary);
        }

        this.drawMultiple(this.interface.stage.ballsArray)

        for (let obj of this.graphSet) {
            this.drawSingle(obj);
        }

        requestAnimationFrame(this.loop.bind(this));
    }
}
//=============================
//=============================
class Stage {
    type = "stage";
    N = 30;
    FPS = 25;
    gravity = 0;
    elastic = 0.98;
    doConstrain = true;
    doStatistics = false;

    constructor(ui) {
        this.interface = ui;
        this.ballsArray = [];

        this.boundary = new Boundary(this);
        this.paramSeter = new ParamSeter(this);
        this.energyStatistic = new EnergyStatistic(this);

        this.init()
    }

    init() {}

    update() {
        if (this.ballsArray.length < this.N) {
            this.ballsArray.push(new Ball(this.ballsArray.length,this));
        } else if (this.ballsArray.length > this.N + 1) {
            this.ballsArray.pop();
        }

        this.ballsArray.forEach(a=>a.preStateUpdate());
        let bound = this.ballsArray.length;
        for (let indexA = 0; indexA < bound; indexA++) {
            for (let indexB = indexA + 1; indexB < bound; indexB++) {
                this.ballsArray[indexA].collisionDetect(this.ballsArray[indexB])
            }
        }

        setTimeout(this.update.bind(this), 1000 / this.FPS);
    }

}

class Ball {
    type = "ball";
    size = 6;
    velocity = 7;
    ePotential = 0;
    eKinetic = 0;
    constructor(index, stage) {
        this.index = index;
        this.stage = stage;

        this.x = stage.boundary.w * (0.8 * Math.random() + 0.1);
        this.y = stage.boundary.h * (0.8 * Math.random() + 0.1);

        const alpha = 2 * Math.PI * Math.random();
        const r = this.velocity * (Math.random() + Math.random()) / 2
        this.velX = r * Math.cos(alpha);
        this.velY = r * Math.sin(alpha);

        this.lastCollision = null;
    }

    preStateUpdate() {
        this.x += this.velX;
        this.y += this.velY;

        if (this.stage.doConstrain) {
            this.stage.boundary.applyConstraint(this);
        }

    }

    collisionDetect(ball) {

        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.hypot(dx, dy);
        const rr = this.size + ball.size;

        if (distance < rr) {

            const c0 = rr / distance - 1
            this.x = this.x + c0 * dx;
            this.y = this.y + c0 * dy;
            ball.x = ball.x - c0 * dx;
            ball.y = ball.y - c0 * dy;

            if (this.lastCollision != ball) {
                // const a = this.velX * this.velX + this.velY * this.velY + ball.velX * ball.velX + ball.velY * ball.velY;

                this.lastCollision = ball;
                let vt1, vt2, vn1, vn2;
                let v1, v2, vx1, vx2, vy1, vy2;
                // ==========
                vn1 = this.velX * dx + this.velY * dy;
                vt1 = this.velX * -dy + this.velY * dx;

                vn2 = ball.velX * dx + ball.velY * dy;
                vt2 = ball.velX * -dy + ball.velY * dx;
                // ==========
                const c1 = (1 + this.stage.elastic) / 2;
                const c2 = (1 - this.stage.elastic) / 2;
                v1 = c1 * vn2 + c2 * vn1;
                v2 = c1 * vn1 + c2 * vn2;

                // ==========
                vx1 = v1 * dx + vt1 * -dy;
                vy1 = v1 * dy + vt1 * dx;

                vx2 = v2 * dx + vt2 * -dy;
                vy2 = v2 * dy + vt2 * dx;
                // ==========
                this.velX = vx1 / distance / distance;
                this.velY = vy1 / distance / distance;

                ball.velX = vx2 / distance / distance;
                ball.velY = vy2 / distance / distance;
                
                // const b = this.velX * this.velX + this.velY * this.velY + ball.velX * ball.velX + ball.velY * ball.velY;
                // console.log(a-b);
            }
        } else {
            if (this.lastCollision == ball) {
                this.lastCollision = null;
            }
            const dCube = Math.pow(Math.max(distance, rr), 3)
            const vdx = this.stage.gravity * dx / dCube;
            const vdy = this.stage.gravity * dy / dCube;
            ball.velX = ball.velX + vdx;
            ball.velY = ball.velY + vdy;

            this.velX = this.velX - vdx;
            this.velY = this.velY - vdy;
        }
    }
}

//=============================

class EnergyStatistic {
    type = "energyStatistic";
    timeoutID;
    constructor(stage) {

        this.stage = stage;
        this.ballsArray = stage.ballsArray;

        this.doStatistics = false;
        this.arrPointer = 0;
        this.eKineticArray = new Array(100);
        this.ePotentialArray = new Array(100);

        this.dataCollector = this.update.bind(this)
    }
    toggle() {
        this.doStatistics = !this.doStatistics;
        if (this.doStatistics) {
            this.update();
            this.stage.interface.render.graphSet.add(this)
        } else {
            clearTimeout(this.timeoutID)
            this.stage.interface.render.graphSet.delete(this)
        }
    }

    update() {
        let ek = 0;
        let ep = 0;
        let rr;
        let bound = this.ballsArray.length;
        for (let indexA = 0; indexA < bound; indexA++) {
            const ballA = this.ballsArray[indexA];
            ek += ballA.velX * ballA.velX + ballA.velY * ballA.velY;

            for (let indexB = indexA + 1; indexB < bound; indexB++) {
                const ballB = this.ballsArray[indexB];
                const distance = Math.hypot(ballA.x - ballB.x, ballA.y - ballB.y);
                rr = ballA.size + ballB.size
                if (distance > rr) {
                    ep += 1 / rr - 1 / distance;
                }
            }
        }

        ek = 5 * ek / this.stage.N;
        ep = 10 * this.stage.gravity * ep / this.stage.N;

        const h = this.stage.boundary.h;
        const mod = 0.8 * this.stage.boundary.h;
        this.eKineticArray[this.arrPointer] = -(ek % mod);
        this.ePotentialArray[this.arrPointer] = -(ep % mod);
        this.arrPointer = (this.arrPointer + 1) % 100;
        // this.eKineticArray[this.arrPointer] = undefined;
        // this.ePotentialArray[this.arrPointer] = undefined;

        this.timeoutID = setTimeout(this.dataCollector, 1000);

    }

}
class Boundary {
    type = "boundary";
    constructor(stage) {
        this.stage = stage;
        this.w = this.stage.interface.canvas.width = window.innerWidth;
        this.h = this.stage.interface.canvas.height = window.innerHeight;
        this.init()
    }
    init() {
        window.addEventListener('resize', (e)=>{
            this.w = this.stage.interface.canvas.width = window.innerWidth;
            this.h = this.stage.interface.canvas.height = window.innerHeight;
        }
        )
    }
    applyConstraint(ball) {

        if ((ball.x - ball.size) <= 0) {
            ball.velX = Math.abs(ball.velX);
        }
        if ((ball.y - ball.size) <= 0) {
            ball.velY = Math.abs(ball.velY);
        }
        if ((ball.x + ball.size) >= this.w) {
            ball.velX = -Math.abs(ball.velX);
        }
        if ((ball.y + ball.size) >= this.h) {
            ball.velY = -Math.abs(ball.velY);
        }

    }
}
class ParamSeter {
    type = "paramSeter";
    xo;
    yo;
    xd;
    yd;
    varName = "";
    varRatio = 1;
    varRecord = 0;
    watchElement = null;

    lastCallTime = Date.now();

    constructor(stage) {
        this.stage = stage;
        this.watchElement = stage.interface.watchA;
        this.listener = this.adjustOprField.bind(this);
        this.init()
    }

    init() {
        window.addEventListener('mousedown', (e)=>{
            this.xo = this.xd = e.clientX;
            this.yo = this.yd = e.clientY;
            this.stage.interface.render.graphSet.add(this)
            window.addEventListener('mousemove', this.listener);
        }
        )

        window.addEventListener('mouseup', ()=>{
            this.varName = ""
            this.stage.interface.render.graphSet.delete(this)
            window.removeEventListener("mousemove", this.listener)
        }
        )
    }

    setOprField(fieldName, element) {
        const ratioTable = {
            N: 1,
            FPS: 1,
            gravity: 1,
            elastic: 0.01
        };
        this.varName = fieldName;
        this.varRatio = ratioTable[fieldName];
        this.varRecord = this.stage[fieldName];
        this.watchElement = element;
        element.textContent = `${fieldName} : ${this.varRecord}`;
    }

    adjustOprField(e) {
        const now = Date.now();
        if (now - this.lastCallTime < 100) {
            return
        }
        this.lastCallTime = now;

        this.xd = e.clientX;
        this.yd = e.clientY;
        this.stage.interface.infoLine.textContent = `${this.xd} ${this.yd}`;
        const [coff,power] = [this.xd - this.xo, this.yd - this.yo]

        const dv = Math.round(coff / 20 * Math.exp(-power / 100));
        if (this.varName == '') {
            const nval = this.varRatio * dv;
            this.watchElement.textContent = `Test Val : ${nval.toFixed(2)}`;
        } else {
            const val = Math.round(this.varRecord / this.varRatio);
            const nval = (val + dv) / (1 / this.varRatio);
            this.watchElement.textContent = `${this.varName} : ${nval}`;
            this.stage[this.varName] = nval;
        }

    }

}

// ==================================
sim = new UI();
