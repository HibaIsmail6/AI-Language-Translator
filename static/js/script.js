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
const historyList = document.getElementById("history-list");
const clearHistoryButton = document.getElementById("clear-history-btn");
const characterCount = document.getElementById("character-count");

// ===============================
// Loading State
// ===============================

function setLoadingState(isLoading) {

    translateButton.disabled = isLoading;
    sourceLanguage.disabled = isLoading;
    targetLanguage.disabled = isLoading;
    swapButton.disabled = isLoading;

    if (isLoading) {

        translateButton.textContent = "⏳ Translating...";

    } else {

        translateButton.textContent = "Translate";

    }

}


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
// Load Translation History
// ===============================

async function loadHistory() {

    try {

        const response = await fetch("/history");

        if (!response.ok) {

            throw new Error("Failed to load history.");

        }

        const history = await response.json();
        console.log(history);
        console.log(typeof history);
        historyList.innerHTML = "";

        if (history.length === 0) {

    historyList.innerHTML = `
        <div class="empty-history">

            <div class="empty-history-icon">
                📭
            </div>

            <p class="empty-history-title">
                No translations yet
            </p>

            <p class="empty-history-text">
                Start translating to build your history.
            </p>

        </div>
    `;

    return;

}
        history.forEach(item => {

            const historyItem = document.createElement("div");

            historyItem.dataset.id = item.id;
            historyItem.dataset.sourceText = item.source_text;
            historyItem.dataset.translatedText = item.translated_text;
            historyItem.dataset.sourceLanguage = item.source_language;
            historyItem.dataset.targetLanguage = item.target_language;

            historyItem.className = "history-item";

            historyItem.innerHTML = `

    <button class="delete-history-btn">
        ✕
    </button>
    
    <p class="history-language">
        🌐 ${languages[item.source_language]} → ${languages[item.target_language]}
    </p>

    <p class="history-source">
        ${item.source_text}
    </p>

    <p class="history-arrow">
        →
    </p>

    <p class="history-target">
        ${item.translated_text}
    </p>

`;
            const deleteButton = historyItem.querySelector(".delete-history-btn");
            deleteButton.addEventListener("click", async function (event) {

    event.stopPropagation();

    const confirmDelete = confirm("Delete this translation?");

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(`/history/${historyItem.dataset.id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Unable to delete translation.");
        }

        historyItem.remove();

        showToast("Translation deleted.", "success");

    }

    catch (error) {

        console.error(error);

        showToast(error.message, "error");

    }

});

            historyItem.addEventListener("click", restoreHistoryItem);

            historyList.appendChild(historyItem);

        });

    }

    catch (error) {

        console.error(error);

        showToast("Unable to load history.", "error");

    }

}
// ===============================
// Translate Text
// ===============================

async function translateText() {

    const text = inputText.value.trim();

    if (text === "") {

        showToast("Please enter text to translate.", "error");
        return;

    }

    setLoadingState(true);

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
        loadHistory();
    }
    catch (error)
    {
        console.error(error);
        outputText.value = "";
        showToast(error.message, "error");
    }

    finally {

    setLoadingState(false);

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
// Restore History Item
// ===============================

function restoreHistoryItem(event) {

    const historyItem = event.currentTarget;

    inputText.value = historyItem.dataset.sourceText;

    outputText.value = historyItem.dataset.translatedText;

    sourceLanguage.value = historyItem.dataset.sourceLanguage;

    targetLanguage.value = historyItem.dataset.targetLanguage;

    showToast("Translation restored.", "success");

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

    updateCharacterCount();

}

// ===============================
// Character Counter
// ===============================

function updateCharacterCount() {

    characterCount.textContent = inputText.value.length;

}


// ===============================
// Clear Translation History
// ===============================

async function clearHistory() {

    const confirmClear = confirm("Delete all translation history?");

    if (!confirmClear) {
        return;
    }

    try {

        const response = await fetch("/history", {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Unable to clear history.");
        }

        loadHistory();

        showToast("History cleared successfully!", "success");

    }

    catch (error) {

        console.error(error);

        showToast(error.message, "error");

    }

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
// Keyboard Shortcut
// Ctrl + Enter to Translate
// ===============================

inputText.addEventListener("keydown", function (event) {

    if (event.ctrlKey && event.key === "Enter") {

        event.preventDefault();

        translateText();

    }

});

// ===============================
// Event Listeners
// ===============================

translateButton.addEventListener("click", translateText);
swapButton.addEventListener("click", swapLanguages);
copyButton.addEventListener("click", copyTranslation);
clearButton.addEventListener("click", clearText);
speakButton.addEventListener("click", speakTranslation);
clearHistoryButton.addEventListener("click", clearHistory);
inputText.addEventListener("input", updateCharacterCount);

loadHistory();
updateCharacterCount();

