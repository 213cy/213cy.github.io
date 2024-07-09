class Selector {

    blockInd = 0;
    indexC = 0;
    indexR = 0;

    constructor(g) {
        this.game = g;
        this.game.map.addEventListener("mousemove", this.mouseMoveHandler.bind(this));
        // bind causes a fixed `this` context to be assigned to `onclick2`
        // this.onclick2 = this.onclick2.bind(this);
        // element.addEventListener("click", this.onclick2, false);
        this.game.map.addEventListener("click", (e)=>{
            this.mouseClickHandler(e);
        }
        )

    }

    mouseClickHandler(e) {
        let b = this.game.blockArray[this.blockInd];
        b.onClick();

    }
    mouseMoveHandler(e) {
        let offsetX = e.offsetX;
        let offsetY = e.offsetY;
        let len = this.game.blockLen;
        if (offsetX % len != 0 && offsetY % len != 0) {
            this.indexC = Math.floor(offsetX / len);
            this.indexR = Math.floor(offsetY / len);
            this.blockInd = this.indexC + this.indexR * this.game.Nc
        }

    }
    draw() {
        let c = this.game.ctx;
        let len = this.game.blockLen;
        let x = this.indexC * len
        let y = this.indexR * len

        c.save();
        c.beginPath();
        c.rect(x - 2, y - 2, len + 4, len + 4);
        c.lineWidth = 3;
        c.strokeStyle = "rgb(255 0 0 / 80%)";
        c.stroke();
        c.restore();

    }
}
