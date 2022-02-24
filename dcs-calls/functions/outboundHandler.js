/**
 * This is the outbound to PSTN voice handler that routes the call from the Customer to a PSTN destination.
 * The PSTN side call SID is written into a Sync map as reference, so Pay can be attached.
 *
 * Once the call is connected, we call the StatusCallback to write the callSID in the UUI sync map.
 * 
 */
exports.handler = function (context, event, callback) {

    const voiceResponse = new Twilio.twiml.VoiceResponse();
    const restClient = context.getTwilioClient();

    // Extract the UUI in the parent call leg (PBX to Twilio). The PSTN side call SID will be in the callback body. 
    // See https://www.twilio.com/docs/voice/api/call-resource#parameters-sent-to-your-statuscallback-url
    try {
        var parentCall = await restClient.calls(event.ParentCallSid).fetch();

        const paramPart = parentCall.to.split("?")[1];
        const params = new URLSearchParams(paramPart);
        const uui = params.get('User-to-User');

        if (!uui) {
            return callback(null, 'Cannot extract UUI from call, so cannot establish Pay for callSID: ' + event.CallSid);
        }
        // console.log(`Dialing ${to} with Caller ID ${from} - Was to:${event.To} from:${event.From}`);
        const dial = voiceResponse.dial({ callerId: from });
        dial.number(
            {
                // Only update Sync when call is answered
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
