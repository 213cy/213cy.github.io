// turrets 
// ["rifle", "machinegun", "shotgun", "grenadegun", "poisongun", "firegun"];
config.turret.rifle = {
    range: [100, 120, 150],
    fireRate: [16, 13, 10],
    price: [10, 5, 5],
    ability: ['trace'],

    bulletSpeed: [5, 6, 7],
    bulletDamage: [2, 3, 4],
    bulletAbility: [],

    color: "hsl(30 100% 50%)"
}
config.turret.machinegun = {
    range: [100, 120, 150],
    fireRate: [8, 6, 4],
    price: [10, 5, 5],
    ability: [],

    bulletSpeed: [5, 6, 7],
    bulletDamage: [1, 2, 3],
    bulletAbility: [],

    color: "hsl(180 100% 50%)"
}

config.turret.shotgun = {
    range: [100, 120, 150],
    fireRate: [28, 24, 20],
    price: [10, 5, 5],
    ability: [],

    bulletSpeed: [5, 6, 7],
    bulletDamage: [6, 7, 8],
    bulletAbility: [],

    color: "hsl(210 100% 50%)"

}

config.turret.grenadegun = {
    range: [100, 120, 150],
    fireRate: [43, 38, 33],
    price: [10, 5, 5],
    ability: ["cluster"],

    bulletSpeed: [5, 6, 7],
    bulletDamage: [6, 7, 8],
    bulletAbility: [],

    color: "hsl(240 100% 50%)"

}

config.turret.poisongun = {
    range: [100, 120, 150],
    fireRate: [62, 56, 50],
    price: [10, 5, 5],
    ability: [],

    bulletSpeed: [5, 6, 7],
    bulletDamage: [6, 7, 8],
    bulletAbility: ["venom"],

    color: "hsl(120 100% 50%)"

}

config.turret.firegun = {
    range: [100, 120, 150],
    fireRate: [84, 77, 70],
    price: [10, 5, 5],
    ability: [],

    bulletSpeed: [5, 6, 7],
    bulletDamage: [6, 7, 8],
    bulletAbility: ["spark"],

    color: "hsl(330 100% 50%)"

}

class Turret {
    size = 24;

    constructor(x, y, type='rifle') {
        this.type = type;
        this.level = 0;
        this.fire = 0;
        this.radius = this.size / 2;

        // this.x = Math.round((x+16) / 32) * 32-16;
        // this.y = Math.round((y+16) / 32) * 32-16;
        this.x = (x >> 5 << 5) + 16;
        this.y = (y >> 5 << 5) + 16;
        this.color = config.turret[type].color;

        this.fireRate = config.turret[type].fireRate[0];
        this.range = config.turret[type].range[0];
        this.ability = config.turret[type].ability;

        this.bulletDamage = config.turret[type].bulletDamage[0];
        this.bulletSpeed = config.turret[type].bulletSpeed[0];
        this.bulletAbility = config.turret[type]?.bulletAbility || [];
    }

    upgrades() {
        const type = this.type;
        const level = this.level + 1;
        this.level = level;
        this.fireRate = config.turret[type].fireRate[level];
        this.range = config.turret[type].range[level];

        this.bulletDamage = config.turret[type].bulletDamage[level];
        this.bulletSpeed = config.turret[type].bulletSpeed[level];
    }

    sell() {
        turrets.delete(this);
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();

        ctx.lineWidth = 3;
        let angle = 2 * Math.PI * this.fire / this.fireRate;

        ctx.strokeStyle = "yellow";
        ctx.arc(this.x, this.y, this.radius, 0, angle);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.arc(this.x, this.y, this.radius, angle, 2 * Math.PI)
        ctx.stroke();

        if (selector.selected) {
            if (selector.turretInst) {
                if (selector.turretInst == this) {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
                    ctx.strokeStyle = this.color;
                    ctx.stroke();

                    ctx.fillStyle = "black";
                    ctx.fillText(`type : ${this.type}`, 100, 100);
                    const lv = this.level;
                    const fig = config.turret[this.type];
                    ctx.fillText(`lv.${lv} => lv.${lv + 1}`, 100, 120);
                    ctx.fillText(`range : ${fig.range[lv]} -> ${fig.range[lv + 1]}`, 100, 140);
                    ctx.fillText(`ability: [${this.ability.join(' ')}]`, 100, 160);
                    ctx.fillText(this.level, this.x - 5, this.y);

                } else if (selector.all) {
                    if (this.type == selector.turretInst.type && this.level == selector.turretInst.level) {
                        ctx.beginPath();
                        ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
                        ctx.strokeStyle = this.color;
                        ctx.stroke();
                    }
                }

            }
        }

    }

    engine() {
        if (selector.selected) {
            if (selector.turretInst) {
                if (selector.sell) {
                    if (selector.turretInst == this) {
                        turrets.delete(this);
                        return;
                    } else if (selector.all) {
                        if (this.type == selector.turretInst.type && this.level == selector.turretInst.level) {
                            turrets.delete(this);
                            return;
                        }
                    }
                }
                if (selector.upgrade) {
                    if (selector.turretInst == this) {
                        // this.level++;
                        this.upgrades();
                    } else if (selector.all) {
                        if (this.type == selector.turretInst.type && this.level == selector.turretInst.level) {
                            // this.level++;
                            this.upgrades();
                        }
                    }
                }
            }
        }
        if (selector.hitTest) {
            // check collision with mouse
            var dist = Math.hypot(this.x - selector.x_click, this.y - selector.y_click);
            if (dist < this.radius) {
                selector.turretSlet = this;
            }
        }

        this.draw();

        if (this.fire < this.fireRate) {
            this.fire++;
        } else {
            loop: for (const enemy of enemies.values()) {
                var dist = Math.hypot(enemy.y - this.y, enemy.x - this.x);
                if (dist <= this.range) {
                    bullets.add(new Bullet(this,enemy,{
                        "distance": dist
                    }));
                    this.fire = 0;
                    if (!["shotgun", "poisongun"].includes(this.type)) {
                        break;
                    }
                }
            }

        }
    }
}
