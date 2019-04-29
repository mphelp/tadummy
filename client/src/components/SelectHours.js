import React from 'react';
import {
    FormGroup,
    InputGroup,
    Switch,
    Classes,
    MenuItem,
    Button
} from "@blueprintjs/core";

// Styles
const general_s = {
    margin: 20,
}
const inputName_s = {
    maxWidth: 300,
}

export default class extends React.Component {
    state = {
        label: true,
        labelInfo: true,
        course: Courses[1],
    };

    handleSelectClick = (course) => {
        this.setState(state => ({ course: course }))
    }
    itemRenderer = (item, { handleClick, isActive }) => (
        <MenuItem
            className={ isActive ? Classes.ACTIVE : "" }
            key={item.crn}
            label={item.title}
            text={item.teacher}
            onClick={handleClick}
        />
    )
    render(){
        const {
            label,
            labelInfo,
            course
        } = this.state

        return (
            <div style={general_s}>
                <FormGroup
                    label={label && "Name"}
                    labelInfo={labelInfo && "(required)"}
                >
                    <InputGroup
                        id="inputName"
                        placeholder="Your name here..."
                        style={inputName_s}
                    />
                </FormGroup>
                <FormGroup>
                    <Switch id="stud" label="Student"/>
                    <Switch id="prof" label="Professor"/>
                </FormGroup>
                <Select
                    items={Courses}
                    itemRenderer={this.itemRenderer}
                    onItemSelect={this.handleSelectClick}
                >
                    <Button rightIcon="caret-down"
                        text={course ? course.title : "(No selection)" }
                    />
                </Select>
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
    <Button rightIcon="caret-down"
        text={course ? course.title : "(No selection)" }
    />
</Select>


*/
