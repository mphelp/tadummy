drop table applicationprocess cascade constraints;

create table applicationprocess(
    course_id number(6) PRIMARY KEY,
    deadline timestamp,
    CONSTRAINT courseid_app_process_fk
        FOREIGN KEY (course_id)
        REFERENCES course (course_id)
);
