// <!-- saved from https://www.archchinese.com/typechinese/35A6010A32990A948DA56F1A5EE54E3D.cache.html -->
// https://www.archchinese.com/data/22166.html

class DataSource {
    static dataClean(P) {
        function testClean(PH) {
            const bbb = PH.replaceAll(/@.+?(?=\||$)/g, '');
            const ccc = bbb.replaceAll(/[\w |]/g, '');

            const N = (PH.match(/\|/g) || []).length;
            const N2 = (bbb.match(/\|/g) || []).length;
            // console.assert(N == N2);

            return N == N2 && ccc == '';
        }
        const aaa = P.replaceAll('ū', 'u').replaceAll('é', 'e');

        return aaa.replaceAll(/u:/g, 'v');
    }

    static createPhoneDict(P) {
        const wordArray = P.split('|');
        const phone2Word = {};

        let phoneWithBlank;
        let phones, word;
        function addEntry() {
            const k = phones.join('');
            // phone2Word?.[k] || (phone2Word[k] = [word]);
            if (!phone2Word[k]) {
                phone2Word[k] = [word]
            } else {
                if (word.length == 1 || phone2Word[k].length < 10) {
                    phone2Word[k].push(word);
                }
            }

        }
        wordArray.forEach(item=>{
            [phoneWithBlank,word] = item.split('@');
            phones = phoneWithBlank.split(' ');

            addEntry()

            if (phones.length > 1) {
                phones[0] = phones[0][0];
                for (let index = 1; index < phones.length; index++) {

                    let phone = phones[index];
                    if (phone.length == 1) {
                        continue
                    }

                    addEntry()

                    phones[index] = phone[0];
                }

                addEntry()
            }
        }

        )

        const phonesSorted = Object.keys(phone2Word).sort();
        const result = phonesSorted.map(item=>{
            return phone2Word[item].map(it=>item + ' ' + it)
        }
        ).flat();
        return result
    }

    static createWordDict(P) {
        const commonest = '的一是不了人我在有他这为之大来以个中上们到说国和地也子时道出';
        const aaa = commonest.split('').map(a=>' ' + a);

        // const eee = P.replaceAll(/[\w ]*@/g, '').split('|');
        // const fff = eee.filter(a=>a.length > 1).sort();
        // fff.sort((a,b)=>a[0] > b[0] ? 1 : a[0] < b[0] ? -1 : 0);

        const bbb = P.replaceAll(/\s/g, '').split('|');
        const ccc = bbb.filter(it=>!/@.$/.test(it));
        const ddd = ccc.map(it=>it[it.indexOf('@') + 1] + it).sort()
        const fff = ddd.map(it=>it.split('@')[1]);
        const res = aaa.concat(fff);

        const indexSting = res.reduce((a,b)=>a + b[0], '');
        const ggg = Array.from(new Set(indexSting));

        res.word2index = Object.fromEntries(ggg.map(a=>[a, indexSting.indexOf(a)]))
        return res;
    }

    static createPuncDict() {
        const res = new Array();

        function add(x, a, b) {
            res.push(a + ' ' + b)
        }

        add('\u53E5\u53F7', 'period', '\u3002');
        add('\u9017\u53F7', 'comma', '\uFF0C');
        add('\u95EE\u53F7', 'question mark', '\uFF1F');
        add('\u611F\u53F9\u53F7', 'exclamation mark', '\uFF01');
        add('\u987F\u53F7', 'Chinese back sloping comma', '\u3001');
        add('\u5206\u53F7', 'semicolon', '\uFF1B');
        add('\u5192\u53F7', 'colon', '\uFF1A');
        add('\u5DE6\u53CC\u5F15\u53F7', 'left double quotation mark', '\u201C');
        add('\u53F3\u53CC\u5F15\u53F7', 'right double quotation mark', '\u201D');
        add('\u5DE6\u62EC\u53F7', 'left parenthesis', '\uFF08');
        add('\u53F3\u62EC\u53F7', 'right parenthesis', '\uFF09');
        add('\u5DE6\u4E2D\u62EC\u53F7', 'left square bracket', '\uFF3B');
        add('\u53F3\u4E2D\u62EC\u53F7', 'right square bracket', '\uFF3D');
        add('\u5DE6\u5927\u62EC\u53F7', 'left curly bracket ', '\uFF5B');
        add('\u53F3\u5927\u62EC\u53F7', 'right curly bracket', '\uFF5D');
        add('\u5DE6\u4E66\u540D\u53F7', 'left double angle bracket', '\u300A');
        add('\u53F3\u4E66\u540D\u53F7', 'right double angle bracket', '\u300B');
        add('\u5DE6\u5355\u5F15\u53F7', 'left single quotation mark', '\u2018');
        add('\u53F3\u5355\u5F15\u53F7', 'right single quotation mark', '\u2019');
        add('\u7834\u6298\u53F7', 'Chinese dash', '\u2500\u2500');
        add('\u7701\u7565\u53F7', 'ellipsis', '\xB7\xB7\xB7\xB7\xB7\xB7');
        add('\u95F4\u9694\u53F7', 'dot mark', '\xB7');

        return res;

    }

