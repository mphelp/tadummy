import React from 'react';
import { Link } from 'react-router-dom';
import {
    FormGroup,
    InputGroup,
    Switch
} from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";
import { Example } from "@blueprintjs/docs-theme";

export default class extends React.Component {
    state = {
        label: true,
        labelInfo: true
    }
    render(){
        const { label, requiredLabel } = this.state

        return (
            <Example>
                <FormGroup
                    label={label && "Name"}
                    labelInfo={labelInfo && "(required)"}
                >
                    <InputGroup id="input1"placeholder="Your name here..."/>
                </FormGroup>
                <FormGroup>
                    <Switch id="stud" label="Student"/>
                    <Switch id="prof" label="Professor"/>
                </FormGroup>
        )
    }
}
