const request = require('request');
const looping = require('deasync');

function getInfo(netid){
    let done = false;
    let info = null;
    url = 'https://ur.nd.edu/request/eds.php?uid=' + netid + '&full_response=true';
    return new Promise((resolve, reject) => {
        request(url, { json: true }, (err, res, body) => {
            if (err) {
                reject(err);
            } else {
                resolve(body);
            }
        });
    });
}

module.exports = {
   getInfo: getInfo
}
