import React from 'react';
import { Select } from "@blueprintjs/select";
import{
    Button
} from "@blueprintjs/core";
// Framework CSS
import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/select/lib/css/blueprint-select.css";

const HomeFaculty = (props) => (
    <div>
        <h1>Hello Professor {props.displayname}, please sign up!</h1>
        <br/>
        <form onSubmit={props.handleSubmit}>
        Name:<br />
        <input type="text" name="name" defaultValue={props.displayname} required="required"/><br/><br/>
        NetID:<br />
        <input type="text" name="netid" value={props.netid} readOnly = "readOnly" required="required"/><br/><br/>
        Department:<br />
        <input type="text" name="department" defaultValue={props.nddepartment} required="required"/><br/><br/>
        Office:<br />
        <input type="text" name="office" defaultValue={props.ndofficeaddress} required="required"/><br/><br/>
        <input type="hidden" name="affiliation" value="Faculty" required="required"/>
        <input type="submit" value="Submit" />
        </form>
        {/*JSON.stringify(props)*/}
    </div>
)

export default HomeFaculty;
