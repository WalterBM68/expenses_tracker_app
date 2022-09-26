const express = require('express');
const app = express();
const hbhs = require('express-handlebars');
const bodyParser = require('body-parser');
const pgPromise = require('pg-promise');
const pgp = pgPromise();
const ExpensesDatabase = require('./database');
const Routes = require('./route');

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:pg123@localhost:5432/expenses_tracker;';
const config = {
  connectionString: DATABASE_URL
}
if (process.env.NODE_ENV == 'production') {
	config.ssl = { 
		rejectUnauthorized : false
	}
}
const db = pgp(config);

app.engine("handlebars", hbhs.engine({ extname: "handlebars", layoutsDir: __dirname + '/views/layouts' }));
app.set("view engine", "handlebars");
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const expensesDatabase = ExpensesDatabase(db);
const routes = Routes(expensesDatabase);

app.get('/', routes.homeRoute);

const PORT = process.env.PORT || 2000
app.listen(PORT, function(){
    console.log('The app has started on port number: ', PORT);
});