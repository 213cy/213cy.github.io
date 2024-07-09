const container = document.querySelector("#container");
container.emit = function(...txt) {
    ele = document.createElement('p');
    ele.textContent = txt.join(' ');
    container.append(ele);
}

var running = false;
var ws;
// =================
const CON = {
    WS_OP_HEARTBEAT: 2,
    WS_OP_HEARTBEAT_REPLY: 3,
    WS_OP_MESSAGE: 5,
    WS_OP_USER_AUTHENTICATION: 7,
    WS_OP_CONNECT_SUCCESS: 8,
    WS_PACKAGE_HEADER_TOTAL_LENGTH: 16,
    WS_PACKAGE_OFFSET: 0,
    WS_HEADER_OFFSET: 4,
    WS_VERSION_OFFSET: 6,
    WS_OPERATION_OFFSET: 8,
    WS_SEQUENCE_OFFSET: 12,
    WS_BODY_PROTOCOL_VERSION_NORMAL: 0,
    WS_BODY_PROTOCOL_VERSION_DEFLATE: 2,
    WS_BODY_PROTOCOL_VERSION_BROTLI: 3,
    WS_HEADER_DEFAULT_VERSION: 1,
    WS_HEADER_DEFAULT_OPERATION: 1,
    WS_HEADER_DEFAULT_SEQUENCE: 1,
    WS_AUTH_OK: 0,
    WS_AUTH_TOKEN_ERROR: -101
};

//============================

async function aaa(room_id) {
    room_id = room_id || 25989742;
    const confUrl = `https://api.live.bilibili.com/xlive/web-room/v1/index/getDanmuInfo?id=${room_id}&type=0`
    // wsConfUrl = `https://api.live.bilibili.com/room/v1/Danmu/getConf?room_id=${room_id}&platform=pc&player=web`
    const r = await fetch(confUrl).then(response=>response.json());
    const cert = {
        "uid": Number(/DedeUserID=(.+?)(;|\s|$)/.exec(document.cookie)[1]),
        "roomid": room_id,
        "protover": 3,
        "buvid": (/buvid3=(.+?)(;|\s|$)/.exec(document.cookie))[1],
        "platform": "web",
        "type": 2,
        "key": r.data.token
    }
    copy(cert)
}

function getCertification(room_id) {
    room_id = room_id || 25989742;
    const certification = {
        "uid": 0,
        "roomid": room_id,
        // "protover": CON.WS_BODY_PROTOCOL_VERSION_NORMAL,
        "protover": 3,
        "buvid": "8ECEDC7C-9C0E-5DF7-17C0-630D08C2AFD413064infoc",
        "platform": "web",
        "type": 2,
        "key": "Q8e8cxnGDseOGn2uRO5rzVzkhpfJy5Fj6t0nSp6TP1uE7jNUI3c-kdRz1cfZUKHWM2QES-ukqbhyqxMuKH2trxy5iFtOG_dLnvokh8syNq0FQA7TYsSq3Oo5-nhc7ftp-B1lPk5GRuy2N7MSt80JRyaey3-mpeq9FR7j7gXF8ooMnLUbE97O2sqJfuPH1dDm1jsb"
    }

    let encoder = new TextEncoder();
    let jsonBytes = encoder.encode(JSON.stringify(certification));

    let buff = new ArrayBuffer(jsonBytes.byteLength + 16);

    let view = new DataView(buff);
    view.setUint32(0, jsonBytes.byteLength + 16);
    view.setUint16(4, 16);
    view.setUint16(6, 1);
    //WS_HEADER_DEFAULT_VERSION
    view.setUint32(8, 7);
    //WS_OP_USER_AUTHENTICATION
    view.setUint32(12, 1);
    //WS_HEADER_DEFAULT_SEQUENCE

    let viewBytes = new Uint8Array(buff);
    viewBytes.set(jsonBytes, 16);

    return buff;
}
//======================
function webSocket(authPacket) {
    authPacket || (authPacket = getCertification());

    var timer;

    const wsServer = 'wss://zj-cn-live-comet.chat.bilibili.com:2245/sub';
    ws = new WebSocket(wsServer);
    ws.binaryType = "arraybuffer";

    ws.onopen = function(e) {
        ws.send(authPacket);

        //发送心跳包
        var heart = "0000001f0010000100000002000000015b6f626a656374204f626a6563745d";
        heartArr = heart.match(/../g).map(str=>parseInt(str, 16));
        r = new Uint8Array(heartArr);
        buff = r.buffer;

        timer = setInterval(function(buff) {
            ws.send(buff);
        }, 10000, buff);
        //30秒

    }

    ws.onclose = function(e) {
        container.emit(">>> The connection is closed");
        if (timer != null) {
            clearInterval(timer);
            //停止发送心跳包
        }
        // setTimeout(webSocket,4000);    //4秒后重连
    }

    ws.onerror = function(e) {
        console.log(e);
    }

    ws.onmessage = function(e) {
        parsePacket(e).forEach(res=>emitMessage(res));
    }
}

