// Include packages
const express = require('express')
const dotenv = require('dotenv')
const consolelog = require('./lib/console/date.js')
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const cors = require('cors');

// Include Dotenv Config
dotenv.config()


// Define App
const app = express()



app.use(cors());

app.options('*', cors());


// Get port from dotenv
const port = process.env.PORT

// Log Web server Start Event
console.log('\x1b[33m%s\x1b[0m', `[${consolelog.date()}] Starting...`)

// Set view engine
app.set('view engine', 'ejs')

// Set Public directory
app.use(express.static(__dirname + '/public'))

// Session settings
const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));

// cookie parser middleware
app.use(cookieParser());

// Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
  
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
  
    // Pass to next layer of middleware
    next();
});


// Define Routes
var indexRouter = require('./routes/index')
var productsRouter = require('./routes/products')
var paymentRouter = require('./routes/payment')
var cartRouter = require('./routes/cart')

// Use routes
app.use('/', indexRouter)
app.use('/', productsRouter)
app.use('/', paymentRouter)
app.use('/', cartRouter)

// Start web app with port
app.listen(port, () => {
    console.log('\x1b[32m%s\x1b[0m', `[${consolelog.date()}] Web server started on port: ${port}`)
})