    // ===============================================
    // ===============================================
    constructor(PHONEDICT) {
        const PHONE = this.constructor.dataClean(PHONEDICT);

        this.phoneDict = this.constructor.createPhoneDict(PHONE);
        this.phoneDict.phone2index = ['a', '{'];
        this.phoneDict.phone2index.a = 0;
        this.phoneDict.phone2index['{'] = this.phoneDict.length - 1;

        this.wordDict = this.constructor.createWordDict(PHONE);
        this.wordDict.queryChar = '';
        this.wordDict.startIndex = 0;

        this.PuncDict = this.constructor.createPuncDict();
        this.PuncDict.pageIndex = 0;
        this.PuncDict.startPointerList = Array.from({
            length: Math.ceil(this.PuncDict.length / 10)
        }, (a,b)=>10 * b);

        // ==============================
        this.pageFunctionList = {
            'Blank': ()=>{}
            ,
            'Pronunciation': this.getPhonePage,
            'Punctuation': this.getPuncPage,
            'Association': this.getWordPage
        }

    }
    // ===============================================
    // ===============================================
    getFirstIndexAndRecording(phoneStr) {
        let indexLow, indexHigh, indexTest;
        let addIndex;
        let res;

        if (phoneStr.length < 3) {
            if (this.phoneDict.phone2index[phoneStr]) {
                res = this.phoneDict.phone2index[phoneStr];
            } else {
                indexLow = phoneStr[1] ? this.phoneDict.phone2index.indexOf(phoneStr[0]) : 0;
                indexHigh = this.phoneDict.phone2index.length - 1;

                while (indexHigh > indexLow + 1) {
                    indexTest = ~~((indexHigh + indexLow) / 2);
                    if (this.phoneDict.phone2index[indexTest] > phoneStr) {
                        indexHigh = indexTest;
                    } else {
                        indexLow = indexTest;
                    }
                }

                addIndex = indexHigh;

                indexLow = this.phoneDict.phone2index[this.phoneDict.phone2index[indexLow]];
                indexHigh = this.phoneDict.phone2index[this.phoneDict.phone2index[indexHigh]];

                while (indexHigh > indexLow + 1) {
                    indexTest = ~~((indexHigh + indexLow) / 2);
                    if (this.phoneDict[indexTest] > phoneStr) {
                        indexHigh = indexTest;
                    } else {
                        indexLow = indexTest;
                    }
                }

                this.phoneDict.phone2index.splice(addIndex, 0, phoneStr)
                this.phoneDict.phone2index[phoneStr] = indexHigh;

                res = indexHigh;
            }
        } else {
            const phoneStartStr = phoneStr.slice(0, 2);

            indexHigh = this.phoneDict.phone2index.indexOf(phoneStartStr) + 1;

            indexLow = this.phoneDict.phone2index[phoneStartStr];
            indexHigh = this.phoneDict.phone2index[this.phoneDict.phone2index[indexHigh]];
            while (indexHigh > indexLow + 1) {
                indexTest = ~~((indexHigh + indexLow) / 2);
                if (this.phoneDict[indexTest] > phoneStr) {
                    indexHigh = indexTest;
                } else {
                    indexLow = indexTest;
                }
            }

            res = indexHigh;
        }
        return res;
    }
    // ===========================
    getPhonePage(direction, opt) {

        let startInd, phoneStr;
        let aaa, bbb, start;

        if (direction == 0) {

            phoneStr = opt.word;
            // this.eleInput.value.toLowerCase()
            startInd = this.getFirstIndexAndRecording(phoneStr);
            aaa = this.phoneDict.slice(startInd, startInd + 100).filter(a=>a.startsWith(phoneStr));
            bbb = new Set(aaa.map(a=>a.split(' ')[1]));
            this.phoneDict.queryResult = Array.from(bbb);

            this.phoneDict.pageIndex = 0;
            start = 0;

        } else {
            this.phoneDict.pageIndex += direction;
            start = this.phoneDict.pageIndex * 10;
        }

        let res = this.phoneDict.queryResult.slice(start, start + 10);

        res.hasFore = 0 < this.phoneDict.pageIndex;
        res.hasRear = start + 10 < this.phoneDict.queryResult.length;

        return res;
    }

