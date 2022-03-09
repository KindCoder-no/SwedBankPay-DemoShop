var express = require('express')
var router = express.Router()
var products = require('../lib/products.json')

// Create products page
router.get('/products', function (req, res) {
    var sessioncart = req.session.cart
    
    if(sessioncart === undefined){
        var cartCount = 0
    }else{
        var cartCount = sessioncart.length 
    }

    res.render('products', {
        products: products,
        cartCount: cartCount
    })
})

// Create product page
router.get('/product/:id', function (req, res) {
    var product = ""

    var sessioncart = req.session.cart
    
    if(sessioncart === undefined){
        var cartCount = 0
    }else{
        var cartCount = sessioncart.length 
    }

    products.forEach(data => {
        if(data.id === req.params.id){
            product = data
        }
    })
    
    if(product === ""){
        // If product is not found, redirect to home page
        res.redirect('/')
    }else{
        res.render('product', {
            product: product,
            cartCount
        })
    }


})

module.exports = router;