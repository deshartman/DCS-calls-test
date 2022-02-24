/**
 * This is a mock function, to just log the UUI received from Genesys.
 * 
 */
exports.handler = async function (context, event, callback) {

    // log the call
    console.log("Received the following data: " + JSON.stringify(event));


    return callback(null, event);
};



