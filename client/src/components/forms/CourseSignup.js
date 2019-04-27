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

class CourseSignup extends React.Component {
	render(){
		const {
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
					<h1>Course Registration: please enter in the following information</h1>
					<br />
					<form onSubmit={handleSubmit}>
					Course Name:<br />
					<input type="text" name="name" required="required"/><br/><br/>
					Department:<br />
					<Select
							items={depts}
							itemPredicate={filterDept}
							itemRenderer={deptRenderer}
							onItemSelect={handleDeptSelectClick}
					>
							<Button rightIcon="caret-down"
									text={dept ? dept.ABBREV : "(No selection)"}
							/>
					</Select><br /><br />
                    <input type="hidden" name="netid" value={netid} required="required"/>
					<input type="submit" value="Submit" />
					</form>
			</div>
		)
	}
}

export default CourseSignup;
