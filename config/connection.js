export { sequelize };

import Sequelize from "sequelize";
import 'dotenv/config';

let sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_LOCATION,
        dialect: 'mysql',
        port: 3306
    }
);