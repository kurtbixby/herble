import path from 'path';
import express from 'express';
import { router } from './controllers/index.js';
import { sequelize } from './config/connection.js';
import exphbs from 'express-handlebars';
import { helpers } from './public/assets/js/helpers.js';



const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static('public'));



const hbs = exphbs.create({helpers});
app.engine(
  'handlebars',
  hbs.engine)

app.set("view engine", "handlebars");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));
app.use(router);

sequelize.sync();
app.listen(PORT, () => console.log('Now listening'));
