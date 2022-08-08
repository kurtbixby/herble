import plantData from './plantData.json' assert {type: 'json'};
import { Plant } from '../../models/index.js';

import { sequelize } from '../../config/connection.js';

async function main() {
    console.log(plantData);
    await sequelize.sync();
    const plants = await Plant.bulkCreate(plantData);
}

main();