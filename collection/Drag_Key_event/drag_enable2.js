// if (oAll[i].className === selector.replace(".", "")) {
// if (oAll[i].id === selector.replace("#", "")) {

var previewImage = new Image();
previewImage.src = "data:image/png;base64,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"

var eleDustbin = document.querySelector(".dustbin")
  , eleDragItems = document.querySelectorAll(".dragColumn")
  , eleTable = document.querySelector(".table")
var currentDragItem = null;
var offsetX = 0;

eleDragItems.forEach(function(el) {
    el.addEventListener('dragstart', function(ev) {
        // ev.dataTransfer.setData('text', '');
        ev.dataTransfer.effectAllowed = "move";
        // ev.dataTransfer.setData("text", ev.target.innerHTML);
        var fakeObj = this.cloneNode(true);
        ev.dataTransfer.setDragImage(fakeObj, 0, 0);
        // ev.dataTransfer.setDragImage(previewImage, 0, 0);
        offsetX = ev.offsetX;
        // this  == ev.target;
        // this.style.visibility='hidden';
        // getComputedStyle(temp1).boxSizing
        this.style.opacity = '0';
        currentDragItem = this;
    })
    el.addEventListener('dragend', function(ev) {
        currentDragItem = null;
    })

    el.ondragover = function(ev) {
        ev.preventDefault();
        if (!currentDragItem) {
            return
        }
        // var dragitem = ev.target.closest('.dragColumn');
        // var dragitem = ev.target;
        document.querySelector('.header').firstChild.data = ev.target.innerText;
        if (this != currentDragItem) {
            if (ev.offsetX > offsetX) {
                this.after(currentDragItem);
            } else {
                this.before(currentDragItem);
            }
            // this.style.visibility='visible';

        }
    }
})

eleDustbin.ondragover = function(ev) {
    ev.preventDefault();
}

eleDustbin.ondragenter = function(ev) {
    this.style.color = "#ffffff";
}
;
eleDustbin.ondrop = function(ev) {
    var link = document.createElement('a');
    link.innerText = 'asdf';
    link.href = '#';
    link.onclick = '';
    eleDustbin.append(link);
    currentDragItem.style.display = 'None';

    // eleRemind.innerHTML = '<strong>"' + eleDrag.innerHTML + '"</strong>被扔进了垃圾箱';

    this.style.color = "#000000";
}

// =============================

