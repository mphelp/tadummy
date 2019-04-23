import React from 'react';
import { render } from 'react-dom';
import App from './components/App';

const config = require('./config.js')
const $ = require('jquery');

const serverUrl = 'http'+(config.server.https ?'s':'')+'://'+ config.ip + ':' + config.server.port;

const urlParams = new URLSearchParams(window.location.search);
let netid = urlParams.get('netid');
if (netid){
    console.log('AUTHORIZING');
    let data = {netid: netid};
    $.ajax({
        type: "POST",
        url: serverUrl+'/authorize',
        data: JSON.stringify(data),
        dataType: 'json',
        complete: (res, status) => {
            console.log(`${res} and status = ${status}`);
        }
    });
    render(<App />, document.getElementById('root'));
} else if (config.client.port === null || config.ip === null){
	console.error("CONFIG INCORRECT: port or ip is null");
} else {
	window.location.href = serverUrl + '/login';
}
