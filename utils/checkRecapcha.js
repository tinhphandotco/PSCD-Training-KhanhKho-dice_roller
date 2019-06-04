require('dotenv').config()
const { URL_RECAPCHA_API} = require("../constants");

const checkRecapcha = (req) => {
    return new Promise((resolve, reject) => {
        const secretKey = process.env.RECAPCHA_SECRET;
        const verificationURL = URL_RECAPCHA_API + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
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