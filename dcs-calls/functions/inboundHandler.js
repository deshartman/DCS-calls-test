/**
 * This is the inbound from PSTN voice handler that routes the call to the Customer SIP Trunk domain (to PBX)
 * 
 * The PSTN side call SID is written into the User-to-User SIP header and passed to the SIP PBX for reference.
 * 
 */
exports.handler = async function (context, event, callback) {

    // Write the incoming PSTN call's Call SID as the UUI for the call
    try {
        const voiceResponse = new Twilio.twiml.VoiceResponse();

        // Send to SIP user -> sip:+number@SIP_DOMAIN?User-to-User=CAxxxxx
        const sipTo = event.To + '@' + context.SIP_DOMAIN + '?' + 'User-to-User=' + event.CallSid;

        // Dial SIP URL
        voiceResponse.dial().sip(sipTo);
        return callback(null, voiceResponse);
    } catch (error) {
        // Some other error occurred
        return callback(`Error with InboundHandler: ${error}`, null);
    }
};



