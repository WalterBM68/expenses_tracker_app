const express = require('express');
const app = express();
const hbhs = require('express-handlebars');
const bodyParser = require('body-parser');
const pgPromise = require('pg-promise');
const pgp = pgPromise();
const flash = require('express-flash');
const session = require('express-session');
const ExpensesDatabase = require('./database');
const Routes = require('./route');

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:pg123@localhost:5432/expenses_tracker';
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

app.use(
	session({
	  secret: 'secret',
	  resave: true,
	  saveUninitialized: true
	})
);
app.use(flash());

app.use(function(req, res, next){
	if(req.path === '/login' || req.path === '/register'){
		next();
	}else{
		if(!req.session.userUniqueCode){
            res.redirect('/login');
            return;
        }
		next();
	}
});

const expensesDatabase = ExpensesDatabase(db);
const routes = Routes(expensesDatabase);

// for registering the user
app.get('/', routes.homeRoute);
app.post('/users', routes.registerNewUsers);
// for login
app.get('/login', routes.getLoginInterface);
app.post('/login', routes.loginTheUser);
// for expenses
app.get('/expenses', routes.getExpenses);
app.post('/expenses', routes.countUsersExpenses);
app.get('/view_expenses', routes.showUserExpenses);
app.get('/logout', routes.logingout);

const PORT = process.env.PORT || 2000
app.listen(PORT, function(){
    console.log('The app has started on port number: ', PORT);
});