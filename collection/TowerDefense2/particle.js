class Particle {
    sizeMax = 5;
    constructor(source, life, isOutBound=false, type="death") {
        this.x = source.x;
        this.y = source.y;
        this.color = source.color;
        this.type = type;
        this.life = life;
        this.lifeMax = life;
        const name = source.constructor.name;
        var speed;
        if (name == "Bullet") {
            speed = 0.2;
            this.hue = this.color.split(/[ (]/)[1];
        } else {
            speed = 2 * Math.random();
        }
        this.srcType = source.constructor.name;

        if (isOutBound) {
            const {width, height} = canvas;
            const dist_x = width * Math.random() - this.x;
            const dist_y = height * Math.random() - this.y;
            const dist = Math.hypot(dist_x, dist_y);
            this.vx = speed * dist_x / dist
            this.vy = speed * dist_y / dist
        } else {
            const alpha = 710 * Math.random();
            // let r = speed * Math.random();
            this.vx = speed * Math.cos(alpha);
            this.vy = speed * Math.sin(alpha);
        }
    }

    draw() {
        const prcnt = this.life / this.lifeMax;
        if (this.srcType == "Bullet") {
            ctx.beginPath();
            ctx.arc(this.x, this.y, (1 - prcnt) * this.sizeMax, 0, 6.283);
            ctx.fillStyle = `hsl(${this.hue} 100% 50% / ${Math.sin(1.57 * prcnt)})`;
            // ctx.fillStyle = `hsl(from ${this.color} h s l / ${prcnt})`;
            ctx.fill()
        } else {
            if (this.type == "death") {
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x, this.y, prcnt * this.sizeMax, prcnt * this.sizeMax);
            } else if (this.type == "flame") {
                ctx.beginPath();
                ctx.arc(this.x, this.y - 12, prcnt * this.sizeMax / 3, 0, 6.283);
                if (this.life % 2 == 1) {
                    ctx.strokeStyle = "yellow";
                } else {
                    ctx.strokeStyle = "red";
                }
                ctx.stroke()

            } else if (this.type == "poison") {
                ctx.fillStyle = "lime";
                ctx.fillRect(this.x, this.y + 12, prcnt * this.sizeMax / 2, prcnt * this.sizeMax / 2);
            }
        }
    }

    engine() {
        this.draw()

        if (--this.life) {
            this.x += this.vx;
            this.y += this.vy;
        } else {
            particles.delete(this);
        }

    }
}
