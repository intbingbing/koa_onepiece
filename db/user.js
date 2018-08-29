const DBBase = require('./DBBase')

async function getUserByName( username ){
    return await DBBase.select('employee', `employee_username='${username}'`)
}

async function getUserById( user_id ){
    return await DBBase.select('employee', `employee_id='${user_id}'`)
}

module.exports = {
    getUserByName,
    getUserById
}
