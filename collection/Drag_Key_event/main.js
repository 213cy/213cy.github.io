propertyList = ['isTrusted', 'altKey', 'bubbles', 'cancelBubble', 'cancelable', 'charCode', //
'code', 'composed', 'ctrlKey', 'defaultPrevented', 'detail', 'eventPhase', 'isComposing', 'key', //
'keyCode', 'location', 'metaKey', 'repeat', 'returnValue', 'shiftKey', 'timeStamp', 'type', 'which']

const mainTable = document.querySelector('.table')

const entriesGroup = Object.fromEntries(propertyList.map(v=>addElement(v)));

function addElement(name) {
    // create a new div element
    const newDiv = document.createElement("div");
    newDiv.classList.add('dragColumn');
    newDiv.title = name;
    const newUl = document.createElement("ul");
    const newLi = document.createElement("li");
    newLi.innerText = name;
    newUl.append(newLi);
    newDiv.append(newUl);

    mainTable.append(newDiv);

    return [name, newLi];
}

// =============================
// document.addEventListener('keyup', (e)=>{
//     e;
// })

var ev;
document.addEventListener('keydown', (e)=>{
    propertyList.forEach(v=>{
        const newLi = document.createElement("li");
        newLi.innerText = e[v];
        entriesGroup[v].after(newLi)
    }
    )

}
)
