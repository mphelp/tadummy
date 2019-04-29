import React from 'react';
import {
    FormGroup,
    InputGroup,
    Switch,
    Classes,
    MenuItem,
    Button
} from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";

const $ = require('jquery');
const config = require('../config.js')
const serverUrl = 'http'+(config.server.https ?'s':'')+'://'+ config.ip + ':' + config.server.port;

const avails = [
    {
        text: 'Available',
        id: 2,
        desc: 'positive',
    },
    {
        text: 'Busy',
        id: 4,
        desc: 'negative',
    },
    {
        text: 'Offline',
        id: 5,
        desc: 'offline',
    },
]

// Styles
const general_s = {
    margin: 20,
}
const inputName_s = {
    maxWidth: 300,
}

export default class extends React.Component {
    constructor(props){
		super(props);
	}
    state = {
        netid: "",
		avail: avails[1],
	};

    handleSelectClick = (avail) => {
        this.setState(state => ({ avail: avail }))
    }

    handleSubmit = (event) => {
			event.preventDefault();
			const formData = new FormData(event.target);
			var object = {};
			formData.forEach(function(value, key){
					object[key] = value;
			});
            object['avail_id'] = this.state.avail.id;
            object['netid'] = this.props.netid;
			var json = JSON.stringify(object);
			fetch(serverUrl+'/api/officehours/status', {
					method: 'PUT',
					body: json,
                    headers: {
                        'Content-Type': 'application/json'
                    }
			});
	}

    itemRenderer = (item, { handleClick, isActive }) => (
        <MenuItem
            className={ isActive ? Classes.ACTIVE : "" }
            key={item.id}
            text={item.text}
            onClick={handleClick}
        />
    )
    render(){
        const {
            avail
        } = this.state

        return (
            <div style={general_s}>
					<h1>TAs: Update your status below.</h1>
					<br />
					<form onSubmit={this.handleSubmit}>
					Status (40 character max):<br />
					<input type="text" name="status" maxLength ="40" /><br/><br/>
					Availability:<br />
					<Select
							items={avails}
							itemRenderer={this.itemRenderer}
							onItemSelect={this.handleSelectClick}
					>
							<Button rightIcon="caret-down"
									text={avail ? avail.text : "(No selection)"}
							/>
					</Select><br /><br />
					<input type="submit" value="Submit" />
					</form>
			</div>
        )
    }
}
