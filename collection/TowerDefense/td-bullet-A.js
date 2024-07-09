class BulletA {
    SPEED = 1 / 10;
    SHAKE_RADIUS = 1 / 100;
    START_DIST = 1 / 2;

    type = "bulletA";
    attack = 0;
    decayRate = 0.98;
    radius = 3;
    constructor(block, game) {
        this.game = game;
        this.blockSource = block;

        let len = this.game.blockLen;
        this.sizeScale = len;

        this.speed = len / 10;
        let[vx,vy] = block.cannonDirection;
        const alpha = 2 * Math.PI * Math.random();
        this.speedx = len * (this.SPEED * vx + this.SHAKE_RADIUS * Math.cos(alpha));
        this.speedy = len * (this.SPEED * vy + this.SHAKE_RADIUS * Math.sin(alpha));

        this.cx = block.cx + len * this.START_DIST * vx;
        this.cy = block.cy + len * this.START_DIST * vy;
        this.alpha = 1;
    }
    update() {
        this.alpha *= this.decayRate;
        if (this.alpha < 0.4) {
            this.game.bulletSet.delete(this);
        } else {
            this.attack = 2 * this.alpha;
            this.cx = this.cx + this.speedx;
            this.cy = this.cy + this.speedy;
        }

    }
    draw() {
        let c = this.game.ctx;
        let r = this.radius;
        let x = this.cx;
        let y = this.cy;

        let i = 0;
        do {
            c.beginPath();
            c.arc(x - i / 2 * this.speedx, y - i / 2 * this.speedy, Math.pow(0.95, i) * r, 0, Math.PI * 2);
            c.fillStyle = `hsl(50 75% 55% / ${Math.pow(0.75, i) * this.alpha})`;
            c.fill();
            i++;
        } while (i < 5);

    }
}
