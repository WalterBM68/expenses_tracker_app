
module.exports = Routes = (expenseDB) => {
    //Home route
    const homeRoute = async (req, res) => {
        await expenseDB.getStoredUsers();
        res.render('index')
    }
    const storeAllNames = async (req, res) => {
        const name = req.body.name;
        const lastname = req.body.lastname;
        const email = req.body.email;
        await expenseDB.storeUsersInfo(name, lastname, email);
        res.redirect('/');
    }
    const getExpenses = async (req, res) => {
        const expenses = await expenseDB.getUsersExpenses();
        res.render('expenses');
    }
    const countUsersExpenses = async (req, res) => {
        const date = req.body.date;
        const amount = req.body.amount;
        await expenseDB.storeUsersExpenses(amount, date);
        res.redirect('/expenses');
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
        storeAllNames,
        getExpenses,
        countUsersExpenses,
        deleteUsers,
        deleteAllExpenses
    }
}