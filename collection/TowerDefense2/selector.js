var selector = {
    x: 0,
    y: 0,
    
    x_click: 0,
    y_click: 0,
    clicked: false,
    hitTest: false,

    keys: new Set(),
    all: false,
    upgrade: false,
    sell: false,

    enemyInst: null,
    enemySlet: null,
    turretInst: null,
    turretSlet: null,
    turretType_id: 0,
    selected: true,
}

// ======================
// ======================

canvas.onclick = function(e) {
    selector.x_click = e.offsetX;
    selector.y_click = e.offsetY;
    selector.clicked = true;
}

canvas.onmousemove = function(e) {
    selector.x = e.offsetX;
    selector.y = e.offsetY;
}

document.onkeydown = function(e) {
    const ind = e.keyCode - '0'.charCodeAt(0);
    // if (isFinite(e.key))
    if (ind > 0 && ind < 10) {
        selector.turretType_id = ind - 1;
        selector.selected = true;
        canvas.classList.add("noCursor");
    } else {
        if (selector.keys.has(e.key)) {
            selector.keys.delete(e.key)
        } else {
            selector.keys.add(e.key);
        }
    }
}

canvas.oncontextmenu = function() {
    if (selector.turretInst) {
        selector.turretInst = null;
        selector.keys.clear();
    } else if (selector.enemyInst) {
        selector.enemyInst = null;
    } else {
        selector.selected = false;
        canvas.classList.remove("noCursor");

    }
    return false;
}

// ======================
// ======================

function selectorEngine() {
    const type_name = ["rifle", "machinegun", "shotgun", "grenadegun", "poisongun", "firegun"];

    if (selector.clicked) {
        selector.hitTest = true;
        selector.clicked = false;

        selector.turretSlet = null;
        selector.enemySlet = null;
    } else if (selector.hitTest) {
        selector.hitTest = false;

        if (selector.turretSlet) {
            selector.turretInst = selector.turretSlet;
            selector.turretType_id = type_name.indexOf(selector.turretInst.type);
            selector.selected = true;
            selector.keys.clear();
            canvas.classList.add("noCursor");
        } else if (selector.enemySlet) {
            selector.enemyInst = selector.enemySlet;
            selector.selected = true;
            canvas.classList.add("noCursor");
            // elector.turretInst = null;
        } else if (selector.selected) {

            if (selector.turretType_id < type_name.length) {
                turrets.add(new Turret(selector.x_click,selector.y_click,type_name[selector.turretType_id]));
            } else {
                src_dummy = {
                    x: selector.x_click,
                    y: selector.y_click,
                    ability: [],
                    bulletColor: "black",
                    bulletDamage: 2,
                    // bulletSpeed:0,
                    bulletAbility: []
                }
                for (var i = 0; i < 6.2832; i += 0.31415) {
                    bullets.add(new Bullet(src_dummy,null,{
                        velocity: {
                            vx: 10 * Math.sin(i),
                            vy: 10 * Math.cos(i)
                        }
                    }));
                }
            }

        }
    }
    
    // ======================

    if (selector.keys.has('a')) {
        selector.all = true;
    } else {
        selector.all = false;
    }

    if (selector.keys.has('u')) {
        selector.upgrade = true;
        selector.keys.delete('u')
    } else if (selector.upgrade) {
        selector.upgrade = false;
    }

    if (selector.keys.has('s')) {
        selector.sell = true;
        selector.keys.delete('s')
    } else if (selector.sell) {
        selector.sell = false;
    }

    // ======================
    
    if (selector.selected) {
        if (selector.turretType_id < type_name.length) {
            const template = config.turret[type_name[selector.turretType_id]];

            ctx.beginPath();
            ctx.arc(selector.x, selector.y, template.range[0], 0, Math.PI * 2, true);
            ctx.strokeStyle = "black";
            ctx.lineWidth = 5;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(selector.x, selector.y, 10, 0, Math.PI * 2, true);
            ctx.strokeStyle = "black";
            ctx.stroke();
            ctx.fillStyle = template.color;
            ctx.fill();
        } else {
            ctx.beginPath()
            ctx.arc(selector.x, selector.y, 10, 0, 6.3);
            ctx.fillStyle = "black";
            ctx.fill()
        }
    }

}
