const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
require("es6-promise").polyfill();
require("isomorphic-fetch");
require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// Secret Key
const SECRET_KEY = process.env.SECRET_KEY;
const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

app.get('/', (req, res) => {
    console.log("Server: Inside app get: ");
    res.sendFile(__dirname + '/index.html');
});

app.post('/subscribe', (req, res) => {
    console.log("Server: Inside app subscribe");
   
    console.log("Server: Printing Request Body: ", req.body.captcha);

    if(
        req.body.captcha === undefined ||
        req.body.captcha === '' ||
        req.body.captcha === null
    ){
        return res.json({"success": false, "msg": "Please select captcha"});
    }
    else {
    //    console.log("captcha response from FE: ", req.body.captcha);
    verifyWithGoogleAPI(req.body.captcha);
    }
});

async function verifyWithGoogleAPI(value){
    //let negative_test= "03AGdBq24nxsJbOmOqnfV-DQ9XqMXMg33xI7MAq_KlX6cblOWjDJZ_-FX1asa_LfnjmyDWg9C5krq8oZSB1iJbS5NSK-UN09oKYctBi_69kNhk5YjVjWAQ1opao_dm6uLS5XdMoex5ogn6zdTF6SmWxQl_lcyxRIGFCgMeyGmOmwBwvpkcvWNiMOfFLTSkxJ3d-wScPp";
    // Validate Human
const isHuman = await fetch(`${VERIFY_URL}`, {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
    },
    body: `secret=${SECRET_KEY}&response=${value}`
  })
    .then(res => res.json())
    .then(json => json.success)
    .catch(err => {
        console.log("Catch block: ", err.message);
      throw new Error(`Error in Google Siteverify API. ${err.message}`)
    })
  
    console.log("Value of isHuman: ", isHuman);

    if(isHuman !== null && isHuman == false) {
        console.log("not isHuman");
     // throw new Error(`YOU ARE NOT A HUMAN.`)
    }
}

app.listen(5000, () => {
    console.log('Server started on port 5000');
})