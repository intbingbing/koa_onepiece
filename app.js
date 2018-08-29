const Koa = require('koa')
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-better-body')
const logger = require('koa-logger')
const Router = require('koa-router')
const token = require('./utils/token')
const koajwt = require('koa-jwt')
const cors = require('koa2-cors')

const app = new Koa()
const router = new Router()
const UNLESS_LIST = [
    /^\/user\/login/,
    /^\/ping/
] 

app.use(cors({
    origin: function(ctx) {
    //   if (ctx.url === '/ping') {
    //     return 'http://localhost:3010';
    //   }
      return ctx.header.origin
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'token', 'x-requested-with'],
}));

// error handler
//onerror(app)

// middlewares
// app.use(bodyparser({
//   enableTypes:['json', 'form', 'text']
// }))
app.use(bodyparser());

app.use(json())
//app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// 自定义中间处理
app.use(async (ctx, next) => {
    ctx.request.body = ctx.request.fields
    await next()
    //console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

router.use('/api', require('./routes/api').routes())
router.use('/user', require('./routes/user').routes())
router.use('/ping', require('./routes/ping').routes())

app.use(require('./koa-middle'))
app.use(koajwt({
        secret: token.TOKEN_SECRET,  
        key: 'user',
        getToken: ctx => ctx.request.headers.token
    }).unless({ 
        path: UNLESS_LIST
    })
)

// routes
app.use(router.routes()).use(router.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});

module.exports = app
