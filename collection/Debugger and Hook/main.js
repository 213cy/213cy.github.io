
// function a() {
//     console.log();
//     debugger ;
// }
// a(1, 2, 3, 'sfd')

// b = function() {
//     console.log();
//     debugger ;
// }
// b(1, 2, 3, 'sfd')
// bb=b.bind({a:"a"})
// bb('c',35)

//================================

// c = ()=>{
//     console.log(this);
//     debugger ;console.log(this);
// }
// c('a', 'b', 'c', 3453)
// c.call({},'c',35)

// document.onclick = ()=>{
//     cc();
// }

// a = 0;
// setInterval(()=>{
//     console.log(a++);
//     debugger ;console.log(a++);
// }
// , 2000);

// ======================================

// _setInterval = setInterval
// setInterval = function (a,b) {
//     if(a.toString().indexOf('debugger') == -1){
//         return function(){}
//     }else{
//         _setInterval(a,b)
//     }
// }

// Function.prototype.toString = function () {
//     return `function ${this.name}() { [native code] }`
// }

// 
// _Function = Function
// Function.prototype.constructor = function () {
//     if (arguments[0].indexOf('debugger') !== -1) {
//         return _Function('')
//     }
//     return _Function(arguments[0])
// }
