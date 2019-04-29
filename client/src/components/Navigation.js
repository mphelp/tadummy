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
                    <NavbarHeading>TASystem</NavbarHeading>
                    <NavbarDivider />
                    <Link to="/calendar" style={subtleLink_s}>
                        <AnchorButton text="CALENDAR" rightIcon="timeline-events"/>
                    </Link>
                    <NavbarDivider />
                    <NavbarHeading>Manage Courses</NavbarHeading>
                    <Link to="/student_enroll" style={subtleLink_s}>
                        <AnchorButton text="ENROLL" rightIcon="applications"/>
                    </Link>
                    <Link to="/course_creation" style={subtleLink_s}>
                        <AnchorButton text="CREATE" rightIcon="applications"/>
                    </Link>
                    <NavbarDivider />
                    <NavbarHeading>TA</NavbarHeading>
                    <Link to="/contact" style={subtleLink_s}>
                        <AnchorButton text="CONTACT US" rightIcon="envelope"/>
                    </Link>
                    <NavbarDivider />
                    <NavbarHeading>Hello {this.props.netid}!</NavbarHeading>
                </NavbarGroup>
            </Navbar>
        )
    }
}
