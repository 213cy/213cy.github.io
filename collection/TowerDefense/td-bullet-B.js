class BulletB {
    START_DIST = 1 / 2;

    type = "bulletB";
    attack = 0;
    decayRate = 0.95;
    radius = 3;
    alpha = 1;
    constructor(block, game) {
        this.game = game;
        this.blockSource = block;
        this.enemyTarget = block.cannonTarget;

        let len = this.game.blockLen;
        this.sizeScale = len;

        this.cx = block.cx + len * this.START_DIST * block.cannonDirection[0];
        this.cy = block.cy + len * this.START_DIST * block.cannonDirection[1];

    }
    update() {
            this.alpha *= this.decayRate;
            this.attack = this.alpha;
            const len = this.game.blockLen;
            const block = this.blockSource;
            this.cx = block.cx + len * this.START_DIST * block.cannonDirection[0];
            this.cy = block.cy + len * this.START_DIST * block.cannonDirection[1];
    }
    draw(c) {
        c.beginPath();
        c.moveTo(this.cx, this.cy);
        c.lineTo(this.enemyTarget.cx, this.enemyTarget.cy);
        c.lineWidth = 3;
        c.strokeStyle = `hsl(255 75% 55% / ${this.alpha})`;
        c.stroke();
        c.lineWidth = 1;
    }
}
