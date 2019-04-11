const request = require('request');
const looping = require('deasync');

function getInfo(netid){
    let done = false;
    let info = null;
    url = 'https://ur.nd.edu/request/eds.php?uid=' + netid + '&full_response=true';
    request(url, { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }
        info = body;
        done = true;  
    });
    while (!done){
        looping.runLoopOnce();
    }
    return info;
}

module.exports = {
   getInfo: getInfo
}
