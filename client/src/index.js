import React from 'react';
import { render } from 'react-dom';
import App from './components/App';

const config = require('./config.js')

if (window.location.search == "?key=value"){
    render(<App />, document.getElementById('root'));
} else if (config.port === null || config.ip === null){
	console.error("CONFIG INCORRECT: port or ip is null");
} else {
	window.location.href=(config.https ? 'https://' : 'http://') + config.ip + ':' + (config.https ? config.https.port : config.port);
}
console.log(config);
