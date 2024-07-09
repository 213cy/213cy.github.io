class Selector {

    blockInd = 0;
    indexC = 0;
    indexR = 0;

    constructor(g) {
        this.stage = g;
        this.stage.canvas.addEventListener("mousemove", this.mouseMoveHandler.bind(this));
        // bind causes a fixed `this` context to be assigned to `onclick2`
        // this.onclick2 = this.onclick2.bind(this);
        // element.addEventListener("click", this.onclick2, false);
        this.stage.canvas.addEventListener("click", (e)=>{
            this.mouseClickHandler(e);
        }
        )

    }

    mouseClickHandler(e) {
        let b = this.stage.blockArray[this.blockInd];
        b.onClick();

    }
    mouseMoveHandler(e) {
        let offsetX = e.offsetX;
        let offsetY = e.offsetY;
        let len = this.stage.blockLen;
        if (offsetX % len != 0 && offsetY % len != 0) {
            this.indexC = Math.floor(offsetX / len);
            this.indexR = Math.floor(offsetY / len);
            this.blockInd = this.indexC + this.indexR * this.stage.Nc
        }

    }
    draw(ctx) {
        let len = this.stage.blockLen;
        let x = this.indexC * len
        let y = this.indexR * len

        ctx.save();
        ctx.beginPath();
        ctx.rect(x - 2, y - 2, len + 4, len + 4);
        ctx.lineWidth = 3;
        ctx.strokeStyle = "rgb(255 0 0 / 80%)";
        ctx.stroke();
        ctx.restore();

    }
}
