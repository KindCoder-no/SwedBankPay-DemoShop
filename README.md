# SwedBankPay-DemoShop
A demoshop integrated with SwedBank Pay

## Requirements
- [Node.JS](https://nodejs.org/en/)

## Install
Run ``npm install`` to install all required packages

## Config
Remember to set payment credentlials in the ``.env`` file

You can also change port and URL

``.env``
````
PORT=5000
URL=http://localhost

PAYEE_API_ENDPOINT=
PAYEETOKEN=
PAYEEID=
````

# Easy integration with Swedbank Pay

**This is a simplified script of the Demoshop**

**Remember to change settings to fit your project**

## Description
When using the Node.JS and Express framework you can easily implement Swedbank Pay 

You need two main components, backend and frontend. 

The backend will call swedbank pay's API to get the order ID, and pass it to the frontend

In this example i use EJS as the view engine


You need the axios npm package to run the API calls

### Documentation/requirements
- [Swedbank Pay Documentation](https://developer.swedbankpay.com/checkout-v3/starter/)
- [Express Framework](https://expressjs.com/)
- [Node.JS](https://nodejs.org/en/)

- [Axios](https://www.npmjs.com/package/axios)
- [EJS](https://ejs.co/)




### Code
Backend Code:
server.js
````
app.get('/pay', function (req, res) {
// Create the data to use in the API call
var data = {
    "paymentorder": {
        "operation": "Purchase",
        "currency": "NOK",
        "amount": 1000,
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

// Set config for API Call
var config = {
    method: 'post',
    url: 'https://api.stage.payex.com/psp/paymentorders', // Remember to use the right API endpoint
    headers: { 
        'Content-Type': 'application/json', 
        'Authorization': 'Bearer SET_TOKEN_HERE' // Change to your PAYEE_TOKEN
    },
    data : data
    };
    
    // Call API
    axios(config)
    .then(function (response) {


        var operation = response.data.operations.find(function (o) {
            // Return the view-checkout script href
            return o.rel === 'view-checkout';
        });
    
        // Render the pay page using ejs
        res.render('pay', {
            // Send the javascript href for view-checkout when rendering the page
            view_checkout: operation.href
        })
    })
          
})
````

Frontend (Ejs)

views/pay.ejs
````
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pay - DemoShop</title>
   
   <!-- Insert the script href you get from the backend -->
    <script src="<%= view_checkout %>"></script>

</head>
<body>
  
    <div id="checkin" class="checkin"></div>
             
    <div id="paymentMenu"></div>
    
    <script>
        // Run Payment function
        runpayment()

        // Create Payment function
        async function runpayment() {
            var identified = false
            var resized = 0
            window.payex.hostedView.checkout({
                container: {
                    checkin: "checkin",
                    paymentMenu: "paymentMenu",
                },
                culture: 'nb-No',

                

                // If payer is identified
                onPayerIdentified: async function onPayerIdentified(payerIdentified) {
                    console.log(payerIdentified);

                    // Open the payment menuu
                    openPaymentMenu()
                },

                // If payer chooses "Not you?"
                onPayerUnidentified: function onPayerUnidentified(payerUnidentified) {
                    console.log(payerUnidentified);
                },
                onEventNotification: function onEventNotification(eventNotification) {
                    console.log(eventNotification);
                    
                },
                
            }).open("checkin"); // Open Checkin 

        }
        
        // Open Payment function
        async function openPaymentMenu() {
            
            window.payex.hostedView.checkout({
                container: {
                    checkin: "checkin",
                    paymentMenu: "paymentMenu",
                },
                culture: 'nb-No',
            }).open("paymentmenu"); // Open payment menu
            
        }
    </script>

</body>
</html>

````