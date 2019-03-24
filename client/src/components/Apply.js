import React from 'react';
import {
    FormGroup,
    InputGroup,
    Switch
} from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";

export default class extends React.Component {
    state = {
        label: true,
        labelInfo: true
    }
    render(){
        const { label, labelInfo } = this.state

        return (
            <div style={{ margin: 20 }}>
                <FormGroup
                    label={label && "Name"}
                    labelInfo={labelInfo && "(required)"}
                >
                    <InputGroup
                        id="input1"
                        placeholder="Your name here..."
                        style={{ maxWidth: 300 }}
                    />
                </FormGroup>
                <FormGroup>
                    <Switch id="stud" label="Student"/>
                    <Switch id="prof" label="Professor"/>
                </FormGroup>
                <Select>
                    hi
                </Select>
            </div>
        )
    }
}
