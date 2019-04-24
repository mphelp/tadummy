import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// Framework CSS
import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/select/lib/css/blueprint-select.css";

// My CSS
import './App.css';

const Home = (props) => (
    <h1>
    Hello {props.netid}, please sign up!
    </h1>
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
	}
  render() {
		return (
                <div style={BodyGeneral_s}>
                    <Home {...this.props} />
                </div>
    );
  }
}
