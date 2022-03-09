var express = require('express')
const session = require('express-session')
var router = express.Router()
var products = require('../lib/products.json')
const axios = require('axios')

// Create Home page
router.get('/', function (req, res) {
    var sessioncart = req.session.cart

    if(sessioncart === undefined){
        var cartCount = 0
    }else{
        var cartCount = sessioncart.length 
    }

    res.render("index", {
        cartCount
    })
})



module.exports = router;