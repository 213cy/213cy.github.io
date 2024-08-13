cb = $('textarea.chat-input.border-box');
// cb = $('input.chat-input.border-box');

var ent = new InputEvent('input',{
    bubbles: true,
    cancelable: false
});
var ke = new KeyboardEvent('keydown',{
    bubbles: true,
    cancelable: true,
    keyCode: 13
});

// mand = ['愈合', '治疗'];
// mand2 = ['88x9 6', '98x9 6'];
// mand = [].concat(mand1, mand2, mand3, mand4)
// var m = mand.length;


var m = 333;
var n = 0;
h = function fun() {
    if (n++ < m) {
        if (n%2==0){
            cb.value = '治疗';
        } else if (n%6==1) {
            cb.value = '愈合';
        } else {
            return;
        }
//         cb.value = mand[n%2];
        cb.dispatchEvent(ent);
        cb.dispatchEvent(ke);

    } else {
        cb.value = 'done!';
        cb.dispatchEvent(ent);
        cb.dispatchEvent(ke);
        window.clearInterval(ti);
    }
}

ti = setInterval(h, "3000");

// window.clearInterval(ti);


