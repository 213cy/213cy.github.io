解决浏览器访问本地文件跨域问题
https://zhuanlan.zhihu.com/p/660705859

浏览器安全协议会默认禁止浏览器访问本地文件.
访问本地的协议是file，和http/https协议不同，会被浏览器默认为跨域请求.
所以会被浏览器的CORS(CROSS-ORIGIN RESOURCE SHARING,跨域资源共享)的安全策略阻止


暂时配置浏览器允许访问本地文件

在 快捷方式 或是 命令行 中给chrome的启动配置启动参数
chrome.exe --disable-web-security --user-data-dir=C:\MyChromeUserFata

--user-data-dir 必填,给浏览器指定新的配置文件夹