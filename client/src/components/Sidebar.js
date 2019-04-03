import React from 'react'

const SidebarGeneral_s = {
    overflow: "auto",
    poxition: "fixed",
    height: "100%",
    backgroundColor: "#919191",
    width: "20%",
    minWidth: "200px"
}
export default class extends React.Component {
    render(){
        return (
            <div style={SidebarGeneral_s}>
                Statuses go here
            </div>
        )
    }
}
