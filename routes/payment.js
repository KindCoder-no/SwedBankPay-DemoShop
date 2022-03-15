var express = require('express')
var router = express.Router()
var products = require('../lib/products.json')
const axios = require('axios')

// Create Pay page
router.get('/pay', function (req, res) {
    //res.setHeader('Access-Control-Allow-Origin', '*');

    res.setHeader('Access-Control-Allow-Header', "X-Request-With,content-type");
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", "1800");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" ); 

    // Calculate price


    if(req.session.cart){
        var sessioncart = req.session.cart
        var products_id = []

        if(process.env.PORT === 80){
            var port = ""
        }else{
            var port = ":" + process.env.PORT
        }

        products.forEach(data => {
            products_id.push(data.id)
        })

        var products_items = []

        var totalPrice = Number()
        sessioncart.forEach(data => { 
            var productindex = products_id.indexOf(data.id)
            var product = products[productindex]
            
            totalPrice += product.price * data.amount 

            products_items.push({
                "reference": product.id,
                "name": product.name,
                "type": "PRODUCT",
                "class": "ProductGroup1",
                "itemUrl": process.env.URL + port + "/product/" + product.id,
                "imageUrl": product.images[0],
                "description": product.description_short,
                "discountDescription": "Volume discount",
                "quantity": data.amount,
                "quantityUnit": "pcs",
                "unitPrice": product.price + "00",
                "discountPrice": 0,
                //"vatPercent": 2500,
                "amount": product.price * data.amount + "00",
                //"vatAmount": 375
            })
        })
    
        if(totalPrice === 0){
            res.redirect('/cart')
        }else{
            
 
            



            /*sessioncart.forEach(data => {
                var productindex = products_id.indexOf(data.id)
                var product = products[productindex]
                
            })*/

            console.log(products_items)

            var newdata = {
                "paymentorder": {
                    "operation": "Purchase",
                    "currency": "NOK",
                    "amount": totalPrice + "00",
                    "vatAmount": 0,
                    "description": "Test Purchase",
                    "userAgent": "Mozilla/5.0...",
                    "language": "nb-NO",
                    "productName": "Checkout3",
                    "urls": {
                        "hostUrls": [ process.env.URL + port, ],
                        "paymentUrl": process.env.URL + port + "/pay",
                        "completeUrl": process.env.URL + port + "/payment-complete",
                        "cancelUrl": process.env.URL + port + "/payment-cancelled",
                        //"callbackUrl": process.env.URL + port + "https://api.example.com/payment-callback",
                        //"termsOfServiceUrl": "https://example.com/termsandconditions.pdf"
                    },
                    "payeeInfo": {
                        "payeeId": process.env.PAYEEID,
                        "payeeReference": Date.now(),
                        "payeeName": "Emre INC",
                        "productCategory": "A123",
                        "orderReference": Date.now(),
                        "subsite": "MySubsite"
                    },
                    "payer": {
                        "requireConsumerInfo": true,
                        "digitalProducts": false,
                        "shippingAddressRestrictedToCountryCodes": [ "NO", "US" ]
                    },
                    "orderItems": products_items /*[
                        {
                            "reference": "P1",
                            "name": "Product1",
                            "type": "PRODUCT",
                            "class": "ProductGroup1",
                            "itemUrl": "https://example.com/products/123",
                            "imageUrl": "https://example.com/product123.jpg",
                            "description": "Product 1 description",
                            "discountDescription": "Volume discount",
                            "quantity": 5,
                            "quantityUnit": "pcs",
                            "unitPrice": 300,
                            "discountPrice": 0,
                            "vatPercent": 2500,
                            "amount": 1500,
                            "vatAmount": 375
                        },
                        {
                            "reference": "I1",
                            "name": "InvoiceFee",
                            "type": "PAYMENT_FEE",
                            "class": "Fees",
                            "description": "Fee for paying with Invoice",
                            "quantity": 1,
                            "quantityUnit": "pcs",
                            "unitPrice": 1900,
                            "vatPercent": 0,
                            "amount": 1900,
                            "vatAmount": 0,
                            "restrictedToInstruments": [
                                "Invoice-PayExFinancingSe"
                            ]
                        }
                    ]*/,
                    "riskIndicator": {
                        "deliveryEmailAddress": "olivia.nyhuus@payex.com",
                        "deliveryTimeFrameIndicator": "01",
                        "preOrderDate": "19801231",
                        "preOrderPurchaseIndicator": "01",
                        "shipIndicator": "01",
                        "giftCardPurchase": false,
                        "reOrderPurchaseIndicator": "01",
                        "pickUpAddress": {
                            "name": "Olivia Nyhus",
                            "streetAddress": "Saltnestoppen 43",
                            "coAddress": "",
                            "city": "Saltnes",
                            "zipCode": "1642",
                            "countryCode": "NO"
                        }
                    }
                }
            }
        
        
            var config = {
                method: 'post',
                url: process.env.PAYEE_API_ENDPOINT + '/psp/paymentorders',
                headers: { 
                'Content-Type': 'application/json', 
                'Authorization': 'Bearer ' + process.env.PAYEETOKEN
                },
                data : newdata
            };
            
            axios(config)
            .then(function (response) {
                //console.log(response.data.operations);
        
        
                var operation = response.data.operations.find(function (o) {
                    return o.rel === 'view-checkout';
                    //return o.rel === "redirect-checkout";
                });
                
                //console.log(operation)
                //res.redirect(operation.href)
                //res.send(totalPrice)
                //res.send("Hei")
                res.render('pay', {
                    view_checkout: operation.href,
                    payment_id: response.data.paymentOrder.id,
                })
            })
        }
        
          
    }else{
        res.redirect('/')
    }
    
   
})


// Payment success page
router.get('/payment-complete', function (req, res) {
    //var sessioncart = req.session.cart
    req.session.cart = undefined

    var sessioncart = req.session.cart

    if(sessioncart === undefined){
        var cartCount = 0
    }else{
        var cartCount = sessioncart.length 
    }

    var config = {
        method: 'get',
        url: process.env.PAYEE_API_ENDPOINT + req.cookies.payment_id + "/orderitems",
        headers: { 
        'Content-Type': 'application/json', 
        'Authorization': 'Bearer ' + process.env.PAYEETOKEN
        }
    };
    
    axios(config)
    .then(function (response) {
        console.log(response.data.orderItems.orderItemList)
        res.render('payment-success', {
            cartCount,
            items: response.data.orderItems.orderItemList
        })
    })
   
})

module.exports = router;