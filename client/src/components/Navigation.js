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
                    <NavbarHeading>TAS</NavbarHeading>
                    <NavbarDivider />
                    <Link to="/" style={subtleLink_s}>
                        <AnchorButton text="HOME" rightIcon="home"/>
                    </Link>
                    <Link to="/apply" style={subtleLink_s}>
                        <AnchorButton text="APPLY" rightIcon="applications"/>
                    </Link>
                    <Link to="/calendar" style={subtleLink_s}>
                        <AnchorButton text="CALENDAR" rightIcon="timeline-events"/>
                    </Link>
                    <Link to="/student_enroll" style={subtleLink_s}>
                        <AnchorButton text="ENROLL IN A COURSE" rightIcon="applications"/>
                    </Link>
                    <Link to="/course_creation" style={subtleLink_s}>
                        <AnchorButton text="CREATE A COURSE" rightIcon="applications"/>
                    </Link>
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
