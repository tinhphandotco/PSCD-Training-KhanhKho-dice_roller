require('dotenv').config()
const { urlRecapcha} = require("../constants");

const checkRecapcha = (req) => {
    return new Promise((resolve, reject) => {
        const secretKey = process.env.secretKey;
        const verificationURL = urlRecapcha.urlrecapcha + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
        request(verificationURL, function (error, response, body) {
            body = JSON.parse(body);
            if (error || body.success == false)
                reject(body);
            else
                resolve(body);
        });
    });
}

module.exports={
    checkRecapcha
}