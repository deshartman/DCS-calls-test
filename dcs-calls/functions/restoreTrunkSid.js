/**
 * Remove SIP Trunk Numbers
 * 
 */
exports.handler = async function (context, event, callback) {
    console.log(`event: ${JSON.stringify(event.batchArray)}`);

    const restClient = context.getTwilioClient();
    const twilioResponse = new Twilio.Response();

    // CORS handler. Remove on Deployment
    twilioResponse.appendHeader("Access-Control-Allow-Origin", "*");
    twilioResponse.appendHeader("Access-Control-Allow-Methods", "*");
    twilioResponse.appendHeader("Content-Type", "application/json");

    console.log(`event.batchArray[0].trunkSid: ${event.batchArray[0].trunkSid}`);

    // update each of the phone numbers in the event.urlArray array
    for (let i = 0; i < event.batchArray.length; i++) {
        console.log(`event.batchArray[${i}].phoneSid: ${event.batchArray[i].phoneSid}`);

        try {
            await restClient.trunking
                .trunks(event.batchArray[i].trunkSid)
                .phoneNumbers
                .create({ phoneNumberSid: event.batchArray[i].phoneSid });

            console.log(`Done with ${i}`);
        } catch (error) {
            console.log(error);
            twilioResponse.setBody(`Error with restoreTrunkNumbers for phoneSid: ${event.batchArray[i].phoneSid} with error ${error}`);
            return callback(null, twilioResponse);
        }
    }
    console.log(`Done with loop`);

    twilioResponse.setBody(event.batchArray);
    return callback(null, twilioResponse);
};

