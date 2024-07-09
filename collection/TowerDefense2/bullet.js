class Bullet {
    radius = 2.5;
    constructor(source, target, options) {
        this.source = source;
        this.target = target;

        this.x = source.x;
        this.y = source.y;
        this.color = source.color;

        this.damage = source.bulletDamage;
        this.speed = source.bulletSpeed;
        this.ability = source.bulletAbility;

        if (options.distance) {
            const speed = source.bulletSpeed;
            const dist = options.distance;
            this.vx = speed * (target.x - source.x) / dist;
            this.vy = speed * (target.y - source.y) / dist;
        } else {
            this.vx = options.velocity.vx;
            this.vy = options.velocity.vy;
        }

        this.buff = new Set();
        source.ability.forEach(name=>{
            const buff = config.ability[name].issue(source, target);
            if (buff) {
                this.buff.add(buff);
            }
        }
        )

    }

    engine() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color || "black";
        ctx.fill();

        for (const name of this.buff.values()) {
            // config.buff[name].effect(this)
            switch (name) {
            case "lock":
                if (this.target.hp > 0) {
                    const dist = Math.hypot(this.target.x - this.x, this.target.y - this.y);
                    this.vx = this.speed * (this.target.x - this.x) / dist;
                    this.vy = this.speed * (this.target.y - this.y) / dist;
                }
                break;
            case "split":
                for (var i = 0; i < 6.2832; i += 0.31415) {
                    var vx = this.speed * Math.sin(i);
                    var vy = this.speed * Math.cos(i);
                    bullets.add(new Bullet(this.source,null,{
                        velocity: {
                            vx,
                            vy
                        }
                    }));
                }
                bullets.delete(this);
                return
                break;
            }
        }

        this.x += this.vx;
        this.y += this.vy;


        
        let flag = 2;
        if (this.x < 0) {
            this.x = 0;
        } else if (this.x >= canvas.width) {
            this.x = canvas.width;
        } else {
            flag--
        }

        if (this.y < 0) {
            this.y = 0
        } else if (this.y >= canvas.height) {
            this.y = canvas.height
        } else {
            flag--
        }

        if (flag) {
            particles.add(new Particle(this,50,true));
            bullets.delete(this);
        }

    }

}
