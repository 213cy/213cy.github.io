var ev;
var propertyList = [];
var propertyList2 = [];

document.addEventListener('keydown', getPropertyList)

//get the KeyBoardEvent properties listed in watch window
function getPropertyList(e) {
    ev = e;
    // console.log( JSON.stringify(ev) ); 
    let res;
    res = [];
    for (const bb in ev) {
        if (typeof ev[bb] == 'function') {
            continue;
        }
        if (bb.charCodeAt(0) < 97) {
            // uppercase properties means non-configurable
            continue;
        }
        if (ev.propertyIsEnumerable(bb)) {
            // non-inherited properties will show in front of result array
            continue;
        }

        res.push(bb);

    }
    res = Object.keys(ev).concat(res.sort());
    propertyList = res;

    // 'res' is the same as what showing in devtools watch window for KeyBoardEvent property list

    res = [];
    let obj = ev.__proto__;
    while (obj.constructor != Object) {
        // obj.constructor.name != 'Object';

        // a=Object.getOwnPropertyNames(e.__proto__).filter((v)=>typeof e[v] != 'function')

        const desc = Object.getOwnPropertyDescriptors(obj);
        const a = Object.keys(obj).filter((v)=>{
            const a = typeof desc[v].value != 'function';
            const b = desc[v].enumerable == true;
            const c = desc[v].configurable == true;
            return a && c
        }
        )
        res = res.concat(a);

        obj = obj.__proto__;
    }
    res = Object.keys(ev).concat(res.sort());
    propertyList2 = res;

    console.log(propertyList)
    console.log(propertyList2)

    document.removeEventListener('keydown', getPropertyList)

}
// =================================

propertyList = ['isTrusted', 'altKey', 'bubbles', 'cancelBubble', 'cancelable', 'charCode', //
'code', 'composed', 'ctrlKey', 'currentTarget', 'defaultPrevented', 'detail', 'eventPhase', //
'isComposing', 'key', 'keyCode', 'location', 'metaKey', 'repeat', 'returnValue', 'shiftKey', //
'sourceCapabilities', 'srcElement', 'target', 'timeStamp', 'type', 'view', 'which'];

propertyList.filter(v=>typeof ev[v] != 'object');

propertyList = ['isTrusted', 'altKey', 'bubbles', 'cancelBubble', 'cancelable', 'charCode', //
'code', 'composed', 'ctrlKey', 'defaultPrevented', 'detail', 'eventPhase', 'isComposing', 'key', //
'keyCode', 'location', 'metaKey', 'repeat', 'returnValue', 'shiftKey', 'timeStamp', 'type', 'which']
