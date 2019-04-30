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
        <div>
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
                    { (() => {
                        if (this.props.roles.PROFESSOR){
                        return(
                            <Link to="/course_creation" style={subtleLink_s}>
                                <AnchorButton text="CREATE" rightIcon="add"/>
                            </Link>
                        )}}
                    )()}
                    <NavbarDivider />
                    { (() => {
                        if (this.props.roles.STUDENT){
                            return (
                                <NavbarHeading>TA</NavbarHeading>
                            )
                        }}
                    )()}
                    { (() => {
                        if (this.props.roles.STUDENT){
                            return (
                                <Link to="/enrollTA" style={subtleLink_s}>
                                    <AnchorButton text="BECOME" rightIcon="new-object"/>
                                </Link>
                            )
                        }}
                    )()}
                    { (() => {
                        if (this.props.roles.STUDENT){
                            return (
                                <NavbarDivider />
                            )
                        }}
                    )()}
                    { (() => {
                        if (this.props.roles.PROFESSOR || this.props.roles.TA){
                        return(
                            <NavbarHeading>Office Hours</NavbarHeading>
                        )}}
                    )()}
                    { (() => {
                        if (this.props.roles.PROFESSOR || this.props.roles.TA){
                        return(
                            <Link to="/update_status" style={subtleLink_s}>
                                <AnchorButton text="UPDATE STATUS" rightIcon="edit"/>
                            </Link>
                        )}}
                    )()}
                    { (() => {
                        if (this.props.roles.PROFESSOR || this.props.roles.TA){
                        return(
                            <Link to="/select_hours" style={subtleLink_s}>
                                <AnchorButton text="SELECT HOURS" rightIcon="time"/>
                            </Link>
                        )}}
                    )()}
                    { (() => {
                        if (this.props.roles.PROFESSOR || this.props.roles.TA){
                        return(
                            <Link to="/delete_hours" style={subtleLink_s}>
                                <AnchorButton text="DELETE HOURS" rightIcon="trash"/>
                            </Link>
                        )}}
                    )()}
                    <NavbarDivider />
                    </NavbarGroup>
					<NavbarGroup align={Alignment.RIGHT}>
                    <NavbarHeading>Hello {this.props.netid}!</NavbarHeading>
					</NavbarGroup>
                    </Navbar>
            </div>
        )
    }
}
