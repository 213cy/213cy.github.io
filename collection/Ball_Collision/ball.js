class Ball {
    SPEED_MAX = 40;
    RADIUS = 40;
    graphScale = 5;

    constructor(hue) {
        this.hue = hue;
        this.radius = this.RADIUS;
        this.stage = {
            "elastic": 0.9
        };
        this.init();

    }

    init() {
        const r_circle = Math.pow(Math.random(), 1 / 2);
        const phi_circle = 2 * Math.PI * Math.random();
        const x = r_circle * Math.cos(phi_circle);
        const y = r_circle * Math.sin(phi_circle);
        this.cx = this.radius * x;
        this.cy = this.radius * y;

        this.speed = this.SPEED_MAX * Math.random();
        const c = 2 * Math.PI * Math.random();
        this.speedx = this.speed * Math.cos(c);
        this.speedy = this.speed * Math.sin(c);
    }

    getEnergy() {
        return this.speedx * this.speedx + this.speedy * this.speedy
    }
    collisionDetect(ball) {

        let t_a, t_b;
        let va, vb;
        // ======================
        const dist0 = this.radius + ball.radius;

        const dx = this.cx - ball.cx;
        const dy = this.cy - ball.cy;
        const dist = Math.hypot(dx, dy);

        if (dist < dist0) {
            const n1 = 5;
            const n2 = 10;
            const dx1 = dx - n1 * (this.speedx - ball.speedx);
            const dy1 = dy - n1 * (this.speedy - ball.speedy);
            const dx2 = dx - n2 * (this.speedx - ball.speedx);
            const dy2 = dy - n2 * (this.speedy - ball.speedy);

            const dist1 = Math.hypot(dx1, dy1);
            const dist2 = Math.hypot(dx2, dy2);
            const dt1 = dist1 - dist0;
            const dt2 = dist2 - dist1;

            t_a = n1 - (n2 - n1) / dt2 * dt1;
            // t_b = 1 - t_a;

            // ==========
            xa_c = this.cx - t_a * this.speedx;
            ya_c = this.cy - t_a * this.speedy;
            xb_c = ball.cx - t_a * ball.speedx;
            yb_c = ball.cy - t_a * ball.speedy;
            const dist_collide = Math.hypot(xa_c - xb_c, ya_c - yb_c);
            // console.log(Math.hypot(xa_c - xb_c, ya_c - yb_c))
            // ==========

            dx_c = xa_c - xb_c;
            dy_c = ya_c - yb_c;

            // ==========
            vna = this.speedx * dx_c + this.speedy * dy_c;
            vta = this.speedx * -dy_c + this.speedy * dx_c;
            vnb = ball.speedx * dx_c + ball.speedy * dy_c;
            vtb = ball.speedx * -dy_c + ball.speedy * dx_c;
            // ==========

            const c1 = (1 + this.stage.elastic) / 2;
            const c2 = (1 - this.stage.elastic) / 2;
            va = c1 * vnb + c2 * vna;
            vb = c1 * vna + c2 * vnb;

            // ==========
            const vxa = va * dx_c + vta * -dy_c;
            const vya = va * dy_c + vta * dx_c;
            const vxb = vb * dx_c + vtb * -dy_c;
            const vyb = vb * dy_c + vtb * dx_c;
            // ==========

            //====
            this.speedx = vxa / dist_collide / dist_collide;
            this.speedy = vya / dist_collide / dist_collide;
            ball.speedx = vxb / dist_collide / dist_collide;
            ball.speedy = vyb / dist_collide / dist_collide;

            this.cx = xa_c + t_a * this.speedx;
            this.cy = ya_c + t_a * this.speedy;
            ball.cx = xb_c + t_a * ball.speedx;
            ball.cy = yb_c + t_a * ball.speedy;
        }

    }

    draw(ctx, alpha=1) {
        let x = this.cx;
        let y = this.cy;
        let dx = this.speedx;
        let dy = this.speedy;
        let s = this.graphScale

        ctx.setLineDash([]);
        ctx.strokeStyle = `hsl(${this.hue} 100% 50% / ${alpha})`;

        ctx.beginPath();
        ctx.arc(x, y, this.radius, 0, 2 * Math.PI);
        ctx.stroke()

        // ctx.fillStyle = "red";
        // ctx.fill()

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + s * dx, y + s * dy);
        ctx.stroke()
        // ctx.strokeRect(x, y, w, h);

    }
}