    getWordPage(direction, opt) {
        let start, char;

        if (direction == 0) {
            char = opt.word;
            start = this.wordDict.word2index[char];
            this.wordDict.queryChar = char;
            this.wordDict.startIndex = start;

        } else {
            char = this.wordDict.queryChar;
            start = this.wordDict.startIndex + direction * 10;
            this.wordDict.startIndex = start;
        }

        let res = this.wordDict.slice(start, start + 10);
        res = res.filter(a=>a.startsWith(char));
        res = res.map(a=>a.slice(1));

        res.hasFore = !!this.wordDict[start - 1]?.startsWith(char);
        res.hasRear = !!this.wordDict[start + 10]?.startsWith(char);

        return res;
    }

    getPuncPage(direction, opt) {
        let start;

        if (direction == 0) {
            start = 0;
            this.PuncDict.pageIndex = 0;

        } else {
            const N = this.PuncDict.startPointerList.length;
            const index = (this.PuncDict.pageIndex + direction) % N;
            this.PuncDict.pageIndex = index;
            start = this.PuncDict.startPointerList.at(index);

        }

        let res = this.PuncDict.slice(start, start + 10);
        res = res.map(a=>a.slice(a.lastIndexOf(' ')))

        res.hasFore = true;
        res.hasRear = true;
        return res;
    }

    getPage(direction, opt) {
        if (direction == 0) {
            switch (opt.type) {
            case 'Association':
                if (opt.word.length > 1 || this.pageFunction == this.getPuncPage) {
                    opt.word = ' ';
                }
                break;
            }
            this.pageFunction = this.pageFunctionList[opt.type];
        }
        return this.pageFunction(direction, opt);

    }
}

// ===============================================
// ===============================================
// ===============================================

class InputMethodUI {
    STATUS = ['Blank', 'Pronunciation', 'Punctuation', 'Association'];
    constructor(params) {
        this.eleInput = document.getElementById('pinyinInput');
        this.eleInput.lastValue = '';
        this.eleLable = document.getElementById('statusLabel');
        this.eleOutput = document.getElementById('chineseBox');
        this.eleReserve = document.getElementById('candidateBox');
        this.candidateWords = [];
        this.candidateWords.hasFore = false;
        this.candidateWords.hasRear = false;
        this.leadingChar = ' ';

        this.data = new DataSource(PHONEDICT);
        // delete PHONEDICT;
        this.state = 'Ready';
        this.eleInput.focus();

        this.inputAssociation(' ');

        document.addEventListener('keyup', (e)=>{
            if (e.key == "Control") {
                if (document.activeElement == this.eleInput) {
                    // this.eleInput.blur();
                    this.eleOutput.focus();
                } else {
                    // this.eleOutput.blur();
                    this.eleInput.focus();
                }
            }
            // e.preventDefault();
        }
        )
    }

    get state() {
        return this.eleLable.innerText.split(/ (?=[^ ]+$)/)[1];
    }

    set state(sta) {
        if (sta != this.state) {
            this.eleLable.innerText = this.state + '  =>  ' + sta;
        }
    }

    updateInput(text) {
        this.eleInput.value = text;
    }

    composeReserve() {
        const ordinalList = '1234567890';
        let text = '';
        let str = '';

        for (const [index,value] of this.candidateWords.entries()) {

            str = "<span style='font-size:22px;'><a href='javascript:void(0)' onclick='event.preventDefault();"//
            + "fn_addChinese(\"" + value + "\");'>" + value + "<\/a><\/span>"

            text += ordinalList[index] + '.' + str + '&nbsp;&nbsp;&nbsp;';
        }

        text += "<span class='pull-right'>";
        if (this.candidateWords.hasFore) {
            text += "<a class='circle-btn' href='javascript:void(0)' onclick='event.preventDefault();"//
            + "fn_pageCandidates(-1)'>&larr;<\/a> &nbsp;";
        }
        if (this.candidateWords.hasRear) {
            text += "<a class='circle-btn' href='javascript:void(0)' onclick='event.preventDefault();"//
            + "fn_pageCandidates(1)'>&rarr;<\/a>"
        }
        text += '&nbsp;&nbsp;&nbsp;<\/span>';

        this.eleReserve.innerHTML = text;
    }

