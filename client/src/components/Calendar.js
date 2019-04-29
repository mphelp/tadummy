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
    }
    // Retrieve TA office hour blocks
    retrieve = () => {
        let calendarApi = serverAddr + '/api/students/' + this.props.netid + '/calendar';
        axios.get(calendarApi)
            .then(res => {
                let events = [];
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
                    }
                });
                this.setState({ events }, () => console.log(this.state));
            })
            .catch(err => console.error(err))
    }
    componentWillMount(){
        this.retrieve()
    }
    onTAClick = () => {
    
    }
    onPROFClick = () => {
    
    }
    onCOURSESClick = () => {
    
    }
    render(){
        return (
            <div style={general_s}>
                <BigCalendar
                    localizer={localizer}
                    events={this.state.events}
                    startAccessor="start"
                    endAccessor="end"
                    tooltipAccessor="tooltip"
                    components={{ event: customEvent }}
                    eventPropGetter={ event => ({
                        style: {
                            backgroundColor: event.color,
                        },
                    })}
                />
                <div style={categories_s}>
                    <Switch labelElement={<h3 style={label_s}>TA</h3>} large={true} style={category_s}/>
                    <Switch labelElement={<h3 style={label_s}>PROF</h3>} large={true} style={category_s}/>
                    <Switch labelElement={<h3 style={label_s}>COURSES</h3>} large={true} style={category_s}/>
                </div>
            </div>
        )
    }
}
