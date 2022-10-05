
module.exports = function expensesDatabase(db){
    const storeUsersInfo = async (firstname, lastname, email, code) =>{
        const user = await db.oneOrNone('select * from users where firstname = $1;', [firstname]);
        if(user === null){
            await db.none('insert into users (firstname, lastname, email, code) values ($1, $2, $3, $4);', [firstname, lastname, email, code]);
        }
    }
    const getStoredUsers = async (firstname) =>{
        const user = await db.oneOrNone('select count(*) from users where firstname = $1;', [firstname]);
        return user;
    }
    const getUniqueCodeOfTheUser = async (code) => {
        const uniqueCode = await db.oneOrNone('select * from users where code = $1;', [code]);
        return uniqueCode;
    }
    const storeUsersExpenses = async (amount, date, user, category) => {
        const dateOfExpense = await db.oneOrNone('select expense_date from expenses where expense_date = $1;', [date]);
        if(dateOfExpense === null){
            await db.none('insert into expenses (amount, expense_date, user_id, category_id) values ($1, $2, $3, $4);', [amount, date, user, category]);
        }
    }
    
    const getCategory = async () =>{
        const description = await db.manyOrNone('select * from category order by description asc;');
        return description;
    }
    const getUsersExpenses = async (userID) =>{
        const userExpense = await db.manyOrNone(`select *, TO_CHAR(expense_date, 'Day') as day from expenses 
            join category
                on expenses.category_id = category.id 
            join users 
                on users.id = expenses.user_id
            where users.id = $1;`, [userID]);
        return userExpense;
    }
    const countAllTheExpenses = async () => {
        const answer = await db.one('select SUM(amount) from expenses;');
        return answer.sum;
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
        getUniqueCodeOfTheUser,
        getCategory,
        getUsersExpenses,
        countAllTheExpenses,
        deleteUsersDetails,
        deleteExpenses
    }
}