import React from 'react';
import axios from 'axios';
import {
    Classes,
    MenuItem,
    Button,
    InputGroup,
    Tag,
} from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";
import moment from 'moment';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';

const DaysOfWeek = require('./DaysOfWeek.js');
const nowMoment = moment().hour(0).minute(0);
const format = 'h:mm a';

const $ = require('jquery');
const config = require('../config.js')
const serverUrl = 'http'+(config.server.https ?'s':'')+'://'+ config.ip + ':' + config.server.port;

// Styles
const general_s = {
    margin: 20,
}
const bottom_s = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
const BodyGeneral_s = {
    display: "flex",
    flexDirection: "row",
    height: "100%"
}

export default class extends React.Component {
    constructor(props){
		super(props);
	}
	state = {
		search: null,
		error: null,
		isLoaded: false,
    netid: "",
		depts: [],
    sems: [],
		dept: null,
    sem: null,
    timesChosen: [],
	};

	handleSubmit = (event) => {
			event.preventDefault();
			const formData = new FormData(event.target);
      const { timesChosen } = this.state;
      if (!timesChosen){
          return;
      }
			let body = {};
      let times = [];
			formData.forEach(function(value, key){
					body[key] = value;
			});
      body['dept'] = this.state.dept.DEPARTMENT_ID;
      body['semester'] = this.state.sem.SID;
      body['netid'] = this.props.netid;
      // Times
      timesChosen.forEach(time => {
          times.push({
              starttime: time.starttime,
              endtime: time.endtime,
              location: time.location,
          })
      });
      body['times'] = times;
      console.log(body);
			axios.post(serverUrl + '/api/courses', body)
            .then(() => alert("Course created."))
            .catch(err => alert(err))
      this.removeTimesChosen();
	}

	initialize = () => {
		// server routes
		let deptApi = serverUrl + "/api/departments";
        let semApi = serverUrl + "/api/semesters";

		// make requests to routes
		axios.get(deptApi)
			.then(res => {
				this.setState({ depts: res.data })
			})
			.catch(err => console.error(err))
        axios.get(semApi)
    		.then(res => {
    			this.setState({ sems: res.data })
    		})
    		.catch(err => console.error(err))
	}
	componentWillMount() {
		this.initialize();
	}
  // Handles
	handleDeptSelectClick = dept => {
			this.setState({ dept })
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
  removeTimesChosen = () => {
      this.setState({ timesChosen: [] })
  }
  handleChangeLocation = event => {
      this.setState({ location: event.target.value });
  }
  handleAddHours = () => {
    let properStart = this.state.start.clone();
    let properEnd   = this.state.end.clone();
    if (!this.state.day || !this.state.end || !this.state.start || !this.state.location){
      return;
    }
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

	deptRenderer = (item, { handleClick, isActive }) => (
		 <MenuItem
				 className={ isActive ? Classes.ACTIVE : "" }
				 key={item.DEPARTMENT_ID}
				 text={item.NAME}
				 label={item.ABBREV}
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
	filterDept = (query, dept, _index, exactMatch) => {
		const normalizedDept  = dept.NAME.toLowerCase() + '  ' + dept.ABBREV.toLowerCase();
		const normalizedQuery = query.toLowerCase();

		if (exactMatch){
			return normalizedDept === normalizedQuery;
		} else {
			return normalizedDept.indexOf(normalizedQuery) >= 0;
		}
	}

    handleSemSelectClick = (sem) => {
            this.setState( { sem })
    }

    semRenderer = (item, { handleClick, isActive }) => (
		 <MenuItem
				 className={ isActive ? Classes.ACTIVE : "" }
				 key={item.SEMESTER_ID}
				 text={"Start Date: " + item.STARTDATE.substring(0, 10)}
				 label={"End Date: " + item.ENDDATE.substring(0, 10)}
				 onClick={handleClick}
		 />
	)
	filterSem = (query, sem, _index, exactMatch) => {
		const normalizedSem  = "Start Date: " + sem.STARTDATE + " End Date: " + sem.ENDDATE;
		const normalizedQuery = query;

		if (exactMatch){
			return normalizedSem === normalizedQuery;
		} else {
			return normalizedSem.indexOf(normalizedQuery) >= 0;
		}
	}


  render() {
		const { netid, nddepartment } = this.props;
		const { timesChosen, day, depts, dept, sems, sem} = this.state;
		return (
            <div style={general_s}>
                    <h1>Course Registration: please enter in the following information</h1>
                    <div style = {BodyGeneral_s}>
                    <br />
                    <form onSubmit={this.handleSubmit}>
                    Course Name:<br />
                    <input type="text" name="cname" required="required"/><br/><br/>
                    Department:<br />
                    <Select
                            items={depts}
                            itemPredicate={this.filterDept}
                            itemRenderer={this.deptRenderer}
                            onItemSelect={this.handleDeptSelectClick}
                    >
                            <Button rightIcon="caret-down"
                                    text={dept ? dept.ABBREV : "(No selection)"}
                            />
                    </Select><br /><br />
                    Semester:<br />
                    <Select
                            items={sems}
                            itemPredicate={this.filterSem}
                            itemRenderer={this.semRenderer}
                            onItemSelect={this.handleSemSelectClick}
                    >
                            <Button rightIcon="caret-down"
                                    text={sem ? sem.STARTDATE.substring(0, 10) + " to " + sem.ENDDATE.substring(0, 10) : "(No selection)"}
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
            </div>
    );
  }
}
