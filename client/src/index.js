import React from 'react';
import { render } from 'react-dom';
import App from './components/App';

const config = require('./config.js')

// Render app
render(<App />, document.getElementById('root'));

// Redirect to server for cas
if (config.port === null || config.id === null){
	console.error("CONFIG INCORRECT: port or ip is null");
} else {
	//window.location.href='http://' + config.ip + ':' + config.port;
}
console.log(config);
