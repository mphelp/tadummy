function missingKeys(data, keys, res=undefined, path=undefined) {
    let missing = [];
    for (prop in data) {
        if (!keys.includes(prop)) {
            missing.push(prop);
        }
    }
    if (invalidKeys.length) {
        let msg = 'Missing keys ' + (path ? ('for '+path) : '') + ': ' + JSON.stringify(missing);
        console.log(msg);
        if (res) {
            res.status(400).send(msg);
        }
    }
    return missing;
}

module.exports = missingKeys;
