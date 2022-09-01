/**
 * This is the REFER handler for calls to the PBX called by "referUrl" in the InboundHandler. 
 * The PSTN call leg will remain, but the SIP call leg will be referred using this function. The Event will contain the new number to dial.
 * 
 */
exports.handler = async function (context, event, callback) {

    try {
        const voiceResponse = new Twilio.twiml.VoiceResponse();

        console.log(`event.ReferTransferTarget: ${event.ReferTransferTarget}`);

        // Extract the PSTN number and make outbound call
        const newTo = event.ReferTransferTarget.match(/^sip:((\+)?[0-9]+)@(.*)/)[1];
        console.log(`newTo: ${newTo}`);

        // Dial PSTN number
        voiceResponse.dial().number(newTo);
        return callback(null, voiceResponse);
    } catch (error) {
        // Some other error occurred
        return callback(`Error with referHandler: ${error}`, null);
    }
};


