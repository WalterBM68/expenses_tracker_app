
module.exports = function expensesDatabase(db){
    const storeUsersInfo = async (firstname, lastname, email) =>{
        const user = await db.oneOrNone('select * from users where firstname = $1;', [firstname]);
        if(user === null){
            await db.manyOrNone('insert into users (firstname, lastname, email) values ($1, $2, $3);', [firstname, lastname, email]);
        }
    }
    const storeUsersExpenses = async (amount, date) => {
        const dateOfExpense = await db.oneOrNone('select date from expenses where date = $1;', [date]);
        let slice = date.slice(0, 2);
        const theUser = await db.oneOrNone('select id from users where firstname = $1;', [slice]);
        const theCategory = await db.manyOrNone('select id from category where description = $1;', [slice]);
        if(dateOfExpense === null && theUser !== null && theCategory !== null){
            await db.manyOrNone('insert into expenses (amount, user_id, category_id, date) values ($1, $2, $3, $4);', [amount, theUser.id, theCategory.id, date]);
        }
    }
    const getStoredUsers = async () =>{
        const users = await db.manyOrNone('select * from users;');
        return users;
    }
    const getUsersExpenses = async () =>{
        const userExpense = await db.manyOrNone('select users.firstname, category.description from users INNER JOIN expenses ON expenses.user_id = users.id INNER JOIN category ON category.id = expenses.category_id;');
        return userExpense;
    }
    const deleteUsersDetails = async () =>{
        await db.none('delete from users;');
    }
    const deleteExpenses = async () =>{
        await db.none('delete from expenses;');
    }
    return{
        storeUsersInfo,
        storeUsersExpenses,
        getStoredUsers,
        getUsersExpenses,
        deleteUsersDetails,
        deleteExpenses
    }
}