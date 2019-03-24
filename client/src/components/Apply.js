import React from 'react';
import {
    FormGroup,
    InputGroup,
    Switch,
    Classes,
    MenuItem,
    Button
} from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";
import * as Courses from './courses';


export default class extends React.Component {
    state = {
        label: true,
        labelInfo: true,
        course: Courses[0],
    };

    handleValueChange = (item) => console.log(item);
    renderSelectItem = ({ handleClick, item, isActive }) => (
        <MenuItem
            className={ isActive ? Classes.ACTIVE : "" }
            key={item.crn}
            label={item.course}
            onClick={handleClick}
            text={item.teacher}
        />
    )
    render(){
        const {
            label,
            labelInfo,
            course
        } = this.state

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
            </div>
        )
    }
}
/*
<Select
    items={Courses}
    onItemSelect={this.handleValueChange}
    itemRenderer={this.renderSelectItem}
>
    <Button rightIconName="caret-down"
        text={course ? course.title : "(No selection)" }
    />
</Select>


*/
