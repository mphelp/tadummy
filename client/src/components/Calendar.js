import React from 'react';
import {
  FormGroup,
  Switch
} from "@blueprintjs/core";
import axios from 'axios';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const config = require('../config.js');
const serverAddr = 'http'+(config.server.https ? 's':'')+'://'+config.ip+':'+config.server.port;

// Styles
const general_s = {
    margin: 20,
    maxHeight: 600,
    minWidth: 1000,
}
const categories_s = {
    width: 350,
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
}
const category_s = {
    display: 'flex',
}
const label_s = {
    margin: "-6px 0px 0px 0px"
}
const customEvent = event => {
  const { type } = event.event;
  if (type === "TA"){
    return (
      <span>
        {event.event.teacher} at <br />
        {event.event.location}<br />
      </span>
    )
  } else if (type === "PROF"){
    return (
      <span>
        {event.event.teacher} at <br />
        {event.event.location}<br />
      </span>
    )
  } else if (type === "COURSE"){
    return (
      <span>
        {event.event.teacher} at <br />
        {event.event.location}<br />
      </span>
    )
  } else {
    return <div>Unclassified event</div>
  }
}
// Calendar Localizer
const localizer = BigCalendar.momentLocalizer(moment)

// Event colors
const colors = {
  'TA': 'LightCoral',
  'PROF': 'MediumPurple',
  'COURSE': 'SteelBlue',
  'none': 'LightSalmon',
}
export default class extends React.Component {
    state = {
        events: [],
        tas: [],
        profs: [],
        courses: [],

        qTAS: true,
        qPROFS: true,
        qCOURSES: true,
    }
    // Retrieve TA office hour blocks
    retrieve = () => {
        let calendarApi = serverAddr + '/api/users/' + this.props.netid + '/calendar';
        axios.get(calendarApi)
            .then(res => {
                let events = [];
                let tas = [];
                let profs = [];
                let courses = [];
                res.data.forEach(obj => {
                    if (new Date(obj.STARTTIME) <= new Date(obj.ENDTIME)){
                        let thisevent = {
                            start: new Date(obj.STARTTIME),
                            end:   new Date(obj.ENDTIME),
                            type: obj.TYPE,
                            location: obj.LOCATION,
                            teacher: obj.TEACHER,
                        };
                        thisevent['color'] = colors.hasOwnProperty(obj.TYPE) ? colors[obj.TYPE] : colors['none'];
                        events.push(thisevent);   
                        if (thisevent.type === "TA"){
                            tas.push(thisevent);
                        } else if (thisevent.type === "PROF"){
                            profs.push(thisevent);
                        } else if (thisevent.type === "COURSE"){
                            courses.push(thisevent)
                        }
                    }
                });
                this.setState({ events, profs, tas, courses })
            })
            .catch(err => console.error(err))
    }
    componentWillMount(){
        this.retrieve()
    }
    onTASClick = event => {
        this.setState({ qTAS: !this.state.qTAS })
    }
    onPROFSClick = () => {
        this.setState({ qPROFS: !this.state.qPROFS })
    }
    onCOURSESClick = () => {
        this.setState({ qCOURSES: !this.state.qCOURSES })
    }
    render(){
        const { qTAS, qPROFS, qCOURSES, tas, profs, courses } = this.state;
        return (
            <div style={general_s}>
                <BigCalendar
                    localizer={localizer}
                    events={
                        [
                            ...(qTAS ? tas : []),
                            ...(qPROFS ? profs : []),
                            ...(qCOURSES ? courses : [])
                        ]
                    }
                    startAccessor="start"
                    endAccessor="end"
                    components={{ event: customEvent }}
                    eventPropGetter={ event => ({
                        style: {
                            backgroundColor: event.color,
                        },
                    })}
                />
                <div style={categories_s}>
                    <Switch 
                        checked={qTAS}   
                        onChange={this.onTASClick.bind(this)} 
                        labelElement={<h3 style={label_s}>TA</h3>} 
                        large={true} style={category_s}
                    />
                    <Switch 
                        checked={qPROFS}   
                        onChange={this.onPROFSClick.bind(this)} 
                        labelElement={<h3 style={label_s}>PROF</h3>} 
                        large={true} style={category_s}
                    />
                    <Switch 
                        checked={qCOURSES} 
                        onChange={this.onCOURSESClick.bind(this)} 
                        labelElement={<h3 style={label_s}>COURSES</h3>} 
                        large={true} style={category_s}
                    />
                </div>
            </div>
        )
    }
}