function parsePacket(e) {
    var result = [];
    var decoder = new TextDecoder();
    function convertToObject(buff) {
        let view = new DataView(buff);
        const data = {
            "packetLen": view.getUint32(0),
            "headerLen": 16,
            "ver": view.getUint16(6),
            "op": view.getUint32(8),
            "seq": view.getUint32(12),
            "body": null,
        }

        if (data.op == 3) {
            // WS_OP_HEARTBEAT_REPLY
            console.assert(data.ver == 1 && buff.byteLength == 35, buff)
            // console.log("hot: " + view.getUint32(16))
            // debugger
            return
        }

        if (data.packetLen < buff.byteLength) {
            convertToObject(buff.slice(data.packetLen, buff.byteLength));
        }

        body = buff.slice(16, data.packetLen);
        // console.log(data.ver)
        if (data.ver == 3) {
            //WS_BODY_PROTOCOL_VERSION_BROTLI
            let d = BrotliDecode(new Uint8Array(body));
            convertToObject(d.buffer);
        } else //if (data.ver === 0)
        //WS_BODY_PROTOCOL_VERSION_NORMAL
        {
            let c = decoder.decode(body);
            data.body = c.length ? JSON.parse(c) : null;
            result.push(data);
        }

    }

    convertToObject(e.data);

    // console.log(result)
    return result;
}

function emitMessage(message) {
    if (message.body.cmd) {
        // container.emit(`<${message.body.cmd}>`);
        switch (message.body.cmd) {
        case "DANMU_MSG":
            const a = new Date(message.body.info[0][4]);
            const t = a.toTimeString().split(' ')[0];
            // console.log(message.body.info[0][15].user.base.name);
            container.emit(`[${t}]`, message.body.info[2][1], ":", message.body.info[1]);
            break;
        }

    } else {
        container.emit(`[ROOM:${ROOM_ID}]`,"CONNECT_SUCCESS ", JSON.stringify(message.body));
    }

}

// ===============================
// localStorage.setItem("authPacket",)

// copy as base64
const authPacket_default = "AAABXAAQAAEAAAAHAAAAAXsidWlkIjowLCJyb29taWQiOjI1OTg5NzQyLCJwcm90b3ZlciI6MywiYnV2aWQiOiI1RjcyQUExMS1FMzc1LTM2RkYtNzM5Ny0yQzhDOTg5RDdGMDc3NjUzNWluZm9jIiwicGxhdGZvcm0iOiJ3ZWIiLCJ0eXBlIjoyLCJrZXkiOiJSSDJkbmhEMkJzZUlDc2dFeFlHTjdtUTZoYUdnRlJOQUxMZlBtN2dXRDd6QWNtUVR0UVBKaXJ0TWsySWxQVE5kUW80VGI0S1FuYjRBVkZRbjV3Y1F0ZlVfWXRaUzloQk4xVUFWQlVUQkVwSFB2Rjg0bjBMQXdnY0NMMFJuMFcxdkVhQTBQcDJoSnMtdUtqS1BTOGJqZG9fVW5ZclRPd080cEQxU0ZROVNHQkdjWTFwUlR3SmNfVklfN0l3TUxDV1UxSVpRYXBrPSJ9";

const authPacket_base64 = localStorage.getItem("authPacket") || authPacket_default;
const auth_str = atob(authPacket_base64)
const auth_obj = JSON.parse(auth_str.slice(16))
const ROOM_ID = auth_obj.roomid;
const encoder = new TextEncoder();
const authPacket = encoder.encode(auth_str);


document.onclick = (e)=>{
    if (!ws || ws.readyState == WebSocket.CLOSED) {
        webSocket(authPacket)
        container.emit(">>> Socket has been created,connecting ...")
    }
}
