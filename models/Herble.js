export { Herble };

import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/connection.js';

class Herble extends Model {};

Herble.init(
    {
        id: {
            type: DataTypes.INTEGER, 
            allowNull: false, 
            primaryKey: true, 
            autoIncrement: true,
        },
        number: {
            type: DataTypes.INTEGER, 
            allowNull: false,
            unique: true,
        }
    },
    {
      sequelize, 
      timestamps: false, 
      freezeTableName: true,
      underscored: true, 
      modelName: 'herble',
    }
);