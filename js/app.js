'use strict'

const input = document.getElementById('input');
const encryptButton = document.getElementById('btn-encrypt');
const decryptButton = document.getElementById('btn-decrypt');
const historyWrapper = document.querySelector('.history')
const textWrapper = document.getElementById('text');
const copyButton = document.getElementById('btn-copy');
const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
const regexValidator = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+|[A-Z]+/;


input.addEventListener('input', (event) => {
    const isValidText = validateExpression(input.value);

    if (!isValidText) {
        input.style.border = '2px solid red';
        encryptButton.disabled = true;
        decryptButton.disabled = true;
    }

    if (isValidText) {
        input.style.border = '2px solid seagreen';
        encryptButton.disabled = false;
        decryptButton.disabled = false;
    }
})

encryptButton.addEventListener("click", (event) => {
    const encrypt = encryptText(input.value);
    clearStylesForTextColumn();
    input.value = '';
    textWrapper.innerHTML = `${encrypt}`;


})
decryptButton.addEventListener('click', (event) => {
    const decrypt = decryptText(input.value);
    clearStylesForTextColumn();
    input.value = '';
    textWrapper.innerHTML = `${decrypt}`;
})

copyButton.addEventListener('click', async () => {
     let data = '';
     data = textWrapper.innerHTML;
     await navigator.clipboard.writeText(data)
    .then(() => console.info('text copied to clipboard'))
    .catch((error) => console.error(error));

    await navigator.clipboard.readText()
    .then((data) => input.value = `${data.trim()}`)
    .catch((error) => console.error(error));

     textWrapper.innerHTML = '';
})

function validateExpression(text) {
    return !regexValidator.test(text);
}
function clearStylesForTextColumn() {
    textWrapper.style.opacity = 1;
    historyWrapper.style.backgroundImage = 'none';
}

function encryptText(phrase) {
    let text = '';
    text = phrase.split(' ');
    let resultPhrase = '';
    let encryptWords = [];
    for (const word of text) {
        const textDivider = Math.round(word.length/2);
        const randomWord = generatedRandomWord(textDivider);
        const firstPortionText = word.substring(0,textDivider);
        const endPortionText = word.substring(textDivider, word.length);
        const encryptCompleted = `${firstPortionText}nx${randomWord.length}m${generatedRandomWord(1)}${randomWord}${endPortionText}`;

        encryptWords.push(encryptCompleted);
    }
    for (const value of encryptWords) {
        resultPhrase += value + ' ';
    }
   
    return resultPhrase;
}

function decryptText(phrase) {
    const regex = /nx(\d+)m/;
    let words = [];
    words = phrase.split(' ');
    let originalText = [];
    let originalPhrase = ""; 
    for (const text of words) {
       const match = text.match(regex);
       const startEncrypt = match.index;
       const prefixCount = Number(match[0].length);
       const embeddedTextCount = Number(match[1]) + 1;
       const firstPart = text.substring(0,startEncrypt);
       const lastPart = text.substring(startEncrypt + prefixCount + embeddedTextCount, text.length);
       
       originalText.push(firstPart.concat(lastPart));
    }

    for (const word of originalText) {
        originalPhrase += word + " ";
    }

    return originalPhrase;
}

function generatedRandomWord(length){
    let randomPhrase = '';
    let randomIndex = 0;
    for (let i = 0; i < length; i++) {
        randomIndex = Math.floor(Math.random() * characters.length);
        randomPhrase += characters.charAt(randomIndex);
    }

    return randomPhrase;
}
