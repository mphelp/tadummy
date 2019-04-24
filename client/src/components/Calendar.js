import React from 'react';
import axios from 'axios';
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
    // Retrieve TA office hour blocks
    retrieve = () => {
        console.log('in retrieve');
        axios.get('https://ta.esc.nd.edu:8028/tohblock')
            .then(res => console.log(res.data))
            .catch(err => console.error(err))
    }
    state = {
        events: [],
    }
    componentDidMount(){
        this.retrieve()
    }
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
