class Stage {

    canvas = document.querySelector('canvas');
    ctx = this.canvas.getContext('2d');
    infoScore = document.querySelector("p[name='score']");
    N = 25;

    constructor() {
        this.w = this.canvas.width = window.innerWidth;
        this.h = this.canvas.height = window.innerHeight;
        this.x0 = this.w / 2;
        this.y0 = this.h / 2;

        this.ballsArray = [];
        this.blackhole = new BlackHole(this);
        this.score = 0;

        this.init()
    }

    init() {

        window.addEventListener('mousedown', (e)=>{
            this.blackhole.doAttract = true;
        }
        )
        window.addEventListener('mouseup', (e)=>{
            this.blackhole.doAttract = false;
            this.blackhole.drag = 0;
        }
        )
        window.addEventListener('resize', (e)=>{
            this.w = this.canvas.width = window.innerWidth;
            this.h = this.canvas.height = window.innerHeight;
            this.x0 = this.w / 2;
            this.y0 = this.h / 2;
            this.blackhole.x = stage.x0;
            this.blackhole.y = stage.y0;
        }
        )
    }

    loop() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        this.ctx.fillRect(0, 0, this.w, this.h);

        if (this.ballsArray.length < this.N) {
            this.ballsArray.push(new Ball(this.ballsArray.length,this));
        } else if (this.ballsArray.length > this.N) {
            this.ballsArray.pop();
        }

        this.ballsArray.forEach(a=>a.updatePosition())
        let bound = this.ballsArray.length;
        for (let indexA = 0; indexA < bound; indexA++) {
            // this.ballsArray[indexA].updatePosition();
            for (let indexB = indexA + 1; indexB < bound; indexB++) {
                this.ballsArray[indexA].collisionDetect(this.ballsArray[indexB])
                // console.log(indexA+"-"+indexB)    
            }
        }
        this.ballsArray.map(a=>a.draw())

        this.blackhole.collisionDetect();
        this.blackhole.draw();

        this.infoScore.textContent = 'game score: ' + this.score;
        requestAnimationFrame(this.loop.bind(this));
    }

}

class Ball {
    size = 10;
    velocity = 7;
    // elastic = 0.95;
    constructor(index, stage) {
        this.index = index;
        this.stage = stage;

        this.x = stage.x0 + 150 * Math.cos(0.4 * index);
        this.y = stage.y0 + 150 * Math.sin(0.4 * index);

        const alpha = 2 * Math.PI * Math.random();
        const r = this.velocity * (Math.random() + Math.random()) / 2
        this.velX = r * Math.cos(alpha);
        this.velY = r * Math.sin(alpha);

        this.lastCollision;
    }

    draw() {
        const drag = this.stage.blackhole.drag;
        const cx = this.stage.blackhole.x;
        const cy = this.stage.blackhole.y;
        let h = 360 * (Math.atan2(this.velY, this.velX) / Math.PI + 0.5);
        let s = 100 - 140 * Math.hypot(this.x - cx, this.y - cy) / this.stage.w;
        let l = 60 * Math.hypot(this.velY, this.velX) / this.velocity + 30;

        const ctx = this.stage.ctx;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fillStyle = `hsl(${h},${s}%,${l}%)`;
        ctx.fill();
    }

    updatePosition() {
        this.x += this.velX;
        this.y += this.velY;

        if ((this.x - this.size) <= 0) {
            this.velX = Math.abs(this.velX);
        }
        if ((this.y - this.size) <= 0) {
            this.velY = Math.abs(this.velY);
        }
        if ((this.x + this.size) >= this.stage.w) {
            this.velX = -Math.abs(this.velX);
        }
        if ((this.y + this.size) >= this.stage.h) {
            this.velY = -Math.abs(this.velY);
        }

    }

    collisionDetect(ball) {

        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.hypot(dx, dy);

        if (distance < this.size + ball.size) {

            let vt1, vt2, vn1, vn2;
            let v1, v2, vx1, vx2, vy1, vy2;
            // ==========
            vn1 = this.velX * dx + this.velY * dy;
            vt1 = this.velX * -dy + this.velY * dx;

            vn2 = ball.velX * dx + ball.velY * dy;
            vt2 = ball.velX * -dy + ball.velY * dx;
            // ==========
            const c1 = (1 + this.elastic) / 2;
            const c2 = (1 - this.elastic) / 2;
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

        }
    }
}
Ball.prototype.elastic = 0.98;

