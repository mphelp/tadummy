drop table applicationsubmission cascade constraints;

create table applicationsubmission(
    netid varchar2(16) not null,
    course_id number(6) not null,
    resume varchar2(100),
    submittedDate timestamp,
    CONSTRAINT pk_submission PRIMARY KEY (netid, course_id),
    CONSTRAINT netid_submission_fk
        FOREIGN KEY (netid)
        REFERENCES student (netid),
    CONSTRAINT courseid_submission_fk
        FOREIGN KEY (course_id)
        REFERENCES course (course_id)
);
