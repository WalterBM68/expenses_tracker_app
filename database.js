
module.exports = function expensesDatabase(db){
    const storeUsersInfo = async () =>{

    }
    const storeUsersExpenses = async () => {

    }
    const getUsersExpenses = async () =>{

    }
    const deleteUsersDetails = async () =>{
        await db.none('delete from users;');
    }
    return{
        storeUsersInfo,
        storeUsersExpenses,
        getUsersExpenses,
        deleteUsersDetails
    }
}