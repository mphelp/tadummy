import React from 'react';
import axios from 'axios';
import {
    Tag,
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

const DaysOfWeek = require('./DaysOfWeek.js');
console.log(DaysOfWeek);
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
    width: "100%",
    background: '#DDDDEE',
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    padding: 5,
    marginBottom: 10,
}
const day_s = {
    display: 'flex',
    marginRight: 5,
}

export default class extends React.Component {
	state = {
		error: null,
		isLoaded: false,
    netid: "",
		coursesList: [],
		course: null,

    day: null,
    start: null,
    end: null,
    location: null,
    timesChosen: [],
	};

  removeTimesChosen = () => {
      this.setState({ timesChosen: [] })
  }
	handleSubmit = (event) => {
      event.preventDefault();
      const { course, timesChosen } = this.state;

      // Post TA chosen office hours
      if (!course || !timesChosen){
          return;
      }  
      timesChosen.forEach(time => {
          axios.post(serverUrl + '/api/officehours', {
              netid: this.props.netid,
              cid: course.ID,
              starttime: time.starttime,
              endtime: time.endtime,
              location: time.location,
          }).then(res => {
              console.log(res);
              this.removeTimesChosen();
          })
            .catch(err => console.error(err));
      });
	}
  handleAddHours = () => {
    let properStart = this.state.start.clone();
    let properEnd   = this.state.end.clone();
    if (!this.state.day || !this.state.end || !this.state.start || !this.state.location){
      return;
    }
    // combine time and day of week
    properStart.day(this.state.day.MOMENT.day());
    properEnd.day(this.state.day.MOMENT.day());
    let newBlock = {
      starttime: properStart,
      endtime:   properEnd,
      location: this.state.location,
      id: properStart.format()+properEnd.format()
    };
    if (this.state.timesChosen.find(time => {
        const { starttime, endtime } = time;
        return properStart.isBetween(starttime, endtime, null, '[]') || properEnd.isBetween(starttime, endtime, null, '[]');
    }) === undefined){
      this.setState({ timesChosen: [...this.state.timesChosen, newBlock] })
    }
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

  handleChangeLocation = event => {
      this.setState({ location: event.target.value });
  }
	handleCourseSelectClick = (course) => {
			this.setState({ course });
	}
	handleDaySelectClick = day => {
			this.setState({ day });
	}
  handleDayStart = start => {
      this.setState({ start });    
  }
  handleDayEnd = end => {
      this.setState({ end });    
  }
	courseRenderer = (item, { handleClick, isActive }) => (
		 <MenuItem
				 className={ isActive ? Classes.ACTIVE : "" }
				 key={item.ID}
				 text={item.NAME}
				 onClick={handleClick}
		 />
	)
  dayRenderer = (item, { handleClick, isActive }) => (
		 <MenuItem
				 className={ isActive ? Classes.ACTIVE : "" }
				 key={item.TITLE}
				 text={item.TITLE}
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
				const { coursesList, course, day, timesChosen } = this.state;
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
                                onChange={this.handleDayStart}
                                showSecond={false}
                                defaultValue={nowMoment}
                                format={format}
                                use12Hours
                            />
                            <Select
                                items={DaysOfWeek}
                                itemRenderer={this.dayRenderer}
                                onItemSelect={this.handleDaySelectClick}
                            >
                                <Button
                                    text={day ? day.TITLE : "(Choose Day)"}
                                />
                            </Select>
                            <div style={{ width: 0 }}></div>
                        </div>
                        <TimePicker
                            onChange={this.handleDayEnd}
                            showSecond={false}
                            defaultValue={nowMoment}
                            format={format}
                            use12Hours
                        />
                        <br /><br />
                        Location:<br /><br />
                        <div style={bottom_s}>
                            <InputGroup id="location" placeholder="Your Location" onChange={this.handleChangeLocation.bind(this)} />
                            <Button
                                onClick={this.handleAddHours.bind(this)}
                            >
                                Add hours
                            </Button>
                            <Button
                                onClick={this.removeTimesChosen.bind(this)}
                            >
                                Remove hours
                            </Button>
                        </div>
                    </div>
                    <div style={days_s}>
                        {timesChosen.map(time => (
                            <div key={time.id} style={day_s}>
                                { (() => {
                                    if(time.starttime.day() === 0){
                                        return <Tag>Su</Tag>
                                    } else if (time.starttime.day() === 1){
                                        return <Tag>Mo</Tag>
                                    } else if (time.starttime.day() === 2){
                                        return <Tag>Tu</Tag>
                                    } else if (time.starttime.day() === 3){
                                        return <Tag>We</Tag>
                                    } else if (time.starttime.day() === 4){
                                        return <Tag>Th</Tag>
                                    } else if (time.starttime.day() === 5){
                                        return <Tag>Fr</Tag>
                                    } else {
                                        return <Tag>Sa</Tag>
                                    }
                                })()}    
                            </div>
                        ))}
                    </div>
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
