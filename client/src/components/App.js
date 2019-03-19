import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';

const Home = () => (
	<div className="App">
		<header className="App-header">
			This is Home. Let's get started boys.
		</header>
	</div>
)
const About = () => <h2>About</h2>

export default class extends Component {
  render() {
		return (
			<BrowserRouter>
				<div>
					<Link to="/">Home</Link>{' '}
					<Link to="/about">About</Link>{' '}
					<Link to="/contact">Contact</Link>



					<Switch>
						<Route exact path="/" component={Home}/>
						<Route path="/about" component={About}/>
						<Route
							path="/contact"
							render={() => <h3>Contact Us</h3>} />
						<Route path="/blog" children={({ match }) => (
							<li className={match ? 'active' : ''}>
								<Link to="/blog">Blog</Link>
							</li>
						)}
							
					</Switch>
				</div>
			</BrowserRouter>
    );
  }
}
