import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Navigation from './Navigation';
import Sidebar from './Sidebar';
import Apply from './Apply';
import Calendar from './Calendar';
import CourseRegistration from './CourseRegistration';

// Framework CSS
import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/select/lib/css/blueprint-select.css";

// My CSS
import './App.css';

const Home = () => (
    <h1>
        This will be our Home sweet home.
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
		console.log(window.location.search);
		let search = window.location.search;
		this.setState({ search });
	}
  render() {
		return (
			<BrowserRouter>
                <Navigation netid={this.props.netid}/>
                <div
                    style={BodyGeneral_s}
                >
                    <Sidebar />
                    <Switch>
                        <Route exact path="/" component={Home}/>
                        <Route path="/apply" component={Apply}/>
                        <Route path="/calendar" component={Calendar}/>
                        <Route path="/course_creation" render={(props) => <CourseRegistration netid={this.props.netid} isAuthed={true} />} />
                        <Route path="/contact" component={Contact}/>
                        <Route render={() => <h1>Page not found</h1>}/>
                    </Switch>
                </div>
			</BrowserRouter>
    );
  }
}
