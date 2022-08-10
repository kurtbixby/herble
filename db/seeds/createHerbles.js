import { Plant, Herble } from '../../models/index.js';

import { sequelize } from '../../config/connection.js';
import { Op, Sequelize } from 'sequelize';

async function main() {
    const plants = await Plant.findAll({
        where: {
            url: {
                [Op.not]: null
            }
        }
    });

    const randomPlants = shuffle(plants);

    const herbleData = [];
    randomPlants.forEach((e, i) => {
        herbleData.push({ number: i + 1, plantId: e.id });
    });

    console.log(herbleData);

    // await Herble.bulkCreate(herbleData);
}

async function addNewPlants(startingId) {
    const newPlants = await Plant.findAll({
        where: {
            url: {
                [Op.not]: null
            },
            id: {
                [Op.gte]: startingId
            }
        }
    });

    const randomPlants = shuffle(newPlants);

    const maxHerbleNumber = await Herble.findAll({
        attributes: [Sequelize.fn('max', Sequelize.col('number'))],
        raw: true
    });

    const herbleData = [];
    randomPlants.forEach((e, i) => {
        herbleData.push({ number: maxHerbleNumber + i + 1, plantId: e.id });
    });

    console.log(herbleData);
}

async function getHerblePlants() {
    const herbleQuery = await Herble.findAll({
        include: {
            model: Plant,
        }
    });

    // const raw = herbleQuery.get({ plain: true });
    herbleQuery.forEach(e => {
        console.log(`Herble Num:${e.number}`);
        console.log(`Plant Id:${e.plantId}`);
        console.log(`Common Name:${e.plant.commonName}`);
        console.log(`Scientific Name:${e.plant.scientificName}`);
    })
    // console.log(herbleQuery);
}

// Taken from stackoverflow
// Shuffles an array, used to random the order of the members
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
}

getHerblePlants();