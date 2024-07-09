class Block {
    COOLDOWN = {
        "towerA": 4,
        "towerB": 8,
        "towerC": 30,
    };

    acquireRange = 0;

    cannonTarget = null;
    cannonDirection = [1, 0];
    // connanType = 0;

    type = 'empty';
    nextBlock = null;
    adjacentBlocks = [];
    containEnemy = new Set();

    renderMethod = {
        'destination': function(c, x, y, len, obj) {
            c.beginPath();
            c.rect(x - len / 2 + 4, y - len / 2 + 4, len - 8, len - 8);
            c.strokeStyle = "green";
            c.stroke();
            switch (obj.game.defaultBlockType) {
            case 'towerA':
                c.beginPath();
                c.fillStyle = "hsl(50 75% 55%)";
                c.fillRect(x - len / 6, y - len / 8, len / 3, len / 4);
                break;
            case 'towerB':
                c.beginPath();
                c.fillStyle = "hsl(255 75% 55%)";
                c.fillRect(x - len / 4, y - len / 10, len / 2, len / 5);
                break;
            case 'towerC':
                c.beginPath();
                c.arc(x, y, len / 5, 0, Math.PI * 2);
                c.fillStyle = "hsl(205 75% 55%)";
                c.fill()
                break;
            }

        },

        'origin': function(c, x, y, len, obj) {
            c.beginPath();
            c.arc(x, y, len / 2 - 2, 0, 2 * Math.PI);
            c.strokeStyle = "green";
            c.stroke();
        },

        'towerA': function(c, x, y, len, obj) {
            let[s,e] = obj.cannonLimit;
            let[vx,vy] = obj.cannonDirection;
            c.beginPath();
            c.moveTo(x + s * vx, y + s * vy);
            c.lineTo(x + e * vx, y + e * vy);
            c.lineWidth = 3;
            c.strokeStyle = "black";
            c.stroke();
            c.lineWidth = 1;

        },
        'towerB': function(c, x, y, len, obj) {
            let[s,e] = obj.cannonLimit;
            let[vx,vy] = obj.cannonDirection;
            c.beginPath();
            c.moveTo(x + s * vx, y + s * vy);
            c.lineTo(x + e * vx, y + e * vy);
            c.lineWidth = 3;
            c.strokeStyle = "black";
            c.stroke();
            c.lineWidth = 1;

        },
        'towerC': function(c, x, y, len, obj) {
            let[s,e] = obj.cannonLimit;
            let[vx,vy] = obj.cannonDirection;
            c.beginPath();
            c.moveTo(x + s * vx, y + s * vy);
            c.lineTo(x + e * vx, y + e * vy);
            c.lineWidth = 3;
            c.strokeStyle = "black";
            c.stroke();
            c.lineWidth = 1;

        },

        'guidepost': function(c, x, y, len, obj) {
            c.beginPath();
            c.moveTo(x, y);
            c.lineTo(obj.nextBlock.cx, obj.nextBlock.cy);
            c.lineWidth = 1;
            c.strokeStyle = "yellow";
            c.stroke();
        },

        'empty': function(c, x, y, len, obj) {
            c.fillStyle = "rgb(0 0 0 / 50%)";
            c.lineWidth = 1;
            c.fillText(obj.name, x, y);
        }
    };
    // ============================================
    constructor(x, y, ind, g) {
        this.game = g
        this.name = ind.toString();

        this.cx = x;
        this.cy = y;

        let len = this.game.blockLen;
        this.sizeScale = len;
        this.acquireRange = 4 * len;

        this.cannonLimit = [5, len / 2 - 2];
        this.cannonCD = 0;

    }

    onClick() {
        switch (true) {

        case this.type.startsWith('tower'):
            this.type = "empty";
            this.game.updateBlockLink();
            break;

        case this.type == "empty":
            this.type = this.game.defaultBlockType;
            // this.acquireRange = this.sizeScale * 4 ;
            this.game.updateBlockLink();
            break;

        case this.type == 'origin':
            this.game.createEnemy(this);
            break;

        case this.type == 'destination':
            const obj = {
                "towerA": "towerB",
                "towerB": "towerC",
                "towerC": "towerA",
            }
            this.game.defaultBlockType = obj[this.game.defaultBlockType];
            break;

        case 'guidepost':
            break;

        default:
            break;

        }
    }

    update() {
        if (this.type.startsWith("tower")) {
            if (this.cannonTarget) {
                this.cannonCD--;
                if (this.cannonCD < 0) {
                    this.game.createBullet(this);
                    this.cannonCD = this.COOLDOWN[this.type];
                }
            }
        }
    }

    draw() {
        let c = this.game.ctx;
        let len = this.game.blockLen;
        let x = this.cx
        let y = this.cy
        this.renderMethod[this.type](c, x, y, len, this);
        if (this.type == "empty" || this.type == "origin") {
            this.renderMethod['guidepost'](c, x, y, len, this);
        }

    }
}
