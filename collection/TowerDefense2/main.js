var enemies = new Set();
var turrets = new Set();
var bullets = new Set();
var particles = new Set();

var FPS = 30;
// var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
// ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.font = "16px monospace";

// =====================================
// =====================================

function drawMap() {
    ctx.fillStyle = "green";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    let bound = pathPoints.length;
    ctx.moveTo(pathPoints[bound - 1].x, pathPoints[bound - 1].y);
    for (let index = 0; index < bound; index++) {
        ctx.lineTo(pathPoints[index].x, pathPoints[index].y);
    }
    ctx.lineTo(pathPoints[0].x, pathPoints[0].y);

    ctx.strokeStyle = "darkgreen";
    ctx.lineWidth = 20;
    // ctx.lineCap = "square";    
    ctx.stroke();
}

function engine(t) {

    drawMap();

    for (let enemy of enemies.values()) {
        enemy.engine();
    }

    for (let bullet of bullets.values()) {
        bullet.engine();

    }


    turrets.forEach(p=>p.engine())

    particles.forEach(p=>p.engine())

    selectorEngine()

    // requestAnimationFrame(engine)
    setTimeout(engine, 1000 / FPS);
}
engine();

// ["rifle", "machinegun", "shotgun", "grenadegun", "poisongun", "firegun"];

turrets.add(new Turret(100,250));
turrets.add(new Turret(200,100));
turrets.add(new Turret(300,100));
turrets.add(new Turret(400,100));

turrets.add(new Turret(200,250,"machinegun"));
turrets.add(new Turret(300,250,"shotgun"));

turrets.add(new Turret(600,250,"grenadegun"));
turrets.add(new Turret(700,250,"poisongun"));
turrets.add(new Turret(780,250,"firegun"));

enemies.add(new Enemy())
