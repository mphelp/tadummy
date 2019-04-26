import React from 'react';
import { render } from 'react-dom';
import App from './components/App';
import Signup from './components/Signup';

const config = require('./config.js')
const $ = require('jquery');

const serverUrl = 'http'+(config.server.https ?'s':'')+'://'+ config.ip + ':' + config.server.port;

const urlParams = new URLSearchParams(window.location.search);
let netid = urlParams.get('netid');
if (netid){
    let data = {roles: [], ldap: true};
    $.get({
        url: serverUrl+"/api/user/"+netid,
        data: data,
        dataType: "json",
        success: (res, status) => {
            if (res.authorized) {
                render(<App />, document.getElementById('root'));
            } else {
                render(<Signup {...res.ldap} netid={netid} />, document.getElementById('root'));
            }
        }, error: (xhr, status) => {
            console.log(xhr);
        }
    });
} else if (config.client.port === null || config.ip === null){
	console.error("CONFIG INCORRECT: port or ip is null");
} else {
	window.location.href = serverUrl + '/login';
}
