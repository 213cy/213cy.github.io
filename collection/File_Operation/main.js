const selectBtn = document.querySelector(".select");
const stopBtn = document.querySelector(".stop");
const fileText = document.querySelector("#filetext");



async function getNewFileHandle() {
    const opts = {
        types: [{
            description: "Text file",
            accept: {
                "text/plain": [".txt"]
            },
        }, ],
    };
    return await window.showSaveFilePicker(opts);
}

async function createFileStream(fileHandle) {
    // Enable text field and write button, disable select button
    fileText.disabled = false;
    stopBtn.disabled = false;
    selectBtn.disabled = true;

    return await fileHandle.createWritable({
        keepExistingData: true,
        mode: "exclusive",
    })

    // Create a FileSystemWritableFileStream to write to.
    return await fileHandle.createWritable();
}

function writeContent(contents) {
    return async function writeFile(writable) {
        console.log(contents)
        // Write the contents of the file to the stream.
        await writable.write(contents);
        return writable
    }
}

async function closeFileStream(writable) {
    fileText.disabled = true;
    fileText.value = '';
    stopBtn.disabled = true;
    selectBtn.disabled = false;

    // Close the file and write the contents to disk.
    await writable.close();
}
// ========================
var writeStreamPromise;

fileText.addEventListener('keydown', (e)=>{
    // e.key
    writeStreamPromise = writeStreamPromise.then(writeContent(e.key))
}
)

selectBtn.addEventListener("click", ()=>{
    writeStreamPromise = getNewFileHandle().then(createFileStream)
}
)

stopBtn.addEventListener("click", ()=>{
    writeStreamPromise.then(closeFileStream)
}
)


//=======================
// origin private file system (OPFS)
// const root = await navigator.storage.getDirectory();