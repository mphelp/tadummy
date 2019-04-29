import React from 'react';
import { Link } from 'react-router-dom';
import {
    Alignment,
    AnchorButton,
    Classes,
    Navbar,
    NavbarGroup,
    NavbarHeading,
    NavbarDivider,
} from "@blueprintjs/core";

// Styles
const subtleLink_s = {
    textDecoration: "none",
}
export default class extends React.PureComponent {
    constructor(props){
		super(props);
	}
    render(){
        return (
            <Navbar className={Classes.DARK}>
                <NavbarGroup align={Alignment.LEFT}>
                    <NavbarHeading>TASYSTEM</NavbarHeading>
                    <NavbarDivider />
                    <Link to="/calendar" style={subtleLink_s}>
                        <AnchorButton text="CALENDAR" rightIcon="timeline-events"/>
                    </Link>
                    <NavbarDivider />
                    <NavbarHeading>Courses</NavbarHeading>
                    <Link to="/student_enroll" style={subtleLink_s}>
                        <AnchorButton text="ENROLL" rightIcon="applications"/>
                    </Link>
                    <Link to="/course_creation" style={subtleLink_s}>
                        <AnchorButton text="CREATE" rightIcon="applications"/>
                    </Link>
                    <NavbarDivider />
                    <NavbarHeading>TA</NavbarHeading>
                    <Link to="/" style={subtleLink_s}>
                        <AnchorButton text="BECOME" rightIcon="envelope"/>
                    </Link>
                    <Link to="/select_hours" style={subtleLink_s}>
                        <AnchorButton text="SELECT HOURS" rightIcon="envelope"/>
                    </Link>
                    <NavbarDivider />
                </NavbarGroup>
								<NavbarGroup align={Alignment.RIGHT}>
                    <NavbarHeading>Hello {this.props.netid}!</NavbarHeading>
								</NavbarGroup>
            </Navbar>
        )
    }
}
