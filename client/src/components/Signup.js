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
import StudentSignup from "./forms/StudentSignup";
import ProfessorSignup from "./forms/ProfessorSignup";

const $ = require('jquery');
const config = require('../config.js')
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
            if (object['affiliation'] == "STUDENT"){
                object['dorm'] = this.state.dorm.DORM_ID;
                object['major'] = this.state.major.MAJOR_ID;
            }
            else {
                object['dept'] = this.state.dept.DEPARTMENT_ID;
            }
			var json = JSON.stringify(object);
			fetch(serverUrl+'/api/users', {
					method: 'POST',
					body: json,
                    headers: {
                        'Content-Type': 'application/json'
                    }
			}).then(res => {
					console.log('submit res is:');
					console.log(res);
					window.location.href = "calendar/?netid=" + object['netid'];
			}).catch(err => console.error(err))
	}

	initializeSignup = () => {
		// server routes
		let dormApi = serverUrl + "/api/dorms";
		let majorApi = serverUrl + "/api/majors";
		let deptApi = serverUrl + "/api/departments";

		// ldap department is default dept
		const { nddepartment } = this.props;

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
				this.setState({ 
						depts: res.data,
						dept:  res.data.find(item => { return item.NAME == nddepartment; })
				})
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
	handleDeptSelectClick = (dept) => {
			this.setState({ dept })
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
	deptRenderer = (item, { handleClick, isActive }) => (
		 <MenuItem
				 className={ isActive ? Classes.ACTIVE : "" }
				 key={item.DEPARTMENT_ID}
				 text={item.NAME}
				 label={item.ABBREV}
				 onClick={handleClick}
		 />
	)
	filterMajor = (query, major, _index, exactMatch) => {
		const normalizedMajor  = major.MAJOR_NAME.toLowerCase();
		const normalizedQuery = query.toLowerCase();

		if (exactMatch){
			return normalizedMajor === normalizedQuery;
		} else {
			return normalizedMajor.indexOf(normalizedQuery) >= 0;
		}
	}
	filterDorm = (query, dorm, _index, exactMatch) => {
		const normalizedDorm  = dorm.DORM_NAME.toLowerCase();
		const normalizedQuery = query.toLowerCase();

		if (exactMatch){
			return normalizedDorm === normalizedQuery;
		} else {
			return normalizedDorm.indexOf(normalizedQuery) >= 0;
		}
	}
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
			ndprimaryaffiliation,
			displayname,
			netid,
			nddepartment,
			ndofficeaddress,
		} = this.props;
		const { majors, major, depts, dept, dorms, dorm } = this.state;

		return (
				<div style={BodyGeneral_s}>
				{
						(() => {
								if (ndprimaryaffiliation === "Faculty"){
										return(
											<ProfessorSignup
												netid 	     = {netid}
												displayname  = {displayname}
												depts        = {depts}
												dept         = {dept}
												nddepartment = {nddepartment}
												ndofficeaddress = {ndofficeaddress}
												handleSubmit = {this.handleSubmit}
												handleDeptSelectClick = {this.handleDeptSelectClick}
												deptRenderer = {this.deptRenderer}
												filterDept = {this.filterDept}
											/>
										)
								}
								if (ndprimaryaffiliation === "Student"){
										return(
											<StudentSignup
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
												filterMajor            = {this.filterMajor}
												filterDorm             = {this.filterDorm}
											/>
									 )
								}
						})()
				}
				</div>
    );
  }
}
