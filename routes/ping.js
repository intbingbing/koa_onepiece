const router = require('koa-router')()
const DBBase = require('../db/DBBase')

router.get('/', async (ctx, next) => {
    let user = {msg: '可达！'}
    ctx.json = user;
})

router.post('/', async (ctx, next) => {
    let user = {msg: '可达！'}
    ctx.json = user;
})
module.exports = router
