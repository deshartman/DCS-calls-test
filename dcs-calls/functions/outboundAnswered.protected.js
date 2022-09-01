/**
 * This is the handler for outbound calls once answered for calls from the PBX OutboundHandler. 
 * We will consume the GUID sent by the PBX and send back the GUID and PSTN side call leg SID.
 * 
 */
const axios = require('axios');

exports.handler = async function (context, event, callback) {

    try {
        // Make an Axios POST here with the GUID and CallSid in the body
        const url = context.CALLBACK_URL;
        const data = {
            "guid": event.guid,
            "callSid": event.CallSid
        };
        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const response = await axios.post(url, data, config);
        console.log(`Response from Pay: ${JSON.stringify(response.data, null, 4)}`);
        return callback(null, `data sent to webhook: ${data}`);
    } catch (error) {
        // Some other error occurred
        return callback(`Error with referHandler: ${error}`, null);
    }
};


