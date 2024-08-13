function demonstration() {

    const rawkey_typedArray = window.crypto.getRandomValues(new Uint8Array(16));
    const rawkey_hexString = Array.from(rawkey_typedArray).map((b)=>b.toString(16).padStart(2, "0")).join("");
    const rawkey_hexString2 = rawkey_typedArray.reduce((a,b)=>a + b.toString(16).padStart(2, 0), '')
    console.log('rawkey:  ', rawkey_hexString);

    let secretKey;
    const importSecretKey = async(key)=>{
        secretKey = await window.crypto.subtle.importKey("raw", key, "AES-GCM", true, ["encrypt", "decrypt"]);
        console.log('CryptoKey:  ', secretKey);
        return secretKey;
    }

    let secretKey2;
    async function generateSecretKey(key) {
        secretKey2 = await window.crypto.subtle.generateKey({
            name: "AES-GCM",
            length: 256,
        }, true, ["encrypt", "decrypt"], );
        console.log(secretKey2);
        return secretKey2;
    }

    async function exportSecretKey(key) {
        const exported_raw = await window.crypto.subtle.exportKey("raw", key);
        const key_typedArray = new Uint8Array(exported_raw);
        const key_hexString = Array.from(key_typedArray).map((b)=>b.toString(16).padStart(2, "0")).join("");

        const exported_jwk = await window.crypto.subtle.exportKey("jwk", key);
        const key_base64 = exported_jwk.k.replaceAll('-', '+').replaceAll('_', '/');
        const key_binary = atob(key_base64);
        const key_array = Array.from(key_binary).map(it=>it.charCodeAt(0));
        const key_hexString2 = key_array.map((b)=>b.toString(16).padStart(2, "0")).join("");

        console.log('rawkey_exported:  ', key_hexString)
        console.log('rawkey_exported_jwk:  ' + key_hexString2)
        console.log(key_hexString == key_hexString2)
        console.log('=='.repeat(20))
    }

    const importProcess = importSecretKey(rawkey_typedArray).then(exportSecretKey)

    // ====================================

    const plaintext = 'asdfsdfsdf';
    let ciphertext;
    let iv = window.crypto.getRandomValues(new Uint8Array(12));
    // iv will be needed for decryption
    async function encryptMessage(message) {
        const encoded = new TextEncoder().encode(message);
        console.log(`plaintext:  ${plaintext} [${plaintext.length} total]`)
        console.log(`plaintext_byte:  ${encoded.slice(0, 5)}...[${encoded.byteLength} bytes total]`);

        const cipher_buffer = await window.crypto.subtle.encrypt({
            name: "AES-GCM",
            iv: iv
        }, secretKey, encoded);

        const cipher_typedArray = new Uint8Array(cipher_buffer);
        console.log(`ciphertext_byte:  ${cipher_typedArray.slice(0, 5)}...[${cipher_typedArray.byteLength} bytes total]`);
        ciphertext = Array.from(cipher_typedArray, v=>String.fromCharCode(v)).join('');
        console.log(`ciphertext:  ${ciphertext} [${ciphertext.length} total]`)
    }

    encryptProcess = importProcess.then(()=>encryptMessage(plaintext))

    // ===================================
    async function decryptMessage(message) {
        const encoded = new Uint8Array(Array.from(message, v=>v.charCodeAt(0)))
        let plain_buffer = await window.crypto.subtle.decrypt({
            name: "AES-GCM",
            iv: iv
        }, secretKey, encoded);

        const plain_typedArray = new Uint8Array(plain_buffer);
        const text = new TextDecoder().decode(plain_typedArray);
        console.log("plaintext_decrypted:  ", text)

    }

    decryptProcess = encryptProcess.then(()=>decryptMessage(ciphertext)).then(()=>decryptMessage(ciphertext))

    function corruptText(t) {
        const ind = Math.floor(Math.random() * t.length);
        const mask = 1 << Math.random() * 8;
        const subString = String.fromCharCode(t.charCodeAt(ind) ^ mask);
        const res = t.slice(0, ind) + subString + t.slice(ind + 1);
        console.log(`ciphertext_corrupted:  ${res} [${res.length} total]`)
        return res;
    }

    decryptProcess.then(()=>decryptMessage(corruptText(ciphertext))).catch((error)=>{
        console.error(error);
        console.log('='.repeat(30))
    }
    )
}

demonstration()