    // =================
    inputPronunciation() {

        if (25 < this.eleInput.value.length) {
            return;
        }
        if (this.eleInput.value.length == 0) {
            this.inputAssociation();
            return;
        }
        const option = {
            type: 'Pronunciation',
            word: this.eleInput.value
        }

        this.candidateWords = this.data.getPage(0, option);
        this.composeReserve();

        this.state = 'Pronunciation';
    }

    inputPunctuation() {
        const option = {
            type: 'Punctuation'
        }

        this.candidateWords = this.data.getPage(0, option);
        this.composeReserve();

        this.state = 'Punctuation';
    }

    inputAssociation(char) {
        const option = {
            type: 'Association',
            word: char || this.leadingChar
        }

        this.candidateWords = this.data.getPage(0, option);
        this.composeReserve();

        this.state = 'Association';
    }

    inputBackspace() {
        const strLast = this.eleInput.lastValue;
        const strNew = this.eleInput.value;

        if (strLast.length == 0 || strLast.length == strNew.length) {
            this.eleOutput.value = this.eleOutput.value.slice(0, -1);
        }

        if (strLast.length == 1 && strNew.length == 0) {
            this.inputAssociation(' ');
        }

        this.inputPronunciation();

    }
    // =====================

    acceptWord(word) {
        word = Number.isInteger(word) ? this.candidateWords[word] : word;
        this.eleOutput.value += word;

        if (word.length == 1) {
            this.leadingChar = word;
        } else {
            this.leadingChar = ' ';
        }

        this.inputPronunciation();

        this.eleInput.focus();
    }

    turnPage(direct) {
        const isValid = [0, this.candidateWords.hasRear, this.candidateWords.hasFore].at(direct);
        if (!isValid) {
            return;
        }
        this.candidateWords = this.data.getPage(direct);
        this.composeReserve()
    }
}

// =========================

var Interface = new InputMethodUI();
delete PHONEDICT;

Interface.eleInput.addEventListener('keyup', (e)=>{
    switch (e.key) {
    case "Backspace":
        Interface.inputBackspace();
        break;
    case 'Alt':
        e.preventDefault();
        Interface.inputPunctuation()
        break;
    case "Escape":
        Interface.updateInput('');
        Interface.inputAssociation(' ');
        break;
    case "ArrowUp":
    case "ArrowLeft":
    case "PageUp":
        e.preventDefault();
        Interface.turnPage(-1);
        break;
    case "ArrowDown":
    case "ArrowRight":
    case "PageDown":
        e.preventDefault();
        Interface.turnPage(1);
        break;
    case "Enter":
        Interface.updateInput('');
        Interface.acceptWord(0);
        break;
    case Number(e.key).toString():
        Interface.updateInput('');
        Interface.acceptWord('1234567890'.indexOf(e.key));
        break;
    case e.code[3]?.toLowerCase():
        Interface.inputPronunciation()
        break;
    default:
        const strLast = Interface.eleInput.lastValue;
        const strNew = Interface.eleInput.value;
        if (strLast == strNew) {
            break;
        }
        let i = 0;
        for (; i < strLast.length; i++) {
            if (strNew.charAt(i) !== strLast.charAt(i)) {
                break;
            }
        }
        Interface.eleOutput.value += strNew.slice(i);
        Interface.eleInput.value = strLast.slice(0, i);

        if (e.key == "Control") {
            e.stopPropagation();
        }

    }
    Interface.eleInput.lastValue = Interface.eleInput.value;
}
)

Interface.eleInput.addEventListener('input', (e)=>{
    // this.eleInput.value
    if (e.data && false) {
        Interface.eleOutput.value += e.data;
    }
}
)

// =========================
// =========================

fn_addChinese = (param)=>{
    Interface.acceptWord(param)
}

fn_pageCandidates = (param)=>{
    Interface.turnPage(param)
}
