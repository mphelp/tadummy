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

class StudentSignup extends React.Component {
	render(){
		const {
			displayname,
			netid,
			major,
			dorm,
			majors,
			dorms,
			majorRenderer,
			dormRenderer,
			handleMajorSelectClick,
			handleDormSelectClick,
			handleSubmit,
			filterMajor,
			filterDorm,
		} = this.props;

		return (
			<div style={general_s}>
					<h1>Hello {displayname}, please sign up!</h1>
					<br />
					<form onSubmit={handleSubmit}>
					Name:<br />
					<input type="text" name="name" defaultValue={displayname} required="required"/><br/><br/>
					NetID:<br />
					<input type="text" name="netid" value={netid} readOnly = "readOnly" required="required"/><br/><br/>
					Major dropdown:<br />
					<Select
							items={majors}
							itemPredicate={filterMajor}
							itemRenderer={majorRenderer}
							onItemSelect={handleMajorSelectClick}
					>
							<Button rightIcon="caret-down"
									text={major ? major.MAJOR_NAME : "(No selection)" }
							/>
					</Select><br /><br />
					Dorm dropdown:<br />
					<Select
							items={dorms}
							itemPredicate={filterDorm}
							itemRenderer={dormRenderer}
							onItemSelect={handleDormSelectClick}
					>
							<Button rightIcon="caret-down"
									text={dorm ? dorm.DORM_NAME : "(No selection)" }
							/>
					</Select><br /><br />
					<input type="hidden" name="affiliation" value="STUDENT" required="required"/>
					<input type="submit" value="Submit" />
					</form>
			</div>
		)
	}
}

export default StudentSignup;
