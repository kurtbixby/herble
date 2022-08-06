export { Game };

import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/connection.js';

class Game extends Model {};


Game.init(
    {
      number: {
        type: DataTypes.INTEGER,
      },
      chosenAnswer: {
        type: DataType.STRING,
      },
      success: {
        type: DataTypes.BOOLEAN, 
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