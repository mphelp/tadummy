import React from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Styles
const general_s = {
    margin: 20,
    maxHeight: 600,
}

// Calendar Localizer
const localizer = BigCalendar.momentLocalizer(moment)

export default class extends React.Component {
    render(){
        return (
            <div style={general_s}>
                <BigCalendar
                    localizer={localizer}
                    events={[]}
                    startAccessor="start"
                    endAccessor="end"
                />
            </div>
        )
    }
}
