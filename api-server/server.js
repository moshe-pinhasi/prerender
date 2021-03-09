
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')
const session = require('express-session')

const app = express()
const http = require('http').createServer(app);

const cache = {}

const prerenderNode = require('prerender-node')
    .set('prerenderServiceUrl', 'http://localhost:3000')
    .set('beforeRender', function (req, done) {
        // do whatever you need to do
        console.log('before-render')
        if (!cache[req.url]) return done();

        console.log('loading from cache')
        done(req.url, done);
    })
    .set('afterRender', function (err, req, prerender_res) {
        // do whatever you need to do
        console.log('after-render')
        if (!cache[req.url]) {
            console.log('saving to cache')
            cache[req.url] = prerender_res.body
        }
    })
app.use(prerenderNode);


app.use(cookieParser())
app.use(bodyParser.json());
app.use(session({
    secret: 'typ9OBaqrRbJOzDJrP7IzgE9',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

if (process.env.NODE_ENV !== 'production') {
    const corsOptions = {
        origin: ['http://127.0.0.1:8080', 'http://localhost:8080'],
        credentials: true
    };
    app.use(cors(corsOptions));
}

// const jobsRoutes = require('./api/jobs/jobs.routes')
app.use(express.static(path.resolve(__dirname, 'public')));


const port = process.env.PORT || 3030;
http.listen(port, () => {
    console.log('Server is running on port: ' + port)
});

