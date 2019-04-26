import React from 'react';
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
	constructor(props){
		super(props);
	}

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


	initialize = () => {
		// dorm, major, dept setup
		var dormApi = serverUrl + "/api/dorms";
		var majorApi = serverUrl + "/api/majors";
		var deptApi = serverUrl + "/api/departments";
		var dormsTemp = [];
		var majorsTemp = [];
		var deptTemp = [];

		// callbacks ensure requests are completed
		$.getJSON(dormApi, function(dorms){
				dormsTemp = dorms;
				$.getJSON(majorApi, function(majors){
						majorsTemp = majors;
						$.getJSON(deptApi, function(dept){
								deptTemp = dept;

								// Now valid to set state
								console.log(majorsTemp);
								this.state = {
										search: null,
										error: null,
										isLoaded: false,
										dorms: dormsTemp,
										majors: majorsTemp,
										depts: deptTemp,
										major: "",
								};
						});
				});
		});
	}
	componentWillMount () {
		this.initialize()
	}
	handleMajorSelectClick = (major) => {
			this.setState(state => ({ major: major }))
	}
	majorRenderer = (item, { handleClick, isActive }) => (
		 <MenuItem
				 className={ isActive ? Classes.ACTIVE : "" }
				 key={item.MAJOR_ID}
				 label={item.MAJOR_NAME}
				 onClick={handleClick}
		 />
	)
  render() {
		console.log(this.state);
		return (
                <div style={BodyGeneral_s}>
                {   (() => {
                        if (this.props.ndprimaryaffiliation == "Faculty"){
                            serverURL = serverURL + "/registerFaculty";
                            return(
                            <HomeFaculty />
                            )
                        }
                        if (this.props.ndprimaryaffiliation == "Student"){
                            serverURL = serverURL + "/registerStudent";
                            return(
                            	<HomeStudent />
                            )
                        }
                    })()
                }
                </div>
    );
  }
}
