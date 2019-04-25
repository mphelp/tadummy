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


const HomeStudent = (props) => (
    <div>
        <h1>Hello {props.displayname}, please sign up!</h1>
        <br />
        <form onSubmit={props.handleSubmit}>
        Name:<br />
        <input type="text" name="name" defaultValue={props.displayname} required="required"/><br/><br/>
        NetID:<br />
        <input type="text" name="netid" value={props.netid} readOnly = "readOnly" required="required"/><br/><br/>
        Major:<br />
        <input type="text" name="major" required="required"/><br/><br/>
        Dorm (or type "Off Campus"):<br />
        <input type="text" name="dorm" required="required"/><br/><br/>
        Major dropdown:<br />
        <Select
            items={props.majors}
            itemRenderer={props.majorRenderer}
            onItemSelect={props.handleMajorSelectClick}
        >
            <Button rightIcon="caret-down"
                text={props.major ? props.major.MAJOR_NAME : "(No selection)" }
            />
        </Select>
        <input type="hidden" name="affiliation" value="Student" required="required"/>
        <input type="submit" value="Submit" />
        </form>
        {/*JSON.stringify(props)*/}
    </div>
)

export default HomeStudent;
