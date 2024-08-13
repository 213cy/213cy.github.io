console.log(document.cookie.replace(/ /g, '\n'))

a="E:/Program Files/Debugging Tools/windbg (x64)/WINXP;E:/Program Files/Debugging Tools/windbg (x64)/winext;E:/Program Files/Debugging Tools/windbg (x64)/winext/arcade;E:/Program Files/Debugging Tools/windbg (x64)/pri;E:/Program Files/Debugging Tools/windbg (x64);E:/Program Files/Debugging Tools/windbg (x64)/winext/arcade;C:/Windows/system32;C:/Windows;C:/Windows/System32/Wbem;C:/Windows/System32/WindowsPowerShell/v1.0/;D:/MATLAB/R2017b/bin/win64;D:/mingw64/bin;C:/Program Files/Git/cmd;D:/Anaconda3;D:/Anaconda3/Library/bin;E:/Programs/Fiddler"
b=a.replace(/;/g, '\n')
console.log(b)


var str = 's\'dfse\'d skills666666\'dfse\''
// var reg = '/(?<=('\w{4}').*$\n(^.*\n)*)^.*skills.{6,7}\1/'
var reg = /(?<=('\w{4}\').*)\s.*skills.{6,7}/
console.log( str.match( reg ))