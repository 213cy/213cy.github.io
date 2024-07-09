class Enemy {
    LIFE_MAX = 500;
    SPEED = 1 / 50;
    RADIUS = 1 / 6;

    type = 'enemy';
    life = 100;

    constructor(block, g) {
        this.game = g;

        let len = this.game.blockLen;
        this.sizeScale = len;
        this.radius = len * this.RADIUS;
        this.speed = len * this.SPEED;

        this.cx = block.cx;
        this.cy = block.cy;

        this.fromBlock = block;
        this.fromBlock.containEnemy.add(this);
        this.toBlock = block.nextBlock;
        const dx = block.nextBlock.cx - this.cx;
        const dy = block.nextBlock.cy - this.cy;
        this.distanceLeft = Math.hypot(dx, dy)
        const c = this.speed / this.distanceLeft;
        this.speedx = c * dx;
        this.speedy = c * dy;

        this.life = this.LIFE_MAX;

    }

    newDestination(newBlock, alreadyPassed=0) {
        const block = newBlock;
        this.fromBlock = block;
        this.toBlock = block.nextBlock;
        const dx = block.nextBlock.cx - block.cx;
        const dy = block.nextBlock.cy - block.cy;
        const dist = Math.hypot(dx, dy)
        let c = this.speed / dist;
        this.speedx = c * dx;
        this.speedy = c * dy;
        c = alreadyPassed / dist;
        this.cx = block.cx + c * dx;
        this.cy = block.cy + c * dy;
        this.distanceLeft = dist - alreadyPassed;

    }

    onHit(bullet) {
        this.life = this.life - bullet.attack;

    }

    update() {
        // if (this.life < 0) {
        //     this.life = this.LIFE_MAX;
        //     this.newDestination(this.game.originBlock)
        // }
        const dLeft = this.distanceLeft - this.speed;
        const d = this.sizeScale / 2;

        if (dLeft <= d && this.distanceLeft > d) {
            this.fromBlock.containEnemy.delete(this);
            this.toBlock.containEnemy.add(this);
        }

        if (dLeft > 0) {
            this.cx += this.speedx;
            this.cy += this.speedy;
            this.distanceLeft = dLeft;
        } else {
            let block = this.toBlock;
            if (block.type == "destination") {
                block = this.game.originBlock;
                this.life = this.LIFE_MAX;
            }
            this.newDestination(block, -dLeft);
        }
    }

    draw(c) {
        let x = this.cx
        let y = this.cy

        c.beginPath();
        c.arc(x, y, this.radius, 0, 2 * Math.PI);
        c.strokeStyle = "green";
        c.stroke();
        c.beginPath();
        // for rough estimate
        const theta = Math.asin(2 * this.life / this.LIFE_MAX - 1);
        c.arc(x, y, this.radius, -theta, Math.PI + theta);
        c.fillStyle = "red";
        c.fill()
    }
}
