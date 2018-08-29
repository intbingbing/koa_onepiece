const Router = require('koa-router')
const router = new Router()
const UserDB = require('../db/user')
const TokenManager = require('../utils/token')
const custom = require('../utils/custom')

router.post('/login', async (ctx, next) => {
	let user = ctx.request.body.user
    let secret = ctx.request.body.pass
    let userData = await UserDB.getUserByName(user)
	if (userData) {
        if(userData.employee_secret === secret){
            userData = _formatKey(userData)
            delete(userData.secret)
            userData.token = TokenManager.generateToken(userData.id)
            ctx.json = userData
        }else{
            ctx.error = {
                code: 400112,
                message: '密码错误'
            }
        }
	} else {
        ctx.error = {
            code: 400111,
            message: '用户不存在'
        }
	}
})

router.get('/quicklogin', async (ctx, next) => {
    let userid = ctx.state.user.userid
    let userData = await UserDB.getUserById(userid)
    if(userData){            
        userData = _formatKey(userData)
        delete(userData.secret)
        userData.token = ctx.header.token
        ctx.json = userData
    }else{
        ctx.error = {code: 400510, msg: 'token用户已被删除！'}
    }
})

router.post('/avatar', async (ctx, next) => {
    const file = ctx.request.files[0]
    const path = `./public/images/${ctx.state.user.userid}.png`
    try {
        const data = await custom.readFile(file.path)
        await custom.writeFile(path, data)
        ctx.json = {
            path: `/images/${ctx.state.user.userid}.png`
        }
    } catch (err) {
        ctx.error = {code: 400520, msg: '读写错误！'}
        throw err
    }
})

_formatKey = obj => {
    let newObj = {}
    Object.keys(obj).map(val => {
        newObj[val.substr(9)] = obj[val]
    })
    return newObj
}

module.exports = router
