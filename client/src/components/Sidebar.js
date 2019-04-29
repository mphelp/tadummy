import React from 'react'
import { Tag } from '@blueprintjs/core'
import axios from 'axios';

// CSS
import 'status-indicator/styles.css'

const $ = require('jquery');
const config = require('../config.js')
const serverUrl = 'http'+(config.server.https ?'s':'')+'://'+ config.ip + ':' + config.server.port;

const SidebarGeneral_s = {
    overflow: "auto",
    poxition: "fixed",
    height: "100%",
    backgroundColor: "#e1e1f1",
    width: "20%",
    minWidth: "300px",
    display: "flex",
    flexDirection: "column",
}
const Status_s = {
		alignSelf: "flex-end",
		marginRight: "auto",

}
const header_s = {
    margin: 20,
}
const TagContent_s = {
		flexDirection: "row",
		display: "flex",
		justifyContent: "space-between",
}
const TagContent_sColumn = {
		flexDirection: "column",
		display: "flex",
		justifyContent: "space-between",
}
const Tag_s = {
		margin: 5,
}
export default class extends React.Component {
    constructor(props){
		super(props);
	}
    state = {
        netid: "",
		TAs: []
	};
    initializeSignup = () => {
		// server routes
		let taApi = serverUrl + "/api/students/" + this.props.netid + "/tas";

		// make requests to routes
		axios.get(taApi)
			.then(res => {
				this.setState({ TAs: res.data })
			})
			.catch(err => console.error(err))
	}
	componentWillMount() {
		this.initializeSignup();
	}
    render(){
        return (
            <div style={SidebarGeneral_s}>
									<h3 style={header_s}>Statuses:</h3>
											{this.state.TAs.map( TA  => (
													<Tag round={true} large={true} style={Tag_s}>
															<div style={TagContent_s}>
																	{ TA.NAME }
																	<div>
																			{ (() => {
																				if(TA.AVAILABILITY == "active") {
																					return (
																						<status-indicator active pulse multiline='True'
																								style={Status_s}
																						/>
																					)
																				} else if (TA.AVAILABILITY == "positive"){
																					return (
																						<status-indicator positive pulse multiline='True'
																								style={Status_s}
																						/>
																					)
																				} else if (TA.AVAILABILITY == "intermediary"){
																					return (
																						<status-indicator intermediary pulse multiline='True'
																								style={Status_s}
																						/>
																					)
																				} else if (TA.AVAILABILITY == "negative"){
																					return (
																						<status-indicator negative pulse multiline='True'
																								style={Status_s}
																						/>
																					)
																				} else if (TA.AVAILABILITY == "offline"){
																					return (
																						<status-indicator pulse multiline='True'
																								style={Status_s}
																						/>
																					)
																				}
																				})()
																			}
																	</div>
															</div>
                                                            <div>
                                                            {TA.COURSE_NAME}
                                                            </div>
                                                            <div style={TagContent_sColumn}>
                                                            {TA.STATUS}
                                                            </div>
													</Tag>
											))}
            </div>
        )
    }
}
