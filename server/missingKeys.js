function missingKeys(data, keys, req, res) {
    let missing = [];
    for (i in keys) {
        let prop = keys[i];
        if (!data[prop]) {
            missing.push(prop);
        }
    }
    if (missing.length) {
        let msg = 'Missing keys';
        if (req) {
            msg += " for '"+req.originalUrl+"' ("+req.method+")";
        }
        msg += ': '+JSON.stringify(missing);
        console.log(msg);
        if (res) {
            res.status(400).send(msg);
        }
    }
    return missing;
}

module.exports = missingKeys;
