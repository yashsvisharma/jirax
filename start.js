const ShipEngine = require('shipengine');   //import ShipEngine
const express = require('express')  //import Express

const app = express()   //init express app on port 3000
const port = 3000

app.use(express.json()); //middleware to parse JSON data

var engine = new ShipEngine.ShipEngine('api key');  // ~super secret api token~

var ship_from = new ShipEngine.Address('Drew Taylor', 'New York', 'NY', '10014', 'US',  //hard code shipper address
    '225 Varick St', 'Fl 12', '6466333299', 'Squarespace, Inc.', 'no')

var destination_country = 'US'  //only US for now

app.post('/', (req, res) => {   //handle POST request from Jira with ticket data
    console.log(req.body.fields)

    var weight_array = (req.body.fields.customfield_31421).split("x") //split dimensions into unique values

    var ship_to = new ShipEngine.Address(req.body.fields.customfield_31423, req.body.fields.customfield_31417,  //create shipping address
        req.body.fields.customfield_31422, req.body.fields.customfield_31418.toString(), destination_country,
        req.body.fields.customfield_31415, req.body.fields.customfield_31419, req.body.fields.customfield_31071);

    var parcel = new ShipEngine.Package({   //create package
        value: 1.0,
        unit: "pound"
    }, {
        "unit": "inch",
        "length": parseFloat(weight_array[0]),
        "width": parseFloat(weight_array[1]),
        "height": parseFloat(weight_array[2])
    });

    var shipment = new ShipEngine.Shipment({    //create shipment
        confirmation: "adult_signature",    //require adult signature
        ship_to: ship_to,
        ship_from: ship_from,
        packages: [parcel],
        validate_address: "no_validation",
        service_code: "fedex_ground"
    });


    engine.createLabel(shipment, "pdf").then((data) => {    //create label
        console.log(data);
        res.send(data)  //send confirmation JSON as response
    }).catch((err) => {
        console.log(err);
    });
})

app.listen(port, () => {    //fire it up
    console.log(`app listening at http://localhost:${port}`)
})