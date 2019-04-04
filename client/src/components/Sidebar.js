import React from 'react'
import { Switch } from '@blueprintjs/core'
import TAs from './TAs'

// CSS
import 'status-indicator/styles.css'

const SidebarGeneral_s = {
    overflow: "auto",
    poxition: "fixed",
    height: "100%",
    backgroundColor: "#a1a1a1",
    width: "20%",
    minWidth: "200px",
    display: "flex",
    flexDirection: "column",
}
const header_s = {
    margin: 20,
}
export default class extends React.Component {
    render(){
        return (
            <div style={SidebarGeneral_s}>
                <header style={header_s}>Statuses go here:</header>
                    {TAs.map( name  =>
                        <status-indicator></status-indicator>
                    )}
            </div>
        )
    }
}
