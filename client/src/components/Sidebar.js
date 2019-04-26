import React from 'react'
import { Tag } from '@blueprintjs/core'
import TAs from './TAs'

// CSS
import 'status-indicator/styles.css'

const SidebarGeneral_s = {
    overflow: "auto",
    poxition: "fixed",
    height: "100%",
    backgroundColor: "#e1e1f1",
    width: "20%",
    minWidth: "200px",
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
const Tag_s = {
		margin: 5,
}
export default class extends React.Component {
    render(){
        return (
            <div style={SidebarGeneral_s}>
									<h3 style={header_s}>Statuses go here:</h3>
											{TAs.map( TA  => (
													<Tag round={true} large={true} style={Tag_s}>
															<div style={TagContent_s}>
																	{ TA.name }
																	<div>
																			{ (() => {
																				if(TA.active) {
																					return (
																						<status-indicator active pulse multiline='True'
																								style={Status_s}
																						/>
																					)
																				} else if (TA.busy){
																					return (
																						<status-indicator negative pulse multiline='True'
																								style={Status_s}
																						/>
																					)
																				} else {
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
													</Tag>		
											))}
            </div>
        )
    }
}
