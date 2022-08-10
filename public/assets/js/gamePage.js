import { getHerble, getPlants, sendGuess, sendResult } from "./requests.js";

const HERBLE_FORM = document.getElementById('herble-form');
const HERBLE_INPUT = HERBLE_FORM.querySelector('#herble-search');
const HERBLE_IMAGE = document.getElementById('herbleImage');
const AUTO_COMPLETE_LIST = document.getElementById('auto-complete-list');

const PAST_GUESSES_HOLDER = document.getElementById('past-guesses');

const DAY_MILLISECONDS = 86400000;

const IMAGE_BUTTONS = document.getElementsByClassName('image-button');
const IMAGE_BUTTONS_ARRAY = Array.from(IMAGE_BUTTONS);

const RESULTS_MODAL_ID = 'resultsModal';
const RESULTS_MODAL = initModal();

const STATS_EL = document.getElementById('stats-block');

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
        placement: 'top-center',
        // backdropClasses: 'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40',
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
    HERBLE_INPUT.value = '';
    HERBLE_INPUT.addEventListener('input', showAutoComplete);
    document.getElementById('share-results-button').addEventListener('click', copyToClipboard);

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
    const typed = HERBLE_INPUT.value.trim();
    if (typed == '') {
        AUTO_COMPLETE_LIST.setAttribute('hidden', '');
        HERBLE_INPUT.value = typed;
        return;
    }
    AUTO_COMPLETE_LIST.innerHTML = '';

    const suggestions = autoCompleteSuggestions(typed);

    const separatedWords = [];
    for (let i = 0; i < Math.min(suggestions.length, MAX_AUTOCOMPLETE); i++) {
        separatedWords.push(highlightWord(suggestions[i], typed));
    }

    if (separatedWords.length < 1) {
        return;
    }

    // Render separated words into the new autocomplete box
    separatedWords.forEach(word => {
        // create element for word
        const wordElement = createAutoCompleteWordHTML(word);
        wordElement.addEventListener('click', setHerbleInput);
        // append to list
        AUTO_COMPLETE_LIST.appendChild(wordElement);
    })
    AUTO_COMPLETE_LIST.removeAttribute('hidden');
}

function createAutoCompleteWordHTML(word) {
    const element = document.createElement("li");
    element.innerHTML = `${word.start}<mark>${word.highlight}</mark>${word.end}`;
    return element;
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

function setHerbleInput(event) {
    event.preventDefault();
    console.log(event.currentTarget);
    HERBLE_INPUT.value = event.currentTarget.textContent;
    HERBLE_INPUT.focus();
}

function refreshBoard(gameState) {
    const gameFinished = gameState.status != GAME_STATUS_STRINGS[0];

    // Reveal new image picker button
    // Set that image picker to active
    const buttonLimit = gameFinished ? IMAGE_BUTTONS_ARRAY.length : Math.min(gameState.currentGuesses + 1, IMAGE_BUTTONS_ARRAY.length);

    for (var i = 0; i < buttonLimit; i++) {
        IMAGE_BUTTONS_ARRAY[i].removeAttribute('hidden');
        IMAGE_BUTTONS_ARRAY[i].removeAttribute('disabled');
    }

    IMAGE_BUTTONS_ARRAY[gameState.currentPicture - 1].setAttribute('disabled', '');

    // Update image source
    HERBLE_IMAGE.src = `${gameState.url}${gameState.currentPicture}.jpg`;

    // Append guess to the bottom
    PAST_GUESSES_HOLDER.innerHTML = '';
    gameState.guesses.forEach((g, i) => {
        let correct = false;
        if (gameState.status == GAME_STATUS_STRINGS[2] && i == gameState.currentGuesses - 1) {
            correct = true;
        }
        const guessElement = createGuessHtml(g, correct);
        PAST_GUESSES_HOLDER.appendChild(guessElement);
    });
}

function createGuessHtml(guess, correct) {
    const element = document.createElement("div");
    const icon = correct ? '✔' : '❌';
    element.innerHTML = `${icon} ${guess}`;
    element.classList.add(['text-stone-900', 'object-center', 'p-2.5', 'ml-2', 'text-sm', 'font-medium', 'text-white', 'bg-emerald-200', 'rounded-lg', 'border', 'border-orange-700', 'hover:bg-orange-700', 'focus:ring-4', 'focus:outline-none', 'focus:ring-orange-300', 'dark:bg-neutral-800', 'dark:hover:bg-orange-700', 'dark:focus:ring-orange-800', 'dark:text-slate-400']);
    return element;
}

function finishGame(gameState) {
    const localStats = loadLocalStats();
    updateLocalStats(localStats, gameState);

    // Populate modal
    const statsElements = STATS_EL.querySelectorAll('.stats-value');

    statsElements[0].textContent = localStats.streak;
    statsElements[1].textContent = localStats.highestStreak;
    statsElements[2].textContent = localStats.gamesPlayed;
    statsElements[3].textContent = Math.floor(100 * localStats.gamesSolved / localStats.gamesPlayed) + '%';

    // Pop up the modal
    showResults(gameState);

}

// {
//     streak: NUMBER,
//     highestStreak: NUMBER,
//     gamesPlayed: NUMBER,
//     gamesSolved: NUMBER,
//     lastSolved: NUMBER
// }

function loadLocalStats() {
    const statsString = localStorage.getItem(LOCAL_STATS_KEY);
    if (statsString == null) {
        return {
            streak: 0,
            highestStreak: 0,
            gamesPlayed: 0,
            gamesSolved: 0,
            lastSolved: 0
        };
    } else {
        return JSON.parse(statsString);
    }
}

function updateLocalStats(localStats, gameState) {
    if (localStats.lastSolved == gameState.gameNumber) {
        return;
    }

    const wonGame = gameState.status === GAME_STATUS_STRINGS[2];
    localStats.gamesPlayed++;
    if (wonGame) {
        localStats.gamesSolved++;
        if (gameState.gameNumber == localStats.lastSolved + 1) {
            localStats.streak++;
        } else {
            localStats.streak = 1;
        }
        localStats.highestStreak = Math.max(localStats.streak, localStats.highestStreak);
        localStats.lastSolved = gameState.gameNumber;
    } else {
        localStats.streak = 0;
    }
    localStorage.setItem(LOCAL_STATS_KEY, JSON.stringify(localStats));
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

function copyToClipboard(event) {
    event.preventDefault();

    const resultsString = createResultsString(GAME_STATE);
    navigator.clipboard.writeText(resultsString);
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
        for (; i < Math.min(gameState.currentGuesses - 1, guessBlocks.length); i++) {
            guessBlocks[i] = '🟥';
        }
        guessBlocks[i++] = '🟩';
        for (; i < guessBlocks.length; i++) {
            guessBlocks[i] = '⬛'
        }
    }

    let resultsTemplate = `Herble #${gameState.gameNumber} ${tries}/${GAME_MAX_GUESSES}\n` + guessBlocks.join(' ');
    resultsTemplate += '\nhttps://herble.herokuapp.com/';

    return resultsTemplate;
}

init();
