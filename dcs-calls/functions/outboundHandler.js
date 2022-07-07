/**
 * This is the outbound to PSTN voice handler that routes the call from the Customer to a PSTN destination.
 * The PSTN side call SID is provided as part of the call back as reference, so Pay can be attached.
 *
 * Once the call is connected, we call the StatusCallback
 * 
 */
exports.handler = function (context, event, callback) {

    const voiceResponse = new Twilio.twiml.VoiceResponse();

    let to = event.To.match(/^sip:((\+)?[0-9]+)@(.*)/)[1];
    let from = event.From.match(/^sip:((\+)?[0-9]+)@(.*)/)[1];

    // console.log(`outboundHandler Event Details: ${JSON.stringify(event, null, 4)}`);

    // Extract the UUI in the parent call leg (PBX to Twilio). The PSTN side call SID will be in the callback body.
    //let uui = event["SipHeader_User-to-User"];
    let uui = event["SipHeader_x-inin-cnv"];    // This is the header Genesys will use

    if (!uui) {
        return callback(null, 'Cannot extract UUI from call, so cannot establish Pay for callSID: ' + event.CallSid);
    };


    try {
        // console.log(`Dialing ${to} with Caller ID ${from} - Was to:${event.To} from:${event.From}`);
        const dial = voiceResponse.dial({ callerId: from });
        dial.number(
            {
                // Only update when call is answered
                statusCallbackEvent: 'answered',
                statusCallback: context.CALLBACK_URL + '?uui=' + uui,
                statusCallbackMethod: 'POST'
            },
            to);

        return callback(null, voiceResponse);
    } catch (error) {
        return callback(null, `Error with OutboundHandler: ${error}`);
    }
};
