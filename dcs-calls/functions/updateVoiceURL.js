/**
 *Update the voice URL of the Number
 * 
 */
exports.handler = async function (context, event, callback) {
    // console.log(`event: ${JSON.stringify(event)}`);

    const restClient = context.getTwilioClient();
    const twilioResponse = new Twilio.Response();

    // CORS handler. Remove on Deployment
    twilioResponse.appendHeader("Access-Control-Allow-Origin", "*");
    twilioResponse.appendHeader("Access-Control-Allow-Methods", "*");
    twilioResponse.appendHeader("Content-Type", "application/json");

    // update each of the phone numbers in the event.batchArray array
    for (let i = 0; i < event.batchArray.length; i++) {
        console.log(`event.phoneSid: ${event.batchArray[i].phoneSid}, event.voiceUrl: ${event.batchArray[i].voiceUrl}`);

        try {
            await restClient.incomingPhoneNumbers(event.batchArray[i].phoneSid)
                .update({ voiceUrl: event.batchArray[i].voiceUrl });

        } catch (error) {
            twilioResponse.setBody(`Error with updateVoiceURL for phoneSid: ${event.batchArray[i].phoneSid} with error ${error}`);
            return callback(null, twilioResponse);
        }
    }

    twilioResponse.setBody(event.batchArray);
    return callback(null, twilioResponse);

};

