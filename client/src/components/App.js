import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Navigation from './Navigation';
import Sidebar from './Sidebar';
import Apply from './Apply';
import Calendar from './Calendar';
import CourseRegistration from './CourseRegistration';
import StudentCourseEnroll from './StudentCourseEnroll';
import EnrollTA from './EnrollTA';
import UpdateStatus from './UpdateStatus';
import SelectHours from './SelectHours';
import DeleteOH from './DeleteOH';

// Framework CSS
import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/select/lib/css/blueprint-select.css";

// My CSS
import './App.css';

const Home = () => (
    <h1>
        TAS Home.
    </h1>
)
const Contact = () => (
    <p>
        Contact us <a href='/contact'>here</a>.
    </p>
)

const BodyGeneral_s = {
    display: "flex",
    flexDirection: "row",
    height: "100%"
}

export default class extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			search: null
		};
	}
	componentDidMount = () => {
		let search = window.location.search;
		this.setState({ search });
	}
  render() {
		return (
			<BrowserRouter>
                <Navigation {...this.props}/>
                <div
                    style={BodyGeneral_s}
                >
                    <Sidebar netid={this.props.netid}/>
                    <Switch>
                        <Route exact path="/" component={Home}/>
                        <Route path="/calendar" render={(props) => <Calendar netid={this.props.netid} />} />
                        <Route path="/student_enroll" render={(props) => <StudentCourseEnroll netid={this.props.netid} isAuthed={true} />} />
                        <Route path="/course_creation" render={(props) => <CourseRegistration netid={this.props.netid} isAuthed={true} />} />
						<Route path="/select_hours" render={props => <SelectHours {...this.props} isAuthed={true} />} />
                        <Route path="/update_status" render={(props) => <UpdateStatus netid={this.props.netid} isAuthed={true} />} />
                        <Route path="/contact" component={Contact}/>
                        <Route path="/enrollTA" render={(props) => <EnrollTA netid={this.props.netid} isAuthed={true} />} />
                        <Route path="/updatestatusTA" render={(props) => <UpdateStatus netid={this.props.netid} isAuthed={true} />} />
                        <Route path="/delete_hours" render={(props) => <DeleteOH netid={this.props.netid} isAuthed={true} />} />
                        <Route render={() => <h1>Page not found</h1>}/>
                    </Switch>
                </div>
			</BrowserRouter>
    );
  }
}
