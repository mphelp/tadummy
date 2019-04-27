import React from 'react';
import axios from 'axios';
import {
    Classes,
    MenuItem,
} from "@blueprintjs/core";

// Framework CSS
import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/select/lib/css/blueprint-select.css";

// My Components
import StudentCourseEnrollSignup from "./forms/StudentCourseEnrollSignup";

const $ = require('jquery');
const config = require('../config.js')
const serverUrl = 'http'+(config.server.https ?'s':'')+'://'+ config.ip + ':' + config.server.port;

const BodyGeneral_s = {
    display: "flex",
    flexDirection: "row",
    height: "100%"
}

//course NAME
//department name ~ id

export default class extends React.Component {
    constructor(props){
		super(props);
	}
	state = {
		search: null,
		error: null,
		isLoaded: false,
        netid: "",
		coursesList: [],   //list of all course in DB
		course: null   //chosen course
	};

	handleSubmit = (event) => {
			event.preventDefault();
			const formData = new FormData(event.target);
			var object = {};
			formData.forEach(function(value, key){
					object[key] = value;
			});
            object['cid'] = this.state.course.COURSE_ID;
            object['netid'] = this.props.netid;
			var json = JSON.stringify(object);
			fetch(serverUrl+'/api/enroll/', {
					method: 'POST',
					body: json,
                    headers: {
                        'Content-Type': 'application/json'
                    }
			});
	}

	initializeSignup = () => {
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
		this.initializeSignup();
	}

	handleCourseSelectClick = (course) => {
			this.setState({ course });
	}


	courseRenderer = (item, { handleClick, isActive }) => (
		 <MenuItem
				 className={ isActive ? Classes.ACTIVE : "" }
				 key={item.COURSE_ID}
				 text={item.COURSE_NAME}
				 onClick={handleClick}
		 />
	)
	filterCourse = (query, course, _index, exactMatch) => {
		const normalizedCourse  = course.COURSE_NAME.toLowerCase();
		const normalizedQuery = query.toLowerCase();

		if (exactMatch){
			return normalizedCourse === normalizedQuery;
		} else {
			return normalizedCourse.indexOf(normalizedQuery) >= 0;
		}
	}


  render() {
		const {
            netid
		} = this.props;
		const { coursesList, course} = this.state;
		return (
				<div style={BodyGeneral_s}>
				{
						(() => {
									return(
										<StudentCourseEnrollSignup
                                            netid        = {netid}
											coursesList        = {coursesList}
											course       = {course}
											handleSubmit = {this.handleSubmit}
											handleCourseSelectClick = {this.handleCourseSelectClick}
											courseRenderer = {this.courseRenderer}
											filterCourse = {this.filterCourse}
										/>
									)
						})()
				}
				</div>
    );
  }
}
