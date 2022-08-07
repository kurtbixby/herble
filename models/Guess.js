export { Guess };

import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/connection.js';

class Guess extends Model {};

Guess.init(
    {
        id: {
            type: DataTypes.INTEGER, 
            allowNull: false, 
            primaryKey: true, 
            autoIncrement: true,
        },
        guessNumber: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        guess: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
      sequelize, 
      timestamps: false, 
      freezeTableName: true,
      underscored: true, 
      modelName: 'guess',
    }
);