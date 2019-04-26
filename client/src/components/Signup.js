import React from 'react';
import axios from 'axios';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import {
    FormGroup,
    InputGroup,
    Classes,
    MenuItem,
    Button
} from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";
// Framework CSS
import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/select/lib/css/blueprint-select.css";

// My CSS
import HomeStudent from "./forms/HomeStudent";
import HomeFaculty from "./forms/HomeFaculty";

const $ = require('jquery');
const config = require('../config.js')
var serverURL = 'http'+(config.server.https ?'s':'')+'://'+ config.ip + ':' + config.server.port;
const serverUrl = 'http'+(config.server.https ?'s':'')+'://'+ config.ip + ':' + config.server.port;

const BodyGeneral_s = {
    display: "flex",
    flexDirection: "row",
    height: "100%"
}

export default class extends React.Component {
	state = {
		search: null,
		error: null,
		isLoaded: false,
		dorms: [],
		majors: [],
		depts: [],
		major: null,
		dorm: null,
		dept: null,
	};

	handleSubmit = (event) => {
			event.preventDefault();
			const formData = new FormData(event.target);
			var object = {};
			formData.forEach(function(value, key){
					object[key] = value;
			});
			var json = JSON.stringify(object);
			fetch(serverURL, {
					method: 'POST',
					body: json,
			});
	}

	initializeSignup = () => {
		// server routes
		let dormApi = serverUrl + "/api/dorms";
		let majorApi = serverUrl + "/api/majors";
		let deptApi = serverUrl + "/api/departments";

		// make requests to routes
		axios.get(dormApi)
			.then(res => {
				this.setState({ dorms: res.data })
			})
			.catch(err => console.error(err))
		axios.get(majorApi)
			.then(res => {
				this.setState({ majors: res.data })
			})
			.catch(err => console.error(err))
		axios.get(deptApi)
			.then(res => {
				this.setState({ depts: res.data })
			})
			.catch(err => console.error(err))
	}
	componentWillMount() {
		this.initializeSignup()
	}
	handleMajorSelectClick = (major) => {
			this.setState({ major })
	}
	handleDormSelectClick = (dorm) => {
			this.setState({ dorm })
	}
	majorRenderer = (item, { handleClick, isActive }) => (
		 <MenuItem
				 className={ isActive ? Classes.ACTIVE : "" }
				 key={item.MAJOR_ID}
				 text={item.MAJOR_NAME}
				 onClick={handleClick}
		 />
	)
	dormRenderer = (item, { handleClick, isActive }) => (
		 <MenuItem
				 className={ isActive ? Classes.ACTIVE : "" }
				 key={item.DORM_ID}
				 text={item.DORM_NAME}
				 onClick={handleClick}
		 />
	)
  render() {
		const { ndprimaryaffiliation, displayname, netid } = this.props;
		const { majors, major, depts, dept, dorms, dorm } = this.state;

		return (
				<div style={BodyGeneral_s}>
				{
						(() => {
								if (ndprimaryaffiliation == "Faculty"){
										serverURL = serverURL + "/registerFaculty";
										return(
											<HomeFaculty 
												netid 	     = {netid}
												displayname  = {displayname}
												handleSubmit = {this.handleSubmit}
											/>
										)
								}
								if (ndprimaryaffiliation == "Student"){
										serverURL = serverURL + "/registerStudent";
										return(
											<HomeStudent 
												netid 			 = {netid}
												displayname  = {displayname}
												majors 			 = {majors}
												major        = {major}
												dorms        = {dorms}
												dorm         = {dorm}
												handleSubmit           = {this.handleSubmit}
												handleMajorSelectClick = {this.handleMajorSelectClick}
												handleDormSelectClick  = {this.handleDormSelectClick}
												majorRenderer          = {this.majorRenderer}
												dormRenderer           = {this.dormRenderer}
											/>
									 )
								}
						})()
				}
				</div>
    );
  }
}
