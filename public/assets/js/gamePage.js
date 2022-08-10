import { getHerble, getPlants, sendGuess, sendResult } from "./requests";

const HERBLE_FORM = document.getElementById('herbleForm');
const HERBLE_IMAGE = document.getElementById('herbleImage');
const DAY_MILLISECONDS = 86400000;

const MAX_AUTOCOMPLETE = 5;

const GAME_STATE_KEY = 'herble-state';
const LOCAL_STATS_KEY = 'herble-stats';

const GAME_STATUS_STRINGS = ['in-progress', 'failed', 'solved'];
const GAME_MAX_GUESSES = 6;

// August 9, 2022 (Month is 0-indexed)
const dayOne = new Date(2022, 7, 9).getTime();

const PLANTS = [];
const GAME_STATE = {};

function init() {
    HERBLE_FORM.addEventListener('submit', makeAGuess);

    // Load the list of plants
    fetchPlantNames(PLANTS);

    // Try to load stored game state
    initializeGameState(GAME_STATE);

    refreshBoard(GAME_STATE);
}

// Game State
// {
//     gameNumber: NUMBER,
//     answer: STRING,
//     url: STRING,
//     currentGuesses: NUMBER,
//     guesses: [STRING],
//     status: STRING,
//     currentPicture: NUMBER
// }

async function initializeGameState(gameState) {
    const herbleNumber = calculateHerbleNumber(dayOne);
    const stateString = localStorage.getItem(GAME_STATE_KEY);
    if (stateString == null) {
        // Fresh game state
        const freshState = await createFreshGameState(herbleNumber);
        fillGameState(gameState, freshState);
    } else {
        try {
            const savedState = JSON.parse(stateString)
            if (herbleNumber != savedState.gameNumber) {
                // Fresh state
                const freshState = await createFreshGameState(herbleNumber);
                fillGameState(gameState, freshState);
                // Break the streak
            } else {
                fillGameState(gameState, savedState);
            }
        } catch (err) {
            // Initialize to fresh state
            const freshState = await createFreshGameState(herbleNumber);
            fillGameState(gameState, freshState);
        }
    }

    return gameState;
}

function fillGameState(emptyState, fullState) {
    emptyState.gameNumber = fullState.gameNumber;
    emptyState.answer = fullState.answer
    emptyState.url = fullState.url;
    emptyState.currentGuesses = fullState.currentGuesses;
    emptyState.guesses = fullState.guesses;
    emptyState.status = fullState.status;
    emptyState.currentPicture = fullState.currentPicture;
}

// How do we handle an error with the getHerble request
async function createFreshGameState(herbleNumber) {
    const todaysHerble = await getHerble(herbleNumber);

    let gameState = {
        gameNumber: herbleNumber,
        answer: todaysHerble.plant.name,
        url: todaysHerble.plant.url,
        currentGuesses: 0,
        guesses: [],
        status: GAME_STATUS_STRINGS[0],
        currentPicture: 1,
    };
    
    return gameState;
}

function saveGameState(gameState) {
    const stateString = JSON.stringify(gameState);
    localStorage.setItem(GAME_STATE_KEY, stateString);
}

// Fills an array with plant names
async function fetchPlantNames(plantsArray) {
    const rawPlants = await getPlants();

    rawPlants.forEach(e => {
        const commonNames = e.commonName.split(',');
        commonNames.forEach(n => {
            if (n != '') {
                const fullName = `${n.commonName.toLowerCase()} - ${n.scientificName.toLowerCase()}`;
                PLANTS.push(fullName);
            }
        });
    });
}

function calculateHerbleNumber(startingDay) {
    return Math.ceil((Date.now() - startingDay) / DAY_MILLISECONDS);
}

function makeAGuess(event) {
    event.preventDefault();
    const guess = HERBLE_FORM.textContent;

    sendGuess({guess: guess, herbleNum: GAME_STATE.gameNumber, guessNum: ++GAME_STATE.currentGuesses});
    GAME_STATE.guesses.push(guess);

    if (guess != GAME_STATE.answer) {
        // failure
        if (GAME_STATE.currentGuesses === GAME_MAX_GUESSES) {
            GAME_STATE.status = GAME_STATUS_STRINGS[1];
            sendResult({number: GAME_STATE.gameNumber, success: false });
        } else {
        }
    } else {
        // correct
        GAME_STATE.status = GAME_STATUS_STRINGS[2];
        sendResult({number: GAME_STATE.gameNumber, success: true });
    }
    
    saveGameState(GAME_STATE);
    refreshBoard();
}

function selectImagePicker(event) {
    event.preventDefault();
    
    const imagePicker = event.currentTarget;

    // Check if is active button
    // Change old/existing active button
    // Set new active button

    const number = imagePicker.dataset.number;

    HERBLE_IMAGE.src = `${GAME_STATE.url}/${number}`;
}

function showAutoComplete(event) {
    const typed = HERBLE_FORM.textContent;
    const suggestions = autoCompleteSuggestions(typed);

    const separatedWords = [];
    for (let i = 0; i < MAX_AUTOCOMPLETE; i++) {
        separatedWords.push(highlightWord(suggestions[i]));
    }

    // Render separated words into the new autocomplete box
}

function autoCompleteSuggestions(typed) {
    const suggestions = PLANTS.filter(e => e.includes(typed));
    return suggestions;
}

function highlightWord(word, substr) {
    const highlightStart = word.indexOf(substr);
    const highlightEnd = highlightStart + substr.length;
    return {
        start: word.slice(0, highlightStart),
        highlight: word.slice(highlightStart, highlightEnd),
        end: word.slice(highlightEnd)
    };
}

function refreshBoard() {
    // Reveal new image picker button
    // Set that image picker to active
    // Update image source
    // Update current image variable

    // If the game is finished
    if (GAME_STATE.status && GAME_STATE.status != GAME_STATUS_STRINGS[0]) {
        // Do things
        finishGame();
    }
}

function finishGame() {

}


init();