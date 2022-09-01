/**
 * This is a mock function, to just log the UUI received from Genesys and the Twilio call details, specifically
 * the PSTN side callSID.
 * 
 */
exports.handler = async function (context, event, callback) {

    // log the call
    console.log("Received the following data: " + JSON.stringify(event, null, 4));

    console.log(`outboundLog PSTN Call SID: ${event.CallSid}`);
    onsole.log(`outboundLog UUI: ${event.data.guid}`);
    console.log(`outboundLog UUI: ${event.data.uui}`);


    return callback(null, event);
};



