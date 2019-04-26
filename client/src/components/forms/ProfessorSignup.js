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

const general_s = {
	margin: 30,
}
const office_s = {
	minWidth: 400,
}

class ProfessorSignup extends React.Component {
	render(){
		const {
			displayname,
			nddepartment,
			ndofficeaddress,
			netid,
			dept,
			depts,
			deptRenderer,
			handleDeptSelectClick,
			handleSubmit,
			filterDept,
		} = this.props;

		return (
			<div style={general_s}>
					<h1>Hello Prof. {displayname}, please sign up!</h1>
					<br />
					<form onSubmit={handleSubmit}>
					Name:<br />
					<input type="text" name="name" defaultValue={displayname} required="required"/><br/><br/>
					NetID:<br />
					<input type="text" name="netid" value={netid} readOnly = "readOnly" required="required"/><br/><br/>
					Department:<br />
					<Select
							items={depts}
							itemPredicate={filterDept}
							itemRenderer={deptRenderer}
							onItemSelect={handleDeptSelectClick}
					>
							<Button rightIcon="caret-down"
									text={dept ? dept.ABBREV : nddepartment}
							/>
					</Select><br /><br />
					Office:<br />
					<input style={office_s} type="text" name="office" defaultValue={ndofficeaddress} required="required"/><br /><br />
					<input type="hidden" name="affiliation" value="PROFESSOR" required="required"/>
					<input type="submit" value="Submit" />
					</form>
			</div>
		)
	}
}

export default ProfessorSignup;
