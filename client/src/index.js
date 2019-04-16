import React from 'react';
import { render } from 'react-dom';
import App from './components/App';
const yeah = require('config.js')
console.log(yeah.port)

// Redirect to server for cas
window.location.href="localhost:" + yeah.port;

// Render app
render(<App />, document.getElementById('root'));

