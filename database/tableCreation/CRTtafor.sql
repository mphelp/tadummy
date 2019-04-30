drop table tafor cascade constraints;

create table tafor(
    netid varchar2(16) not null,
    course_id number(6) not null,
    avail_id number(3) not null,
    status varchar2(40),
    CONSTRAINT pk_tafor PRIMARY KEY (netid, course_id),
    CONSTRAINT netid_tafor_fk
        FOREIGN KEY (netid)
        REFERENCES student (netid),
    CONSTRAINT courseid_tafor_fk
        FOREIGN KEY (course_id)
        REFERENCES course (course_id),
    CONSTRAINT availid_tafor_fk
        FOREIGN KEY (avail_id)
        REFERENCES availability (avail_id)
);
