var eleDustbin = document.querySelector(".dustbin")
var eleDragItems = document.querySelectorAll(".dragColumn")
var currentDragItem = null;
var currentOverItem = null;

const slotWidth = eleDragItems[0].getBoundingClientRect().width;
const backupColor = getComputedStyle(eleDragItems[0]).backgroundColor;
const slotHolder = eleDragItems[0].cloneNode(true);
slotHolder.innerText = '';

eleDragItems.forEach(function(el) {
    el.setAttribute('draggable', 'true')

    el.addEventListener('dragstart', function(ev) {

        ev.dataTransfer.effectAllowed = "move";
        // this  == ev.target;
        ev.target.style.opacity = .7;
        this.style.backgroundColor = 'burlywood';
        currentDragItem = this;
    })
    el.addEventListener('dragend', function(ev) {
        // this.style.backgroundColor = backupColor;
        this.style.backgroundColor = '';
        ev.target.style.opacity = '';
        currentDragItem = null;
        console.log(currentDragItem == currentOverItem)
    })

    el.ondragover = function(ev) {
        ev.preventDefault();

        currentOverItem = ev.target.closest('.dragColumn');
        document.querySelector('.header').firstElementChild.textContent = currentOverItem.title;

        item_offsetX = ev.clientX - currentOverItem.getBoundingClientRect().x;
        if (item_offsetX < slotWidth / 2) {
            currentOverItem.before(currentDragItem)
        } else {
            currentOverItem.after(currentDragItem)
        }

    }
})

eleDustbin.ondragover = function(ev) {
    ev.preventDefault();
}

eleDustbin.ondragenter = function(ev) {// this.style.backgroundColor = "#ffffff";
}

eleDustbin.ondrop = function(ev) {
    currentDragItem.hidden = true;

    var link = document.createElement('a');
    link.innerText = currentDragItem.title;
    link.href = '#';
    link.onclick = (e)=>{
        const ele = document.querySelector(`[title="${e.target.innerText}"] `)
        ele.parentElement.prepend(ele);
        ele.hidden = false;
        link.remove();
        e.target.remove();
    }

    eleDustbin.append(link);

    // this.style.backgroundColor = "#000000";
}

// =============================
