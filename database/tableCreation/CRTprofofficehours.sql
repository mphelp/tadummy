drop table profofficehours cascade constraints;

create table profofficehours(
    timeblock_id number(4) not null,
    netid varchar2(16) not null,
    course_id number(6) not null,
    CONSTRAINT pk_poh PRIMARY KEY (timeblock_id, netid, course_id),
    CONSTRAINT timeblockid_poh_fk
        FOREIGN KEY (timeblock_id)
        REFERENCES timeblock (timeblock_id),
    CONSTRAINT netid_poh_fk
        FOREIGN KEY (netid)
        REFERENCES professor (netid),
    CONSTRAINT courseid_poh_fk
        FOREIGN KEY (course_id)
        REFERENCES course (course_id)
);
