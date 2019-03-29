import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Navigation from './Navigation';
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

export default class extends React.Component {
  render() {
		return (
			<BrowserRouter>
				<div>
                    <Navigation />
					<Switch>
						<Route exact path="/" component={Home}/>
						<Route path="/apply" component={Apply}/>
						<Route path="/calendar" component={Calendar}/>
						<Route render={() => <h1>Page not found</h1>}/>
					</Switch>
				</div>
			</BrowserRouter>
    );
  }
}
