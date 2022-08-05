export { User, UserStats };

import { User } from './User.js';
import { UserStats } from './UserStats.js';

User.hasOne(UserStats);
UserStats.belongsTo(User);