export { UserStats };

import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/connection.js';

class UserStats extends Model {};

UserStats.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        streak: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        highestStreak: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        gamesPlayed: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        gamesSolved: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        lastCompleted: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0
        }
    },
    {
        name: {
            singular: 'userStats',
            plural: 'userStats'
        },
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'user_stats',
    }
);
