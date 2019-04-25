import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// Framework CSS
import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/select/lib/css/blueprint-select.css";

// My CSS
import './App.css';

const config = require('../config.js')
var serverURL = 'http'+(config.server.https ?'s':'')+'://'+ config.ip + ':' + config.server.port;

function handleSubmit(event) {
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
        headers:{
            'Content-Type': 'application/json'
        }
    });
}

const HomeFaculty = (props) => (
    <div>
        <h1>Hello Professor {props.displayname}, please sign up!</h1>
        <br/>
        <form onSubmit={handleSubmit}>
        Name:<br />
        <input type="text" name="name" defaultValue={props.displayname} required="required"/><br/><br/>
        NetID:<br />
        <input type="text" name="netid" value={props.netid} readonly = "readonly" required="required"/><br/><br/>
        Department:<br />
        <input type="text" name="department" defaultValue={props.nddepartment} required="required"/><br/><br/>
        Office:<br />
        <input type="text" name="office" defaultValue={props.ndofficeaddress} required="required"/><br/><br/>
        <input type="hidden" name="affiliation" value="PROFESSOR" required="required"/>
        <input type="submit" value="Submit" />
        </form>
        {/*JSON.stringify(props)*/}
    </div>
)

const HomeStudent = (props) => (
    <div>
        <h1>Hello {props.displayname}, please sign up!</h1>
        <br />
        <form onSubmit={handleSubmit}>
        Name:<br />
        <input type="text" name="name" defaultValue={props.displayname} required="required"/><br/><br/>
        NetID:<br />
        <input type="text" name="netid" value={props.netid} readonly = "readonly" required="required"/><br/><br/>
        Major:<br />
        <input type="text" name="major" required="required"/><br/><br/>
        Dorm (or type "Off Campus"):<br />
        <input type="text" name="dorm" required="required"/><br/><br/>
        <input type="hidden" name="affiliation" value="STUDENT" required="required"/>
        <input type="submit" value="Submit" />
        </form>
        {/*JSON.stringify(props)*/}
    </div>
)

const HomeError = (props) => (
    <div>
        <h1>Error: No student or faculty member found with NetID {props.netid}.</h1>
    </div>
)
const BodyGeneral_s = {
    display: "flex",
    flexDirection: "row",
    height: "100%"
}

export default class extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			search: null
		};
	}
	componentDidMount = () => {
	}
  render() {
		return (
                <div style={BodyGeneral_s}>
                {   (() => {
                        if (this.props.ndprimaryaffiliation == "Faculty"){
                            serverURL = serverURL + "/registerFaculty";
                            return(
                            <HomeFaculty {...this.props} />
                            )
                        }
                        if (this.props.ndprimaryaffiliation == "Student"){
                            serverURL = serverURL + "/registerStudent";
                            return(
                            <HomeStudent {...this.props} />
                            )
                        }
                        else {
                            return(
                            <HomeError {...this.props} />
                            )
                        }
                    })()
                }
                </div>
    );
  }
}
