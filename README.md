# SwedBankPay-DemoShop
A demoshop integrated with SwedBank Pay

## Requirements
- Node.JS (https://nodejs.org/en/)

## Install
Run ``npm install`` to install all required packages

## Config
Remember to set payment credentlials in the ``.env`` file

You can also change port and URL


## Easy integration with Swedbank Pay

When using the Node.JS and Express framework you can easily implement Swedbank Pay 

You need two main components, backend and frontend. 

The backend will call swedbank pay's API to get the order ID, and pass it to the frontend

In this example i use EJS as the view engine

Backend Code:

````
app.get('/pay', function (req, res) {
// Create the data to use in the API call
var data = {
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
            "hostUrls": [ "https://example.com, ],
            "paymentUrl": "https://example.com/pay",
            "completeUrl":"https://example.com/payment-complete",
            "cancelUrl": "https://example.com/payment-cancelled",
            "callbackUrl": "https://api.example.com/payment-callback",
            "termsOfServiceUrl": "https://example.com/termsandconditions.pdf"
        },
        "payeeInfo": {
            "payeeId": "CHANGE_THIS", // Change this to your PAYEEID
            "payeeReference": Date.now(), // This generates an uique refrence using the datatime in milliseconds
            "payeeName": "TEST INC", // Change to your company name
            "productCategory": "A123",
            "orderReference": "Test Product",
            "subsite": "MySubsite"
        },
        "payer": {
            "requireConsumerInfo": true,
            "digitalProducts": false,
            "shippingAddressRestrictedToCountryCodes": [ "NO", "US" ]
        },
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
    url: 'https://api.stage.payex.com/psp/paymentorders', // Remember to use the right API endpoint
    headers: { 
        'Content-Type': 'application/json', 
        'Authorization': 'Bearer SET_TOKEN_HERE' // Change to your PAYEE_TOKEN
    },
    data : data
    };
    
    axios(config)
    .then(function (response) {


    var operation = response.data.operations.find(function (o) {
        // Return the view-checkout script href
        return o.rel === 'view-checkout';
    });
    
    // Render the pay page using ejs
    res.render('pay', {
        view_checkout: operation.href
    })
    })
          
})````
