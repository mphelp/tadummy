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
		float: "right"
}
const header_s = {
    margin: 20,
}
export default class extends React.Component {
    render(){
        return (
            <div style={SidebarGeneral_s}>
                <header style={header_s}>Statuses go here:</header>
                    {TAs.map( name  => (
												<Tag round='True'>
														Prof
														<status-indicator active pulse multiline='True'
																style={Status_s}
														/>
												</Tag>		
                    ))}
            </div>
        )
    }
}
