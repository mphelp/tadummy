import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// Framework CSS
import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/select/lib/css/blueprint-select.css";

// My CSS
import './App.css';

const HomeFaculty = (props) => (
    <div>
        <h1>Hello Professor {props.displayname}, please sign up!</h1>
        <br/>
        <form>
        Name:<br />
        <input type="text" name="name" value={props.displayname}/><br/><br/>
        NetID:<br />
        <input type="text" name="netid" value={props.netid}/><br/><br/>
        Department:<br />
        <input type="text" name="department" value={props.nddepartment}/><br/><br/>
        Office:<br />
        <input type="text" name="office" value={props.ndofficeaddress}/><br/><br/>
        <input type="hidden" name="affiliation" value="Faculty" />
        <input type="submit" value="Submit" />
        </form>
        {/*JSON.stringify(props)*/}
    </div>
)

const HomeStudent = (props) => (
    <div>
        <h1>Hello {props.displayname}, please sign up!</h1>
        <br />
        <form>
        Name:<br />
        <input type="text" name="name" value={props.displayname}/><br/><br/>
        NetID:<br />
        <input type="text" name="netid" value={props.netid}/><br/><br/>
        Major:<br />
        <input type="text" name="major" /><br/><br/>
        Dorm (or type "Off Campus"):<br />
        <input type="text" name="dorm" /><br/><br/>
        <input type="hidden" name="affiliation" value="Student" />
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
                            return(
                            <HomeFaculty {...this.props} />
                            )
                        }
                        if (this.props.ndprimaryaffiliation == "Student"){
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
