export { Plant };

import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/connection.js';

class Plant extends Model {};

Plant.init(
    {
      id: {
        type: DataTypes.INTEGER, 
        allowNull: false, 
        primaryKey: true, 
        autoIncrement: true,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      commonName: {
        type: DataTypes.STRING, 
        allowNull: true,
        defaultValue: null,
      },
      scientificName: {
        type: DataTypes.STRING, 
        allowNull: true, 
        defaultValue: null,
      },
    },
    {
      sequelize, 
      timestamps: false, 
      freezeTableName: true,
      underscored: true, 
      modelName: 'plant',
    }
);