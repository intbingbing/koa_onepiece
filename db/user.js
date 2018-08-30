const DBBase = require('./DBBase')

async function getUserByName (username) {
    return await DBBase.select('employee', `employee_username='${username}'`)
}

async function getUserById (user_id) {
    return await DBBase.select('employee', `employee_id='${user_id}'`)
}

async function updateAvatar (user_id, url) {
    return await DBBase.update(
        'employee',
        {employee_avatar: url},
        `employee_id='${user_id}'`
    )
}

module.exports = {
    getUserByName,
    getUserById,
    updateAvatar
}
