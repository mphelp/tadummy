import React from 'react';
import axios from 'axios';
import {
    Button,
    FormGroup,
    InputGroup,
    Switch,
    Classes,
    MenuItem,
} from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";
import { TimePicker } from "@blueprintjs/datetime";

const config = require('../config.js')
const serverUrl = 'http'+(config.server.https ?'s':'')+'://'+ config.ip + ':' + config.server.port;

// Styles
const general_s = {
    margin: 20,
}
const inputName_s = {
    maxWidth: 300,
}
const time_s = {
		maxWidth: 100,
		width: 100,
		margin: "auto",
}

export default class extends React.Component {
	state = {
		error: null,
		isLoaded: false,
        netid: "",
		coursesList: [],
		course: null   
	};

	handleSubmit = (event) => {
      // Post TA chosen office hours
      /*
			event.preventDefault();
			const formData = new FormData(event.target);
			var object = {};
			formData.forEach(function(value, key){
					object[key] = value;
			});
            object['cid'] = this.state.course.COURSE_ID;
            object['netid'] = this.props.netid;
			var json = JSON.stringify(object);
			fetch(serverUrl+'/api/courses/enroll/', {
					method: 'POST',
					body: json,
                    headers: {
                        'Content-Type': 'application/json'
                    }
			});
      */
	}

	initialize = () => {
		// server routes
		let courseApi = serverUrl + "/api/courses";

		// make requests to routes
		axios.get(courseApi)
			.then(res => {
				this.setState({ coursesList: res.data })
			})
			.catch(err => console.error(err))
	}
	componentWillMount() {
		this.initialize();
	}

	handleCourseSelectClick = (course) => {
			this.setState({ course });
	}
	courseRenderer = (item, { handleClick, isActive }) => (
		 <MenuItem
				 className={ isActive ? Classes.ACTIVE : "" }
				 key={item.ID}
				 text={item.NAME}
				 onClick={handleClick}
		 />
	)
	filterCourse = (query, course, _index, exactMatch) => {
		const normalizedCourse  = course.NAME.toLowerCase();
		const normalizedQuery = query.toLowerCase();

		if (exactMatch){
			return normalizedCourse === normalizedQuery;
		} else {
			return normalizedCourse.indexOf(normalizedQuery) >= 0;
		}
	}
		render(){
				const { coursesList, course } = this.state;
        return (
            <div style={general_s}>
								<form onSubmit={this.handleSubmit}>
										<header style={{ margin: "10px 0px" }}>Choose a course you TA:</header>
										<Select
												items={coursesList}
												itemPredicate={this.filterCourse}
												itemRenderer={this.courseRenderer}
												onItemSelect={this.handleCourseSelectClick}
										>
												<Button rightIcon="caret-down"
														text={course ? course.NAME : "(No selection)"}
												/>
										</Select><br /><br />
										Select desired Office Hours:<br />
										Location:<br /><br />
										<input type="text" name="name" defaultValue={"Innovation Lounge"} required="required"/><br/><br/>
										<input type="submit" value="Submit" />
								</form>
						</div>
        )
    }
}
/*
<Select
    items={Courses}
    onItemSelect={this.handleValueChange}
    itemRenderer={this.renderSelectItem}
>
    <Button rightIcon="caret-down"
        text={course ? course.title : "(No selection)" }
    />
</Select>


*/
