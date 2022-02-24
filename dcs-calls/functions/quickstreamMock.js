/**
 * This is a mock function, that GenericPAy calls. It will call the Westpac Quickstream API to
 * get a SUT.
 * 
 * NB: This is NOT PCI DSS compliant and should NEVER be used in production or with real credit cards.
 * 
 * We will receive the following data format:
 * 
 * {
  "method" : "tokenize",
  "transaction_id" : "transaction_id",
  "cardnumber" : "4444333322221111",
  "cvv":"123",
  "expiry_month":"08",
  "expiry_year":"2022",
}
 * 
 * and respond with the following format
{
  "Token_id":"36425173-46b1-4360-bd42-1ed9ee94a48c",
  "Error_code":null,
  "Error_message":null
}
 *
 *
 */
const axios = require('axios');

exports.handler = async function (context, event, callback) {

    // console.log(`cardnumber: ${event.cardnumber}, expiry_month: ${event.expiry_month}, expiry_year: ${event.expiry_year}, cvv: ${event.cvv}`);

    var data = JSON.stringify({
        "accountType": "CREDIT_CARD",
        "cardholderName": "Rest Test",
        "cardNumber": event.cardnumber,
        "expiryDateMonth": event.expiry_month,
        "expiryDateYear": event.expiry_year,
        "cvn": event.cvv,
        "supplierBusinessCode": context.SUPPLIER_BUSINESS_CODE,
    });

    const username = context.PUBLISHABLE_API_KEY;
    const password = '';
    const encodedBase64Token = Buffer.from(`${username}:${password}`).toString('base64');
    const authorization = `Basic ${encodedBase64Token}`;
    console.log(`Authorization: ${authorization}`);

    var config = {
        method: 'post',
        url: 'https://api.quickstream.support.qvalent.com/rest/v1/single-use-tokens',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authorization
        },
        data: data
    };

    try {
        const response = await axios(config);
        console.log(JSON.stringify(response.data));
        return callback(null, response.data);

    } catch (error) {
        console.log(error);
        return callback(`Error with Quickstream Mock Axios call: ${error}`, null);
    };
}