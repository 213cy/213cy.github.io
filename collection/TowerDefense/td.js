class Game {

    map = document.createElement('canvas');
    btn = document.createElement('button');
    BulletClass = {
        "towerA": BulletA,
        "towerB": BulletB,
        "towerC": BulletC,
    };

    constructor(r, c, len, destIndex=60, origIndex=20) {
        this.blockLen = len
        this.Nr = r;
        this.Nc = c;

        this.defaultBlockType = 'towerA'
        this.blockArray = new Array(r * c);
        this.initBlockArray(origIndex, destIndex);
        this.bulletSet = new Set();
        this.enemyArray = [];
        this.enumStartPointer = 0;
        this.effectSet = new Set();
        this.selector = new Selector(this);

        this.map.id = "myCanvas";
        this.map.style.backgroundColor = "#eee"
        // window.innerHeight ...= 450
        this.map.width = this.Nc * this.blockLen;
        this.map.height = this.Nr * this.blockLen;

        this.ctx = this.map.getContext("2d");
        this.ctx.font = "12px Courier New";
        this.ctx.textBaseline = "middle";
        this.ctx.textAlign = "center";

        this.btn.id = "runButton";
        this.btn.innerText = "reload";
        this.btn.onclick = ()=>document.location.reload();

        document.body.style.textAlign = "center"
        document.body.innerText = '';
        document.body.append(this.map);
        document.body.append(this.btn);

        this.draw_bind = this.draw.bind(this);
        this.update_bind = this.update.bind(this);

    }

    initBlockArray(origIndex, destIndex) {
        for (let i = 0; i < this.Nr; i++) {
            for (let j = 0; j < this.Nc; j++) {
                let ind = i * this.Nc + j;
                const x = j * this.blockLen + this.blockLen / 2;
                const y = i * this.blockLen + this.blockLen / 2;
                this.blockArray[ind] = new Block(x,y,ind,this);
                const arr = [];
                if (j > 0) {
                    arr.push(ind - 1);
                }
                if (i > 0) {
                    arr.push(ind - this.Nc);
                }
                if (j < this.Nc - 1) {
                    arr.push(ind + 1);
                }
                if (i < this.Nr - 1) {
                    arr.push(ind + this.Nc);
                }
                this.blockArray[ind]._adjacentBlockIndice = arr;
            }
        }

        this.blockArray[destIndex].type = 'destination'
        this.destinationBlock = this.blockArray[destIndex];
        this.blockArray[origIndex].type = 'origin'
        this.originBlock = this.blockArray[origIndex];

        this.blockArray.forEach(block=>{
            block.adjacentBlocks = block._adjacentBlockIndice.map(index=>this.blockArray[index]);
        }
        )
        this.updateBlockLink();
    }

    updateBlockLink() {
        this.blockArray.forEach(block=>{
            if (['empty', 'origin'].includes(block.type)) {
                block.gotNext = false;
            } else {
                block.gotNext = true;
            }
        }
        )

        let b = [this.destinationBlock];
        let c;
        while (b.length > 0) {

            c = b.map(blk=>{
                return blk.adjacentBlocks.filter(block=>{
                    if (block.gotNext == false) {
                        block.nextBlock = blk;
                        block.gotNext = true;
                        return true;
                    } else {
                        return false;
                    }
                }
                )
            }
            )
            b = c.flat().sort(()=>Math.random() - 0.5)
        }
    }

    updateBlockTarget() {
        const b = this.blockArray.filter(block=>block.type.startsWith('tower'));
        let dx, dy, dist;
        for (let block of b) {
            if (block.cannonTarget) {
                if (block.cannonTarget.life > 0) {
                    dx = block.cannonTarget.cx - block.cx;
                    dy = block.cannonTarget.cy - block.cy;
                    dist = Math.hypot(dx, dy);
                    if (dist < block.acquireRange) {
                        block.cannonDirection = [dx / dist, dy / dist];
                        continue;
                    } else {
                        block.cannonTarget = null;
                    }
                } else {
                    const start = this.enemyArray.indexOf(block.cannonTarget);
                    if (start > -1) {
                        this.enemyArray.splice(start, 1);
                        this.createEnemy(this.originBlock);
                    }
                    block.cannonTarget = null;
                }
            }

            const N = this.enemyArray.length;
            const ind = Math.min(N, this.enumStartPointer);
            for (let index = 0; index < N; index++) {
                const enemy = this.enemyArray[(ind + index) % N];

                dx = enemy.cx - block.cx;
                dy = enemy.cy - block.cy;
                dist = Math.hypot(dx, dy);
                if (dist < block.acquireRange) {
                    this.enumStartPointer = (ind + index + 1) % N;
                    block.cannonTarget = enemy;
                    block.cannonDirection = [dx / dist, dy / dist];
                    break;
                }
            }
        }
    }

    updateBulletCollide() {
        this.bulletSet.forEach(bullet=>{
            switch (bullet.type) {
            case "bulletA":
                const len = this.blockLen;
                const c = Math.floor(bullet.cx / len);
                const r = Math.floor(bullet.cy / len);
                if (c < 0 || c >= this.Nc || r < 0 || r >= this.Nr) {
                    this.bulletSet.delete(this);
                    return;
                }
                const block = this.blockArray[c + r * this.Nc];

                const enemies = block.adjacentBlocks.reduce((res,ele)=>[...res, ...ele.containEnemy], [...block.containEnemy])

                for (let enemy of enemies) {
                    if (Math.hypot(bullet.cx - enemy.cx, bullet.cy - enemy.cy) < enemy.radius) {
                        this.bulletSet.delete(bullet);
                        this.effectSet.add(new Effect(bullet,this))
                        enemy.onHit(bullet);
                        return;
                    }
                }

                break;
            case "bulletB":
                // if (this.enemyTarget &&  this.enemyTarget == this.blockSource.cannonTarget) {
                if (bullet.blockSource.type == "towerB" && bullet.alpha > Math.pow(bullet.decayRate, 10)) {
                    bullet.enemyTarget.onHit(bullet)
                } else {
                    this.bulletSet.delete(bullet);
                }
                break;
            case "bulletC":
                if (bullet.explosion) {
                    for (let enemy of this.enemyArray) {
                        if (Math.hypot(bullet.cx - enemy.cx, bullet.cy - enemy.cy) < bullet.effectRegion) {

                            enemy.onHit(bullet);
                        }
                    }
                    this.bulletSet.delete(bullet);
                    this.effectSet.add(new Effect(bullet,this))

                }
                break;

            }

        }
        )
    }
    // ==========================

    createEnemy(block) {
        this.enemyArray.push(new Enemy(block,this))
    }

    createBullet(block) {
        this.bulletSet.add(new this.BulletClass[block.type](block,this));
    }
    // ==========================

    drawBack() {
        let c = this.ctx;
        c.clearRect(0, 0, this.map.width, this.map.height);

        c.beginPath();

        for (let i = 0; i < this.Nc; i++) {
            c.moveTo(i * this.blockLen, 0)
            c.lineTo(i * this.blockLen, this.map.height)
        }
        for (let i = 0; i < this.Nr; i++) {
            c.moveTo(0, i * this.blockLen)
            c.lineTo(this.map.width, i * this.blockLen)
        }
        c.lineWidth = 1;
        c.strokeStyle = "green";
        c.stroke()
    }
    draw() {
        this.drawBack();

        this.blockArray.forEach((b)=>b.draw(this.ctx));
        this.bulletSet.forEach((b)=>b.draw(this.ctx));
        this.enemyArray.forEach((b)=>b.draw(this.ctx));
        this.effectSet.forEach((b)=>b.draw(this.ctx));
        this.selector.draw(this.ctx);

        requestAnimationFrame(this.draw_bind);
        // requestAnimationFrame(()=>this.draw());
        // requestAnimationFrame(this.gameLoop.bind(this));
    }
    update() {
        this.updateBlockTarget();
        this.updateBulletCollide();
        this.blockArray.forEach((b)=>b.update());
        this.bulletSet.forEach((b)=>b.update());
        this.enemyArray.forEach((b)=>b.update());
        this.effectSet.forEach((b)=>b.update());

        setTimeout(this.update_bind, 1000 / 25)
    }
    gameLoop() {
        this.draw();
        this.update();
    }
}

// ============================================================

function gamePlay() {
    game = new Game(r = 9,c = 9,50);
    // game = new Game(r = 10,c = 15,45);
    // game.init();
    game.gameLoop();
}

window.addEventListener("DOMContentLoaded", gamePlay, false);
// gamePlay()
