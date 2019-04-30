import React from 'react';
import axios from 'axios';
import {
    FormGroup,
    InputGroup,
    Switch,
    Classes,
    MenuItem,
    Button
} from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";

const $ = require('jquery');
const config = require('../config.js')
const serverUrl = 'http'+(config.server.https ?'s':'')+'://'+ config.ip + ':' + config.server.port;

const avails = [
    {
        text: 'Available',
        id: 1,
        desc: 'positive',
    },
    {
        text: 'Busy',
        id: 2,
        desc: 'negative',
    },
    {
        text: 'Offline',
        id: 3,
        desc: 'offline',
    },
]

// Styles
const general_s = {
    margin: 20,
}
const inputName_s = {
    maxWidth: 300,
}

export default class extends React.Component {
    constructor(props){
		super(props);
	}
    state = {
        netid: "",
		avail: null,
        course: null,
        courseList: []
	};
    initializeSignup = () => {
		// server routes
		let courseApi = serverUrl + "/api/officehours/" + this.props.netid + "/courses";

		// make requests to routes
		axios.get(courseApi)
			.then(res => {
				this.setState({ courseList: res.data }, () => {
                    if (this.state.courseList){
                        this.setState({ course: this.state.courseList[0] });
                        this.setState({avail : avails[this.state.courseList[0].AVAIL_ID-1]})
                    }
                })
			})
			.catch(err => console.error(err))
	}
	componentWillMount() {
		this.initializeSignup();
	}

    handleSelectClick = (avail) => {
        this.setState(state => ({ avail: avail }))
    }

    handleSubmit = (event) => {
			event.preventDefault();
			fetch(serverUrl+'/api/officehours/' + this.props.netid + "/" + this.state.course.CID, {
					method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
			})
            .then(() => alert("Office Hours Deleted."))
            .catch(err => alert(err))
	}

    itemRenderer = (item, { handleClick, isActive }) => (
        <MenuItem
            className={ isActive ? Classes.ACTIVE : "" }
            key={item.id}
            text={item.text}
            onClick={handleClick}
        />
    )
    handleCourseSelectClick = (course) => {
        console.log("clicked");
        console.log(course);
			this.setState({ course }, () => {
                this.setState({ status: course.STATUS }, () => {
                    this.setState({ avail: avails[course.AVAIL_ID-1] });

                })
            })
	}


	courseRenderer = (item, { handleClick, isActive }) => (
		 <MenuItem
				 className={ isActive ? Classes.ACTIVE : "" }
				 key={item.CID}
				 text={item.CNAME}
				 onClick={handleClick}
		 />
	)
	filterCourse = (query, coursez, _index, exactMatch) => {
		const normalizedCourse  = coursez.CNAME.toLowerCase();
		const normalizedQuery = query.toLowerCase();

		if (exactMatch){
			return normalizedCourse === normalizedQuery;
		} else {
			return normalizedCourse.indexOf(normalizedQuery) >= 0;
		}
	}

    render(){
        const {
            avail,
            course,
            courseList
        } = this.state
        return (
            <div style={general_s}>
					<h1>Delete your office hours for a course:</h1>
					<br />
					<form onSubmit={this.handleSubmit}>
                    Course:<br />
					<Select
							items={courseList}
                            itemPredicate={this.filterCourse}
							itemRenderer={this.courseRenderer}
							onItemSelect={this.handleCourseSelectClick}
					>
							<Button rightIcon="caret-down"
									text={course ? course.CNAME : "(No selection)"}
							/>
					</Select><br /><br />
					<input type="submit" value="Submit" />
					</form>
			</div>
        )
    }
}
