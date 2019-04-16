drop table departmentofferscourse cascade constraints;

create table departmentofferscourse(
    department_id number(3) not null,
    course_id number(6) not null,
    CONSTRAINT pk_deptofferscourse PRIMARY KEY (department_id, course_id),
    CONSTRAINT departmentid_offerscourse_fk
        FOREIGN KEY (department_id)
        REFERENCES department (department_id),
    CONSTRAINT courseid_deptofferscourse_fk
        FOREIGN KEY (course_id)
        REFERENCES course (course_id)
);
