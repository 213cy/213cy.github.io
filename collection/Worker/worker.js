function randomString(N) {
    const str = Math.random().toString(36).slice(2, 20);
    const n = str.length;
    if (N <= n) {
        return str.slice(0, N);
    } else {
        return str + randomString(N - n);
    }
}

function parseArguments(text) {
    text = text.replace(/\s+/g, ' ');
    var args = [];
    // Allow double quotes to not split args.
    text.split('"').forEach(function(t, i) {
        t = t.trim();
        if ((i % 2) === 1) {
            args.push(t);
        } else {
            args = args.concat(t.split(" "));
        }
    });
    return args;
}

var intervalID;
function process(K) {
    let r;
    let str;
    let n = Math.floor(Math.E ** (3 * Math.random()));
    if (n > 16) {
        str = '';
    } else {
        str = randomString(n);
    }

    r = Math.random();
    if (r < 0.85) {
        K.stdout(str);
    } else if (r < 0.99) {
        K.stderr(str);
    } else {
        clearInterval(intervalID);
        K.onExit('bla bla bla ...');
    }
}
function startProcess(K) {
    const args = parseArguments(K.command);
    K.stdout(args.join(' '));
    K.stdout('', ">>>");
    intervalID = setInterval(process, 100, K);
}

var isRunning = false;
self.onmessage = function(event) {
    function bindBuffer(fun, decor) {
        // var decor = decor;
        var dataBuffer = [];
        return function(data, begin=decor) {
            // let begin = beg || decor;
            if (typeof data != 'string') {
                return;
            }
            if (data.length > 0) {
                dataBuffer.push(data);
            } else if (dataBuffer.length > 0) {
                fun(begin + dataBuffer.join(' '));
                dataBuffer = [];
            }

        }
    }

    var P = event.data;
    if ("run" == P.type)
        if (isRunning)
            self.postMessage({
                type: "error",
                data: "already running"
            });
        else {
            isRunning = true;
            self.postMessage({
                type: "run"
            });

            var K = {};
            Object.keys(P).forEach(function(t) {
                "type" !== t && (K[t] = P[t])
            });

            K.stdout = bindBuffer(function(t) {
                self.postMessage({
                    type: "stdout",
                    data: t
                })
            }, '\t');
            K.stderr = bindBuffer(function(t) {
                self.postMessage({
                    type: "stderr",
                    data: t
                })
            }, ' error : ');
            K.onExit = function(t) {
                K.stdout('');
                K.stderr('');
                self.postMessage({
                    type: "done",
                    data: t
                })
                isRunning = false;
            }

            dataTrans = startProcess(K);

        }
    else
        self.postMessage({
            type: "error",
            data: "unknown command"
        })
}

self.postMessage({
    type: "ready"
})
