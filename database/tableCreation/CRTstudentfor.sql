drop table studentfor cascade constraints;

create table studentfor(
    netid varchar2(16) not null,
    course_id number(6) not null,
    CONSTRAINT pk_studentfor PRIMARY KEY (netid, course_id),
    CONSTRAINT netid_studentfor_fk
        FOREIGN KEY (netid)
        REFERENCES student (netid),
    CONSTRAINT courseid_studentfor_fk
        FOREIGN KEY (course_id)
        REFERENCES course (course_id)
);
