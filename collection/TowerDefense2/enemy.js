const {width, height} = canvas;

var pathPoints = [{
    x: 64,
    y: 64,
    next: 1
}, {
    x: width / 2,
    y: 64,
    next: 2
}, {
    x: width / 2,
    y: height - 64,
    next: 3
}, {
    x: width - 64,
    y: height - 64,
    next: 4
}, {
    x: width - 64,
    y: height / 2,
    next: 5
}, {
    x: 64,
    y: height / 2,
    next: 0
}];

class Enemy {
    constructor(pathNode=0, type="basic", options={}) {
        this.aimNode = pathPoints[pathNode].next;
        this.x = pathPoints[pathNode].x;
        this.y = pathPoints[pathNode].y;

        this.size = config.enemy[type].size;
        this.radius = this.size / 2;

        this.x_targ = pathPoints[this.aimNode].x + 1.5 * this.size * (Math.random() - 0.5);
        this.y_targ = pathPoints[this.aimNode].y + 1.5 * this.size * (Math.random() - 0.5);

        const dist_x = this.x_targ - this.x;
        const dist_y = this.y_targ - this.y;
        const dist = Math.hypot(dist_x, dist_y);
        this.speed = config.enemy[type].speed;
        this.vx = this.speed * dist_x / dist
        this.vy = this.speed * dist_y / dist

        this.color = config.enemy[type].color;

        if (options.hpMax) {
            this.hpMax = options.hpMax;
            this.hp = options.hpMax;
        } else {
            this.hpMax = config.enemy[type].Maxhp;
            this.hp = this.hpMax;
        }

        this.buff = new Map();
    }

    draw() {
        const r = this.size / 2;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - r - 1, this.y - r - 1, this.size + 2, this.size + 2);

        ctx.beginPath()
        var perc = this.hp / this.hpMax;

        ctx.fillStyle = "red";
        ctx.fillRect(this.x - r, this.y - r + (1 - perc) * this.size, this.size, perc * this.size);

        if (selector.selected) {
            if (selector.enemyInst == this) {

                ctx.beginPath()
                ctx.lineWidth = 3;
                ctx.strokeStyle = 'black';
                ctx.strokeRect(this.x - r - 5, this.y - r - 5, this.size + 10, this.size + 10);

                ctx.beginPath()
                ctx.fillStyle = "black";
                ctx.fillText(`enemy`, 600, 100);
                ctx.fillText(`hp : ${this.hp.toFixed(0)}`, 600, 120);
                ctx.fillText(`hpMax : ${this.hpMax.toFixed(0)}`, 600, 140);
                ctx.fillText(`buff: [${Array.from(this.buff.keys()).join(' ')}]`, 600, 160);
            }
        }
    }

    engine() {
        if (selector.hitTest) {
            // check collision with mouse
            let dist = Math.hypot(this.x - selector.x_click, this.y - selector.y_click);
            if (dist < this.size + 3) {
                selector.enemySlet = this;
            }
        }

        // draw
        this.draw()

        //update state
        let ind, dist_x, dist_y, dist;

        if (Math.hypot(this.x_targ - this.x, this.y_targ - this.y) < this.radius) {
            ind = pathPoints[this.aimNode].next
            this.aimNode = ind;

            this.x_targ = pathPoints[ind].x + 2 * this.size * (Math.random() - 0.5);
            this.y_targ = pathPoints[ind].y + 2 * this.size * (Math.random() - 0.5);
            dist_x = this.x_targ - this.x;
            dist_y = this.y_targ - this.y;
            dist = Math.hypot(dist_x, dist_y);
            this.vx = this.speed * dist_x / dist
            this.vy = this.speed * dist_y / dist

            if (enemies.size < 100) {
                enemies.add(new Enemy(0,"basic",{
                    hpMax: this.hpMax
                }));
            }
        }
        this.x += this.vx;
        this.y += this.vy;

        // update life
        for (let blt of bullets.values()) {

            if (Math.hypot(this.x - blt.x, this.y - blt.y) < 0.8 * this.size) {
                this.hp -= blt.damage;
                blt.ability.forEach(ab=>{
                    const name = config.ability[ab].buff;
                    this.buff.set(name, config.buff[name].dur)
                }
                )
                particles.add(new Particle(blt,20));
                bullets.delete(blt);
            }
        }

        // buff effect                     .entries()
        for (const [key,value] of this.buff) {
            if (value > 0) {
                switch (key) {
                case "flame":
                    this.hp -= 2;
                    particles.add(new Particle(this,30,undefined, 'flame'));
                    this.buff.set(key, value - 1)
                    break;
                case "poison":
                    this.hp -= 1;
                    particles.add(new Particle(this,30,undefined, 'poison'));
                    this.buff.set(key, value - 1)
                    break;
                }
            }
            // console.log(`${key} ${value}`);
        }

        

        // 
        if (this.hp <= 0) {
            // let dx, dy;
            // dx = 2 * this.size * (Math.random() - 0.5);
            // dy = 2 * this.size * (Math.random() - 0.5);
            enemies.add(new Enemy(this.aimNode,'basic',{
                hpMax: this.hpMax + 1
            }));
            for (var i = 0; i < 15; i++) {
                particles.add(new Particle(this,80));
            }
            enemies.delete(this);
        }

    }
}
