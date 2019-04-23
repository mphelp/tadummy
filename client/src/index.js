import React from 'react';
import { render } from 'react-dom';
import App from './components/App';

const config = require('./config.js')

// Render app
render(<App />, document.getElementById('root'));

// Redirect to server for cas
if (config.port === null || config.ip === null){
	console.error("CONFIG INCORRECT: port or ip is null");
} else {
	window.location.href='https://' + config.ip + ':' + config.https.port;
}
console.log(config);
