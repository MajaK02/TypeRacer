document.addEventListener('DOMContentLoaded', function() {
    const easyTexts = [
        "The cat sat on the mat.",
        "A quick brown fox jumps over the lazy dog.",
        "She sells seashells by the seashore."
    ];

    const mediumTexts = [
        "To be or not to be, that is the question.",
        "All that glitters is not gold.",
        "A journey of a thousand miles begins with a single step."
    ];

    const hardTexts = [
        "It was the best of times, it was the worst of times.",
        "In the beginning God created the heavens and the earth.",
        "The only thing we have to fear is fear itself."
    ];

    const difficultySelect = document.getElementById('difficulty');
    const sampleTextDiv = document.getElementById('sample-text');
    const startButton = document.getElementById('start-btn');
    const retryButton = document.getElementById('retry-btn');
    const timeDisplay = document.getElementById('time');
    const userInput = document.getElementById('user-input');
    const levelDisplay = document.getElementById('level');
    const wpmDisplay = document.getElementById('wpm');
    const instructionsButton = document.getElementById('instructions-btn');

    let startTime, endTime;
    let testStarted = false;

    function getRandomText(textArray) {
        const randomIndex = Math.floor(Math.random() * textArray.length);
        return textArray[randomIndex];
    }

    function updateSampleText() {
        let selectedDifficulty = difficultySelect.value;
        let selectedText;

        if (selectedDifficulty === 'easy') {
            selectedText = getRandomText(easyTexts);
        } else if (selectedDifficulty === 'medium') {
            selectedText = getRandomText(mediumTexts);
        } else if (selectedDifficulty === 'hard') {
            selectedText = getRandomText(hardTexts);
        }

        sampleTextDiv.textContent = selectedText;
    }

    function startTest() {
        startTime = new Date();
        testStarted = true;
        startButton.disabled = true;
        retryButton.disabled = true;
        userInput.disabled = false;
        userInput.value = ''; // Clear the input area
        userInput.focus();
    }

    function stopTest() {
        endTime = new Date();
        const timeTaken = (endTime - startTime) / 1000; // time in seconds
        const wpm = calculateWPM(timeTaken);
        
        displayResults(timeTaken, wpm);

        startButton.disabled = false;
        retryButton.disabled = false;
        userInput.disabled = true;
        testStarted = false;
    }

    function retryTest() {
        updateSampleText();
        userInput.value = '';
        userInput.disabled = false;
        userInput.focus();
        startButton.disabled = false;
        retryButton.disabled = true;
        testStarted = false;
    }

    function calculateWPM(timeTaken) {
        const sampleText = sampleTextDiv.textContent.trim();
        const userText = userInput.value.trim();
        const sampleWords = sampleText.split(" ");
        const userWords = userText.split(" ");
    
        let correctWords = 0;
        for (let i = 0; i < userWords.length; i++) {
            if (userWords[i] === sampleWords[i]) {
                correctWords++;
            }
        }
    
        return Math.round((correctWords / timeTaken) * 60);
    }

    function displayResults(timeTaken, wpm) {
        timeDisplay.textContent = timeTaken.toFixed(2);
        wpmDisplay.textContent = wpm;
        const selectedDifficulty = difficultySelect.value;
        levelDisplay.textContent = selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1);
    }

    function highlightText() {
        const sampleText = sampleTextDiv.textContent.trim();
        const userText = userInput.value.trim();
        const sampleWords = sampleText.split(" ");
        const userWords = userText.split(" ");

        let highlightedText = '';

        for (let i = 0; i < sampleWords.length; i++) {
            if (userWords[i] === undefined) {
                highlightedText += `<span>${sampleWords[i]}</span> `;
            } else if (userWords[i] === sampleWords[i]) {
                highlightedText += `<span style="color: blue;">${sampleWords[i]}</span> `;
            } else {
                highlightedText += `<span style="color: red;">${sampleWords[i]}</span> `;
            }
        }

        sampleTextDiv.innerHTML = highlightedText.trim();
    }

    function handleUserInput(event) {
        if (!testStarted) {
            startTest();
        }
        highlightText();

        if (event.key === 'Enter') {
            stopTest();
        }
    }

    function showInstructions() {
        const instructionsModal = new bootstrap.Modal(document.getElementById('instructionsModal'));
        instructionsModal.show();
    }

    difficultySelect.addEventListener('change', updateSampleText);
    startButton.addEventListener('click', startTest);
    retryButton.addEventListener('click', retryTest);
    userInput.addEventListener('input', handleUserInput);
    userInput.addEventListener('keydown', handleUserInput);
    instructionsButton.addEventListener('click', showInstructions);

    // Initialize with a random text from the default difficulty level
    updateSampleText();
});