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
        axios.get(serverAddr + '/tohblock')
            .then(res => {
                let events = [];
                res.data.forEach(obj => {
                    if (new Date(obj.start) <= new Date(obj.end)){
                        events.push({
                            start: new Date(obj.start),
                            end:   new Date(obj.end),
                            title: obj.title,
                            tooltip: "Tooltip",
                            location: "Here",
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
