import React from 'react';
import axios from 'axios';
import {
    Button,
    FormGroup,
    InputGroup,
    Switch,
    Classes,
    MenuItem,
} from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";
import moment from 'moment';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';

const nowMoment = moment().hour(0).minute(0);
const format = 'h:mm a';
const config = require('../config.js')
const serverUrl = 'http'+(config.server.https ?'s':'')+'://'+ config.ip + ':' + config.server.port;

// Styles
const general_s = {
    margin: 20,
}
const inputName_s = {
    maxWidth: 300,
}
const time_s = {
		maxWidth: 100,
		width: 100,
		margin: "auto",
}
const timeblock_s = {
    background: '#DDEEF0',
    padding: 15,
    marginBottom: 20,
}
const bottom_s = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
}
const days_s = {
    height: 30,
    width: 300,
    background: '#DDDDEE',
    margin: 15,
}

export default class extends React.Component {
	state = {
		error: null,
		isLoaded: false,
        netid: "",
		coursesList: [],
		course: null   
	};

	handleSubmit = (event) => {
      // Post TA chosen office hours
      /*
			event.preventDefault();
			const formData = new FormData(event.target);
			var object = {};
			formData.forEach(function(value, key){
					object[key] = value;
			});
            object['cid'] = this.state.course.COURSE_ID;
            object['netid'] = this.props.netid;
			var json = JSON.stringify(object);
			fetch(serverUrl+'/api/courses/enroll/', {
					method: 'POST',
					body: json,
                    headers: {
                        'Content-Type': 'application/json'
                    }
			});
      */
	}

	initialize = () => {
		// server routes
		let courseApi = serverUrl + "/api/courses";

		// make requests to routes
		axios.get(courseApi)
			.then(res => {
				this.setState({ coursesList: res.data })
			})
			.catch(err => console.error(err))
	}
	componentWillMount() {
		this.initialize();
	}

	handleCourseSelectClick = (course) => {
			this.setState({ course });
	}
	courseRenderer = (item, { handleClick, isActive }) => (
		 <MenuItem
				 className={ isActive ? Classes.ACTIVE : "" }
				 key={item.ID}
				 text={item.NAME}
				 onClick={handleClick}
		 />
	)
	filterCourse = (query, course, _index, exactMatch) => {
		const normalizedCourse  = course.NAME.toLowerCase();
		const normalizedQuery = query.toLowerCase();

		if (exactMatch){
			return normalizedCourse === normalizedQuery;
		} else {
			return normalizedCourse.indexOf(normalizedQuery) >= 0;
		}
	}
		render(){
				const { coursesList, course } = this.state;
        return (
            <div style={general_s}>
								<form onSubmit={this.handleSubmit}>
                    <h1>Customize your office hours:</h1><br />
										<header style={{ margin: "10px 0px" }}>Choose a course you TA:</header>
										<Select
												items={coursesList}
												itemPredicate={this.filterCourse}
												itemRenderer={this.courseRenderer}
												onItemSelect={this.handleCourseSelectClick}
										>
												<Button rightIcon="caret-down"
														text={course ? course.NAME : "(No selection)"}
												/>
										</Select><br /><br />
                    <div style={timeblock_s}>
                        Select desired Office Hours:<br />
                        <div style={bottom_s}>
                            <TimePicker
                                showSecond={false}
                                defaultValue={nowMoment}
                                format={format}
                                use12Hours
                            />
                            <Select
                                items={[]}
                            >
                                <Button
                                    text={"Day"}
                                />
                            </Select>
                            <div style={{ width: 0 }}></div>
                        </div>
                        <TimePicker
                            showSecond={false}
                            defaultValue={nowMoment}
                            format={format}
                            use12Hours
                        />
                        <br /><br />
                        Location:<br /><br />
                        <div style={bottom_s}>
                            <InputGroup id="location" placeholder="Your Location" />
                            <Button>
                                Add hours
                            </Button>
                            <div style={{ width: 0 }}></div>
                        </div>
                    </div>
                    <div style={days_s}>Days</div>
										<input type="submit" value="Submit" />
								</form>
						</div>
        )
    }
}
/*
<Select
    items={Courses}
    onItemSelect={this.handleValueChange}
    itemRenderer={this.renderSelectItem}
>
    <Button rightIcon="caret-down"
        text={course ? course.title : "(No selection)" }
    />
</Select>


*/
