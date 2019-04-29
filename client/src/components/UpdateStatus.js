import React from 'react';
import axios from 'axios';
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
		avail: null,
        course: null,
        courseList: []
	};
    initializeSignup = () => {
		// server routes
		let courseApi = serverUrl + "/api/officehours/" + this.props.netid + "/courses";

		// make requests to routes
		axios.get(courseApi)
			.then(res => {
				this.setState({ coursesList: res.data })
			})
			.catch(err => console.error(err))
	}
	componentWillMount() {
		this.initializeSignup();
	}

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
            object['cid'] = this.state.course.CID;
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
    handleCourseSelectClick = (course) => {
			this.setState({ course });
            this.setState(state => ({ statue: course.STATUS }));
            if (course.AVAIL_ID == 2){
                this.setState(state => ({ avail: avails[0] }));
            }
            else if (course.AVAIL_ID == 4){
                this.setState(state => ({ avail: avails[1] }));
            }
            else if (course.AVAIL_ID == 5){
                this.setState(state => ({ avail: avails[2] }));
            }

	}


	courseRenderer = (item, { handleClick, isActive }) => (
		 <MenuItem
				 className={ isActive ? Classes.ACTIVE : "" }
				 key={item.CID}
				 text={item.CNAME}
				 onClick={handleClick}
		 />
	)
	filterCourse = (query, coursez, _index, exactMatch) => {
		const normalizedCourse  = coursez.NAME.toLowerCase();
		const normalizedQuery = query.toLowerCase();

		if (exactMatch){
			return normalizedCourse === normalizedQuery;
		} else {
			return normalizedCourse.indexOf(normalizedQuery) >= 0;
		}
	}

    render(){
        const {
            avail,
            course,
            courseList
        } = this.state

        return (
            <div style={general_s}>
					<h1>TAs: Update your status below.</h1>
					<br />
					<form onSubmit={this.handleSubmit}>
                    Course:<br />
					<Select
							items={courseList}
							itemRenderer={this.courseRenderer}
							onItemSelect={this.handleCourseSelectClick}
					>
							<Button rightIcon="caret-down"
									text={avail ? avail.text : "(No selection)"}
							/>
					</Select><br /><br />
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
