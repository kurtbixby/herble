import path from 'path';
import express from 'express';
import { router } from './controllers/index.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));

app.use(router);
app.listen(PORT, () => console.log('Now listening'));