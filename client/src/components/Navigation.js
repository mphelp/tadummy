import React from 'react';
import { Link } from 'react-router-dom';
import {
    Alignment,
    AnchorButton,
    Classes,
    Navbar,
    NavbarGroup,
    NavbarHeading,
    NavbarDivider,
} from "@blueprintjs/core";

export default class extends React.PureComponent {
    render(){
        return (
            <Navbar className={Classes.DARK}>
                <NavbarGroup align={Alignment.LEFT}>
                    <NavbarHeading>TAdummy</NavbarHeading>
                    <NavbarDivider />
                    <Link to="/" style={{ textDecoration: "none" }}>
                        <AnchorButton text="HOME" rightIcon="home"/>
                    </Link>
                    <Link to="/apply" style={{ textDecoration: "none" }}>
                        <AnchorButton text="APPLY" rightIcon="applications"/>
                    </Link>
                </NavbarGroup>
            </Navbar>
        )
    }
}
