var eleDraggableDiv = document.querySelectorAll(".dragColumn");
var eleDustbin = document.querySelector(".dustbin");

eleDraggableDiv.forEach(function(ele) {
    // ele.setAttribute('dragdiv', '');
    // const droppableBelow = elemBelow.closest('[dragdiv]');
    // ele.ondragstart = function() {
    //     return false;
    // }

    ele.onmousedown = function(event) {

        const dummyDiv = ele.cloneNode(true);
        ele.style.opacity = 0

        dummyDiv.style.position = 'fixed';
        const rect = ele.getBoundingClientRect()
        dummyDiv.style.top = rect.y - event.clientY + 'px';
        dummyDiv.style.left = rect.x - event.clientX + 'px';
        dummyDiv.style.transform = `translate(${event.clientX}px,${event.clientY}px)`
        // dummyDiv.style.zIndex = 999;

        document.body.append(dummyDiv);

        // dummyDiv.style.width = ele.offsetWidth+ 'px';
        // dummyDiv.style.height = ele.offsetHeight+ 'px';
        // dummyDiv.style.backgroundColor = '#fff';
        // dragbox.style.visibility = 'visible';  

        // // ele.classList.add(ele.className);
        // // dummyDiv.className = ele.className;
        // dummyDiv.setAttribute('class', ele.getAttribute('class'))

        // getComputedStyle(dummyDiv).position

        var eleOverlappedDiv = ele;

        function onMouseMove(event) {
            dummyDiv.style.transform = `translate(${event.clientX}px,${event.clientY}px)`;

            const eleBelowAll = document.elementsFromPoint(event.clientX, event.clientY);
            if (!eleBelowAll)
                // mousemove 事件可能会在窗口外被触发（当球被拖出屏幕时）
                // 如果 clientX/clientY 在窗口外，那么 elementfromPoint 会返回 null
                return;
            eleOverlappedDiv = eleBelowAll.filter(el=>el.className.split(' ').includes('dragColumn'))[1];

            if (eleOverlappedDiv) {
                const centerX = eleOverlappedDiv.getBoundingClientRect().left + (eleOverlappedDiv.clientWidth / 2)
                info.innerText = event.clientX + ' ' + eleOverlappedDiv?.title + ' ' + centerX;
                if (centerX < event.clientX) {
                    eleOverlappedDiv.after(ele);
                } else {
                    eleOverlappedDiv.before(ele);
                }
            }

        }

        function onMouseUp(event) {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);

            if (eleOverlappedDiv) {

                const rect = ele.getBoundingClientRect();
                const reset = dummyDiv.animate([{
                    top: '0px',
                    left: '0px',
                    transform: 'translate(' + rect.left + 'px,' + rect.top + 'px)'
                }], {
                    duration: 200,
                    easing: "ease-in-out",
                })

                reset.onfinish = function() {
                    ele.style.opacity = 1;
                    dummyDiv.remove()
                }

            } else {

                ele.hidden = true;
                const showColumnLink = document.createElement('a');
                showColumnLink.href = "#";
                showColumnLink.innerText = ele.title;
                showColumnLink.onclick = (e)=>{
                    // const ele = document.querySelector(`[title="${e.target.innerText}"] `)
                    ele.parentElement.prepend(ele);
                    ele.style.opacity = 1;
                    ele.hidden = false;
                    showColumnLink.remove();
                    // e.target.remove();
                }
                eleDustbin.append(showColumnLink);

                dummyDiv.remove();

            }

        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

    }

})
