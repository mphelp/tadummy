drop table proffor cascade constraints;

create table proffor(
    netid varchar2(16) not null,
    course_id number(6) not null,
    avail_id number(3) not null,
    status varchar2(40),
    CONSTRAINT pk_proffor PRIMARY KEY (netid, course_id),
    CONSTRAINT netid_proffor_fk
        FOREIGN KEY (netid)
        REFERENCES professor (netid),
    CONSTRAINT courseid_proffor_fk
        FOREIGN KEY (course_id)
        REFERENCES course (course_id),
    CONSTRAINT availid_proffor_fk
        FOREIGN KEY (avail_id)
        REFERENCES availability (avail_id)
);
