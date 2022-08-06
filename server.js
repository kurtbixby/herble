import path from 'path';
import express from 'express';
import { router } from './controllers/index.js';
import { sequelize } from './config/connection.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));

app.use(router);

sequelize.sync();
app.listen(PORT, () => console.log('Now listening'));
