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


class HomeStudent extends React.Component {
	render(){
		//const { props } = this.props
		console.log(this);
		console.log(this.props);
		return (
			<div>
					<h1>Hello {this.props.displayname}, please sign up!</h1>
					<br />
					<form onSubmit={this.props.handleSubmit}>
					Name:<br />
					<input type="text" name="name" defaultValue={this.props.displayname} required="required"/><br/><br/>
					NetID:<br />
					<input type="text" name="netid" value={this.props.netid} readOnly = "readOnly" required="required"/><br/><br/>
					Major:<br />
					<input type="text" name="major" required="required"/><br/><br/>
					Dorm (or type "Off Campus"):<br />
					<input type="text" name="dorm" required="required"/><br/><br/>
					Major dropdown:<br />
					<Select
							items={[]}
							itemRenderer={this.props.majorRenderer}
							onItemSelect={this.props.handleMajorSelectClick}
					>
							<Button rightIcon="caret-down"
									text={this.props.major ? this.props.major.MAJOR_NAME : "(No selection)" }
							/>
					</Select>
					<input type="hidden" name="affiliation" value="Student" required="required"/>
					<input type="submit" value="Submit" />
					</form>
					{/*JSON.stringify(props)*/}
			</div>
		)
	}
}

export default HomeStudent;
