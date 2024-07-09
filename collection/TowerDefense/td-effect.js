class Effect {
    LIFE_MAX = 500;
    SPEED = 1 / 50;
    RADIUS = 1 / 6;

    type = 'effect';
    step = 1;
    alpha = 1;
    constructor(bullet, g) {
        this.game = g;
        this.bullet = bullet;

        this.cx = bullet.cx;
        this.cy = bullet.cy;

        let len = this.game.blockLen;
        this.sizeScale = len;

        switch (bullet.type) {
        case "bulletA":
            this.radius = 0;
            this.Nstep = 5;

            break;
        case "bulletC":
            this.radius = bullet.radius;
            this.Nstep = 10;
            break;
        }

    }

    update() {
        this.radius += this.step;
        this.alpha -= 0.5 / this.Nstep;
        if (this.alpha < 0.5) {
            this.game.effectSet.delete(this);
        }
    }

    draw(c) {
        c.beginPath();
        c.arc(this.cx, this.cy, this.radius, 0, 2 * Math.PI);
        switch (this.bullet.type) {
        case "bulletA":
            c.fillStyle = `hsl(25 25% 25% / ${this.alpha})`;
            c.fill()
            break;
        case "bulletC":
            c.lineWidth = 5;
            c.strokeStyle = `hsl(25 25% 25% / ${this.alpha})`;
            c.stroke()
            c.lineWidth = 1;
            break;
        }

    }
}
