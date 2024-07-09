class BulletC {
    SPEED = 1 / 20;
    START_DIST = 1 / 2;

    type = "bulletC";
    attack = 10;
    alpha = 1;
    explosion = false;
    decayRate = 0.98;
    radius = 3;
    constructor(block, game) {
        this.game = game;
        this.blockSource = block;
        this.enemyTarget = block.cannonTarget;

        let len = this.game.blockLen;
        this.sizeScale = len;
        this.radius = len / 5;
        this.effectRegion = len / 2;
        this.speed = len * this.SPEED;

        let[vx,vy] = block.cannonDirection;
        this.cx = block.cx + len * this.START_DIST * vx;
        this.cy = block.cy + len * this.START_DIST * vy;

    }
    update() {
        if (this.enemyTarget && !this.explosion) {
            const dx = this.enemyTarget.cx - this.cx;
            const dy = this.enemyTarget.cy - this.cy;
            const dist = Math.hypot(dx, dy);
            if (this.enemyTarget.radius < dist) {
                this.cx = this.cx + this.speed * dx / dist;
                this.cy = this.cy + this.speed * dy / dist;
            } else {
                this.explosion = true;
            }

        } else {
            this.game.bulletSet.delete(this);
        }

    }
    draw(c) {
        c.beginPath();
        c.arc(this.cx, this.cy, this.radius, 0, Math.PI * 2);
        c.fillStyle = "hsl(205 75% 55%)";
        c.fill()
    }
}
