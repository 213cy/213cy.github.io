class Ball {
    SPEED_MAX = 1 / 10;
    RADIUS = 1 / 10;

    constructor(block, g) {
        this.stage = g;
        this.cx = block.cx;
        this.cy = block.cy;

        let len = this.stage.blockLen;
        this.sizeScale = len;
        this.radius = len * this.RADIUS;
        this.speed = len * this.SPEED_MAX * Math.random();

        const c = 2 * Math.PI * Math.random();
        this.speedx = this.speed * Math.cos(c);
        this.speedy = this.speed * Math.sin(c);

        // this.elastic = 0.9;

        this.currentBlock = block;
        this.currentBlock.containBall.add(this);

    }

    collisionDetect(ball) {
        // ======================
        const dist0 = this.radius + ball.radius;

        const dx = this.cx - ball.cx;
        const dy = this.cy - ball.cy;
        const dist = Math.hypot(dx, dy);

        if (dist < dist0) {
            // console.log(Math.hypot(this.cx - ball.cx, this.cy - ball.cy));

            const vx = this.speedx + ball.speedx;
            const vy = this.speedy + ball.speedy;
            this.speedx = vx / 2;
            this.speedy = vy / 2;
            ball.speedx = vx / 2;
            ball.speedy = vy / 2;

            const c0 = 2*(dist0 - dist) / 2;
            const dCube = Math.pow(dist, 1.0);
            // const dCube = Math.pow(dist, 0.9);
            const vdx = c0 * dx / dCube;
            const vdy = c0 * dy / dCube;

            this.speedx = this.speedx + vdx;
            this.speedy = this.speedy + vdy;
            ball.speedx = ball.speedx - vdx;
            ball.speedy = ball.speedy - vdy;

        } else {
            const dCube = Math.pow(dist, 3)
            const vdx = this.stage.gravity * dx / dCube;
            const vdy = this.stage.gravity * dy / dCube;
            ball.speedx = ball.speedx + vdx;
            ball.speedy = ball.speedy + vdy;

            this.speedx = this.speedx - vdx;
            this.speedy = this.speedy - vdy;
        }

    }

    collisionDetect_2(ball) {
        var xa_c, xb_c;
        var ya_c, yb_c;
        var dx_c, dy_c;
        var vta, vna, vtb, vnb;

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

            if (t_a < 0 || t_a >= 1) {
                // console.log(t_a)
                const c0 = (dist0 - dist) / 2 / dist
                this.cx = this.cx + c0 * dx;
                this.cy = this.cy + c0 * dy;
                ball.cx = ball.cx - c0 * dx;
                ball.cy = ball.cy - c0 * dy;
                // console.log(Math.hypot(this.cx - ball.cx, this.cy - ball.cy));

                const vx = this.speedx + ball.speedx;
                const vy = this.speedy + ball.speedy;
                this.speedx = vx / 2;
                this.speedy = vy / 2;
                ball.speedx = vx / 2;
                ball.speedy = vy / 2;

                return;
            }

            // ==========
            xa_c = this.cx - t_a * this.speedx;
            ya_c = this.cy - t_a * this.speedy;
            xb_c = ball.cx - t_a * ball.speedx;
            yb_c = ball.cy - t_a * ball.speedy;
            // dist_collide == Math.hypot(xa_c - xb_c, ya_c - yb_c);
            const dist_collide = Math.hypot(xa_c - xb_c, ya_c - yb_c);
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


        } else {
            const dCube = Math.pow(dist, 3)
            const vdx = this.stage.gravity * dx / dCube;
            const vdy = this.stage.gravity * dy / dCube;
            ball.speedx = ball.speedx + vdx;
            ball.speedy = ball.speedy + vdy;

            this.speedx = this.speedx - vdx;
            this.speedy = this.speedy - vdy;
        }

    }

    update() {
        const x = this.cx + this.speedx;
        const y = this.cy + this.speedy;
        const r = this.radius;
        const w = this.stage.canvas.width;
        const h = this.stage.canvas.height;

        this.cx = x;
        this.cy = y;

        if ((x - r) <= 0) {
            this.cx = 2 * r - x;
            this.speedx = -this.speedx;
        }
        if ((y - r) <= 0) {
            this.cy = 2 * r - y;
            this.speedy = -this.speedy;
            // this.speedy = Math.abs(this.speedy);
        }
        if ((x + r) >= w) {
            this.cx = 2 * w - 2 * r - x;
            this.speedx = -this.speedx;
        }
        if ((y + r) >= h) {
            this.cy = 2 * h - 2 * r - y;
            this.speedy = -this.speedy;
        }

        let len = this.stage.blockLen;
        const col = Math.floor(this.cx / len);
        const row = Math.floor(this.cy / len);

        const block = this.stage.blockArray[col + row * this.stage.Nc]
        if (block != this.currentBlock) {
            this.currentBlock.containBall.delete(this);
            this.currentBlock = block;
            block.containBall.add(this);
        }

    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.cx, this.cy, this.radius, 0, 2 * Math.PI);
        ctx.strokeStyle = "green";
        ctx.stroke()
        ctx.fillStyle = "red";
        ctx.fill()
    }
}
