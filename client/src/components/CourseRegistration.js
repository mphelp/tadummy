import React from 'react';
import axios from 'axios';
import {
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
            <div>
                    <h1>Course Registration: please enter in the following information</h1>
                    <div style = {BodyGeneral_s}>
                    <br />
                    <form onSubmit={this.handleSubmit}>
                    Course Name:<br />
                    <input type="text" name="name" required="required"/><br/><br/>
                    Department:<br />
                    <Select
                            items={depts}
                            itemPredicate={this.filterDept}
                            itemRenderer={this.deptRenderer}
                            onItemSelect={this.handleDeptSelectClick}
                    >
                            <Button rightIcon="caret-down"
                                    text={dept ? dept.ABBREV : "(No selection)"}
                            />
                    </Select><br /><br />
                    Semester:<br />
                    <Select
                            items={sems}
                            itemPredicate={this.filterSem}
                            itemRenderer={this.semRenderer}
                            onItemSelect={this.handleSemSelectClick}
                    >
                            <Button rightIcon="caret-down"
                                    text={sem ? sem.STARTDATE : "(No selection)"}
                            />
                    </Select><br /><br />
                    <input type="submit" value="Submit" />
                    </form>
                    </div>
            </div>
    );
  }
}
