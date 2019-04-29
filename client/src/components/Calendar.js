import React from 'react';
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

const customEvent = event => {
  return (
    <span>
      {event.title}<br />
      Location: {event.event.location}<br />
    </span>
  )
}
// Calendar Localizer
const localizer = BigCalendar.momentLocalizer(moment)

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
                        events.push({
                            start: new Date(obj.STARTTIME),
                            end:   new Date(obj.ENDTIME),
                            title: obj.TYPE,
                            tooltip: "Tooltip",
                            location: obj.LOCATION,
                        })
                    }
                });
                this.setState({ events }, () => console.log(this.state));
            })
            .catch(err => console.error(err))
    }
    componentWillMount(){
        this.retrieve()
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
                />
            </div>
        )
    }
}
