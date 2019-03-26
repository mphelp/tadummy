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
// import * as Courses from './courses';

const Courses = [
    {
        title: 'Systems Programming',
        crn: 12345,
        teacher: 'Peter Bui',
        year: 2019,
    },
    {
        title: 'Theory of Computing',
        crn: 10001,
        teacher: 'Corey Pennycuff',
        year: 2019,
    },
    {
        title: 'Logic Design',
        crn: 22022,
        teacher: 'Jay Brockman',
        year: 2018,
    },
    {
        title: 'Fundamentals of Computing',
        crn: 40000,
        teacher: 'Ramzi Bualuan',
        year: 2017,
    },
]

export default class extends React.Component {
    state = {
        label: true,
        labelInfo: true,
        course: Courses[0],
    };

    handleClick = (item) => console.log(item.crn + ' class selected');
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
                <Select
                    items={Courses}
                    itemRenderer={this.itemRenderer}
                    onItemSelect={this.handleClick}
                >
                    <Button rightIconName="caret-down"
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
    <Button rightIconName="caret-down"
        text={course ? course.title : "(No selection)" }
    />
</Select>


*/
