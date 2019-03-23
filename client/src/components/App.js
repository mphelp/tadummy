import React from 'react';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import Navigation from './Navigation';

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
const About = () => <h2>About</h2>

export default class extends React.Component {
  render() {
		return (
			<BrowserRouter>
				<div>
                    <Navigation />
					<Link to="/">Home</Link>{' '}
					<Link to="/about">About</Link>{' '}

					<Switch>
						<Route exact path="/" component={Home}/>
						<Route path="/about" component={About}/>
						<Route render={() => <h1>Page not found</h1>}/>
					</Switch>
				</div>
			</BrowserRouter>
    );
  }
}
