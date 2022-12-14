export { getHerble, getPlants, sendGuess, sendResult };

async function sendGuess(herbleGuess) {
    const url = '/api/herble/data';

    try {
        const response = await (await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(herbleGuess)
        })).json();
        console.info(response);
    } catch (err) {
        console.error(err);
    }
}

async function sendResult(herbleResult) {
    const url = '/api/herble/';

    try {
        const response = await (await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(herbleResult)
        })).json();
        console.info(response);
    } catch (err) {
        console.error(err);
    }
}

async function getHerble(number) {
    const fetchUrl = `/api/herble/${number}`;
    try {
        const herble = await (await fetch(fetchUrl)).json();

        console.log(herble);

        return herble;
    } catch (err) {

    }
}

async function signupAccount() {

}

async function loginUser() {

}

async function getStats() {

}

async function getPlants() {
    const fetchUrl = '/api/plants';
    try {
        const plants = await (await fetch(fetchUrl)).json();

        console.log(plants);

        return plants;
    } catch (err) {

    }
}