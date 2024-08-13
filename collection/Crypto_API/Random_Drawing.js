// ======================================================

var digestHash;

const randomDrawing = async(NN,plainMsg)=>{
    // encode as (utf-8) Uint8Array
    const msgUint8 = new TextEncoder().encode(plainMsg);
    // hash the message, digest
    digestHash = await window.crypto.subtle.digest("SHA-256", msgUint8);
    const key = digestHash.slice(0, 16);
    const counter = digestHash.slice(16);
    const offset = new DataView(digestHash.slice(15, 17)).getUint16() % msgUint8.length;

    // ====================

    const byte_perEntry = Math.ceil(Math.log2(NN) / 8) + 1;
    const msgExtend_Uint8 = new Uint8Array(NN * byte_perEntry);

    const msgEnd_Uint8 = msgUint8.slice(offset);

    if (msgEnd_Uint8.length >= msgExtend_Uint8.length) {
        msgExtend_Uint8.set(msgEnd_Uint8.slice(0, msgExtend_Uint8.length))
    } else {
        msgExtend_Uint8.set(msgEnd_Uint8)
        let startPointer = msgEnd_Uint8.length;
        while (msgExtend_Uint8.length - startPointer > msgUint8.length) {
            msgExtend_Uint8.set(msgUint8, startPointer)
            startPointer = startPointer + msgUint8.length
        }
        msgExtend_Uint8.set(msgUint8.slice(0, msgExtend_Uint8.length - startPointer), startPointer)
    }

    // ====================

    const secretKey = await window.crypto.subtle.importKey("raw", key, "AES-CTR", true, ["encrypt"]);
    const cipherBuffer = await window.crypto.subtle.encrypt({
        name: "AES-CTR",
        counter,
        length: 64
    }, secretKey, msgExtend_Uint8);

    const cipher_Uint8 = new Uint8Array(cipherBuffer);
    const cipher_BitString = cipher_Uint8.reduce((a,b)=>a + b.toString(2).padStart(8, 0), '');

    // ====================

    const bit_index = Array.from({
        length: cipher_BitString.length / NN
    }, (a,b)=>b * NN);
    const entry_index = Array.from({
        length: NN
    }, (a,b)=>b);

    const rank = entry_index.map(it=>{
        const selector = bit_index.map(ind=>cipher_BitString[it + ind]).join('');
        const index = it.toString().padStart(3, 0);
        return selector + '.' + index;
    }
    );
    // const rankSorted = rank.toSorted()

    const shuffleResult =[...entry_index].sort((a,b)=>rank[b] - rank[a]);
    rank.sort((a,b)=>b - a);

    // console.log(entry_index)
    return {shuffleResult, rank}

}

function dumpBuffer(digestHash) {
    let hashHex;

    const raw_uint8 = new Uint8Array(digestHash);
    hashHex = raw_uint8.reduce((a,b)=>a + b.toString(16).padStart(2, 0), '');
    console.log(hashHex)

    // convert buffer to byte array
    const hashArray = Array.from(raw_uint8);
    // convert bytes to hex string
    hashHex = hashArray.map((b)=>b.toString(16).padStart(2, "0")).join("");
    console.log(hashHex)
}
