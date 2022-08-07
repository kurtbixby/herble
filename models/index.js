export { Guess, Herble, Plant, User, UserStats };

import { Guess } from './Guess.js';
import { Herble } from './Herble.js';
import { Plant } from './Plant.js';
import { User } from './User.js';
import { UserStats } from './UserStats.js';

User.hasOne(UserStats);
UserStats.belongsTo(User);

Plant.hasOne(Herble);
Herble.belongsTo(Plant);

// If the herble is deleted, set the lastSolved field to null
// If the herble id is changed, update the lastSolved to follow it
Herble.hasMany(UserStats, { foreignKey: 'lastSolved' });
UserStats.belongsTo(Herble, { foreignKey: 'lastSolved' });

User.hasMany(Guess);
Guess.belongsTo(User);
Herble.hasMany(Guess);
Guess.belongsTo(Herble);
