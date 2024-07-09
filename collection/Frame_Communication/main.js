const channel = new BroadcastChannel('message');

function displayMessage(parent, val) {
    const ele = document.createElement('div');
    ele.textContent = val;
    parent.append(ele);
}

if (top == self) {
    channel.onmessage = (e)=>{
        if (e.data.startsWith('\0')) {
            channel.postMessage(message_top.value)
        }
        // document.querySelector("iframe")
        // e.data == iframe_child.contentWindow.document.getElementById("message").value;
        displayMessage(iframe_top, e.data);
    }

    // document.querySelector("trans")
    trans.onclick = function() {
        channel.postMessage('\0' + message_top.value)
    }

} else {

    channel.onmessage = (e)=>{
        if (e.data.startsWith('\0')) {
            channel.postMessage(message_child.value)
        }
        // e.data == parent.document.getElementById("message_top").value;
        displayMessage(iframe_child, e.data);
    }

    // document.querySelector("trans")
    trans.onclick = function() {
        channel.postMessage('\0' + message_child.value)
    }

}

// ===============================

// window.frames
frames
// window.window
window == this
// window.globalThis
globalThis == this
// window.top
top == this
// window.parent
parent == this
// window.self
self == this

