/**
 * List all SIP Trunk Numbers
 * 
 */
exports.handler = async function (context, event, callback) {
    const restClient = context.getTwilioClient();

    const twilioResponse = new Twilio.Response();

    // CORS handler. Remove on Deployment
    twilioResponse.appendHeader("Access-Control-Allow-Origin", "*");
    twilioResponse.appendHeader("Access-Control-Allow-Methods", "*");
    twilioResponse.appendHeader("Content-Type", "application/json");

    try {
        const phoneNumbers = await restClient.trunking.trunks(event.trunkSid)
            .phoneNumbers
            .list({ limit: parseInt(event.limit) });

        // console.log(phoneNumbers);
        twilioResponse.setBody(phoneNumbers);
        return callback(null, twilioResponse);
    } catch (error) {
        twilioResponse.setBody(`Error with ListSipTrunkNumbers: ${error}`);
        return callback(null, twilioResponse);
    }
};