const text_initial = `This is a program that shuffles integers through a predetermined text that can be used for lottery draws through danmakus/comments.
The method requires input text and a maximum natural number. It outputs a permutation of the integers less than the maximum number.
the permutation uniquely determined by the text through some digest and encryption algorithms.
The draw can be conducted according to the following steps:
1. Determine the number N of participants in the lottery and assign each person a number less than N.
2. Copy relevant danmakus/comments to this text box.
3. Input the total number of participants N and press the \`draw\` button.
4. A permutation of the person number will appear in the text box below. You can let the person corresponding to the number at front win the prize.
In short, this is a lottery draw approach affected by everyone's comment and the result of this approach is reproducible.
I hope that this will improve the openness and fairness of the lottery.
`
document.querySelector('textarea#lotteryInfo').value = text_initial.trim();
document.querySelector('#NNum').value = 99;
// =============================

document.querySelector('#drawButton').onclick = ()=>{
    // NN : The total number of people in the draw  (NN = 99)
    let NN = document.querySelector('#NNum').value || 99;
    let Msg = document.querySelector('textarea#lotteryInfo').value.trim();

    randomDrawing(NN, Msg).then(a=>{
        const {shuffleResult, rank} = a;
        document.querySelector('textarea#lotteryResults').value = shuffleResult;
    }
    );
}

// =============================

var fileTarget;
document.querySelector('#fileButton').onclick = async()=>{
    const pickerOpts = {
        types: [{
            description: "Images",
            accept: {
                "text/*": [".txt", ".csv", ".html", ".xml"],
            },
        }],
        excludeAcceptAllOption: true,
        multiple: false,
    }
    // open file picker
    const [fileHandle] = await window.showOpenFilePicker(pickerOpts);

    // get file contents
    fileTarget = await fileHandle.getFile();
    const fileText = await fileTarget.text();
    document.querySelector('textarea').value = fileText.trim();
    console.log('textarea.value == text(after textarea.value = text) : ', document.querySelector('textarea').value == fileText);

    var reader = new FileReader();
    reader.onload = function() {
        const text = reader.result;
        // document.createElement('pre').textContent = text;
        console.log('Element.textContent == text(after Element.textContent = text) : true');
        // https://developer.mozilla.org/en-US/docs/Web/API/Blob/text#usage_notes
        console.log('FileReader.readAsText(fileObj) == fileObj.text() :', text == fileText);
    }

    reader.readAsText(fileTarget)
}
