import { getHerble, getPlants, sendGuess, sendResult } from "./requests.js";

const HERBLE_FORM = document.getElementById('herble-form');
const HERBLE_INPUT = HERBLE_FORM.querySelector('#herble-search');
const HERBLE_IMAGE = document.getElementById('herbleImage');
const DAY_MILLISECONDS = 86400000;

const IMAGE_BUTTONS = document.getElementsByClassName('image-button');
const IMAGE_BUTTONS_ARRAY = Array.from(IMAGE_BUTTONS);

const RESULTS_MODAL_ID = 'resultsModal';
const RESULTS_MODAL = initModal();

const MAX_AUTOCOMPLETE = 5;

const GAME_STATE_KEY = 'herble-state';
const LOCAL_STATS_KEY = 'herble-stats';

const GAME_STATUS_STRINGS = ['in-progress', 'failed', 'solved'];
const GAME_MAX_GUESSES = 6;

// August 9, 2022 (Month is 0-indexed)
const dayOne = new Date(2022, 7, 9).getTime();

const PLANTS = [];
const GAME_STATE = {};

function initModal() {
    const modalEl = document.getElementById(RESULTS_MODAL_ID);
    const options = {
        placement: 'bottom-right',
        backdropClasses: 'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40',
        onHide: () => {
            console.log('modal is hidden');
        },
        onShow: () => {
            console.log('modal is shown');
        },
        onToggle: () => {
            console.log('modal has been toggled');
        }
    };

    document.getElementById('resultsClose').addEventListener('click', hideResultsClick);

    return new Modal(modalEl, options);
}

async function init() {
    HERBLE_FORM.addEventListener('submit', makeAGuess);

    IMAGE_BUTTONS_ARRAY.forEach(e => e.addEventListener('click', selectImagePicker));

    // Load the list of plants
    fetchPlantNames(PLANTS);

    // Try to load stored game state
    await initializeGameState(GAME_STATE);

    refreshBoard(GAME_STATE);
    checkEndState(GAME_STATE);
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
    console.log('initializeGameState');
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
    emptyState.answers = fullState.answers;
    emptyState.url = fullState.url;
    emptyState.currentGuesses = fullState.currentGuesses;
    emptyState.guesses = fullState.guesses;
    emptyState.status = fullState.status;
    emptyState.currentPicture = fullState.currentPicture;
}

// How do we handle an error with the getHerble request
async function createFreshGameState(herbleNumber) {
    const todaysHerble = await getHerble(herbleNumber);

    const herbleAnswers = todaysHerble.plant.commonName.split(',').map(e => `${e} - ${todaysHerble.plant.scientificName}`);

    let gameState = {
        gameNumber: herbleNumber,
        answers: herbleAnswers,
        url: todaysHerble.plant.url,
        currentGuesses: 0,
        guesses: [],
        status: GAME_STATUS_STRINGS[0],
        currentPicture: 1,
    };
    
    console.log(gameState);
    
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
                const fullName = `${n.toLowerCase()} - ${e.scientificName.toLowerCase()}`;
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
    const gameState = GAME_STATE;
    const guess = HERBLE_INPUT.value;

    sendGuess({guess: guess, herbleNum: gameState.gameNumber, guessNum: ++gameState.currentGuesses});
    gameState.guesses.push(guess);

    if (!gameState.answers.includes(guess)) {
        // failure
        console.log('guesses:' + gameState.currentGuesses);
        if (gameState.currentGuesses === GAME_MAX_GUESSES) {
            gameState.status = GAME_STATUS_STRINGS[1];
            sendResult({number: gameState.gameNumber, success: false });
        } else {
            // Not total failure
        }
    } else {
        // correct
        gameState.status = GAME_STATUS_STRINGS[2];
        sendResult({number: gameState.gameNumber, success: true });
    }

    // IMAGE_BUTTONS_ARRAY[gameState.currentPicture - 1].removeAttribute('disabled');
    gameState.currentPicture = Math.min(gameState.currentGuesses + 1, GAME_MAX_GUESSES);
    
    saveGameState(gameState);
    refreshBoard(gameState);
    checkEndState(gameState);
}

function checkEndState(gameState) {
    // If the game is finished
    if (gameState.status && gameState.status != GAME_STATUS_STRINGS[0]) {
        HERBLE_INPUT.setAttribute('disabled', '');
        // Do things
        finishGame(gameState);
    }
}

function selectImagePicker(event) {
    event.preventDefault();
    console.log(selectImagePicker);
    const imagePicker = event.currentTarget;

    // Enable previous button
    IMAGE_BUTTONS_ARRAY[GAME_STATE.currentPicture - 1].removeAttribute('disabled');

    // Disable clicked button
    imagePicker.setAttribute('disabled', '');

    // Set new active button
    const clickedNumber = imagePicker.innerText;
    GAME_STATE.currentPicture = clickedNumber;

    saveGameState(GAME_STATE);
    refreshBoard(GAME_STATE);
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

function refreshBoard(gameState) {
    console.debug('refreshBoard')
    
    // Reveal new image picker button
    // Set that image picker to active
    for (var i = 0; i < Math.min(gameState.currentGuesses + 1, IMAGE_BUTTONS_ARRAY.length); i++) {
        IMAGE_BUTTONS_ARRAY[i].removeAttribute('hidden');
        IMAGE_BUTTONS_ARRAY[i].removeAttribute('disabled');
    }

    IMAGE_BUTTONS_ARRAY[gameState.currentPicture - 1].setAttribute('disabled', '');

    // Update image source
    HERBLE_IMAGE.src = `${gameState.url}${gameState.currentPicture}.jpg`;
}

function finishGame(gameState) {
    // Pop up the modal
    showResults(gameState);

    // Final image, stats block, share button

    // const resultsString = createResultsString(gameState);
    // navigator.clipboard.writeText(resultsString);
}

function showResults(gameState) {
    RESULTS_MODAL.show();
}

function hideResultsClick(event) {
    event.preventDefault();
    hideResults();
}

function hideResults() {
    RESULTS_MODAL.hide();
}

// This function should only be called on a finished game
// Otherwise the results are inaccurate
function createResultsString(gameState) {
    // This is hardcoded to 6 and doesn't use the MAX_GUESSES const
    const guessBlocks = ['⬛','⬛','⬛','⬛','⬛','⬛'];
    let tries = 1;
    // If the game was failed
    if (gameState.status === GAME_STATUS_STRINGS[1]) {
        tries = 'X';
        for (var i = 0; i < guessBlocks.length; i++) {
            guessBlocks[i] = '🟥';
        }
    } else { // If the game was solved
        tries = gameState.currentGuesses;

        let i = 0;
        for (; i < Math.min(gameState.currentGuesses - 1 - 1, guessBlocks.length); i++) {
            guessBlocks[i] = '🟥';
        }
        guessBlocks[i++] = '🟩';
        for (; i < guessBlocks.length; i++) {
            guessBlocks[i] = '⬛'
        }
    }

    let resultsTemplate = `Herble #${gameState.gameNumber} ${tries}/${GAME_MAX_GUESSES}\n` + guessBlocks.join(' ');
    resultsTemplate += '\nhttps://herble.app';

    return resultsTemplate;
}

init();
