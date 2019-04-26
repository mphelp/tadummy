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
import CourseSignup from "./forms/CourseSignup";

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
	state = {
		search: null,
		error: null,
		isLoaded: false,
		dorms: [],
		majors: [],
		depts: [],
		dorm: null,
		major: null,
		dept: null,
	};

	handleSubmit = (event) => {
			event.preventDefault();
			const formData = new FormData(event.target);
			var object = {};
			formData.forEach(function(value, key){
					object[key] = value;
			});
            object['dept'] = this.state.dept.DEPARTMENT_ID;
			var json = JSON.stringify(object);
			fetch(serverUrl+'/api/courses', {
					method: 'POST',
					body: json,
                    headers: {
                        'Content-Type': 'application/json'
                    }
			});
	}

	initializeSignup = () => {
		// server routes
		let deptApi = serverUrl + "/api/departments";

		// make requests to routes
		axios.get(deptApi)
			.then(res => {
				this.setState({ depts: res.data })
			})
			.catch(err => console.error(err))
	}
	componentWillMount() {
		this.initializeSignup()
	}
	handleDeptSelectClick = (dept) => {
			this.setState({ dept })
	}
	deptRenderer = (item, { handleClick, isActive }) => (
		 <MenuItem
				 className={ isActive ? Classes.ACTIVE : "" }
				 key={item.DEPARTMENT_ID}
				 text={item.NAME}
				 label={item.ABBREV}
				 onClick={handleClick}
		 />
	)
	filterDept = (query, dept, _index, exactMatch) => {
		const normalizedDept  = dept.NAME.toLowerCase() + '  ' + dept.ABBREV.toLowerCase();
		const normalizedQuery = query.toLowerCase();

		if (exactMatch){
			return normalizedDept === normalizedQuery;
		} else {
			return normalizedDept.indexOf(normalizedQuery) >= 0;
		}
	}

  render() {
		const {
			nddepartment,
		} = this.props;
		const { depts, dept} = this.state;

		return (
				<div style={BodyGeneral_s}>
				{
						(() => {
									return(
										<CourseSignup
											depts        = {depts}
											dept         = {dept}
											handleSubmit = {this.handleSubmit}
											handleDeptSelectClick = {this.handleDeptSelectClick}
											deptRenderer = {this.deptRenderer}
											filterDept = {this.filterDept}
										/>
									)
						})()
				}
				</div>
    );
  }
}