class BlackHole {
    colors = ["white", "red", "yellow", "red", "yellow"];
    constructor(stage) {
        this.stage = stage;
        this.x = stage.x0;
        this.y = stage.y0;

        this.size = 10;
        this.drag = 0;
        this.gravity = 20;
        this.colorInd = 0;
    }

    draw() {
        const ctx = this.stage.ctx;
        ctx.beginPath();
        ctx.strokeStyle = this.colors[this.colorInd % 5];
        ctx.lineWidth = 3;
        ctx.arc(this.x, this.y, this.size + this.drag, 0, 2 * Math.PI);
        ctx.stroke();
    }

    collisionDetect() {
        if (this.colorInd > 0) {
            this.colorInd--;
        }

        if (this.doAttract) {
            this.stage.score++
            this.drag++;

            for (const ball of this.stage.ballsArray) {

                const dx = this.x - ball.x;
                const dy = this.y - ball.y;
                const distance = Math.hypot(dx, dy);
                if (distance > this.size + ball.size) {
                    const dCube = Math.pow(distance, 3)
                    ball.velX = ball.velX + this.gravity * this.drag * dx / dCube;
                    ball.velY = ball.velY + this.gravity * this.drag * dy / dCube;
                } else {
                    this.colorInd = 10;
                    this.stage.score = 0;
                    this.drag = 0;
                }

            }
        }
    }

}

//=============================

stage = new Stage();
stage.loop();

//=============================

const cmdInput = document.querySelector("#cmdInput");
const cmdOutput = document.querySelector("#cmdOutput");
const infoKey = document.querySelector("p[name='key']");
// cmdOutput.classList.toggle("trans");
let timeoutID;

window.addEventListener('keydown', (e)=>{
    infoKey.textContent = 'key pressed: ' + e.key;
    switch (e.key) {
    case 'h':
        // ;
        break;
    case 'Enter':
        // e.keyCode === 13
        const userInput = cmdInput.value;
        if (userInput == '') {
            if (cmdInput.style.display != "block") {
                cmdInput.style.display = "block";
                cmdInput.focus();
            } else {
                cmdInput.style.display = "none";
                cmdOutput.style.display = "none";
            }

        } else {
            cmdInput.value = "";
            responseMessage(userInput);

            cmdOutput.classList.remove("trans");
            // cmdOutput.style.display = "none";
            cmdOutput.style.display = "block";
            cmdOutput.style.opacity = 1;

            clearTimeout(timeoutID);
            timeoutID = setTimeout(()=>{
                cmdOutput.classList.add("trans");
                cmdOutput.style.opacity = 0
            }
            , 5000);
        }

        break;

    }
}
)

cmds = {
    help: function(params) {
        const ret = "Type `help` to see this list.\n\
            \thelp : Displays this help information\n\
            \techo : Displays messages\n\
            \tset : Set the number of the balls. eg. [set N 25]\n\
            \tdir : List properties of the given object. eg. [dir stage]\n\
            \teval : Evaluates JavaScript code represented as a string and returns its completion value.\n\
            \tabout : Displays games information"
        return ret
    },
    set: function(params) {
        const key = params[0]
        const val = Number(params[1]);
        switch (key) {
        case 'N':
            stage.N = val;
            break;
        case 'E':
            Ball.prototype.elastic = val;
            break;
        case 'G':
            stage.blackhole.gravity = val;
            break;
        default:
            return `ReferenceError: ${key} is not defined`;
        }
        return `set ${key} number to ${val}`;
    },
    echo: function(params) {
        return params.toString()
    },
    dir: function(params) {
        try {
            const obj = Function("return " + params[0])()
            const retArr = Object.getOwnPropertyNames(obj);
            return retArr.join("\t")
        } catch (error) {
            return error
        }
    },
    eval: function(params) {
        try {
            return eval(params[0])
        } catch (error) {
            return error
        }
    },
    about: function() {
        const ret = "How to Play:\n\
\tKeep pressing the mouse button to get scores\n\
\tAvoid colliding with colored balls\n\
Variables for `set` command:\n\
\tN : The number of balls. default=25\n\
\tE : Coefficient of restitution(0=perfectly inelastic collision,1=perfectly elastic collision). default=0.98\n\
\tG : Gravity coefficient of blackhole. default=20";
        return ret
    }
}

function responseMessage(msg) {
    // cmd parse
    op = msg.split(' ').filter(Boolean);
    params = op.splice(1);
    fun = cmds[op[0]];
    if (!fun) {
        fun = cmds['echo'];
        params = `ReferenceError: ${op} is not defined`;
    }

    // get output message
    res = fun(params);

    // render result
    cmdOutput.textContent = `> ${msg}\n${res}`;
}
