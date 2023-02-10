const jsonServer = require('json-server')
const server = jsonServer.create()
const clone = require('clone')
const data = require('./productos.json')

const isProductionEnv = process.env.NODE_ENV === 'production';

// For mocking the POST request, POST request won't make any changes to the DB in production environment
const router = jsonServer.router(isProductionEnv ? 'productos.json' : 'productos.json', {
    _isFake: isProductionEnv
})
const middlewares = jsonServer.defaults()

server.use(middlewares)

server.use(jsonServer.rewriter({
    '/api/*': '/$1',
    '/blog/:resource/:id/show': '/:resource/:id'
}))

server.use((req, res, next) => {
    if (req.path !== '/')
        router.db.setState(clone(data))
    next()
})

server.use(router)
server.listen(process.env.PORT || 8000, () => {
    console.log('JSON Server is running')
})

// Export the Server API
module.exports = server