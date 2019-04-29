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

class EnrollTASignup extends React.Component {
	render(){
		const {
            netid,
			course,
            coursesList,
			courseRenderer,
			handleCourseSelectClick,
			handleSubmit,
			filterCourse,
            renderTag
		} = this.props;
		return (
			<div style={general_s}>
					<h1>Select a course that you are a TA for:</h1>
					<br />
					<form onSubmit={handleSubmit}>
					Course:<br />
					<Select
							items={coursesList}
							itemPredicate={filterCourse}
							itemRenderer={courseRenderer}
							onItemSelect={handleCourseSelectClick}
					>
                    <Button rightIcon="caret-down"
                            text={course ? course.NAME : "(No selection)"}
                            />
					</Select><br /><br />
					<input type="submit" value="Submit" />
					</form>
			</div>
		)
	}
}

export default EnrollTASignup;
