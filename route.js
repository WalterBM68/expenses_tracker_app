const express = require('express');
const app = express();
const flash = require('express-flash');
const session = require('express-session');
const ShortUniqueId = require('short-unique-id');
const uid = new ShortUniqueId({ length: 6 });

app.use(
	session({
	  secret: 'secret',
	  resave: true,
	  saveUninitialized: true
	})
);
app.use(flash());

module.exports = Routes = (expenseDB) => {
    let globalCode = '';
    // get the register interface
    const homeRoute = async (req, res) => {
        await expenseDB.getStoredUsers();
        res.render('index')
    }
    // register the user and generate the unique code
    const registerNewUsers = async (req, res) => {
        let {name, lastname, email} = req.body;
        if(name && lastname){
            name = name.toLowerCase();
            lastname = lastname.toLowerCase();
            let code = uid();
            globalCode = code;
            const theUser = await expenseDB.getStoredUsers(name);
            if(Number(theUser.count) !== 0){
                req.flash('error', `${name} already exists`);
            }else{
                await expenseDB.storeUsersInfo(name, lastname, email, code);
                req.flash('success', 'You have registered! use this code to login : ' + globalCode);
            }
        }else{
            req.flash('error', 'Please register with your details below');
        }
        res.redirect('/');
    }
    // get the login interface
    const getLoginInterface = async (req, res) => {
        res.render('login');    
    }
    // login of the user using the unique code
    const loginTheUser = async (req, res) => {
        const {code} = req.body;
        if(code){
            const userUniqueCode = await expenseDB.getUniqueCodeOfTheUser(code);
            if(userUniqueCode){
                req.session.userUniqueCode = userUniqueCode;
                res.redirect('/expenses');
                return;
            }
        }else{
            req.flash('error', 'This code is invalid');
            res.render('login');
        } 
    }
    // show the expenses interface
    const getExpenses = async (req, res) => {
        const categories = await expenseDB.getCategory();
        res.render('expenses',{
            userUniqueCode: req.session.userUniqueCode,
            categories,
        });
    }
    // enter the user expenses including the date & amount
    const countUsersExpenses = async (req, res) => {
        const userID = req.session.userUniqueCode.id;
        const {date, amount, description} = req.body;
        if(date && description){
            await expenseDB.storeUsersExpenses(amount, date, userID, description);
            req.flash('success', 'Expenses has been added');
        }else{
            req.flash('error', 'Please select a description, date & amount');
        }
        res.redirect('/expenses');
    }
    // show the user his/her expenses
    const showUserExpenses = async (req, res) => {
        const theExpenses = await expenseDB.getUsersExpenses(req.session.userUniqueCode.id);
        const amount = await expenseDB.countAllTheExpenses();
        console.log('the amount ' + amount);
        res.render('view_expenses',{
            theExpenses,
            // amount
        });
    }
    // log out
    const logingout = (req, res) => {
        delete req.session.userUniqueCode;
        res.redirect('/login');
    }
    const deleteUsers = async (req, res) => {
        await expenseDB.deleteUsersDetails();
        res.redirect('/');
    }
    const deleteAllExpenses = async (req, res) => {
        await expenseDB.deleteExpenses();
        res.redirect('/');
    }
    return{
        homeRoute,
        registerNewUsers,
        getLoginInterface,
        loginTheUser,
        getExpenses,
        countUsersExpenses,
        showUserExpenses,
        logingout,
        deleteUsers,
        deleteAllExpenses
    }
}