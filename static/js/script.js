// ===============================
// AI Language Translator
// script.js
// ===============================


// ===============================
// DOM Elements
// ===============================

const inputText = document.getElementById("input-text");
const outputText = document.getElementById("output-text");

const sourceLanguage = document.getElementById("source-language");
const targetLanguage = document.getElementById("target-language");

const translateButton = document.getElementById("translate-btn");
const swapButton = document.getElementById("swap-btn");
const copyButton = document.getElementById("copy-btn");
const clearButton = document.getElementById("clear-btn");
const speakButton = document.getElementById("speak-btn");


function loadLanguages() {

    for (const code in languages) {

        const sourceOption = document.createElement("option");
        sourceOption.value = code;
        sourceOption.textContent = languages[code];

        const targetOption = document.createElement("option");
        targetOption.value = code;
        targetOption.textContent = languages[code];

        sourceLanguage.appendChild(sourceOption);
        targetLanguage.appendChild(targetOption);

    }

    sourceLanguage.value = "auto";
    targetLanguage.value = "ur";

}

loadLanguages();

// ===============================
// Translate Text
// ===============================

async function translateText() {

    const text = inputText.value.trim();

    if (text === "") {

        showToast("Please enter text to translate.", "error");
        return;

    }

    outputText.value = "Translating...";

    try {

        const response = await fetch("/translate", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                text: text,
                source: sourceLanguage.value,
                target: targetLanguage.value

            })

        });
        const data = await response.json();
        if (!response.ok)
        {
            throw new Error(data.error);
        }
        outputText.value = data.translated_text;
    }
    catch (error)
    {
        console.error(error);
        outputText.value = "";
        showToast(error.message, "error");
    }

}


// ===============================
// Swap Languages
// ===============================

function swapLanguages() {

    const tempLanguage = sourceLanguage.value;

    sourceLanguage.value = targetLanguage.value;
    targetLanguage.value = tempLanguage;

    const tempText = inputText.value;

    inputText.value = outputText.value;
    outputText.value = tempText;

}


// ===============================
// Copy Translation
// ===============================

async function copyTranslation() {

    if (outputText.value.trim() === "") {

        showToast("Nothing to copy.", "error");
        return;

    }

    try {

        await navigator.clipboard.writeText(outputText.value);

        showToast("Translation copied successfully!", "success");

    }

    catch (error) {

        console.error(error);

        showToast("Unable to copy.", "error");

    }

}


// ===============================
// Clear Text
// ===============================

function clearText() {

    inputText.value = "";
    outputText.value = "";

}


// ===============================
// Speak Translation
// ===============================

function speakTranslation() {

    if (outputText.value.trim() === "") {

        showToast("Nothing to speak.", "error");
        return;

    }

    const speech = new SpeechSynthesisUtterance(outputText.value);

    speech.lang = targetLanguage.value;

    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;

    window.speechSynthesis.speak(speech);

}


// ===============================
// Event Listeners
// ===============================

translateButton.addEventListener("click", translateText);

swapButton.addEventListener("click", swapLanguages);

copyButton.addEventListener("click", copyTranslation);

clearButton.addEventListener("click", clearText);

speakButton.addEventListener("click", speakTranslation);

