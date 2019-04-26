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

function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    var object = {};
    formData.forEach(function(value, key){
        object[key] = value;
    });
    var json = JSON.stringify(object);
    fetch(serverURL+'/api/users', {
        method: 'POST',
        body: json,
    });
}

const BodyGeneral_s = {
    display: "flex",
    flexDirection: "row",
    height: "100%"
}

export default class extends React.Component {
	constructor(props){
        //get dorms
        var dormApi = serverUrl + "/api/dorms";
        var dormsTemp = [];
        var temp = [];
        $.getJSON(dormApi, function(data){
            dormsTemp = data;
            for (var x = 0; x < dormsTemp.length; x++){
                temp[x+1] = dormsTemp[x]['DORM_NAME'];
            }
        });

        //get majors
        var majorApi = serverUrl + "/api/majors";
        var majorsTemp = [];
        var temp2 = [];
        $.getJSON(majorApi, function(data){
            majorsTemp = data;
            for (var x = 0; x < majorsTemp.length; x++){
                temp2[x+1] = majorsTemp[x]['MAJOR_NAME'];
            }
        });

        //get departments
        var deptApi = serverUrl + "/api/departments";
        var deptTemp = [];
        var temp3 = [];


        $.getJSON(deptApi, function(data){
            deptTemp = data;
            for (var x = 0; x < deptTemp.length; x++){
                temp3[x+1] = deptTemp[x]['NAME'];
            }
        });


		super(props);
		this.state = {
            ...props,
			search: null,
            error: null,
            isLoaded: false,
            dorms: dormsTemp,
            majors: majorsTemp,
            depts: deptTemp,
            major: "",
            handleSubmit: handleSubmit,
            majorRenderer: this.majorRenderer,
            handleMajorSelectClick: this.handleMajorSelectClick
		};


	}
    componentDidMount () {

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
		return (
                <div style={BodyGeneral_s}>
                {   (() => {
                        if (this.props.ndprimaryaffiliation == "Faculty"){
                            return(
                            <HomeFaculty {...this.state} />
                            )
                        }
                        if (this.props.ndprimaryaffiliation == "Student"){
                            return(
                            <HomeStudent {...this.state} />
                            )
                        }
                    })()
                }
                </div>
    );
  }
}
