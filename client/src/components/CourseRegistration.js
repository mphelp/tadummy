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
    constructor(props){
		super(props);
	}
	state = {
		search: null,
		error: null,
		isLoaded: false,
        netid: "",
		depts: [],
        sems: [],
		dept: null,
        sem: null
	};

	handleSubmit = (event) => {
			event.preventDefault();
			const formData = new FormData(event.target);
			var object = {};
			formData.forEach(function(value, key){
					object[key] = value;
			});
            object['dept'] = this.state.dept.DEPARTMENT_ID;
            object['semester'] = this.state.sem.SID;
            object['netid'] = this.props.netid;
			var json = JSON.stringify(object);
			fetch(serverUrl+'/api/courses', {
					method: 'POST',
					body: json,
                    headers: {
                        'Content-Type': 'application/json'
                    }
			})
            .then(() => alert("Course created."))
            .catch(err => alert(err))
	}

	initializeSignup = () => {
		// server routes
		let deptApi = serverUrl + "/api/departments";
        let semApi = serverUrl + "/api/semesters";

		// make requests to routes
		axios.get(deptApi)
			.then(res => {
				this.setState({ depts: res.data })
			})
			.catch(err => console.error(err))
        axios.get(semApi)
    		.then(res => {
    			this.setState({ sems: res.data })
    		})
    		.catch(err => console.error(err))
	}
	componentWillMount() {
		this.initializeSignup();
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

    handleSemSelectClick = (sem) => {
            this.setState( { sem })
    }

    semRenderer = (item, { handleClick, isActive }) => (
		 <MenuItem
				 className={ isActive ? Classes.ACTIVE : "" }
				 key={item.SEMESTER_ID}
				 text={"Start Date: " + item.STARTDATE.substring(0, 10)}
				 label={"End Date: " + item.ENDDATE.substring(0, 10)}
				 onClick={handleClick}
		 />
	)
	filterSem = (query, sem, _index, exactMatch) => {
		const normalizedSem  = "Start Date: " + sem.STARTDATE + " End Date: " + sem.ENDDATE;
		const normalizedQuery = query;

		if (exactMatch){
			return normalizedSem === normalizedQuery;
		} else {
			return normalizedSem.indexOf(normalizedQuery) >= 0;
		}
	}


  render() {
		const {
            netid,
			nddepartment,
		} = this.props;
		const { depts, dept, sems, sem} = this.state;
		return (
				<div style={BodyGeneral_s}>
				{
						(() => {
									return(
										<CourseSignup
                                            netid        = {netid}
											depts        = {depts}
											dept         = {dept}
                                            sems         = {sems}
                                            sem          = {sem}
											handleSubmit = {this.handleSubmit}
											handleDeptSelectClick = {this.handleDeptSelectClick}
											deptRenderer = {this.deptRenderer}
											filterDept = {this.filterDept}
                                            handleSemSelectClick = {this.handleSemSelectClick}
											semRenderer = {this.semRenderer}
											filterSem = {this.filterSem}
										/>
									)
						})()
				}
				</div>
    );
  }
}
