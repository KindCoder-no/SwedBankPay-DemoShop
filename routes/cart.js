var express = require('express')
const session = require('express-session')
var router = express.Router()
var products = require('../lib/products.json')

// Cart page
router.get('/cart', function (req, res) {
    //res.send(req.session.cart)
    var sessioncart = req.session.cart
   
    var products_id = []

    products.forEach(data => {
        products_id.push(data.id)
    })

    if(sessioncart === undefined){
        var cartCount = 0
    }else{
        var cartCount = sessioncart.length 
    }
    console.log(cartCount)

    res.render('cart', {
        products: products,
        products_id: products_id,
        cart: sessioncart,
        cartCount
    })
})

// Add to cart page
router.get('/product/:id/add-cart', function (req, res) {
    var product = ""
    var session = req.session;

    products.forEach(data => {
        if(data.id === req.params.id){
            product = data
        }
    })
    if(product === ""){
        // If product is not found, redirect to home page
        res.redirect('/')
    }else{
        if(session.cart){
            var oldcart = session.cart

            // Check if items is in cart
            var oldcart_ids = []


            oldcart.forEach(data => {
                oldcart_ids.push(data.id)
            })

            if(oldcart_ids.includes(req.params.id)){
                var oldcart_id = oldcart_ids.indexOf(req.params.id)
                oldcart[oldcart_id].amount = Number(oldcart[oldcart_id].amount) + 1
            }else{
                var newcart = oldcart.push({id: req.params.id, amount: "1"})

            }           
            res.redirect('/cart')
        }else{
            session.cart = [{id: req.params.id, amount: "1"}]

            // Redirect to cart page
            res.redirect('/cart')
        }
    }
})

router.get('/product/:id/add-cart/button', function (req, res) {
    var product = ""
    var session = req.session;

    products.forEach(data => {
        if(data.id === req.params.id){
            product = data
        }
    })
    if(product === ""){
        // If product is not found, redirect to home page
        res.send("No product")
    }else{
        if(session.cart){
            var oldcart = session.cart

            // Check if items is in cart
            var oldcart_ids = []


            oldcart.forEach(data => {
                oldcart_ids.push(data.id)
            })

            if(oldcart_ids.includes(req.params.id)){
                var oldcart_id = oldcart_ids.indexOf(req.params.id)
                oldcart[oldcart_id].amount = Number(oldcart[oldcart_id].amount) + 1
            }else{
                var newcart = oldcart.push({id: req.params.id, amount: "1"})

            }           
            res.send("Success")
        }else{
            session.cart = [{id: req.params.id, amount: "1"}]

            // Redirect to cart page
            res.send("Success")
        }
    }
})


// Add to cart page
router.get('/product/:id/remove-cart', function (req, res) {
    var product = ""
    var session = req.session;

    products.forEach(data => {
        if(data.id === req.params.id){
            product = data
        }
    })
    if(product === ""){
        // If product is not found, redirect to home page
        res.redirect('/')
    }else{
        if(session.cart){
            var oldcart = session.cart

            // Check if items is in cart
            var oldcart_ids = []


            oldcart.forEach(data => {
                oldcart_ids.push(data.id)
            })

            console.log(oldcart_ids)
            if(oldcart_ids.includes(req.params.id)){
                
                var oldcart_id = oldcart_ids.indexOf(req.params.id)
                // If cart is at 1 item
                if(oldcart[oldcart_id].amount === 0){
                    oldcart[oldcart_id].amount = 0

                }else{
                    oldcart[oldcart_id].amount = Number(oldcart[oldcart_id].amount) - 1

                }
            }else{
                var newcart = oldcart.push({id: req.params.id, amount: "1"})
            }

            // Redirect to cart
            res.redirect('/cart')
        }
    }
})


// Export router
module.exports = router;