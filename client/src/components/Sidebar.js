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
		marginRight: 8,
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
		TAs: [],
        myCourses: [],
        myInfo: []
	};
  initializeSignup = () => {
      // server routes: ta (i.e. office hours) or mycourses or info
      let infoApi = serverUrl;
      if (this.props.roles.STUDENT){
          infoApi = infoApi + "/api/students/" + this.props.netid;
      }
      if (this.props.roles.PROFESSOR){
          infoApi = infoApi + "/api/professors/" + this.props.netid;
      }
      let taApi = serverUrl + "/api/users/" + this.props.netid + "/tas";
      let myApi = serverUrl + "/api/officehours/" + this.props.netid + "/courses";
      // make requests to routes
      axios.get(taApi)
        .then(res => {
          this.setState({ TAs: res.data }, () => console.log(this.state.TAs))
        })
        .catch(err => console.error(err))
          axios.get(myApi)
          .then(res => {
            this.setState({ myCourses: res.data }, () => console.log(this.state.myCourses))
          })
          .catch(err => console.error(err))
          axios.get(infoApi)
            .then(res => {
              this.setState({ myInfo: res.data })
            })
              .then(console.log(this.state.myInfo))
            .catch(err => console.error(err))
	}
	componentWillMount() {
		this.initializeSignup();
	}
    render(){
        return (
            <div style={SidebarGeneral_s}>
                <h3 style={header_s}>My Courses:</h3>
                <div>
                {console.log(this.state.myInfo)}
                {console.log("above")}
                { (() => {
                    if (this.props.roles.STUDENT){
                        return(
                            <div>
                            Name: {this.state.myInfo['NAME']}<br />
                            Major: {this.state.myInfo['MAJOR_NAME']}<br />
                            Dorm: {this.state.myInfo['DORM_NAME']}<br />
                            </div>
                    )}
                    if (this.props.roles.PROFESSOR){
                        return(
                            <div>
                            Name: {this.state.myInfo['NAME']}<br />
                            Office: {this.state.myInfo['OFFICE']}<br />
                            Department: {this.state.myInfo['DEPT']}<br />
                            </div>
                    )}
                }
                )()}
                </div>
                    {this.state.myCourses.map( info => (
                        <Tag round={true} large={true} style={Tag_s}>
                            <div style={TagContent_s}>
                                <div>
                                    { info.CNAME }
                                </div>
                                <div style={{flexDirection:'flex-end'}}>
                                    { (() => {
                                        if(info.AVAIL_DESC == "active") {
                                            return (
                                                <status-indicator active pulse multiline='True'
                                                        style={Status_s}
                                                />
                                            )
                                        } else if (info.AVAIL_DESC == "positive"){
                                            return (
                                                <status-indicator positive pulse multiline='True'
                                                        style={Status_s}
                                                />
                                            )
                                        } else if (info.AVAIL_DESC == "intermediary"){
                                            return (
                                                <status-indicator intermediary pulse multiline='True'
                                                        style={Status_s}
                                                />
                                            )
                                        } else if (info.AVAIL_DESC == "negative"){
                                            return (
                                                <status-indicator negative pulse multiline='True'
                                                        style={Status_s}
                                                />
                                            )
                                        } else if (info.AVAIL_DESC == "offline"){
                                            return (
                                                <status-indicator pulse multiline='True'
                                                        style={Status_s}
                                                />
                                            )
                                        }
                                        })() } 
                                    </div>
                                </div>
                                <div style={TagContent_sColumn}>
                                    {info.STATUS}
                                </div>
                        </Tag>
                    ))}

									<h3 style={header_s}>Office Hour Statuses:</h3>
											{this.state.TAs.map( TA  => (
													<Tag round={true} large={true} style={Tag_s}>
                              { TA.NAME }<br />
															<div style={TagContent_s}>
                                  <div>
                                  {TA.COURSE_NAME}
                                  </div>
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
                              <div style={TagContent_sColumn}>
                              {TA.STATUS}
                              </div>
													</Tag>
											))}
            </div>
        )
    }
}
