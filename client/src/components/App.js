import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Navigation from './Navigation';
import Sidebar from './Sidebar';
import Apply from './Apply';

// CSS
import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/select/lib/css/blueprint-select.css";

const Home = () => (
    <header>
        This is Home.
    </header>
)
const Calendar = () => (
    <h2>
        This will be a calendar.
    </h2>
)
const Contact = () => (
    <p>
        Contact us <a href='/contact'>here</a>.
    </p>
)

const BodyGeneral_s = {
    display: "flex"
}

export default class extends React.Component {
  render() {
		return (
			<BrowserRouter>
				<div>
                    <Navigation />
                    <React.Fragment
                        style={BodyGeneral_s}
                    >
                        <Sidebar />
                        <Switch>
                            <Route exact path="/" component={Home}/>
                            <Route path="/apply" component={Apply}/>
                            <Route path="/calendar" component={Calendar}/>
                            <Route path="/contact" component={Contact}/>
                            <Route render={() => <h1>Page not found</h1>}/>
                        </Switch>
                    </React.Fragment>
				</div>
			</BrowserRouter>
    );
  }
}
