
module.exports = Routes = (expenseDB) => {
    //Home route
    const homeRoute = (req, res) => {
        res.render('index')
    }
    return{
        homeRoute
    }
}